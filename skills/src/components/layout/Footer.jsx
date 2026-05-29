import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Logo, Avatar } from '../ui'
import { Heart, Mail, Globe, MessageCircle, Users, Code } from 'lucide-react'

function SocialBtn({ href, children, title }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      title={title}
      style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--primary)'
        e.currentTarget.style.color = 'var(--primary)'
        e.currentTarget.style.background = 'rgba(29,158,117,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.color = 'var(--text-muted)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
      }}
    >
      {children}
    </a>
  )
}

const COLUMNS = [
  {
    title: 'Produit',
    key: 'product',
    links: [
      { label: 'Fonctionnalités', to: '/features' },
      { label: 'Tarifs', to: '/pricing' },
      { label: 'Roadmap', to: '/roadmap' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Carrières', to: '/careers' },
      { label: 'Presse', to: '/press' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Aide', to: '/help' },
      { label: 'Contact', to: '/contact' },
      { label: 'Statut', to: '/status' },
      { label: 'Changelog', to: '/changelog' },
    ],
  },
]

export function Footer() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const getDashLink = () => {
    if (!user) return { label: 'Dashboard', to: '/login' }
    if (user.role === 'super_admin') return { label: 'Super Admin', to: '/super' }
    if (user.role === 'tenant_admin') return { label: 'Admin Panel', to: '/admin' }
    return { label: 'Tableau de bord', to: '/dashboard' }
  }

  const dashLink = getDashLink()
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const roleLabel = user?.role === 'super_admin' ? 'Super Admin'
    : user?.role === 'tenant_admin' ? 'Administrateur'
    : user ? 'Étudiant' : null

  const columns = COLUMNS.map(col => {
    if (col.key === 'product') {
      return {
        ...col,
        links: [
          ...col.links.slice(0, 2),
          { label: dashLink.label, to: dashLink.to },
          ...col.links.slice(2),
        ],
      }
    }
    return col
  })

  const lnkStyle = {
    color: 'var(--text-muted)', fontSize: 14, marginBottom: 13,
    cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s',
    display: 'block',
  }

  return (
    <footer style={{
      padding: '80px 20px 40px',
      borderTop: '1.5px solid var(--border)',
      background: 'linear-gradient(180deg, var(--bg) 0%, rgba(29,158,117,0.02) 100%)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Main grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48, marginBottom: 64,
        }}>

          {/* Brand column */}
          <div style={{ maxWidth: 300 }}>
            <div style={{ cursor: 'pointer', marginBottom: 20 }} onClick={() => navigate('/')}>
              <Logo size={36} withText />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8, fontWeight: 500, marginBottom: 28 }}>
              Où les passions deviennent expertise, et l'apprentissage devient communauté.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <SocialBtn href="https://github.com/SKILIO" title="GitHub">
                <Code size={15} />
              </SocialBtn>
              <SocialBtn href="https://twitter.com/SKILIO" title="Twitter / X">
                <MessageCircle size={15} />
              </SocialBtn>
              <SocialBtn href="https://linkedin.com/company/SKILIO" title="LinkedIn">
                <Users size={15} />
              </SocialBtn>
              <SocialBtn href="mailto:fthalmh0@gmail.com" title="Envoyer un email">
                <Mail size={15} />
              </SocialBtn>
            </div>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.title}>
              <div style={{
                fontSize: 11, fontWeight: 800, marginBottom: 20,
                textTransform: 'uppercase', letterSpacing: '1.5px',
                color: 'var(--text-main)',
              }}>{col.title}</div>
              {col.links.map(link => (
                <div
                  key={link.label}
                  style={lnkStyle}
                  onClick={() => navigate(link.to)}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {link.label}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1.5px solid var(--border)', paddingTop: 32,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
        }}>

          {/* Copyright + Legal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
              © 2026 SKILIO. Tous droits réservés.
            </span>
            {[{ label: 'Confidentialité', to: '/privacy' }, { label: 'Conditions', to: '/terms' }].map(l => (
              <span
                key={l.label}
                onClick={() => navigate(l.to)}
                style={{ color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{l.label}</span>
            ))}
          </div>

          {/* User-aware right side */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Avatar initials={initials} size={28} />
              <div>
                <div style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
                  {user.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>
                  {roleLabel}
                </div>
              </div>
              <button
                onClick={() => navigate(dashLink.to)}
                style={{
                  padding: '7px 16px',
                  background: 'rgba(29,158,117,0.1)',
                  border: '1px solid rgba(29,158,117,0.3)',
                  borderRadius: 8, color: 'var(--primary)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(29,158,117,0.2)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(29,158,117,0.1)'; e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)' }}
              >
                Mon espace →
              </button>
              <button
                onClick={logout}
                style={{
                  padding: '7px 14px', background: 'transparent',
                  border: '1px solid var(--border)', borderRadius: 8,
                  color: 'var(--text-muted)', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#f87171' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Heart size={14} style={{ color: 'var(--accent)' }} />
              Bâti par des passionnés d'apprentissage
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}
