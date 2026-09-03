import { HashRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { units } from './data/courseStructure';
import { CourseProgressProvider, useCourseProgress } from './progress/courseProgress';

// Import dinámico de cada página
import Unit1Page from './pages/unit1/Unit1Page';
import Unit2Page from './pages/unit2/Unit2Page';
import Unit3Page from './pages/unit3/Unit3Page';
import Unit4Page from './pages/unit4/Unit4Page';

function ProtectedUnit({ unitId, children }) {
  const { isUnitUnlocked } = useCourseProgress();
  return isUnitUnlocked(unitId) ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <HashRouter>
      <CourseProgressProvider>
        <Routes>
          <Route path="/" element={<HomePage units={units} />} />

          <Route path="/unit/unidad-1" element={<ProtectedUnit unitId="unidad-1"><Unit1Page /></ProtectedUnit>} />
          <Route path="/unit/unidad-2" element={<ProtectedUnit unitId="unidad-2"><Unit2Page /></ProtectedUnit>} />
          <Route path="/unit/unidad-3" element={<ProtectedUnit unitId="unidad-3"><Unit3Page /></ProtectedUnit>} />
          <Route path="/unit/unidad-4" element={<ProtectedUnit unitId="unidad-4"><Unit4Page /></ProtectedUnit>} />
        </Routes>
      </CourseProgressProvider>
    </HashRouter>
  );
}
