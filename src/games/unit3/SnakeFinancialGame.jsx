import React, { useCallback, useEffect, useRef, useState } from "react";
import "./css/SnakeFinancialGame.css";

const TILE = 20;
const COLS = 20;
const ROWS = 20;

const WIN_SCORE = 250;
const LOSE_SCORE = -50;
const BASE_SPEED = 150; // ms por movimiento
const MIN_SPEED = 65;

const WAVE_WARNING_MS = 700;
const WAVE_ACTIVE_MS = 900;
const GOLD_TTL_MS = 5000;

// Mensajes flotantes conectados con los conceptos de la Unidad 3
const GOOD_MESSAGES = [
    "¡Buena liquidez!",
    "Ahorro programado",
    "Redujiste gastos",
    "Diversificaste el riesgo",
];
const BAD_MESSAGES = [
    "Gasto hormiga",
    "Deuda impulsiva",
    "Tasa de interés alta",
    "Gasto no presupuestado",
];

function cellsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
}

function randomCell(excluded) {
    let pos;
    let tries = 0;
    do {
        pos = {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS),
        };
        tries++;
    } while (excluded.some((c) => cellsEqual(c, pos)) && tries < 400);
    return pos;
}

export default function SnakeFinancialGame({ visible, onComplete }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const timeoutRef = useRef(null);
    const rafRef = useRef(null);

    // Estado mutable del juego (refs = sin closures obsoletas en el loop)
    const snakeRef = useRef([{ x: 10, y: 10 }]);
    const dirRef = useRef({ x: 1, y: 0 });
    const nextDirRef = useRef({ x: 1, y: 0 });
    const foodRef = useRef(null);
    const goldRef = useRef(null); // { pos, ttl }
    const badFoodRef = useRef([]);
    const waveRef = useRef(null); // { cells, phase: 'warning' | 'active', timer }
    const cooldownRef = useRef(0);
    const scoreRef = useRef(0);
    const streakRef = useRef(0);
    const speedRef = useRef(BASE_SPEED);
    const popupsRef = useRef([]); // { x, y, text, color, life }
    const shakeRef = useRef(0);

    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [outcome, setOutcome] = useState(null); // 'win' | 'wave' | 'debt' | 'wall'
    const [showIntro, setShowIntro] = useState(true);

    const occupied = useCallback(() => {
        const wave = waveRef.current ? waveRef.current.cells : [];
        return [
            ...snakeRef.current,
            ...badFoodRef.current,
            ...(foodRef.current ? [foodRef.current] : []),
            ...(goldRef.current ? [goldRef.current.pos] : []),
            ...wave,
        ];
    }, []);

    const addPopup = (x, y, text, color) => {
        popupsRef.current.push({
            x: x * TILE + TILE / 2,
            y: y * TILE,
            text,
            color,
            life: 650,
        });
    };

    const draw = useCallback(() => {
        const ctx = ctxRef.current;
        if (!ctx) return;
        const w = COLS * TILE;
        const h = ROWS * TILE;

        ctx.clearRect(0, 0, w, h);

        // Fondo con leve grilla
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        for (let x = 0; x <= COLS; x++) {
            ctx.beginPath();
            ctx.moveTo(x * TILE, 0);
            ctx.lineTo(x * TILE, h);
            ctx.stroke();
        }
        for (let y = 0; y <= ROWS; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * TILE);
            ctx.lineTo(w, y * TILE);
            ctx.stroke();
        }

        // Oleada de crisis (aviso parpadeante -> activa y letal)
        const wave = waveRef.current;
        if (wave) {
            const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 90);
            wave.cells.forEach((c) => {
                if (wave.phase === "warning") {
                    ctx.fillStyle = `rgba(241, 196, 15, ${0.25 + pulse * 0.35})`;
                } else {
                    ctx.fillStyle = `rgba(192, 57, 43, ${0.7 + pulse * 0.3})`;
                }
                ctx.fillRect(c.x * TILE, c.y * TILE, TILE - 1, TILE - 1);
            });
        }

        // Bloques rojos (riesgos financieros, peligrosos pero no letales)
        badFoodRef.current.forEach((b) => {
            ctx.fillStyle = "#e74c3c";
            ctx.fillRect(b.x * TILE + 1, b.y * TILE + 1, TILE - 3, TILE - 3);
            ctx.strokeStyle = "#7b241c";
            ctx.lineWidth = 2;
            ctx.strokeRect(b.x * TILE + 1, b.y * TILE + 1, TILE - 3, TILE - 3);
        });

        // Comida verde (buena práctica financiera)
        if (foodRef.current) {
            const f = foodRef.current;
            const pulse = 1 + 0.12 * Math.sin(performance.now() / 150);
            ctx.fillStyle = "#2ecc71";
            ctx.beginPath();
            ctx.arc(
                f.x * TILE + TILE / 2,
                f.y * TILE + TILE / 2,
                (TILE / 2.6) * pulse,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Oportunidad de inversión (dorada, temporal)
        if (goldRef.current) {
            const g = goldRef.current.pos;
            const spin = performance.now() / 250;
            ctx.save();
            ctx.translate(g.x * TILE + TILE / 2, g.y * TILE + TILE / 2);
            ctx.rotate(spin);
            ctx.fillStyle = "#f1c40f";
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const r = i % 2 === 0 ? TILE / 2.2 : TILE / 5;
                const px = Math.cos(angle) * r;
                const py = Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // Serpiente (exposición al riesgo acumulada)
        snakeRef.current.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? "#00d57a" : "#00b867";
            ctx.fillRect(s.x * TILE, s.y * TILE, TILE - 1, TILE - 1);
        });
        // Ojos en la cabeza
        if (snakeRef.current.length) {
            const head = snakeRef.current[0];
            ctx.fillStyle = "#04351f";
            const ex = head.x * TILE + TILE / 2 + dirRef.current.x * 3;
            const ey = head.y * TILE + TILE / 2 + dirRef.current.y * 3;
            ctx.beginPath();
            ctx.arc(ex, ey, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Popups flotantes
        popupsRef.current.forEach((p) => {
            const alpha = Math.max(0, p.life / 650);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.font = "bold 13px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(p.text, p.x, p.y);
            ctx.globalAlpha = 1;
        });
    }, []);

    const resetGame = useCallback(() => {
        snakeRef.current = [{ x: 10, y: 10 }];
        dirRef.current = { x: 1, y: 0 };
        nextDirRef.current = { x: 1, y: 0 };
        foodRef.current = randomCell(snakeRef.current);
        goldRef.current = null;
        waveRef.current = null;
        const bad = [];
        for (let i = 0; i < 3; i++) {
            bad.push(randomCell([...snakeRef.current, foodRef.current, ...bad]));
        }
        badFoodRef.current = bad;
        cooldownRef.current = 0;
        scoreRef.current = 0;
        streakRef.current = 0;
        speedRef.current = BASE_SPEED;
        popupsRef.current = [];
        setScore(0);
        setStreak(0);
        setGameOver(false);
        setOutcome(null);
    }, []);

    const spawnWave = () => {
        const rowOrCol = Math.random() < 0.5 ? "row" : "col";
        const cells = [];
        if (rowOrCol === "row") {
            const y = Math.floor(Math.random() * ROWS);
            for (let x = 0; x < COLS; x++) cells.push({ x, y });
        } else {
            const x = Math.floor(Math.random() * COLS);
            for (let y = 0; y < ROWS; y++) cells.push({ x, y });
        }
        waveRef.current = { cells, phase: "warning", timer: WAVE_WARNING_MS };
    };

    const endGame = useCallback((why) => {
        clearTimeout(timeoutRef.current);
        setGameOver(true);
        setOutcome(why);
    }, []);

    const scheduleNext = useCallback(() => {
        timeoutRef.current = setTimeout(tick, speedRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function tick() {
        const dir = nextDirRef.current;
        dirRef.current = dir;
        const head = snakeRef.current[0];
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        // Límites del tablero
        if (newHead.x < 0 || newHead.y < 0 || newHead.x >= COLS || newHead.y >= ROWS) {
            endGame("wall");
            return;
        }

        let snake = [newHead, ...snakeRef.current];

        // Verde: buena decisión financiera
        if (foodRef.current && cellsEqual(newHead, foodRef.current)) {
            streakRef.current += 1;
            const combo = Math.min(streakRef.current, 5) * 2;
            const gain = 10 + combo;
            scoreRef.current += gain;
            addPopup(newHead.x, newHead.y, `+${gain} ${GOOD_MESSAGES[streakRef.current % GOOD_MESSAGES.length]}`, "#2ecc71");
            if (snake.length > 3) {
                snake.pop();
                snake.pop();
            }
            snakeRef.current = snake;
            foodRef.current = randomCell(occupied());
            const maxBad = Math.min(3 + Math.floor(scoreRef.current / 60), 7);
            if (badFoodRef.current.length < maxBad) {
                badFoodRef.current = [...badFoodRef.current, randomCell(occupied())];
            }
        } else {
            snake.pop();
            snakeRef.current = snake;
        }

        // Oro: oportunidad de inversión
        if (goldRef.current && cellsEqual(newHead, goldRef.current.pos)) {
            scoreRef.current += 30;
            streakRef.current += 1;
            addPopup(newHead.x, newHead.y, "+30 ¡Oportunidad aprovechada!", "#f1c40f");
            goldRef.current = null;
        }

        // Rojo: riesgo financiero (peligroso, no letal)
        const hitBad = badFoodRef.current.find((b) => cellsEqual(b, newHead));
        if (hitBad) {
            scoreRef.current -= 8;
            streakRef.current = 0;
            shakeRef.current = 220;
            addPopup(newHead.x, newHead.y, `-8 ${BAD_MESSAGES[Math.floor(Math.random() * BAD_MESSAGES.length)]}`, "#e74c3c");
            snakeRef.current = [...snakeRef.current, { ...snakeRef.current[snakeRef.current.length - 1] }];
            badFoodRef.current = badFoodRef.current.filter((b) => b !== hitBad);
        }

        // Oleada de crisis: aviso -> activa (letal si se toca activa)
        const wave = waveRef.current;
        if (wave) {
            if (wave.phase === "warning") {
                wave.timer -= speedRef.current;
                if (wave.timer <= 0) {
                    wave.phase = "active";
                    wave.timer = WAVE_ACTIVE_MS;
                }
            } else {
                const onWave = wave.cells.some((c) => cellsEqual(c, newHead));
                if (onWave) {
                    endGame("wave");
                    return;
                }
                wave.timer -= speedRef.current;
                if (wave.timer <= 0) waveRef.current = null;
            }
        }

        // Oportunidad dorada: aparición ocasional con tiempo límite
        if (goldRef.current) {
            goldRef.current.ttl -= speedRef.current;
            if (goldRef.current.ttl <= 0) goldRef.current = null;
        } else if (Math.random() < 0.012) {
            goldRef.current = { pos: randomCell(occupied()), ttl: GOLD_TTL_MS };
        }

        // Dificultad progresiva: más velocidad y más crisis a medida que sube el puntaje
        const progress = Math.max(0, scoreRef.current);
        speedRef.current = Math.max(MIN_SPEED, BASE_SPEED - Math.floor(progress / 30) * 10);
        const waveEvery = Math.max(14, 30 - Math.floor(progress / 40) * 2);
        cooldownRef.current += 1;
        if (!waveRef.current && cooldownRef.current > waveEvery) {
            spawnWave();
            cooldownRef.current = 0;
        }

        // Popups: sube y se desvanece
        popupsRef.current = popupsRef.current
            .map((p) => ({ ...p, y: p.y - 8, life: p.life - speedRef.current }))
            .filter((p) => p.life > 0);

        if (shakeRef.current > 0) shakeRef.current -= speedRef.current;

        setScore(scoreRef.current);
        setStreak(streakRef.current);

        if (scoreRef.current <= LOSE_SCORE) {
            endGame("debt");
            return;
        }
        if (scoreRef.current >= WIN_SCORE) {
            endGame("win");
            return;
        }

        scheduleNext();
    }

    // Inicializa canvas + partida cuando se abre el juego
    useEffect(() => {
        if (!visible || showIntro) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        ctxRef.current = canvas.getContext("2d");
        resetGame();
        clearTimeout(timeoutRef.current);
        scheduleNext();
        return () => clearTimeout(timeoutRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, showIntro]);

    // Loop de dibujado a 60fps, independiente de la velocidad del juego
    useEffect(() => {
        if (!visible || showIntro) return;
        const loop = () => {
            draw();
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [visible, showIntro, draw]);

    // Controles de teclado
    useEffect(() => {
        const keyListener = (e) => {
            const d = dirRef.current;
            if (e.key === "ArrowUp" && d.y === 0) nextDirRef.current = { x: 0, y: -1 };
            if (e.key === "ArrowDown" && d.y === 0) nextDirRef.current = { x: 0, y: 1 };
            if (e.key === "ArrowLeft" && d.x === 0) nextDirRef.current = { x: -1, y: 0 };
            if (e.key === "ArrowRight" && d.x === 0) nextDirRef.current = { x: 1, y: 0 };
        };
        window.addEventListener("keydown", keyListener);
        return () => window.removeEventListener("keydown", keyListener);
    }, []);

    const setDirButton = (x, y) => {
        const d = dirRef.current;
        if (x !== 0 && d.x === 0) nextDirRef.current = { x, y: 0 };
        if (y !== 0 && d.y === 0) nextDirRef.current = { x: 0, y };
    };

    const handleRetry = () => {
        resetGame();
        clearTimeout(timeoutRef.current);
        scheduleNext();
    };

    if (!visible) return null;

    const progressPct = Math.min(
        100,
        Math.max(0, ((score - LOSE_SCORE) / (WIN_SCORE - LOSE_SCORE)) * 100)
    );

    const outcomeMessages = {
        win: "¡Excelente! Tu empresa gestionó el riesgo con éxito y mantuvo una salud financiera sólida.",
        wave: "Una crisis de mercado te tomó por sorpresa mientras estaba activa. Tu empresa entró en cesación de pagos.",
        debt: "El endeudamiento acumulado se volvió insostenible: la exposición al riesgo cayó demasiado.",
        wall: "Te saliste del plan financiero (límite del tablero). Mantén el rumbo dentro de tu presupuesto.",
    };

    return (
        <div className="snake-overlay">
            {showIntro && (
                <div className="snake-window minigame-container">
                    <div className="container-intro">
                        <h2>Gestor de Riesgo Financiero</h2>

                        <p className="description">
                            Controla la exposición al riesgo de tu empresa.
                            <br />
                            La serpiente representa el nivel de riesgo acumulado.
                            <br /><br />
                            Los <span className="good">verdes</span> son buenas prácticas financieras (ahorro, buena liquidez):
                            suman puntos y reducen tu exposición.
                            <br />
                            Los <span className="bad">bloques rojos</span> son riesgos financieros (gastos hormiga, deudas impulsivas):
                            restan puntos y hacen crecer tu riesgo, pero no te eliminan.
                            <br />
                            Las <strong>oleadas rojas</strong> son crisis de mercado: parpadean en amarillo como aviso y luego
                            se vuelven letales. <span className="bad">Tocarlas mientras están activas termina el juego al instante.</span>
                            <br />
                            La <strong>estrella dorada</strong> es una oportunidad de inversión: aparece poco tiempo y vale más puntos.
                            <br /><br />
                            <span className="good">Llega a 250 puntos para demostrar resiliencia.</span>
                            <span className="bad">Si caes a -50, tu empresa entra en insolvencia.</span>
                        </p>
                    </div>
                    <button className="snake-btn" onClick={() => setShowIntro(false)}>
                        Comenzar
                    </button>
                </div>
            )}

            {!showIntro && (
                <div className="snake-window minigame-container">
                    <canvas
                        ref={canvasRef}
                        width={COLS * TILE}
                        height={ROWS * TILE}
                        className={shakeRef.current > 0 ? "shake" : ""}
                    />

                    <div className="stats-row">
                        <div className="score-box">
                            Exposición controlada: <span>{score}</span> / {WIN_SCORE}
                        </div>
                        {streak >= 2 && (
                            <div className="streak-badge">🔥 Racha x{streak}</div>
                        )}
                    </div>

                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>

                    <div className="mobile-controls">
                        <button className="dir-btn up" onClick={() => setDirButton(0, -1)}>↑</button>
                        <div className="dir-row">
                            <button className="dir-btn" onClick={() => setDirButton(-1, 0)}>←</button>
                            <button className="dir-btn" onClick={() => setDirButton(0, 1)}>↓</button>
                            <button className="dir-btn" onClick={() => setDirButton(1, 0)}>→</button>
                        </div>
                    </div>

                    {gameOver && (
                        <div className="game-over">
                            <p className="description">{outcomeMessages[outcome]}</p>
                            <button className="snake-btn" onClick={handleRetry}>
                                Reintentar
                            </button>
                            <button className="snake-btn finish" onClick={onComplete}>
                                Terminar minijuego
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
