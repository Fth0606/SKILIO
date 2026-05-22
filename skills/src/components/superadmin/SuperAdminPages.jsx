import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import {
  usePlatformStats, useTenants, useCreateTenant,
  useSuspendTenant, usePlans, useRevenue, useTickets,
} from '../../hooks/useApi'
import { superAdminAPI as superAdminApi } from '../../services/api'
import { Card, StatCard, Table, Pagination, Modal, Badge, EmptyState, Spinner, FloatingInput } from '../ui'
import toast from 'react-hot-toast'

const CHART = {
  tick: { fontSize: 12, fill: 'var(--text-muted)', fontWeight: 600 },
  tooltip: {
    contentStyle: { background: 'var(--glass-bg)', border: '1px solid var(--border)', borderRadius: 12, backdropFilter: 'blur(10px)' },
    labelStyle: { color: 'var(--text-main)', fontWeight: 700 },
  }
}

// ─── Platform Dashboard ───────────────────────────────────────────────────────
export function SuperDashboard() {
  const { data, isLoading } = usePlatformStats()
  const { data: revenue }   = useRevenue()

  if (isLoading) return <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div>

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Tableau de bord plateforme</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500 }}>Super Administrateur · Aperçu Global</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 24, marginBottom: 40 }}>
        <StatCard label="Total Établissements"  value={data?.total_tenants  || 0}      icon="🏫" color="var(--primary-light)" />
        <StatCard label="Total Utilisateurs"    value={data?.total_users?.toLocaleString() || '0'} icon="👥" />
        <StatCard label="Séances"       value={data?.total_sessions?.toLocaleString() || '0'} icon="📅" color="var(--accent)" />
        <StatCard label="MRR"            value={`${(data?.mrr || 0).toLocaleString()} DH`}    icon="💰" color="var(--primary)" />
        <StatCard label="Taux d'attrition"     value={`${data?.churn_rate || 0}%`}    icon="📉" color="#ef4444" />
        <StatCard label="LTV"            value={`${(data?.ltv || 0).toLocaleString()} DH`}           icon="📈" color="var(--primary)" />
        <StatCard label="CAC"            value={`${(data?.cac || 0).toLocaleString()} DH`}            icon="🎯" color="var(--accent)" />
        <StatCard label="Total Crédits"  value={(data?.credits_total || 0).toLocaleString()} icon="💳" color="var(--primary-light)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
        {/* MRR chart */}
        <Card style={{ padding: 32, borderRadius: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Revenus récurrents mensuels (MRR)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenue?.mrr_chart || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={CHART.tick} axisLine={false} />
              <YAxis tick={CHART.tick} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip {...CHART.tooltip} formatter={v => [`${v.toLocaleString()} DH`, 'MRR']} />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Sessions chart */}
        <Card style={{ padding: 32, borderRadius: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Séances par mois</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenue?.sessions_chart || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={CHART.tick} axisLine={false} />
              <YAxis tick={CHART.tick} axisLine={false} />
              <Tooltip {...CHART.tooltip} />
              <Bar dataKey="count" fill="var(--primary-light)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card style={{ padding: 32, borderRadius: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Prévisions de revenus</h3>
          <span className="badge badge-purple">Prochains 3 mois</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {(Array.isArray(revenue?.forecast) ? revenue.forecast : (typeof revenue?.forecast === 'object' && revenue?.forecast !== null ? [revenue.forecast] : [
            { month: 'Juin', mrr: 56000, sessions: 14200 },
            { month: 'Juillet', mrr: 61000, sessions: 15800 },
            { month: 'Août', mrr: 67000, sessions: 17200 },
        ])).map(f => (
            <div key={f.month} style={{ background: 'var(--shadow-color)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>{f.month}</div>
            <div style={{ color: 'var(--primary)', fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{((f.mrr || 0)/1000).toFixed(0)}k DH</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginTop: 4 }}>{f.sessions?.toLocaleString()} séances</div>
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
    { key: 'name',       label: 'Établissement' },
    { key: 'subdomain',  label: 'Sous-domaine',  render: v => <span style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 700 }}>{v}.skilio.com</span> },
    { key: 'plan',       label: 'Forfait',       render: v => <Badge variant="purple">{v?.name}</Badge> },
    { key: 'users_count',label: 'Utilisateurs',      muted: true },
    { key: 'sessions_count', label: 'Séances', muted: true },
    { key: 'status',     label: 'Statut',     render: v => <Badge variant={v === 'active' ? 'green' : 'red'}>{v === 'active' ? 'Actif' : 'Suspendu'}</Badge> },
    {
      key: 'actions_tenant', label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => superAdminApi.tenantUsageStats(row.id).then(r => toast.success(JSON.stringify(r.data.data)))}
            style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '6px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>Stats</button>
          {row.status === 'active'
            ? <button onClick={() => suspendTenant.mutate(row.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '6px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>Suspendre</button>
            : <button onClick={() => superAdminApi.activateTenant(row.id)} style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '6px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>Activer</button>
          }
        </div>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>Gestion des établissements</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500 }}>Toutes les institutions sur la plateforme</p>
        </div>
        <button className="btn-primary" style={{ padding: '12px 24px', fontWeight: 800 }} onClick={() => setModal(true)}>+ Créer un établissement</button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <input className="input-premium" placeholder="Rechercher des établissements…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ maxWidth: 350 }} />
      </div>

      {isLoading ? <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div> : (
        <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 24 }}>
          <div style={{ padding: '24px' }}>
            <Table columns={columns} data={data?.data || []} />
          </div>
          {data?.last_page > 1 && <div style={{ padding: 24, borderTop: '1px solid var(--border)' }}><Pagination page={page} lastPage={data.last_page} onChange={setPage} /></div>}
        </Card>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Créer un établissement" width={520}>
        <form onSubmit={handleCreate}>
          <FloatingInput label="Nom de l'institution" id="tenant-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder=" " required />
          <FloatingInput label="Sous-domaine (ex: harvard)" id="tenant-sub" value={form.subdomain} onChange={e => setForm(p => ({ ...p, subdomain: e.target.value }))} placeholder=" " required />
          <FloatingInput label="Nom de l'administrateur" id="tenant-admin-name" value={form.admin_name} onChange={e => setForm(p => ({ ...p, admin_name: e.target.value }))} placeholder=" " required />
          <FloatingInput label="Email de l'administrateur" id="tenant-admin-email" type="email" value={form.admin_email} onChange={e => setForm(p => ({ ...p, admin_email: e.target.value }))} placeholder=" " required />

          <div style={{ marginBottom: 32 }}>
            <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Forfait</label>
            <select className="input-premium" required value={form.plan_id} onChange={e => setForm(p => ({ ...p, plan_id: e.target.value }))}>
              <option value="">Sélectionner un forfait…</option>
              {plans?.map(p => <option key={p.id} value={p.id}>{p.name} — {p.price} DH/mois</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, padding: 14, borderRadius: 16 }} onClick={() => setModal(false)}>Annuler</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: 14, borderRadius: 16 }} disabled={createTenant.isLoading}>
              {createTenant.isLoading ? <Spinner size={20} /> : 'Créer et Activer →'}
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
    toast.success('Forfait mis à jour !')
    setEditing(null)
    refetch()
  }

  const publish = async (id) => {
    await superAdminApi.publishPlan(id)
    toast.success('Forfait publié !')
    refetch()
  }

  if (isLoading) return <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div>

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40 }}>Gestion des forfaits</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 32 }}>
        {plans?.map(plan => (
          <Card key={plan.id} style={{ position: 'relative', padding: 32, borderRadius: 28 }} className="card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>{plan.name}</div>
              <Badge variant={plan.published ? 'green' : 'amber'}>{plan.published ? 'En ligne' : 'Brouillon'}</Badge>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>{plan.price} DH<span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/mois</span></div>
            <div style={{ color: 'var(--text-main)', fontSize: 14, marginBottom: 24, fontWeight: 700 }}>Jusqu'à {plan.max_users === -1 ? '∞' : plan.max_users} utilisateurs</div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 32 }}>
                {Array.isArray(plan.features) ? plan.features.map(f => (
                  <div key={f} style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 10, fontWeight: 500 }}>✓ {f}</div>
                )) : (plan.features && typeof plan.features === 'object' ? Object.entries(plan.features).map(([k, v]) => (
                  <div key={k} style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 10, fontWeight: 500 }}>✓ {k.replace(/_/g, ' ')}: {v ? 'Oui' : 'Non'}</div>
                )) : (typeof plan.features === 'string' ? plan.features.split(',').map(f => (
                  <div key={f} style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 10, fontWeight: 500 }}>✓ {f.trim()}</div>
                )) : null))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1, fontSize: 13, padding: '12px 0', borderRadius: 12, fontWeight: 700 }} onClick={() => setEditing(plan)}>Modifier</button>
              {!plan.published && <button className="btn-primary" style={{ flex: 1, fontSize: 13, padding: '12px 0', justifyContent: 'center', borderRadius: 12, fontWeight: 800 }} onClick={() => publish(plan.id)}>Publier</button>}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Modifier ${editing?.name}`}>
        {editing && (
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Prix (DH/mois)</label>
              <input className="input-premium" type="number" name="price" defaultValue={editing.price} required />
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Max Utilisateurs (-1 = illimité)</label>
              <input className="input-premium" type="number" name="max_users" defaultValue={editing.max_users} required />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, padding: 14, borderRadius: 16 }} onClick={() => setEditing(null)}>Annuler</button>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: 14, borderRadius: 16 }}>Enregistrer →</button>
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

  if (isLoading) return <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div>

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40 }}>Revenus</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24, marginBottom: 40 }}>
        <StatCard label="MRR"         value={`${(data?.mrr || 0).toLocaleString()} DH`}    icon="💰" color="var(--primary)" />
        <StatCard label="ARR"         value={`${((data?.mrr || 0)*12/1000).toFixed(0)}k DH`}  icon="📈" color="var(--primary)" />
        <StatCard label="Attrition"  value={`${data?.churn_rate || 0}%`}                   icon="📉" color="#ef4444" />
        <StatCard label="LTV"         value={`${(data?.ltv || 0).toLocaleString()} DH`}       icon="🏆" color="var(--accent)" />
        <StatCard label="CAC"         value={`${(data?.cac || 0).toLocaleString()} DH`}        icon="🎯" color="var(--primary-light)" />
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 24 }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Historique des paiements</h3>
        </div>
        <div style={{ padding: '24px' }}>
            <Table
            columns={[
                { key: 'tenant', label: 'Établissement',   render: v => v?.name },
                { key: 'amount', label: 'Montant',   render: v => `${v} DH` },
                { key: 'plan',   label: 'Forfait',     render: v => <Badge variant="purple">{v}</Badge> },
                { key: 'date',   label: 'Date',     muted: true },
                { key: 'status', label: 'Statut',   render: v => <Badge variant="green">{v === 'paid' ? 'Payé' : v}</Badge> },
            ]}
            data={data?.payments || []}
            />
        </div>
      </Card>
    </div>
  )
}

// ─── Support Tickets ──────────────────────────────────────────────────────────
export function SuperTickets() {
  const [page, setPage]   = useState(1)
  const [status, setStatus] = useState('')
  const { data, isLoading, refetch } = useTickets({ page, status, per_page: 15 })

  const resolve = (id) => superAdminApi.resolveTicket(id).then(() => { toast.success('Ticket résolu'); refetch() })

  const columns = [
    { key: 'id_display', label: '#', render: (_, row) => row.id, muted: true },
    { key: 'subject',  label: 'Sujet' },
    { key: 'tenant',   label: 'Établissement',  render: v => v?.name, muted: true },
    { key: 'status',   label: 'Statut',  render: v => <Badge variant={v === 'open' ? 'amber' : 'green'}>{v === 'open' ? 'Ouvert' : 'Résolu'}</Badge> },
    { key: 'created_at', label: 'Ouvert le', muted: true },
    {
      key: 'actions_ticket', label: 'Actions',
      render: (_, row) => row.status === 'open' && (
        <button onClick={() => resolve(row.id)} style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Marquer comme résolu</button>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Tickets support</h1>
        <select className="input-premium" value={status} onChange={e => setStatus(e.target.value)} style={{ width: 200 }}>
          <option value="">Tous les statuts</option>
          <option value="open">Ouvert</option>
          <option value="resolved">Résolu</option>
        </select>
      </div>

      {isLoading ? <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div> : (
        <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 24 }}>
          <div style={{ padding: '24px' }}>
            <Table columns={columns} data={data?.data || []} />
          </div>
          {data?.last_page > 1 && <div style={{ padding: 24, borderTop: '1px solid var(--border)' }}><Pagination page={page} lastPage={data.last_page} onChange={setPage} /></div>}
        </Card>
      )}
    </div>
  )
}
