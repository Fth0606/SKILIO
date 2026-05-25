// ─── Reusable UI primitives ───────────────────────────────────────────────────

import React from 'react'

/* ─── Logo ──────────────────────────────────────────────────────────────────── */
export function Logo({ size = 32, withText = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.35),
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexShrink: 0,
        boxShadow: '0 4px 12px var(--shadow-color)',
      }}>
        <svg width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      {withText && (
        <span style={{
          color: 'var(--text-main)',
          fontWeight: 900,
          fontSize: Math.round(size * 0.72),
          letterSpacing: '-1px',
          fontFamily: 'var(--font-heading)',
        }}>SKILIO</span>
      )}
    </div>
  )
}

/* ─── Spinner ───────────────────────────────────────────────────────────────── */
export function Spinner({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
    >
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="3" fill="none" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--primary)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/* ─── Badge ─────────────────────────────────────────────────────────────────── */
export function Badge({ children, variant = 'gray' }) {
  const cls = {
    green:  'badge badge-green',
    red:    'badge badge-red',
    amber:  'badge badge-amber',
    purple: 'badge badge-purple',
    pink:   'badge badge-pink',
    gray:   'badge',
  }
  return <span className={cls[variant] || 'badge'}>{children}</span>
}

/* ─── StatusBadge ───────────────────────────────────────────────────────────── */
export function StatusBadge({ status }) {
  const map = {
    pending:              ['En attente',              'amber'],
    accepted:             ['Acceptée',                'green'],
    completed:            ['Terminée',                'green'],
    rejected:             ['Refusée',                 'red'],
    cancelled:            ['Annulée',                 'red'],
    pending_ratings:      ["En attente d'évaluations",'purple'],
    proposed:             ['Proposée',                'amber'],
    changed:              ['Modifiée',                'purple'],
    finalized:            ['Finalisée',               'green'],
    credits_transferred:  ['Crédits envoyés',         'green'],
    penalty_applied:      ['Pénalité appliquée',      'red'],
    upcoming:             ['À venir',                 'green'],
  }
  const [label, color] = map[status] || [status, 'gray']
  return <Badge variant={color}>{label}</Badge>
}

/* ─── Avatar ────────────────────────────────────────────────────────────────── */
export function Avatar({ initials, size = 40 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 800,
      fontSize: Math.round(size * 0.38),
      flexShrink: 0,
      border: '2px solid rgba(29,158,117,0.3)',
    }}>
      {initials}
    </div>
  )
}

/* ─── Stars ─────────────────────────────────────────────────────────────────── */
export function Stars({ rating, max = 5 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < Math.round(rating) ? '#EF9F27' : 'var(--border)', fontSize: 15 }}>★</span>
      ))}
    </span>
  )
}

/* ─── Card ──────────────────────────────────────────────────────────────────── */
export function Card({ children, className = '', style = {} }) {
  return (
    <div className={`card ${className}`} style={{ padding: 24, ...style }}>
      {children}
    </div>
  )
}

/* ─── StatCard ──────────────────────────────────────────────────────────────── */
export function StatCard({ label, value, sub, icon, color = 'var(--primary)' }) {
  return (
    <div className="card card-hover" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: -8,
        right: -8,
        fontSize: 72,
        opacity: 0.04,
        transform: 'rotate(-10deg)',
        pointerEvents: 'none',
      }}>{icon}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          color: 'var(--text-muted)',
          fontSize: 11,
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '1px',
          marginBottom: 10,
        }}>{label}</div>
        <div style={{
          color,
          fontSize: 34,
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-1px',
          lineHeight: 1,
        }}>{value}</div>
        {sub && (
          <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8, fontWeight: 500 }}>{sub}</div>
        )}
      </div>
    </div>
  )
}

/* ─── Modal ─────────────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: width,
          padding: 32,
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease',
          border: '1px solid var(--border)',
        }}
      >
        <style>{`@keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: 16,
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >✕</button>
        </div>
        <div style={{ overflowY: 'auto', paddingRight: 4 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─── Table ─────────────────────────────────────────────────────────────────── */
export function Table({ columns, data, onRow }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{
                padding: '10px 18px',
                textAlign: 'left',
                color: 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRow?.(row)}
              style={{ cursor: onRow ? 'pointer' : 'default' }}
              className="table-row-premium"
            >
              {columns.map(col => (
                <td key={col.key} style={{
                  padding: '14px 18px',
                  fontSize: 13,
                  color: col.muted ? 'var(--text-muted)' : 'var(--text-main)',
                  fontWeight: 500,
                }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{
                padding: 56,
                textAlign: 'center',
                color: 'var(--text-muted)',
                background: 'var(--surface)',
                borderRadius: 12,
                border: '1px solid var(--border)',
              }}>
                Aucune donnée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Pagination ────────────────────────────────────────────────────────────── */
export function Pagination({ page, lastPage, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', paddingTop: 24 }}>
      <button
        className="btn-secondary"
        style={{ padding: '8px 16px', fontSize: 13 }}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >← Précédent</button>
      <span style={{
        color: 'var(--text-muted)',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        fontWeight: 600,
        background: 'rgba(255,255,255,0.04)',
        padding: '0 18px',
        borderRadius: 10,
        border: '1px solid var(--border)',
      }}>
        Page {page} sur {lastPage}
      </span>
      <button
        className="btn-secondary"
        style={{ padding: '8px 16px', fontSize: 13 }}
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
      >Suivant →</button>
    </div>
  )
}

/* ─── EmptyState ────────────────────────────────────────────────────────────── */
export function EmptyState({ icon = '📭', title, desc }) {
  return (
    <div className="card" style={{
      textAlign: 'center',
      padding: '72px 40px',
      background: 'transparent',
      border: '1px dashed var(--border)',
    }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>{icon}</div>
      <div style={{ color: 'var(--text-main)', fontSize: 18, fontWeight: 800, marginBottom: 10, fontFamily: 'var(--font-heading)' }}>{title}</div>
      {desc && (
        <div style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 280, margin: '0 auto' }}>{desc}</div>
      )}
    </div>
  )
}

/* ─── LoadingScreen ─────────────────────────────────────────────────────────── */
export function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size={44} />
        <div style={{ color: 'var(--text-muted)', marginTop: 18, fontSize: 13, fontWeight: 700, letterSpacing: '1.5px' }}>CHARGEMENT...</div>
      </div>
    </div>
  )
}

/* ─── ProgressBar ───────────────────────────────────────────────────────────── */
export function ProgressBar({ value, max, color = 'var(--primary)' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, var(--primary-light))`,
          height: '100%',
          borderRadius: 4,
          transition: 'width 0.6s ease',
          boxShadow: `0 0 8px ${color}`,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }}>
          {value.toLocaleString()} / {max.toLocaleString()}
        </span>
        <span style={{ color: 'var(--primary)', fontSize: 11, fontWeight: 800 }}>{pct}%</span>
      </div>
    </div>
  )
}

/* ─── Skeleton ──────────────────────────────────────────────────────────────── */
export function Skeleton({ height = 20, width = '100%', radius = 8 }) {
  return <div className="shimmer" style={{ height, width, borderRadius: radius, marginBottom: 10 }} />
}

/* ─── FloatingInput ─────────────────────────────────────────────────────────── */
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
