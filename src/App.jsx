import { useMemo, useState } from 'react'
import CourseLayout from './layouts/CourseLayout'
import HomePage from './pages/HomePage'
import UnitPage from './pages/UnitPage'
import { units as unitsData } from './data/courseStructure'
import './App.css'

function App() {
  const [activeUnit, setActiveUnit] = useState(null)
  const units = useMemo(() => unitsData, [])
  const selectedUnit = useMemo(
    () => units.find((unit) => unit.id === activeUnit) ?? null,
    [activeUnit, units]
  )

  const handleNavigateHome = () => setActiveUnit(null)
  const handleSelectUnit = (unitId) => setActiveUnit(unitId)

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
