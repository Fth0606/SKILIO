import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import {
  useAdminAnalytics, useAdminUsers, useAdminSkills,
  useBranding, useSaveBranding, useBilling,
} from '../../hooks/useApi'
import { adminAPI as adminApi, adminAPI as usersApi, adminAPI as skillsApi } from '../../services/api'
import {
  Card, StatCard, Table, Pagination, Modal, Badge,
  StatusBadge, EmptyState, Spinner, ProgressBar
} from '../ui'
import toast from 'react-hot-toast'

// ─── Tenant Admin Analytics ───────────────────────────────────────────────────
export function AdminAnalytics() {
  const { data, isLoading } = useAdminAnalytics()

  if (isLoading) return <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={36} /></div>
  if (!data) return <EmptyState icon="📊" title="No analytics data" />

  const CHART = {
    style: { fontSize: 12, fill: '#5a7a6a' },
    tooltip: {
      contentStyle: { background: '#111814', border: '1px solid #1e2b24', borderRadius: 8 },
      labelStyle: { color: '#fff' },
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Users"    value={data.total_users}          icon="👥" />
        <StatCard label="Active Users"   value={data.active_users}         icon="✅" color="#1D9E75" />
        <StatCard label="Sessions / mo"  value={data.sessions_this_month}  icon="📅" color="#EF9F27" />
        <StatCard label="Credits Exchanged" value={data.credits_exchanged} icon="💳" color="#7F77DD" />
        <StatCard label="Completion Rate"   value={`${data.completion_rate}%`} icon="🏆" color="#22c55e" />
      </div>

      {/* User quota */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>User Quota</h3>
          <span style={{ color: '#5a7a6a', fontSize: 13 }}>{data.plan?.name} Plan</span>
        </div>
        <ProgressBar value={data.total_users} max={data.plan?.max_users || 1000} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Sessions per week */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Sessions per Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.sessions_chart || []}>
              <XAxis dataKey="week" tick={CHART.style} axisLine={false} tickLine={false} />
              <YAxis tick={CHART.style} axisLine={false} tickLine={false} />
              <Tooltip {...CHART.tooltip} />
              <Bar dataKey="count" fill="#1D9E75" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Popular skills */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Popular Skills</h3>
          {data.popular_skills?.map(skill => (
            <div key={skill.name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13 }}>{skill.name}</span>
                <span style={{ color: '#5a7a6a', fontSize: 12 }}>{skill.count} sessions</span>
              </div>
              <ProgressBar value={skill.count} max={data.popular_skills[0]?.count || 1} />
            </div>
          ))}
        </Card>
      </div>

      <button className="btn-secondary" onClick={async () => {
        const res = await adminApi.exportReport()
        const url = URL.createObjectURL(new Blob([res.data]))
        const a = document.createElement('a'); a.href = url; a.download = 'skillswap-report.csv'; a.click()
        toast.success('Report exported!')
      }}>
        ↓ Export CSV Report
      </button>
    </div>
  )
}

// ─── User Management ──────────────────────────────────────────────────────────
export function AdminUsers() {
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [inviteModal, setInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole]   = useState('student')

  const { data, isLoading, refetch } = useAdminUsers({ search, page, per_page: 15 })

  const handleInvite = async (e) => {
    e.preventDefault()
    await usersApi.inviteUser({ email: inviteEmail, role: inviteRole })
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteModal(false)
    setInviteEmail('')
  }

  const handleBulkCsv = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const form = new FormData(); form.append('file', file)
    await usersApi.bulkImport(file)
    toast.success('Students imported!')
    refetch()
  }

  const suspend  = (id) => usersApi.suspendUser(id).then(() => { toast.success('User suspended'); refetch() })
  const activate = (id) => usersApi.activateUser(id).then(() => { toast.success('User activated'); refetch() })

  const columns = [
    { key: 'name',       label: 'Name' },
    { key: 'email',      label: 'Email',  muted: true },
    { key: 'role',       label: 'Role',   render: v => <Badge variant={v === 'tenant_admin' ? 'purple' : 'green'}>{v}</Badge> },
    { key: 'credits',    label: 'Credits', muted: true },
    { key: 'status',     label: 'Status', render: v => <Badge variant={v === 'active' ? 'green' : 'red'}>{v}</Badge> },
    {
      key: 'id', label: '',
      render: (id, row) => (
        row.status === 'active'
          ? <button onClick={() => suspend(id)}  style={{ background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', color: '#E24B4A', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Suspend</button>
          : <button onClick={() => activate(id)} style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', color: '#1D9E75', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Activate</button>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>User Management</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            ↑ Bulk CSV
            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleBulkCsv} />
          </label>
          <button className="btn-primary" onClick={() => setInviteModal(true)}>+ Invite User</button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input className="input-dark" placeholder="Search users…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ maxWidth: 320 }} />
      </div>

      {isLoading ? <div style={{ textAlign: 'center', padding: 60 }}><Spinner size={32} /></div> : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Table columns={columns} data={data?.data || []} />
          {data?.last_page > 1 && <div style={{ padding: 16 }}><Pagination page={page} lastPage={data.last_page} onChange={setPage} /></div>}
        </Card>
      )}

      <Modal open={inviteModal} onClose={() => setInviteModal(false)} title="Invite a User">
        <form onSubmit={handleInvite}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Email</label>
            <input className="input-dark" type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="student@university.edu" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Role</label>
            <select className="input-dark" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="tenant_admin">Admin</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setInviteModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Send Invitation →</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// ─── Skill Management ─────────────────────────────────────────────────────────
export function AdminSkills() {
  const [page, setPage] = useState(1)
  const { data, isLoading, refetch } = useAdminSkills({ page, per_page: 15 })

  const approve = (id) => skillsApi.approveSkill(id).then(() => { toast.success('Skill approved'); refetch() })
  const hide    = (id) => skillsApi.hideSkill(id).then(() => { toast.success('Skill hidden'); refetch() })

  const columns = [
    { key: 'name',     label: 'Skill' },
    { key: 'category', label: 'Category', muted: true },
    { key: 'level',    label: 'Level',    render: v => <Badge variant="purple">{v}</Badge> },
    { key: 'offered_by', label: 'Teacher', render: v => v?.name, muted: true },
    { key: 'status',   label: 'Status',  render: v => <Badge variant={v === 'approved' ? 'green' : v === 'pending' ? 'amber' : 'red'}>{v}</Badge> },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          {row.status !== 'approved' && <button onClick={() => approve(id)} style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', color: '#1D9E75', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Approve</button>}
          {row.status !== 'hidden'   && <button onClick={() => hide(id)}    style={{ background: 'rgba(136,135,128,0.1)', border: '1px solid #1e2b24', color: '#888780', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Hide</button>}
        </div>
      )
    }
  ]

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Skill Management</h1>
      {isLoading ? <Spinner size={32} /> : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Table columns={columns} data={data?.data || []} />
          {data?.last_page > 1 && <div style={{ padding: 16 }}><Pagination page={page} lastPage={data.last_page} onChange={setPage} /></div>}
        </Card>
      )}
    </div>
  )
}

// ─── Branding ─────────────────────────────────────────────────────────────────
export function AdminBranding() {
  const { data: branding, isLoading } = useBranding()
  const saveBranding = useSaveBranding()
  const [form, setForm] = useState({ institution_name: '', primary_color: '#0F6E56', logo_url: '', welcome_message: '' })

  // Sync form when data loads
  useEffect(() => { if (branding) setForm(branding) }, [branding])

  const COLORS = ['#0F6E56','#A51C30','#002147','#7F77DD','#EF9F27','#1e40af','#7c3aed']

  const handleSave = (e) => {
    e.preventDefault()
    saveBranding.mutate(form)
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('logo', file)
    const res = await adminApi.uploadLogo(fd)
    setForm(f => ({ ...f, logo_url: res.data.url }))
    toast.success('Logo uploaded!')
  }

  if (isLoading) return <Spinner />

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>White-Label Branding</h1>
      <p style={{ color: '#5a7a6a', marginBottom: 28 }}>Customize your platform's appearance for your institution</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <form onSubmit={handleSave}>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Settings</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Institution Name</label>
              <input className="input-dark" value={form.institution_name} onChange={e => setForm(f => ({ ...f, institution_name: e.target.value }))} placeholder="Harvard University" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 8 }}>Primary Color</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, primary_color: c }))}
                    style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: 'pointer', border: form.primary_color === c ? '2px solid #fff' : '2px solid transparent', transition: 'border 0.15s' }} />
                ))}
                <input type="color" value={form.primary_color} onChange={e => setForm(f => ({ ...f, primary_color: e.target.value }))}
                  style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none', padding: 0 }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Logo</label>
              {form.logo_url && <img src={form.logo_url} alt="logo" style={{ height: 40, marginBottom: 8, objectFit: 'contain' }} />}
              <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                ↑ Upload Logo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
              </label>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Welcome Message</label>
              <textarea className="input-dark" rows={3} value={form.welcome_message} onChange={e => setForm(f => ({ ...f, welcome_message: e.target.value }))} placeholder="Welcome to SkillSwap! Exchange knowledge with your peers." style={{ resize: 'vertical' }} />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={saveBranding.isLoading}>
              {saveBranding.isLoading ? <Spinner size={16} /> : 'Save & Apply to All Pages →'}
            </button>
          </Card>
        </form>

        {/* Live preview */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Live Preview</h3>
          <div style={{ background: '#0a0f0d', borderRadius: 12, overflow: 'hidden', border: '1px solid #1e2b24' }}>
            {/* Preview nav */}
            <div style={{ background: '#111814', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              {form.logo_url
                ? <img src={form.logo_url} style={{ height: 24, objectFit: 'contain' }} alt="logo" />
                : <div style={{ width: 24, height: 24, borderRadius: 4, background: form.primary_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>⇄</div>
              }
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{form.institution_name || 'Your Institution'}</span>
            </div>
            {/* Preview hero */}
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                {form.institution_name || 'Your Institution'} SkillSwap
              </div>
              <p style={{ color: '#5a7a6a', fontSize: 13, marginBottom: 16 }}>{form.welcome_message || 'Welcome message will appear here'}</p>
              <button style={{ background: form.primary_color, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'default', fontWeight: 600, fontSize: 13 }}>
                Get Started
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Billing ──────────────────────────────────────────────────────────────────
export function AdminBilling() {
  const { data, isLoading } = useBilling()

  if (isLoading) return <Spinner />

  const plans = [
    { name: 'Starter',    price: 0,   users: 50,   features: ['Basic matching', 'Session booking', 'Email notifications'] },
    { name: 'Academy',    price: 99,  users: 500,  features: ['White-labeling', 'Custom subdomain', 'Advanced analytics', '5 admins'] },
    { name: 'Enterprise', price: 299, users: 99999, features: ['SSO/SAML', 'API access', 'SLA', 'Dedicated manager'] },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Subscription & Billing</h1>
      <p style={{ color: '#5a7a6a', marginBottom: 28 }}>Manage your plan and download invoices</p>

      {/* Current plan */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#5a7a6a', fontSize: 12, marginBottom: 4 }}>CURRENT PLAN</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{data?.plan?.name || 'Starter'}</div>
            <div style={{ color: '#5a7a6a', fontSize: 13 }}>
              {data?.users_count} / {data?.plan?.max_users} users · renews {data?.renews_at}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1D9E75' }}>${data?.plan?.price || 0}<span style={{ fontSize: 14, color: '#5a7a6a' }}>/mo</span></div>
          </div>
        </div>
      </Card>

      {/* Plan selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
        {plans.map(plan => (
          <div key={plan.name} className="card" style={{ padding: 20, border: data?.plan?.name === plan.name ? '2px solid #1D9E75' : '1px solid #1e2b24' }}>
            {data?.plan?.name === plan.name && <span className="badge badge-green" style={{ marginBottom: 10, display: 'inline-block' }}>Current Plan</span>}
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{plan.name}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1D9E75', marginBottom: 4 }}>${plan.price}<span style={{ fontSize: 12, color: '#5a7a6a' }}>/mo</span></div>
            <div style={{ color: '#5a7a6a', fontSize: 12, marginBottom: 12 }}>Up to {plan.users === 99999 ? 'Unlimited' : plan.users} users</div>
            {plan.features.map(f => <div key={f} style={{ color: '#5a7a6a', fontSize: 12, marginBottom: 6 }}>✓ {f}</div>)}
            {data?.plan?.name !== plan.name && (
              <button className="btn-primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
                onClick={() => { toast.success(`Upgrading to ${plan.name}… (redirect to Stripe)`) }}>
                {plan.price > (data?.plan?.price || 0) ? 'Upgrade' : 'Downgrade'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Invoices */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Invoices</h3>
        {data?.invoices?.length ? (
          <Table
            columns={[
              { key: 'period', label: 'Period' },
              { key: 'amount', label: 'Amount', render: v => `$${v}` },
              { key: 'status', label: 'Status', render: v => <Badge variant="green">{v}</Badge> },
              { key: 'id', label: '', render: id => <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => adminApi.downloadInvoice(id)}>↓ PDF</button> }
            ]}
            data={data.invoices}
          />
        ) : <EmptyState icon="🧾" title="No invoices yet" desc="Invoices appear here after your first billing cycle" />}
      </Card>
    </div>
  )
}