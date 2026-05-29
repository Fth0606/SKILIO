import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Check, ArrowRight, ChevronDown, ChevronUp, Zap, Shield, Users } from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    price: 0,
    period: '',
    desc: 'Pour découvrir SKILIO',
    color: 'var(--primary)',
    features: [
      '10 crédits offerts au départ',
      'Accès à 1 200+ compétences',
      'Réservation de séances',
      'Profil public',
      'Évaluations et notes',
    ],
  },
  {
    name: 'Academy',
    price: 29,
    period: '/ mois',
    desc: 'Pour les universitaires actifs',
    color: 'var(--primary)',
    popular: true,
    features: [
      '100 crédits / mois inclus',
      'Tout Starter, plus :',
      'Sessions illimitées',
      'Accès prioritaire aux enseignants',
      'Statistiques de progression avancées',
      'Export de certificats PDF',
      'Support prioritaire',
    ],
  },
  {
    name: 'Enterprise',
    price: null,
    period: '',
    desc: 'Pour les institutions',
    color: 'var(--accent)',
    features: [
      'Tout Academy, plus :',
      'Panel d\'administration dédié',
      'Import en masse des utilisateurs',
      'Branding personnalisé',
      'Rapports analytiques avancés',
      'SLA garanti 99.9%',
      'Gestionnaire de compte dédié',
      'Intégration SSO / LMS',
    ],
  },
]

const FAQ = [
  { q: 'Comment fonctionnent les crédits ?', a: 'Les crédits sont la monnaie de SKILIO. Vous en gagnez en enseignant vos compétences et vous les dépensez pour apprendre auprès d\'autres étudiants. Une séance d\'une heure coûte généralement entre 5 et 15 crédits selon la compétence.' },
  { q: 'Puis-je annuler mon abonnement ?', a: 'Oui, à tout moment sans frais. Vous conservez vos crédits et votre historique. Votre compte passe automatiquement en mode Starter.' },
  { q: 'Comment rejoindre avec mon université ?', a: 'Votre établissement doit avoir un partenariat SKILIO. Inscrivez-vous avec votre email universitaire et nous vous connecterons automatiquement à votre institution.' },
  { q: 'Les crédits expirent-ils ?', a: 'Non. Les crédits Starter n\'expirent jamais. Pour le plan Academy, les crédits mensuels offerts expirent en fin de mois, mais les crédits gagnés par l\'enseignement restent indéfiniment.' },
  { q: 'Y a-t-il des frais cachés ?', a: 'Aucun. Le plan Starter est 100 % gratuit. Le plan Academy est facturé mensuellement au tarif affiché. Pour Enterprise, le prix dépend du nombre d\'utilisateurs — contactez-nous pour un devis.' },
]

export default function PricingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = useState(null)

  const handleCTA = (plan) => {
    if (plan.price === null) {
      navigate('/contact')
    } else if (user?.role === 'tenant_admin') {
      navigate('/admin/billing')
    } else {
      navigate(user ? '/dashboard' : '/register')
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Tarifs
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 20, lineHeight: 1.15 }}>
            Des tarifs <span style={{ color: 'var(--primary)' }}>simples et transparents</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.75, fontWeight: 500 }}>
            Commencez gratuitement. Passez à la vitesse supérieure quand vous êtes prêt.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: '0 20px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{
              background: plan.popular ? 'linear-gradient(135deg, rgba(29,158,117,0.08), rgba(29,158,117,0.03))' : 'var(--surface)',
              border: `2px solid ${plan.popular ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 24, padding: '36px 32px',
              position: 'relative', overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {plan.popular && (
                <div style={{ position: 'absolute', top: 20, right: 20, background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 999, letterSpacing: '0.5px' }}>
                  POPULAIRE
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: plan.color, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  {plan.price === null ? (
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 900, color: 'var(--text-main)' }}>Sur devis</span>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 48, fontWeight: 900, color: 'var(--text-main)' }}>{plan.price === 0 ? 'Gratuit' : `${plan.price}€`}</span>
                      {plan.period && <span style={{ color: 'var(--text-muted)', fontSize: 15, fontWeight: 500 }}>{plan.period}</span>}
                    </>
                  )}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>{plan.desc}</p>
              </div>

              <div style={{ marginBottom: 28 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCTA(plan)}
                className={plan.popular ? 'btn-primary' : undefined}
                style={{
                  width: '100%', padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  ...(plan.popular
                    ? { background: 'linear-gradient(135deg, var(--primary), var(--accent))', border: 'none', color: '#fff' }
                    : { background: 'transparent', border: '2px solid var(--border)', color: 'var(--text-main)', transition: 'all 0.2s' }
                  ),
                }}
                onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' } }}
                onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-main)' } }}
              >
                {plan.price === null ? 'Nous contacter' : plan.price === 0 ? 'Commencer gratuitement' : 'Démarrer l\'essai gratuit'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison highlights */}
      <section style={{ padding: '60px 20px', background: 'var(--surface)', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 48 }}>Pourquoi SKILIO ?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { icon: Zap, title: 'Démarrage instantané', desc: 'Aucune carte de crédit requise pour le plan Starter. Créez votre profil en 2 minutes.' },
              { icon: Shield, title: 'Données protégées', desc: 'Hébergement en Europe, conformité RGPD, chiffrement de bout en bout.' },
              { icon: Users, title: 'Communauté active', desc: '28 000+ étudiants actifs dans 47+ universités partenaires.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '28px 24px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 18, textAlign: 'left' }}>
                <item.icon size={24} style={{ color: 'var(--primary)', marginBottom: 14 }} />
                <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{item.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, fontWeight: 500 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, textAlign: 'center' }}>
            Questions fréquentes
          </h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: 48, fontSize: 16, fontWeight: 500 }}>
            Autre question ? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/contact')}>Contactez-nous</span>
          </p>
          {FAQ.map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '20px 0', background: 'none', border: 'none', color: 'var(--text-main)', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: 'var(--font-sans)', textAlign: 'left' }}
              >
                {item.q}
                {openFaq === i ? <ChevronUp size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
              </button>
              {openFaq === i && (
                <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75, fontWeight: 500, paddingBottom: 20, margin: 0 }}>{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
