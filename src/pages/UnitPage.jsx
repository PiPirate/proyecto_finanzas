import GameHost from '../games/host/GameHost'
import './UnitPage.css'

const UnitPage = ({ unit, onNavigateHome }) => {
  return (
    <article className="unit">
      <header className="unit__header">
        <div>
          <button type="button" className="unit__back" onClick={onNavigateHome}>
            ← Volver al inicio
          </button>
          <h2>{unit.title}</h2>
        </div>
        <p>{unit.description}</p>
      </header>

      <section className="unit__section">
        <h3>Video introductorio</h3>
        <div className="unit__video">
          <iframe
            src={unit.video.url}
            title={unit.video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section className="unit__section">
        <h3>Juego de aprendizaje</h3>
        <GameHost game={unit.learningGame} />
      </section>

      <section className="unit__section">
        <h3>Juego de evaluación</h3>
        <GameHost game={unit.evaluationGame} variant="assessment" />
      </section>

      <section className="unit__section unit__section--columns">
        <div>
          <h4>Conceptos clave</h4>
          <ul>
            {unit.keyConcepts.map((concept) => (
              <li key={concept}>{concept}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Recursos descargables</h4>
          <ul>
            {unit.resources.map((resource) => (
              <li key={resource}>{resource}</li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  )
}

export default UnitPage
