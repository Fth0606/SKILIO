import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from '../ui'
import toast from 'react-hot-toast'

function AuthLayout({ children, title, sub }) {
  return (
    <div style={{ minHeight: '100vh', background: '#070c09', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {/* Background orb */}
      <div style={{ position: 'fixed', top: '20%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(29,158,117,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#1D9E75,#EF9F27)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⇄</div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>SkillSwap</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{title}</h1>
          <p style={{ color: '#5a7a6a', fontSize: 14 }}>{sub}</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {children}
        </div>

        <p style={{ color: '#5a7a6a', textAlign: 'center', marginTop: 16, fontSize: 13 }}>
          © 2026 SkillSwap Inc. · <Link to="/" style={{ color: '#1D9E75' }}>Back to home</Link>
        </p>
      </div>
    </div>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form)
      toast.success(`Welcome back, ${user.name}!`)
      if (user.role === 'super_admin')   navigate('/super')
      else if (user.role === 'tenant_admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Sign in to your account" sub="Enter your credentials to continue">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Email address</label>
          <input
            type="email" required className="input-dark"
            placeholder="you@university.edu"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Password</label>
          <input
            type="password" required className="input-dark"
            placeholder="••••••••"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }} disabled={loading}>
          {loading ? <Spinner size={18} /> : 'Sign In →'}
        </button>
      </form>
      <p style={{ color: '#5a7a6a', textAlign: 'center', marginTop: 20, fontSize: 13 }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#1D9E75', fontWeight: 600 }}>Register with your school email</Link>
      </p>
    </AuthLayout>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const user = await register(form)
      toast.success('Account created! Please check your email to verify.')
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).forEach(msgs => msgs.forEach(m => toast.error(m)))
      } else {
        toast.error(err.response?.data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <AuthLayout title="Create your account" sub="Join your university's SkillSwap community">
      <form onSubmit={handleSubmit}>
        {[
          { key: 'name',                  label: 'Full Name',        type: 'text',     ph: 'Your Name' },
          { key: 'email',                 label: 'University Email', type: 'email',    ph: 'you@university.edu' },
          { key: 'password',              label: 'Password',         type: 'password', ph: '••••••••' },
          { key: 'password_confirmation', label: 'Confirm Password', type: 'password', ph: '••••••••' },
        ].map(field => (
          <div key={field.key} style={{ marginBottom: 16 }}>
            <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>{field.label}</label>
            <input type={field.type} required className="input-dark" placeholder={field.ph} value={form[field.key]} onChange={set(field.key)} />
          </div>
        ))}
        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12, marginTop: 8 }} disabled={loading}>
          {loading ? <Spinner size={18} /> : 'Create Account →'}
        </button>
      </form>
      <p style={{ color: '#5a7a6a', textAlign: 'center', marginTop: 20, fontSize: 13 }}>
        Already have an account? <Link to="/login" style={{ color: '#1D9E75', fontWeight: 600 }}>Sign in</Link>
      </p>
    </AuthLayout>
  )
}