import { useEffect, useMemo, useState } from 'react'
import CourseLayout from './layouts/CourseLayout'
import HomePage from './pages/HomePage'
import UnitPage from './pages/UnitPage'
import { units as unitsData } from './data/courseStructure'
import './App.css'

const parseHashRoute = (hash) => {
  if (!hash) {
    return null
  }

  const normalized = hash.startsWith('#') ? hash.slice(1) : hash
  if (!normalized || normalized === '/' || normalized === '#/') {
    return null
  }

  const segments = normalized.replace(/^\//u, '').split('/')
  if (segments[0] === 'unidades' && segments[1]) {
    return segments[1]
  }

  return null
}

function App() {
  const [units] = useState(() => unitsData.map((unit) => ({ ...unit })))
  const [activeUnit, setActiveUnit] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }

    return parseHashRoute(window.location.hash)
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleHashChange = () => {
      setActiveUnit(parseHashRoute(window.location.hash))
    }

    window.addEventListener('hashchange', handleHashChange)

    if (!window.location.hash) {
      window.location.hash = '/'
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const selectedUnit = useMemo(
    () => units.find((unit) => unit.id === activeUnit) ?? null,
    [activeUnit, units]
  )

  const handleNavigateHome = () => {
    setActiveUnit(null)
    if (typeof window !== 'undefined') {
      window.location.hash = '/'
    }
  }

  const handleSelectUnit = (unitId) => {
    const unit = units.find((entry) => entry.id === unitId)
    if (unit?.isAvailable) {
      setActiveUnit(unitId)
      if (typeof window !== 'undefined') {
        window.location.hash = `/unidades/${unitId}`
      }
    }
  }

  return (
    <CourseLayout
      units={units}
      activeUnitSlug={activeUnit}
      onSelectUnit={handleSelectUnit}
      onNavigateHome={handleNavigateHome}
    >
      {selectedUnit ? (
        <UnitPage unit={selectedUnit} onNavigateHome={handleNavigateHome} />
      ) : (
        <HomePage units={units} onOpenUnit={handleSelectUnit} />
      )}
    </CourseLayout>
  )
}

export default App

