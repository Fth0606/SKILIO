import { useNavigate } from 'react-router-dom'
import { ArrowRight, Download, ExternalLink, Mail } from 'lucide-react'

const PRESS_RELEASES = [
  {
    date: '15 mai 2026',
    title: 'SKILIO lève 2,5 M€ pour accélérer son déploiement en Europe',
    source: 'Communiqué officiel',
    color: 'var(--primary)',
  },
  {
    date: '10 mars 2026',
    title: 'SKILIO s\'associe à 12 nouvelles universités en France et en Belgique',
    source: 'Communiqué officiel',
    color: 'var(--accent)',
  },
  {
    date: '5 janvier 2026',
    title: 'SKILIO atteint 20 000 étudiants actifs et annonce son expansion internationale',
    source: 'Communiqué officiel',
    color: 'var(--primary)',
  },
]

const COVERAGE = [
  { outlet: 'Le Monde', title: 'Ces startups qui réinventent l\'apprentissage universitaire', date: 'Avril 2026' },
  { outlet: 'Forbes Maroc', title: 'SKILIO, la plateforme qui transforme chaque étudiant en prof', date: 'Mars 2026' },
  { outlet: 'TechCrunch FR', title: 'EdTech : SKILIO lève 2,5M€ pour son modèle d\'économie circulaire du savoir', date: 'Mai 2026' },
  { outlet: 'L\'Étudiant', title: 'Comment gagner des crédits en enseignant sur SKILIO ?', date: 'Février 2026' },
]

export default function PressPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Presse
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,54px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 20, lineHeight: 1.15 }}>
            SKILIO dans <span style={{ color: 'var(--primary)' }}>les médias</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.75, fontWeight: 500, marginBottom: 32 }}>
            Retrouvez nos communiqués de presse, notre kit média et les articles publiés sur SKILIO.
          </p>
          <a href="mailto:fthalmh0@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 12, color: 'var(--primary)', fontWeight: 700, fontSize: 14, textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(29,158,117,0.2)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(29,158,117,0.1)'; e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)' }}
          >
            <Mail size={15} /> Contact presse : fthalmh0@gmail.com
          </a>
        </div>
      </section>

      <section style={{ padding: '0 20px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>

          {/* Press releases */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginBottom: 28 }}>Communiqués de presse</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {PRESS_RELEASES.map((pr, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>{pr.date}</div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 15, lineHeight: 1.4 }}>{pr.title}</div>
                    <div style={{ marginTop: 8 }}>
                      <span style={{ background: pr.color === 'var(--accent)' ? 'rgba(239,159,39,0.1)' : 'rgba(29,158,117,0.1)', color: pr.color, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{pr.source}</span>
                    </div>
                  </div>
                  <Download size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Media coverage */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginBottom: 28 }}>Revue de presse</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {COVERAGE.map((item, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ background: 'rgba(29,158,117,0.1)', color: 'var(--primary)', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>{item.outlet}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>{item.date}</span>
                    </div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 14, lineHeight: 1.4 }}>{item.title}</div>
                  </div>
                  <ExternalLink size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Media kit */}
        <div style={{ maxWidth: 1100, margin: '48px auto 0' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(29,158,117,0.06), rgba(239,159,39,0.04))', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 24, padding: '48px 40px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Kit média</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, fontWeight: 500, marginBottom: 24 }}>
                Accédez à nos logos haute résolution, captures d'écran de la plateforme, éléments visuels et directives de marque pour vos articles et publications.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['Logos SVG / PNG', 'Captures d\'écran', 'Brand guidelines', 'Photos d\'équipe'].map(item => (
                  <span key={item} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, padding: '5px 12px', borderRadius: 8 }}>{item}</span>
                ))}
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <Download size={16} /> Télécharger
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Press contact */}
      <section style={{ padding: '60px 20px', background: 'var(--surface)', borderTop: '1.5px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Contact presse</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 24, fontWeight: 500, lineHeight: 1.7 }}>
            Pour toute demande d'interview, de commentaire ou d'information complémentaire, notre équipe répond sous 24h.
          </p>
          <a href="mailto:fthalmh0@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#fff', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
            <Mail size={16} /> fthalmh0@gmail.com
          </a>
        </div>
      </section>
    </div>
  )
}
