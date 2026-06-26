export const formatMoney = (amount = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount || 0))

export const shortId = (id = '') => id ? `${id.slice(0, 6)}...${id.slice(-4)}` : '—'

export const makeKey = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
