import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Landmark } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try { await register(form); navigate('/dashboard') } catch (err) { toast.error(err.response?.data?.message || 'Register failed') } finally { setLoading(false) }
  }
  return <div className="auth-page"><form className="auth-card" onSubmit={submit}><div className="brand auth-brand"><span><Landmark size={20}/></span> Nexora</div><h1>Create your account</h1><p>Start your premium banking experience.</p><input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button className="primary-btn full" disabled={loading}>{loading?'Creating...':'Create Account'}</button><small>Already have account? <Link to="/login">Login</Link></small></form></div>
}
