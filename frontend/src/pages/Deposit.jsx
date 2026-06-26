import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Banknote, CheckCircle2, PlusCircle, WalletCards } from 'lucide-react'
import Shell from '../components/Shell'
import { getAccountBalance, getAccounts } from '../api/accountApi'
import { addInitialFunds } from '../api/transactionApi'
import { formatMoney, makeKey, shortId } from '../utils/format'

export default function Deposit() {
  const [accounts, setAccounts] = useState([])
  const [balances, setBalances] = useState({})
  const [form, setForm] = useState({ toAccount: '', amount: '' })
  const [lastDeposit, setLastDeposit] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadAccounts = async () => {
    const response = await getAccounts()
    const accountList = response.data.accounts || []
    setAccounts(accountList)

    const balanceList = await Promise.all(
      accountList.map(async account => [
        account._id,
        (await getAccountBalance(account._id)).data.balance
      ])
    )

    setBalances(Object.fromEntries(balanceList))
  }

  useEffect(() => {
    loadAccounts().catch(() => toast.error('Failed to load accounts'))
  }, [])

  const selectedAccount = useMemo(
    () => accounts.find(account => account._id === form.toAccount),
    [accounts, form.toAccount]
  )

  const submit = async event => {
    event.preventDefault()

    if (!form.toAccount) return toast.error('Select owner account')
    if (Number(form.amount) <= 0) return toast.error('Enter valid amount')

    setLoading(true)

    try {
      const payload = {
        toAccount: form.toAccount,
        amount: Number(form.amount),
        idempotencyKey: makeKey()
      }

      const response = await addInitialFunds(payload)
      toast.success('Money added successfully')

      setLastDeposit({
        accountId: form.toAccount,
        amount: Number(form.amount),
        transactionId: response.data.transaction?._id
      })

      setForm({ toAccount: '', amount: '' })
      await loadAccounts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell>
      <div className="form-page">
        <div className="page-head">
          <div>
            <p>Add Money</p>
            <h1>Add money to owner account</h1>
          </div>
          <Link to="/accounts/create" className="secondary-btn">
            <PlusCircle size={18} /> Create Account
          </Link>
        </div>

        {accounts.length === 0 && (
          <div className="empty big transfer-empty">
            <WalletCards size={36} />
            <h2>No account found</h2>
            <p>Create your first bank account before adding money.</p>
            <Link to="/accounts/create" className="primary-btn">Create Account</Link>
          </div>
        )}

        <form className="premium-form" onSubmit={submit}>
          <label>Select Owner Account</label>

          <div className="account-picker">
            {accounts.map(account => (
              <button
                type="button"
                key={account._id}
                className={`pick-card ${form.toAccount === account._id ? 'active' : ''}`}
                onClick={() => setForm({ ...form, toAccount: account._id })}
              >
                <small>{shortId(account._id)}</small>
                <b>{formatMoney(balances[account._id])}</b>
                <div className="copy-id">Status: {account.status}</div>
              </button>
            ))}
          </div>

          {selectedAccount && (
            <div className="selected-chip">
              <CheckCircle2 size={18} /> Selected account: {shortId(selectedAccount._id)}
            </div>
          )}

          <label>
            Amount
            <input
              type="number"
              min="1"
              placeholder="₹ 0.00"
              value={form.amount}
              onChange={event => setForm({ ...form, amount: event.target.value })}
            />
          </label>

          <button className="primary-btn full" disabled={loading || accounts.length === 0}>
            <Banknote size={18} /> {loading ? 'Adding...' : 'Add Money'}
          </button>

          <p className="hint">
            This creates a CREDIT entry only, so your selected account balance increases.
          </p>
        </form>

        {lastDeposit && (
          <div className="created-box success-box">
            <small>Money Added</small>
            <h3>{formatMoney(lastDeposit.amount)}</h3>
            <p>
              Added to account <b>{shortId(lastDeposit.accountId)}</b>. This will appear in transaction history as CREDIT.
            </p>
            <div className="created-actions">
              <Link to="/transactions" className="primary-btn">View History</Link>
              <Link to="/dashboard" className="secondary-btn">Check Balance</Link>
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}
