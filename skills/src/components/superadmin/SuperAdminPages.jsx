import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import {
  usePlatformStats, useTenants, useCreateTenant,
  useSuspendTenant, usePlans, useRevenue, useTickets,
} from '../../hooks/useApi'
import { superAdminAPI as superAdminApi } from '../../services/api'
import { Card, StatCard, Table, Pagination, Modal, Badge, EmptyState, Spinner } from '../ui'
import toast from 'react-hot-toast'

const CHART = {
  tick: { fontSize: 12, fill: '#5a7a6a' },
  tooltip: {
    contentStyle: { background: '#111814', border: '1px solid #1e2b24', borderRadius: 8 },
    labelStyle: { color: '#fff' },
  }
}

// ─── Platform Dashboard ───────────────────────────────────────────────────────
export function SuperDashboard() {
  const { data, isLoading } = usePlatformStats()
  const { data: revenue }   = useRevenue()

  if (isLoading) return <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={36} /></div>

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Platform Dashboard</h1>
        <p style={{ color: '#5a7a6a' }}>Super Admin · Global Overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Tenants"  value={data?.total_tenants ?? 0}      icon="🏫" color="#7F77DD" />
        <StatCard label="Total Users"    value={(data?.total_users ?? 0).toLocaleString()} icon="👥" />
        <StatCard label="Sessions"       value={(data?.total_sessions ?? 0).toLocaleString()} icon="📅" color="#EF9F27" />
        <StatCard label="MRR"            value={`$${(data?.mrr ?? 0).toLocaleString()}`}    icon="💰" color="#1D9E75" />
        <StatCard label="Churn Rate"     value={`${data?.churn_rate ?? 0}%`}    icon="📉" color="#E24B4A" />
        <StatCard label="LTV"            value={`$${(data?.ltv ?? 0).toLocaleString()}`}           icon="📈" color="#1D9E75" />
        <StatCard label="CAC"            value={`$${(data?.cac ?? 0).toLocaleString()}`}            icon="🎯" color="#EF9F27" />
        <StatCard label="Credits Total"  value={(data?.credits_total ?? 0).toLocaleString()} icon="💳" color="#7F77DD" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* MRR chart */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Monthly Recurring Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenue?.mrr_chart || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2b24" />
              <XAxis dataKey="month" tick={CHART.tick} axisLine={false} />
              <YAxis tick={CHART.tick} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip {...CHART.tooltip} formatter={v => [`$${v.toLocaleString()}`, 'MRR']} />
              <Line type="monotone" dataKey="value" stroke="#1D9E75" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Sessions chart */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Sessions per Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenue?.sessions_chart || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2b24" />
              <XAxis dataKey="month" tick={CHART.tick} axisLine={false} />
              <YAxis tick={CHART.tick} axisLine={false} />
              <Tooltip {...CHART.tooltip} />
              <Bar dataKey="count" fill="#7F77DD" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Revenue Forecast</h3>
          <span style={{ color: '#5a7a6a', fontSize: 13 }}>Next 3 months</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {(revenue?.forecast || [
            { month: 'Jun', mrr: 56000, sessions: 14200 },
            { month: 'Jul', mrr: 61000, sessions: 15800 },
            { month: 'Aug', mrr: 67000, sessions: 17200 },
          ]).map(f => (
            <div key={f.month} style={{ background: '#0a0f0d', borderRadius: 10, padding: 16, textAlign: 'center' }}>
              <div style={{ color: '#5a7a6a', fontSize: 12, marginBottom: 4 }}>{f.month}</div>
              <div style={{ color: '#1D9E75', fontSize: 20, fontWeight: 700 }}>${(f.mrr/1000).toFixed(0)}k</div>
              <div style={{ color: '#5a7a6a', fontSize: 12 }}>{f.sessions?.toLocaleString()} sessions</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Tenant Management ────────────────────────────────────────────────────────
export function SuperTenants() {
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({ name: '', subdomain: '', plan_id: '', admin_email: '', admin_name: '' })
  const { data, isLoading }   = useTenants({ search, page, per_page: 15 })
  const createTenant          = useCreateTenant()
  const suspendTenant         = useSuspendTenant()

  const { data: plans } = usePlans()

  const handleCreate = async (e) => {
    e.preventDefault()
    await createTenant.mutateAsync(form)
    setModal(false)
    setForm({ name: '', subdomain: '', plan_id: '', admin_email: '', admin_name: '' })
  }

  const columns = [
    { key: 'name',       label: 'Institution' },
    { key: 'subdomain',  label: 'Subdomain',  render: v => <span style={{ color: '#1D9E75', fontSize: 13 }}>{v}.skilio.com</span> },
    { key: 'plan',       label: 'Plan',       render: v => <Badge variant="purple">{v?.name}</Badge> },
    { key: 'users_count',label: 'Users',      muted: true },
    { key: 'sessions_count', label: 'Sessions', muted: true },
    { key: 'status',     label: 'Status',     render: v => <Badge variant={v === 'active' ? 'green' : 'red'}>{v}</Badge> },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => superAdminApi.tenantUsageStats(id).then(r => toast.success(JSON.stringify(r.data.data)))}
            style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', color: '#1D9E75', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>Stats</button>
          {row.status === 'active'
            ? <button onClick={() => suspendTenant.mutate(id)} style={{ background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', color: '#E24B4A', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>Suspend</button>
            : <button onClick={() => superAdminApi.activateTenant(id)} style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', color: '#1D9E75', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>Activate</button>
          }
        </div>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Tenant Management</h1>
          <p style={{ color: '#5a7a6a' }}>All institutions on the platform</p>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>+ Create Tenant</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input className="input-dark" placeholder="Search tenants…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ maxWidth: 320 }} />
      </div>

      {isLoading ? <Spinner size={32} /> : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Table columns={columns} data={data?.data || []} />
          {data?.last_page > 1 && <div style={{ padding: 16 }}><Pagination page={page} lastPage={data.last_page} onChange={setPage} /></div>}
        </Card>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Create New Tenant" width={480}>
        <form onSubmit={handleCreate}>
          {[
            { key: 'name',        label: 'Institution Name',  ph: 'Harvard University' },
            { key: 'subdomain',   label: 'Subdomain',         ph: 'harvard  →  harvard.skilio.com' },
            { key: 'admin_name',  label: 'Admin Name',        ph: 'John Smith' },
            { key: 'admin_email', label: 'Admin Email',       ph: 'admin@university.edu' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input className="input-dark" required value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} />
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Plan</label>
            <select className="input-dark" required value={form.plan_id} onChange={e => setForm(p => ({ ...p, plan_id: e.target.value }))}>
              <option value="">Select plan…</option>
              {plans?.map(p => <option key={p.id} value={p.id}>{p.name} — ${p.price}/mo</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={createTenant.isLoading}>
              {createTenant.isLoading ? <Spinner size={16} /> : 'Create & Activate →'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// ─── Plans Management ─────────────────────────────────────────────────────────
export function SuperPlans() {
  const { data: plans, isLoading, refetch } = usePlans()
  const [editing, setEditing] = useState(null)

  const handleSave = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = Object.fromEntries(fd)
    await superAdminApi.updatePlan(editing.id, data)
    toast.success('Plan updated!')
    setEditing(null)
    refetch()
  }

  const publish = async (id) => {
    await superAdminApi.publishPlan(id)
    toast.success('Plan published!')
    refetch()
  }

  if (isLoading) return <Spinner />

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Subscription Plans</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
        {plans?.map(plan => (
          <Card key={plan.id} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{plan.name}</div>
              <Badge variant={plan.published ? 'green' : 'amber'}>{plan.published ? 'Live' : 'Draft'}</Badge>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1D9E75', marginBottom: 4 }}>${plan.price}<span style={{ fontSize: 13, color: '#5a7a6a' }}>/mo</span></div>
            <div style={{ color: '#5a7a6a', fontSize: 13, marginBottom: 16 }}>Up to {plan.max_users === -1 ? '∞' : plan.max_users} users</div>
            {plan.features?.map(f => <div key={f} style={{ color: '#5a7a6a', fontSize: 13, marginBottom: 6 }}>✓ {f}</div>)}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn-secondary" style={{ flex: 1, fontSize: 12, padding: '7px 0' }} onClick={() => setEditing(plan)}>Edit</button>
              {!plan.published && <button className="btn-primary" style={{ flex: 1, fontSize: 12, padding: '7px 0', justifyContent: 'center' }} onClick={() => publish(plan.id)}>Publish</button>}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit ${editing?.name}`}>
        {editing && (
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Price ($/mo)</label>
              <input className="input-dark" type="number" name="price" defaultValue={editing.price} required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Max Users (-1 = unlimited)</label>
              <input className="input-dark" type="number" name="max_users" defaultValue={editing.max_users} required />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Changes →</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

// ─── Revenue ──────────────────────────────────────────────────────────────────
export function SuperRevenue() {
  const { data, isLoading } = useRevenue()

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Revenue</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="MRR"         value={`$${(data?.mrr ?? 0).toLocaleString()}`}    icon="💰" color="#1D9E75" />
        <StatCard label="ARR"         value={`$${((data?.mrr ?? 0) * 12 / 1000).toFixed(0)}k`}  icon="📈" color="#1D9E75" />
        <StatCard label="Churn Rate"  value={`${data?.churn_rate ?? 0}%`}                   icon="📉" color="#E24B4A" />
        <StatCard label="LTV"         value={`$${(data?.ltv ?? 0).toLocaleString()}`}       icon="🏆" color="#EF9F27" />
        <StatCard label="CAC"         value={`$${(data?.cac ?? 0).toLocaleString()}`}        icon="🎯" color="#7F77DD" />
      </div>

      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Payment History</h3>
        <Table
          columns={[
            { key: 'tenant', label: 'Tenant',   render: v => v?.name },
            { key: 'amount', label: 'Amount',   render: v => `$${v}` },
            { key: 'plan',   label: 'Plan',     render: v => <Badge variant="purple">{v}</Badge> },
            { key: 'date',   label: 'Date',     muted: true },
            { key: 'status', label: 'Status',   render: v => <Badge variant="green">{v}</Badge> },
          ]}
          data={data?.payments || []}
        />
      </Card>
    </div>
  )
}

// ─── Support Tickets ──────────────────────────────────────────────────────────
export function SuperTickets() {
  const [page, setPage]   = useState(1)
  const [status, setStatus] = useState('')
  const { data, isLoading, refetch } = useTickets({ page, status, per_page: 15 })

  const resolve = (id) => superAdminApi.resolveTicket(id).then(() => { toast.success('Ticket resolved'); refetch() })

  const columns = [
    { key: 'id',       label: '#',       muted: true },
    { key: 'subject',  label: 'Subject' },
    { key: 'tenant',   label: 'Tenant',  render: v => v?.name, muted: true },
    { key: 'status',   label: 'Status',  render: v => <Badge variant={v === 'open' ? 'amber' : 'green'}>{v}</Badge> },
    { key: 'created_at', label: 'Opened', muted: true },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => row.status === 'open' && (
        <button onClick={() => resolve(id)} style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', color: '#1D9E75', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Mark Resolved</button>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Support Tickets</h1>
        <select className="input-dark" value={status} onChange={e => setStatus(e.target.value)} style={{ width: 160 }}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {isLoading ? <Spinner size={32} /> : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Table columns={columns} data={data?.data || []} />
          {data?.last_page > 1 && <div style={{ padding: 16 }}><Pagination page={page} lastPage={data.last_page} onChange={setPage} /></div>}
        </Card>
      )}
    </div>
  )
}