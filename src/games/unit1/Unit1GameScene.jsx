// src/games/unit1/Unit1GameScene.jsx
import React, { useCallback, useState } from 'react';
import TileMap from '../core/map/TileMap';
import Player from '../core/player/Player';
import usePlayerMovement from '../core/hooks/usePlayerMovement';

import {
  unit1MapMatrix,
  unit1TileSize,
  unit1PlayerStart,
  unit1InteractiveZones,
} from '../../data/games/unit1Map';

import hallImage from '../../assets/unit1/mapa_banco.png';
import girlSpriteSheet from '../../assets/general/la socia caminando.png';

import './Unit1GameScene.css';

function Unit1GameScene({ onGoalReached }) {
  const [activeZone, setActiveZone] = useState(null);

  const handleStep = useCallback(() => {
    // Aquí se podrían manejar triggers por tiles diferentes en el futuro
  }, []);

  const { tilePosition, pixelPosition, isMoving, direction } = usePlayerMovement({
    initialTilePosition: unit1PlayerStart,
    tileSize: unit1TileSize,
    mapMatrix: unit1MapMatrix,
    blockingTileTypes: [1, 2], // 2 bloquea el paso (muebles, marranito)
    interactiveTileTypes: [],  // no usamos interacción "al pisar" por ahora
    moveDuration: 260,
    onStep: handleStep,
  });

  // Click sobre el mapa
  const handleTileClick = ({ x, y, value }) => {
    // Solo nos interesan los tiles 2 (interactuables)
    if (value !== 2) {
      setActiveZone(null);
      return;
    }

    // Distancia en tiles entre el jugador y el tile clickeado
    const dx = Math.abs(x - tilePosition.x);
    const dy = Math.abs(y - tilePosition.y);

    // Máximo 1 cuadrito de distancia en cualquier dirección (incluye diagonales)
    if (Math.max(dx, dy) > 1) {
      return;
    }

    // ¿Es una zona especial con metadata?
    const zoneMeta =
      unit1InteractiveZones.find((z) => z.x === x && z.y === y) || null;

    const zone = zoneMeta || { id: null, x, y, type: 'generic' };
    setActiveZone(zone);

    // Ejemplo: puedes usar cualquiera de las zonas para marcar "completado"
    if (
      zoneMeta &&
      zoneMeta.id === 'budget_1' &&
      typeof onGoalReached === 'function'
    ) {
      onGoalReached();
    }
  };

  const closePopup = () => setActiveZone(null);

  return (
    <div className="unit1-game-container">
      <TileMap
        mapMatrix={unit1MapMatrix}
        tileSize={unit1TileSize}
        mapImage={hallImage}
        onTileClick={handleTileClick}
      >
        <Player
          pixelPosition={pixelPosition}
          tileSize={unit1TileSize}
          isMoving={isMoving}
          spriteSheet={girlSpriteSheet}
          direction={direction}
        />
      </TileMap>

      {activeZone && (
        <div className="unit1-popup">
          {activeZone.type === 'advisor' && (
            <>
              <h3>Asesor financiero</h3>
              <p>
                Aquí puedes hablar con tu asesor sobre tus metas y tu presupuesto.
              </p>
            </>
          )}

          {activeZone.type === 'budget-station' && (
            <>
              <h3>Estación de presupuesto</h3>
              <p>
                Esta mesa representa tu presupuesto mensual: alimentos, facturas y
                transporte.
              </p>
            </>
          )}

          {activeZone.type === 'piggy-bank' && (
            <>
              <h3>Marranito de ahorro</h3>
              <p>
                Este marranito simboliza tu fondo de ahorro. Cada moneda que guardas aquí
                te acerca a tus metas financieras.
              </p>
            </>
          )}

          {activeZone.type === 'generic' && (
            <>
              <h3>Elemento interactivo</h3>
              <p>
                Has hecho clic sobre un objeto interactivo en ({activeZone.x},{' '}
                {activeZone.y}).
              </p>
            </>
          )}

          <button className="unit1-popup-close" onClick={closePopup}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

export default Unit1GameScene;
