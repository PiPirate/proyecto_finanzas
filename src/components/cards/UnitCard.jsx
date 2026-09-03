import { Target, Wallet, Handshake, ShieldCheck, Lock, Clock, TrendingUp, CheckCircle2 } from 'lucide-react'
import './UnitCard.css'

const iconMap = {
  target: Target,
  wallet: Wallet,
  handshake: Handshake,
  'shield-check': ShieldCheck
}

const UnitCard = ({ unit, onOpen }) => {
  const Icon = iconMap[unit.icon] || Target
  const isCompleted = unit.progress?.status === 'completed'
  const isInProgress = unit.progress?.status === 'in_progress'
  const completedStages = Object.keys(unit.progress?.stages || {}).length
  const progressPercent = Math.round((completedStages / 3) * 100)

  const gradientColors = {
    'from-blue-500 to-cyan-500': { from: '#3b82f6', to: '#06b6d4' },
    'from-purple-500 to-pink-500': { from: '#a855f7', to: '#ec4899' },
    'from-green-500 to-emerald-500': { from: '#22c55e', to: '#10b981' },
    'from-orange-500 to-red-500': { from: '#f97316', to: '#ef4444' }
  }

  const colors = gradientColors[unit.color] || gradientColors['from-blue-500 to-cyan-500']

  return (
    <div
      className={`unitcard-wrapper ${!unit.isUnlocked ? 'unitcard-wrapper--locked' : ''}`}
      style={{ '--gradient-from': colors.from, '--gradient-to': colors.to }}
    >
      <div className="unitcard-inner">

        <div className="unitcard-header">
          <div className="unitcard-icon">
            <Icon />
          </div>
          <div className="unitcard-header-status">
            <span className={`unitcard-status ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : ''}`}>
              {isCompleted ? 'Completada' : isInProgress ? 'En progreso' : unit.isUnlocked ? 'Disponible' : 'Bloqueada'}
            </span>
            <span className="unitcard-number">{unit.number}</span>
          </div>
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

        {unit.isUnlocked && (
          <div className="unitcard-progress" aria-label={`Progreso ${progressPercent}%`}>
            <div className="unitcard-progress-label">
              <span>Progreso</span>
              <span>{completedStages}/3 etapas</span>
            </div>
            <div className="unitcard-progress-track">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}

        {unit.isUnlocked ? (
          <button className="unitcard-btn primary" onClick={() => onOpen(unit)}>
            {isCompleted ? <><CheckCircle2 className="icon-sm" /> Revisar unidad</> : isInProgress ? 'Continuar unidad' : 'Comenzar unidad'}
          </button>
        ) : (
          <button className="unitcard-btn disabled" disabled>
            <Lock className="icon-sm" /> Completa primero la unidad anterior
          </button>
        )}

      </div>
    </div>
  )
}

export default UnitCard
