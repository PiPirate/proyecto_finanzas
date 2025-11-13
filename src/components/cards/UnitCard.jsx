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
  
  // Extract gradient colors from Tailwind classes
  const gradientColors = {
    'from-blue-500 to-cyan-500': { from: '#3b82f6', to: '#06b6d4' },
    'from-purple-500 to-pink-500': { from: '#a855f7', to: '#ec4899' },
    'from-green-500 to-emerald-500': { from: '#22c55e', to: '#10b981' },
    'from-orange-500 to-red-500': { from: '#f97316', to: '#ef4444' }
  }
  
  const colors = gradientColors[unit.color] || gradientColors['from-blue-500 to-cyan-500']
  
  return (
    <div 
      className="unit-card"
      style={{ '--gradient-from': colors.from, '--gradient-to': colors.to }}
    >
      <div className="unit-card-inner">
        {/* Header */}
        <div className="unit-header">
          <div className="unit-icon">
            <Icon />
          </div>
          <span className="unit-number">{unit.number}</span>
        </div>

        {/* Title */}
        <h3 className="unit-title">
          {unit.title}
        </h3>
        
        {/* Tagline */}
        <p className="unit-tagline">
          {unit.tagline}
        </p>

        {/* Description */}
        <p className="unit-description">
          {unit.description}
        </p>

        {/* Meta info */}
        <div className="unit-meta">
          <span className="unit-badge">
            <Clock className="w-3 h-3" />
            {unit.duration}
          </span>
          <span className="unit-badge unit-badge-outline">
            <TrendingUp className="w-3 h-3" />
            {unit.difficulty}
          </span>
        </div>

        {/* Highlights */}
        <ul className="unit-highlights">
          {unit.highlights.map((highlight, index) => (
            <li key={index} className="unit-highlight-item">
              <div className="unit-dot"></div>
              {highlight}
            </li>
          ))}
        </ul>

        {/* Action button */}
        {unit.isAvailable ? (
          <button 
            onClick={() => onOpen(unit)} 
            className="unit-button unit-button-primary"
          >
            Comenzar unidad
          </button>
        ) : (
          <button disabled className="unit-button unit-button-disabled">
            <Lock className="w-4 h-4" />
            Próximamente
          </button>
        )}
      </div>
    </div>
  )
}

export default UnitCard