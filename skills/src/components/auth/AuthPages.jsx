import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner, FloatingInput } from '../ui'
import toast from 'react-hot-toast'

function AuthLayout({ children, title, sub }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#070c09',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Green orb */}
      <div style={{
        position: 'absolute', top: '8%', left: '18%',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, #1D9E75 0%, transparent 70%)',
        opacity: 0.1, pointerEvents: 'none', filter: 'blur(40px)',
      }} />
      {/* Purple orb */}
      <div style={{
        position: 'absolute', bottom: '10%', right: '18%',
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
        opacity: 0.08, pointerEvents: 'none', filter: 'blur(40px)',
      }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #1D9E75, #EF9F27)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: '#fff',
            }}>⇄</div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 26, fontFamily: 'var(--font-sans)', letterSpacing: '-0.5px' }}>SKILIO</span>
            <span style={{
              background: 'rgba(29,158,117,0.18)', color: '#1D9E75',
              fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20,
              border: '1px solid rgba(29,158,117,0.3)', letterSpacing: '0.5px',
            }}>SaaS</span>
          </div>
          <h1 style={{
            color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 8,
            fontFamily: 'Georgia, serif', letterSpacing: '-0.5px',
          }}>{title}</h1>
          <p style={{ color: '#5a7a6a', fontSize: 15 }}>{sub}</p>
        </div>

        <div className="card" style={{ padding: 36, borderRadius: 18, border: '1px solid #1e2b24', background: '#111814' }}>
          {children}
        </div>

        <p style={{ color: '#5a7a6a', textAlign: 'center', marginTop: 24, fontSize: 13 }}>
          © 2026 SKILIO Inc. ·{' '}
          <Link to="/" style={{ color: '#1D9E75', fontWeight: 700, textDecoration: 'none' }}>
            Retour à l'accueil
          </Link>
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
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 15, marginTop: 10, background: 'linear-gradient(135deg,#1D9E75,#0F6E56)' }} disabled={loading}>
          {loading ? <Spinner size={20} /> : 'Se connecter →'}
        </button>
      </form>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 32, fontSize: 14, fontWeight: 500 }}>
        Pas encore de compte ?{' '}
        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Inscrivez-vous avec votre email scolaire</Link>
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
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 15, marginTop: 10, background: 'linear-gradient(135deg,#1D9E75,#0F6E56)' }} disabled={loading}>
          {loading ? <Spinner size={20} /> : 'Créer un compte →'}
        </button>
      </form>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 32, fontSize: 14, fontWeight: 500 }}>
        Vous avez déjà un compte ? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Connexion</Link>
      </p>
    </AuthLayout>
  )
}
