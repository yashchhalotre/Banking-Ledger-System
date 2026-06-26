import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Shell from '../components/Shell'
import TransactionRow from '../components/TransactionRow'
import { getAccounts } from '../api/accountApi'
import { getTransactions } from '../api/transactionApi'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [ids, setIds] = useState([])
  useEffect(()=>{(async()=>{try{const acc=(await getAccounts()).data.accounts||[]; setIds(acc.map(a=>a._id)); setTransactions((await getTransactions()).data.transactions||[])}catch(e){toast.error('Failed to load transactions')}})()},[])
  return <Shell><div className="page-head"><div><p>History</p><h1>Transaction timeline</h1></div></div><div className="tx-list large">{transactions.map(tx=><TransactionRow key={tx._id} tx={tx} myAccountIds={ids}/>) }{transactions.length===0 && <div className="empty big"></div>}</div></Shell>
}
