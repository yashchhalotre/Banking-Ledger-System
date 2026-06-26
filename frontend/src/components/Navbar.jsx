import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, Shield } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="brand"><span><Shield size={20}/></span> Nexora</Link>
      <div className="nav-links">
        <a href="/#features">Features</a>
        <a href="/#security">Security</a>
        <NavLink to="/login">Login</NavLink>
        <Link to="/register" className="nav-cta">Get Started <ArrowRight size={16}/></Link>
      </div>
    </nav>
  )
}
