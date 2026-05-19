import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SCHOOLS = [
  { name: 'Harvard',   color: '#A51C30' },
  { name: 'Oxford',    color: '#002147' },
  { name: 'MIT',       color: '#A31F34' },
  { name: 'Stanford',  color: '#8C1515' },
  { name: 'Cambridge', color: '#003DA5' },
  { name: 'Sorbonne',  color: '#003366' },
]

const SKILLS = [
  { name: 'Python',         cat: 'Programming', icon: '🐍', sessions: 342 },
  { name: 'French',         cat: 'Language',    icon: '🇫🇷', sessions: 289 },
  { name: 'Machine Learning', cat: 'AI/Data',   icon: '🤖', sessions: 198 },
  { name: 'Guitar',         cat: 'Music',        icon: '🎸', sessions: 156 },
  { name: 'Calculus',       cat: 'Math',         icon: '∫',  sessions: 211 },
  { name: 'Design',         cat: 'Creative',     icon: '🎨', sessions: 134 },
  { name: 'Public Speaking',cat: 'Soft Skills',  icon: '🎤', sessions: 167 },
  { name: 'Spanish',        cat: 'Language',     icon: '🇪🇸', sessions: 301 },
]

const PLANS = [
  { name: 'Starter',    price: 0,   users: '50',       features: ['Basic skill matching','Session booking','Email notifications','1 admin'], popular: false },
  { name: 'Academy',    price: 99,  users: '500',      features: ['White-labeling','Custom subdomain','Advanced analytics','5 admins','Priority support'], popular: true },
  { name: 'Enterprise', price: 299, users: 'Unlimited',features: ['SSO / SAML','API access','SLA guarantee','Dedicated manager','Custom integrations'], popular: false },
]

const STATS = [
  { value: 47,      label: 'Universities',        suffix: '+' },
  { value: 28431,   label: 'Active Students',      suffix: '' },
  { value: 124567,  label: 'Sessions Completed',   suffix: '' },
  { value: 4.9,     label: 'Avg. Rating',          suffix: '★', decimal: true },
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

export default function LandingPage() {
  const navigate = useNavigate()
  const { user }  = useAuth()
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
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', background: '#070c09', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Orbs */}
        {[
          { w:600, top:'10%', left:'10%', color:'#0F6E5620', dx:30,  dy:30  },
          { w:500, bottom:'10%', right:'10%', color:'#7F77DD15', dx:-20, dy:-20 },
          { w:300, top:'50%', left:'50%', color:'#EF9F2715', dx:40,  dy:40, center:true },
        ].map((o, i) => (
          <div key={i} style={{
            position: 'absolute', width: o.w, height: o.w, borderRadius: '50%',
            background: `radial-gradient(circle,${o.color} 0%,transparent 70%)`,
            top: o.top, bottom: o.bottom, left: o.left, right: o.right,
            transform: o.center
              ? `translate(-50%,-50%) translate(${mouse.x * o.dx}px,${mouse.y * o.dy}px)`
              : `translate(${mouse.x * o.dx}px,${mouse.y * o.dy}px)`,
            transition: 'transform 0.1s ease', pointerEvents: 'none',
          }} />
        ))}

        {/* Grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(#1e2b2430 1px,transparent 1px),linear-gradient(90deg,#1e2b2430 1px,transparent 1px)`, backgroundSize:'60px 60px', opacity:0.3 }} />

        {/* Floating cards */}
        <div className="animate-float"  style={{ position:'absolute', top:'22%', left:'4%', zIndex:2 }}>
          <div style={{ background:'#111814', border:'1px solid #1e2b24', borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:8, boxShadow:'0 8px 32px #0009' }}>
            <span style={{ fontSize:20 }}>🐍</span>
            <div><div style={{ color:'#fff', fontSize:12, fontWeight:600 }}>Python</div><div style={{ color:'#5a7a6a', fontSize:10 }}>342 sessions</div></div>
          </div>
        </div>
        <div className="animate-float-2" style={{ position:'absolute', top:'32%', right:'4%', zIndex:2 }}>
          <div style={{ background:'#111814', border:'1px solid #1e2b24', borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>🎸</span>
            <div><div style={{ color:'#fff', fontSize:12, fontWeight:600 }}>Guitar</div><div style={{ color:'#5a7a6a', fontSize:10 }}>156 sessions</div></div>
          </div>
        </div>
        <div className="animate-float-3" style={{ position:'absolute', bottom:'30%', left:'7%', zIndex:2 }}>
          <div style={{ background:'#111814', border:'1px solid #1e2b24', borderRadius:12, padding:'10px 14px' }}>
            <div style={{ color:'#EF9F27', fontSize:11, fontWeight:600, marginBottom:4 }}>Credit Transfer</div>
            <div style={{ color:'#fff', fontSize:16, fontWeight:700 }}>+1 Credit ✓</div>
          </div>
        </div>
        <div className="animate-float" style={{ position:'absolute', bottom:'26%', right:'6%', zIndex:2, animationDelay:'1.5s' }}>
          <div style={{ background:'#111814', border:'1px solid #1e2b24', borderRadius:12, padding:'10px 14px' }}>
            <div style={{ display:'flex', gap:3, marginBottom:5 }}>{[...Array(5)].map((_,i) => <span key={i} style={{ color:'#EF9F27', fontSize:12 }}>★</span>)}</div>
            <div style={{ color:'#fff', fontSize:11 }}>Session rated 5.0</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ textAlign:'center', zIndex:3, padding:'80px 1rem 0', maxWidth:820 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(15,110,86,0.15)', border:'1px solid rgba(29,158,117,0.4)', borderRadius:20, padding:'6px 16px', marginBottom:32 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#1D9E75', display:'inline-block', animation:'pulse-dot 2s infinite' }} />
            <span style={{ color:'#1D9E75', fontSize:13, fontWeight:500 }}>Powering 47+ universities worldwide</span>
          </div>

          <h1 style={{ color:'#fff', fontSize:'clamp(2.5rem,6vw,4.5rem)', fontWeight:800, lineHeight:1.1, letterSpacing:'-2px', marginBottom:24, fontFamily:'Georgia,serif' }}>
            Students teach.<br />
            <span style={{ color:'#1D9E75' }}>Students learn.</span><br />
            <span style={{ color:'#EF9F27' }}>Everyone wins.</span>
          </h1>

          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:18, lineHeight:1.7, marginBottom:40, maxWidth:560, margin:'0 auto 40px' }}>
            The peer-to-peer skill exchange SaaS for universities and enterprises. Students earn credits by teaching, spend credits to learn.
          </p>

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={goToDash} className="btn-primary" style={{ padding:'14px 28px', fontSize:16, boxShadow:'0 6px 30px rgba(29,158,117,0.4)' }}>
              Launch Your Platform →
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior:'smooth' })} className="btn-secondary" style={{ padding:'14px 28px', fontSize:16 }}>
              See How It Works
            </button>
          </div>

          {/* School badges */}
          <div style={{ marginTop:56, display:'flex', alignItems:'center', justifyContent:'center', gap:20, flexWrap:'wrap' }}>
            <span style={{ color:'rgba(255,255,255,0.25)', fontSize:11, fontWeight:600, letterSpacing:'1px' }}>TRUSTED BY</span>
            {SCHOOLS.map(s => (
              <div key={s.name} style={{ display:'flex', alignItems:'center', gap:6, opacity:0.45 }}>
                <div style={{ width:22, height:22, borderRadius:4, background:s.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:700 }}>{s.name[0]}</div>
                <span style={{ color:'rgba(255,255,255,0.6)', fontSize:12, fontWeight:500 }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'#085041', padding:'56px 2rem' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:32, textAlign:'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ color:'#fff', fontSize:40, fontWeight:800, letterSpacing:'-1px' }}><Counter target={s.value} suffix={s.suffix} decimal={s.decimal} /></div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background:'#0a0f0d', padding:'100px 2rem' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>

          {/* How it works */}
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={{ color:'#fff', fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:800, fontFamily:'Georgia,serif', marginBottom:12 }}>How a session works</h2>
            <p style={{ color:'#5a7a6a', fontSize:16 }}>From search to credit transfer in 4 simple steps</p>
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, overflowX:'auto', paddingBottom:16, marginBottom:80 }}>
            {[
              { icon:'🔍', label:'Search', sub:'Find a skill' },
              { icon:'📤', label:'Request', sub:'Send booking' },
              { icon:'✅', label:'Accept', sub:'Teacher confirms' },
              { icon:'💳', label:'Credit held', sub:'1 credit locked' },
              { icon:'🎓', label:'Session', sub:'1 hour live' },
              { icon:'⭐', label:'Rate', sub:'Both rate' },
              { icon:'⇄', label:'Transfer', sub:'Credit moves' },
            ].map((step, i, arr) => (
              <div key={i} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
                <div style={{ textAlign:'center', minWidth:90 }}>
                  <div style={{ width:52, height:52, borderRadius:'50%', background: i === arr.length-1 ? '#0F6E56' : '#111814', border:`2px solid ${i === arr.length-1 ? '#0F6E56' : '#1e2b24'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, margin:'0 auto 8px', boxShadow:i===arr.length-1?'0 4px 20px rgba(15,110,86,0.5)':'none' }}>{step.icon}</div>
                  <div style={{ color:'#fff', fontSize:11, fontWeight:600 }}>{step.label}</div>
                  <div style={{ color:'#5a7a6a', fontSize:10 }}>{step.sub}</div>
                </div>
                {i < arr.length-1 && <div style={{ width:28, height:2, background:'#1e2b24', flexShrink:0 }} />}
              </div>
            ))}
          </div>

          {/* Feature cards */}
          {[
            { tag:'For Students', color:'#0F6E56', items:[
                { icon:'🔍', title:'Smart Skill Search', desc:'Filter by skill, level, time slot, and language.' },
                { icon:'💳', title:'Credit Economy', desc:'Teach 1 session → earn 1 credit. Spend 1 credit to learn.' },
                { icon:'⭐', title:'Peer Ratings', desc:'Both parties rate each other. Build your reputation.' },
                { icon:'📅', title:'Smart Scheduling', desc:'Set availability once. Auto-matched with reminders.' },
              ]},
            { tag:'For Admins', color:'#7F77DD', items:[
                { icon:'🏫', title:'Multi-Tenant SaaS', desc:'Each university gets its own isolated subdomain.' },
                { icon:'📊', title:'Real-Time Analytics', desc:'Track sessions, credits, popular skills, engagement.' },
                { icon:'🎨', title:'White-Labeling', desc:'Upload logo, set colors, write a welcome message.' },
                { icon:'👥', title:'User Management', desc:'Bulk import via CSV, assign roles, suspend accounts.' },
              ]},
          ].map((group, gi) => (
            <div key={gi} style={{ marginBottom:72 }}>
              <div style={{ textAlign:'center', marginBottom:40 }}>
                <span style={{ background:group.color, color:'#fff', fontSize:11, fontWeight:700, padding:'4px 14px', borderRadius:20, letterSpacing:'0.5px' }}>{group.tag}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20 }}>
                {group.items.map((item, i) => (
                  <div key={i} className="card card-hover" style={{ padding:24 }}>
                    <div style={{ fontSize:28, marginBottom:14 }}>{item.icon}</div>
                    <h3 style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>{item.title}</h3>
                    <p style={{ color:'#5a7a6a', fontSize:13, lineHeight:1.6, margin:0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS GRID ── */}
      <section style={{ background:'#070c09', padding:'70px 2rem' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ color:'#fff', fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:800, fontFamily:'Georgia,serif' }}>1,200+ skills on the platform</h2>
            <p style={{ color:'#5a7a6a', fontSize:15, marginTop:8 }}>From calculus to guitar — students teach what they know</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:12 }}>
            {SKILLS.map(skill => (
              <div key={skill.name} className="card card-hover" style={{ padding:16 }}>
                <div style={{ fontSize:26, marginBottom:8 }}>{skill.icon}</div>
                <div style={{ fontWeight:600, fontSize:13 }}>{skill.name}</div>
                <div style={{ color:'#5a7a6a', fontSize:11, marginTop:2 }}>{skill.cat}</div>
                <div style={{ color:'#5a7a6a', fontSize:10, marginTop:8 }}>{skill.sessions} sessions</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ background:'#0a0f0d', padding:'100px 2rem' }}>
        <div style={{ maxWidth:1050, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={{ color:'#fff', fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:800, fontFamily:'Georgia,serif', marginBottom:12 }}>Simple, transparent pricing</h2>
            <p style={{ color:'#5a7a6a' }}>Start free. Scale as your community grows.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:20 }}>
            {PLANS.map((plan, i) => (
              <div key={i} style={{
                background: plan.popular ? '#0d1f18' : '#111814',
                border: plan.popular ? '2px solid #0F6E56' : '1px solid #1e2b24',
                borderRadius:20, padding:28, position:'relative',
                transform: plan.popular ? 'scale(1.03)' : 'none',
                boxShadow: plan.popular ? '0 20px 60px rgba(15,110,86,0.25)' : 'none',
              }}>
                {plan.popular && (
                  <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#1D9E75,#EF9F27)', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 14px', borderRadius:20, whiteSpace:'nowrap', letterSpacing:'0.5px' }}>MOST POPULAR</div>
                )}
                <div style={{ color:'#5a7a6a', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:6 }}>{plan.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:3, marginBottom:4 }}>
                  <span style={{ color:'#fff', fontSize:38, fontWeight:800 }}>${plan.price}</span>
                  <span style={{ color:'#5a7a6a', fontSize:13 }}>/mo</span>
                </div>
                <div style={{ color:'#5a7a6a', fontSize:13, marginBottom:24 }}>{plan.users} users</div>
                <div style={{ borderTop:'1px solid #1e2b24', paddingTop:20, marginBottom:24 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display:'flex', gap:8, marginBottom:9 }}>
                      <span style={{ color:'#1D9E75', flexShrink:0 }}>✓</span>
                      <span style={{ color:'#5a7a6a', fontSize:13 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={goToDash} className="btn-primary" style={{ width:'100%', justifyContent:'center', background: plan.popular ? 'linear-gradient(135deg,#1D9E75,#0F6E56)' : 'transparent', border: plan.popular ? 'none' : '1.5px solid #0F6E56', color:'#fff' }}>
                  {plan.price === 0 ? 'Start Free' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'#0F6E56', padding:'80px 2rem', textAlign:'center' }}>
        <h2 style={{ color:'#fff', fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:800, fontFamily:'Georgia,serif', marginBottom:12 }}>Ready to launch your platform?</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:16, marginBottom:32 }}>Join 47+ institutions already using SkillSwap.</p>
        <button onClick={goToDash} className="btn-primary" style={{ padding:'14px 32px', fontSize:16, background:'#fff', color:'#0F6E56', boxShadow:'0 6px 30px rgba(0,0,0,0.3)' }}>
          Get Started Free →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#070c09', borderTop:'1px solid #1e2b24', padding:'48px 2rem 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:32, marginBottom:40 }}>
            <div style={{ maxWidth:260 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <div style={{ width:26, height:26, borderRadius:6, background:'linear-gradient(135deg,#1D9E75,#EF9F27)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>⇄</div>
                <span style={{ color:'#fff', fontWeight:700, fontSize:16 }}>SkillSwap</span>
              </div>
              <p style={{ color:'#5a7a6a', fontSize:13, lineHeight:1.7 }}>The peer-to-peer skill exchange platform built for universities and enterprises.</p>
            </div>
            {[
              ['Product',  ['Features','Pricing','Dashboard','Roadmap']],
              ['Company',  ['About','Blog','Careers','Press']],
              ['Legal',    ['Privacy','Terms','Security','GDPR']],
            ].map(([title, links]) => (
              <div key={title}>
                <div style={{ color:'#fff', fontSize:12, fontWeight:700, marginBottom:14, textTransform:'uppercase', letterSpacing:'0.5px' }}>{title}</div>
                {links.map(l => <div key={l} style={{ color:'#5a7a6a', fontSize:13, marginBottom:8, cursor:'pointer' }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid #1e2b24', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <span style={{ color:'#5a7a6a', fontSize:12 }}>© 2026 SkillSwap Inc. All rights reserved.</span>
            <span style={{ color:'#5a7a6a', fontSize:12 }}>Made for learners, by learners. 🌍</span>
          </div>
        </div>
      </footer>
    </div>
  )
}