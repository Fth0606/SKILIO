import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications, useMarkAllNotificationsRead } from '../../hooks/useApi'
import { Avatar, Modal, Spinner, Badge } from '../ui'

// ─── Theme Toggle Component ──────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        transform: theme === 'dark' ? 'rotate(360deg)' : 'rotate(0deg)',
      }}
      className="btn-secondary"
      title={theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  )
}

// ─── Top Navbar (landing pages) ───────────────────────────────────────────────
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme } = useTheme()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'var(--glass-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 2rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff' }}>⇄</div>
          <span style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: 22, letterSpacing: '-1px', fontFamily: 'var(--font-heading)' }}>SKILIO</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {['Fonctionnalités', 'Tarifs'].map(item => (
            <button key={item} onClick={() => navigate(`/#${item === 'Tarifs' ? 'pricing' : 'features'}`)} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{item}</button>
          ))}
          <ThemeToggle />
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn-primary">Tableau de bord →</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding: '8px 20px' }}>Connexion</button>
              <button onClick={() => navigate('/register')} className="btn-primary">Commencer gratuitement →</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

// ─── App Shell (authenticated pages) ─────────────────────────────────────────
export function AppShell({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: notifications, isLoading: notifLoading } = useNotifications()
  const markAllRead = useMarkAllNotificationsRead()
  const [notifOpen, setNotifOpen] = useState(false)

  const unreadCount = (notifications || []).filter(n => !n.is_read).length

  const studentLinks = [
    { to: '/dashboard',          icon: '🏠', label: 'Tableau de bord' },
    { to: '/dashboard/search',   icon: '🔍', label: 'Trouver une compétence' },
    { to: '/dashboard/sessions', icon: '📅', label: 'Mes séances' },
    { to: '/dashboard/teach',    icon: '🎓', label: 'Enseigner' },
    { to: '/dashboard/ratings',  icon: '⭐', label: 'Mes évaluations' },
    { to: '/dashboard/credits',  icon: '💳', label: 'Crédits' },
  ]

  const adminLinks = [
    { to: '/admin',              icon: '📊', label: 'Analytiques' },
    { to: '/admin/users',        icon: '👥', label: 'Gestion des utilisateurs' },
    { to: '/admin/skills',       icon: '🛠️', label: 'Gestion des compétences' },
    { to: '/admin/branding',     icon: '🎨', label: 'Paramètres de marque' },
    { to: '/admin/billing',      icon: '💳', label: 'Facturation' },
  ]

  const superLinks = [
    { to: '/super',              icon: '📡', label: 'Plateforme' },
    { to: '/super/tenants',      icon: '🏫', label: 'Établissements' },
    { to: '/super/plans',        icon: '📋', label: 'Forfaits' },
    { to: '/super/revenue',      icon: '💰', label: 'Revenus' },
    { to: '/super/tickets',      icon: '🎫', label: 'Support' },
  ]

  const links = user?.role === 'super_admin' ? superLinks : user?.role === 'tenant_admin' ? adminLinks : studentLinks
  const roleLabel = user?.role === 'super_admin' ? 'Super Administrateur' : user?.role === 'tenant_admin' ? 'Administrateur' : 'Étudiant'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }} className="glass">
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff' }}>⇄</div>
            <span style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: 18, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>SKILIO</span>
          </div>
        </div>

        {/* Credits (student only) */}
        {user?.role === 'student' && (
          <div style={{ margin: '20px', background: 'var(--shadow-color)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: 4 }}>Crédits</div>
            <div style={{ color: 'var(--primary)', fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{user?.credits ?? 0}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>disponibles</div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard' || link.to === '/admin' || link.to === '/super'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: '12px',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                background: isActive ? 'var(--shadow-color)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '14px',
                textDecoration: 'none',
                marginBottom: '4px',
                transition: 'all 0.2s ease',
              })}
            >
              <span style={{ fontSize: 18 }}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div style={{ padding: 20, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button
              onClick={() => {
                setNotifOpen(true)
                if (unreadCount > 0) markAllRead.mutate()
              }}
              className="btn-secondary"
              style={{ flex: 1, padding: '10px', fontSize: 18 }}
              title="Notifications"
            >
              🔔 {!!unreadCount && <span style={{ fontSize: 12, marginLeft: -4, verticalAlign: 'top' }}>{unreadCount}</span>}
            </button>
            <ThemeToggle />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Avatar initials={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} size={40} />
            <div style={{ minWidth: 0 }}>
              <div style={{ color: 'var(--text-main)', fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Utilisateur'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>{roleLabel}</div>
            </div>
          </div>
          <button onClick={logout} className="btn-secondary" style={{ width: '100%', padding: '10px', fontSize: 13, color: 'var(--accent)', fontWeight: 700, border: '1px solid var(--border)' }}>Déconnexion</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
        {children}
      </main>

      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications" width={520}>
        {notifLoading ? (
          <div style={{ padding: 20, textAlign: 'center' }}><Spinner size={24} /></div>
        ) : (
          <div>
            {(notifications || []).length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: 32, textAlign: 'center' }}>Aucune notification pour le moment</div>
            ) : (
              (notifications || []).map((n) => (
                <div key={n.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)' }}>{n.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11, whiteSpace: 'nowrap' }}>{n.created_at}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{n.message}</div>
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
