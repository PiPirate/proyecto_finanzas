import './CourseNav.css'

const CourseNav = ({ units = [], activeUnitSlug, onSelectUnit, onNavigateHome }) => {
  const handleNavigateHome = () => {
    if (typeof onNavigateHome === 'function') {
      onNavigateHome()
    }
  }

  const handleSelectUnit = (unit) => {
    if (!unit?.isAvailable) return
    if (typeof onSelectUnit === 'function') {
      onSelectUnit(unit.id)
    }
  }

  return (
    <nav className="course-nav" aria-label="Navegación del curso">
      <div className="course-nav__container">
        <button
          type="button"
          className="course-nav__home"
          onClick={handleNavigateHome}
        >
          Inicio del módulo
        </button>

        <ul className="course-nav__list">
          {units.map((unit) => {
            const isActive = activeUnitSlug === unit.id
            const isDisabled = !unit.isAvailable

            return (
              <li key={unit.id}>
                <button
                  type="button"
                  className={`course-nav__item ${
                    isActive ? 'is-active' : ''
                  } ${isDisabled ? 'is-disabled' : ''}`}
                  onClick={() => handleSelectUnit(unit)}
                  disabled={isDisabled}
                  aria-disabled={isDisabled}
                >
                  {unit.title}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default CourseNav

