import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Landmark, Plus, ShieldCheck, WalletCards } from 'lucide-react'
import Shell from '../components/Shell'
import { createAccount } from '../api/accountApi'

export default function CreateAccount() {
  const [loading, setLoading] = useState(false)
  const [createdAccount, setCreatedAccount] = useState(null)
  const navigate = useNavigate()

  const handleCreate = async () => {
    setLoading(true)
    try {
      const response = await createAccount()
      setCreatedAccount(response.data.account)
      toast.success('New account created successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell>
      <div className="form-page create-account-page">
        <div className="page-head">
          <div>
            <p>Create Account</p>
            <h1>Open a new Nexora account</h1>
          </div>
          <Link to="/accounts" className="secondary-btn">
            <ArrowLeft size={18} /> Back
          </Link>
        </div>

        <div className="create-account-hero">
          <div className="create-icon"><Landmark size={34} /></div>
          <h2>Create your Nexora INR account</h2>
          <p>
            This will create a secure ACTIVE account connected to your logged-in user.
            After creating it, you can add demo funds and transfer money.
          </p>

          <div className="create-benefits">
            <span><ShieldCheck size={18} /> Ledger protected</span>
            <span><WalletCards size={18} /> INR currency</span>
            <span><Plus size={18} /> Instant creation</span>
          </div>

          <button onClick={handleCreate} disabled={loading} className="primary-btn full create-btn">
            <Plus size={18} /> {loading ? 'Creating...' : 'Create New Account'}
          </button>
        </div>

        {createdAccount && (
          <div className="created-box">
            <small>Account Created</small>
            <h3>{createdAccount._id}</h3>
            <p>Status: <b>{createdAccount.status}</b> · Currency: <b>{createdAccount.currency}</b></p>
            <div className="created-actions">
              <button onClick={() => navigate('/deposit')} className="primary-btn">Add Funds</button>
              <button onClick={() => navigate('/transfer')} className="secondary-btn">Transfer Money</button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}
