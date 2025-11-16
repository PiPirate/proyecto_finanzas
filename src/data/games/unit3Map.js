// Tamaño por tile (igual que la unidad 1)
export const unit3TileSize = 63;

// Convención:
// 0 = caminable
// 1 = obstáculo (paredes, plantas, muebles no interactivos)
// 2 = interactivo (pósters, escritorio madera, biblioteca, computador)

export const unit3MapMatrix = [
    // y = 0 → borde superior
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    // y = 1 → pared superior
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    // y = 2 → posters + biblioteca
    [1, 0, 2, 2, 0, 0, 2, 2, 2, 0, 2, 0, 1, 2, 1, 1],

    // y = 3 → escritorio madera + segunda fila de posters
    [1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1],

    // y = 4 → alfombra + plantas
    [1, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],

    // y = 5 → piso
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

    // y = 6 → piso
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

    // y = 7 → piso
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

    // y = 8 → escritorio con computadora (3 tiles interactivos)
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 1],

    // y = 9 → pared inferior
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    // y = 10 → borde inferior
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Posición inicial del jugador (recomendada: zona inferior centrada)
export const unit3PlayerStart = { x: 8, y: 7 };

// Definición de zonas interactivas
// Estas se activan con click y coinciden con todos los tiles '2'
export const unit3InteractiveZones = [
    // Posters fila superior
    { id: 'poster_prestamo', x: 2, y: 2, type: 'poster' },
    { id: 'poster_prestamo', x: 3, y: 2, type: 'poster' },

    { id: 'poster_necesidades', x: 6, y: 2, type: 'poster' },
    { id: 'poster_necesidades', x: 7, y: 2, type: 'poster' },
    { id: 'poster_necesidades', x: 8, y: 2, type: 'poster' },

    { id: 'poster_interes', x: 10, y: 2, type: 'poster' },

    // Biblioteca
    { id: 'biblioteca', x: 13, y: 2, type: 'library' },
    { id: 'biblioteca', x: 13, y: 3, type: 'library' },

    // Escritorio de madera (debajo del póster grande)
    { id: 'escritorio_madera', x: 2, y: 3, type: 'desk' },
    { id: 'escritorio_madera', x: 3, y: 3, type: 'desk' },

    // Alfombra roja (opcionalmente interactiva, pero NO la marcaste)
    // Si la quieres luego, la añadimos.

    // Escritorio con computador
    { id: 'computador', x: 9, y: 8, type: 'computer' },
    { id: 'computador', x: 10, y: 8, type: 'computer' },
    { id: 'computador', x: 11, y: 8, type: 'computer' },
];
