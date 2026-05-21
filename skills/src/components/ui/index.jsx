// ─── Reusable UI primitives ───────────────────────────────────────────────────

import React from 'react'

export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="3" fill="none" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--primary)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Badge({ children, variant = 'gray' }) {
  const colors = {
    green: 'badge-green',
    red: 'badge-red',
    amber: 'badge-amber',
    purple: 'badge-purple',
    gray: '',
  }
  return (
    <span className={`badge ${colors[variant] || ''}`} style={{
      boxShadow: '0 4px 12px var(--shadow-color)',
      border: '1px solid var(--border)',
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
      width: size, height: size, borderRadius: '20%', // Bento style
      background: `linear-gradient(135deg, var(--primary), var(--primary-light))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: size * 0.4, flexShrink: 0,
      boxShadow: '0 8px 16px var(--shadow-color)',
      border: '2px solid var(--glass-border)',
    }}>{initials}</div>
  )
}

export function Stars({ rating, max = 5 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{
          color: i < Math.round(rating) ? 'var(--accent)' : 'var(--border)',
          fontSize: 16,
          filter: i < Math.round(rating) ? 'drop-shadow(0 0 4px var(--accent))' : 'none'
        }}>★</span>
      ))}
    </span>
  )
}

export function Card({ children, className = '', style = {} }) {
  return (
    <div className={`card ${className}`} style={{ padding: 24, ...style }}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, icon, color = 'var(--primary)' }) {
  return (
    <div className="card card-hover" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 80, opacity: 0.05, transform: 'rotate(-15deg)' }}>{icon}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: 12 }}>{label}</div>
        <div style={{ color, fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-1px' }}>{value}</div>
        {sub && <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card glass" style={{ width: '100%', maxWidth: width, padding: 32, maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <style>{`@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'var(--border)', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: 18, width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', paddingRight: 8 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Table({ columns, data, onRow }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ padding: '12px 20px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRow?.(row)}
              style={{ cursor: onRow ? 'pointer' : 'default', transition: 'all 0.3s ease' }}
              className="table-row-premium"
            >
              <style>{`.table-row-premium td { background: var(--surface); transition: all 0.3s; } .table-row-premium:hover td { background: var(--shadow-color); border-color: var(--primary); } .table-row-premium td:first-child { border-radius: 12px 0 0 12px; border-left: 1px solid var(--border); } .table-row-premium td:last-child { border-radius: 0 12px 12px 0; border-right: 1px solid var(--border); } .table-row-premium td { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }`}</style>
              {columns.map(col => (
                <td key={col.key} style={{ padding: '16px 20px', fontSize: 14, color: col.muted ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: 500 }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={columns.length} style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>Aucune donnée</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Pagination({ page, lastPage, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', paddingTop: 24 }}>
      <button className="btn-secondary" style={{ padding: '8px 16px', fontWeight: 700 }} disabled={page <= 1} onClick={() => onChange(page - 1)}>← Précédent</button>
      <span style={{ color: 'var(--text-main)', fontSize: 14, display: 'flex', alignItems: 'center', fontWeight: 700, background: 'var(--shadow-color)', padding: '0 20px', borderRadius: 10 }}>Page {page} sur {lastPage}</span>
      <button className="btn-secondary" style={{ padding: '8px 16px', fontWeight: 700 }} disabled={page >= lastPage} onClick={() => onChange(page + 1)}>Suivant →</button>
    </div>
  )
}

export function EmptyState({ icon = '📭', title, desc }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '80px 40px', background: 'transparent', border: '2px dashed var(--border)' }}>
      <div style={{ fontSize: 64, marginBottom: 20, filter: 'drop-shadow(0 10px 20px var(--shadow-color))' }}>{icon}</div>
      <div style={{ color: 'var(--text-main)', fontSize: 20, fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-heading)' }}>{title}</div>
      {desc && <div style={{ color: 'var(--text-muted)', fontSize: 15, fontWeight: 500, maxWidth: 300, margin: '0 auto' }}>{desc}</div>}
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size={48} />
        <div style={{ color: 'var(--text-muted)', marginTop: 20, fontSize: 16, fontWeight: 700, letterSpacing: '1px' }}>CHARGEMENT...</div>
      </div>
    </div>
  )
}

export function ProgressBar({ value, max, color = 'var(--primary)' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      <div className="progress-bar" style={{ height: 12, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, var(--primary-light))`, height: '100%', borderRadius: 6, boxShadow: `0 0 10px ${color}` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }}>{value.toLocaleString()} / {max.toLocaleString()}</span>
        <span style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 800 }}>{pct}%</span>
      </div>
    </div>
  )
}

export function Skeleton({ height = 20, width = '100%', radius = 8 }) {
  return (
    <div className="shimmer" style={{ height, width, borderRadius: radius, marginBottom: 12 }} />
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
