import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications, useMarkAllNotificationsRead } from '../../hooks/useApi'
import { Avatar, Modal, Spinner, Badge, Logo } from '../ui'

// ─── Theme Toggle ────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        fontSize: 16,
        width: 36,
        height: 36,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'border-color 0.2s, color 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = '#fff' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}

// ─── Navbar (landing) ────────────────────────────────────────────────────────
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: scrolled ? 'rgba(8, 14, 10, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 2rem',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 68,
      }}>
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Logo size={34} withText />
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[
            { label: 'Fonctionnalités', hash: 'features' },
            { label: 'Tarifs',          hash: 'pricing' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(`/#${item.hash}`)}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.7)',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >{item.label}</button>
          ))}

          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 8px' }} />

          <ThemeToggle />

          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
              style={{ marginLeft: 8, padding: '10px 22px', fontSize: 14 }}
            >
              Tableau de bord →
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid var(--border)',
                  padding: '9px 18px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  marginLeft: 8,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-primary"
                style={{ marginLeft: 8, padding: '10px 22px', fontSize: 14 }}
              >
                Commencer gratuitement →
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

// ─── AppShell (authenticated) ────────────────────────────────────────────────
export function AppShell({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { data: notifications, isLoading: notifLoading } = useNotifications()
  const markAllRead = useMarkAllNotificationsRead()
  const [notifOpen, setNotifOpen] = useState(false)

  const unreadCount = (notifications || []).filter(n => !n.is_read).length

  const studentLinks = [
    { to: '/dashboard',          icon: '⊞',  label: 'Tableau de bord' },
    { to: '/dashboard/search',   icon: '⊕',  label: 'Trouver une compétence' },
    { to: '/dashboard/sessions', icon: '◷',  label: 'Mes séances' },
    { to: '/dashboard/teach',    icon: '◈',  label: 'Enseigner' },
    { to: '/dashboard/ratings',  icon: '◇',  label: 'Mes évaluations' },
    { to: '/dashboard/credits',  icon: '◈',  label: 'Crédits' },
  ]

  const adminLinks = [
    { to: '/admin',              icon: '⊞',  label: 'Analytiques' },
    { to: '/admin/users',        icon: '⊙',  label: 'Utilisateurs' },
    { to: '/admin/skills',       icon: '◈',  label: 'Compétences' },
    { to: '/admin/branding',     icon: '◇',  label: 'Marque' },
    { to: '/admin/billing',      icon: '◎',  label: 'Facturation' },
  ]

  const superLinks = [
    { to: '/super',              icon: '⊞',  label: 'Plateforme' },
    { to: '/super/tenants',      icon: '⊙',  label: 'Établissements' },
    { to: '/super/plans',        icon: '◎',  label: 'Forfaits' },
    { to: '/super/revenue',      icon: '◈',  label: 'Revenus' },
    { to: '/super/tickets',      icon: '◷',  label: 'Support' },
  ]

  const links      = user?.role === 'super_admin' ? superLinks : user?.role === 'tenant_admin' ? adminLinks : studentLinks
  const roleLabel  = user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'tenant_admin' ? 'Administrateur' : 'Étudiant'
  const initials   = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        width: 256,
        background: '#111814',
        borderRight: '1px solid #1e2b24',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>

        {/* Logo */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #1e2b24' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Logo size={30} withText />
          </div>
        </div>

        {/* Credits (student only) */}
        {user?.role === 'student' && (
          <div style={{
            margin: '16px',
            background: 'rgba(29, 158, 117, 0.08)',
            border: '1px solid rgba(29, 158, 117, 0.2)',
            borderRadius: 14,
            padding: '18px 16px',
            textAlign: 'center',
          }}>
            <div style={{
              color: '#5a7a6a',
              fontSize: 10,
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '1.2px',
              marginBottom: 6,
            }}>Crédits</div>
            <div style={{
              color: '#1D9E75',
              fontSize: 42,
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              lineHeight: 1,
            }}>{user?.credits ?? 0}</div>
            <div style={{ color: '#5a7a6a', fontSize: 11, marginTop: 5, fontWeight: 500 }}>disponibles</div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ padding: '8px 10px', flex: 1 }}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard' || link.to === '/admin' || link.to === '/super'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 10,
                marginBottom: 2,
                color: isActive ? '#fff' : '#5a7a6a',
                background: isActive ? 'rgba(29, 158, 117, 0.18)' : 'transparent',
                borderLeft: isActive ? '2px solid #1D9E75' : '2px solid transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.className.includes('active')) {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.className.includes('active')) {
                  e.currentTarget.style.color = '#5a7a6a'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom: notifications + theme + user */}
        <div style={{ padding: '14px', borderTop: '1px solid #1e2b24' }}>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button
              onClick={() => { setNotifOpen(true); if (unreadCount > 0) markAllRead.mutate() }}
              style={{
                flex: 1,
                padding: '9px 0',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid #1e2b24',
                borderRadius: 10,
                color: '#5a7a6a',
                cursor: 'pointer',
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                fontFamily: 'var(--font-sans)',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#1D9E75'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2b24'}
              title="Notifications"
            >
              🔔
              {!!unreadCount && (
                <span style={{
                  background: '#1D9E75',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: 999,
                  lineHeight: 1.4,
                }}>{unreadCount}</span>
              )}
            </button>
            <ThemeToggle />
          </div>

          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Avatar initials={initials} size={36} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>{user?.name || 'Utilisateur'}</div>
              <div style={{ color: '#5a7a6a', fontSize: 11 }}>{roleLabel}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '9px',
              background: 'transparent',
              border: '1px solid #1e2b24',
              borderRadius: 10,
              color: '#5a7a6a',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2b24'; e.currentTarget.style.color = '#5a7a6a' }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
        {children}
      </main>

      {/* ── Notifications modal ──────────────────────────────────────────────── */}
      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications" width={520}>
        {notifLoading ? (
          <div style={{ padding: 20, textAlign: 'center' }}><Spinner size={24} /></div>
        ) : (notifications || []).length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: 32, textAlign: 'center' }}>
            Aucune notification pour le moment
          </div>
        ) : (
          (notifications || []).map(n => (
            <div key={n.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-main)' }}>{n.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 11, whiteSpace: 'nowrap' }}>{n.created_at}</div>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 5, lineHeight: 1.5 }}>{n.message}</div>
            </div>
          ))
        )}
      </Modal>
    </div>
  )
}
