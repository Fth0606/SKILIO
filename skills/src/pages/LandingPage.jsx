import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import SwimmingSkills from '../components/ui/SwimmingSkills'
import { Code, Languages, Bot, Music, Calculator, Palette, Mic, Globe, Star, Sparkles, Users, BookOpen, Award, ArrowRight, Check, Zap, Shield, Heart, Rocket, ChevronRight, GraduationCap, TrendingUp, Clock, Globe2, Search, MessageCircle } from 'lucide-react'

const SCHOOLS = [
  { name: 'Harvard',   color: '#A51C30' },
  { name: 'Oxford',    color: '#002147' },
  { name: 'MIT',       color: '#A31F34' },
  { name: 'Stanford',  color: '#8C1515' },
  { name: 'Cambridge', color: '#003DA5' },
  { name: 'Sorbonne',  color: '#003366' },
]

const SKILL_ICONS = {
  'Python': Code,
  'Français': Languages,
  'Machine Learning': Bot,
  'Guitare': Music,
  'Calculus': Calculator,
  'Design': Palette,
  'Prise de parole': Mic,
  'Espagnol': Globe,
}

const SKILLS = [
  { name: 'Python',         cat: 'Programmation', sessions: 342 },
  { name: 'Français',         cat: 'Langues',    sessions: 289 },
  { name: 'Machine Learning', cat: 'IA/Data',   sessions: 198 },
  { name: 'Guitare',         cat: 'Musique',    sessions: 156 },
  { name: 'Calculus',       cat: 'Maths',       sessions: 211 },
  { name: 'Design',         cat: 'Créatif',     sessions: 134 },
  { name: 'Prise de parole', cat: 'Soft Skills', sessions: 167 },
  { name: 'Espagnol',        cat: 'Langues',    sessions: 301 },
]

const PLANS = [
  { name: 'Starter',    price: 0,   users: '50',       features: ['Mise en relation de base','Réservation de séances','Notifications par email','1 administrateur'], popular: false },
  { name: 'Academy',    price: 99,  users: '500',      features: ['Marque blanche','Sous-domaine personnalisé','Analytiques avancées','5 administrateurs','Support prioritaire'], popular: true },
  { name: 'Enterprise', price: 299, users: 'Illimité', features: ['SSO / SAML','Accès API','Garantie SLA','Manager dédié','Intégrations personnalisées'], popular: false },
]

const STATS = [
  { value: 47,      label: 'Universités',      suffix: '+', icon: GraduationCap },
  { value: 28431,   label: 'Étudiants actifs',  suffix: '', icon: Users },
  { value: 124567,  label: 'Séances complétées', suffix: '', icon: BookOpen },
  { value: 4.9,     label: 'Note moyenne',       suffix: '', icon: Star, decimal: true },
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
      <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 100px' }}>
        <FloatingShapes />

        {/* Gradient mesh background */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)', zIndex:0 }} />

        {/* Floating skill cards */}
        <div className="animate-float" style={{ position:'absolute', top:'15%', left:'5%', zIndex:2, animation:'float-smooth 5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite' }}>
          <div className="card glass" style={{ padding:'14px 22px', display:'flex', alignItems:'center', gap:12, borderRadius:14, backdropFilter:'blur(20px)' }}>
            <Code size={26} style={{ color:'var(--primary)' }} />
            <div>
              <div style={{ fontWeight:800, fontSize:13, color:'var(--text-main)' }}>Python</div>
              <div style={{ color:'var(--text-muted)', fontSize:11, fontWeight:500 }}>342 séances</div>
            </div>
          </div>
        </div>

        <div className="animate-float" style={{ position:'absolute', bottom:'20%', right:'7%', zIndex:2, animation:'float-smooth 4.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite 0.5s' }}>
          <div className="card glass" style={{ padding:'16px 20px', borderRadius:14, backdropFilter:'blur(20px)' }}>
            <div style={{ display:'flex', gap:3, marginBottom:8, color:'var(--accent)' }}>{[...Array(5)].map((_,i) => <Star key={i} size={14} fill="currentColor" />)}</div>
            <div style={{ fontWeight:700, fontSize:12, color:'var(--text-main)' }}>Séance 5★</div>
          </div>
        </div>

        {/* Hero content */}
        <div style={{ textAlign:'center', zIndex:3, maxWidth:950 }}>
          {/* Badge */}
          <div className="fade-in-up" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(212, 175, 55, 0.1)', border:'1px solid rgba(212, 175, 55, 0.3)', borderRadius:40, padding:'10px 24px', marginBottom:48 }} className="glass">
            <Sparkles size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ color:'var(--primary)', fontSize:13, fontWeight:700, letterSpacing:'0.3px' }}>Approuvé par 47+ universités mondiales</span>
          </div>

          {/* Main headline */}
          <h1 style={{ marginBottom:24, color:'var(--text-main)', fontWeight:900, letterSpacing:'-1.5px', lineHeight:1.15 }}>
            Apprendre ensemble.<br />
            <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip:'text' }}>Grandir ensemble.</span><br />
            <span style={{ color:'var(--text-main)' }}>Partager le savoir.</span>
          </h1>

          {/* Subheading */}
          <p style={{ color:'var(--text-muted)', fontSize:18, lineHeight:1.75, marginBottom:56, maxWidth:700, margin:'0 auto 56px', fontWeight:500, letterSpacing:'0.3px' }}>
            La plateforme où les étudiants s'enseignent entre eux. Gagnez des crédits en enseignant, dépensez-les pour apprendre. Un système simple, équitable et motivant.
          </p>

          {/* CTA Buttons */}
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', marginBottom:72 }}>
            <button onClick={goToDash} className="btn-primary" style={{ padding:'18px 40px', fontSize:17, fontWeight:700, gap:8 }}>
              Commencer <Rocket size={18} />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior:'smooth' })} className="btn-secondary" style={{ padding:'18px 40px', fontSize:17, fontWeight:700 }}>
              Découvrir
            </button>
          </div>

          {/* University trust badges */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:32, flexWrap:'wrap', opacity:0.7, fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text-muted)' }}>
              <Users size={16} />
              28K+ étudiants actifs
            </div>
            <div style={{ height:20, width:1, background:'var(--border)' }} />
            <div style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text-muted)' }}>
              <TrendingUp size={16} />
              124K+ séances
            </div>
            <div style={{ height:20, width:1, background:'var(--border)' }} />
            <div style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text-muted)' }}>
              <Star size={16} />
              4.9 ★ moyenne
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'linear-gradient(135deg, var(--primary) 0%, #C9A227 100%)', padding:'100px 20px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.1, backgroundImage:'radial-gradient(circle at 30% 60%, #fff 0%, transparent 50%), radial-gradient(circle at 70% 40%, #fff 0%, transparent 50%)' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:32, position:'relative', zIndex:1 }}>
          {STATS.map(s => (
            <div key={s.label} className="card" style={{ padding:36, borderRadius:18, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)', textAlign:'center', border:'1px solid rgba(255,255,255,0.5)' }}>
              <s.icon size={36} style={{ color: 'var(--primary)', marginBottom: 16, margin:'0 auto 16px' }} />
              <div style={{ color:'var(--primary)', fontSize:44, fontWeight:900, letterSpacing:'-1px', fontFamily:'var(--font-heading)' }}><Counter target={s.value} suffix={s.suffix} decimal={s.decimal} /></div>
              <div style={{ color:'var(--text-muted)', fontSize:13, fontWeight:700, marginTop:12, textTransform:'uppercase', letterSpacing:'1px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:'140px 20px', background:'linear-gradient(180deg, var(--bg) 0%, rgba(212, 175, 55, 0.03) 100%)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>

          <div style={{ textAlign:'center', marginBottom:100 }}>
            <h2 style={{ marginBottom:20 }}>Comment ça marche</h2>
            <p style={{ color:'var(--text-muted)', fontSize:18, fontWeight:500, maxWidth:500, margin:'0 auto' }}>Une plateforme simple pour apprendre et enseigner à votre rythme</p>
          </div>

          <div style={{ position: 'relative', marginBottom: 120 }}>
            {/* Curved Path Background */}
            <svg className="svg-connector" viewBox="0 0 1000 150" style={{ width: '100%', height: 150, top: -20 }}>
              <path d="M 50 75 Q 150 10, 250 75 T 450 75 T 650 75 T 850 75 T 1000 75" />
            </svg>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, overflowX:'auto', padding:'40px 0', position:'relative', zIndex:1 }}>
              {[
                { icon:<Search size={28} />, label:'Chercher', sub:'Trouver un expert' },
                { icon:<MessageCircle size={28} />, label:'Demander', sub:'Une séance' },
                { icon:<Check size={28} />, label:'Accepter', sub:'L\'expert confirme' },
                { icon:<GraduationCap size={28} />, label:'Apprendre', sub:'Séance en direct' },
                { icon:<Star size={28} />, label:'Évaluer', sub:'Notez mutuellement' },
                { icon:<TrendingUp size={28} />, label:'Crédits transférés', sub:'Système équitable' },
              ].map((step, i, arr) => (
                <div key={i} style={{ textAlign:'center', minWidth:130, flexShrink:0 }}>
                  <div
                    className="card"
                    style={{
                      width:88, height:88, borderRadius:18,
                      background: i === arr.length-1 ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--surface)',
                      border:`2px solid ${i === arr.length-1 ? 'transparent' : 'var(--border)'}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      margin:'0 auto 20px',
                      color: i === arr.length-1 ? '#fff' : 'var(--primary)',
                      boxShadow: i === arr.length-1 ? '0 16px 32px rgba(99, 102, 241, 0.35)' : '0 4px 16px rgba(0,0,0,0.06)',
                      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12) translateY(-8px)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)' }}
                  >
                    {step.icon}
                  </div>
                  <div style={{ fontWeight:800, fontSize:14, color:'var(--text-main)', marginBottom:4 }}>{step.label}</div>
                  <div style={{ color:'var(--text-muted)', fontSize:12, fontWeight:500, maxWidth:110, margin:'0 auto' }}>{step.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Grid */}
          {[
            { tag:'Pour les Apprenants', color:'var(--primary)', items:[
                { icon:<Search size={24} />, title:'Découvrez les Experts', desc:'Cherchez par compétence, niveau, langue. Trouvez votre match en secondes.' },
                { icon:<Zap size={24} />, title:'Système de Crédits Équitable', desc:'Enseignez = gagnez. Apprenez = dépensez. Simple et transparent.' },
                { icon:<Star size={24} />, title:'Communauté de Confiance', desc:'Évaluations authentiques. Bâtissez votre réputation ensemble.' },
                { icon:<Clock size={24} />, title:'À Votre Rythme', desc:'Planifiez vos séances comme vous le souhaitez. Flexibilité totale.' },
              ]},
            { tag:'Pour les Institutions', color:'var(--accent)', items:[
                { icon:<Globe2 size={24} />, title:'Plateforme Clé en Main', desc:'Multi-établissements. Chacun son espace, ses règles, son autonomie.' },
                { icon:<TrendingUp size={24} />, title:'Analytiques & Insights', desc:'Tableaux de bord en temps réel. Comprenez l\'engagement de votre communauté.' },
                { icon:<Palette size={24} />, title:'À Votre Image', desc:'Marque blanche complète. Couleurs, logo, domaine personnalisé.' },
                { icon:<Shield size={24} />, title:'Sécurité Garantie', desc:'Chiffrement, RGPD, SSO. Vos données en sécurité.' },
              ]},
          ].map((group, gi) => (
            <div key={gi} style={{ marginBottom:120 }}>
              <div style={{ textAlign:'center', marginBottom:60 }}>
                <span style={{ background:group.color, color:'#fff', fontSize:11, fontWeight:800, padding:'10px 28px', borderRadius:30, letterSpacing:'1.2px', textTransform:'uppercase' }}>{group.tag}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:28 }}>
                {group.items.map((item, i) => (
                  <div key={i} className="card card-hover" style={{ padding:36, borderRadius:18 }}>
                    <div style={{ fontSize:40, marginBottom:24, background:'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.05))', width:72, height:72, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)' }}>{item.icon}</div>
                    <h3 style={{ fontSize:18, fontWeight:800, marginBottom:12, color:'var(--text-main)' }}>{item.title}</h3>
                    <p style={{ color:'var(--text-muted)', fontSize:15, lineHeight:1.7, margin:0, fontWeight:500 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS GRID ── */}
      <section style={{ background:'linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.03) 100%)', padding:'140px 20px', position:'relative' }}>
        <SwimmingSkills />
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:80 }}>
            <h2 style={{ marginBottom:16 }}>1 200+ compétences à découvrir</h2>
            <p style={{ color:'var(--text-muted)', fontSize:18, fontWeight:500, maxWidth:600, margin:'0 auto' }}>Du code à la guitare. Des langues au design. Trouver votre passion et l'enseigner.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:24 }}>
            {SKILLS.map(skill => {
              const Icon = SKILL_ICONS[skill.name] || Code
              return (
                <div key={skill.name} className="card card-hover" style={{ padding:28, borderRadius:16 }}>
                  <div style={{ width:60, height:60, borderRadius:14, background:'linear-gradient(135deg, var(--primary), var(--accent))', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, color:'#fff' }}>
                    <Icon size={28} />
                  </div>
                  <div style={{ fontWeight:800, fontSize:16, marginBottom:6, color:'var(--text-main)' }}>{skill.name}</div>
                  <div style={{ color:'var(--text-muted)', fontSize:13, fontWeight:600, marginBottom:12 }}>{skill.cat}</div>
                  <div style={{ color:'var(--primary)', fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.5px' }}>🎯 {skill.sessions}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:'140px 20px', background:'linear-gradient(180deg, var(--bg) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:100 }}>
            <h2 style={{ marginBottom:20 }}>Tarification pour tous</h2>
            <p style={{ color:'var(--text-muted)', fontSize:18, fontWeight:500, maxWidth:550, margin:'0 auto' }}>De gratuit à personnalisé. Grandissez à votre rythme, sans payer pour ce que vous n'utilisez pas.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(330px,1fr))', gap:32 }}>
            {PLANS.map((plan, i) => (
              <div key={i} className="card" style={{
                padding:44, position:'relative',
                transform: plan.popular ? 'scale(1.05)' : 'none',
                border: plan.popular ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                boxShadow: plan.popular ? '0 25px 50px rgba(99, 102, 241, 0.25)' : '0 4px 20px rgba(0,0,0,0.06)',
                borderRadius:20,
                background: plan.popular ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(236, 72, 153, 0.05))' : 'var(--surface)',
              }}>
                {plan.popular && (
                  <div style={{ position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg, var(--primary), var(--accent))', color:'#fff', fontSize:12, fontWeight:800, padding:'8px 24px', borderRadius:30, whiteSpace:'nowrap', letterSpacing:'0.8px', boxShadow:'0 12px 24px rgba(99, 102, 241, 0.4)' }}>⭐ PLUS POPULAIRE</div>
                )}
                <div style={{ color:'var(--text-muted)', fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:12 }}>{plan.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:12 }}>
                  <span style={{ fontSize:52, fontWeight:900, fontFamily:'var(--font-heading)', color:'var(--text-main)' }}>{plan.price}</span>
                  <span style={{ color:'var(--text-muted)', fontSize:18, fontWeight:600 }}>DH/mois</span>
                </div>
                <div style={{ color:'var(--primary)', fontSize:15, fontWeight:700, marginBottom:36 }}>Jusqu'à {plan.users} utilisateurs</div>
                <div style={{ borderTop:'1.5px solid var(--border)', paddingTop:36, marginBottom:40 }}>
                  {plan.features.map((f, fi) => (
                    <div key={fi} style={{ display:'flex', gap:12, marginBottom:18 }}>
                      <Check size={18} style={{ color:'var(--primary)', flexShrink:0, marginTop:2 }} />
                      <span style={{ color:'var(--text-muted)', fontSize:15, fontWeight:500 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={goToDash} className="btn-primary" style={{ width:'100%', padding:'16px 24px', borderRadius:14, fontSize:16, fontWeight:700, background: plan.popular ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'rgba(99, 102, 241, 0.1)', border: plan.popular ? 'none' : '2px solid var(--primary)', color: plan.popular ? '#fff' : 'var(--primary)' }}>
                  {plan.price === 0 ? 'Commencer gratuitement' : 'Démarrer l\'essai'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', padding:'120px 20px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.15, backgroundImage:'radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 50%, #fff 0%, transparent 50%)' }} />
        <div style={{ position:'relative', zIndex:2, maxWidth:700 }}>
          <h2 style={{ color:'#fff', marginBottom:24 }}>Prêt à rejoindre la communauté ?</h2>
          <p style={{ color:'rgba(255,255,255,0.9)', fontSize:18, marginBottom:48, fontWeight:500, lineHeight:1.7 }}>47+ universités utilisent SKILIO. 28K+ étudiants apprennent et enseignent chaque jour.</p>
          <button onClick={goToDash} className="btn-primary" style={{ padding:'18px 48px', fontSize:17, background:'#fff', color:'var(--primary)', fontWeight:800, borderRadius:14, boxShadow:'0 16px 32px rgba(0,0,0,0.25)', gap:10 }}>
            Commencer gratuitement <Rocket size={20} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:'100px 20px 48px', borderTop:'1.5px solid var(--border)', background:'linear-gradient(180deg, var(--bg) 0%, rgba(99, 102, 241, 0.03) 100%)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:60, marginBottom:80 }}>
            <div style={{ maxWidth:300 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg, var(--primary), var(--accent))', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20 }}>
                  ✨
                </div>
                <span style={{ fontWeight:900, fontSize:22, fontFamily:'var(--font-heading)', letterSpacing:'-0.5px', color:'var(--text-main)' }}>SKILIO</span>
              </div>
              <p style={{ color:'var(--text-muted)', fontSize:15, lineHeight:1.8, fontWeight:500 }}>Où les passions deviennent expertise, et l'apprentissage devient communauté.</p>
            </div>
            {[
              ['Produit',  ['Fonctionnalités','Tarifs','Dashboard','Roadmap']],
              ['Entreprise',  ['À propos','Blog','Carrières','Presse']],
              ['Support',    ['Aide','Contact','Status','Changelog']],
            ].map(([title, links]) => (
              <div key={title}>
                <div style={{ fontSize:13, fontWeight:800, marginBottom:24, textTransform:'uppercase', letterSpacing:'1.5px', color:'var(--text-main)' }}>{title}</div>
                {links.map(l => <div key={l} style={{ color:'var(--text-muted)', fontSize:15, marginBottom:14, cursor:'pointer', fontWeight:500, transition:'color 0.2s', '--hover-color': 'var(--primary)' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1.5px solid var(--border)', paddingTop:40, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20 }}>
            <span style={{ color:'var(--text-muted)', fontSize:14, fontWeight:500 }}>© 2026 SKILIO. Tous droits réservés.</span>
            <span style={{ color:'var(--text-muted)', fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:8 }}><Heart size={16} style={{ color:'var(--accent)' }} /> Bâti par des passionnés d'apprentissage</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
