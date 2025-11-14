// src/games/unit1/Unit1GameScene.jsx
import React, { useCallback } from 'react';
import TileMap from '../core/map/TileMap';
import Player from '../core/player/Player';
import usePlayerMovement from '../core/hooks/usePlayerMovement';

import {
  unit1MapMatrix,
  unit1TileSize,
  unit1PlayerStart,
  unit1InteractiveZones,
} from '../../data/games/unit1Map';

import bankMapImage from '../../assets/unit1/mapa_banco.png';
import girlSpriteSheet from '../../assets/general/la socia caminando.png';


function Unit1GameScene({ onGoalReached }) {
  const handleStep = useCallback(
    ({ tilePosition, tile, isInteractive }) => {
      if (isInteractive) {
        const zone = unit1InteractiveZones.find(
          (z) => z.x === tilePosition.x && z.y === tilePosition.y
        );

        if (zone) {
          console.log(
            'Entraste a una zona interactiva:',
            zone.id,
            '| tipo:',
            zone.type,
            '| posición:',
            tilePosition
          );

          if (zone.id === 'tablero' && typeof onGoalReached === 'function') {
            onGoalReached();
          }
        } else {
          console.log('Tile interactivo (2) en', tilePosition, 'sin metadata específica');
        }
      }
    },
    [onGoalReached]
  );

  const { pixelPosition, isMoving, direction } = usePlayerMovement({
    initialTilePosition: unit1PlayerStart,
    tileSize: unit1TileSize,
    mapMatrix: unit1MapMatrix,
    blockingTileTypes: [1],
    interactiveTileTypes: [2],
    moveDuration: 260,
    onStep: handleStep,
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <TileMap
        mapMatrix={unit1MapMatrix}
        tileSize={unit1TileSize}
        mapImage={bankMapImage}
      >
        <Player
          pixelPosition={pixelPosition}
          tileSize={unit1TileSize}
          isMoving={isMoving}
          spriteSheet={girlSpriteSheet}
          direction={direction}
        />
      </TileMap>
    </div>
  );
}

export default Unit1GameScene;
