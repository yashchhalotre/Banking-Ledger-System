import api from './client'

export const registerUser = (payload) => api.post('/auth/register', payload)
export const loginUser = (payload) => api.post('/auth/login', payload)
export const logoutUser = () => api.post('/auth/logout')
export const getMe = () => api.get('/auth/me')
