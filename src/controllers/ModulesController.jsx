// src/controllers/ModulesController.jsx
import { useEffect, useState } from 'react';
import { getBeneficiarioByDocumento, actualizarNivel } from '../api/endpoint';
import { units } from '../data/courseStructure'; // array de unidades

// Documento por defecto mientras no tengas login
const DEFAULT_DOCUMENTO = '91111103'; // Cambia por el documento de prueba

// Máximo nivel basado en la cantidad de unidades definidas
const MAX_LEVEL = units.length;

export function useModulesController() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [nivel, setNivel] = useState(0); // Permitimos nivel 0
  const [modules, setModules] = useState([]);

  // Función para actualizar los módulos según el nivel
  const buildModules = (nivelActual) => {
    console.log('Calculando módulos con nivelActual:', nivelActual); // Log del nivel actual

    // 👇 Regla especial:
    // Si el nivel es 0, para disponibilidad tratamos como si fuera 1
    // (es decir, solo la unidad 1 desbloqueada).
    const effectiveLevel = nivelActual === 0 ? 1 : nivelActual;

    return units.map((u, index) => {
      const order = index + 1; // número de módulo

      // Si el nivel efectivo es mayor o igual al módulo, se desbloquea
      const isAvailable = effectiveLevel >= order;
      console.log(
        `Módulo ${order}: ${isAvailable ? 'Desbloqueado' : 'Bloqueado'}`
      ); // Log de si está desbloqueado

      return {
        ...u,
        order,
        isAvailable, // Se calcula dinámicamente
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1) obtener documento de localStorage o usar valor por defecto
        const storedDoc = localStorage.getItem('finanzas_doc');
        const documento = storedDoc || DEFAULT_DOCUMENTO; // Si no está en localStorage, usar un valor por defecto

        // 2) traer usuario por documento
        console.log('Buscando usuario por documento:', documento); // Log para verificar el documento que se busca
        const userData = await getBeneficiarioByDocumento(documento);

        if (!userData) {
          throw new Error(
            `No se encontró usuario con documento ${documento}`
          );
        }

        // 3) normalizar nivelactual a un valor entre 0 y MAX_LEVEL
        // Usamos ?? para respetar el 0; si viene undefined/null, usamos 0
        const nivelCrudo = Number(userData.nivelactual ?? 0);
        const nivelSafe = Math.min(
          MAX_LEVEL,
          Math.max(0, isNaN(nivelCrudo) ? 0 : nivelCrudo)
        );
        console.log(`Nivel del usuario (normalizado): ${nivelSafe}`); // Log del nivel del usuario

        setUser(userData);
        setNivel(nivelSafe);
        setModules(buildModules(nivelSafe)); // Actualizamos los módulos según el nivel
      } catch (err) {
        setError(err.message || 'Error al cargar progreso');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const canOpenModule = (moduleId) => {
    const modulo = modules.find((m) => m.id === moduleId);
    console.log(
      `Módulo ${moduleId} desbloqueado:`,
      modulo?.isAvailable
    ); // Log de si el módulo está desbloqueado
    return modulo?.isAvailable; // Revisamos si el módulo está desbloqueado
  };

  // Sumar un nivel cuando se completa un módulo
  const marcarModuloComoCompletado = async (moduleOrder) => {
    if (!user) return;

    const nivelCrudo = Number(user.nivelactual ?? 0);
    const nivelSafe = Math.min(
      MAX_LEVEL,
      Math.max(0, isNaN(nivelCrudo) ? 0 : nivelCrudo)
    );

    // Si completaste el módulo N, el siguiente nivel es N+1
    const nextLevel = Math.min(
      MAX_LEVEL,
      Math.max(nivelSafe, moduleOrder + 1)
    );
    console.log(
      `Siguiente nivel después de completar el módulo ${moduleOrder}:`,
      nextLevel
    ); // Log del nivel siguiente

    // Si el siguiente nivel es igual al actual, no hacemos nada
    if (nextLevel === nivelSafe) return;

    const updatedUser = await actualizarNivel(user, nextLevel);

    // Si el backend no devuelve el usuario actualizado, usamos un fallback local
    const safeUser = updatedUser || { ...user, nivelactual: nextLevel };
    const safeLevel = Number(safeUser.nivelactual ?? nextLevel);

    setUser(safeUser);
    setNivel(safeLevel);
    setModules(buildModules(safeLevel)); // Actualizamos los módulos según el nuevo nivel
  };

  return {
    loading,
    error,
    user,
    nivel,
    modules,
    canOpenModule,
    marcarModuloComoCompletado,
  };
}
