import { useState } from 'react'
import HomePage from './pages/HomePage'
import { units } from './data/courseStructure'

export default function App() {
  const [selectedUnit, setSelectedUnit] = useState(null)

  const handleOpenUnit = (unit) => {
    console.log('Opening unit:', unit)
    setSelectedUnit(unit)
    // Aquí puedes agregar la lógica para mostrar el contenido de la unidad
  }

  return (
    <div className="min-h-screen">
      <HomePage units={units} onOpenUnit={handleOpenUnit} />
    </div>
  )
}