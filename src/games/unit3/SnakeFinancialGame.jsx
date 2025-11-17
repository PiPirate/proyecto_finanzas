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
    const [badFood, setBadFood] = useState(null);

    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    // Buenas decisiones
    const goodLabels = [
        "Pago puntual",
        "Tasa baja",
        "Ahorro",
        "Abono capital"
    ];

    // Malas decisiones
    const badLabels = [
        "Pago mínimo",
        "Mora",
        "Tasa alta",
        "Deuda gigante"
    ];

    // Random position
    const randomPos = () => ({
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
    });

    // Reset game
    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection({ x: 1, y: 0 });
        setFood(randomPos());
        setBadFood(randomPos());
        setScore(0);
        setGameOver(false);
    };

    // Init
    useEffect(() => {
        const canvas = canvasRef.current;
        setCtx(canvas.getContext("2d"));
        resetGame();
    }, []);

    // Movement loop
    useEffect(() => {
        if (!ctx || gameOver) return;

        const interval = setInterval(() => {
            update();
        }, 150);

        return () => clearInterval(interval);
    });

    const update = () => {
        setSnake((oldSnake) => {
            const newHead = {
                x: oldSnake[0].x + direction.x,
                y: oldSnake[0].y + direction.y
            };

            // Wall collision
            if (
                newHead.x < 0 ||
                newHead.y < 0 ||
                newHead.x >= cols ||
                newHead.y >= rows
            ) {
                setGameOver(true);
                return oldSnake;
            }

            // Self collision
            if (oldSnake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
                setGameOver(true);
                return oldSnake;
            }

            let newSnake = [newHead, ...oldSnake];

            // Good food collision
            if (food && newHead.x === food.x && newHead.y === food.y) {
                setScore((s) => s + 10);
                setFood(randomPos());
            } else {
                // standard movement
                newSnake.pop();
            }

            // Bad food collision (crece demasiado)
            if (badFood && newHead.x === badFood.x && newHead.y === badFood.y) {
                setScore((s) => s - 5);

                // Add 3 extra segments = deuda que crece rápido
                newSnake = [
                    ...newSnake,
                    { ...newSnake[newSnake.length - 1] },
                    { ...newSnake[newSnake.length - 1] },
                    { ...newSnake[newSnake.length - 1] }
                ];

                setBadFood(randomPos());
            }

            return newSnake;
        });
    };

    // Input
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

    // Render
    useEffect(() => {
        if (!ctx) return;

        ctx.clearRect(0, 0, cols * tileSize, rows * tileSize);

        // Draw snake
        snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? "#2ecc71" : "#27ae60";
            ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize, tileSize);
        });

        // Good food
        if (food) {
            ctx.fillStyle = "#3498db";
            ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
        }

        // Bad food
        if (badFood) {
            ctx.fillStyle = "#e74c3c";
            ctx.fillRect(badFood.x * tileSize, badFood.y * tileSize, tileSize, tileSize);
        }
    }, [snake, food, badFood, ctx]);

    return (
        <div className="snake-overlay">
            <div className="snake-window">
                <h2>🐍 La Serpiente Financiera</h2>

                <p>
                    Come <span className="good">buenas decisiones</span> y evita
                    <span className="bad"> malas decisiones</span>.
                </p>

                <div className="score">Puntaje: {score}</div>

                <canvas
                    ref={canvasRef}
                    width={cols * tileSize}
                    height={rows * tileSize}
                />

                {/* Labels debajo del tablero */}
                <div className="legend">
                    <div className="good-box">Buenas decisiones:</div>
                    {goodLabels.map((g) => (
                        <div key={g} className="good">{g}</div>
                    ))}

                    <div className="bad-box">Malas decisiones:</div>
                    {badLabels.map((b) => (
                        <div key={b} className="bad">{b}</div>
                    ))}
                </div>

                {gameOver && (
                    <div className="game-over">
                        <h3>💥 Te sobreendeudaste</h3>
                        <p>Las malas decisiones hicieron crecer tu deuda más rápido que tú misma.</p>

                        <button className="snake-btn" onClick={resetGame}>
                            Reintentar
                        </button>

                        <button className="snake-btn finish" onClick={onComplete}>
                            Terminar minijuego
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
