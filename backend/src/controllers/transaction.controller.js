const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const accountModel = require('../models/account.model')
const emailService = require('../services/email.service')
const mongoose = require('mongoose')

// POST /api/transactions
// Transfer money from logged-in owner's account to another account.
async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: 'fromAccount, toAccount, amount and idempotencyKey are required' })
  }

  if (Number(amount) <= 0) {
    return res.status(400).json({ message: 'Amount must be greater than 0' })
  }

  const existing = await transactionModel.findOne({ idempotencyKey })
  if (existing) {
    return res.status(200).json({ message: 'Transaction already processed', transaction: existing })
  }

  // Sender must belong to logged-in owner
  const fromUserAccount = await accountModel.findOne({ _id: fromAccount, user: req.user._id })
  const toUserAccount = await accountModel.findOne({ _id: toAccount })

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({ message: 'Invalid sender or receiver account' })
  }

  if (fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') {
    return res.status(400).json({ message: 'Both accounts must be ACTIVE' })
  }

  const balance = await fromUserAccount.getBalance()
  if (balance < Number(amount)) {
    return res.status(400).json({ message: `Insufficient balance. Current balance is ${balance}` })
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const transaction = (await transactionModel.create([{
      fromAccount,
      toAccount,
      amount: Number(amount),
      idempotencyKey,
      status: 'PENDING'
    }], { session }))[0]

    await ledgerModel.create([{
      account: fromAccount,
      amount: Number(amount),
      transaction: transaction._id,
      type: 'DEBIT'
    }], { session })

    await ledgerModel.create([{
      account: toAccount,
      amount: Number(amount),
      transaction: transaction._id,
      type: 'CREDIT'
    }], { session })

    transaction.status = 'COMPLETED'
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

    return res.status(201).json({ message: 'Transaction completed successfully', transaction })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return res.status(500).json({ message: 'Transaction failed', error: error.message })
  }
}

// GET /api/transactions
// Show all debited/credited transactions for logged-in owner.
async function getTransactions(req, res) {
  try {
    const userAccounts = await accountModel.find({ user: req.user._id })
    const accountIds = userAccounts.map(account => account._id)

    const transactions = await transactionModel
      .find({
        $or: [
          { fromAccount: { $in: accountIds } },
          { toAccount: { $in: accountIds } }
        ]
      })
      .sort({ createdAt: -1 })

    return res.status(200).json({ count: transactions.length, transactions })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch transactions' })
  }
}

// POST /api/transactions/system/initial-funds
// Add money to owner's own account. This creates ONLY CREDIT ledger entry.
async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: 'toAccount, amount and idempotencyKey are required' })
  }

  if (Number(amount) <= 0) {
    return res.status(400).json({ message: 'Amount must be greater than 0' })
  }

  const existing = await transactionModel.findOne({ idempotencyKey })
  if (existing) {
    return res.status(200).json({ message: 'Funds already added', transaction: existing })
  }

  // Owner can add money only to his/her own account
  const toUserAccount = await accountModel.findOne({ _id: toAccount, user: req.user._id })
  if (!toUserAccount) {
    return res.status(400).json({ message: 'Invalid owner account' })
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // fromAccount is kept same as toAccount because your transaction model requires fromAccount.
    // Balance will still increase because ledger has ONLY CREDIT, no DEBIT.
    const transaction = (await transactionModel.create([{
      fromAccount: toAccount,
      toAccount,
      amount: Number(amount),
      idempotencyKey,
      status: 'COMPLETED'
    }], { session }))[0]

    await ledgerModel.create([{
      account: toAccount,
      amount: Number(amount),
      transaction: transaction._id,
      type: 'CREDIT'
    }], { session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({ message: 'Money added successfully', transaction })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return res.status(500).json({ message: 'Failed to add funds', error: error.message })
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  createInitialFundsTransaction
}
