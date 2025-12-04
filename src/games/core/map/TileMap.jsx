// src/games/core/map/TileMap.jsx
import React from 'react';
import './TileMap.css';

// Props:
// - mapMatrix
// - tileSize
// - mapImage
// - onTileClick({ x, y, value })
// - children
function TileMap({
  mapMatrix,
  tileSize,
  mapImage,
  onTileClick,
  children,
  cameraPosition,
  viewportRef,
}) {
  const rows = mapMatrix.length;
  const cols = mapMatrix[0].length;

  const width = cols * tileSize;
  const height = rows * tileSize;

  const style = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundImage: mapImage ? `url(${mapImage})` : 'none',
  };

  function handleClick(event) {
    if (!onTileClick) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const tileX = Math.floor(offsetX / tileSize);
    const tileY = Math.floor(offsetY / tileSize);

    if (
      tileX < 0 ||
      tileY < 0 ||
      tileX >= cols ||
      tileY >= rows
    ) {
      return;
    }

    const value = mapMatrix[tileY][tileX];

    onTileClick({ x: tileX, y: tileY, value });
  }

  const isCameraActive = Boolean(cameraPosition && viewportRef);

  const wrapperStyle = isCameraActive
    ? {
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 'var(--app-vh, 100dvh)',
        overflow: 'hidden',
      }
    : {};

  const cameraStyle = isCameraActive
    ? {
        ...style,
        transform: `translate(${-cameraPosition.x}px, ${-cameraPosition.y}px)`,
      }
    : style;

  const content = (
    <div className="tile-map" style={cameraStyle} onClick={handleClick}>
      {children}
    </div>
  );

  if (!isCameraActive) return content;

  return (
    <div className="tile-map-viewport" ref={viewportRef} style={wrapperStyle}>
      {content}
    </div>
  );
}

export default TileMap;
