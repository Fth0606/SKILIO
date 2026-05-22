import { Code, Languages, Bot, Music, Calculator, Palette, Mic, Globe } from 'lucide-react'

const SWIMMING_SKILLS = [
  { name: 'Python', icon: Code, color: '#306998' },
  { name: 'Français', icon: Languages, color: '#0055A4' },
  { name: 'AI/ML', icon: Bot, color: '#FF6B6B' },
  { name: 'Guitare', icon: Music, color: '#E44D26' },
  { name: 'Calculus', icon: Calculator, color: '#2775CA' },
  { name: 'Design', icon: Palette, color: '#F7DF1E' },
  { name: 'Speech', icon: Mic, color: '#9B59B6' },
  { name: 'Español', icon: Globe, color: '#EAB308' },
]

const generateFloatingSkills = () => Array.from({ length: 12 }, (_, i) => ({
  id: i,
  skill: SWIMMING_SKILLS[i % SWIMMING_SKILLS.length],
  startX: Math.random() * 100,
  startY: Math.random() * 100,
  size: 30 + Math.random() * 25,
  duration: 15 + Math.random() * 20,
  delay: Math.random() * -20,
  rotation: Math.random() * 360,
  opacity: 0.12 + Math.random() * 0.2,
}))

// Generate once at module level to avoid re-renders
const FLOATING_SKILLS = generateFloatingSkills()

export default function SwimmingSkills() {
  return (
    <div className="swimming-skills-bg" aria-hidden="true">
      <div className="swimming-skills-container">
        {FLOATING_SKILLS.map((item) => {
          const Icon = item.skill.icon
          return (
            <div
              key={item.id}
              className="swimming-skill-item"
              style={{
                '--start-x': `${item.startX}%`,
                '--start-y': `${item.startY}%`,
                '--size': `${item.size}px`,
                '--duration': `${item.duration}s`,
                '--delay': `${item.delay}s`,
                '--rotation': `${item.rotation}deg`,
                '--opacity': item.opacity,
                '--color': item.skill.color,
              }}
            >
              <Icon size={item.size * 0.4} strokeWidth={1.5} />
            </div>
          )
        })}
      </div>
      <style>{`
        .swimming-skills-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .swimming-skills-container {
          position: absolute;
          inset: 0;
        }

        .swimming-skill-item {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          left: var(--start-x);
          top: var(--start-y);
          width: var(--size);
          height: var(--size);
          color: var(--color);
          opacity: var(--opacity);
          filter: drop-shadow(0 0 8px var(--color));
          animation: swim-around var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          transform: rotate(var(--rotation));
        }

        @keyframes swim-around {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(100px, -80px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translate(-50px, 100px) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translate(-120px, -50px) rotate(270deg) scale(1.05);
          }
          100% {
            transform: translate(0, 0) rotate(360deg) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
