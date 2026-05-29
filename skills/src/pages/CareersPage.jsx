import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Clock, Zap, Globe, Heart, Users } from 'lucide-react'

const PERKS = [
  { icon: Globe, title: 'Télétravail total', desc: 'Travaillez de n\'importe où dans le monde. Nos équipes sont réparties sur 8 pays.' },
  { icon: Zap, title: 'Impact réel', desc: 'Chaque ligne de code aide des dizaines de milliers d\'étudiants à apprendre.' },
  { icon: Heart, title: 'Équipe soudée', desc: 'Une culture de bienveillance, de partage et de curiosité intellectuelle.' },
  { icon: Users, title: 'Croissance rapide', desc: 'Rejoignez une startup en hypercroissance et évoluez vite.' },
]

const JOBS = [
  {
    title: 'Développeur Full-Stack Senior',
    team: 'Ingénierie',
    type: 'Temps plein',
    location: 'Remote',
    desc: 'Construire et faire évoluer la plateforme SKILIO. Stack : React, Laravel, PostgreSQL.',
    tags: ['React', 'Laravel', 'PostgreSQL'],
    color: 'var(--primary)',
  },
  {
    title: 'Designer UX/UI',
    team: 'Produit',
    type: 'Temps plein',
    location: 'Remote / Casablanca',
    desc: 'Créer des expériences d\'apprentissage belles et intuitives pour des milliers d\'étudiants.',
    tags: ['Figma', 'Design System', 'Recherche UX'],
    color: 'var(--accent)',
  },
  {
    title: 'Responsable Partenariats Universitaires',
    team: 'Business',
    type: 'Temps plein',
    location: 'Paris / Remote',
    desc: 'Développer notre réseau d\'universités partenaires en France et en Europe francophone.',
    tags: ['B2B', 'Education', 'Négociation'],
    color: 'var(--primary)',
  },
  {
    title: 'Data Scientist',
    team: 'Ingénierie',
    type: 'Temps plein',
    location: 'Remote',
    desc: 'Améliorer notre algorithme de matching et développer des modèles prédictifs de succès pédagogique.',
    tags: ['Python', 'ML', 'A/B Testing'],
    color: 'var(--accent)',
  },
  {
    title: 'Community Manager',
    team: 'Marketing',
    type: 'Temps partiel',
    location: 'Remote',
    desc: 'Animer notre communauté sur les réseaux sociaux et créer du contenu éducatif inspirant.',
    tags: ['Social Media', 'Copywriting', 'Education'],
    color: 'var(--primary)',
  },
]

export default function CareersPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ On recrute !
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,58px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24, lineHeight: 1.15 }}>
            Construisez l'avenir de <span style={{ color: 'var(--primary)' }}>l'apprentissage</span> avec nous
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.8, fontWeight: 500, marginBottom: 40 }}>
            Rejoignez une équipe passionnée qui croit que chaque étudiant mérite d'apprendre et d'enseigner dans un environnement bienveillant.
          </p>
          <div style={{ display: 'inline-flex', gap: 8, background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 12, padding: '12px 20px', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>5 postes ouverts</span> — Télétravail possible partout
          </div>
        </div>
      </section>

      {/* Perks */}
      <section style={{ padding: '0 20px 80px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {PERKS.map((p, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '24px 22px' }}>
              <div style={{ width: 44, height: 44, background: 'rgba(29,158,117,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <p.icon size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{p.title}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, fontWeight: 500 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Job listings */}
      <section style={{ padding: '0 20px 100px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 40, textAlign: 'center' }}>Postes ouverts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {JOBS.map((job, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => navigate('/contact')}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(29,158,117,0.35)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
              >
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ background: job.color === 'var(--accent)' ? 'rgba(239,159,39,0.12)' : 'rgba(29,158,117,0.12)', color: job.color, fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>{job.team}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}><Clock size={11} />{job.type}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}><MapPin size={11} />{job.location}</span>
                  </div>
                  <h3 style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: 18, marginBottom: 8, fontFamily: 'var(--font-sans)' }}>{job.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, fontWeight: 500, marginBottom: 14 }}>{job.desc}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {job.tags.map(tag => (
                      <span key={tag} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 6 }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div style={{ flexShrink: 0, width: 40, height: 40, background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={18} style={{ color: 'var(--primary)' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Spontaneous application */}
          <div style={{ marginTop: 40, background: 'linear-gradient(135deg, rgba(29,158,117,0.06), rgba(239,159,39,0.04))', border: '1px dashed rgba(29,158,117,0.3)', borderRadius: 20, padding: '32px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: 20, marginBottom: 10, fontFamily: 'var(--font-sans)' }}>Candidature spontanée</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, fontWeight: 500, marginBottom: 24 }}>
              Vous ne trouvez pas de poste qui vous correspond mais vous croyez en notre mission ? Envoyez-nous votre CV et une lettre de motivation.
            </p>
            <button onClick={() => navigate('/contact')} className="btn-primary" style={{ padding: '12px 28px', fontSize: 14, fontWeight: 700, borderRadius: 12 }}>
              Candidature spontanée <ArrowRight size={15} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
