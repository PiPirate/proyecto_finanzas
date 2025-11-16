// Mapa de la casa (0 = caminable, 1 = bloqueado)
// Dimensiones: 16 columnas x 12 filas (1024x768 pixels con tiles de 64x64)
export const tutorialMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,1,1,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
  [1,0,0,0,1,1,0,0,0,1,1,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,1,1,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];


// Zonas interactivas en el mapa
export const tutorialInteractiveZones = [
  // Asistente virtual (esquina superior izquierda)
  { id: 'assistant', x: 2, y: 2, type: 'assistant' },
  
  // Zona de necesidades (área izquierda)
  { id: 'needs_zone', x: 2, y: 8, type: 'needs_zone' },
  
  // Zona de gustos (área central)
  { id: 'wants_zone', x: 8, y: 8, type: 'wants_zone' },
  
  // Zona de ahorro (área derecha)
  { id: 'savings_zone', x: 13, y: 8, type: 'savings_zone' },
  
  // Mesa de presupuesto (centro superior)
  { id: 'budget_table', x: 8, y: 2, type: 'budget_table' },
];
