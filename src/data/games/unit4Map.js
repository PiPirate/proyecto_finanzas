// src/data/games/unit4Map.js

// La imagen es 1008 x 1008 px → 16 x 16 tiles de 63 px
export const unit4TileSize = 63;

// Convención:
// 0 = caminable
// 1 = obstáculo (paredes, barra, mesas, planta)
// 2 = interactivo (barra del barista, mesas donde revisa el celular)
export const unit4MapMatrix = [
  // y = 0: borde superior
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  // y = 1: pared superior / margen
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  // y = 2: zona alta (estanterías, letrero “COFFEE”) → inaccesible
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  // y = 3: parte trasera de la barra (máquina, panes, taza, QR)
  // TODA la barra es interactiva y bloquea paso
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],

  // y = 4: parte frontal de la barra (mostrador)
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],

  // y = 5: fila justo frente a la barra (también interactiva)
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],

  // y = 6: suelo y planta (colisionador en la columna de la planta)
  [1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],

  // y = 7: más suelo + base de la planta
  [1, 0, 2 , 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],

  // y = 8: mesa superior (zona muy grande de interacción)
  [1, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // y = 9: parte baja de la mesa superior (bloquea más área)
  [1, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // y = 10: pasillo entre mesas (caminable)
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // y = 11: mesa inferior (también zona grande interactiva)
  [1, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // y = 12: patas de la mesa inferior (obstáculo)
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // y = 13: fila baja caminable
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // y = 14: pared inferior
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  // y = 15: borde inferior extra
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Posición inicial del jugador (abajo, centrado más o menos)
export const unit4PlayerStart = { x: 8, y: 13 };

// Zonas interactivas especiales (coinciden con algunos tiles = 2 del mapa)
export const unit4InteractiveZones = [
  // Barra / barista / QR: ahora también incluye y = 5

  // Parte trasera (y = 3)
  { id: 'vendor_1', x: 2, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 3, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 4, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 5, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 6, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 7, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 8, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 9, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 10, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 11, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 12, y: 3, type: 'vendor' },
  { id: 'vendor_1', x: 13, y: 3, type: 'vendor' },

  // Parte frontal (y = 4)
  { id: 'vendor_1', x: 2, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 3, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 4, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 5, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 6, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 7, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 8, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 9, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 10, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 11, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 12, y: 4, type: 'vendor' },
  { id: 'vendor_1', x: 13, y: 4, type: 'vendor' },

  // Fila extra de interacción frente a la barra (y = 5)
  { id: 'vendor_1', x: 2, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 3, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 4, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 5, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 6, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 7, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 8, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 9, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 10, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 11, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 12, y: 5, type: 'vendor' },
  { id: 'vendor_1', x: 13, y: 5, type: 'vendor' },

  // Mesas donde revisa el celular (zonas grandes en ambas mesas)
  // Mesa superior (y = 8–9)
  { id: 'phone_table_1', x: 2, y: 8, type: 'phone-table' },
  { id: 'phone_table_1', x: 3, y: 8, type: 'phone-table' },
  { id: 'phone_table_1', x: 4, y: 8, type: 'phone-table' },
  { id: 'phone_table_1', x: 2, y: 9, type: 'phone-table' },
  { id: 'phone_table_1', x: 3, y: 9, type: 'phone-table' },
  { id: 'phone_table_1', x: 4, y: 9, type: 'phone-table' },

  // Mesa inferior (y = 11)
  { id: 'phone_table_2', x: 2, y: 11, type: 'phone-table' },
  { id: 'phone_table_2', x: 3, y: 11, type: 'phone-table' },
  { id: 'phone_table_2', x: 4, y: 11, type: 'phone-table' },
];
