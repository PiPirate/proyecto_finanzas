// src/data/games/unit1Map.js

// Usamos 16 columnas y 11 filas.
// La imagen mide 1008px de ancho, así que:
// 1008 / 16 = 63px → cada tile será de 63px
export const unit1TileSize = 63;

// Convención:
// 0 = caminable
// 1 = obstáculo (paredes, escritorios, plantas, cerdito)
// 2 = interactivo (objetos que se clickean; siguen bloqueando el paso)
export const unit1MapMatrix = [
  // y = 0: borde superior
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // y = 1: zona trasera (pared / parte alta de los muebles)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  // y = 2: escritorios del asesor (izquierda) y mesa "BUDGET" (derecha)
  // x 1..4: mueble asesor (izquierda)
  // x 7..11: mesa presupuesto (derecha)
  [1, 1, 1, 1, 1, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 1],
  // y = 3: superficie de los muebles (interactuables = 2)
  // Bloquean paso y se usan para click.
  [1, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 0, 0, 1, 1],
  // y = 4: fila frente a los muebles (caminable)
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  // y = 5–8: suelo caminable (zona central)
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  // y = 7: marranito (tile 2 en x=1)
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  // y = 9: fila más baja (pared)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // y = 10: borde inferior (extra por seguridad)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Posición inicial del jugador (abajo, más o menos centrada)
export const unit1PlayerStart = { x: 8, y: 8 };

// Zonas interactivas “especiales” dentro de los 2.
// Usamos una casilla central de cada mueble para poder distinguirlos.
export const unit1InteractiveZones = [
  // Escritorio del asesor: todos los 2 de la izquierda en y = 3
  { id: 'advisor_1', x: 1, y: 3, type: 'advisor' },
  { id: 'advisor_1', x: 2, y: 3, type: 'advisor' },
  { id: 'advisor_1', x: 3, y: 3, type: 'advisor' },
  { id: 'advisor_1', x: 4, y: 3, type: 'advisor' },

  // Mesa BUDGET: todos los 2 de la derecha en y = 2
  { id: 'budget_1', x: 7, y: 2, type: 'budget-station' },
  { id: 'budget_1', x: 8, y: 2, type: 'budget-station' },
  { id: 'budget_1', x: 9, y: 2, type: 'budget-station' },
  { id: 'budget_1', x: 10, y: 2, type: 'budget-station' },
  { id: 'budget_1', x: 11, y: 2, type: 'budget-station' },

  // Mesa BUDGET: todos los 2 de la derecha en y = 3
  { id: 'budget_1', x: 7, y: 3, type: 'budget-station' },
  { id: 'budget_1', x: 8, y: 3, type: 'budget-station' },
  { id: 'budget_1', x: 9, y: 3, type: 'budget-station' },
  { id: 'budget_1', x: 10, y: 3, type: 'budget-station' },
  { id: 'budget_1', x: 11, y: 3, type: 'budget-station' },

  // Marranito de ahorro (tile 2 en la fila 7, columna 1)
  { id: 'piggy_1', x: 1, y: 7, type: 'piggy-bank' },
];

