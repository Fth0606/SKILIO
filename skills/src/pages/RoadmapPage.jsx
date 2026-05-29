import { useNavigate } from 'react-router-dom'
import { Check, Clock, Sparkles, ArrowRight } from 'lucide-react'

const ITEMS = [
  {
    quarter: 'Q1 2026',
    status: 'done',
    label: 'Terminé',
    items: [
      { title: 'Lancement de la plateforme', desc: 'Mise en ligne de SKILIO avec les fonctionnalités de base : profils, matching, réservations.' },
      { title: 'Système de crédits v1', desc: 'Économie interne basée sur les crédits — enseigner pour gagner, apprendre pour dépenser.' },
      { title: 'Tableau de bord étudiant', desc: 'Interface dédiée pour gérer ses séances, crédits et évaluations.' },
      { title: 'Panel administrateur', desc: 'Outils de gestion pour les responsables d\'établissement.' },
    ],
  },
  {
    quarter: 'Q2 2026',
    status: 'in-progress',
    label: 'En cours',
    items: [
      { title: 'Application mobile iOS & Android', desc: 'Réservez une séance depuis n\'importe où. Notifications push en temps réel.' },
      { title: 'Sessions en ligne intégrées', desc: 'Visio-conférence native dans SKILIO — plus besoin de Zoom ou Meet.' },
      { title: 'Certificats vérifiables', desc: 'Générez et partagez des certificats de compétence reconnus par vos partenaires.' },
    ],
  },
  {
    quarter: 'Q3 2026',
    status: 'planned',
    label: 'Planifié',
    items: [
      { title: 'IA de recommandation', desc: 'Un moteur de recommandation personnalisé pour découvrir de nouvelles compétences pertinentes.' },
      { title: 'Groupes et ateliers', desc: 'Sessions collectives jusqu\'à 8 participants. Idéal pour les projets de groupe ou les workshops.' },
      { title: 'Intégrations LMS', desc: 'Connectez SKILIO à Moodle, Canvas ou Blackboard pour synchroniser vos cours.' },
    ],
  },
  {
    quarter: 'Q4 2026',
    status: 'planned',
    label: 'Planifié',
    items: [
      { title: 'Marketplace de ressources', desc: 'Partagez et découvrez des supports pédagogiques : fiches, vidéos, exercices.' },
      { title: 'API publique', desc: 'Construisez vos propres intégrations avec l\'API SKILIO. Documentation complète fournie.' },
      { title: 'Tableaux de bord réseau', desc: 'Visualisez les connexions de compétences à l\'échelle de toute votre université.' },
    ],
  },
]

const STATUS_CONFIG = {
  done: { color: 'var(--primary)', bg: 'rgba(29,158,117,0.1)', border: 'rgba(29,158,117,0.25)', icon: Check },
  'in-progress': { color: 'var(--accent)', bg: 'rgba(239,159,39,0.1)', border: 'rgba(239,159,39,0.25)', icon: Clock },
  planned: { color: 'var(--text-muted)', bg: 'rgba(90,122,106,0.1)', border: 'rgba(90,122,106,0.2)', icon: Sparkles },
}

export default function RoadmapPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Roadmap
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 20, lineHeight: 1.15 }}>
            L'avenir de <span style={{ color: 'var(--primary)' }}>SKILIO</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.75, fontWeight: 500 }}>
            Découvrez ce que nous construisons pour vous. Transparence totale sur nos priorités et notre calendrier.
          </p>
        </div>
      </section>

      {/* Legend */}
      <div style={{ padding: '0 20px 40px', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 999 }}>
            <cfg.icon size={14} style={{ color: cfg.color }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{key === 'done' ? 'Terminé' : key === 'in-progress' ? 'En cours' : 'Planifié'}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <section style={{ padding: '0 20px 100px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {ITEMS.map((quarter, qi) => {
            const cfg = STATUS_CONFIG[quarter.status]
            return (
              <div key={qi} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 0, marginBottom: 60, position: 'relative' }}>
                {/* Quarter label */}
                <div style={{ paddingTop: 4, paddingRight: 32 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: cfg.color, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 8 }}>{quarter.quarter}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 8 }}>
                    <cfg.icon size={11} style={{ color: cfg.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{quarter.label}</span>
                  </div>
                  {/* Vertical connector */}
                  {qi < ITEMS.length - 1 && (
                    <div style={{ width: 2, background: `linear-gradient(${cfg.color}, var(--border))`, height: 'calc(100% + 60px)', position: 'absolute', left: 159, top: 24, zIndex: 0 }} />
                  )}
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {quarter.items.map((item, ii) => (
                    <div key={ii} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'border-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = cfg.border}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <cfg.icon size={13} style={{ color: cfg.color }} />
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, fontWeight: 500 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Feature request CTA */}
      <section style={{ padding: '60px 20px', background: 'var(--surface)', borderTop: '1.5px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: 'var(--text-main)', marginBottom: 14 }}>
            Une idée de fonctionnalité ?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 28, fontWeight: 500, lineHeight: 1.7 }}>
            Nous construisons SKILIO avec nos utilisateurs. Partagez vos idées, votez pour les fonctionnalités qui vous tiennent à cœur.
          </p>
          <button onClick={() => navigate('/contact')} className="btn-primary" style={{ padding: '13px 30px', fontSize: 15, fontWeight: 700, borderRadius: 12 }}>
            Suggérer une fonctionnalité <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
          </button>
        </div>
      </section>
    </div>
  )
}
