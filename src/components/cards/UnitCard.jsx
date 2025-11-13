import './UnitCard.css'

const UnitCard = ({ unit, onOpen }) => {
  const handleOpen = () => {
    if (unit?.isAvailable && typeof onOpen === 'function') {
      onOpen(unit.id)
    }
  }

  return (
    <article className={`unit-card ${unit.isAvailable ? '' : 'unit-card--locked'}`}>
      <div className="unit-card__header">
        <h3 className="unit-card__title">{unit.title}</h3>
        {unit.tagline && <p className="unit-card__tagline">{unit.tagline}</p>}
      </div>

      {unit.summary && <p className="unit-card__summary">{unit.summary}</p>}
      {!unit.summary && unit.description && (
        <p className="unit-card__summary">{unit.description}</p>
      )}

      {unit.highlights?.length ? (
        <ul className="unit-card__highlights">
          {unit.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}

      {(unit.video?.title || unit.learningGame?.title || unit.evaluationGame?.title) && (
        <div className="unit-card__meta">
          {unit.video?.title && <span className="unit-card__meta-item">{unit.video.title}</span>}
          {unit.learningGame?.title && (
            <span className="unit-card__meta-item">{unit.learningGame.title}</span>
          )}
          {unit.evaluationGame?.title && (
            <span className="unit-card__meta-item">{unit.evaluationGame.title}</span>
          )}
        </div>
      )}

      {unit.comingSoonMessage && !unit.isAvailable && (
        <p className="unit-card__coming-soon">{unit.comingSoonMessage}</p>
      )}

      <button
        type="button"
        className="unit-card__action"
        onClick={handleOpen}
        disabled={!unit.isAvailable}
        aria-disabled={!unit.isAvailable}
      >
        {unit.isAvailable ? 'Explorar unidad' : 'Próximamente'}
      </button>
    </article>
  )
}

export default UnitCard

