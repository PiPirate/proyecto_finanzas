// src/games/core/map/TileMap.jsx
import React from 'react';
import './TileMap.css';

// Renderiza el mapa de fondo y sirve como contenedor del jugador
function TileMap({ mapMatrix, tileSize, mapImage, children }) {
  const rows = mapMatrix.length;
  const cols = mapMatrix[0].length;

  const width = cols * tileSize;
  const height = rows * tileSize;

  const style = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundImage: mapImage ? `url(${mapImage})` : 'none',
  };

  return (
    <div className="tile-map" style={style}>
      {children}
    </div>
  );
}

export default TileMap;
