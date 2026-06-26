import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Bell, CreditCard, LockKeyhole, Send, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function Landing() {
  return (
    <div className="landing">
      <Navbar />
      <section className="hero">
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.7}} className="hero-copy">
          <div className="eyebrow"><Sparkles size={16}/> Digital banking for modern money</div>
          <h1>Banking that feels <span>fast, clear and secure.</span></h1>
          <p>Nexora helps you create accounts, add funds, send money and track every ledger-backed transaction from one polished dashboard.</p>
          <div className="hero-actions">
            <Link to="/register" className="primary-btn">Open free account <ArrowRight size={18}/></Link>
            <Link to="/login" className="secondary-btn">Sign in</Link>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} transition={{duration:.8,delay:.15}} className="hero-visual">
          <div className="orbit one" />
          <div className="orbit two" />
          <div className="floating-card">
            <span>Nexora Blue Card</span>
            <h3>₹86,420</h3>
            <p>4921  ••••  ••••  2036</p>
          </div>
          <div className="mini-panel panel-one"><Bell/><div><small>Instant alert</small><b>₹4,500 received</b></div></div>
          <div className="mini-panel panel-two"><BadgeCheck/><div><small>Ledger verified</small><b>Transfer complete</b></div></div>
        </motion.div>
      </section>

      <section id="features" className="feature-grid">
        <div className="feature"><CreditCard/><h3>Create accounts</h3><p>Open a new INR account instantly and use it for deposits and transfers.</p></div>
        <div className="feature"><Send/><h3>Transfer money</h3><p>Select your sender account, paste receiver account ID and send securely.</p></div>
        <div className="feature"><LockKeyhole/><h3>JWT security</h3><p>Protected routes, token auth and cookie support keep the user session safe.</p></div>
        <div className="feature"><BadgeCheck/><h3>Ledger history</h3><p>Every debit and credit is tracked through transaction history and balance APIs.</p></div>
      </section>
    </div>
  )
}
