import { Trophy, Target, Wallet, Music, Handshake, ShieldCheck, Zap, Footprints, Lock } from 'lucide-react'
import './AchievementCard.css'

const iconMap = {
  trophy: Trophy,
  target: Target,
  wallet: Wallet,
  music: Music,
  handshake: Handshake,
  'shield-check': ShieldCheck,
  zap: Zap,
  footprints: Footprints
}

const AchievementCard = ({ achievement }) => {
  const Icon = iconMap[achievement.icon] || Trophy
  const progressPercentage = (achievement.progress / achievement.total) * 100

  return (
    <div className={`achievement-card ${achievement.unlocked ? 'achievement-card-unlocked' : 'achievement-card-locked'}`}>
      <div className="achievement-content">
        {/* Icon */}
        <div className={`achievement-icon ${achievement.unlocked ? 'achievement-icon-unlocked' : 'achievement-icon-locked'}`}>
          {achievement.unlocked ? <Icon /> : <Lock />}
        </div>

        {/* Details */}
        <div className="achievement-details">
          <div className="achievement-header">
            <h4 className="achievement-title">{achievement.title}</h4>
            {achievement.unlocked && (
              <span className="achievement-badge">Desbloqueado</span>
            )}
          </div>
          
          <p className="achievement-description">
            {achievement.description}
          </p>

          {/* Progress */}
          <div className="achievement-progress-container">
            <div className="achievement-progress-bar">
              <div 
                className="achievement-progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="achievement-progress-text">
              {achievement.progress} / {achievement.total}
              {achievement.unlocked && achievement.unlockedDate && (
                <span> • {achievement.unlockedDate}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementCard