// Tamaño por tile (igual que la unidad 1)
export const unit3TileSize = 63;

// Convención:
// 0 = caminable
// 1 = obstáculo (paredes, plantas, muebles no interactivos)
// 2 = interactivo (pósters, escritorio madera, biblioteca, computador)

export const unit3MapMatrix = [
    // y = 0 → borde superior
    [1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 1, 2, 1],

    // y = 1 → poster de ineteres y biblioteca
    [1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 1, 2, 1],

    // y = 2 → poster de necesidades
    [1, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 1],

    // y = 3 → escritorio madera (es el cliceable para sabersobre prestamos)
    [1, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

    // y = 4 → escritorio de manera la otra parte
    [1, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

    // y = 5 → piso
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

    // y = 6 → computadora
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 1],

    // y = 7 → la otra parte de la computadora
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 1],

    // y = 8 → piso
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

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
    // -----------------------------------------------------
    // POSTER PRÉSTAMO + ESCRITORIO (columnas 2–4, filas 0–4)
    // -----------------------------------------------------
    { id: "poster_prestamo", x: 2, y: 0, type: "desk" },
    { id: "poster_prestamo", x: 3, y: 0, type: "desk" },
    { id: "poster_prestamo", x: 4, y: 0, type: "desk" },

    { id: "poster_prestamo", x: 2, y: 1, type: "desk" },
    { id: "poster_prestamo", x: 3, y: 1, type: "desk" },
    { id: "poster_prestamo", x: 4, y: 1, type: "desk" },

    { id: "poster_prestamo", x: 2, y: 2, type: "desk" },
    { id: "poster_prestamo", x: 3, y: 2, type: "desk" },
    { id: "poster_prestamo", x: 4, y: 2, type: "desk" },

    { id: "poster_prestamo", x: 2, y: 3, type: "desk" },
    { id: "poster_prestamo", x: 3, y: 3, type: "desk" },
    { id: "poster_prestamo", x: 4, y: 3, type: "desk" },

    { id: "poster_prestamo", x: 2, y: 4, type: "desk" },
    { id: "poster_prestamo", x: 3, y: 4, type: "desk" },
    { id: "poster_prestamo", x: 4, y: 4, type: "desk" },

    // -----------------------------------------------------
    // POSTER NECESIDADES (columnas 7–9, filas 0–2)
    // -----------------------------------------------------
    { id: "poster_necesidades", x: 7, y: 0, type: "poster" },
    { id: "poster_necesidades", x: 8, y: 0, type: "poster" },
    { id: "poster_necesidades", x: 9, y: 0, type: "poster" },

    { id: "poster_necesidades", x: 7, y: 1, type: "poster" },
    { id: "poster_necesidades", x: 8, y: 1, type: "poster" },
    { id: "poster_necesidades", x: 9, y: 1, type: "poster" },

    { id: "poster_necesidades", x: 7, y: 2, type: "poster" },
    { id: "poster_necesidades", x: 8, y: 2, type: "poster" },
    { id: "poster_necesidades", x: 9, y: 2, type: "poster" },

    // -----------------------------------------------------
    // POSTER INTERÉS (columnas 11–12, filas 0–1)
    // -----------------------------------------------------
    { id: "poster_interes", x: 11, y: 0, type: "poster" },
    { id: "poster_interes", x: 12, y: 0, type: "poster" },

    { id: "poster_interes", x: 11, y: 1, type: "poster" },
    { id: "poster_interes", x: 12, y: 1, type: "poster" },

    // -----------------------------------------------------
    // BIBLIOTECA (columna 14, filas 0–1)
    // -----------------------------------------------------
    { id: "biblioteca", x: 14, y: 0, type: "library" },
    { id: "biblioteca", x: 14, y: 1, type: "library" },

    // -----------------------------------------------------
    // COMPUTADOR (columnas 11–13, filas 6–7)
    // -----------------------------------------------------
    { id: "computer", x: 11, y: 6, type: "computer" },
    { id: "computer", x: 12, y: 6, type: "computer" },
    { id: "computer", x: 13, y: 6, type: "computer" },

    { id: "computer", x: 11, y: 7, type: "computer" },
    { id: "computer", x: 12, y: 7, type: "computer" },
    { id: "computer", x: 13, y: 7, type: "computer" },
];