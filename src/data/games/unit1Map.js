// src/data/unit1Map.js

// Usamos 16 columnas y 11 filas.
// La imagen mide 1008px de ancho, así que:
// 1008 / 16 = 63px → cada tile será de 63px
export const unit1TileSize = 63;

// Convención:
// 0 = caminable
// 1 = obstáculo (paredes, escritorios, plantas, cerdito)
// 2 = interactivo (frente al asesor, frente a la mesa de presupuesto)
export const unit1MapMatrix = [
  // y = 0: borde superior
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  // y = 1: zona trasera (pared / parte alta de los muebles)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],

  // y = 2: escritorios del asesor (izquierda) y mesa "BUDGET" (derecha)
  // Bloqueamos las zonas donde están los muebles.
  // x 1..4: escritorio asesor, x 9..14: mesa presupuesto
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],

  // y = 3: parte baja de los muebles (también obstáculos)
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1],

  // y = 4: fila frente a los muebles (aquí ponemos las zonas interactivas)
  // (x=2, y=4) -> frente al asesor
  // (x=10, y=4) -> frente a la mesa de presupuesto
  [1, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 1],

  // y = 5–8: suelo caminable (zona central)
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // y = 9: fila más baja caminable
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  // y = 10: borde inferior
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Posición inicial del jugador (abajo, más o menos centrada)
export const unit1PlayerStart = { x: 8, y: 8 };

// Zonas interactivas que coinciden con los 2 de la matriz
export const unit1InteractiveZones = [
  { id: 'advisor_1', x: 2, y: 4, type: 'advisor' },
  { id: 'budget_1',  x: 10, y: 4, type: 'budget-station' },
];
