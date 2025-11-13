import './UnitCard.css'

const UnitCard = ({ unit, onOpen }) => {
  const handleOpen = () => {
    if (unit.isAvailable) {
      onOpen(unit.id)
    }
  }

  return (
    <article className={`unit-card ${unit.isAvailable ? '' : 'unit-card--locked'}`}>
      <div className="unit-card__header">
        <h3 className="unit-card__title">{unit.title}</h3>
        <p className="unit-card__tagline">{unit.tagline}</p>
      </div>
      <p className="unit-card__summary">{unit.summary}</p>
      {unit.highlights?.length ? (
        <ul className="unit-card__highlights">
          {unit.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
      {unit.comingSoonMessage && !unit.isAvailable ? (
        <p className="unit-card__coming-soon">{unit.comingSoonMessage}</p>
      ) : null}
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
