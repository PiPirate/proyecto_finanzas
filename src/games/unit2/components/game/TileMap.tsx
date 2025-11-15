import React from 'react';

interface TileMapProps {
  mapData: number[][];
}

export function TileMap({ mapData }: TileMapProps) {
  const TILE_SIZE = 64;

  return (
    <div className="tile-map">
      {/* ASSET: Imagen del mapa completo de la casa */}
      <div
        className="tile-map-image"
        style={{
          width: `${mapData[0].length * TILE_SIZE}px`,
          height: `${mapData.length * TILE_SIZE}px`,
          backgroundImage: 'var(--map-image)',
          backgroundSize: 'cover',
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
                  border: '1px solid rgba(255, 255, 255, 0.1)',
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
