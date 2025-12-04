// src/games/unit4/hooks/useUnit4MobileAction.js
import { useCallback, useEffect } from 'react';

export default function useUnit4MobileAction({
  isMobile,
  isDialogueVisible,
  handleDialogueNext,
  findNearestInteractive,
  handleTileClick,
}) {
  const onMobileAction = useCallback(() => {
    if (!isMobile) return;

    // 1) Si hay diálogo abierto → avanzar diálogo
    if (isDialogueVisible) {
      handleDialogueNext();
      return;
    }

    // 2) Si no hay diálogo → buscar zona interactiva cercana
    const nearest = findNearestInteractive();
    if (!nearest) return;

    // En el mapa, las zonas interactivas son tipo 2, así que lo forzamos
    handleTileClick({
      x: nearest.x,
      y: nearest.y,
      value: 2,
    });
  }, [isMobile, isDialogueVisible, handleDialogueNext, findNearestInteractive, handleTileClick]);

  useEffect(() => {
    if (!isMobile) return undefined;

    // Nos enganchamos al evento de los botones GENERALES
    window.addEventListener('mobile-action', onMobileAction);
    return () => {
      window.removeEventListener('mobile-action', onMobileAction);
    };
  }, [isMobile, onMobileAction]);
}
