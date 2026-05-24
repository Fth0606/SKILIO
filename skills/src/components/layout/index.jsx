import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications, useMarkAllNotificationsRead } from '../../hooks/useApi'
import { Avatar, Modal, Spinner, Badge, Logo } from '../ui'

// ─── Theme Toggle Component ──────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        color: 'var(--text-main)',
      }}
      title={theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
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
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 2rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Logo size={28} withText />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['Fonctionnalités', 'Tarifs'].map(item => (
            <button key={item} onClick={() => navigate(`/#${item === 'Tarifs' ? 'pricing' : 'features'}`)} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>{item}</button>
          ))}
          <ThemeToggle />
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn-primary">Tableau de bord →</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding: '8px 16px' }}>Connexion</button>
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
      <aside style={{ 
        width: 260, 
        background: 'var(--surface)', 
        borderRight: '1px solid var(--border)', 
        display: 'flex', 
        flexDirection: 'column', 
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Logo size={28} withText />
          </div>
        </div>

        {/* Credits (student only) */}
        {user?.role === 'student' && (
          <div style={{ margin: '16px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', borderRadius: 12, padding: 16, textAlign: 'center', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 2 }}>Crédits</div>
            <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{user?.credits ?? 0}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 500 }}>disponibles</div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ padding: '8px', flex: 1, overflowY: 'auto' }}>
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
                borderRadius: 8,
                color: isActive ? '#fff' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: 13,
                textDecoration: 'none',
                marginBottom: '2px',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
              })}
            >
              <span style={{ fontSize: 16 }}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => {
                setNotifOpen(true)
                if (unreadCount > 0) markAllRead.mutate()
              }}
              className="btn-secondary"
              style={{ flex: 1, padding: '8px', fontSize: 16 }}
              title="Notifications"
            >
              🔔 {!!unreadCount && <span style={{ fontSize: 11, marginLeft: -4, verticalAlign: 'top' }}>{unreadCount}</span>}
            </button>
            <ThemeToggle />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Avatar initials={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} size={36} />
            <div style={{ minWidth: 0 }}>
              <div style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Utilisateur'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>{roleLabel}</div>
            </div>
          </div>
          <button onClick={logout} className="btn-secondary" style={{ width: '100%', padding: '8px', fontSize: 12, color: 'var(--danger)', fontWeight: 600, border: '1px solid var(--border)' }}>Déconnexion</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px', 
        marginLeft: 260,
        minHeight: '100vh',
      }}>
        {children}
      </main>

      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications" width={400}>
        {notifLoading ? (
          <div style={{ padding: 20, textAlign: 'center' }}><Spinner size={24} /></div>
        ) : (
          <div>
            {(notifications || []).length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: 32, textAlign: 'center' }}>Aucune notification pour le moment</div>
            ) : (
              (notifications || []).map((n) => (
                <div key={n.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-main)' }}>{n.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 10, whiteSpace: 'nowrap' }}>{n.created_at}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{n.message}</div>
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
