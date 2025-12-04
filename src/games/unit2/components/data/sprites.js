// sprites.js - Centralizamos todos los sprites del juego

// ====================================
// SPRITES DE DIÁLOGOS
// ====================================

// MK-25 (Asesor/Asistente)
export const MK25_IDLE = 'url(../../assets/mapHome.png)';
export const MK25_TALKING = 'URL_DE_TU_SPRITE_MK25_TALKING.png';

// Jugador/Carmina
export const PLAYER_IDLE = 'URL_DE_TU_SPRITE_JUGADOR_IDLE.png';
export const PLAYER_TALKING = 'URL_DE_TU_SPRITE_JUGADOR_TALKING.png';

// Cerdito/Alcancía
export const PIG_SPRITE = 'URL_DE_TU_SPRITE_CERDITO.png';

// ====================================
// SPRITES DE MOVIMIENTO (para el mapa)
// ====================================

// Jugador caminando
export const PLAYER_WALK_UP = 'URL_SPRITE_CAMINAR_ARRIBA.png';
export const PLAYER_WALK_DOWN = 'URL_SPRITE_CAMINAR_ABAJO.png';
export const PLAYER_WALK_LEFT = 'URL_SPRITE_CAMINAR_IZQUIERDA.png';
export const PLAYER_WALK_RIGHT = 'URL_SPRITE_CAMINAR_DERECHA.png';

// NPC MK-25 en el mapa
export const NPC_MK25 = 'URL_SPRITE_MK25_MAPA.png';

// ====================================
// OBJETO PARA FÁCIL ACCESO
// ====================================

export const DIALOGUE_SPRITES = {
  'MK-25': {
    idle: MK25_IDLE,
    talking: MK25_TALKING,
  },
  'Jugador': {
    idle: PLAYER_IDLE,
    talking: PLAYER_TALKING,
  },
  'Asesor': {
    idle: MK25_IDLE,
    talking: MK25_TALKING,
  },
  'Carmina': {
    idle: PLAYER_IDLE,
    talking: PLAYER_TALKING,
  },
  'Cerdito': {
    idle: PIG_SPRITE,
    talking: PIG_SPRITE, // El cerdito no habla, mismo sprite
  },
  'Alcancía': {
    idle: PIG_SPRITE,
    talking: PIG_SPRITE,
  },
};

// Función helper para obtener sprites por nombre
export const getSpritesByName = (speakerName) => {
  return DIALOGUE_SPRITES[speakerName] || {
    idle: undefined,
    talking: undefined,
  };
};
