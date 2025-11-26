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

    const frameWidthPlayer = 382;
    const frameHeightPlayer = 229;

    const frameWidthMonster = 382;
    const frameHeightMonster = 188;
    const playerOffsetY = -90; // baja 40px respecto al cálculo normal
    const lastSpawn = useRef(Date.now());
    const nextSpawnTime = useRef(0);
    const hitboxWidth = 80;
    const hitboxHeight = 50;
    const [questionModal, setQuestionModal] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const questions = [
        {
            text: "Si los costos suben más rápido que los ingresos, el margen neto disminuye.",
            answer: true,
            explanation: "El margen neto depende directamente de la relación entre ingresos y costos."
        },
        {
            text: "Un margen bruto alto significa que la empresa controla bien sus costos directos.",
            answer: true,
            explanation: "El margen bruto evalúa la eficiencia de la producción o ventas."
        },
        {
            text: "El EBITDA es una medida de rentabilidad después de impuestos.",
            answer: false,
            explanation: "El EBITDA excluye impuestos, intereses y depreciación."
        },
        {
            text: "Si una empresa reduce precios sin reducir costos, su margen empeora.",
            answer: true,
            explanation: "Bajar precios con costos iguales reduce la utilidad."
        },
        {
            text: "El ROE mide la rentabilidad del patrimonio de los accionistas.",
            answer: true,
            explanation: "Mide cuánto gana la empresa por cada peso invertido por los dueños."
        },
        {
            text: "Un ROA alto indica mayor eficiencia en el uso de los activos.",
            answer: true,
            explanation: "ROA mide el rendimiento generado por los activos totales."
        },
        {
            text: "Un incremento en gastos administrativos mejora el margen operativo.",
            answer: false,
            explanation: "Más gastos operativos reducen el margen operativo."
        },
        {
            text: "El margen neto siempre será más alto que el margen bruto.",
            answer: false,
            explanation: "El margen neto es el último: incluye todos los gastos e impuestos."
        },
        {
            text: "La rentabilidad puede aumentar si se mejora la eficiencia operativa.",
            answer: true,
            explanation: "Reducir desperdicios y optimizar procesos mejora márgenes."
        },
        {
            text: "Una empresa rentable siempre tiene liquidez.",
            answer: false,
            explanation: "Una empresa puede ser rentable en papel pero sin efectivo disponible."
        }
    ];




    // --- Configuración del juego ---
    const width = 1600;
    const height = 500;

    const groundY = 500;

    const [player, setPlayer] = useState({
        x: 500,
        y: groundY,
        vy: 0,
        jumping: false
    });

    const [monsterX, setMonsterX] = useState(-80);

    const [obstacles, setObstacles] = useState([]);
    const [distance, setDistance] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    const gravity = 1.1;
    const goalDistance = 100; // distancia para ganar

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
        setPlayer({ x: 500, y: groundY, vy: 0, jumping: false });
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

    // Tamaño real de los frames (se calculan cuando las imágenes cargan)
    const [playerFrameHeight, setPlayerFrameHeight] = useState(0);
    const [playerFrameWidth, setPlayerFrameWidth] = useState(0);

    const [monsterFrameHeight, setMonsterFrameHeight] = useState(0);
    const [monsterFrameWidth, setMonsterFrameWidth] = useState(0);

    const [playerFrameSize, setPlayerFrameSize] = useState({ w: 382, h: 229 });
    const [monsterFrameSize, setMonsterFrameSize] = useState({ w: 64, h: 64 });

    useEffect(() => {
        playerImg.current.onload = () => {
            setPlayerFrameSize({
                w: playerImg.current.width,
                h: playerImg.current.height / 3   // porque son 3 frames
            });
        };

        monsterImg.current.onload = () => {
            setMonsterFrameSize({
                w: monsterImg.current.width,
                h: monsterImg.current.height / 3
            });
        };

        playerImg.current.src = playerRunSprite;
        monsterImg.current.src = monsterRunSprite;
    }, []);


    useEffect(() => {
        if (!ctx || gameOver || showIntro) return;

        const animLoop = setInterval(() => {
            setPlayerFrame(f => (f + 1) % 3);
            setMonsterFrame(f => (f + 1) % 3);
        }, 120); // velocidad de animación

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

        if (isPaused) {
            draw();
            return;
        }
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

        // --- SPAWN CONTROLADO Y RANDOM ---
        const now = Date.now();

        // Si ya superamos el tiempo del próximo spawn → crear uno
        if (now > nextSpawnTime.current) {
            spawnItem();

            // Elegimos un nuevo tiempo aleatorio entre 700 y 2000 ms
            nextSpawnTime.current = now + (900 + Math.random() * 1300);
        }



        checkCollisions();
        draw();
    };

    // ---------- COLISIONES ----------
    const checkCollisions = () => {

        setObstacles(obs =>
            obs.filter(o => {
                const touching =
                    o.x < player.x + hitboxWidth &&
                    o.x + 30 > player.x &&
                    player.y > groundY - hitboxHeight;

                if (touching) {

                    if (o.type === "bad") {

                        // PAUSAMOS EL JUEGO
                        setIsPaused(true);

                        // SACA UNA PREGUNTA RANDOM
                        const q = questions[Math.floor(Math.random() * questions.length)];
                        setQuestionModal(q);

                    } else {
                        // bueno → aleja monstruo
                        setMonsterX(x => Math.max(0, x - 5));
                    }

                    return false; // eliminar bloque
                }

                return true;
            })
        );

        if (monsterX + 60 >= player.x) {
            setGameOver(true);
        }

        if (distance >= goalDistance) {
            setGameOver(true);
        }
    };

    const handleAnswer = (choice) => {

        if (choice === questionModal.answer) {
            // ¡Correcto!
            setQuestionModal({
                ...questionModal,
                feedback: "¡Correcto! 😊",
                allowContinue: true
            });
        } else {
            // Incorrecto → monstruo avanza
            setMonsterX(x => x + 90);

            setQuestionModal({
                ...questionModal,
                feedback: "Incorrecto ❌ — " + questionModal.explanation,
                allowContinue: true
            });
        }
    };

    const closeQuestion = () => {
        setQuestionModal(null);
        setIsPaused(false);
    };




    // ---------- DIBUJAR ----------
    const draw = () => {
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        // Suelo
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(0, groundY + 5, width, 10);

        // --- AJUSTES DE ALTURA ---
        const playerOffsetY = 520;   // toca el suelo perfecto
        const monsterOffsetY = 365;   // toca el suelo perfecto

        // --- JUGADOR ---
        ctx.drawImage(
            playerImg.current,
            0,
            playerFrame * playerFrameSize.h,
            playerFrameSize.w,
            playerFrameSize.h,
            player.x,
            player.y - playerFrameSize.h + playerOffsetY,
            playerFrameSize.w * 0.25,
            playerFrameSize.h * 0.25
        );

        // --- MONSTRUO ---
        ctx.drawImage(
            monsterImg.current,
            0,
            monsterFrame * monsterFrameSize.h,
            monsterFrameSize.w,
            monsterFrameSize.h,
            monsterX,
            groundY - monsterFrameSize.h + monsterOffsetY,
            monsterFrameSize.w * 0.35,
            monsterFrameSize.h * 0.35
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
<div className="unit3-game-container">  
        <div className="interest-runner-overlay">

            {showIntro && (
                <div className="intro-window minigame-containert">
                    <h2>¡Corre para proteger tu rentabilidad!</h2>

                    <p>
                        En este juego eres una empresa intentando mantener sus márgenes de ganancia.
                        <br /><br />
                        🟢 <strong>Buenas decisiones financieras</strong> → mejoran tu rentabilidad y alejan al “monstruo del costo”.
                        <br />
                        🔴 <strong>Errores operativos</strong> → reducen tus márgenes y acercan al monstruo.
                        <br /><br />
                        Llega a <strong>5800</strong> puntos para demostrar que tu empresa es rentable.
                    </p>

                    <button onClick={() => setShowIntro(false)}>Comenzar</button>
                </div>
            )}

            {!showIntro && (
                <div className="game-window minigame-containert">
                    {
                        questionModal && (
                            <div className="question-modal">
                                <div className="modal-box">

                                    <h3>Evaluación Financiera</h3>

                                    <p>{questionModal.text}</p>

                                    <div className="buttons">
                                        <button onClick={() => handleAnswer(true)}>Verdadero</button>
                                        <button onClick={() => handleAnswer(false)}>Falso</button>
                                    </div>

                                    {questionModal.feedback && (
                                        <p className="explanation">{questionModal.feedback}</p>
                                    )}

                                    {questionModal.allowContinue && (
                                        <button onClick={closeQuestion}>Continuar</button>
                                    )}
                                </div>
                            </div>
                        )
                    }
                    <canvas ref={canvasRef} width={width} height={height} />

                    {gameOver && (
                        <div className="end-screen">

                            {distance >= goalDistance ? (
                                <>
                                    <p class="final-text"> ¡Protegiste la rentabilidad de tu empresa!</p>
                                    <button onClick={onComplete}>Continuar</button>
                                </>
                            ) : (
                                <>
                                    <p class="final-text">💀 Los costos superaron tus márgenes...</p>
                                    <button onClick={resetGame}>Reintentar</button>
                                </>
                            )}

                        </div>
                    )}

                </div>
            )}
        </div>
        </div> 
    );
}
