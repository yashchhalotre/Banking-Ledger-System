import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Landmark } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try { await login(form); navigate('/dashboard') } catch (err) { toast.error(err.response?.data?.message || 'Login failed') } finally { setLoading(false) }
  }
  return <div className="auth-page"><form className="auth-card" onSubmit={submit}><div className="brand auth-brand"><span><Landmark size={20}/></span> Nexora</div><h1>Welcome back</h1><p>Login to your digital banking dashboard.</p><input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button className="primary-btn full" disabled={loading}>{loading?'Signing in...':'Login'}</button><small>New here? <Link to="/register">Create account</Link></small></form></div>
}
