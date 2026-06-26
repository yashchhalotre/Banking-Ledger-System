# Nexora Bank Frontend

Modern React + JavaScript banking frontend for your ledger-based backend.

## Features

- Register bank account owner
- Login owner
- Create bank account
- Add money to owner account
- Check total balance on dashboard
- Transfer money from one account to another
- Show transaction history with CREDIT and DEBIT labels
- Show added funds as Money Added / CREDIT
- Logout

## Important Backend Updates

Copy files from `backend-update/` into your backend project:

```bash
backend-update/transaction.controller.js -> controllers/transaction.controller.js
backend-update/transaction.routes.js     -> routes/transaction.routes.js
```

The fixed `createInitialFundsTransaction` creates only one CREDIT ledger entry. That means when the owner adds money, balance increases correctly.

## Install Frontend

```bash
npm install
npm run dev
```

## Backend URL

Create `.env`:

```bash
VITE_API_URL=http://localhost:3000/api
```

## Correct Flow

1. Register
2. Login
3. Create Account
4. Add Money
5. Check Dashboard Balance
6. Transfer Money
7. Check Transactions

## Backend APIs Used

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

POST /api/accounts
GET  /api/accounts
GET  /api/accounts/balance/:accountId

GET  /api/transactions
POST /api/transactions
POST /api/transactions/system/initial-funds
```
