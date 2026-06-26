import { CreditCard } from 'lucide-react'
import { formatMoney, shortId } from '../utils/format'

export default function AccountCard({ account, balance = 0 }) {
  return (
    <div className="bank-card">
      <div className="card-glow" />
      <div className="bank-card-top"><span>Nexora</span><CreditCard /></div>
      <div className="card-number">•••• •••• {String(account?._id || '').slice(-4)}</div>
      <div className="bank-card-bottom">
        <div><small>Balance</small><b>{formatMoney(balance)}</b></div>
        <div><small>Status</small><b>{account?.status}</b></div>
      </div>
      <p>{shortId(account?._id)}</p>
    </div>
  )
}
