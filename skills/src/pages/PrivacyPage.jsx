import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const UPDATED = '1er janvier 2026'

const SECTIONS = [
  {
    title: '1. Collecte des données',
    content: `Lors de votre inscription sur SKILIO, nous collectons les informations suivantes :

• Données d'identification : nom, prénom, adresse email universitaire, photo de profil (optionnelle).
• Données d'utilisation : compétences déclarées, disponibilités, historique des séances, crédits, évaluations reçues et données.
• Données techniques : adresse IP, type de navigateur, système d'exploitation, cookies de session.

Nous ne collectons jamais vos données financières personnelles. Les paiements d'abonnement sont traités par notre prestataire de paiement certifié PCI-DSS.`,
  },
  {
    title: '2. Utilisation des données',
    content: `Vos données sont utilisées exclusivement pour :

• Faire fonctionner la plateforme et vous connecter avec d'autres étudiants.
• Améliorer notre algorithme de matching et personnaliser votre expérience.
• Vous envoyer des notifications liées à vos activités sur SKILIO.
• Respecter nos obligations légales et prévenir les abus.

Nous ne vendons jamais vos données à des tiers à des fins publicitaires ou commerciales.`,
  },
  {
    title: '3. Partage des données',
    content: `Vos données peuvent être partagées dans les cas suivants :

• Avec votre université partenaire : votre établissement peut consulter des statistiques d'engagement agrégées et anonymisées.
• Avec les utilisateurs de la plateforme : votre profil public (nom, compétences, note moyenne) est visible des autres étudiants de votre établissement.
• Avec nos prestataires techniques : hébergement (serveurs UE), email transactionnel, paiements — soumis à des accords de confidentialité stricts.
• Sur obligation légale : si la loi nous y contraint, en réponse à une demande judiciaire valide.`,
  },
  {
    title: '4. Conservation des données',
    content: `• Données de compte actif : conservées pendant toute la durée de votre inscription.
• Historique des séances : conservé 3 ans après la clôture du compte à des fins d'intégrité.
• Données techniques (logs) : 12 mois glissants.

À la suppression de votre compte, toutes vos données personnelles identifiables sont effacées dans les 30 jours.`,
  },
  {
    title: '5. Vos droits (RGPD)',
    content: `Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :

• Droit d'accès : obtenir une copie de toutes vos données.
• Droit de rectification : corriger des données inexactes.
• Droit à l'effacement : supprimer votre compte et vos données.
• Droit à la portabilité : recevoir vos données dans un format structuré.
• Droit d'opposition : vous opposer à certains traitements.

Pour exercer ces droits, contactez-nous à fthalmh0@gmail.com.`,
  },
  {
    title: '6. Sécurité',
    content: `Nous appliquons des mesures de sécurité strictes :

• Chiffrement TLS/HTTPS sur toutes les communications.
• Mots de passe hachés avec bcrypt (jamais stockés en clair).
• Accès aux données de production restreint au personnel autorisé.
• Audits de sécurité réguliers.
• Hébergement dans des datacenters certifiés ISO 27001 en Union Européenne.`,
  },
  {
    title: '7. Cookies',
    content: `SKILIO utilise les types de cookies suivants :

• Cookies essentiels : nécessaires au fonctionnement (session, authentification). Non désactivables.
• Cookies analytiques : mesure d'audience anonymisée via Plausible Analytics (aucun tracking inter-sites).

Aucun cookie publicitaire ou de tracking tiers n'est utilisé.`,
  },
  {
    title: '8. Contact & DPO',
    content: `Pour toute question relative à la protection de vos données personnelles, contactez notre délégué à la protection des données :

Email : fthalmh0@gmail.com
Objet : [RGPD] Votre demande

Vous avez également le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente (CNIL en France, CNDP au Maroc).`,
  },
]

export default function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Confidentialité
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 18, lineHeight: 1.15 }}>
            Politique de <span style={{ color: 'var(--primary)' }}>confidentialité</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75, fontWeight: 500 }}>
            Dernière mise à jour : <strong style={{ color: 'var(--text-main)' }}>{UPDATED}</strong>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75, fontWeight: 500, marginTop: 12 }}>
            Votre vie privée est fondamentale pour nous. Cette politique explique quelles données nous collectons, pourquoi, et comment vous gardez le contrôle.
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
                <a key={i} href={`#section-${i}`} style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{s.title}</a>
              ))}
            </div>
          </div>

          {SECTIONS.map((section, i) => (
            <div key={i} id={`section-${i}`} style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: 22, fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>{section.title}</h2>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8, fontWeight: 500, whiteSpace: 'pre-line', margin: 0 }}>{section.content}</p>
              </div>
            </div>
          ))}

          {/* Contact */}
          <div style={{ background: 'linear-gradient(135deg, rgba(29,158,117,0.06), rgba(239,159,39,0.04))', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 20, padding: '32px', textAlign: 'center', marginTop: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Des questions ?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20, fontWeight: 500 }}>Notre équipe répond à toutes les demandes RGPD sous 72h.</p>
            <button onClick={() => navigate('/contact')} className="btn-primary" style={{ padding: '11px 24px', fontSize: 14, fontWeight: 700, borderRadius: 10 }}>
              Nous contacter <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 5 }} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
