import { ArrowDownLeft, ArrowUpRight, PlusCircle } from 'lucide-react'
import { formatMoney, shortId } from '../utils/format'

export default function TransactionRow({ tx, myAccountIds = [] }) {
  const fromId = tx.fromAccount ? String(tx.fromAccount) : ''
  const toId = tx.toAccount ? String(tx.toAccount) : ''
  const isDeposit = fromId === toId && myAccountIds.includes(toId)
  const sent = !isDeposit && myAccountIds.includes(fromId)
  const received = !isDeposit && myAccountIds.includes(toId)

  const title = isDeposit
    ? 'Money Added'
    : sent
      ? 'Money Debited'
      : received
        ? 'Money Credited'
        : 'Transaction'

  return (
    <div className="tx-row">
      <div className={`tx-icon ${sent ? 'sent' : 'received'}`}>
        {isDeposit ? <PlusCircle /> : sent ? <ArrowUpRight /> : <ArrowDownLeft />}
      </div>

      <div className="tx-main">
        <b>{title}</b>
        <small>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'Just now'}</small>
      </div>

      <div className="tx-accounts">
        {isDeposit ? (
          <small>Added to {shortId(toId)}</small>
        ) : (
          <>
            <small>From {shortId(fromId)}</small>
            <small>To {shortId(toId)}</small>
          </>
        )}
      </div>

      <span className={`badge ${tx.status?.toLowerCase()}`}>{tx.status || 'COMPLETED'}</span>
      <strong className={sent ? 'amount-out' : 'amount-in'}>
        {sent ? '-' : '+'}{formatMoney(tx.amount)}
      </strong>
    </div>
  )
}
