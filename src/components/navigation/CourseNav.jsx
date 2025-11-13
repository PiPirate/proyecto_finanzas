import './CourseNav.css'

const CourseNav = ({ units, activeUnitSlug, onSelectUnit, onNavigateHome }) => {
  return (
    <nav className="course-nav" aria-label="Navegación del curso">
      <div className="course-nav__container">
        <button type="button" className="course-nav__home" onClick={onNavigateHome}>
          Inicio del módulo
        </button>
        <ul className="course-nav__list">
          {units.map((unit) => (
            <li key={unit.id}>
              <button
                type="button"
                className={`course-nav__item ${activeUnitSlug === unit.id ? 'is-active' : ''}`}
                onClick={() => onSelectUnit(unit.id)}
              >
                {unit.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default CourseNav
