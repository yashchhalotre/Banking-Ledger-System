const { Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const transactionController = require('../controllers/transaction.controller');

const transactionRoutes = Router();

// GET /api/transactions
transactionRoutes.get('/', authMiddleware.authMiddleware, transactionController.getTransactions);

// POST /api/transactions
transactionRoutes.post('/', authMiddleware.authMiddleware, transactionController.createTransaction);

// POST /api/transactions/system/initial-funds
transactionRoutes.post('/system/initial-funds', authMiddleware.authMiddleware, transactionController.createInitialFundsTransaction);

module.exports = transactionRoutes;
