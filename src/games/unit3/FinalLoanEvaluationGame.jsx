import React, { useState, useRef, useEffect } from "react";
import "./css/FinalLoanEvaluationGame.css"; // lo harás tú

export default function FinalLoanEvaluationGame({ visible, onComplete }) {
    if (!visible) return null;

    // ------------------------------------------------------
    // 1. RONDAS (LOS 5 ESCENARIOS)
    // ------------------------------------------------------
    const rounds = [
        {
            situation: "Mi lavadora se dañó. Trabajo lavando ropa desde casa y la necesito para seguir generando ingresos.",
            offer: {
                monto: "$1.200.000",
                tasa: "24% anual",
                plazo: "12 meses",
                cuota: "$132.000"
            },
            options: [
                { dir: "right", label: "✔ Tomar el préstamo (necesidad productiva)", correct: true, msg: "Excelente. Es un préstamo productivo." },
                { dir: "left", label: "❌ No tomarlo, mejor esperar", correct: false, msg: "Cuidado. Sin lavadora no puedes trabajar." },
                { dir: "up", label: "✔ Tomarlo pero a plazo más corto", correct: true, msg: "Correcto. Plazos más cortos = menos intereses." },
                { dir: "down", label: "✔ Buscar una tasa más baja", correct: true, msg: "Muy bien. Siempre compara tasas." }
            ]
        },

        {
            situation: "Quiero cambiar mi celular por uno más nuevo. El mío funciona bien.",
            offer: {
                monto: "$3.200.000",
                tasa: "32% anual",
                plazo: "24 meses",
                cuota: "$196.000"
            },
            options: [
                { dir: "right", label: "❌ Tomar el préstamo", correct: false, msg: "No es recomendable endeudarse por deseos." },
                { dir: "left", label: "✔ No tomarlo, es un deseo", correct: true, msg: "Bien. Es un deseo y la tasa es alta." },
                { dir: "up", label: "❌ Es solo una compra pequeña", correct: false, msg: "Peor aún: la tasa es altísima." },
                { dir: "down", label: "✔ Ahorrar y comprarlo después", correct: true, msg: "Excelente. Ahorra antes de endeudarte." }
            ]
        },

        {
            situation: "Quiero estudiar un curso técnico que aumentará mis ingresos.",
            offer: {
                monto: "$2.500.000",
                tasa: "12% anual",
                plazo: "18 meses",
                cuota: "$154.000"
            },
            options: [
                { dir: "right", label: "✔ Tomarlo (inversión en futuro)", correct: true, msg: "Muy bien. La educación es una deuda saludable." },
                { dir: "left", label: "❌ No tomarlo porque 'es una deuda'", correct: false, msg: "Algunas deudas son útiles." },
                { dir: "up", label: "✔ Tomarlo pero pedir solo lo necesario", correct: true, msg: "Perfecto. Pide solo lo necesario." },
                { dir: "down", label: "❌ Tomarlo a 5 años", correct: false, msg: "Plazos largos generan intereses innecesarios." }
            ]
        },

        {
            situation: "Quiero comprar una moto para trabajar en domicilios.",
            offer: {
                monto: "$6.000.000",
                tasa: "20% anual",
                plazo: "36 meses",
                cuota: "$223.000"
            },
            options: [
                { dir: "right", label: "✔ Tomarlo (herramienta de trabajo)", correct: true, msg: "Correcto. Aumentará tus ingresos." },
                { dir: "left", label: "❌ No tomarlo (es un deseo)", correct: false, msg: "No es un deseo, es trabajo." },
                { dir: "up", label: "✔ Buscar tasa más baja o crédito de vehículo", correct: true, msg: "Perfecto. Crédito de vehículo es mejor." },
                { dir: "down", label: "❌ Tomarlo a 60 meses", correct: false, msg: "Plazo largo = más intereses." }
            ]
        },

        {
            situation: "Quiero ir a la playa con mis amigos. No tengo ahorros.",
            offer: {
                monto: "$1.800.000",
                tasa: "30% anual",
                plazo: "18 meses",
                cuota: "$138.000"
            },
            options: [
                { dir: "right", label: "❌ Tomarlo para no perder el viaje", correct: false, msg: "Nunca te endeudes para viajar." },
                { dir: "left", label: "❌ Tomarlo porque se paga fácil", correct: false, msg: "Interés del 30% es muy alto." },
                { dir: "up", label: "✔ No tomarlo (deseo + tasa alta)", correct: true, msg: "Muy bien. Es un deseo con intereses altos." },
                { dir: "down", label: "✔ Ahorrar y viajar después", correct: true, msg: "Excelente decisión financiera." }
            ]
        }
    ];

    // ------------------------------------------------------
    // 2. ESTADOS DEL JUEGO
    // ------------------------------------------------------
    const [index, setIndex] = useState(0);
    const [showFeedback, setShowFeedback] = useState(null); // texto del feedback
    const [correctCount, setCorrectCount] = useState(0);

    const cardRef = useRef(null);

    // ------------------------------------------------------
    // 3. GESTO DE ARRASTRE (Swipe estilo Tinder)
    // ------------------------------------------------------
    const startPos = useRef({ x: 0, y: 0 });

    function onDragStart(e) {
        startPos.current = { x: e.clientX, y: e.clientY };
    }

    function onDragEnd(e) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;

        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        let direction = null;

        if (absX > absY && absX > 70) {
            direction = dx > 0 ? "right" : "left";
        } else if (absY > absX && absY > 70) {
            direction = dy < 0 ? "up" : "down";
        }

        if (!direction) return;

        evaluateChoice(direction);
    }

    // ------------------------------------------------------
    // 4. PROCESAR RESPUESTA
    // ------------------------------------------------------
    function evaluateChoice(direction) {
        const round = rounds[index];
        const option = round.options.find(o => o.dir === direction);

        if (!option) return;

        setShowFeedback(option.msg);

        if (option.correct) setCorrectCount(c => c + 1);

        setTimeout(() => {
            setShowFeedback(null);
            if (index === rounds.length - 1) {
                finishGame();
            } else {
                setIndex(i => i + 1);
            }
        }, 1500);
    }

    // ------------------------------------------------------
    // 5. FINAL DEL JUEGO
    // ------------------------------------------------------
    function finishGame() {
        let msg = "";
        if (correctCount >= 8) {
            msg = "🎉 ¡Excelente! Comprendes muy bien cuándo pedir un préstamo.";
        } else if (correctCount >= 5) {
            msg = "⚠ Buen intento. Repasa intereses, necesidades y préstamos.";
        } else {
            msg = "❌ Aún no dominas los conceptos. Repite los minijuegos previos.";
        }

        onComplete({ score: correctCount, message: msg });
    }

    // ------------------------------------------------------
    // 6. UI DEL JUEGO
    // ------------------------------------------------------
    const round = rounds[index];

    return (
        <div className="final-loan-overlay">
            <div
                className="loan-card"
                draggable
                ref={cardRef}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <h2>Ronda {index + 1} / 5</h2>

                <h3>Situación</h3>
                <p>{round.situation}</p>

                <h3>Oferta del préstamo</h3>
                <ul>
                    <li><strong>Monto:</strong> {round.offer.monto}</li>
                    <li><strong>Tasa:</strong> {round.offer.tasa}</li>
                    <li><strong>Plazo:</strong> {round.offer.plazo}</li>
                    <li><strong>Cuota mensual:</strong> {round.offer.cuota}</li>
                </ul>

                <p className="swipe-hint">Arrastra la carta:</p>
                <div className="dirs">
                    <span>↑ Opción 3</span>
                    <span>↓ Opción 4</span>
                    <span>← Opción 2</span>
                    <span>→ Opción 1</span>
                </div>
            </div>

            {showFeedback && (
                <div className="feedback-box">
                    {showFeedback}
                </div>
            )}
        </div>
    );
}
