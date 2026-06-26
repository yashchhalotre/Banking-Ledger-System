import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { CheckCircle2, Copy, PlusCircle, Send } from 'lucide-react'
import Shell from '../components/Shell'
import { getAccountBalance, getAccounts } from '../api/accountApi'
import { transferMoney } from '../api/transactionApi'
import { formatMoney, makeKey, shortId } from '../utils/format'

export default function Transfer() {
  const [accounts, setAccounts] = useState([])
  const [balances, setBalances] = useState({})
  const [form, setForm] = useState({ fromAccount:'', toAccount:'', amount:'' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const accs = (await getAccounts()).data.accounts || []
    setAccounts(accs)
    const list = await Promise.all(accs.map(async a => [a._id, (await getAccountBalance(a._id)).data.balance]))
    setBalances(Object.fromEntries(list))
  }

  useEffect(() => { load().catch(() => toast.error('Failed to load accounts')) }, [])

  const selected = useMemo(() => accounts.find(a => a._id === form.fromAccount), [accounts, form.fromAccount])

  const copyId = async (id) => {
    await navigator.clipboard.writeText(id)
    toast.success('Account ID copied')
  }

  const submit = async e => {
    e.preventDefault()
    if (!form.fromAccount) return toast.error('Select sender account')
    if (!form.toAccount) return toast.error('Enter receiver account ID')
    if (form.fromAccount === form.toAccount) return toast.error('Sender and receiver cannot be same')
    if (Number(form.amount) <= 0) return toast.error('Enter valid amount')

    setLoading(true)
    try {
      await transferMoney({ ...form, amount:Number(form.amount), idempotencyKey:makeKey() })
      toast.success('Transaction started')
      setForm({ fromAccount:'', toAccount:'', amount:'' })
      load()
    } catch(err) {
      toast.error(err.response?.data?.message || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell>
      <div className="form-page">
        <div className="page-head">
          <div>
            <p>Secure Transfer</p>
            <h1>Select sender and send money</h1>
          </div>
        </div>

        {accounts.length === 0 && (
          <div className="empty big transfer-empty">
            <PlusCircle size={36}/>
            <h2>No account found</h2>
            <p>First create an account, then add funds, then you can transfer money.</p>
            <Link to="/accounts/create" className="primary-btn">Create Account</Link>
          </div>
        )}

        <form className="premium-form" onSubmit={submit}>
          <label>Choose Sender Account</label>
          <div className="account-picker">
            {accounts.map(account => (
              <button
                type="button"
                key={account._id}
                className={`pick-card ${form.fromAccount === account._id ? 'active' : ''}`}
                onClick={() => setForm({ ...form, fromAccount: account._id })}
              >
                <small>{shortId(account._id)}</small>
                <b>{formatMoney(balances[account._id])}</b>
                <div className="copy-id">Status: {account.status}</div>
              </button>
            ))}
          </div>

          {selected && <div className="selected-chip"><CheckCircle2 size={18}/> Sender selected: {shortId(selected._id)}</div>}

          <label>
            Receiver Account ID
            <input placeholder="Paste receiver account ID here" value={form.toAccount} onChange={e=>setForm({...form,toAccount:e.target.value.trim()})}/>
          </label>

          <div className="receiver-help">
            To test transfer between your own accounts, copy another account ID from Accounts page and paste it here.
          </div>

          <label>
            Amount
            <input type="number" min="1" placeholder="₹ 0.00" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
          </label>

          {accounts.length > 0 && (
            <button type="button" className="secondary-btn" onClick={() => copyId(accounts[0]._id)}>
              <Copy size={18}/> Copy first account ID
            </button>
          )}

          <button className="primary-btn full" disabled={loading}><Send size={18}/>{loading?'Processing...':'Send Money'}</button>
          <p className="hint">Note: backend may take around 15 seconds while completing ledger entries.</p>
        </form>
      </div>
    </Shell>
  )
}
