import CourseNav from '../components/navigation/CourseNav'
import { courseOverview } from '../data/courseStructure'
import './CourseLayout.css'

const CourseLayout = ({ children, units, activeUnitSlug, onSelectUnit, onNavigateHome }) => {
  return (
    <div className="course-app">
      <header className="course-header">
        <div className="course-header__content">
          <h1 className="course-title" onClick={onNavigateHome} role="button" tabIndex={0}>
            {courseOverview.title}
          </h1>
          <p className="course-subtitle">{courseOverview.description}</p>
        </div>
      </header>
      <CourseNav
        units={units}
        activeUnitSlug={activeUnitSlug}
        onSelectUnit={onSelectUnit}
        onNavigateHome={onNavigateHome}
      />
      <main className="course-main">{children}</main>
      <footer className="course-footer">
        <small>© {new Date().getFullYear()} Programa de Educación Financiera</small>
      </footer>
    </div>
  )
}

export default CourseLayout
