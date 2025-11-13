import UnitCard from '../components/cards/UnitCard'
import { courseOverview } from '../data/courseStructure'
import './HomePage.css'

const HomePage = ({ units, onOpenUnit }) => {
  return (
    <section className="home">
      <div className="home__hero">
        <h2>Bienvenido al módulo</h2>
        <p>{courseOverview.description}</p>
        <ul className="home__goals">
          {courseOverview.goals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </div>
      <div className="home__units">
        <h2>Unidades disponibles</h2>
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
