import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner, FloatingInput } from '../ui'
import toast from 'react-hot-toast'

function AuthLayout({ children, title, sub }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
      {/* Background gradient orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.08, pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.06, pointerEvents: 'none', filter: 'blur(50px)' }} />

      <div style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)' }}>⇄</div>
            <span style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 22, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>SKILIO</span>
          </div>
          <h1 style={{ color: 'var(--text-main)', fontSize: 22, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-heading)' }}>{title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>{sub}</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          {children}
        </div>

        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 20, fontSize: 12, fontWeight: 500 }}>
          © 2026 SKILIO Inc. · <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Retour à l'accueil</Link>
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
      toast.success(`Bienvenue, ${user.name} !`)
      if (user.role === 'super_admin')   navigate('/super')
      else if (user.role === 'tenant_admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Échec de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Connectez-vous à votre compte" sub="Entrez vos identifiants pour continuer">
      <form onSubmit={handleSubmit}>
        <FloatingInput
          label="Email universitaire"
          id="email"
          type="email"
          required
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <FloatingInput
          label="Mot de passe"
          id="password"
          type="password"
          required
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12, borderRadius: 10, fontSize: 14, marginTop: 8 }} disabled={loading}>
          {loading ? <Spinner size={18} /> : 'Se connecter →'}
        </button>
      </form>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 24, fontSize: 13, fontWeight: 500 }}>
        Pas encore de compte ?{' '}
        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Inscrivez-vous avec votre email scolaire</Link>
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
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    try {
      const user = await register(form)
      toast.success('Compte créé ! Veuillez vérifier votre email.')
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).forEach(msgs => msgs.forEach(m => toast.error(m)))
      } else {
        toast.error(err.response?.data?.message || 'Échec de l\'inscription')
      }
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <AuthLayout title="Créer votre compte" sub="Rejoignez la communauté SKILIO de votre université">
      <form onSubmit={handleSubmit}>
        {[
          { key: 'name',                  label: 'Nom complet',        type: 'text' },
          { key: 'email',                 label: 'Email universitaire', type: 'email' },
          { key: 'password',              label: 'Mot de passe',         type: 'password' },
          { key: 'password_confirmation', label: 'Confirmer le mot de passe', type: 'password' },
        ].map(field => (
          <FloatingInput
            key={field.key}
            id={field.key}
            label={field.label}
            type={field.type}
            required
            value={form[field.key]}
            onChange={set(field.key)}
          />
        ))}
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12, borderRadius: 10, fontSize: 14, marginTop: 8 }} disabled={loading}>
          {loading ? <Spinner size={18} /> : 'Créer un compte →'}
        </button>
      </form>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 24, fontSize: 13, fontWeight: 500 }}>
        Vous avez déjà un compte ? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Connexion</Link>
      </p>
    </AuthLayout>
  )
}
