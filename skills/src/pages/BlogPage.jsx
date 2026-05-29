import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, User } from 'lucide-react'

const CATEGORIES = ['Tous', 'Actualités', 'Conseils', 'Témoignages', 'Produit']

const POSTS = [
  {
    tag: 'Actualités',
    title: 'SKILIO franchit le cap des 28 000 étudiants actifs',
    excerpt: 'Deux ans après son lancement, la plateforme connaît une croissance exponentielle avec l\'arrivée de 12 nouvelles universités partenaires en Europe et en Afrique.',
    author: 'Équipe SKILIO',
    date: '15 mai 2026',
    readTime: '3 min',
    featured: true,
    color: 'var(--primary)',
  },
  {
    tag: 'Conseils',
    title: '7 conseils pour devenir un excellent enseignant sur SKILIO',
    excerpt: 'Les meilleurs enseignants de la plateforme partagent leurs secrets : comment structurer une séance, adapter son discours et obtenir 5 étoiles à chaque fois.',
    author: 'Sara Ouazzani',
    date: '8 mai 2026',
    readTime: '6 min',
    color: 'var(--accent)',
  },
  {
    tag: 'Témoignages',
    title: 'Comment Yasmine a financé ses études en enseignant Python',
    excerpt: 'Étudiante en informatique à l\'Université Mohammed V, Yasmine a gagné suffisamment de crédits pour couvrir tous ses besoins pédagogiques en une seule année.',
    author: 'Yasmine B.',
    date: '2 mai 2026',
    readTime: '4 min',
    color: 'var(--primary)',
  },
  {
    tag: 'Produit',
    title: 'Nouvelles fonctionnalités : sessions de groupe et certificats',
    excerpt: 'Nous lançons aujourd\'hui deux fonctionnalités très attendues : les ateliers collectifs jusqu\'à 8 participants et les certificats de compétence téléchargeables.',
    author: 'Khalid Benali',
    date: '28 avril 2026',
    readTime: '5 min',
    color: 'var(--accent)',
  },
  {
    tag: 'Conseils',
    title: 'Les 10 compétences les plus demandées en 2026',
    excerpt: 'Python, Machine Learning, Communication orale, Design UI/UX... Découvrez quelles compétences sont les plus recherchées sur SKILIO ce semestre.',
    author: 'Équipe SKILIO',
    date: '20 avril 2026',
    readTime: '4 min',
    color: 'var(--primary)',
  },
  {
    tag: 'Témoignages',
    title: 'L\'EM Lyon a augmenté l\'engagement de 40% avec SKILIO',
    excerpt: 'Témoignage de l\'administrateur de l\'EM Lyon sur comment SKILIO a transformé la culture d\'apprentissage au sein de leur établissement.',
    author: 'Jean-Marc Leclerc',
    date: '14 avril 2026',
    readTime: '7 min',
    color: 'var(--accent)',
  },
]

export default function BlogPage() {
  const navigate = useNavigate()

  const featured = POSTS.find(p => p.featured)
  const rest = POSTS.filter(p => !p.featured)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Blog
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,54px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 18, lineHeight: 1.15 }}>
            Actualités & <span style={{ color: 'var(--primary)' }}>Ressources</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.75, fontWeight: 500 }}>
            Conseils, témoignages, nouvelles fonctionnalités et réflexions sur l'avenir de l'apprentissage.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '0 20px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Featured post */}
          {featured && (
            <div style={{ background: 'var(--surface)', border: '2px solid rgba(29,158,117,0.25)', borderRadius: 24, padding: '40px', marginBottom: 48, display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(29,158,117,0.25)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ background: 'rgba(29,158,117,0.15)', color: 'var(--primary)', fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 999, letterSpacing: '0.5px' }}>{featured.tag}</span>
                  <span style={{ background: 'rgba(239,159,39,0.15)', color: 'var(--accent)', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>À la une</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, marginBottom: 14, lineHeight: 1.25 }}>{featured.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, fontWeight: 500, marginBottom: 20 }}>{featured.excerpt}</p>
                <div style={{ display: 'flex', gap: 20, color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><User size={13} />{featured.author}</span>
                  <span>{featured.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} />{featured.readTime} de lecture</span>
                </div>
              </div>
              <div style={{ flexShrink: 0, width: 48, height: 48, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={20} style={{ color: 'var(--primary)' }} />
              </div>
            </div>
          )}

          {/* Posts grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {rest.map((post, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <span style={{ background: post.color === 'var(--accent)' ? 'rgba(239,159,39,0.12)' : 'rgba(29,158,117,0.12)', color: post.color, fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 999, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {post.tag}
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: 17, fontWeight: 800, margin: '16px 0 10px', lineHeight: 1.35 }}>{post.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7, fontWeight: 500, marginBottom: 20 }}>{post.excerpt}</p>
                <div style={{ display: 'flex', gap: 16, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={11} />{post.author}</span>
                  <span>{post.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{post.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
