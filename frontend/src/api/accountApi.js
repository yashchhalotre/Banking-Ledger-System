import api from './client'

export const createAccount = () => api.post('/accounts')
export const getAccounts = () => api.get('/accounts')
export const getAccountBalance = (accountId) => api.get(`/accounts/balance/${accountId}`)
