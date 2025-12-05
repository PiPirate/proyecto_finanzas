import React, { useState, useRef } from "react";
import "./css/FinalLoanEvaluationGame.css";

export default function FinalLoanEvaluationGame({ visible, onFinish }) {
    console.log("🧩 FinalLoanEvaluationGame montado/renderizado");
    if (!visible) return null;

    // ------------------------------------------------------
    // 1. TODAS LAS RONDAS (15 tarjetas)
    // ------------------------------------------------------
    const rounds = [
        {
            situation: "Tu empresa puede comprar una máquina que aumenta la producción un 25% y reduce costos.",
            offer: { monto: "$12.000.000", tasa: "VPN positivo", plazo: "Vida útil 5 años", cuota: "Retorno anual 18%" },
            options: [
                { dir: "right", label: "Invertir", correct: true, msg: "Correcto. Mejora productividad y reduce costos." },
                { dir: "left", label: "Rechazar inversión", correct: false, msg: "Perderías una oportunidad rentable." },
                { dir: "up", label: "Analizar flujo de caja", correct: true, msg: "Excelente. El flujo es clave." },
                { dir: "down", label: "Esperar sin razones", correct: false, msg: "Retrasar una inversión rentable trae costo de oportunidad." }
            ]
        },
        {
            situation: "Proponen comprar un software costoso que no aporta valor directo ni reduce costos.",
            offer: { monto: "$3.500.000", tasa: "VPN negativo", plazo: "Indefinido", cuota: "Impacto en utilidad: nulo" },
            options: [
                { dir: "right", label: "Invertir", correct: false, msg: "No es rentable según VPN." },
                { dir: "left", label: "Rechazar", correct: true, msg: "Correcto. No genera retorno económico." },
                { dir: "up", label: "Negociar precio", correct: true, msg: "Puede volverse viable si baja el costo." },
                { dir: "down", label: "Financiar sin analizar", correct: false, msg: "Nunca financies algo sin rentabilidad." }
            ]
        },
        {
            situation: "Te ofrecen invertir en una franquicia con alta demanda y retorno estimado del 22%.",
            offer: { monto: "$20.000.000", tasa: "Retorno 22%", plazo: "24 meses", cuota: "Flujo mensual estable" },
            options: [
                { dir: "right", label: "Invertir", correct: true, msg: "Buena inversión: retorno alto y estable." },
                { dir: "left", label: "No invertir", correct: false, msg: "Perderías un retorno atractivo." },
                { dir: "up", label: "Analizar riesgo del sector", correct: true, msg: "Siempre analiza riesgos." },
                { dir: "down", label: "Pedir préstamo para cubrirlo todo", correct: false, msg: "Exceso de deuda aumenta riesgo." }
            ]
        },
        {
            situation: "Tu empresa evalúa abrir una nueva sede, pero la zona tiene baja demanda histórica.",
            offer: { monto: "$15.000.000", tasa: "Retorno incierto", plazo: "36 meses", cuota: "Riesgo alto" },
            options: [
                { dir: "right", label: "Abrir sede", correct: false, msg: "Alta inversión y baja demanda = mala idea." },
                { dir: "left", label: "Cancelar proyecto", correct: true, msg: "Correcto. Evitas pérdidas potenciales." },
                { dir: "up", label: "Estudiar mercado", correct: true, msg: "Siempre analiza antes de decidir." },
                { dir: "down", label: "Financiar sin análisis", correct: false, msg: "Nunca sin análisis de demanda." }
            ]
        },
        {
            situation: "Tu empresa puede comprar inventario con descuento del 20% por compra anticipada.",
            offer: { monto: "$8.000.000", tasa: "Ahorro efectivo", plazo: "Rotación 2 meses", cuota: "Mejora margen" },
            options: [
                { dir: "right", label: "Comprar inventario", correct: true, msg: "Descuentos altos mejoran margen." },
                { dir: "left", label: "No comprar", correct: false, msg: "Perderías ahorro directo." },
                { dir: "up", label: "Revisar capital de trabajo", correct: true, msg: "Debe existir liquidez suficiente." },
                { dir: "down", label: "Comprar más de lo necesario", correct: false, msg: "Exceso de inventario reduce liquidez." }
            ]
        },
        {
            situation: "Una startup te ofrece invertir a cambio del 10% de participación, con riesgo alto y retorno incierto.",
            offer: { monto: "$5.000.000", tasa: "Riesgo alto", plazo: "Retorno incierto", cuota: "Opciones a futuro" },
            options: [
                { dir: "right", label: "Invertir", correct: false, msg: "Riesgo muy alto sin retorno claro." },
                { dir: "left", label: "Rechazar", correct: true, msg: "Correcto. No hay evidencia de retorno." },
                { dir: "up", label: "Solicitar proyecciones financieras", correct: true, msg: "Siempre exígelas." },
                { dir: "down", label: "Invertir por intuición", correct: false, msg: "Las decisiones deben ser analíticas." }
            ]
        },
        {
            situation: "Puedes invertir en marketing digital, lo que aumentaría tus ventas un 15%.",
            offer: { monto: "$3.000.000", tasa: "Rentabilidad esperada: alta", plazo: "6 meses", cuota: "Retorno rápido" },
            options: [
                { dir: "right", label: "Invertir", correct: true, msg: "Buena decisión: impacto directo en ventas." },
                { dir: "left", label: "No invertir", correct: false, msg: "Perderías crecimiento potencial." },
                { dir: "up", label: "Medir retorno por canal", correct: true, msg: "Optimiza la estrategia." },
                { dir: "down", label: "Duplicar presupuesto sin análisis", correct: false, msg: "No gastes sin analizar." }
            ]
        },
        {
            situation: "Puedes adquirir una licencia tecnológica que automatiza procesos y ahorra tiempo.",
            offer: { monto: "$2.400.000", tasa: "ROI 20%", plazo: "12 meses", cuota: "Reduce costos operativos" },
            options: [
                { dir: "right", label: "Invertir", correct: true, msg: "Automatizar mejora productividad." },
                { dir: "left", label: "No invertir", correct: false, msg: "Perderías eficiencia." },
                { dir: "up", label: "Solicitar prueba gratuita", correct: true, msg: "Una prueba reduce riesgo." },
                { dir: "down", label: "Ignorar el ROI", correct: false, msg: "El ROI es clave en decisiones." }
            ]
        },
        {
            situation: "Te ofrecen un 'paquete VIP' de servicios sin impacto financiero real.",
            offer: { monto: "$1.800.000", tasa: "Sin retorno", plazo: "Inmediato", cuota: "Costo hundido" },
            options: [
                { dir: "right", label: "Comprar paquete", correct: false, msg: "No genera retorno." },
                { dir: "left", label: "Rechazar oferta", correct: true, msg: "Correcto. Evita gastos inútiles." },
                { dir: "up", label: "Negociar beneficios reales", correct: true, msg: "Solo vale si aporta valor." },
                { dir: "down", label: "Aceptar porque 'se ve bien'", correct: false, msg: "No se decide por apariencia." }
            ]
        },
        {
            situation: "Puedes ampliar tu negocio a un nuevo mercado con crecimiento sostenido.",
            offer: { monto: "$10.000.000", tasa: "Retorno 16%", plazo: "30 meses", cuota: "Demanda creciente" },
            options: [
                { dir: "right", label: "Expandir negocio", correct: true, msg: "Crecimiento sostenible." },
                { dir: "left", label: "No expandir", correct: false, msg: "Perderías oportunidad." },
                { dir: "up", label: "Realizar análisis de competencia", correct: true, msg: "Evita sorpresas." },
                { dir: "down", label: "Ignorar estudios de mercado", correct: false, msg: "Clave para decisiones estratégicas." }
            ]
        },
        {
            situation: "Puedes invertir en maquinaria usada mucho más barata, pero con alto costo de mantenimiento.",
            offer: { monto: "$4.000.000", tasa: "Costo oculto alto", plazo: "Variable", cuota: "Riesgo de fallas" },
            options: [
                { dir: "right", label: "Comprar usada", correct: false, msg: "El ahorro inicial no compensa el costo total." },
                { dir: "left", label: "Rechazar oferta", correct: true, msg: "Correcto. El costo oculto afecta rentabilidad." },
                { dir: "up", label: "Calcular costo total de propiedad", correct: true, msg: "Excelente. Evalúa todo." },
                { dir: "down", label: "Confiar en suerte", correct: false, msg: "Las finanzas no se basan en suerte." }
            ]
        },
        {
            situation: "Una inversión promete retorno del 50%, pero sin respaldo ni datos verificados.",
            offer: { monto: "$2.000.000", tasa: "Promesa no verificada", plazo: "Desconocido", cuota: "Riesgo extremo" },
            options: [
                { dir: "right", label: "Invertir", correct: false, msg: "Muy riesgoso sin datos confiables." },
                { dir: "left", label: "Rechazar", correct: true, msg: "Correcto. Evitas fraude o pérdida." },
                { dir: "up", label: "Solicitar información verificada", correct: true, msg: "Paso indispensable." },
                { dir: "down", label: "Creer en la promesa", correct: false, msg: "Muy peligroso." }
            ]
        },
        {
            situation: "Tu empresa puede introducir un nuevo producto con alta demanda y bajo costo de producción.",
            offer: { monto: "$6.500.000", tasa: "ROI 28%", plazo: "12 meses", cuota: "Alta rotación" },
            options: [
                { dir: "right", label: "Lanzar producto", correct: true, msg: "Gran oportunidad de rentabilidad." },
                { dir: "left", label: "No lanzarlo", correct: false, msg: "Perderías ventaja competitiva." },
                { dir: "up", label: "Analizar ciclo de vida del producto", correct: true, msg: "Importante para proyectar retorno." },
                { dir: "down", label: "Invertir todo sin análisis", correct: false, msg: "Riesgo financiero innecesario." }
            ]
        },
        {
            situation: "Tienes la opción de reinvertir utilidades en mejoras internas con retorno garantizado del 12%.",
            offer: { monto: "Utilidades", tasa: "12% anual", plazo: "Continuo", cuota: "Bajo riesgo" },
            options: [
                { dir: "right", label: "Reinvertir", correct: true, msg: "Rentabilidad segura." },
                { dir: "left", label: "Retirar utilidades", correct: false, msg: "Pierdes el retorno." },
                { dir: "up", label: "Comparar contra alternativas", correct: true, msg: "Siempre evalúa opciones." },
                { dir: "down", label: "Gastar utilidades", correct: false, msg: "Reducirías crecimiento." }
            ]
        },
        {
            situation: "Debes decidir entre dos proyectos: uno con retorno estable del 10%, otro con posible 35% pero riesgo muy alto.",
            offer: { monto: "$Elección estratégica", tasa: "10% seguro vs 35% incierto", plazo: "18 meses", cuota: "Depende del riesgo" },
            options: [
                { dir: "right", label: "Elegir retorno alto", correct: false, msg: "El riesgo es excesivo y no controlado." },
                { dir: "left", label: "Elegir retorno estable", correct: true, msg: "Mejor riesgo-retorno para empresa." },
                { dir: "up", label: "Comparar riesgo ajustado al retorno", correct: true, msg: "Excelente análisis financiero." },
                { dir: "down", label: "Elegir sin análisis", correct: false, msg: "Nunca sin análisis de riesgo." }
            ]
        }
    ];

    // ------------------------------------------------------
    // 2. ESTADOS
    // ------------------------------------------------------
    const [index, setIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [endScreen, setEndScreen] = useState(null);
    const [hoverDirection, setHoverDirection] = useState(null);

    // Candado duro para evitar dobles respuestas
    const lockRef = useRef(false);

    const startPos = useRef({ x: 0, y: 0 });
    const isPointerDownRef = useRef(false);

    const SWIPE_THRESHOLD = 60;

    // ------------------------------------------------------
    // 3. RESET / FINAL
    // ------------------------------------------------------
    function resetGame() {
        setIndex(0);
        setCorrectCount(0);
        setFeedback(null);
        setEndScreen(null);
        setHoverDirection(null);
        startPos.current = { x: 0, y: 0 };
        isPointerDownRef.current = false;
        lockRef.current = false;
    }

    function finishGame(score) {
        let type = "";
        let msg = "";

        const MIN_SUCCESS = 5; // 👈 gana con 5 o más aciertos

        if (score >= MIN_SUCCESS) {
            type = "success";
            msg = "🎉 ¡Excelente! Manejas muy bien los conceptos.";
        } else {
            type = "fail";
            msg = "❌ Te recomendamos repetir el juego antes de continuar.";
        }

        setEndScreen({ type, msg });
        lockRef.current = true; // ya no queremos más interacciones
    }


    // ------------------------------------------------------
    // 4. GESTOS (POINTER EVENTS)
    // ------------------------------------------------------
    const getPoint = (event) => {
        return {
            x: event.clientX,
            y: event.clientY
        };
    };

    function handlePointerDown(e) {
        e.preventDefault();
        if (lockRef.current || endScreen) return;

        isPointerDownRef.current = true;
        const { x, y } = getPoint(e);
        startPos.current = { x, y };
        setHoverDirection(null);
    }

    function handlePointerMove(e) {
        if (!isPointerDownRef.current || lockRef.current || endScreen) return;

        const { x, y } = getPoint(e);
        const dx = x - startPos.current.x;
        const dy = y - startPos.current.y;

        let dir = null;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD / 2) {
            dir = dx > 0 ? "right" : "left";
        } else if (Math.abs(dy) > SWIPE_THRESHOLD / 2) {
            dir = dy < 0 ? "up" : "down";
        }

        setHoverDirection(dir);
    }

    function handlePointerUp(e) {
        if (!isPointerDownRef.current) {
            setHoverDirection(null);
            return;
        }

        isPointerDownRef.current = false;

        const { x, y } = getPoint(e);
        const dx = x - startPos.current.x;
        const dy = y - startPos.current.y;

        setHoverDirection(null);

        if (lockRef.current || endScreen) return;

        let direction = null;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
            direction = dx > 0 ? "right" : "left";
        } else if (Math.abs(dy) > SWIPE_THRESHOLD) {
            direction = dy < 0 ? "up" : "down";
        }

        if (direction) {
            evaluateChoice(direction);
        }
    }

    // ------------------------------------------------------
    // 5. RESPUESTA
    // ------------------------------------------------------
    function evaluateChoice(dir) {
        if (lockRef.current || endScreen) return;

        const round = rounds[index];
        if (!round) return;

        const option = round.options.find((o) => o.dir === dir);
        if (!option) return;

        const isLast = index === rounds.length - 1;

        // Bloqueamos inmediatamente
        lockRef.current = true;
        setFeedback(option.msg);

        setCorrectCount((prevCorrect) => {
            const newCorrect = option.correct ? prevCorrect + 1 : prevCorrect;

            setTimeout(() => {
                setFeedback(null);

                if (isLast) {
                    finishGame(newCorrect);
                } else {
                    setIndex((prevIndex) => prevIndex + 1);
                    lockRef.current = false; // solo aquí se desbloquea para la siguiente ronda
                }
            }, 1300);

            return newCorrect;
        });
    }

    const round = rounds[index];

    // ------------------------------------------------------
    // 6. PANTALLA FINAL
    // ------------------------------------------------------
    if (endScreen) {
        return (
            <div className="final-loan-overlay">
                <div className={`final-box ${endScreen.type} minigame-container`}>
                    <div className="minigame-header">
                        <h2>Resultado final</h2>
                    </div>
                    <div className="minigame-content">
                        <p>{endScreen.msg}</p>
                        <p className="score">
                            Aciertos: {correctCount} / {rounds.length}
                        </p>

                        <div className="final-buttons">
                            {endScreen.type !== "success" && (
                                <button className="retry-btn" onClick={resetGame}>
                                    Reintentar
                                </button>
                            )}

                            <button
                                className="finish-btn"
                                onClick={() =>
                                    onFinish?.({
                                        score: correctCount,
                                        total: rounds.length,
                                        passed: endScreen.type === "success"
                                    })
                                }
                            >
                                Finalizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!round) return null;

    // ------------------------------------------------------
    // 7. UI DEL JUEGO
    // ------------------------------------------------------
    return (
        <div className="final-loan-overlay">
            <div className="loan-stage">
                <div className="side-card-layer">
                    {round.options.map((o) => (
                        <button
                            key={o.dir}
                            type="button"
                            className={`side-card side-${o.dir} ${hoverDirection === o.dir ? "highlight" : ""
                                }`}
                            onClick={() => evaluateChoice(o.dir)}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>

                <div
                    className="loan-card"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <div className="minigame-header">
                        <h2>
                            Ronda {index + 1} / {rounds.length}
                        </h2>
                    </div>

                    <div className="minigame-content minigame-scroll-area">
                        <h3>Situación</h3>
                        <p>{round.situation}</p>

                        <h3>Oferta del préstamo</h3>
                        <ul>
                            <li>
                                <strong>Monto:</strong> {round.offer.monto}
                            </li>
                            <li>
                                <strong>Tasa:</strong> {round.offer.tasa}
                            </li>
                            <li>
                                <strong>Plazo:</strong> {round.offer.plazo}
                            </li>
                            <li>
                                <strong>Cuota mensual:</strong> {round.offer.cuota}
                            </li>
                        </ul>

                        <p className="swipe-hint">Arrastra la carta o toca una opción</p>
                    </div>
                </div>

                {feedback && <div className="feedback-box">{feedback}</div>}
            </div>
        </div>
    );
}
