import React, { useState, useRef } from "react";
import "./css/FinalLoanEvaluationGame.css";

export default function FinalLoanEvaluationGame({ visible, onFinish }) {
    // Si el índice está fuera de rango, evita el render mientras aparece la pantalla final
    if (!visible) return null;
    // ------------------------------------------------------
    // 🔹 1. TODAS LAS RONDAS (15 tarjetas)
    // ------------------------------------------------------
    const rounds = [
        // ------------------- 1 -------------------
        {
            situation: "Mi lavadora se dañó. Trabajo lavando ropa desde casa y la necesito para seguir generando ingresos.",
            offer: { monto: "$1.200.000", tasa: "24% anual", plazo: "12 meses", cuota: "$132.000" },
            options: [
                { dir: "right", label: "Tomar préstamo (necesidad productiva)", correct: true, msg: "Correcto. Es una herramienta de trabajo." },
                { dir: "left", label: "No tomarlo", correct: false, msg: "Sin lavadora no puedes trabajar." },
                { dir: "up", label: "Plazo más corto", correct: true, msg: "Menos intereses, buena decisión." },
                { dir: "down", label: "Buscar tasa más baja", correct: true, msg: "Siempre compara tasas." }
            ]
        },

        // ------------------- 2 -------------------
        {
            situation: "Quiero cambiar mi celular por uno más nuevo. El mío funciona bien.",
            offer: { monto: "$3.200.000", tasa: "32% anual", plazo: "24 meses", cuota: "$196.000" },
            options: [
                { dir: "right", label: "Tomarlo", correct: false, msg: "No es recomendable endeudarse por deseos." },
                { dir: "left", label: "No tomarlo", correct: true, msg: "Correcto. Es un deseo con tasa alta." },
                { dir: "up", label: "Es compra pequeña", correct: false, msg: "Pequeña no significa buena." },
                { dir: "down", label: "Ahorrar y comprarlo", correct: true, msg: "Financieramente ideal." }
            ]
        },

        // ------------------- 3 -------------------
        {
            situation: "Quiero estudiar un curso técnico que aumentará mis ingresos.",
            offer: { monto: "$2.500.000", tasa: "12% anual", plazo: "18 meses", cuota: "$154.000" },
            options: [
                { dir: "right", label: "Tomarlo para estudiar", correct: true, msg: "La educación es una inversión." },
                { dir: "left", label: "No tomarlo", correct: false, msg: "Es una inversión útil." },
                { dir: "up", label: "Pedir solo lo necesario", correct: true, msg: "Excelente manejo de deuda." },
                { dir: "down", label: "Plazo de 5 años", correct: false, msg: "Excesivo, genera intereses altos." }
            ]
        },

        // ------------------- 4 -------------------
        {
            situation: "Quiero comprar una moto para trabajar en domicilios.",
            offer: { monto: "$6.000.000", tasa: "20% anual", plazo: "36 meses", cuota: "$223.000" },
            options: [
                { dir: "right", label: "Tomarlo para trabajar", correct: true, msg: "Aumenta tus ingresos." },
                { dir: "left", label: "Es un deseo", correct: false, msg: "Es una herramienta laboral." },
                { dir: "up", label: "Buscar tasa más baja", correct: true, msg: "Créditos de vehículo son mejores." },
                { dir: "down", label: "Plazo de 60 meses", correct: false, msg: "Plazo excesivo = más intereses." }
            ]
        },

        // ------------------- 5 -------------------
        {
            situation: "Quiero ir a la playa con mis amigos. No tengo ahorros.",
            offer: { monto: "$1.800.000", tasa: "30% anual", plazo: "18 meses", cuota: "$138.000" },
            options: [
                { dir: "right", label: "Tomarlo para viajar", correct: false, msg: "Nunca por deseos con tasa alta." },
                { dir: "left", label: "Se paga fácil", correct: false, msg: "Intereses muy altos." },
                { dir: "up", label: "No tomarlo", correct: true, msg: "Es un deseo con tasa alta." },
                { dir: "down", label: "Ahorrar y viajar luego", correct: true, msg: "La mejor opción." }
            ]
        },

        // ------------------- 6 -------------------
        {
            situation: "Mi nevera falló. Sin ella pierdo comida y gasto más comprando afuera.",
            offer: { monto: "$1.900.000", tasa: "26% anual", plazo: "12 meses", cuota: "$171.000" },
            options: [
                { dir: "right", label: "Tomarlo", correct: true, msg: "Es una necesidad básica." },
                { dir: "left", label: "No tomarlo", correct: false, msg: "Terminarás gastando más." },
                { dir: "up", label: "Pedir solo lo necesario", correct: true, msg: "Menos deuda = mejor." },
                { dir: "down", label: "Plazo de 36 meses", correct: false, msg: "Pagarías demás en intereses." }
            ]
        },

        // ------------------- 7 -------------------
        {
            situation: "Necesito un computador para estudiar diseño y trabajar freelance.",
            offer: { monto: "$4.500.000", tasa: "22% anual", plazo: "24 meses", cuota: "$260.000" },
            options: [
                { dir: "right", label: "Tomarlo", correct: true, msg: "Herramienta productiva." },
                { dir: "left", label: "No tomarlo", correct: false, msg: "Reduce tus oportunidades laborales." },
                { dir: "up", label: "Buscar tasa mejor", correct: true, msg: "Siempre compara antes." },
                { dir: "down", label: "Plazo máximo", correct: false, msg: "Plazo largo = más intereses." }
            ]
        },

        // ------------------- 8 -------------------
        {
            situation: "Mi familia necesita pagar un tratamiento médico urgente.",
            offer: { monto: "$3.700.000", tasa: "18% anual", plazo: "24 meses", cuota: "$220.000" },
            options: [
                { dir: "right", label: "Tomarlo inmediatamente", correct: true, msg: "Es una urgencia médica." },
                { dir: "left", label: "Esperar a ahorrar", correct: false, msg: "No puedes esperar para salud." },
                { dir: "up", label: "Buscar tasa más baja", correct: true, msg: "Vale la pena comparar." },
                { dir: "down", label: "Pedir más por si acaso", correct: false, msg: "Nunca pidas más de lo necesario." }
            ]
        },

        // ------------------- 9 -------------------
        {
            situation: "Vi una promoción: crédito 'cero intereses' pero con cuota de manejo alta.",
            offer: { monto: "$2.000.000", tasa: "0% (pero con cargos)", plazo: "12 meses", cuota: "$210.000" },
            options: [
                { dir: "right", label: "Tomarlo", correct: false, msg: "Cero intereses NO significa barato." },
                { dir: "left", label: "Analizar costos ocultos", correct: true, msg: "¡Bien! Mira el costo total." },
                { dir: "up", label: "Buscar alternativas", correct: true, msg: "Siempre compara." },
                { dir: "down", label: "No importa la cuota de manejo", correct: false, msg: "Sí importa. Mucho." }
            ]
        },

        // ------------------- 10 -------------------
        {
            situation: "El banco ofrece refinanciar mi deuda actual pero aumentando el plazo.",
            offer: { monto: "$5.000.000", tasa: "15% anual", plazo: "48 meses", cuota: "$165.000" },
            options: [
                { dir: "right", label: "Aceptar refinanciación", correct: false, msg: "Pagarás más intereses a largo plazo." },
                { dir: "left", label: "Negociar mejor oferta", correct: true, msg: "Correcto. Puedes mejorar tasa o plazo." },
                { dir: "up", label: "Mantener plazo actual", correct: true, msg: "Evita que aumenten intereses." },
                { dir: "down", label: "Pedir más dinero", correct: false, msg: "Nunca aumentes deuda sin necesidad." }
            ]
        },

        // ------------------- 11 -------------------
        {
            situation: "Me ofrecen una tarjeta de crédito con interés bajo pero sin tope de compras.",
            offer: { monto: "$Cupos variables", tasa: "18% anual + cargos", plazo: "Indefinido", cuota: "Depende del uso" },
            options: [
                { dir: "right", label: "Tomarla y usarla sin control", correct: false, msg: "Gran riesgo de endeudamiento." },
                { dir: "left", label: "Tomarla pero usarla responsablemente", correct: true, msg: "Crédito útil si se maneja bien." },
                { dir: "up", label: "Comparar otras tarjetas", correct: true, msg: "Siempre busca la mejor opción." },
                { dir: "down", label: "Rechazarla automáticamente", correct: false, msg: "Puede ser útil si se usa bien." }
            ]
        },

        // ------------------- 12 -------------------
        {
            situation: "Me ofrecen un crédito para remodelar, pero realmente quiero cambiar mi televisor.",
            offer: { monto: "$4.000.000", tasa: "26%", plazo: "36 meses", cuota: "$189.000" },
            options: [
                { dir: "right", label: "Tomarlo para el televisor", correct: false, msg: "Créditos grandes no son para caprichos." },
                { dir: "left", label: "No tomarlo", correct: true, msg: "Correcto. No es una necesidad." },
                { dir: "up", label: "Ahorrar", correct: true, msg: "Buena decisión." },
                { dir: "down", label: "Plazo más largo", correct: false, msg: "Más intereses por un gusto innecesario." }
            ]
        },

        // ------------------- 13 -------------------
        {
            situation: "Mi negocio necesita capital para comprar inventario y crecer.",
            offer: { monto: "$8.000.000", tasa: "14%", plazo: "24 meses", cuota: "$380.000" },
            options: [
                { dir: "right", label: "Tomarlo para invertir", correct: true, msg: "Es un préstamo productivo." },
                { dir: "left", label: "No tomarlo", correct: false, msg: "Limitaría el crecimiento del negocio." },
                { dir: "up", label: "Buscar tasa más baja", correct: true, msg: "Un préstamo empresarial puede mejorar." },
                { dir: "down", label: "Pedir más dinero del necesario", correct: false, msg: "Nunca pidas más de lo que necesitas." }
            ]
        },

        // ------------------- 14 -------------------
        {
            situation: "Mi crédito actual tiene tasa del 32%. Otro banco me ofrece 18%.",
            offer: { monto: "Cambio de entidad", tasa: "18%", plazo: "20 meses", cuota: "Variable" },
            options: [
                { dir: "right", label: "Aceptar la nueva tasa", correct: true, msg: "Correcto. Reduces intereses." },
                { dir: "left", label: "Quedarme por pereza", correct: false, msg: "Pagarías de más." },
                { dir: "up", label: "Negociar aún mejor", correct: true, msg: "A veces se puede mejorar más." },
                { dir: "down", label: "Mantener la tasa del 32%", correct: false, msg: "Estás perdiendo dinero." }
            ]
        },

        // ------------------- 15 (más difícil) -------------------
        {
            situation: "Me ofrecen un préstamo inmediato: 'Aprobación en 5 minutos'. Tasa no especificada claramente.",
            offer: { monto: "$3.000.000", tasa: "???", plazo: "12 meses", cuota: "Desconocida" },
            options: [
                { dir: "right", label: "Tomarlo ya mismo", correct: false, msg: "Nunca aceptes préstamos sin tasa clara." },
                { dir: "left", label: "Exigir tasa y costo total", correct: true, msg: "Correcto. Es tu derecho." },
                { dir: "up", label: "Comparar con otras entidades", correct: true, msg: "Perfecto. Evita estafas." },
                { dir: "down", label: "No importa la tasa", correct: false, msg: "¡Importa muchísimo!" }
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

    const startPos = useRef({ x: 0, y: 0 });

    if (endScreen) {
        return (
            <div className="final-loan-overlay">
                <div className={`final-box ${endScreen.type}`}>
                    <h2>Resultado final</h2>
                    <p>{endScreen.msg}</p>
                    <p className="score">Aciertos: {correctCount} / {rounds.length}</p>

                    <div className="final-buttons">
                        {endScreen.type !== "success" && (
                            <button className="retry-btn" onClick={resetGame}>
                                Reintentar
                            </button>
                        )}

                        <button
                            className="finish-btn"
                            onClick={() => onFinish({
                                score: correctCount,
                                total: rounds.length,
                                passed: endScreen.type === "success"
                            })}
                        >
                            Finalizar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------
    // 3. SWIPE (drag)
    // ------------------------------------------------------
    function onDragStart(e) {
        startPos.current = { x: e.clientX, y: e.clientY };
        setHoverDirection(null);
    }

    function onDragEnd(e) {
        setHoverDirection(null); // limpiar highlight

        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;

        let direction = null;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
            direction = dx > 0 ? "right" : "left";
        } else if (Math.abs(dy) > 60) {
            direction = dy < 0 ? "up" : "down";
        }

        if (direction) evaluateChoice(direction);
    }

    function resetGame() {
        setIndex(0);
        setCorrectCount(0);
        setFeedback(null);
        setEndScreen(null);
        setHoverDirection(null);
        startPos.current = { x: 0, y: 0 };
    }


    function onDrag(e) {
        if (!startPos.current.x) return;

        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 40) setHoverDirection("right");
            else if (dx < -40) setHoverDirection("left");
        } else {
            if (dy < -40) setHoverDirection("up");
            else if (dy > 40) setHoverDirection("down");
        }
    }


    // ------------------------------------------------------
    // 4. RESPUESTA
    // ------------------------------------------------------
    function evaluateChoice(dir) {
        const round = rounds[index];
        const option = round.options.find(o => o.dir === dir);

        setFeedback(option.msg);
        if (option.correct) setCorrectCount(c => c + 1);

        setTimeout(() => {
            setFeedback(null);

            if (index === rounds.length - 1) finishGame();
            else setIndex(i => i + 1);

        }, 1300);
    }

    // ------------------------------------------------------
    // 5. FINAL
    // ------------------------------------------------------
    function finishGame() {
        let type = "";
        let msg = "";

        if (correctCount >= Math.floor(rounds.length * 0.75)) {
            type = "success";
            msg = "🎉 ¡Excelente! Manejas muy bien los conceptos.";
        } else if (correctCount >= Math.floor(rounds.length * 0.5)) {
            type = "medium";
            msg = "⚠ Buen intento, pero puedes mejorar.";
        } else {
            type = "fail";
            msg = "❌ Te recomendamos repetir el juego antes de continuar.";
        }

        setEndScreen({ type, msg });
    }

    const round = rounds[index];


    if (!round && !endScreen) {
        finishGame();  // forzamos mostrar la pantalla final
        return null;   // evitamos que React siga renderizando
    }



    // ------------------------------------------------------
    // 6. UI
    // ------------------------------------------------------
    return (
        <div className="final-loan-overlay">

            {/* Tarjetas laterales */}
            {round.options.map(o => (
                <div
                    key={o.dir}
                    className={`side-card side-${o.dir} ${hoverDirection === o.dir ? "highlight" : ""}`}
                >
                    {o.label}
                </div>
            ))}

            {/* Tarjeta principal */}
            <div
                className="loan-card"
                draggable
                onDragStart={onDragStart}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
            >

                <h2>Ronda {index + 1} / {rounds.length}</h2>

                <h3>Situación</h3>
                <p>{round.situation}</p>

                <h3>Oferta del préstamo</h3>
                <ul>
                    <li><strong>Monto:</strong> {round.offer.monto}</li>
                    <li><strong>Tasa:</strong> {round.offer.tasa}</li>
                    <li><strong>Plazo:</strong> {round.offer.plazo}</li>
                    <li><strong>Cuota mensual:</strong> {round.offer.cuota}</li>
                </ul>

                <p className="swipe-hint">Arrastra esta carta hacia una opción</p>
            </div>

            {feedback && <div className="feedback-box">{feedback}</div>}

            {endScreen && (
                <div className="final-screen">
                    <div className={`final-box ${endScreen.type}`}>
                        <h2>Resultado final</h2>
                        <p>{endScreen.msg}</p>
                        <p className="score">Aciertos: {correctCount} / {rounds.length}</p>

                        <div className="final-buttons">

                            {endScreen.type !== "success" && (
                                <button className="retry-btn" onClick={resetGame}>
                                    Reintentar
                                </button>

                            )}

                            <button
                                className="finish-btn"
                                onClick={() => onFinish({
                                    score: correctCount,
                                    total: rounds.length,
                                    passed: endScreen.type === "success"
                                })}
                            >
                                Finalizar
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
