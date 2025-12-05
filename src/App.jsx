// src/App.jsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { units } from './data/courseStructure';

// Import dinámico de cada página
import Unit1Page from './pages/unit1/Unit1Page';
import Unit2Page from './pages/unit2/Unit2Page';
import Unit3Page from './pages/unit3/Unit3Page';
import Unit4Page from './pages/unit4/Unit4Page';

import { useModulesController } from './controllers/ModulesController';

export default function App() {
  // Usamos el controlador global para conocer el nivel del usuario
  const { nivel, loading, error } = useModulesController();

  // 👇 Nivel efectivo para disponibilidad:
  // Si el nivel es 0, tratamos como 1 para que SOLO la unidad 1 quede desbloqueada.
  const effectiveLevel = nivel === 0 ? 1 : nivel;

  // Construimos las units que verá el Home con isAvailable calculado aquí
  const unitsWithAvailability = units.map((u, index) => {
    const order = index + 1;
    const isAvailable = effectiveLevel >= order;

    return {
      ...u,
      isAvailable,
    };
  });

  return (
    <HashRouter>
      <Routes>
        {/* 
          Pasamos al Home las unidades ya "analizadas" según el nivel,
          y además loading/error/nivel por si quieres usarlos en la UI.
        */}
        <Route
          path="/"
          element={
            <HomePage
              units={unitsWithAvailability}
              loading={loading}
              error={error}
              nivel={nivel}
            />
          }
        />

        <Route path="/unit/unidad-1" element={<Unit1Page />} />
        <Route path="/unit/unidad-2" element={<Unit2Page />} />
        <Route path="/unit/unidad-3" element={<Unit3Page />} />
        <Route path="/unit/unidad-4" element={<Unit4Page />} />
      </Routes>
    </HashRouter>
  );
}
