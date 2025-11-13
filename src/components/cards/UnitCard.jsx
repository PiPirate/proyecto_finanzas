import './UnitCard.css'

const UnitCard = ({ unit, onOpen }) => {
  return (
    <article className="unit-card">
      <h3 className="unit-card__title">{unit.title}</h3>
      <p className="unit-card__description">{unit.description}</p>
      <div className="unit-card__meta">
        <span>{unit.video.title}</span>
        <span>{unit.learningGame.title}</span>
        <span>{unit.evaluationGame.title}</span>
      </div>
      <button type="button" className="unit-card__action" onClick={() => onOpen(unit.id)}>
        Explorar unidad
      </button>
    </article>
  )
}

export default UnitCard
