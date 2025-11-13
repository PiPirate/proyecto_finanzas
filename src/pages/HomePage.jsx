import UnitCard from '../components/cards/UnitCard'
import { courseOverview } from '../data/courseStructure'
import './HomePage.css'

const HomePage = ({ units, onOpenUnit }) => {
  return (
    <section className="home">
      <div className="home__intro">
        <h2>Bienvenido al módulo interactivo</h2>
        <p>{courseOverview.welcome}</p>
        <ul className="home__highlights">
          {courseOverview.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>

      <div className="home__units">
        <div className="home__units-header">
          <h2>Unidades del módulo</h2>
          <p>{courseOverview.description}</p>
        </div>
        <div className="home__grid">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} onOpen={onOpenUnit} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomePage
