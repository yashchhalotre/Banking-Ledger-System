import { useEffect, useMemo, useState } from 'react'
import { Link }from 'react-router-dom'
import { CreditCard, Landmark, Send, WalletCards } from 'lucide-react'
import toast from 'react-hot-toast'
import Shell from '../components/Shell'
import StatCard from '../components/StatCard'
import AccountCard from '../components/AccountCard'
import TransactionRow from '../components/TransactionRow'
import { getAccounts, getAccountBalance } from '../api/accountApi'
import { getTransactions } from '../api/transactionApi'
import { useAuth } from '../context/AuthContext'
import { formatMoney } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [balances, setBalances] = useState({})
  const [transactions, setTransactions] = useState([])

  const load = async () => {
    try {
      const accRes = await getAccounts()
      const accs = accRes.data.accounts || []
      setAccounts(accs)
      const list = await Promise.all(accs.map(async a => [a._id, (await getAccountBalance(a._id)).data.balance]))
      setBalances(Object.fromEntries(list))
      try { setTransactions((await getTransactions()).data.transactions || []) } catch {}
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to load dashboard') }
  }
  useEffect(() => { load() }, [])
  const total = useMemo(() => Object.values(balances).reduce((a,b)=>a+Number(b||0),0), [balances])
  const ids = accounts.map(a=>a._id)

  return <Shell><div className="page-head"><div><p>Good day, {user?.name}</p><h1>Your money overview</h1></div><div className="head-actions"><Link to="/accounts/create" className="secondary-btn">Create Account</Link><Link to="/deposit" className="secondary-btn">Add Money</Link><Link to="/transfer" className="primary-btn"><Send size={18}/> Transfer</Link></div></div><div className="dashboard-hero"><div><small>Total Balance</small><h2>{formatMoney(total)}</h2><p>Protected by ledger-based double-entry accounting.</p></div><div className="hero-chip"><Landmark/> ACTIVE</div></div><div className="stats-grid"><StatCard icon={WalletCards} label="Accounts" value={accounts.length} sub="Active wallets"/><StatCard icon={CreditCard} label="Transactions" value={transactions.length} sub="All history"/><StatCard icon={Landmark} label="Currency" value="INR" sub="Default system"/></div><div className="content-grid"><section><div className="section-title"><h2>Accounts</h2><Link to="/accounts">View all</Link></div><div className="cards-grid">{accounts.slice(0,2).map(a=><AccountCard key={a._id} account={a} balance={balances[a._id]}/>)}</div></section><section><div className="section-title"><h2>Recent activity</h2><Link to="/transactions">View all</Link></div><div className="tx-list">{transactions.slice(0,5).map(tx=><TransactionRow key={tx._id} tx={tx} myAccountIds={ids}/>) }{transactions.length===0 && <div className="empty">No transactions yet</div>}</div></section></div></Shell>
}
