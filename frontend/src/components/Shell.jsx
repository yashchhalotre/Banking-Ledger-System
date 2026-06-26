import { NavLink, useNavigate } from 'react-router-dom'
import { Banknote, CreditCard, Home, Landmark, LogOut, PlusCircle, Send, UserRound, WalletCards } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const items = [
  ['Dashboard', '/dashboard', Home],
  ['Accounts', '/accounts', WalletCards],
  ['Create Account', '/accounts/create', PlusCircle],
  ['Transfer', '/transfer', Send],
  ['Deposit', '/deposit', Banknote],
  ['Transactions', '/transactions', CreditCard],
  ['Profile', '/profile', UserRound]
]

export default function Shell({ children }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => { await logout(); navigate('/login') }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand sidebar-brand"><span><Landmark size={20}/></span> Nexora</div>
        <div className="user-pill"><div>{user?.name?.charAt(0) || 'U'}</div><div><b>{user?.name}</b><small>{user?.email}</small></div></div>
        <div className="side-menu">
          {items.map(([label, href, Icon]) => <NavLink key={href} to={href}><Icon size={18}/>{label}</NavLink>)}
        </div>
        <button className="logout" onClick={handleLogout}><LogOut size={18}/> Logout</button>
      </aside>
      <main className="main-area">{children}</main>
    </div>
  )
}
