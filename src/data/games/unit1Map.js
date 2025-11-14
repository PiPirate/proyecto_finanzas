// src/data/unit1Map.js

// Cada tile = 32x32 px
export const unit1TileSize = 32;

// Matriz 16x16 (512x512 px). Solo usamos la habitación de arriba del sprite.
// 1 = muro/obstáculo
// 0 = caminable
// 2 = zona interactiva
export const unit1MapMatrix = [
  // y = 0  (borde superior / techo)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // y = 1
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // y = 2
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // y = 3
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // y = 4 (parte alta de la pared)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  // y = 5 (suelo pegado al tablero)
  // x=7, y=5: frente al tablero verde
  [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1],

  // y = 6–7: suelo medio
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // y = 8: frente a la mesa izquierda y al cerdito derecha
  // (x=4, y=8) = metas (mesa de papeles)
  // (x=11, y=8) = ahorro (cerdito)
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],

  // y = 9–14: resto del suelo
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // y = 15 (borde inferior)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Posición inicial del jugador (centro inferior de la habitación)
export const unit1PlayerStart = { x: 8, y: 12 };

// Metadata para las zonas interactivas
export const unit1InteractiveZones = [
  { id: 'tablero',     x: 7,  y: 5, type: 'stats-board' },
  { id: 'metas',       x: 4,  y: 8, type: 'goal-station' },
  { id: 'ahorro',      x: 11, y: 8, type: 'saving-station' },
];
