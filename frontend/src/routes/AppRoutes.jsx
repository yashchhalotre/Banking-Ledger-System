import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Accounts from '../pages/Accounts'
import CreateAccount from '../pages/CreateAccount'
import Transfer from '../pages/Transfer'
import Deposit from '../pages/Deposit'
import Transactions from '../pages/Transactions'
import Profile from '../pages/Profile'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading Nexora...</div>
  return user ? children : <Navigate to="/login" replace />
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading Nexora...</div>
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/accounts" element={<Protected><Accounts /></Protected>} />
      <Route path="/accounts/create" element={<Protected><CreateAccount /></Protected>} />
      <Route path="/transfer" element={<Protected><Transfer /></Protected>} />
      <Route path="/deposit" element={<Protected><Deposit /></Protected>} />
      <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
