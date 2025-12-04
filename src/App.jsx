import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { units } from './data/courseStructure';

// Import dinámico de cada página
import Unit1Page from './pages/unit1/Unit1Page';
import Unit2Page from './pages/unit2/Unit2Page';
import Unit3Page from './pages/unit3/Unit3Page';
import Unit4Page from './pages/unit4/Unit4Page';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage units={units} />} />

        <Route path="/unit/unidad-1" element={<Unit1Page />} />
        <Route path="/unit/unidad-2" element={<Unit2Page />} />
        <Route path="/unit/unidad-3" element={<Unit3Page />} />
        <Route path="/unit/unidad-4" element={<Unit4Page />} />
      </Routes>
    </HashRouter>
  );
}
