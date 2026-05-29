import { CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SERVICES = [
  { name: 'Plateforme web', status: 'operational', uptime: '99.98%' },
  { name: 'API & Backend', status: 'operational', uptime: '99.95%' },
  { name: 'Authentification', status: 'operational', uptime: '100%' },
  { name: 'Réservations', status: 'operational', uptime: '99.97%' },
  { name: 'Sessions vidéo', status: 'operational', uptime: '99.89%' },
  { name: 'Notifications', status: 'operational', uptime: '99.99%' },
  { name: 'Paiements & Crédits', status: 'operational', uptime: '100%' },
  { name: 'Stockage fichiers', status: 'operational', uptime: '99.96%' },
]

const INCIDENTS = [
  {
    date: '12 mai 2026',
    title: 'Latence accrue sur les réservations',
    status: 'resolved',
    duration: '18 min',
    desc: 'Une surcharge temporaire du serveur de base de données a causé des délais de réponse de 2 à 8 secondes sur la fonctionnalité de réservation. Résolu par un redimensionnement automatique.',
  },
  {
    date: '3 avril 2026',
    title: 'Envoi d\'emails retardé',
    status: 'resolved',
    duration: '45 min',
    desc: 'Notre fournisseur d\'emails a subi une interruption de service. Les notifications ont été retardées mais aucune n\'a été perdue.',
  },
]

const UPTIME = [
  { month: 'Nov', value: 99.97 },
  { month: 'Déc', value: 100 },
  { month: 'Jan', value: 99.94 },
  { month: 'Fév', value: 100 },
  { month: 'Mar', value: 99.98 },
  { month: 'Avr', value: 99.95 },
  { month: 'Mai', value: 99.99 },
]

export default function StatusPage() {
  const navigate = useNavigate()
  const allOperational = SERVICES.every(s => s.status === 'operational')

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Statut des services
          </div>

          {/* Global status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 0 4px rgba(29,158,117,0.25)', animation: 'pulse 2s ease infinite' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: allOperational ? 'var(--primary)' : 'var(--accent)', margin: 0 }}>
              {allOperational ? 'Tous les systèmes opérationnels' : 'Perturbations en cours'}
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, fontWeight: 500 }}>
            Dernière vérification : il y a 2 minutes
          </p>
        </div>
      </section>

      <section style={{ padding: '0 20px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Services list */}
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Services</h2>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', marginBottom: 48 }}>
            {SERVICES.map((service, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px', borderBottom: i < SERVICES.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 15 }}>{service.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>Disponibilité 90j : <strong style={{ color: 'var(--primary)', fontWeight: 800 }}>{service.uptime}</strong></span>
                  <span style={{ background: 'rgba(29,158,117,0.12)', color: 'var(--primary)', fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 999 }}>
                    Opérationnel
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Uptime chart */}
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Disponibilité (7 derniers mois)</h2>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px', marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, marginBottom: 8 }}>
              {UPTIME.map((u, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}>{u.value}%</span>
                  <div style={{ width: '100%', background: `linear-gradient(180deg, var(--primary), rgba(29,158,117,0.4))`, borderRadius: '4px 4px 0 0', height: `${(u.value - 99) * 1000}%`, minHeight: 20 }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {UPTIME.map((u, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{u.month}</div>
              ))}
            </div>
          </div>

          {/* Incident history */}
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Historique des incidents</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {INCIDENTS.map((inc, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <CheckCircle size={15} style={{ color: 'var(--primary)' }} />
                      <span style={{ background: 'rgba(29,158,117,0.1)', color: 'var(--primary)', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 999 }}>Résolu</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>{inc.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}><Clock size={11} />{inc.duration}</span>
                    </div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 15 }}>{inc.title}</div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65, fontWeight: 500, margin: 0 }}>{inc.desc}</p>
              </div>
            ))}
            <div style={{ background: 'rgba(29,158,117,0.04)', border: '1px solid rgba(29,158,117,0.15)', borderRadius: 14, padding: '20px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>
              ✓ Aucun autre incident au cours des 90 derniers jours
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
