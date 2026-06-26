import { Mail, UserRound } from 'lucide-react'
import Shell from '../components/Shell'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  return <Shell><div className="page-head"><div><p>Profile</p><h1>Personal details</h1></div></div><div className="profile-card"><div className="profile-avatar">{user?.name?.charAt(0)}</div><h2>{user?.name}</h2><p>{user?.email}</p><div className="profile-info"><span><UserRound/> User ID</span><b>{user?._id}</b></div><div className="profile-info"><span><Mail/> Email</span><b>{user?.email}</b></div></div></Shell>
}
