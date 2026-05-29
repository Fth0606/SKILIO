import { useNavigate } from 'react-router-dom'
import { Zap, Shield, Users, BookOpen, Star, Globe, Clock, TrendingUp, Award, MessageCircle, BarChart2, Check, ArrowRight } from 'lucide-react'

const FEATURES = [
  { icon: Users, color: 'var(--primary)', title: 'Matching intelligent', desc: 'Notre algorithme connecte les étudiants avec les meilleurs enseignants selon leurs besoins, disponibilités et affinités pédagogiques.' },
  { icon: Zap, color: 'var(--accent)', title: 'Système de crédits', desc: 'Enseignez une compétence, gagnez des crédits. Utilisez-les pour apprendre autre chose. Une économie circulaire de la connaissance.' },
  { icon: Clock, color: 'var(--primary)', title: 'Réservation instantanée', desc: 'Planifiez des séances en quelques secondes. Synchronisation automatique avec votre emploi du temps universitaire.' },
  { icon: Star, color: 'var(--accent)', title: 'Évaluations vérifiées', desc: 'Chaque séance se conclut par une évaluation bidirectionnelle. Construisez votre réputation, améliorez votre enseignement.' },
  { icon: Shield, color: 'var(--primary)', title: 'Environnement sécurisé', desc: 'Comptes vérifiés par votre institution. Toutes les interactions restent dans l\'écosystème universitaire.' },
  { icon: Globe, color: 'var(--accent)', title: '1 200+ compétences', desc: 'Des langues à la programmation, en passant par la musique et les mathématiques. Toute connaissance a de la valeur.' },
  { icon: TrendingUp, color: 'var(--primary)', title: 'Suivi de progression', desc: 'Visualisez votre évolution, identifiez vos points forts et les domaines où vous pouvez encore grandir.' },
  { icon: BookOpen, color: 'var(--accent)', title: 'Ressources partagées', desc: 'Chaque enseignant peut partager des supports pédagogiques. Créez ensemble une bibliothèque communautaire.' },
  { icon: BarChart2, color: 'var(--primary)', title: 'Analytics avancés', desc: 'Pour les administrateurs : tableaux de bord complets sur l\'engagement, les compétences populaires et l\'impact pédagogique.' },
]

const HOW = [
  { step: '01', title: 'Créez votre profil', desc: 'Inscrivez-vous avec votre email universitaire, renseignez vos compétences et vos centres d\'intérêt.' },
  { step: '02', title: 'Trouvez ou proposez', desc: 'Cherchez un enseignant pour ce que vous voulez apprendre, ou proposez vos propres compétences à la communauté.' },
  { step: '03', title: 'Apprenez ensemble', desc: 'Réservez une séance, rencontrez-vous, échangez. Chacun repart avec quelque chose de nouveau.' },
]

export default function FeaturesPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28, letterSpacing: '0.5px' }}>
            ✦ Fonctionnalités
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,58px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24, lineHeight: 1.15 }}>
            Tout ce dont vous avez besoin<br />
            <span style={{ color: 'var(--primary)' }}>pour apprendre ensemble</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1.75, fontWeight: 500, maxWidth: 560, margin: '0 auto 40px' }}>
            SKILIO réunit les outils essentiels pour créer une communauté d'apprentissage vivante au sein de votre université.
          </p>
          <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '14px 36px', fontSize: 15, fontWeight: 700, borderRadius: 12 }}>
            Commencer gratuitement <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
          </button>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '0 20px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 28px 32px', transition: 'all 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ width: 48, height: 48, background: `rgba(29,158,117,${f.color === 'var(--accent)' ? '0' : '0.1'})`, ...(f.color === 'var(--accent)' ? { background: 'rgba(239,159,39,0.1)' } : {}), borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <h3 style={{ color: 'var(--text-main)', fontSize: 17, fontWeight: 700, marginBottom: 10, fontFamily: 'var(--font-sans)' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 20px', background: 'var(--surface)', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Comment ça marche ?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, marginBottom: 60, fontWeight: 500 }}>Trois étapes simples pour rejoindre la communauté SKILIO.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {HOW.map((s, i) => (
              <div key={i} style={{ textAlign: 'left', padding: '32px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 48, fontWeight: 900, color: 'var(--primary)', opacity: 0.3, lineHeight: 1, marginBottom: 16 }}>{s.step}</div>
                <h3 style={{ color: 'var(--text-main)', fontSize: 18, fontWeight: 700, marginBottom: 12, fontFamily: 'var(--font-sans)' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 20px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'radial-gradient(circle at 25% 50%, #fff 0%, transparent 50%), radial-gradient(circle at 75% 50%, #fff 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, marginBottom: 20 }}>Prêt à découvrir SKILIO ?</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 17, marginBottom: 40, fontWeight: 500 }}>Rejoignez 28 000+ étudiants qui apprennent et enseignent chaque jour.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '14px 36px', background: '#fff', color: 'var(--primary)', fontWeight: 800, borderRadius: 12, fontSize: 15 }}>
              Commencer gratuitement
            </button>
            <button onClick={() => navigate('/pricing')} style={{ padding: '14px 36px', background: 'transparent', border: '2px solid rgba(255,255,255,0.6)', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)' }}
            >
              Voir les tarifs
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
