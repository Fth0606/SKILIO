import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const SCHOOLS = [
  { name: 'Harvard',   color: '#A51C30' },
  { name: 'Oxford',    color: '#002147' },
  { name: 'MIT',       color: '#A31F34' },
  { name: 'Stanford',  color: '#8C1515' },
  { name: 'Cambridge', color: '#003DA5' },
  { name: 'Sorbonne',  color: '#003366' },
]

const SKILLS = [
  { name: 'Python',         cat: 'Programmation', icon: '🐍', sessions: 342 },
  { name: 'Français',         cat: 'Langues',    icon: '🇫🇷', sessions: 289 },
  { name: 'Machine Learning', cat: 'IA/Data',   icon: '🤖', sessions: 198 },
  { name: 'Guitare',         cat: 'Musique',        icon: '🎸', sessions: 156 },
  { name: 'Calculus',       cat: 'Maths',         icon: '∫',  sessions: 211 },
  { name: 'Design',         cat: 'Créatif',     icon: '🎨', sessions: 134 },
  { name: 'Prise de parole', cat: 'Soft Skills',  icon: '🎤', sessions: 167 },
  { name: 'Espagnol',        cat: 'Langues',     icon: '🇪🇸', sessions: 301 },
]

const PLANS = [
  { name: 'Starter',    price: 0,   users: '50',       features: ['Mise en relation de base','Réservation de séances','Notifications par email','1 administrateur'], popular: false },
  { name: 'Academy',    price: 99,  users: '500',      features: ['Marque blanche','Sous-domaine personnalisé','Analytiques avancées','5 administrateurs','Support prioritaire'], popular: true },
  { name: 'Enterprise', price: 299, users: 'Illimité', features: ['SSO / SAML','Accès API','Garantie SLA','Manager dédié','Intégrations personnalisées'], popular: false },
]

const STATS = [
  { value: 47,      label: 'Universités',        suffix: '+' },
  { value: 28431,   label: 'Étudiants actifs',      suffix: '' },
  { value: 124567,  label: 'Séances complétées',   suffix: '' },
  { value: 4.9,     label: 'Note moyenne',          suffix: '★', decimal: true },
]

function Counter({ target, suffix, decimal }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const dur = 1800, step = 16, steps = dur / step
        let cur = 0; const inc = target / steps
        const t = setInterval(() => { cur += inc; if (cur >= target) { cur = target; clearInterval(t) } setVal(cur) }, step)
      }
    }, { threshold: 0.3 })
    if (ref.current) ob.observe(ref.current)
    return () => ob.disconnect()
  }, [target])

  const disp = decimal ? val.toFixed(1) : Math.round(val).toLocaleString()
  return <span ref={ref}>{disp}{suffix}</span>
}

function FloatingShapes() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div className="floating-orb" style={{ width: 600, height: 600, top: '-10%', left: '-10%', background: 'var(--primary)', opacity: 0.15 }} />
      <div className="floating-orb" style={{ width: 500, height: 500, bottom: '10%', right: '-5%', background: 'var(--accent)', opacity: 0.1, animationDelay: '-5s' }} />
      <div className="floating-orb" style={{ width: 400, height: 400, top: '40%', left: '40%', background: 'var(--primary-light)', opacity: 0.1, animationDelay: '-10s' }} />

      {/* Small stars/dots */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          background: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
          borderRadius: '50%',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: 0.4,
          animation: `pulse ${Math.random() * 3 + 2}s infinite alternate`
        }} />
      ))}
      <style>{`
        @keyframes pulse { from { opacity: 0.2; transform: scale(0.8); } to { opacity: 0.6; transform: scale(1.2); } }
      `}</style>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { user }  = useAuth()
  const { theme } = useTheme()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const fn = e => setMouse({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  const goToDash = () => {
    if (!user) { navigate('/register'); return }
    if (user.role === 'super_admin')   navigate('/super')
    else if (user.role === 'tenant_admin') navigate('/admin')
    else navigate('/dashboard')
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px' }}>
        <FloatingShapes />

        {/* Grid background */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)`, backgroundSize:'80px 80px', opacity:0.2 }} />

        {/* Floating elements */}
        <div className="animate-float" style={{ position:'absolute', top:'20%', left:'8%', zIndex:2 }}>
          <div className="card glass" style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:12, borderRadius:16 }}>
            <span style={{ fontSize:24 }}>🐍</span>
            <div>
              <div style={{ fontWeight:800, fontSize:14 }}>Python</div>
              <div style={{ color:'var(--text-muted)', fontSize:11 }}>342 séances</div>
            </div>
          </div>
        </div>

        <div className="animate-float" style={{ position:'absolute', bottom:'25%', right:'10%', zIndex:2, animationDelay:'1s' }}>
          <div className="card glass" style={{ padding:'16px', borderRadius:20 }}>
            <div style={{ display:'flex', gap:4, marginBottom:6 }}>{[...Array(5)].map((_,i) => <span key={i} style={{ color:'var(--accent)', fontSize:14 }}>★</span>)}</div>
            <div style={{ fontWeight:700, fontSize:12 }}>Séance notée 5.0</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ textAlign:'center', zIndex:3, maxWidth:900 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'var(--shadow-color)', border:'1px solid var(--border)', borderRadius:30, padding:'8px 20px', marginBottom:40 }} className="glass">
            <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--primary)', display:'inline-block', boxShadow:'0 0 10px var(--primary)' }} />
            <span style={{ color:'var(--primary)', fontSize:14, fontWeight:700, letterSpacing:'0.5px' }}>Propulsé par 47+ universités dans le monde</span>
          </div>

          <h1 style={{ fontSize:'clamp(3rem, 8vw, 5.5rem)', marginBottom:32, color:'var(--text-main)' }}>
            Les étudiants enseignent.<br />
            <span style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Les étudiants apprennent.</span><br />
            Tout le monde gagne.
          </h1>

          <p style={{ color:'var(--text-muted)', fontSize:20, lineHeight:1.7, marginBottom:48, maxWidth:650, margin:'0 auto 48px', fontWeight:500 }}>
            La plateforme SaaS d'échange de compétences entre pairs pour les universités et les entreprises. Les étudiants gagnent des crédits en enseignant, et les dépensent pour apprendre.
          </p>

          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={goToDash} className="btn-primary" style={{ padding:'18px 36px', fontSize:18, borderRadius:16, boxShadow:'0 20px 40px var(--shadow-color)' }}>
              Lancer votre plateforme →
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior:'smooth' })} className="btn-secondary" style={{ padding:'18px 36px', fontSize:18, borderRadius:16 }}>
              Voir comment ça marche
            </button>
          </div>

          {/* School logo cloud */}
          <div style={{ marginTop:80, display:'flex', alignItems:'center', justifyContent:'center', gap:40, flexWrap:'wrap', opacity:0.6 }}>
            <span style={{ color:'var(--text-muted)', fontSize:12, fontWeight:800, letterSpacing:'2px' }}>APPROUVÉ PAR</span>
            {SCHOOLS.map(s => (
              <div key={s.name} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:6, background:s.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:800 }}>{s.name[0]}</div>
                <span style={{ fontWeight:700, fontSize:15, color:'var(--text-main)' }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'var(--primary)', padding:'80px 20px', position:'relative' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:40, textAlign:'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ color:'#fff', fontSize:48, fontWeight:800, letterSpacing:'-2px', fontFamily:'var(--font-heading)' }}><Counter target={s.value} suffix={s.suffix} decimal={s.decimal} /></div>
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:14, fontWeight:700, marginTop:8, textTransform:'uppercase', letterSpacing:'1px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:'120px 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>

          <div style={{ textAlign:'center', marginBottom:80 }}>
            <h2 style={{ fontSize:'clamp(2rem, 5vw, 3.5rem)', marginBottom:20 }}>Comment fonctionne une séance</h2>
            <p style={{ color:'var(--text-muted)', fontSize:18, fontWeight:500 }}>De la recherche au transfert de crédit en 4 étapes simples</p>
          </div>

          <div style={{ position: 'relative', marginBottom: 120 }}>
            {/* Curved Path Background */}
            <svg className="svg-connector" viewBox="0 0 1000 150" style={{ width: '100%', height: 150, top: -20 }}>
              <path d="M 50 75 Q 150 10, 250 75 T 450 75 T 650 75 T 850 75 T 1000 75" />
            </svg>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, overflowX:'auto', padding:'20px 0', position:'relative', zIndex:1 }}>
              {[
                { icon:'🔍', label:'Rechercher', sub:'Trouver une compétence' },
                { icon:'📤', label:'Demander', sub:'Envoyer une demande' },
                { icon:'✅', label:'Accepter', sub:'L\'enseignant confirme' },
                { icon:'💳', label:'Crédit bloqué', sub:'1 crédit verrouillé' },
                { icon:'🎓', label:'Séance', sub:'1 heure en direct' },
                { icon:'⭐', label:'Évaluer', sub:'Les deux notent' },
                { icon:'⇄', label:'Transférer', sub:'Le crédit est déplacé' },
              ].map((step, i, arr) => (
                <div key={i} style={{ textAlign:'center', minWidth:130, flexShrink:0 }}>
                  <div
                    className="card glass"
                    style={{
                      width:80, height:80, borderRadius:24,
                      background: i === arr.length-1 ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--surface)',
                      border:`2px solid ${i === arr.length-1 ? 'transparent' : 'var(--border)'}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:32, margin:'0 auto 20px',
                      boxShadow: i === arr.length-1 ? '0 15px 30px var(--shadow-color)' : '0 8px 20px var(--border)',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: 'default'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1) translateY(-10px)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)' }}
                  >
                    {step.icon}
                  </div>
                  <div style={{ fontWeight:800, fontSize:15, color:'var(--text-main)', marginBottom:4 }}>{step.label}</div>
                  <div style={{ color:'var(--text-muted)', fontSize:12, fontWeight:500, maxWidth:110, margin:'0 auto' }}>{step.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Grid */}
          {[
            { tag:'Pour les Étudiants', color:'var(--primary)', items:[
                { icon:'🔍', title:'Recherche Intelligente', desc:'Filtrez par compétence, niveau, créneau horaire et langue.' },
                { icon:'💳', title:'Économie de Crédits', desc:'Enseignez 1 séance → gagnez 1 crédit. Dépensez 1 crédit pour apprendre.' },
                { icon:'⭐', title:'Évaluations par les Pairs', desc:'Les deux parties se notent mutuellement. Construisez votre réputation.' },
                { icon:'📅', title:'Planification Simplifiée', desc:'Définissez vos disponibilités une fois. Rappels automatiques inclus.' },
              ]},
            { tag:'Pour les Administrateurs', color:'var(--accent)', items:[
                { icon:'🏫', title:'SaaS Multi-Établissement', desc:'Chaque université dispose de son propre sous-domaine isolé.' },
                { icon:'📊', title:'Analytiques en Temps Réel', desc:'Suivez les séances, les crédits, les compétences populaires et l\'engagement.' },
                { icon:'🎨', title:'Marque Blanche', desc:'Téléchargez votre logo, définissez vos couleurs et votre message de bienvenue.' },
                { icon:'👥', title:'Gestion des Utilisateurs', desc:'Importez en masse via CSV, gérez les rôles et suspendez les comptes.' },
              ]},
          ].map((group, gi) => (
            <div key={gi} style={{ marginBottom:100 }}>
              <div style={{ textAlign:'center', marginBottom:50 }}>
                <span style={{ background:group.color, color:'#fff', fontSize:12, fontWeight:800, padding:'8px 24px', borderRadius:30, letterSpacing:'1px', textTransform:'uppercase' }}>{group.tag}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
                {group.items.map((item, i) => (
                  <div key={i} className="card card-hover glass" style={{ padding:32, borderRadius:24 }}>
                    <div style={{ fontSize:40, marginBottom:24, background:'var(--shadow-color)', width:72, height:72, borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center' }}>{item.icon}</div>
                    <h3 style={{ fontSize:18, fontWeight:800, marginBottom:12 }}>{item.title}</h3>
                    <p style={{ color:'var(--text-muted)', fontSize:15, lineHeight:1.7, margin:0, fontWeight:500 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS GRID ── */}
      <section style={{ background:'var(--shadow-color)', padding:'120px 20px' }} className="glass">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 2.8rem)', marginBottom:16 }}>1 200+ compétences sur la plateforme</h2>
            <p style={{ color:'var(--text-muted)', fontSize:18, fontWeight:500 }}>Du calcul à la guitare — les étudiants enseignent ce qu'ils aiment</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:20 }}>
            {SKILLS.map(skill => (
              <div key={skill.name} className="card card-hover" style={{ padding:24, borderRadius:24 }}>
                <div style={{ fontSize:32, marginBottom:16 }}>{skill.icon}</div>
                <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>{skill.name}</div>
                <div style={{ color:'var(--text-muted)', fontSize:13, fontWeight:600 }}>{skill.cat}</div>
                <div style={{ color:'var(--primary)', fontSize:12, fontWeight:800, marginTop:12, textTransform:'uppercase', letterSpacing:'0.5px' }}>{skill.sessions} séances</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:'120px 20px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:80 }}>
            <h2 style={{ fontSize:'clamp(2rem, 5vw, 3.5rem)', marginBottom:20 }}>Tarification simple et transparente</h2>
            <p style={{ color:'var(--text-muted)', fontSize:18, fontWeight:500 }}>Commencez gratuitement. Évoluez avec votre communauté.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:32 }}>
            {PLANS.map((plan, i) => (
              <div key={i} className="card glass" style={{
                padding:40, position:'relative',
                transform: plan.popular ? 'scale(1.05)' : 'none',
                border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
                boxShadow: plan.popular ? '0 30px 60px var(--shadow-color)' : '0 10px 30px var(--shadow-color)',
                borderRadius:32,
              }}>
                {plan.popular && (
                  <div style={{ position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg, var(--primary), var(--accent))', color:'#fff', fontSize:11, fontWeight:800, padding:'6px 20px', borderRadius:30, whiteSpace:'nowrap', letterSpacing:'1px', boxShadow:'0 10px 20px var(--shadow-color)' }}>LE PLUS POPULAIRE</div>
                )}
                <div style={{ color:'var(--text-muted)', fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:'2px', marginBottom:12 }}>{plan.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:8 }}>
                  <span style={{ fontSize:48, fontWeight:800, fontFamily:'var(--font-heading)' }}>{plan.price} DH</span>
                  <span style={{ color:'var(--text-muted)', fontSize:18, fontWeight:600 }}>/mois</span>
                </div>
                <div style={{ color:'var(--primary)', fontSize:15, fontWeight:700, marginBottom:32 }}>Jusqu'à {plan.users} utilisateurs</div>
                <div style={{ borderTop:'1px solid var(--border)', paddingTop:32, marginBottom:40 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display:'flex', gap:12, marginBottom:16 }}>
                      <span style={{ color:'var(--primary)', fontSize:18 }}>✓</span>
                      <span style={{ color:'var(--text-muted)', fontSize:15, fontWeight:500 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={goToDash} className="btn-primary" style={{ width:'100%', padding:'16px', borderRadius:16, fontSize:16, background: plan.popular ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--shadow-color)', border: plan.popular ? 'none' : '2px solid var(--primary)', color: plan.popular ? '#fff' : 'var(--primary)', fontWeight:800 }}>
                  {plan.price === 0 ? 'Commencer gratuitement' : 'Démarrer'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'linear-gradient(135deg, var(--primary), var(--accent))', padding:'100px 20px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.1, backgroundImage:'radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 50%, #fff 0%, transparent 50%)' }} />
        <div style={{ position:'relative', zIndex:2 }}>
          <h2 style={{ color:'#fff', fontSize:'clamp(2rem, 5vw, 3.5rem)', marginBottom:20 }}>Prêt à lancer votre plateforme ?</h2>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:20, marginBottom:48, fontWeight:500 }}>Rejoignez 47+ établissements qui utilisent déjà SKILIO.</p>
          <button onClick={goToDash} className="btn-primary" style={{ padding:'20px 48px', fontSize:20, background:'#fff', color:'var(--primary)', fontWeight:800, borderRadius:20, boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            Commencer gratuitement →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:'80px 20px 40px', borderTop:'1px solid var(--border)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:60, marginBottom:80 }}>
            <div style={{ maxWidth:320 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg, var(--primary), var(--accent))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff' }}>⇄</div>
                <span style={{ fontWeight:800, fontSize:22, fontFamily:'var(--font-heading)', letterSpacing:'-0.5px' }}>SKILIO</span>
              </div>
              <p style={{ color:'var(--text-muted)', fontSize:16, lineHeight:1.8, fontWeight:500 }}>La plateforme d'échange de compétences entre pairs conçue pour les universités et les entreprises.</p>
            </div>
            {[
              ['Produit',  ['Fonctionnalités','Tarifs','Tableau de bord','Roadmap']],
              ['Entreprise',  ['À propos','Blog','Carrières','Presse']],
              ['Légal',    ['Confidentialité','Conditions','Sécurité','RGPD']],
            ].map(([title, links]) => (
              <div key={title}>
                <div style={{ fontSize:14, fontWeight:800, marginBottom:24, textTransform:'uppercase', letterSpacing:'2px' }}>{title}</div>
                {links.map(l => <div key={l} style={{ color:'var(--text-muted)', fontSize:15, marginBottom:12, cursor:'pointer', fontWeight:500 }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid var(--border)', paddingTop:40, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20 }}>
            <span style={{ color:'var(--text-muted)', fontSize:14, fontWeight:500 }}>© 2026 SKILIO Inc. Tous droits réservés.</span>
            <span style={{ color:'var(--text-muted)', fontSize:14, fontWeight:600 }}>Fait pour les apprenants, par les apprenants. 🌍</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
