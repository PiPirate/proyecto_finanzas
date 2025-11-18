import React, { useEffect, useRef, useState } from "react";
import "./css/InterestRunnerGame.css";
import playerRunSprite from "../../assets/unit3/runners/player_runing.png";
import monsterRunSprite from "../../assets/unit3/runners/moster_runing.png";

export default function InterestRunnerGame({ visible, onComplete }) {

    if (!visible) return null;

    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);

    const [playerFrame, setPlayerFrame] = useState(0);
    const [monsterFrame, setMonsterFrame] = useState(0);

    const frameHeightPlayer = 64;   // cambia según tu sprite
    const frameWidthPlayer = 64;

    const frameHeightMonster = 64;
    const frameWidthMonster = 64;


    // --- Configuración del juego ---
    const width = 700;
    const height = 300;

    const groundY = 240;

    const [player, setPlayer] = useState({
        x: 80,
        y: groundY,
        vy: 0,
        jumping: false
    });

    const [monsterX, setMonsterX] = useState(10);

    const [obstacles, setObstacles] = useState([]);
    const [distance, setDistance] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    const gravity = 1.1;
    const goalDistance = 1800; // distancia para ganar

    // ---------- GENERACIÓN DE ÍTEMS ----------
    const spawnItem = () => {
        const good = Math.random() < 0.5;

        setObstacles((prev) => [
            ...prev,
            {
                x: width + 20,
                y: groundY,
                type: good ? "good" : "bad"
            }
        ]);
    };

    const resetGame = () => {
        setPlayer({ x: 80, y: groundY, vy: 0, jumping: false });
        setMonsterX(10);
        setObstacles([]);
        setDistance(0);
        setGameOver(false);
    };

    // ---------- SETUP INICIAL ----------
    useEffect(() => {
        if (showIntro) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        setCtx(context);

        resetGame();
    }, [showIntro]);

    const playerImg = useRef(new Image());
    const monsterImg = useRef(new Image());

    useEffect(() => {
        playerImg.current.src = playerRunSprite;
        monsterImg.current.src = monsterRunSprite;
    }, []);

    useEffect(() => {
        if (!ctx || gameOver || showIntro) return;

        const animLoop = setInterval(() => {
            setPlayerFrame(f => (f + 1) % 3);
            setMonsterFrame(f => (f + 1) % 3);
        }, 150); // velocidad de animación

        return () => clearInterval(animLoop);
    }, [ctx, gameOver, showIntro]);


    // ---------- LOOP PRINCIPAL ----------
    useEffect(() => {
        if (!ctx || gameOver) return;

        const gameLoop = setInterval(update, 30);

        return () => clearInterval(gameLoop);
    });

    const update = () => {
        // Movimiento del jugador (salto)
        setPlayer((p) => {
            let newY = p.y + p.vy;
            let newVy = p.vy + gravity;

            if (newY >= groundY) {
                newY = groundY;
                newVy = 0;
                p.jumping = false;
            }

            return { ...p, y: newY, vy: newVy };
        });


        // Movimiento de obstáculos
        setObstacles((obs) =>
            obs
                .map((o) => ({ ...o, x: o.x - 5 }))
                .filter((o) => o.x > -50)
        );

        // Distancia recorrida
        setDistance((d) => d + 3);

        // Generar objetos aleatorios
        if (Math.random() < 0.04) spawnItem();

        checkCollisions();
        draw();
    };

    // ---------- COLISIONES ----------
    const checkCollisions = () => {
        obstacles.forEach((o) => {
            const touching =
                o.x < player.x + 40 &&
                o.x + 30 > player.x &&
                player.y > groundY - 40;

            if (touching) {
                if (o.type === "good") {
                    // Se aleja
                    setMonsterX((x) => Math.max(0, x - 20));
                } else {
                    // Se acerca
                    setMonsterX((x) => x + 25);
                }
            }
        });

        // Si ya está muy cerca del jugador → perder
        if (monsterX + 60 >= player.x) {
            setGameOver(true);
        }

        // Meta alcanzada
        if (distance >= goalDistance) {
            setGameOver(true);
        }
    };


    // ---------- DIBUJAR ----------
    const draw = () => {
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        // Suelo
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(0, groundY + 40, width, 10);

        // --- JUGADOR ---
        ctx.drawImage(
            playerImg.current,
            0,                                       // X del recorte
            playerFrame * frameHeightPlayer,         // Y del recorte (frame actual)
            frameWidthPlayer,
            frameHeightPlayer,
            player.x,
            player.y - frameHeightPlayer,
            frameWidthPlayer,
            frameHeightPlayer
        );

        // --- MONSTRUO ---
        ctx.drawImage(
            monsterImg.current,
            0,
            monsterFrame * frameHeightMonster,
            frameWidthMonster,
            frameHeightMonster,
            monsterX,
            groundY - frameHeightMonster,
            frameWidthMonster,
            frameHeightMonster
        );

        // --- OBSTÁCULOS ---
        obstacles.forEach((o) => {
            ctx.fillStyle = o.type === "good" ? "#2ecc71" : "#e74c3c";
            ctx.fillRect(o.x, o.y - 30, 30, 30);
        });

        // Distancia
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText(`Distancia: ${distance} / ${goalDistance}`, 20, 25);
    };


    // ---------- SALTO ----------
    useEffect(() => {
        const keyListener = (e) => {
            if (e.key === " " || e.key === "ArrowUp") {
                if (!player.jumping) {
                    setPlayer((p) => ({ ...p, vy: -18, jumping: true }));
                }
            }
        };
        window.addEventListener("keydown", keyListener);
        return () => window.removeEventListener("keydown", keyListener);
    }, [player.jumping]);

    return (
        <div className="interest-runner-overlay">

            {showIntro && (
                <div className="intro-window">
                    <h2>🏃‍♂️💨 ¡Escapa del monstruo del interés!</h2>

                    <p>
                        El interés es un monstruo que siempre te persigue.
                        <br /><br />
                        🟢 <strong>Powerups buenos</strong> → lo hacen más lento
                        <br />
                        🔴 <strong>Errores financieros</strong> → lo hacen más rápido
                        <br /><br />
                        Corre hasta llegar a la meta.
                    </p>

                    <button onClick={() => setShowIntro(false)}>Comenzar</button>
                </div>
            )}

            {!showIntro && (
                <div className="game-window">
                    <canvas ref={canvasRef} width={width} height={height} />

                    {gameOver && (
                        <div className="end-screen">
                            {distance >= goalDistance ? (
                                <p>🎉 ¡Escapaste del interés!</p>
                            ) : (
                                <p>💀 El interés te alcanzó...</p>
                            )}

                            <button onClick={resetGame}>Reintentar</button>
                            <button onClick={onComplete}>Terminar minijuego</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
