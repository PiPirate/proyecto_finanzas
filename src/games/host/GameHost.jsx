import { GameTypes } from '../types'
import './GameHost.css'

const GameHost = ({ game, variant = GameTypes.LEARNING }) => {
  const type = variant === GameTypes.ASSESSMENT ? GameTypes.ASSESSMENT : GameTypes.LEARNING
  const label = type === GameTypes.ASSESSMENT ? 'Evaluación' : 'Aprendizaje'

  return (
    <div className={`game-host game-host--${type}`}>
      <header className="game-host__header">
        <h4>{game.title}</h4>
        <span className="game-host__badge">{label}</span>
      </header>
      <p className="game-host__description">{game.description}</p>
      <div className="game-host__iframe">
        <iframe title={game.title} src={game.path} loading="lazy" />
      </div>
      <div className="game-host__meta">
        <span>Ruta del juego: {game.path}</span>
      </div>
    </div>
  )
}

export default GameHost
