import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PuzzleGamePanel.css';
import dungeonMapImage from '../../assets/DungeonGame/DungeonMap.png';
import boxSprite from '../../assets/DungeonGame/CajaDungeon.png';

// Sprites del mago - Fácil de reemplazar
// Caminando hacia atrás (S / abajo)
import wizardBackFrame1 from '../../assets/DungeonGame/CaminataFrontal-1.png'
import wizardBackFrame2 from '../../assets/DungeonGame/CaminataFrontal-2.png'
// Caminando hacia adelante (W / arriba)
import wizardFrontFrame1 from '../../assets/DungeonGame/CaminataTrasera-2.png'
import wizardFrontFrame2 from '../../assets/DungeonGame/CaminataTrasera-1.png'
// Caminando hacia la izquierda (A / left)
import wizardLeftFrame1 from '../../assets/DungeonGame/CaminataIzquierda-1.png'
import wizardLeftFrame2 from '../../assets/DungeonGame/CaminataIzquierda-2.png'
// Caminando hacia la derecha (D / right)
import wizardRightFrame1 from '../../assets/DungeonGame/CaminataDerecha-1.png'
import wizardRightFrame2 from '../../assets/DungeonGame/CaminataDerecha-2.png'
// Estático mirando hacia arriba (idle up)
import wizardIdleUp from '../../assets/DungeonGame/traseraEstatica.png'
// Estático mirando hacia abajo (idle down)
import wizardIdleDown from '../../assets/DungeonGame/FrontalEstatico.png'
// Estático mirando hacia la izquierda (idle left)
import wizardIdleLeft from '../../assets/DungeonGame/izquierdaEstatico.png'
// Estático mirando hacia la derecha (idle right)
import wizardIdleRight from '../../assets/DungeonGame/derechaEstatico.png'

const TILE_SIZE = 40;
const MAP_WIDTH = 16;
const MAP_HEIGHT = 17;

const DUNGEON_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
    [1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// 0 = piso, 1 = pared, 2 = altar necesidades, 3 = altar gustos, 4 = altar ahorro

const GAME_OBJECTS = [
    // NECESIDADES (total 50)
    { id: 'food', name: 'Comida Básica', category: 'needs', sprite: '🍞', value: 15, description: 'Recursos básicos de alimentación diaria' },
    { id: 'transport', name: 'Transporte', category: 'needs', sprite: '🚌', value: 10, description: 'Movilidad para desplazarte' },
    { id: 'rent', name: 'Vivienda', category: 'needs', sprite: '🏠', value: 15, description: 'Un lugar donde habitar' },
    { id: 'medicine', name: 'Salud', category: 'needs', sprite: '💊', value: 10, description: 'Recursos para tu salud' },

    // GUSTOS (total 30)
    { id: 'gaming', name: 'Videojuegos', category: 'wants', sprite: '🎮', value: 10, description: 'Entretenimiento digital interactivo' },
    { id: 'pizza', name: 'Comida Fuera', category: 'wants', sprite: '🍕', value: 10, description: 'Disfrutar comida en restaurantes' },
    { id: 'cinema', name: 'Cine', category: 'wants', sprite: '🎬', value: 5, description: 'Entretenimiento audiovisual' },
    { id: 'clothes', name: 'Ropa de Moda', category: 'wants', sprite: '👕', value: 5, description: 'Vestimenta adicional' },

    // AHORRO (total 20)
    { id: 'investment', name: 'Inversión', category: 'savings', sprite: '📈', value: 10, description: 'Hacer crecer tu capital' },
    { id: 'education', name: 'Curso Online', category: 'savings', sprite: '🎓', value: 5, description: 'Aprender nuevas habilidades' },
    { id: 'emergency', name: 'Fondo Emergencia', category: 'savings', sprite: '🏦', value: 5, description: 'Reserva para imprevistos' },
];

const WIZARD_TIPS = [
    "💡 Las necesidades siempre primero",
    "🔥 El ahorro no es lo que sobra",
    "⚔️ Cada peso cuenta para tu futuro",
    "✨ Invertir en ti mismo siempre vale la pena",
    "🧙 El equilibrio 50-30-20 es tu escudo",
    "💎 La educación es la mejor inversión",
    "🛡️ Un fondo de emergencia te protege",
    "🎯 Primero necesidades, luego gustos",
    "📊 Prioriza inteligentemente tu dinero",
    "🌟 Disciplina hoy, libertad mañana",
];

export function PuzzleGamePanel({ onComplete, onClose }) {
    const [stage, setStage] = useState('intro');
    const [playerPos, setPlayerPos] = useState({ x: 3, y: 2 });
    const [direction, setDirection] = useState('up');
    const [isMoving, setIsMoving] = useState(false);
    const [playerHp, setPlayerHp] = useState(5);
    const [maxPlayerHp] = useState(5);
    const [invulnerable, setInvulnerable] = useState(false);

    const [objects, setObjects] = useState([]);
    const [enemies, setEnemies] = useState([]);
    const [projectiles, setProjectiles] = useState([]);
    const [canShoot, setCanShoot] = useState(true);

    const [needsAltar, setNeedsAltar] = useState([]);
    const [wantsAltar, setWantsAltar] = useState([]);
    const [savingsAltar, setSavingsAltar] = useState([]);

    const [currentTip, setCurrentTip] = useState('');
    const [showTipBanner, setShowTipBanner] = useState(false);
    const [tipsShown, setTipsShown] = useState(new Set());

    const [puzzleSolved, setPuzzleSolved] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [nearbyObject, setNearbyObject] = useState(null);
    const [walkFrame, setWalkFrame] = useState(0);
    const [keysPressed, setKeysPressed] = useState(new Set());

    const animationFrameRef = useRef();
    const enemiesRef = useRef([]);
    const stepCountRef = useRef(0);

    // Sincronizar enemiesRef
    useEffect(() => {
        enemiesRef.current = enemies;
    }, [enemies]);

    // Detectar objeto cercano
    useEffect(() => {
        if (stage !== 'playing') return;

        const nearby = objects.find(obj => {
            const dist = Math.abs(obj.position.x - playerPos.x) + Math.abs(obj.position.y - playerPos.y);
            return dist <= 1.5;
        });

        setNearbyObject(nearby || null);

        // Verificar colisión con enemigos
        const touchingEnemy = enemies.find(enemy =>
            enemy.isAlive &&
            Math.abs(enemy.position.x - playerPos.x) < 0.7 &&
            Math.abs(enemy.position.y - playerPos.y) < 0.7
        );

        if (touchingEnemy && !invulnerable) {
            setPlayerHp(prev => {
                const newHp = Math.max(0, prev - 0.5);
                if (newHp <= 0) {
                    setTimeout(() => setStage('gameover'), 500);
                }
                return newHp;
            });
            setInvulnerable(true);
            setTimeout(() => setInvulnerable(false), 1000);
        }
    }, [playerPos, objects, stage, enemies, invulnerable]);

    // Inicializar
    useEffect(() => {
        if (stage === 'playing' && objects.length === 0) {
            const initialObjects = GAME_OBJECTS.map((obj) => {
                let x, y;
                do {
                    // Distribuir por todo el mapa (x: 1-14, y: 1-15)
                    x = Math.floor(Math.random() * 13) + 1;
                    y = Math.floor(Math.random() * 14) + 1;
                } while (!isWalkable(x, y) || isNearAltar(x, y) || (x === 3 && y === 2));

                return { ...obj, position: { x, y } };
            });
            setObjects(initialObjects);
            spawnEnemies(6);
        }
    }, [stage, objects.length]);

    // Game loop para movimiento fluido e independiente de enemigos
    useEffect(() => {
        if (stage !== 'playing') return;

        const gameLoop = () => {
            const now = Date.now();

            setEnemies(prev => prev.map(enemy => {
                if (!enemy.isAlive) return enemy;

                let updated = { ...enemy };

                // Movimiento independiente
                if (now - enemy.lastMoveTime > enemy.moveDelay) {
                    const moves = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
                    const randomMove = moves[Math.floor(Math.random() * moves.length)];
                    const newX = enemy.position.x + randomMove.x;
                    const newY = enemy.position.y + randomMove.y;

                    if (isWalkable(newX, newY)) {
                        updated.position = { x: newX, y: newY };
                    }
                    updated.direction = randomMove.x < 0 ? 'left' : 'right';
                    updated.lastMoveTime = now;
                    updated.moveDelay = 600 + Math.random() * 600; // 600-1200ms
                }

                // Disparo independiente
                if (enemy.canShoot && now - enemy.lastShootTime > enemy.shootDelay) {
                    enemyShoot(enemy);
                    updated.lastShootTime = now;
                    updated.shootDelay = 2000 + Math.random() * 2000; // 2-4s
                }

                return updated;
            }));

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [stage, playerPos]);

    // Movimiento de proyectiles
    useEffect(() => {
        if (stage !== 'playing') return;

        const projInterval = setInterval(() => {
            setProjectiles(prev => {
                if (prev.length === 0) return prev;

                const newProjectiles = prev.map(proj => {
                    let newX = proj.position.x;
                    let newY = proj.position.y;

                    switch (proj.direction) {
                        case 'up': newY -= 0.5; break;
                        case 'down': newY += 0.5; break;
                        case 'left': newX -= 0.5; break;
                        case 'right': newX += 0.5; break;
                    }

                    // Verificar colisión con pared
                    if (!isWalkable(Math.floor(newX), Math.floor(newY))) {
                        return null;
                    }

                    return { ...proj, position: { x: newX, y: newY } };
                }).filter(Boolean);

                // Verificar colisiones con enemigos y jugador DENTRO del mismo intervalo
                setEnemies(prevEnemies => {
                    const updatedEnemies = prevEnemies.map(enemy => {
                        if (!enemy.isAlive) return enemy;

                        const hit = newProjectiles.some(proj =>
                            !proj.fromEnemy &&
                            Math.abs(proj.position.x - enemy.position.x) < 0.8 &&
                            Math.abs(proj.position.y - enemy.position.y) < 0.8
                        );

                        if (hit) {
                            const newHp = enemy.hp - 1;

                            if (newHp <= 0) {
                                setTimeout(() => showTip(), 0);
                                return { ...enemy, hp: 0, isAlive: false };
                            }

                            return { ...enemy, hp: newHp };
                        }
                        return enemy;
                    });

                    return updatedEnemies;
                });

                // Filtrar proyectiles que impactaron
                return newProjectiles.filter(proj => {
                    if (proj.fromEnemy) {
                        const hitPlayer = Math.abs(proj.position.x - playerPos.x) < 0.8 &&
                            Math.abs(proj.position.y - playerPos.y) < 0.8;

                        if (hitPlayer && !invulnerable) {
                            setPlayerHp(prev => {
                                const newHp = Math.max(0, prev - 1);
                                if (newHp <= 0) {
                                    setTimeout(() => setStage('gameover'), 500);
                                }
                                return newHp;
                            });
                            setInvulnerable(true);
                            setTimeout(() => setInvulnerable(false), 1000);
                        }

                        return !hitPlayer;
                    }

                    // Verificar si golpeó un enemigo usando enemiesRef
                    const hitEnemy = enemiesRef.current.some(enemy =>
                        enemy.isAlive &&
                        Math.abs(proj.position.x - enemy.position.x) < 0.8 &&
                        Math.abs(proj.position.y - enemy.position.y) < 0.8
                    );

                    return !hitEnemy;
                });
            });
        }, 80);

        return () => clearInterval(projInterval);
    }, [stage, playerPos.x, playerPos.y]);

    const spawnEnemies = (count) => {
        const newEnemies = [];
        const now = Date.now();

        for (let i = 0; i < count; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * 13) + 2;
                y = Math.floor(Math.random() * 5) + 2;
            } while (!isWalkable(x, y));

            const canShoot = Math.random() < 0.4;

            newEnemies.push({
                id: `enemy-${Date.now()}-${i}`,
                position: { x, y },
                hp: 2,
                maxHp: 2,
                sprite: canShoot ? '👹' : '👾',
                direction: 'left',
                isAlive: true,
                lastMoveTime: now + Math.random() * 500, // Offset inicial aleatorio
                moveDelay: 600 + Math.random() * 600,
                canShoot,
                lastShootTime: now,
                shootDelay: 2000 + Math.random() * 2000
            });
        }
        setEnemies(prev => [...prev, ...newEnemies]);
    };

    const enemyShoot = (enemy) => {
        let shootDir = 'down';
        const dx = playerPos.x - enemy.position.x;
        const dy = playerPos.y - enemy.position.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            shootDir = dx > 0 ? 'right' : 'left';
        } else {
            shootDir = dy > 0 ? 'down' : 'up';
        }

        const newProj = {
            id: `proj-enemy-${Date.now()}-${Math.random()}`,
            position: { ...enemy.position },
            direction: shootDir,
            fromEnemy: true
        };

        setProjectiles(prev => [...prev, newProj]);
    };

    const showTip = () => {
        let availableTips = WIZARD_TIPS.map((_, idx) => idx).filter(idx => !tipsShown.has(idx));

        if (availableTips.length === 0) {
            setTipsShown(new Set());
            availableTips = WIZARD_TIPS.map((_, idx) => idx);
        }

        const randomIdx = availableTips[Math.floor(Math.random() * availableTips.length)];
        setCurrentTip(WIZARD_TIPS[randomIdx]);
        setShowTipBanner(true);
        setTipsShown(prev => new Set([...prev, randomIdx]));

        setTimeout(() => setShowTipBanner(false), 4000);
    };

    const isWalkable = (x, y, ignoringObjects = false) => {
        if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
        const tile = DUNGEON_MAP[y][x];
        if (tile === 1) return false;

        if (!ignoringObjects) {
            const objectAtPos = objects.find(obj =>
                Math.abs(obj.position.x - x) < 0.6 && Math.abs(obj.position.y - y) < 0.6
            );
            if (objectAtPos) return false;
        }

        return true;
    };

    const isNearAltar = (x, y) => {
        return DUNGEON_MAP[y] && (
            DUNGEON_MAP[y][x] === 2 ||
            DUNGEON_MAP[y][x] === 3 ||
            DUNGEON_MAP[y][x] === 4
        );
    };

    const isCornerOrEdge = (x, y) => {
        // Verificar si está en un rincón o borde (rodeado de paredes)
        const directions = [
            { dx: 0, dy: -1 }, // arriba
            { dx: 0, dy: 1 },  // abajo
            { dx: -1, dy: 0 }, // izquierda
            { dx: 1, dy: 0 },  // derecha
        ];

        let wallCount = 0;

        for (const dir of directions) {
            const checkX = x + dir.dx;
            const checkY = y + dir.dy;

            // Si está fuera del mapa o es una pared, contar
            if (checkX < 0 || checkX >= MAP_WIDTH || checkY < 0 || checkY >= MAP_HEIGHT || DUNGEON_MAP[checkY][checkX] === 1) {
                wallCount++;
            }
        }

        // Si tiene 3 o 4 paredes alrededor, es un rincón/borde peligroso
        return wallCount >= 3;
    };

    const getObjectAt = (x, y) => {
        return objects.find(obj =>
            Math.abs(obj.position.x - x) < 0.8 && Math.abs(obj.position.y - y) < 0.8
        );
    };

    const shootFireball = () => {
        if (!canShoot || stage !== 'playing') return;

        const newProj = {
            id: `proj-player-${Date.now()}`,
            position: { ...playerPos },
            direction,
            fromEnemy: false
        };

        setProjectiles(prev => [...prev, newProj]);
        setCanShoot(false);
        setTimeout(() => setCanShoot(true), 300);
    };

    const handleMove = useCallback((newDir) => {
        if (stage !== 'playing' || isMoving) return;

        // Actualizar dirección inmediatamente
        setDirection(newDir);

        // Calcular nueva posición
        const moves = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
        };

        const move = moves[newDir];
        const newX = playerPos.x + move.x;
        const newY = playerPos.y + move.y;

        const objectAhead = getObjectAt(newX, newY);

        if (objectAhead) {
            const pushed = pushObject(objectAhead, newDir);
            if (pushed) {
                setIsMoving(true);
                setPlayerPos({ x: newX, y: newY });

                // Cambiar frame de animación cuando camina
                stepCountRef.current += 1;
                setWalkFrame(stepCountRef.current % 2);

                setTimeout(() => setIsMoving(false), 150);
            }
        } else if (isWalkable(newX, newY)) {
            setIsMoving(true);
            setPlayerPos({ x: newX, y: newY });

            // Cambiar frame de animación cuando camina
            stepCountRef.current += 1;
            setWalkFrame(stepCountRef.current % 2);

            setTimeout(() => setIsMoving(false), 150);
        }
    }, [playerPos, stage, isMoving, objects]);

    const pushObject = (obj, dir) => {
        const moves = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
        };

        const move = moves[dir];
        const newX = obj.position.x + move.x;
        const newY = obj.position.y + move.y;

        // Verificar que la nueva posición sea válida Y que no sea un rincón/borde
        if (isWalkable(newX, newY, true) && !isCornerOrEdge(newX, newY)) {
            setObjects(prev => prev.map(o =>
                o.id === obj.id
                    ? { ...o, position: { x: newX, y: newY } }
                    : o
            ));

            setTimeout(() => checkAltarPlacement(obj.id, newX, newY), 100);
            return true;
        }

        return false;
    };

    const pullObject = () => {
        if (stage !== 'playing') return false;

        // Buscar objeto adelante del jugador en la dirección que está mirando
        const moves = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
        };

        const move = moves[direction];
        const targetX = playerPos.x + move.x;
        const targetY = playerPos.y + move.y;

        const objectAhead = getObjectAt(targetX, targetY);

        if (!objectAhead) return false;

        // La caja se mueve a la posición actual del jugador
        // Y el jugador se mueve a donde estaba la caja
        const playerOldPos = { ...playerPos };
        const objectOldPos = { ...objectAhead.position };

        // Verificar que la posición del jugador actual esté libre
        if (isWalkable(playerOldPos.x, playerOldPos.y, true)) {
            // Mover objeto a posición del jugador
            setObjects(prev => prev.map(o =>
                o.id === objectAhead.id
                    ? { ...o, position: playerOldPos }
                    : o
            ));

            // Mover jugador a posición del objeto
            setPlayerPos(objectOldPos);

            setTimeout(() => checkAltarPlacement(objectAhead.id, playerOldPos.x, playerOldPos.y), 100);
            return true;
        }

        return false;
    };

    const checkAltarPlacement = (objId, x, y) => {
        const obj = objects.find(o => o.id === objId);
        if (!obj) return;

        const tile = DUNGEON_MAP[Math.floor(y)][Math.floor(x)];

        if (tile === 2) {
            if (!needsAltar.includes(objId)) setNeedsAltar(prev => [...prev, objId]);
        } else if (tile === 3) {
            if (!wantsAltar.includes(objId)) setWantsAltar(prev => [...prev, objId]);
        } else if (tile === 4) {
            if (!savingsAltar.includes(objId)) setSavingsAltar(prev => [...prev, objId]);
        } else {
            setNeedsAltar(prev => prev.filter(id => id !== objId));
            setWantsAltar(prev => prev.filter(id => id !== objId));
            setSavingsAltar(prev => prev.filter(id => id !== objId));
        }

        setTimeout(checkPuzzleSolution, 200);
    };

    const checkPuzzleSolution = () => {
        const needsCorrect = needsAltar.every(id => objects.find(o => o.id === id)?.category === 'needs');
        const wantsCorrect = wantsAltar.every(id => objects.find(o => o.id === id)?.category === 'wants');
        const savingsCorrect = savingsAltar.every(id => objects.find(o => o.id === id)?.category === 'savings');

        const allPlaced = needsAltar.length + wantsAltar.length + savingsAltar.length === objects.length;

        const needsValue = needsAltar.reduce((sum, id) => sum + (objects.find(o => o.id === id)?.value || 0), 0);
        const wantsValue = wantsAltar.reduce((sum, id) => sum + (objects.find(o => o.id === id)?.value || 0), 0);
        const savingsValue = savingsAltar.reduce((sum, id) => sum + (objects.find(o => o.id === id)?.value || 0), 0);

        if (allPlaced && needsCorrect && wantsCorrect && savingsCorrect &&
            needsValue === 50 && wantsValue === 30 && savingsValue === 20) {
            setPuzzleSolved(true);
            setTimeout(() => setStage('complete'), 1500);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();

            if (key === 'h') {
                setShowHint(!showHint);
                return;
            }

            if (key === ' ') {
                e.preventDefault();
                shootFireball();
                return;
            }

            if (key === 'z') {
                e.preventDefault();
                pullObject();
                return;
            }

            if (stage !== 'playing') return;

            setKeysPressed(prev => new Set([...prev, key]));

            const currentKeys = Array.from(keysPressed);

            // Detectar movimiento diagonal
            if ((currentKeys.includes('w') || currentKeys.includes('arrowup')) &&
                (currentKeys.includes('a') || currentKeys.includes('arrowleft'))) {
                e.preventDefault();
                handleMove('up');
                setTimeout(() => handleMove('left'), 50);
            } else if ((currentKeys.includes('w') || currentKeys.includes('arrowup')) &&
                (currentKeys.includes('d') || currentKeys.includes('arrowright'))) {
                e.preventDefault();
                handleMove('up');
                setTimeout(() => handleMove('right'), 50);
            } else if ((currentKeys.includes('s') || currentKeys.includes('arrowdown')) &&
                (currentKeys.includes('a') || currentKeys.includes('arrowleft'))) {
                e.preventDefault();
                handleMove('down');
                setTimeout(() => handleMove('left'), 50);
            } else if ((currentKeys.includes('s') || currentKeys.includes('arrowdown')) &&
                (currentKeys.includes('d') || currentKeys.includes('arrowright'))) {
                e.preventDefault();
                handleMove('down');
                setTimeout(() => handleMove('right'), 50);
            } else {
                switch (key) {
                    case 'arrowup':
                    case 'w':
                        e.preventDefault();
                        handleMove('up');
                        break;
                    case 'arrowdown':
                    case 's':
                        e.preventDefault();
                        handleMove('down');
                        break;
                    case 'arrowleft':
                    case 'a':
                        e.preventDefault();
                        handleMove('left');
                        break;
                    case 'arrowright':
                    case 'd':
                        e.preventDefault();
                        handleMove('right');
                        break;
                }
            }
        };

        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            setKeysPressed(prev => new Set([...prev].filter(k => k !== key)));
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleMove, stage, showHint, keysPressed]);

    if (stage === 'intro') {
        return (
            <div className="game-panel-overlay" style={{ zIndex: 1000 }}>
                <div className="game-panel puzzle-game-panel" style={{ maxWidth: '700px' }}>
                    <div className="panel-header">
                        <h2>🔥 El Dungeon del Equilibrio Financiero</h2>
                        <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px 8px' }}>✕</button>
                    </div>

                    <div className="panel-content" style={{ padding: '24px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🧙‍♂️</div>
                            <h3 style={{ marginBottom: '16px' }}>¡Aventura Financiera Épica!</h3>
                            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
                                Eres un mago sabio que debe restaurar el equilibrio en el Templo de las Finanzas.
                                <br /><strong>¡Derrota monstruos y clasifica objetos!</strong>
                            </p>
                        </div>

                        <div style={{ background: '#FFF3E0', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '2px solid #FF9800' }}>
                            <h4 style={{ marginBottom: '12px', color: '#E65100' }}>🎯 Tu Misión:</h4>
                            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px' }}>
                                <li>Empuja objetos a los 3 altares 🏛️ (arriba-izq, medio-der, abajo-izq)</li>
                                <li>Acércate a objetos para ver su descripción</li>
                                <li>Derrota enemigos (algunos disparan 👹)</li>
                                <li>Logra equilibrio: 50 pts Necesidades, 30 Gustos, 20 Ahorro</li>
                            </ul>
                        </div>

                        <div style={{ background: '#E3F2FD', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '2px solid #2196F3' }}>
                            <h4 style={{ marginBottom: '12px' }}>⚔️ Controles:</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                                <div><strong>WASD / Flechas:</strong> Mover (diagonal: 2 teclas)</div>
                                <div><strong>ESPACIO:</strong> Lanzar fuego 🔥</div>
                                <div><strong>Empujar:</strong> Camina hacia objetos</div>
                                <div><strong>Z:</strong> Jalar caja 📦</div>
                                <div><strong>H:</strong> Ver/Ocultar pista</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStage('playing')}
                            style={{
                                width: '100%', padding: '16px', fontSize: '18px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white', border: 'none', borderRadius: '8px',
                                cursor: 'pointer', fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                        >
                            ⚔️ ¡Entrar al Dungeon!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'playing') {
        // Solo contar objetos correctos en cada altar
        const needsValue = needsAltar
            .filter(id => objects.find(o => o.id === id)?.category === 'needs')
            .reduce((sum, id) => sum + (objects.find(o => o.id === id)?.value || 0), 0);

        const wantsValue = wantsAltar
            .filter(id => objects.find(o => o.id === id)?.category === 'wants')
            .reduce((sum, id) => sum + (objects.find(o => o.id === id)?.value || 0), 0);

        const savingsValue = savingsAltar
            .filter(id => objects.find(o => o.id === id)?.category === 'savings')
            .reduce((sum, id) => sum + (objects.find(o => o.id === id)?.value || 0), 0);

        return (
            <div className="game-panel-overlay" style={{ zIndex: 1000 }}>
                <div className="game-panel puzzle-game-panel" style={{ maxWidth: '1000px', maxHeight: 'none', overflow: 'visible', position: 'relative' }}>

                    {/* Barra de progreso de altares con vidas integradas */}
                    <div style={{ padding: '12px', background: '#263238', display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px 8px 0 0' }}>

                        {/* Vidas del jugador */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '140px' }}>
                            <div style={{ fontSize: '11px', color: 'white', marginBottom: '4px', fontWeight: 'bold' }}>❤️ VIDA</div>
                            <div style={{ display: 'flex', gap: '4px', background: '#1a1a1a', padding: '6px 10px', borderRadius: '4px', border: '2px solid #f44336' }}>
                                {Array.from({ length: maxPlayerHp }).map((_, i) => (
                                    <div key={i} style={{ fontSize: '18px', opacity: i < playerHp ? 1 : 0.2, filter: invulnerable && i < playerHp ? 'drop-shadow(0 0 4px #ff0)' : 'none', transition: 'all 0.2s' }}>
                                        ❤️
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Altar Necesidades */}
                        <div style={{ flex: 1, maxWidth: '180px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: 'white' }}>
                                <span style={{ fontWeight: 'bold' }}>🏛️ Necesidades</span>
                                <span style={{ color: needsValue === 50 ? '#4CAF50' : '#fff' }}>{needsValue}/50 {needsValue === 50 && '✓'}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#37474f', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${(needsValue / 50) * 100}%`, height: '100%', background: needsValue === 50 ? '#4CAF50' : '#FFC107', transition: 'all 0.3s ease' }} />
                            </div>
                        </div>

                        {/* Altar Gustos */}
                        <div style={{ flex: 1, maxWidth: '180px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: 'white' }}>
                                <span style={{ fontWeight: 'bold' }}>🏛️ Gustos</span>
                                <span style={{ color: wantsValue === 30 ? '#4CAF50' : '#fff' }}>{wantsValue}/30 {wantsValue === 30 && '✓'}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#37474f', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${(wantsValue / 30) * 100}%`, height: '100%', background: wantsValue === 30 ? '#4CAF50' : '#FFC107', transition: 'all 0.3s ease' }} />
                            </div>
                        </div>

                        {/* Altar Ahorro */}
                        <div style={{ flex: 1, maxWidth: '180px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: 'white' }}>
                                <span style={{ fontWeight: 'bold' }}>🏛️ Ahorro</span>
                                <span style={{ color: savingsValue === 20 ? '#4CAF50' : '#fff' }}>{savingsValue}/20 {savingsValue === 20 && '✓'}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#37474f', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${(savingsValue / 20) * 100}%`, height: '100%', background: savingsValue === 20 ? '#4CAF50' : '#FFC107', transition: 'all 0.3s ease' }} />
                            </div>
                        </div>

                        {/* Botones de control */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{ fontSize: '13px', background: '#f44336', color: 'white', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
                                👾 {enemies.filter(e => e.isAlive).length}
                            </div>
                            <button onClick={() => setShowHint(!showHint)} style={{ background: '#FFC107', border: 'none', fontSize: '13px', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
                                {showHint ? '🔍' : '💡'}
                            </button>
                            <button onClick={onClose} style={{ background: '#f44336', color: 'white', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>✕</button>
                        </div>
                    </div>

                    {showHint && (
                        <div style={{ width: '100%',position: 'absolute', zIndex: '1000', padding: '12px', background: '#FFF9C4', borderBottom: '2px solid #FFC107', fontSize: '13px' }}>
                            <strong>💡 Recuerda:</strong> Necesidades = esenciales para vivir | Gustos = disfrutas pero no necesitas | Ahorro = inversión en tu futuro
                        </div>
                    )}

                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', background: '#1a1a1a' }}>
                        <div style={{ position: 'relative', width: `${MAP_WIDTH * TILE_SIZE}px`, height: `${MAP_HEIGHT * TILE_SIZE}px`, backgroundImage: `url(${dungeonMapImage})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '4px solid #444', borderRadius: '8px', overflow: 'hidden', imageRendering: 'pixelated' }}>

                            {/* Marcadores de altares (invisibles pero ayudan a visualizar) */}
                            {DUNGEON_MAP.map((row, y) =>
                                row.map((tile, x) => {
                                    if (tile === 2 || tile === 3 || tile === 4) {
                                        // Determinar color según tipo de altar
                                        const altarColor = tile === 2 ? '#4CAF50' : tile === 3 ? '#2196F3' : '#FFC107';
                                        const altarGlow = tile === 2 ? 'rgba(76, 175, 80, 0.6)' : tile === 3 ? 'rgba(33, 150, 243, 0.6)' : 'rgba(255, 193, 7, 0.6)';

                                        return (
                                            <div key={`altar-${x}-${y}`} style={{
                                                position: 'absolute',
                                                left: `${x * TILE_SIZE}px`,
                                                top: `${y * TILE_SIZE}px`,
                                                width: `${TILE_SIZE}px`,
                                                height: `${TILE_SIZE}px`,
                                                background: `radial-gradient(circle, ${altarGlow} 0%, transparent 70%)`,
                                                boxSizing: 'border-box',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                pointerEvents: 'none',
                                                animation: 'altarPulse 2s ease-in-out infinite',
                                                filter: `drop-shadow(0 0 20px ${altarColor})`
                                            }}>
                                                <div style={{
                                                    width: '60%',
                                                    height: '60%',
                                                    borderRadius: '50%',
                                                    background: `radial-gradient(circle, ${altarColor} 0%, transparent 60%)`,
                                                    animation: 'altarPulse 2s ease-in-out infinite reverse'
                                                }} />
                                            </div>
                                        );
                                    }
                                    return null;
                                })
                            )}

                            {objects.map(obj => (
                                <div key={obj.id} style={{
                                    position: 'absolute',
                                    left: `${obj.position.x * TILE_SIZE}px`,
                                    top: `${obj.position.y * TILE_SIZE}px`,
                                    width: `${TILE_SIZE - 6}px`,
                                    height: `${TILE_SIZE - 6}px`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.15s ease-out',
                                    zIndex: 10,
                                    margin: '3px'
                                }}>
                                    <img src={boxSprite} alt={obj.name} style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }} />
                                </div>
                            ))}

                            {enemies.filter(e => e.isAlive).map(enemy => (
                                <div key={enemy.id} style={{ position: 'absolute', left: `${enemy.position.x * TILE_SIZE}px`, top: `${enemy.position.y * TILE_SIZE}px`, width: `${TILE_SIZE}px`, height: `${TILE_SIZE}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '32px', zIndex: 15, transform: enemy.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)', filter: 'drop-shadow(2px 2px 4px rgba(255,0,0,0.6))', transition: 'all 0.15s ease-out' }}>
                                    {enemy.sprite}
                                    <div style={{ position: 'absolute', bottom: '-8px', width: '80%', height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%`, height: '100%', background: '#f44336', transition: 'width 0.2s' }} />
                                    </div>
                                </div>
                            ))}

                            {projectiles.map(proj => (
                                <div key={proj.id} style={{ position: 'absolute', left: `${proj.position.x * TILE_SIZE + TILE_SIZE / 2 - 12}px`, top: `${proj.position.y * TILE_SIZE + TILE_SIZE / 2 - 12}px`, width: '24px', height: '24px', fontSize: '24px', zIndex: 20, filter: 'drop-shadow(0 0 8px rgba(255,100,0,0.8))' }}>
                                    {proj.fromEnemy ? '💀' : '🔥'}
                                </div>
                            ))}

                            <div style={{ position: 'absolute', left: `${playerPos.x * TILE_SIZE}px`, top: `${playerPos.y * TILE_SIZE}px`, width: `${TILE_SIZE}px`, height: `${TILE_SIZE}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', transition: isMoving ? 'all 0.15s ease-out' : 'none', zIndex: 25, filter: invulnerable ? 'drop-shadow(0 0 8px #ff0)' : 'drop-shadow(2px 2px 6px rgba(138,43,226,0.8))' }}>
                                {direction === 'down' ? (
                                    <img
                                        src={isMoving ? (walkFrame === 0 ? wizardBackFrame1 : wizardBackFrame2) : wizardIdleDown}
                                        alt="Mago"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            imageRendering: 'pixelated'
                                        }}
                                    />
                                ) : direction === 'up' ? (
                                    <img
                                        src={isMoving ? (walkFrame === 0 ? wizardFrontFrame1 : wizardFrontFrame2) : wizardIdleUp}
                                        alt="Mago"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            imageRendering: 'pixelated'
                                        }}
                                    />
                                ) : direction === 'left' ? (
                                    <img
                                        src={isMoving ? (walkFrame === 0 ? wizardLeftFrame1 : wizardLeftFrame2) : wizardIdleLeft}
                                        alt="Mago"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            imageRendering: 'pixelated'
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={isMoving ? (walkFrame === 0 ? wizardRightFrame1 : wizardRightFrame2) : wizardIdleRight}
                                        alt="Mago"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            imageRendering: 'pixelated'
                                        }}
                                    />
                                )}
                            </div>

                            {/* Banner de consejos en la parte inferior */}
                            {showTipBanner && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '50px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(26, 35, 48, 0.95)',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                    border: '2px solid #4CAF50',
                                    zIndex: 1000,
                                    maxWidth: '80%',
                                    textAlign: 'center',
                                    animation: 'slideUp 0.3s ease-out'
                                }}>
                                    🧙 {currentTip}
                                </div>
                            )}

                            {puzzleSolved && (
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(76, 175, 80, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', zIndex: 100, color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                    ✨ ¡EQUILIBRIO LOGRADO! ✨
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información de objeto cercano (estilo MK-25) - FUERA del mapa */}
                    {nearbyObject && (
                        <div
                            style={{
                                padding: '10px 12px',
                                background: '#1a2332',
                                borderTop: '2px solid #FFC107',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'absolute',
                                bottom: 78,               // para anclarlo abajo del contenedor
                                left: 0,
                                width: '100%',
                                gap: '10px',
                                transform: 'translateY(100%)' // <-- debe ir como STRING
                            }}
                        >

                            <div style={{
                                fontSize: '32px',
                                flexShrink: 0,
                                animation: 'bounce 0.6s infinite'
                            }}>
                                {nearbyObject.sprite}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#FFC107',
                                    marginBottom: '2px',
                                    fontWeight: 'bold'
                                }}>
                                    📦 {nearbyObject.name}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: 'white',
                                    lineHeight: '1.3'
                                }}>
                                    {nearbyObject.description}
                                </div>
                                <div style={{
                                    fontSize: '10px',
                                    color: '#888',
                                    marginTop: '2px'
                                }}>
                                    Categoría: {
                                        nearbyObject.category === 'needs' ? '🟢 Necesidades' :
                                            nearbyObject.category === 'wants' ? '🔵 Gustos' :
                                                '🟡 Ahorro'
                                    } • Valor: {nearbyObject.value} pts
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ padding: '12px', background: '#263238', textAlign: 'center', fontSize: '13px', borderTop: '2px solid #37474f', color: 'white' }}>
                        <strong>⚔️ Controles:</strong> WASD/Flechas mover (diagonal: 2 teclas) | ESPACIO lanzar fuego 🔥 | Z jalar caja 📦 | H pista
                    </div>
                </div>

                <style>
                    {`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }
            @keyframes slideUp {
              from { transform: translateX(-50%) translateY(20px); opacity: 0; }
              to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes altarPulse {
              0%, 100% { 
                transform: scale(1); 
                opacity: 0.8;
              }
              50% { 
                transform: scale(1.15); 
                opacity: 1;
              }
            }
          `}
                </style>
            </div>
        );
    }

    if (stage === 'complete') {
        return (
            <div className="game-panel-overlay" style={{ zIndex: 1000 }}>
                <div className="game-panel puzzle-game-panel" style={{ maxWidth: '600px' }}>
                    <div className="panel-header">
                        <h2>🎉 ¡Dungeon Completado!</h2>
                    </div>

                    <div className="panel-content" style={{ padding: '32px', textAlign: 'center' }}>
                        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🏆</div>
                        <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>¡Maestro del Equilibrio Financiero!</h3>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Has clasificado correctamente todos los objetos y restaurado el equilibrio sagrado 50-30-20.
                        </p>

                        <div style={{ background: '#E8F5E9', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '2px solid #4CAF50', textAlign: 'left' }}>
                            <p style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold' }}>🧙‍♂️ Lección del Mago Sabio:</p>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                                "Clasificar gastos es sabiduría. Cada peso tiene un propósito: <strong>sobrevivir</strong> (necesidades), <strong>disfrutar</strong> (gustos) o <strong>crecer</strong> (ahorro). Quien domina este equilibrio, domina su futuro financiero."
                            </p>
                        </div>

                        <button onClick={() => { onComplete(); onClose(); }} style={{ width: '100%', padding: '16px', fontSize: '18px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)' }}>
                            ✨ ¡Continuar Aventura!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'gameover') {
        return (
            <div className="game-panel-overlay" style={{ zIndex: 1000 }}>
                <div className="game-panel puzzle-game-panel" style={{ maxWidth: '600px' }}>
                    <div className="panel-header">
                        <h2>💔 ¡Game Over!</h2>
                    </div>

                    <div className="panel-content" style={{ padding: '32px', textAlign: 'center' }}>
                        <div style={{ fontSize: '80px', marginBottom: '24px' }}>💀</div>
                        <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>¡Has Perdido!</h3>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
                            No has logrado restaurar el equilibrio financiero en el Dungeon.
                        </p>

                        <div style={{ background: '#FFEB3B', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '2px solid #FF9800', textAlign: 'left' }}>
                            <p style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold' }}>🧙‍♂️ Lección del Mago Sabio:</p>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                                "El equilibrio financiero es crucial. Cada peso cuenta para tu futuro. Aprende de tus errores y vuelve a intentarlo."
                            </p>
                        </div>

                        <button onClick={onClose} style={{ width: '100%', padding: '16px', fontSize: '18px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)' }}>
                            🔁 ¡Reintentar!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
