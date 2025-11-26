// src/games/core/hooks/useCameraFollow.js
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// Hook de cámara centrada en el jugador (pensado para móvil).
// - playerPixelPosition: posición del jugador en coordenadas del mundo (px).
// - mapDimensions: { width, height } en píxeles.
// - isEnabled: sólo se activa cuando queremos seguir al jugador (ej. móvil).
export function useCameraFollow({ playerPixelPosition, mapDimensions, isEnabled }) {
  const viewportRef = useRef(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 });

  const updateViewportSize = useCallback(() => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    setViewportSize({ width: rect.width, height: rect.height });
  }, []);

  useLayoutEffect(() => {
    updateViewportSize();
  }, [updateViewportSize]);

  useEffect(() => {
    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, [updateViewportSize]);

  useEffect(() => {
    if (!isEnabled) {
      // En escritorio mantenemos el mapa fijo.
      setCameraPosition({ x: 0, y: 0 });
      return;
    }

    const { width: viewportWidth, height: viewportHeight } = viewportSize;
    if (!viewportWidth || !viewportHeight) return;

    // Calcular la cámara para mantener al jugador en el centro del viewport.
    const targetX = playerPixelPosition.x - viewportWidth / 2;
    const targetY = playerPixelPosition.y - viewportHeight / 2;

    // Limitar la cámara para no mostrar fuera del mapa.
    const maxX = Math.max(0, mapDimensions.width - viewportWidth);
    const maxY = Math.max(0, mapDimensions.height - viewportHeight);

    setCameraPosition({
      x: Math.min(Math.max(0, targetX), maxX),
      y: Math.min(Math.max(0, targetY), maxY),
    });
  }, [
    isEnabled,
    mapDimensions.height,
    mapDimensions.width,
    playerPixelPosition.x,
    playerPixelPosition.y,
    viewportSize.height,
    viewportSize.width,
  ]);

  return { cameraPosition, viewportRef, viewportSize };
}

export default useCameraFollow;
