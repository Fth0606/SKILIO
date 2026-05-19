import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications, useMarkAllNotificationsRead } from '../../hooks/useApi'
import { Avatar, Modal, Spinner, Badge } from '../ui'

// ─── Top Navbar (landing pages) ───────────────────────────────────────────────
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(8,14,10,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #1e2b24' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 2rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#1D9E75,#EF9F27)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⇄</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>SkillSwap</span>
          <span style={{ background: '#0F6E56', color: '#fff', fontSize: 10, padding: '2px 7px', borderRadius: 20, fontWeight: 600 }}>SaaS</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['Features', 'Pricing'].map(item => (
            <button key={item} onClick={() => navigate(`/#${item.toLowerCase()}`)} style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>{item}</button>
          ))}
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn-primary">Dashboard →</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding: '8px 16px' }}>Sign In</button>
              <button onClick={() => navigate('/register')} className="btn-primary">Get Started Free →</button>
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
    { to: '/dashboard',          icon: '🏠', label: 'Dashboard' },
    { to: '/dashboard/search',   icon: '🔍', label: 'Find Skills' },
    { to: '/dashboard/sessions', icon: '📅', label: 'My Sessions' },
    { to: '/dashboard/teach',    icon: '🎓', label: 'Teach' },
    { to: '/dashboard/ratings',  icon: '⭐', label: 'My Ratings' },
    { to: '/dashboard/credits',  icon: '💳', label: 'Credits' },
  ]

  const adminLinks = [
    { to: '/admin',              icon: '📊', label: 'Analytics' },
    { to: '/admin/users',        icon: '👥', label: 'Users' },
    { to: '/admin/skills',       icon: '🛠️', label: 'Skills' },
    { to: '/admin/branding',     icon: '🎨', label: 'Branding' },
    { to: '/admin/billing',      icon: '💳', label: 'Billing' },
  ]

  const superLinks = [
    { to: '/super',              icon: '📡', label: 'Platform' },
    { to: '/super/tenants',      icon: '🏫', label: 'Tenants' },
    { to: '/super/plans',        icon: '📋', label: 'Plans' },
    { to: '/super/revenue',      icon: '💰', label: 'Revenue' },
    { to: '/super/tickets',      icon: '🎫', label: 'Support' },
  ]

  const links = user?.role === 'super_admin' ? superLinks : user?.role === 'tenant_admin' ? adminLinks : studentLinks
  const roleLabel = user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'tenant_admin' ? 'Admin' : 'Student'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d1511' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#111814', borderRight: '1px solid #1e2b24', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e2b24' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg,#1D9E75,#EF9F27)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⇄</div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>SkillSwap</span>
          </div>
        </div>

        {/* Credits (student only) */}
        {user?.role === 'student' && (
          <div style={{ margin: '16px', background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 12, padding: 14, textAlign: 'center' }}>
            <div style={{ color: '#5a7a6a', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Credits</div>
            <div style={{ color: '#1D9E75', fontSize: 30, fontWeight: 800 }}>{user?.credits ?? 0}</div>
            <div style={{ color: '#5a7a6a', fontSize: 10 }}>available</div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ padding: '8px 8px', flex: 1 }}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard' || link.to === '/admin' || link.to === '/super'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span style={{ fontSize: 16 }}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div style={{ padding: 16, borderTop: '1px solid #1e2b24' }}>
          <button
            onClick={() => {
              setNotifOpen(true)
              if (unreadCount > 0) markAllRead.mutate()
            }}
            className="btn-secondary"
            style={{ width: '100%', padding: '8px 0', fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <span>🔔</span>
            <span>Notifications</span>
            {!!unreadCount && <Badge variant="amber">{unreadCount}</Badge>}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Avatar initials={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} size={34} />
            <div style={{ minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</div>
              <div style={{ color: '#5a7a6a', fontSize: 11 }}>{roleLabel}</div>
            </div>
          </div>
          <button onClick={logout} className="btn-secondary" style={{ width: '100%', padding: '8px 0', fontSize: 13 }}>Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        {children}
      </main>

      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications" width={520}>
        {notifLoading ? (
          <div style={{ padding: 20, textAlign: 'center' }}><Spinner size={24} /></div>
        ) : (
          <div>
            {(notifications || []).length === 0 ? (
              <div style={{ color: '#5a7a6a', fontSize: 14, padding: 16, textAlign: 'center' }}>No notifications yet</div>
            ) : (
              (notifications || []).map((n) => (
                <div key={n.id} style={{ padding: '12px 0', borderBottom: '1px solid #1e2b24' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{n.title}</div>
                    <div style={{ color: '#5a7a6a', fontSize: 11, whiteSpace: 'nowrap' }}>{n.created_at}</div>
                  </div>
                  <div style={{ color: '#5a7a6a', fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>{n.message}</div>
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
