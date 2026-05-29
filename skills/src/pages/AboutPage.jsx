import { useNavigate } from 'react-router-dom'
import { Users, Globe, Award, ArrowRight, Heart } from 'lucide-react'

const STATS = [
  { value: '28K+', label: 'Étudiants actifs' },
  { value: '47+', label: 'Universités partenaires' },
  { value: '1 200+', label: 'Compétences disponibles' },
  { value: '98%', label: 'Satisfaction étudiante' },
]

const VALUES = [
  { icon: Users, title: 'Communauté avant tout', desc: 'Chaque fonctionnalité est pensée pour renforcer les liens entre étudiants. L\'apprentissage est un acte social.' },
  { icon: Globe, title: 'Accessibilité universelle', desc: 'Le savoir n\'a pas de prix. Notre modèle de crédits garantit que chaque étudiant peut apprendre, quelle que soit sa situation.' },
  { icon: Award, title: 'Excellence pédagogique', desc: 'Nous croyons que les meilleurs enseignants sont souvent ceux qui ont appris récemment. La passion se transmet.' },
  { icon: Heart, title: 'Impact réel', desc: 'Nous mesurons notre succès aux connexions créées, aux compétences acquises et aux amitiés nées sur la plateforme.' },
]

const TEAM = [
  { name: 'Fatiha Almohamed', role: 'Fondatrice & CEO', initials: 'FA', color: 'var(--primary)' },
  { name: 'Khalid Benali', role: 'CTO', initials: 'KB', color: 'var(--accent)' },
  { name: 'Sara Ouazzani', role: 'Head of Product', initials: 'SO', color: 'var(--primary)' },
  { name: 'Younes Tazi', role: 'Head of Growth', initials: 'YT', color: 'var(--accent)' },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Notre histoire
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,58px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 28, lineHeight: 1.15 }}>
            Nous croyons que <span style={{ color: 'var(--primary)' }}>chaque étudiant a quelque chose à enseigner</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1.8, fontWeight: 500 }}>
            SKILIO est né d'une conviction simple : les universités regorgent de talents cachés. Des milliers d'étudiants maîtrisent des compétences que leurs pairs cherchent à apprendre. Il suffisait de créer le pont.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 20px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 44, fontWeight: 900, color: 'var(--primary)', lineHeight: 1, marginBottom: 10 }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '80px 20px', background: 'var(--surface)', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>Notre mission</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24, lineHeight: 1.2 }}>
              Libérer le potentiel pédagogique de chaque campus
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.8, fontWeight: 500, marginBottom: 20 }}>
              Fondée en 2025, SKILIO a commencé avec une poignée d'universités marocaines et une idée : transformer les étudiants en enseignants de leurs propres pairs.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.8, fontWeight: 500 }}>
              Aujourd'hui, nous connectons 28 000+ étudiants dans 47 établissements à travers le monde, créant chaque jour des milliers d'échanges de savoirs.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { num: '156K+', label: 'Séances complétées' },
              { num: '4.8/5', label: 'Note moyenne' },
              { num: '2025', label: 'Année de création' },
              { num: '12', label: 'Pays couverts' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 900, color: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)', marginBottom: 6 }}>{item.num}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 12 }}>Nos valeurs</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500 }}>Les principes qui guident chaque décision que nous prenons.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 24px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ width: 44, height: 44, background: 'rgba(29,158,117,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <v.icon size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 16, marginBottom: 10, fontFamily: 'var(--font-sans)' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '0 20px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 12 }}>L'équipe fondatrice</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {TEAM.map((member, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 24px', textAlign: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${member.color}, var(--accent))`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  {member.initials}
                </div>
                <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{member.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, marginBottom: 16 }}>Rejoignez l'aventure</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 36, fontWeight: 500, lineHeight: 1.7 }}>
            Vous partagez notre vision ? Rejoignez-nous en tant qu'étudiant, institution partenaire, ou membre de l'équipe.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{ padding: '13px 30px', background: '#fff', color: 'var(--primary)', fontWeight: 800, borderRadius: 12, fontSize: 14, cursor: 'pointer', border: 'none', fontFamily: 'var(--font-sans)' }}>
              Créer un compte
            </button>
            <button onClick={() => navigate('/careers')} style={{ padding: '13px 30px', background: 'transparent', border: '2px solid rgba(255,255,255,0.6)', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#fff'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'}
            >
              Voir les offres d'emploi
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
