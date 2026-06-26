import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Shell from '../components/Shell'
import AccountCard from '../components/AccountCard'
import { createAccount, getAccountBalance, getAccounts } from '../api/accountApi'

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [balances, setBalances] = useState({})
  const load = async () => { const accs=(await getAccounts()).data.accounts||[]; setAccounts(accs); const list=await Promise.all(accs.map(async a=>[a._id,(await getAccountBalance(a._id)).data.balance])); setBalances(Object.fromEntries(list)) }
  useEffect(()=>{load().catch(()=>toast.error('Failed to load accounts'))},[])
  const add = async () => { try { await createAccount(); toast.success('Account created'); load() } catch(e){ toast.error(e.response?.data?.message || 'Failed') } }
  return <Shell><div className="page-head"><div><p>Accounts</p><h1>Your premium cards</h1></div><div className="head-actions"><Link to="/accounts/create" className="primary-btn"><Plus size={18}/> Create Account</Link><Link to="/deposit" className="secondary-btn">Add Money</Link><button onClick={add} className="secondary-btn"><Plus size={18}/> Quick Create</button></div></div><div className="cards-grid wide">{accounts.map(a=><AccountCard key={a._id} account={a} balance={balances[a._id]}/>)}</div>{accounts.length===0 && <div className="empty big">No account yet. Create your first account.</div>}</Shell>
}
