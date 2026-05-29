import { Zap, Check, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const RELEASES = [
  {
    version: 'v1.4.0',
    date: '15 mai 2026',
    type: 'feature',
    highlights: ['Sessions de groupe (jusqu\'à 8 participants)', 'Certificats de compétence téléchargeables en PDF', 'Nouveau tableau de bord de progression', 'Intégration Google Calendar'],
    fixes: ['Correction d\'un bug sur l\'affichage des créneaux', 'Optimisation du temps de chargement des profils'],
  },
  {
    version: 'v1.3.2',
    date: '28 avril 2026',
    type: 'fix',
    highlights: [],
    fixes: ['Correction de l\'envoi de notifications push sur iOS', 'Fix du filtre par langue sur la page de recherche', 'Amélioration de la gestion des fuseaux horaires', 'Correction des avatars qui ne s\'affichaient pas dans certains navigateurs'],
  },
  {
    version: 'v1.3.0',
    date: '10 avril 2026',
    type: 'feature',
    highlights: ['Visio-conférence intégrée (plus besoin de Zoom)', 'Partage d\'écran pendant les sessions', 'Tableau blanc collaboratif', 'Enregistrement des sessions (avec consentement)'],
    fixes: ['Correction de la pagination dans l\'historique des crédits', 'Fix de l\'import CSV des utilisateurs pour les admins'],
  },
  {
    version: 'v1.2.0',
    date: '5 mars 2026',
    type: 'feature',
    highlights: ['Mode clair / sombre', 'Notifications en temps réel', 'Profils publics avec lien partageable', 'Système de parrainage (+10 crédits par filleul)'],
    fixes: ['Correction de l\'authentification SSO pour certains établissements', 'Amélioration des performances sur mobile'],
  },
  {
    version: 'v1.1.0',
    date: '20 février 2026',
    type: 'feature',
    highlights: ['Panel d\'administration des établissements', 'Import en masse d\'utilisateurs via CSV', 'Personnalisation de la marque (logo, couleurs)', 'Module de facturation et gestion des abonnements'],
    fixes: ['Correction du calcul des crédits lors d\'annulations tardives'],
  },
  {
    version: 'v1.0.0',
    date: '15 janvier 2026',
    type: 'launch',
    highlights: ['Lancement officiel de SKILIO', 'Profils étudiants et enseignants', 'Système de crédits bidirectionnel', 'Réservation de séances', 'Évaluations et notes', 'Tableau de bord étudiant'],
    fixes: [],
  },
]

const TYPE_CONFIG = {
  launch: { label: 'Lancement', color: 'var(--accent)', bg: 'rgba(239,159,39,0.12)', border: 'rgba(239,159,39,0.3)' },
  feature: { label: 'Nouvelles fonctionnalités', color: 'var(--primary)', bg: 'rgba(29,158,117,0.1)', border: 'rgba(29,158,117,0.25)' },
  fix: { label: 'Corrections', color: 'var(--text-muted)', bg: 'rgba(90,122,106,0.1)', border: 'rgba(90,122,106,0.2)' },
}

export default function ChangelogPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Changelog
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 18, lineHeight: 1.15 }}>
            Ce qui change dans <span style={{ color: 'var(--primary)' }}>SKILIO</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, fontWeight: 500 }}>
            Chaque version, chaque amélioration, documentée avec transparence.
          </p>
        </div>
      </section>

      {/* Releases */}
      <section style={{ padding: '0 20px 100px' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          {RELEASES.map((release, ri) => {
            const cfg = TYPE_CONFIG[release.type]
            return (
              <div key={ri} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 0, marginBottom: 48, position: 'relative' }}>
                {/* Version + date */}
                <div style={{ paddingRight: 32, paddingTop: 4 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>{release.version}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{release.date}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: cfg.color }}>{cfg.label}</span>
                  </div>
                  {ri < RELEASES.length - 1 && (
                    <div style={{ width: 2, height: 'calc(100% + 48px)', background: 'linear-gradient(var(--border), transparent)', position: 'absolute', left: 139, top: 28 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(29,158,117,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  {release.highlights.length > 0 && (
                    <div style={{ marginBottom: release.fixes.length > 0 ? 20 : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                        <Zap size={14} style={{ color: 'var(--primary)' }} />
                        <span style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Nouveautés</span>
                      </div>
                      {release.highlights.map((h, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                          <div style={{ width: 6, height: 6, background: 'var(--primary)', borderRadius: '50%', flexShrink: 0, marginTop: 7 }} />
                          <span style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {release.fixes.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                        <Check size={14} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Corrections</span>
                      </div>
                      {release.fixes.map((f, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                          <div style={{ width: 6, height: 6, background: 'var(--text-muted)', borderRadius: '50%', flexShrink: 0, marginTop: 7, opacity: 0.5 }} />
                          <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, lineHeight: 1.5, opacity: 0.8 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 20px', background: 'var(--surface)', borderTop: '1.5px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>
            Voir ce qui arrive bientôt
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 24, fontWeight: 500 }}>
            Consultez notre feuille de route pour découvrir les fonctionnalités en cours de développement.
          </p>
          <button onClick={() => navigate('/roadmap')} className="btn-primary" style={{ padding: '12px 28px', fontSize: 14, fontWeight: 700, borderRadius: 12 }}>
            Voir la Roadmap <ArrowRight size={15} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
          </button>
        </div>
      </section>
    </div>
  )
}
