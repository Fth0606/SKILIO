import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, Search, ArrowRight, MessageCircle, BookOpen, Zap, Users } from 'lucide-react'

const CATEGORIES = [
  { icon: Zap, label: 'Premiers pas', color: 'var(--primary)' },
  { icon: Users, label: 'Sessions', color: 'var(--accent)' },
  { icon: BookOpen, label: 'Crédits', color: 'var(--primary)' },
  { icon: MessageCircle, label: 'Compte & profil', color: 'var(--accent)' },
]

const FAQ = [
  {
    category: 'Premiers pas',
    q: 'Comment créer un compte SKILIO ?',
    a: 'Rendez-vous sur skilio.app/register et inscrivez-vous avec votre email universitaire. Votre établissement doit être partenaire SKILIO. Si ce n\'est pas le cas, encouragez votre administration à nous contacter.',
  },
  {
    category: 'Premiers pas',
    q: 'Quel matériel faut-il pour utiliser SKILIO ?',
    a: 'Uniquement un navigateur web moderne (Chrome, Firefox, Safari, Edge). Pour les sessions en ligne, un microphone et une webcam sont recommandés mais pas obligatoires.',
  },
  {
    category: 'Sessions',
    q: 'Comment réserver une session avec un enseignant ?',
    a: 'Allez dans "Trouver une compétence", recherchez la compétence souhaitée, choisissez un enseignant, sélectionnez un créneau disponible et confirmez la réservation. Vous recevrez une notification de confirmation.',
  },
  {
    category: 'Sessions',
    q: 'Que se passe-t-il si un enseignant annule ?',
    a: 'Si l\'enseignant annule moins de 2h avant la séance, vous récupérez intégralement vos crédits et recevez un bon de priorité pour la prochaine réservation.',
  },
  {
    category: 'Sessions',
    q: 'Comment se déroule une session en ligne ?',
    a: 'Vous recevez un lien de réunion 15 minutes avant la séance. Cliquez dessus pour rejoindre directement depuis votre navigateur, sans installation requise.',
  },
  {
    category: 'Crédits',
    q: 'Comment gagner des crédits ?',
    a: 'En enseignant ! Chaque heure de cours dispensée vous rapporte entre 8 et 20 crédits selon votre note moyenne et la demande pour votre compétence. Vous pouvez aussi gagner des crédits bonus en parrainant des amis.',
  },
  {
    category: 'Crédits',
    q: 'Combien coûte une session ?',
    a: 'Entre 5 et 20 crédits selon la compétence, la durée (30 min, 1h, 2h) et le niveau. Chaque profil enseignant affiche clairement le coût avant la réservation.',
  },
  {
    category: 'Crédits',
    q: 'Les crédits expirent-ils ?',
    a: 'Les crédits que vous gagnez en enseignant n\'expirent jamais. Les crédits offerts dans le cadre du plan Academy expirent en fin de mois.',
  },
  {
    category: 'Compte & profil',
    q: 'Comment modifier mon profil ?',
    a: 'Dans votre tableau de bord, cliquez sur votre avatar en haut à gauche puis "Modifier le profil". Vous pouvez mettre à jour votre photo, bio, compétences et disponibilités.',
  },
  {
    category: 'Compte & profil',
    q: 'Comment supprimer mon compte ?',
    a: 'Envoyez-nous un email à fthalmh0@gmail.com avec "Suppression de compte" en objet. Nous traitons les demandes sous 72h. Vos données sont intégralement supprimées sous 30 jours.',
  },
]

export default function HelpPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Tous')

  const filtered = FAQ.filter(item => {
    const matchSearch = search === '' || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'Tous' || item.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Centre d'aide
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24, lineHeight: 1.15 }}>
            Comment pouvons-nous <span style={{ color: 'var(--primary)' }}>vous aider ?</span>
          </h1>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px 14px 46px',
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 14, color: 'var(--text-main)', fontSize: 15,
                fontFamily: 'var(--font-sans)', fontWeight: 500, outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '0 20px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {['Tous', ...CATEGORIES.map(c => c.label)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', transition: 'all 0.2s', border: '1.5px solid',
                borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border)',
                background: activeCategory === cat ? 'rgba(29,158,117,0.12)' : 'transparent',
                color: activeCategory === cat ? 'var(--primary)' : 'var(--text-muted)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 20px 80px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Search size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
              <div style={{ fontSize: 18, fontWeight: 600 }}>Aucun résultat</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>Essayez d'autres mots-clés ou <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/contact')}>contactez-nous</span></div>
            </div>
          ) : (
            filtered.map((item, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '20px 0', background: 'none', border: 'none', color: 'var(--text-main)', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: 'var(--font-sans)', textAlign: 'left' }}
                >
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'rgba(29,158,117,0.1)', padding: '2px 8px', borderRadius: 6, marginRight: 10 }}>{item.category}</span>
                    {item.q}
                  </div>
                  {openFaq === i ? <ChevronUp size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75, fontWeight: 500, paddingBottom: 20, margin: 0 }}>{item.a}</p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Still need help */}
      <section style={{ padding: '60px 20px', background: 'var(--surface)', borderTop: '1.5px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginBottom: 14 }}>Vous n'avez pas trouvé votre réponse ?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, fontWeight: 500, marginBottom: 28 }}>
            Notre équipe répond à toutes les questions sous 24h ouvrées.
          </p>
          <button onClick={() => navigate('/contact')} className="btn-primary" style={{ padding: '13px 30px', fontSize: 15, fontWeight: 700, borderRadius: 12 }}>
            Contacter le support <ArrowRight size={15} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
          </button>
        </div>
      </section>
    </div>
  )
}
