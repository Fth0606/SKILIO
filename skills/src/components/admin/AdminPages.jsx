import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import {
  useAdminAnalytics, useAdminUsers, useAdminSkills,
  useBranding, useSaveBranding, useBilling, useUpgradePlan,
  useSuspendUser, useActivateUser,
} from '../../hooks/useApi'
import { adminAPI as adminApi } from '../../services/api'
import {
  Card, StatCard, Table, Pagination, Modal, Badge,
  StatusBadge, EmptyState, Spinner, ProgressBar, FloatingInput
} from '../ui'
import toast from 'react-hot-toast'

// ─── Tenant Admin Analytics ───────────────────────────────────────────────────
export function AdminAnalytics() {
  const { data, isLoading } = useAdminAnalytics()

  if (isLoading) return <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div>
  if (!data) return <EmptyState icon="📊" title="Aucune donnée analytique" />

  const CHART = {
    style: { fontSize: 12, fill: 'var(--text-muted)', fontWeight: 600 },
    tooltip: {
      contentStyle: { background: 'var(--glass-bg)', border: '1px solid var(--border)', borderRadius: 12, backdropFilter: 'blur(10px)' },
      labelStyle: { color: 'var(--text-main)', fontWeight: 700 },
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Analytiques</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24, marginBottom: 40 }}>
        <StatCard label="Total Utilisateurs"    value={data.total_users}          icon="👥" />
        <StatCard label="Utilisateurs Actifs"   value={data.active_users}         icon="✅" color="var(--primary)" />
        <StatCard label="Séances / mois"  value={data.sessions_this_month}  icon="📅" color="var(--accent)" />
        <StatCard label="Crédits Échangés" value={`${data.credits_exchanged} DH`} icon="💳" color="var(--primary-light)" />
        <StatCard label="Taux de réussite"   value={`${data.completion_rate}%`} icon="🏆" color="#22c55e" />
      </div>

      {/* User quota */}
      <Card style={{ marginBottom: 32, borderRadius: 24, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'baseline' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Quota d'utilisateurs</h3>
          <span className="badge badge-purple">Forfait {data.plan?.name}</span>
        </div>
        <ProgressBar value={data.total_users} max={data.plan?.max_users || 1000} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
        {/* Sessions per week */}
        <Card style={{ borderRadius: 24, padding: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Séances par semaine</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.sessions_chart || []}>
              <XAxis dataKey="week" tick={CHART.style} axisLine={false} tickLine={false} />
              <YAxis tick={CHART.style} axisLine={false} tickLine={false} />
              <Tooltip {...CHART.tooltip} />
              <Bar dataKey="count" fill="var(--primary)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Popular skills */}
        <Card style={{ borderRadius: 24, padding: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Compétences populaires</h3>
          {data.popular_skills?.map(skill => (
            <div key={skill.name} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{skill.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>{skill.count} séances</span>
              </div>
              <ProgressBar value={skill.count} max={data.popular_skills[0]?.count || 1} color="var(--accent)" />
            </div>
          ))}
        </Card>
      </div>

      <button className="btn-secondary" style={{ padding: '12px 24px', fontWeight: 700 }} onClick={async () => {
        const res = await adminApi.exportReport()
        const url = URL.createObjectURL(new Blob([res.data]))
        const a = document.createElement('a'); a.href = url; a.download = 'rapport-skilio.csv'; a.click()
        toast.success('Rapport exporté !')
      }}>
        ↓ Exporter le rapport CSV
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
  const suspendUser  = useSuspendUser()
  const activateUser = useActivateUser()

  const handleInvite = async (e) => {
    e.preventDefault()
    await adminApi.inviteUser({ email: inviteEmail, role: inviteRole })
    toast.success(`Invitation envoyée à ${inviteEmail}`)
    setInviteModal(false)
    setInviteEmail('')
  }

  const handleBulkCsv = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    await adminApi.bulkImport(file)
    toast.success('Étudiants importés !')
    refetch()
  }

  const suspend  = (id) => suspendUser.mutate(id)
  const activate = (id) => activateUser.mutate(id)

  const columns = [
    { key: 'name',       label: 'Nom' },
    { key: 'email',      label: 'Email',  muted: true },
    { key: 'role',       label: 'Rôle',   render: v => <Badge variant={v === 'tenant_admin' ? 'purple' : 'green'}>{v === 'tenant_admin' ? 'Admin' : 'Étudiant'}</Badge> },
    { key: 'credits',    label: 'Crédits', render: v => `${v} DH`, muted: true },
    { key: 'status',     label: 'Statut', render: v => <Badge variant={v === 'active' ? 'green' : 'red'}>{v === 'active' ? 'Actif' : 'Suspendu'}</Badge> },
    {
      key: 'id', label: '',
      render: (id, row) => (
        row.status === 'active'
          ? <button onClick={() => suspend(id)}  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '6px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Suspendre</button>
          : <button onClick={() => activate(id)} style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Activer</button>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Gestion des utilisateurs</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <label className="btn-secondary" style={{ cursor: 'pointer', padding: '12px 20px', fontWeight: 700 }}>
            ↑ Import CSV
            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleBulkCsv} />
          </label>
          <button className="btn-primary" style={{ padding: '12px 24px', fontWeight: 800 }} onClick={() => setInviteModal(true)}>+ Inviter un utilisateur</button>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <input className="input-premium" placeholder="Rechercher des utilisateurs…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ maxWidth: 350 }} />
      </div>

      {isLoading ? <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div> : (
        <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 24 }}>
          <div style={{ padding: '24px' }}>
            <Table columns={columns} data={data?.data || []} />
          </div>
          {data?.last_page > 1 && <div style={{ padding: 24, borderTop: '1px solid var(--border)' }}><Pagination page={page} lastPage={data.last_page} onChange={setPage} /></div>}
        </Card>
      )}

      <Modal open={inviteModal} onClose={() => setInviteModal(false)} title="Inviter un utilisateur">
        <form onSubmit={handleInvite}>
          <FloatingInput label="Email" id="invite-email" type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder=" " />
          <div style={{ marginBottom: 32 }}>
            <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Rôle</label>
            <select className="input-premium" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
              <option value="student">Étudiant</option>
              <option value="tenant_admin">Administrateur</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, padding: 14, borderRadius: 16 }} onClick={() => setInviteModal(false)}>Annuler</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: 14, borderRadius: 16 }}>Envoyer l'invitation →</button>
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

  const approve = (id) => adminApi.approveSkill(id).then(() => { toast.success('Compétence approuvée'); refetch() })
  const hide    = (id) => adminApi.hideSkill(id).then(() => { toast.success('Compétence masquée'); refetch() })

  const columns = [
    { key: 'name',     label: 'Compétence' },
    { key: 'category', label: 'Catégorie', muted: true },
    { key: 'level',    label: 'Niveau',    render: v => <Badge variant="purple">{v}</Badge> },
    { key: 'offered_by', label: 'Enseignant', render: v => v?.name, muted: true },
    { key: 'status',   label: 'Statut',  render: v => {
        const variants = { approved: 'green', pending: 'amber', hidden: 'red' };
        const labels = { approved: 'Approuvée', pending: 'En attente', hidden: 'Masquée' };
        return <Badge variant={variants[v] || 'gray'}>{labels[v] || v}</Badge>
    }},
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {row.status !== 'approved' && <button onClick={() => approve(id)} style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Approuver</button>}
          {row.status !== 'hidden'   && <button onClick={() => hide(id)}    style={{ background: 'var(--shadow-color)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Masquer</button>}
        </div>
      )
    }
  ]

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Gestion des compétences</h1>
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

// ─── Branding ─────────────────────────────────────────────────────────────────
export function AdminBranding() {
  const { data: branding, isLoading } = useBranding()
  const saveBranding = useSaveBranding()
  const [form, setForm] = useState({ institution_name: '', primary_color: '#6366F1', logo_url: '', welcome_message: '' })

  // Sync form when data loads
  useEffect(() => { if (branding) setForm(branding) }, [branding])

  const COLORS = ['#6366F1','#FF6B6B','#0F6E56','#A51C30','#002147','#7F77DD','#EF9F27']

  const handleSave = (e) => {
    e.preventDefault()
    saveBranding.mutate(form)
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const res = await adminApi.uploadLogo(file)
    setForm(f => ({ ...f, logo_url: res.data.data.url }))
    toast.success('Logo téléchargé !')
  }

  if (isLoading) return <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div>

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Personnalisation de marque</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500, marginBottom: 40 }}>Personnalisez l'apparence de la plateforme pour votre établissement</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <form onSubmit={handleSave}>
          <Card style={{ padding: 32, borderRadius: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Paramètres</h3>

            <FloatingInput label="Nom de l'établissement" id="inst-name" value={form.institution_name} onChange={e => setForm(f => ({ ...f, institution_name: e.target.value }))} placeholder=" " />

            <div style={{ marginBottom: 24 }}>
              <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 12, fontWeight: 700 }}>Couleur principale</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, primary_color: c }))}
                    style={{ width: 36, height: 36, borderRadius: 10, background: c, cursor: 'pointer', border: form.primary_color === c ? '3px solid var(--text-main)' : '2px solid transparent', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                ))}
                <input type="color" value={form.primary_color} onChange={e => setForm(f => ({ ...f, primary_color: e.target.value }))}
                  style={{ width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'none', padding: 0 }} />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 12, fontWeight: 700 }}>Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {form.logo_url && <img src={form.logo_url} alt="logo" style={{ height: 50, objectFit: 'contain', borderRadius: 8, padding: 8, background: 'var(--shadow-color)' }} />}
                <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-block', padding: '10px 20px', fontWeight: 700 }}>
                  ↑ Télécharger le logo
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                </label>
              </div>
            </div>

            <div className="input-group">
              <textarea className="input-premium" id="welcome-msg" rows={3} value={form.welcome_message} onChange={e => setForm(f => ({ ...f, welcome_message: e.target.value }))} placeholder=" " />
              <label htmlFor="welcome-msg" className="floating-label">Message de bienvenue</label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 16, fontWeight: 800, marginTop: 10 }} disabled={saveBranding.isLoading}>
              {saveBranding.isLoading ? <Spinner size={20} /> : 'Enregistrer et appliquer →'}
            </button>
          </Card>
        </form>

        {/* Live preview */}
        <Card style={{ padding: 32, borderRadius: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Aperçu en direct</h3>
          <div style={{ background: 'var(--bg)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 20px 40px var(--shadow-color)' }}>
            {/* Preview nav */}
            <div style={{ background: 'var(--surface)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
              {form.logo_url
                ? <img src={form.logo_url} style={{ height: 28, objectFit: 'contain' }} alt="logo" />
                : <div style={{ width: 28, height: 28, borderRadius: 6, background: form.primary_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>⇄</div>
              }
              <span style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: 16 }}>{form.institution_name || 'Votre établissement'}</span>
            </div>
            {/* Preview hero */}
            <div style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: 24, marginBottom: 12, fontFamily: 'var(--font-heading)' }}>
                {form.institution_name || 'Votre établissement'} SKILIO
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 24, fontWeight: 500 }}>{form.welcome_message || 'Votre message de bienvenue apparaîtra ici'}</p>
              <button style={{ background: form.primary_color, color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, cursor: 'default', fontWeight: 800, fontSize: 14, boxShadow: `0 10px 20px ${form.primary_color}33` }}>
                Démarrer
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
  const upgradePlan = useUpgradePlan()
  
  const [paymentModal, setPaymentModal] = useState(null) // Holds plan name to upgrade to

  if (isLoading) return <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div>

  const plans = [
    { name: 'Starter',    price: 0,   users: 50,   features: ['Mise en relation de base', 'Réservation de séances', 'Notifications par email'] },
    { name: 'Academy',    price: 99,  users: 500,  features: ['Marque blanche', 'Sous-domaine personnalisé', 'Analytiques avancées', '5 administrateurs'] },
    { name: 'Enterprise', price: 299, users: 99999, features: ['SSO/SAML', 'Accès API', 'SLA', 'Manager dédié'] },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Abonnement et facturation</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500, marginBottom: 40 }}>Gérez votre forfait et téléchargez vos factures</p>

      {/* Current plan */}
      <Card style={{ marginBottom: 32, borderRadius: 24, padding: 32, border: '2px solid var(--primary)', background: 'var(--shadow-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>ABONNEMENT ACTUEL</div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>{data?.plan?.name || 'Starter'}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4, fontWeight: 600 }}>
              {data?.users_count} / {data?.plan?.max_users} utilisateurs · Renouvellement le {data?.renews_at}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>{data?.plan?.price || 0} DH<span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/mois</span></div>
          </div>
        </div>
      </Card>

      {/* Plan selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, marginBottom: 40 }}>
        {plans.map(plan => (
          <div key={plan.name} className="card glass" style={{ padding: 32, borderRadius: 28, border: data?.plan?.name === plan.name ? '2px solid var(--primary)' : '1px solid var(--border)', transform: data?.plan?.name === plan.name ? 'scale(1.02)' : 'none' }}>
            {data?.plan?.name === plan.name && <span className="badge badge-green" style={{ marginBottom: 16 }}>Forfait actuel</span>}
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--text-main)' }}>{plan.name}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)', marginBottom: 16, fontFamily: 'var(--font-heading)' }}>{plan.price} DH<span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/mois</span></div>
            <div style={{ color: 'var(--text-main)', fontSize: 14, marginBottom: 20, fontWeight: 700 }}>Jusqu'à {plan.users === 99999 ? 'Illimité' : plan.users} utilisateurs</div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 24 }}>
                {plan.features.map(f => <div key={f} style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 10, fontWeight: 500 }}>✓ {f}</div>)}
            </div>
            {data?.plan?.name !== plan.name && (
              <button className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 16, fontWeight: 800 }}
                onClick={() => setPaymentModal(plan.name)}>
                {plan.price > (data?.plan?.price || 0) ? 'Améliorer' : 'Rétrograder'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Invoices */}
      <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 24 }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Factures</h3>
        </div>
        <div style={{ padding: '24px' }}>
            {data?.invoices?.length ? (
            <Table
                columns={[
                { key: 'period', label: 'Période' },
                { key: 'amount', label: 'Montant', render: v => `${v} DH` },
                { key: 'status', label: 'Statut', render: v => <Badge variant="green">{v === 'paid' ? 'Payée' : v}</Badge> },
                { key: 'id', label: '', render: id => <button className="btn-secondary" style={{ padding: '6px 16px', fontSize: 12, fontWeight: 700 }} onClick={() => adminApi.downloadInvoice(id)}>↓ PDF</button> }
                ]}
                data={data.invoices}
            />
            ) : <EmptyState icon="🧾" title="Aucune facture pour l'instant" desc="Les factures apparaîtront ici après votre premier cycle de facturation" />}
        </div>
      </Card>

      {/* Payment Modal Detailed */}
      <Modal open={!!paymentModal} onClose={() => setPaymentModal(null)} title={`Mise à niveau vers ${paymentModal}`}>
        <form onSubmit={(e) => {
          e.preventDefault()
          upgradePlan.mutate(paymentModal, {
            onSuccess: () => setPaymentModal(null)
          })
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Mode de paiement</h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Nom complet</label>
            <input required type="text" className="input-premium" defaultValue="" placeholder="Votre nom" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Pays ou région</label>
            <select className="input-premium">
              <option>Maroc</option>
              <option>France</option>
              <option>Canada</option>
              <option>Autre</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Adresse - Ligne 1</label>
            <input required type="text" className="input-premium" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Numéro de carte</label>
            <div style={{ position: 'relative' }}>
              <input required type="text" className="input-premium" placeholder="1234 1234 1234 1234" maxLength="19" />
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
                <div style={{ width: 30, height: 20, background: '#ff5f00', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', width: 16, height: 16, background: '#eb001b', borderRadius: '50%', left: -2, top: 2 }}></div>
                  <div style={{ position: 'absolute', width: 16, height: 16, background: '#f79e1b', borderRadius: '50%', right: -2, top: 2 }}></div>
                </div>
                <div style={{ width: 30, height: 20, background: '#1A1F71', borderRadius: 3, color: '#fff', fontSize: 8, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>VISA</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Date d'expiration</label>
              <input required type="text" className="input-premium" placeholder="MM / AA" maxLength="5" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Code de sécurité</label>
              <input required type="text" className="input-premium" placeholder="CVC" maxLength="4" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <input type="checkbox" id="diff-name" style={{ marginTop: 4 }} />
            <label htmlFor="diff-name" style={{ fontSize: 13, color: 'var(--text-main)', cursor: 'pointer' }}>Utiliser un nom différent sur les factures</label>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 32 }}>
            <input required type="checkbox" id="accept-terms" style={{ marginTop: 4 }} defaultChecked />
            <label htmlFor="accept-terms" style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, cursor: 'pointer' }}>
              Vous acceptez que SKILIO débite votre carte du montant indiqué ({plans.find(p => p.name === paymentModal)?.price || 0} DH) maintenant et de manière récurrente jusqu'à ce que vous annuliez conformément à nos conditions. Vous pouvez annuler à tout moment dans les paramètres de votre compte.
            </label>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 12, fontWeight: 800, fontSize: 16 }} disabled={upgradePlan.isLoading}>
            {upgradePlan.isLoading ? <Spinner size={20} /> : "S'abonner"}
          </button>
        </form>
      </Modal>
    </div>
  )
}
