import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const UPDATED = '1er janvier 2026'

const SECTIONS = [
  {
    title: '1. Acceptation des conditions',
    content: `En créant un compte sur SKILIO, vous acceptez les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.

Ces conditions constituent un accord contraignant entre vous et SKILIO. Nous nous réservons le droit de les modifier. En cas de modification substantielle, nous vous en informerons par email avec un préavis de 30 jours.`,
  },
  {
    title: '2. Éligibilité',
    content: `Pour utiliser SKILIO, vous devez :

• Être âgé(e) d'au moins 16 ans.
• Être étudiant(e) ou membre du personnel d'un établissement partenaire SKILIO.
• Posséder une adresse email délivrée par votre institution.
• Vous engager à utiliser la plateforme dans un cadre légal et respectueux.

Un seul compte est autorisé par personne. La création de comptes multiples est interdite.`,
  },
  {
    title: '3. Système de crédits',
    content: `Les crédits SKILIO sont une monnaie virtuelle interne à la plateforme :

• Les crédits n'ont aucune valeur monétaire et ne peuvent pas être convertis en argent réel.
• Ils ne sont pas transférables entre comptes.
• Les crédits gagnés par l'enseignement n'expirent pas. Les crédits promotionnels peuvent avoir une date d'expiration.
• SKILIO se réserve le droit d'ajuster le système de crédits avec notification préalable de 30 jours.

En cas de résiliation de votre compte, les crédits non utilisés sont perdus sans compensation.`,
  },
  {
    title: '4. Code de conduite',
    content: `Tous les utilisateurs s'engagent à :

• Traiter les autres membres avec respect et bienveillance.
• Ne pas partager de contenu illégal, offensant ou trompeur.
• Ne pas utiliser la plateforme à des fins commerciales non autorisées.
• Respecter les horaires convenus et prévenir en cas d'annulation.
• Ne pas tenter de contourner le système de crédits.

Tout manquement peut entraîner une suspension temporaire ou définitive du compte.`,
  },
  {
    title: '5. Contenu et propriété intellectuelle',
    content: `• Vous conservez tous les droits sur le contenu (supports pédagogiques, ressources) que vous partagez sur SKILIO.
• En les partageant, vous accordez à SKILIO une licence non exclusive pour les afficher aux autres utilisateurs.
• SKILIO et son logo sont des marques déposées. Toute reproduction sans autorisation est interdite.
• Les évaluations publiées sur la plateforme sont partagées sous licence Creative Commons BY-SA 4.0.`,
  },
  {
    title: '6. Responsabilité et garanties',
    content: `SKILIO est une plateforme de mise en relation. À ce titre :

• Nous ne garantissons pas la qualité des séances ou l'exactitude des compétences déclarées.
• Nous ne sommes pas responsables des désaccords ou dommages survenus entre utilisateurs.
• La plateforme est fournie "en l'état" sans garantie d'interruption de service ou d'absence d'erreurs.
• Notre responsabilité est limitée au montant payé pour l'abonnement au cours du mois précédant l'incident.`,
  },
  {
    title: '7. Abonnements et facturation',
    content: `• Le plan Starter est gratuit sans engagement.
• Les abonnements payants (Academy, Enterprise) sont facturés mensuellement ou annuellement selon votre choix.
• Vous pouvez annuler à tout moment depuis votre tableau de bord. Aucun remboursement au prorata.
• Les prix sont indiqués TTC (toutes taxes comprises).
• En cas de non-paiement, votre compte passe automatiquement en mode Starter.`,
  },
  {
    title: '8. Résiliation',
    content: `Vous pouvez supprimer votre compte à tout moment en nous contactant à fthalmh0@gmail.com.

SKILIO peut suspendre ou résilier votre compte en cas de :
• Violation du code de conduite.
• Tentative de fraude ou d'abus du système.
• Non-paiement répété.
• Demande de votre établissement.

En cas de résiliation de notre fait sans faute de votre part, un remboursement au prorata vous sera proposé.`,
  },
  {
    title: '9. Droit applicable',
    content: `Les présentes Conditions sont régies par le droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris, sauf disposition légale contraire.

Pour tout litige de consommation, vous pouvez recourir à la médiation en ligne via la plateforme européenne de règlement des litiges (RLL) accessible à ec.europa.eu/consumers/odr.

Contact : fthalmh0@gmail.com`,
  },
]

export default function TermsPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Conditions d'utilisation
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 18, lineHeight: 1.15 }}>
            Conditions Générales <span style={{ color: 'var(--primary)' }}>d'Utilisation</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75, fontWeight: 500 }}>
            Dernière mise à jour : <strong style={{ color: 'var(--text-main)' }}>{UPDATED}</strong>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75, fontWeight: 500, marginTop: 12 }}>
            Merci de lire ces conditions attentivement avant d'utiliser SKILIO. Elles définissent vos droits et vos responsabilités en tant qu'utilisateur de la plateforme.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '0 20px 100px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>

          {/* Quick nav */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px', marginBottom: 48 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>Table des matières</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px' }}>
              {SECTIONS.map((s, i) => (
                <a key={i} href={`#term-${i}`} style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{s.title}</a>
              ))}
            </div>
          </div>

          {SECTIONS.map((section, i) => (
            <div key={i} id={`term-${i}`} style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: 22, fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>{section.title}</h2>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8, fontWeight: 500, whiteSpace: 'pre-line', margin: 0 }}>{section.content}</p>
              </div>
            </div>
          ))}

          <div style={{ background: 'linear-gradient(135deg, rgba(29,158,117,0.06), rgba(239,159,39,0.04))', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 20, padding: '32px', textAlign: 'center', marginTop: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Des questions légales ?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20, fontWeight: 500 }}>
              Notre équipe est disponible pour répondre à toute question relative aux CGU.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/contact')} className="btn-primary" style={{ padding: '11px 24px', fontSize: 14, fontWeight: 700, borderRadius: 10 }}>
                Nous contacter <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 5 }} />
              </button>
              <button onClick={() => navigate('/privacy')} style={{ padding: '11px 24px', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 10, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                Politique de confidentialité
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
