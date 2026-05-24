// ─── Reusable UI primitives ───────────────────────────────────────────────────

import React from 'react'

export function Logo({ size = 32, withText = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
      <svg width={size} height={size} viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
          fill="url(#logo_grad)"
        />
        <defs>
          <linearGradient id="logo_grad" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      </svg>
      {withText && (
        <span style={{
          color: 'var(--text-main)',
          fontWeight: 700,
          fontSize: size * 0.65,
          letterSpacing: '-0.5px',
          fontFamily: 'var(--font-heading)'
        }}>
          SKILIO
        </span>
      )}
    </div>
  )
}

export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="2.5" fill="none" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Badge({ children, variant = 'gray' }) {
  const colors = {
    green: 'badge-green',
    red: 'badge-red',
    amber: 'badge-amber',
    purple: 'badge-purple',
    pink: 'badge-pink',
    gray: '',
  }
  return (
    <span className={`badge ${colors[variant] || ''}`} style={{
      boxShadow: 'none',
      border: 'none',
    }}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    pending:           ['En attente',           'amber'],
    accepted:          ['Acceptée',          'green'],
    completed:         ['Terminée',         'green'],
    rejected:          ['Refusée',          'red'],
    cancelled:         ['Annulée',         'red'],
    pending_ratings:   ['En attente d\'évaluations',  'purple'],
    proposed:          ['Proposée',          'amber'],
    changed:           ['Modifiée',           'purple'],
    finalized:         ['Finalisée',         'green'],
    credits_transferred:['Crédits envoyés',     'green'],
    penalty_applied:   ['Pénalité appliquée',   'red'],
    upcoming:          ['À venir',          'green'],
  }
  const [label, color] = map[status] || [status, 'gray']
  return <Badge variant={color}>{label}</Badge>
}

export function Avatar({ initials, size = 40, color = 'var(--primary)' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 10,
      background: `linear-gradient(135deg, var(--primary), var(--primary-light))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0,
      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
      border: '1px solid var(--border)',
    }}>{initials}</div>
  )
}

export function Stars({ rating, max = 5 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{
          color: i < Math.round(rating) ? '#fbbf24' : 'var(--border)',
          fontSize: 14,
        }}>★</span>
      ))}
    </span>
  )
}

export function Card({ children, className = '', style = {} }) {
  return (
    <div className={`card ${className}`} style={{ padding: 20, ...style }}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, icon, color = 'var(--primary)' }) {
  return (
    <div className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -8, right: -8, fontSize: 64, opacity: 0.06 }}>{icon}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 8 }}>{label}</div>
        <div style={{ color, fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>{value}</div>
        {sub && <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card" style={{ width: '100%', maxWidth: width, padding: 24, maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', border: '1px solid var(--border)' }}>
        <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', paddingRight: 4 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Table({ columns, data, onRow }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRow?.(row)}
              style={{ cursor: onRow ? 'pointer' : 'default', transition: 'all 0.2s ease' }}
              className="table-row-premium"
            >
              <style>{`.table-row-premium td { background: var(--surface); transition: all 0.2s; } .table-row-premium:hover td { background: var(--surface-2); } .table-row-premium td:first-child { border-radius: 8px 0 0 8px; } .table-row-premium td:last-child { border-radius: 0 8px 8px 0; }`}</style>
              {columns.map(col => (
                <td key={col.key} style={{ padding: '14px 16px', fontSize: 13, color: col.muted ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: 500 }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={columns.length} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)' }}>Aucune donnée</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Pagination({ page, lastPage, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', paddingTop: 20 }}>
      <button className="btn-secondary" style={{ padding: '8px 14px', fontWeight: 600 }} disabled={page <= 1} onClick={() => onChange(page - 1)}>← Précédent</button>
      <span style={{ color: 'var(--text-main)', fontSize: 13, display: 'flex', alignItems: 'center', fontWeight: 600, background: 'var(--surface)', padding: '0 16px', borderRadius: 8, border: '1px solid var(--border)' }}>Page {page} sur {lastPage}</span>
      <button className="btn-secondary" style={{ padding: '8px 14px', fontWeight: 600 }} disabled={page >= lastPage} onClick={() => onChange(page + 1)}>Suivant →</button>
    </div>
  )
}

export function EmptyState({ icon = '📭', title, desc }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '60px 40px', background: 'transparent', border: '1px dashed var(--border)' }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>{icon}</div>
      <div style={{ color: 'var(--text-main)', fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-heading)' }}>{title}</div>
      {desc && <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, maxWidth: 280, margin: '0 auto' }}>{desc}</div>}
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size={40} />
        <div style={{ color: 'var(--text-muted)', marginTop: 16, fontSize: 13, fontWeight: 600, letterSpacing: '0.5px' }}>CHARGEMENT...</div>
      </div>
    </div>
  )
}

export function ProgressBar({ value, max, color = 'var(--primary)' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, var(--primary-light))`, height: '100%', borderRadius: 4 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{value.toLocaleString()} / {max.toLocaleString()}</span>
        <span style={{ color: 'var(--primary)', fontSize: 11, fontWeight: 700 }}>{pct}%</span>
      </div>
    </div>
  )
}

export function Skeleton({ height = 20, width = '100%', radius = 6 }) {
  return (
    <div className="shimmer" style={{ height, width, borderRadius: radius, marginBottom: 10 }} />
  )
}

export function FloatingInput({ label, id, ...props }) {
  return (
    <div className="input-group">
      <input
        id={id}
        className="input-premium"
        placeholder=" "
        {...props}
      />
      <label htmlFor={id} className="floating-label">{label}</label>
    </div>
  )
}
