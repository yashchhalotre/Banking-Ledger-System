import api from './client'

export const getTransactions = () => api.get('/transactions')
export const transferMoney = (payload) => api.post('/transactions', payload)
export const addInitialFunds = (payload) => api.post('/transactions/system/initial-funds', payload)
