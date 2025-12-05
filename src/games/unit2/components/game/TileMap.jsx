import React from 'react';
import mapHome from '../../assets/mapHome.png';

export function TileMap({ mapData }) {
  const TILE_SIZE = 64;

  return (
    <div className="tile-map">
      <div
        className="tile-map-image"
        style={{
          width: `${mapData[0].length * TILE_SIZE}px`,
          height: `${mapData.length * TILE_SIZE}px`,
          backgroundImage: `url(${mapHome})`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />

      {/* Grid de referencia (opcional, para debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="tile-grid">
          {mapData.map((row, y) =>
            row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                className={`tile tile--${tile === 0 ? 'walkable' : 'blocked'}`}
                style={{
                  position: 'absolute',
                  left: `${x * TILE_SIZE}px`,
                  top: `${y * TILE_SIZE}px`,
                  width: `${TILE_SIZE}px`,
                  height: `${TILE_SIZE}px`,
                  pointerEvents: 'none',
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
