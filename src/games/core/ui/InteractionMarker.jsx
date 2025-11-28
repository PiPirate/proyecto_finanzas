// src/games/core/ui/InteractionMarker.jsx
import React from 'react';
import './InteractionMarker.css';

/**
 * Punto de actividad con destello amarillo.
 * Recibe coordenadas de TILE (tileX, tileY) y el tamaño del tile.
 */
function InteractionMarker({ tileX, tileY, tileSize }) {
  const left = (tileX + 0.5) * tileSize;
  const top = (tileY + 0.5) * tileSize;

  return (
    <div
      className="interaction-marker"
      style={{ left, top }}
    />
  );
}

export default InteractionMarker;
