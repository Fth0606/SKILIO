// ─── Reusable UI primitives ───────────────────────────────────────────────────

export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" stroke="#1e2b24" strokeWidth="3" fill="none" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#1D9E75" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Badge({ children, variant = 'gray' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>
}

export function StatusBadge({ status }) {
  const map = {
    pending:           ['Pending',           'amber'],
    accepted:          ['Accepted',          'green'],
    completed:         ['Completed',         'green'],
    rejected:          ['Rejected',          'red'],
    cancelled:         ['Cancelled',         'red'],
    pending_ratings:   ['Awaiting Ratings',  'purple'],
    proposed:          ['Proposed',          'amber'],
    changed:           ['Changed',           'purple'],
    finalized:         ['Finalized',         'green'],
    credits_transferred:['Credits Sent',     'green'],
    penalty_applied:   ['Penalty Applied',   'red'],
    upcoming:          ['Upcoming',          'green'],
  }
  const [label, color] = map[status] || [status, 'gray']
  return <Badge variant={color}>{label}</Badge>
}

export function Avatar({ initials, size = 40, color = '#0F6E56' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}30`, border: `1.5px solid ${color}60`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: color, fontWeight: 700, fontSize: size * 0.33, flexShrink: 0,
    }}>{initials}</div>
  )
}

export function Stars({ rating, max = 5 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < Math.round(rating) ? '#EF9F27' : '#1e2b24', fontSize: 13 }}>★</span>
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

export function StatCard({ label, value, sub, icon, color = '#1D9E75' }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#5a7a6a', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{label}</div>
          <div style={{ color, fontSize: 28, fontWeight: 800 }}>{value}</div>
          {sub && <div style={{ color: '#5a7a6a', fontSize: 12, marginTop: 4 }}>{sub}</div>}
        </div>
        {icon && <span style={{ fontSize: 24, opacity: 0.6 }}>{icon}</span>}
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children, width = 440 }) {
  if (!open) return null
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card" style={{ width: '100%', maxWidth: width, padding: 28, maxHeight: 'calc(100vh - 32px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5a7a6a', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', paddingRight: 6 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Table({ columns, data, onRow }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #1e2b24' }}>
            {columns.map(col => (
              <th key={col.key} style={{ padding: '10px 12px', textAlign: 'left', color: '#5a7a6a', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRow?.(row)}
              style={{ borderBottom: '1px solid #111814', cursor: onRow ? 'pointer' : 'default', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (onRow) e.currentTarget.style.background = 'rgba(29,158,117,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: '12px', fontSize: 14, color: col.muted ? '#5a7a6a' : '#fff' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={columns.length} style={{ padding: 40, textAlign: 'center', color: '#5a7a6a' }}>No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Pagination({ page, lastPage, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', paddingTop: 16 }}>
      <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }} disabled={page <= 1} onClick={() => onChange(page - 1)}>← Prev</button>
      <span style={{ color: '#5a7a6a', fontSize: 13, display: 'flex', alignItems: 'center', padding: '0 8px' }}>Page {page} of {lastPage}</span>
      <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }} disabled={page >= lastPage} onClick={() => onChange(page + 1)}>Next →</button>
    </div>
  )
}

export function EmptyState({ icon = '📭', title, desc }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</div>
      {desc && <div style={{ color: '#5a7a6a', fontSize: 14 }}>{desc}</div>}
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size={40} />
        <div style={{ color: '#5a7a6a', marginTop: 12, fontSize: 14 }}>Loading…</div>
      </div>
    </div>
  )
}

export function ProgressBar({ value, max, color = '#1D9E75' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ color: '#5a7a6a', fontSize: 11 }}>{value.toLocaleString()} / {max.toLocaleString()}</span>
        <span style={{ color: '#5a7a6a', fontSize: 11 }}>{pct}%</span>
      </div>
    </div>
  )
}
