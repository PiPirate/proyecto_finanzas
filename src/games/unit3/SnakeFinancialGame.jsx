import React, { useEffect, useRef, useState } from "react";
import "./css/SnakeFinancialGame.css";

export default function SnakeFinancialGame({ visible, onComplete }) {
    if (!visible) return null;

    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);

    const tileSize = 20;
    const cols = 20;
    const rows = 20;

    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [direction, setDirection] = useState({ x: 1, y: 0 });

    const [food, setFood] = useState(null);
    const [badFood, setBadFood] = useState([]);
    const [debtWave, setDebtWave] = useState([]); // Oleada de deudas

    const waveCooldown = useRef(0);

    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [showIntro, setShowIntro] = useState(true);

    const randomPos = () => {
        let pos;

        do {
            pos = {
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows)
            };

        } while (
            snake.some(s => s.x === pos.x && s.y === pos.y) ||     // No sobre la serpiente
            badFood.some(b => b.x === pos.x && b.y === pos.y) ||  // No sobre rojas
            debtWave.some(w => w.x === pos.x && w.y === pos.y)    // No sobre oleada
        );

        return pos;
    };


    const spawnBadFoods = (extra = 0) => {
        const created = Array.from({ length: 3 + extra }, () => randomPos());
        setBadFood(created);
    };

    const spawnDebtWave = () => {
        const rowOrCol = Math.random() < 0.5 ? "row" : "col";
        const index = Math.floor(Math.random() * rows);
        let wave = [];

        if (rowOrCol === "row") {
            for (let x = 0; x < cols; x++) {
                wave.push({ x, y: index });
            }
        } else {
            for (let y = 0; y < rows; y++) {
                wave.push({ x: index, y });
            }
        }

        setDebtWave(wave);
    };

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection({ x: 1, y: 0 });
        setFood(randomPos());
        spawnBadFoods();
        setDebtWave([]);
        waveCooldown.current = 0;
        setScore(0);
        setGameOver(false);
    };

    useEffect(() => {
        if (showIntro) return;
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        setCtx(context);  // ✔ AHORA ctx existe para el resto del juego

        resetGame();      // ✔ Se reinicia correctamente

    }, [showIntro]);


    useEffect(() => {
        if (!ctx || gameOver) return;

        const interval = setInterval(update, 150);

        return () => clearInterval(interval);
    }, [ctx, gameOver, direction]);


    const update = () => {
        setSnake((oldSnake) => {
            const newHead = {
                x: oldSnake[0].x + direction.x,
                y: oldSnake[0].y + direction.y
            };


            if (score <= -50) {
                setGameOver(true);
                return oldSnake;
            }


            // LÍMITES
            if (
                newHead.x < 0 ||
                newHead.y < 0 ||
                newHead.x >= cols ||
                newHead.y >= rows
            ) {
                setGameOver(true);
                return oldSnake;
            }

            // Choque consigo mismo
            // Ignorar choque contra el propio cuerpo
            if (oldSnake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
                // No muere, solo ignora el choque
            }


            let newSnake = [newHead, ...oldSnake];

            // 🍏 COMER VERDE
            if (food && newHead.x === food.x && newHead.y === food.y) {
                setScore((s) => s + 10);

                if (newSnake.length > 3) {
                    newSnake.pop();
                    newSnake.pop();
                }

                setFood(randomPos());

                // Cada verde genera un rojo extra
                setBadFood(old => [...old, randomPos()]);
            } else {
                newSnake.pop();
            }

            // 🟥 COMER ROJO NORMAL
            badFood.forEach((b) => {
                if (newHead.x === b.x && newHead.y === b.y) {

                    // bajar puntaje
                    setScore((s) => s - 5);

                    // crecer un poco
                    newSnake = [
                        ...newSnake,
                        { ...newSnake[newSnake.length - 1] }
                    ];

                    // ❌ eliminar este bloque rojo del array
                    setBadFood((old) => old.filter((item) => !(item.x === b.x && item.y === b.y)));
                }
            });

            // 🟥 OLEADA DE DEUDAS (fila o columna completa)
            if (debtWave.some((b) => b.x === newHead.x && b.y === newHead.y)) {
                setScore((s) => s - 10);

                newSnake = [
                    ...newSnake,
                    { ...newSnake[newSnake.length - 1] }
                ];

                setDebtWave([]);
            }

            // ACTIVAR OLEADAS CADA CIERTAS ITERACIONES
            waveCooldown.current++;
            if (waveCooldown.current > 40) {
                spawnDebtWave();
                waveCooldown.current = 0;
            }

            // META 500 PUNTOS
            if (score >= 250) {
                setGameOver(true);
            }

            return newSnake;
        });
    };

    // Controles
    useEffect(() => {
        const keyListener = (e) => {
            if (e.key === "ArrowUp" && direction.y === 0)
                setDirection({ x: 0, y: -1 });

            if (e.key === "ArrowDown" && direction.y === 0)
                setDirection({ x: 0, y: 1 });

            if (e.key === "ArrowLeft" && direction.x === 0)
                setDirection({ x: -1, y: 0 });

            if (e.key === "ArrowRight" && direction.x === 0)
                setDirection({ x: 1, y: 0 });
        };

        window.addEventListener("keydown", keyListener);
        return () => window.removeEventListener("keydown", keyListener);
    }, [direction]);

    // DIBUJADO
    useEffect(() => {
        if (!ctx) return;

        ctx.clearRect(0, 0, cols * tileSize, rows * tileSize);

        // 🟢 SERPIENTE (DEUDA)
        snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? "#00d57a" : "#00b867";
            ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize - 1, tileSize - 1);
        });

        // VERDE (CUOTA)
        if (food) {
            ctx.fillStyle = "#2ecc71";
            ctx.beginPath();
            ctx.arc(
                food.x * tileSize + tileSize / 2,
                food.y * tileSize + tileSize / 2,
                tileSize / 2.5,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // ROJOS NORMALES
        badFood.forEach((b) => {
            ctx.fillStyle = "#e74c3c";
            ctx.fillRect(b.x * tileSize, b.y * tileSize, tileSize - 1, tileSize - 1);
        });

        // 🟥 OLEADA DE DEUDAS (fila o columna completa)
        debtWave.forEach((b) => {
            ctx.fillStyle = "#c0392b";
            ctx.fillRect(b.x * tileSize, b.y * tileSize, tileSize - 1, tileSize - 1);
        });

    }, [snake, food, badFood, debtWave, ctx]);

    return (
        <div className="snake-overlay">

            {/* =============== INTRO MODAL =============== */}
            {showIntro && (
                <div className="snake-window">
                    <div className="container-intro">
                        <h2>Gestor de Riesgo Financiero</h2>

                        <p className="description">
                            Controla la exposición al riesgo de tu empresa.
                            <br />
                            La serpiente representa el nivel de riesgo acumulado.
                            <br /><br />
                            Los <span className="good">verdes</span> son buenas prácticas de gestión del riesgo:
                            reducen tu exposición.
                            <br />
                            Los <span className="bad">rojos</span> representan riesgos financieros y operativos.
                            <br /><br />
                            Las <strong>oleadas de riesgo</strong> simbolizan choques externos:
                            crisis de mercado, alzas de tasas o caída de ingresos.
                            <br />
                            <span className="good">Llega a 250 puntos para demostrar resiliencia.</span>
                            <span className="bad">Si llegas a -50, tu empresa entra en insolvencia.</span>
                        </p>
                    </div>
                    <button className="snake-btn" onClick={() => setShowIntro(false)}>
                        Comenzar
                    </button>

                </div>
            )}

            {/* =============== GAME WINDOW =============== */}
            {!showIntro && (
                <div className="snake-window">

                    {/* CANVAS DEL JUEGO */}
                    <canvas
                        ref={canvasRef}
                        width={cols * tileSize}
                        height={rows * tileSize}
                    />
                    <div className="score-box">
                        Exposición controlada: <span>{score}</span> / 250
                    </div>


                    {/* =============== GAME OVER SCREEN =============== */}
                    {gameOver && (
                        <div className="game-over">

                            {score >= 250 ? (
                                <p className="description">¡Excelente! Tu empresa gestionó el riesgo con éxito.</p>
                            ) : (
                                <p className="description">La exposición al riesgo se volvió insostenible.</p>
                            )}


                            <button className="snake-btn" onClick={resetGame}>
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
