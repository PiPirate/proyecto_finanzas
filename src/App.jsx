import { HashRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

import Unit1Page from './pages/unit1/Unit1Page'

import { units } from './data/courseStructure'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage units={units} />} />

        <Route path="/unit/unidad-1" element={<Unit1Page />} />
      </Routes>
    </HashRouter>
  )
}
