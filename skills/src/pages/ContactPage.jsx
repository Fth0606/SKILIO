import { useState } from 'react'
import { Mail, MessageCircle, Clock, ArrowRight, Check } from 'lucide-react'

const SUBJECTS = [
  'Question générale',
  'Problème technique',
  'Partenariat universitaire',
  'Demande presse',
  'Candidature spontanée',
  'Facturation & abonnement',
  'Autre',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    // Compose a mailto link and open it
    const body = encodeURIComponent(`Nom : ${form.name}\nEmail : ${form.email}\nSujet : ${form.subject}\n\n${form.message}`)
    const mailtoUrl = `mailto:fthalmh0@gmail.com?subject=${encodeURIComponent(`[SKILIO] ${form.subject}`)}&body=${body}`
    window.location.href = mailtoUrl
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 600)
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'var(--surface)', border: '1.5px solid var(--border)',
    borderRadius: 12, color: 'var(--text-main)', fontSize: 15,
    fontFamily: 'var(--font-sans)', fontWeight: 500, outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 28 }}>
            ✦ Contact
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 18, lineHeight: 1.15 }}>
            Parlons-nous
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.75, fontWeight: 500 }}>
            Une question, une suggestion, un partenariat ? Notre équipe est là pour vous.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 20px 100px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 60, alignItems: 'start' }}>

          {/* Contact info */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 32 }}>Informations</h2>

            {[
              {
                icon: Mail,
                title: 'Email',
                value: 'fthalmh0@gmail.com',
                href: 'mailto:fthalmh0@gmail.com',
                desc: 'Pour toute demande générale',
              },
              {
                icon: MessageCircle,
                title: 'Support technique',
                value: 'fthalmh0@gmail.com',
                href: 'mailto:fthalmh0@gmail.com?subject=[SKILIO] Support technique',
                desc: 'Bugs, problèmes de connexion',
              },
              {
                icon: Clock,
                title: 'Temps de réponse',
                value: '< 24h ouvrées',
                desc: 'Lundi – Vendredi, 9h – 18h',
              },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28, padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ width: 40, height: 40, background: 'rgba(29,158,117,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={18} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>{item.title}</div>
                  {item.href ? (
                    <a href={item.href} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'block', marginBottom: 2 }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >{item.value}</a>
                  ) : (
                    <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.value}</div>
                  )}
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 24, padding: '40px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(29,158,117,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Check size={28} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Message envoyé !</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, fontWeight: 500, marginBottom: 28 }}>
                  Merci de nous avoir contactés. Nous vous répondrons dans les 24h ouvrées.
                </p>
                <button onClick={() => setSent(false)} style={{ padding: '11px 24px', background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 10, color: 'var(--primary)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--text-main)', marginBottom: 28 }}>Envoyer un message</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Nom *</label>
                    <input type="text" required placeholder="Votre nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Email *</label>
                    <input type="email" required placeholder="votre@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Sujet</label>
                  <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Message *</label>
                  <textarea required rows={5} placeholder="Décrivez votre demande en détail..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '15px 24px', fontSize: 15, fontWeight: 800, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Envoi...' : (<>Envoyer le message <ArrowRight size={16} /></>)}
                </button>

                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 14, textAlign: 'center', fontWeight: 500 }}>
                  En soumettant ce formulaire, vous acceptez que vos données soient utilisées pour répondre à votre demande.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
