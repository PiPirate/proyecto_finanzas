import UnitVideo from '../components/unit/UnitVideo'
import Unit1Tutorial from '../components/unit/tutorial/Unit1Tutorial'
import Unit1RhythmGame from '../components/unit/game/Unit1RhythmGame'
import videoPlaceholderImage from '../assets/unit1/video-placeholder.svg'
import './UnitPage.css'

const UnitPage = ({ unit, onNavigateHome }) => {
  const { content } = unit
  const isUnitOne = unit.id === 'unidad-1'

  return (
    <article className="unit">
      <header className="unit__header">
        <div className="unit__header-top">
          <button type="button" className="unit__back" onClick={onNavigateHome}>
            ← Volver al inicio
          </button>
          <span className="unit__label">Video + tutorial + minijuego</span>
        </div>
        <h2>{unit.title}</h2>
        <p className="unit__tagline">{unit.tagline}</p>
        <p className="unit__summary-text">{unit.summary}</p>
      </header>

      <section className="unit__section">
        <h3>Video explicativo</h3>
        {isUnitOne ? (
          <UnitVideo
            title={unit.title}
            description={unit.videoPlaceholder}
            image={videoPlaceholderImage}
            duration="6 minutos"
          />
        ) : (
          <div className="unit__video-placeholder">{unit.videoPlaceholder}</div>
        )}
      </section>

      {content ? (
        <>
          <section className="unit__section">
            <h3>Explicación del tema</h3>
            <p className="unit__lead">{content.explanation}</p>
          </section>

          <section className="unit__section unit__section--summary">
            <h3>Resumen del tema</h3>
            <div className="unit__summary-grid">
              <p>{content.summary.introduction}</p>
              <p>{content.summary.importance}</p>
              <div>
                <h4>Errores comunes</h4>
                <ul>
                  {content.summary.commonMistakes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Beneficios de dominarlo</h4>
                <ul>
                  {content.summary.benefits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="unit__section unit__section--tutorial">
            <h3>Tutorial jugable</h3>
            {isUnitOne ? (
              <>
                <Unit1Tutorial
                  assistant={content.tutorial.assistant}
                  flow={content.tutorial.flow}
                  setting={content.tutorial.setting}
                />
                <p className="unit__note">{content.tutorial.feedback}</p>
              </>
            ) : (
              <>
                <div className="unit__tutorial-overview">
                  <p>{content.tutorial.setting}</p>
                  <div className="unit__assistant">
                    <span className="unit__assistant-label">Asistente virtual</span>
                    <h4>{content.tutorial.assistant.name}</h4>
                    <p className="unit__assistant-role">{content.tutorial.assistant.role}</p>
                    <p className="unit__assistant-personality">{content.tutorial.assistant.personality}</p>
                  </div>
                </div>
                <ol className="unit__tutorial-flow">
                  {content.tutorial.flow.map((step) => (
                    <li key={step.title}>
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                      <ul>
                        {step.interactions.map((interaction) => (
                          <li key={interaction}>{interaction}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
                <p className="unit__note">{content.tutorial.feedback}</p>
              </>
            )}
          </section>

          <section className="unit__section unit__section--game">
            <h3>Minijuego final</h3>
            {isUnitOne ? (
              <>
                <Unit1RhythmGame />
                <div className="unit__game-details">
                  <div className="unit__game-header">
                    <div>
                      <h4>{content.finalGame.name}</h4>
                      <p>{content.finalGame.format}</p>
                    </div>
                    <p className="unit__game-objective">{content.finalGame.objective}</p>
                  </div>
                  <div className="unit__game-grid">
                    <div>
                      <h5>Canales de juego</h5>
                      <ul>
                        {content.finalGame.lanes.map((lane) => (
                          <li key={lane}>{lane}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5>Mecánicas principales</h5>
                      <ul>
                        {content.finalGame.mechanics.map((mechanic) => (
                          <li key={mechanic}>{mechanic}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5>Reglas y condiciones</h5>
                      <ul>
                        {content.finalGame.rules.map((rule) => (
                          <li key={rule}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5>Condiciones de victoria</h5>
                      <ul>
                        {content.finalGame.victoryConditions.map((condition) => (
                          <li key={condition}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5>Estados de fallo</h5>
                      <ul>
                        {content.finalGame.failStates.map((state) => (
                          <li key={state}>{state}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5>Notas visuales</h5>
                      <ul>
                        {content.finalGame.visualNotes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="unit__game-header">
                  <div>
                    <h4>{content.finalGame.name}</h4>
                    <p>{content.finalGame.format}</p>
                  </div>
                  <p className="unit__game-objective">{content.finalGame.objective}</p>
                </div>
                <div className="unit__game-grid">
                  <div>
                    <h5>Canales de juego</h5>
                    <ul>
                      {content.finalGame.lanes.map((lane) => (
                        <li key={lane}>{lane}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Mecánicas principales</h5>
                    <ul>
                      {content.finalGame.mechanics.map((mechanic) => (
                        <li key={mechanic}>{mechanic}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Reglas y condiciones</h5>
                    <ul>
                      {content.finalGame.rules.map((rule) => (
                        <li key={rule}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Condiciones de victoria</h5>
                    <ul>
                      {content.finalGame.victoryConditions.map((condition) => (
                        <li key={condition}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Estados de fallo</h5>
                    <ul>
                      {content.finalGame.failStates.map((state) => (
                        <li key={state}>{state}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Notas visuales</h5>
                    <ul>
                      {content.finalGame.visualNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </section>
        </>
      ) : null}
    </article>
  )
}

export default UnitPage
