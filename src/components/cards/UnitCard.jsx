import { Target, Wallet, Handshake, ShieldCheck, Lock, Clock, TrendingUp } from 'lucide-react'
import './UnitCard.css'

const iconMap = {
  target: Target,
  wallet: Wallet,
  handshake: Handshake,
  'shield-check': ShieldCheck
}

const UnitCard = ({ unit, onOpen }) => {
  const Icon = iconMap[unit.icon] || Target

  const gradientColors = {
    'from-blue-500 to-cyan-500': { from: '#3b82f6', to: '#06b6d4' },
    'from-purple-500 to-pink-500': { from: '#a855f7', to: '#ec4899' },
    'from-green-500 to-emerald-500': { from: '#22c55e', to: '#10b981' },
    'from-orange-500 to-red-500': { from: '#f97316', to: '#ef4444' }
  }

  const colors = gradientColors[unit.color] || gradientColors['from-blue-500 to-cyan-500']

  return (
    <div
      className="unitcard-wrapper"
      style={{ '--gradient-from': colors.from, '--gradient-to': colors.to }}
    >
      <div className="unitcard-inner">

        <div className="unitcard-header">
          <div className="unitcard-icon">
            <Icon />
          </div>
          <span className="unitcard-number">{unit.number}</span>
        </div>

        <h3 className="unitcard-title">{unit.title}</h3>
        <p className="unitcard-tagline">{unit.tagline}</p>
        <p className="unitcard-description">{unit.description}</p>

        <div className="unitcard-meta">
          <span className="unitcard-badge">
            <Clock className="icon-sm" /> {unit.duration}
          </span>
          <span className="unitcard-badge outline">
            <TrendingUp className="icon-sm" /> {unit.difficulty}
          </span>
        </div>

        <ul className="unitcard-list">
          {unit.highlights.map((h, i) => (
            <li key={i} className="unitcard-item">
              <div className="unitcard-dot"></div>
              {h}
            </li>
          ))}
        </ul>

        {unit.isAvailable ? (
          <button className="unitcard-btn primary" onClick={() => onOpen(unit)}>
            Comenzar unidad
          </button>
        ) : (
          <button className="unitcard-btn disabled" disabled>
            <Lock className="icon-sm" /> Próximamente
          </button>
        )}

      </div>
    </div>
  )
}

export default UnitCard
