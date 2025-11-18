import React, { useState, useMemo } from "react";
import "./css/NeedsPriorityGame.css";

export default function NeedsPriorityGame({ visible, onComplete }) {
    if (!visible) return null;

    // ---------- 1. INGRESO MENSUAL -----------
    const income = useMemo(() => {
        return Math.floor(1200000 + Math.random() * 800000);
    }, []);

    // ---------- 2. ITEMS INICIALES -----------
    const initialItems = useMemo(
        () =>
            shuffle([
                { id: "alimentacion", label: "🥦 Alimentación", type: "essential" },
                { id: "vivienda", label: "🏠 Vivienda / Arriendo", type: "essential" },
                { id: "servicios", label: "💡 Servicios Públicos", type: "essential" },
                { id: "transporte", label: "🚍 Transporte", type: "essential" },
                { id: "salud", label: "👩‍⚕️ Salud", type: "essential" },

                { id: "ahorro", label: "💰 Ahorro / Fondo de emergencia", type: "important" },

                { id: "supermercado", label: "🛒 Supermercado extra", type: "variable" },
                { id: "comidas_fuera", label: "😋 Comidas fuera", type: "variable" },
                { id: "suscripciones", label: "🎮 Suscripciones", type: "variable" },
                { id: "ropa", label: "👕 Compras de ropa", type: "variable" },

                { id: "ocio", label: "🎉 Ocio / Salidas", type: "capricho" },
                { id: "celular", label: "📱 Nuevo celular", type: "capricho" },
                { id: "viaje", label: "✈ Viaje", type: "capricho" }
            ]),
        []
    );

    function shuffle(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    }

    const [items, setItems] = useState(initialItems);
    const [draggingItem, setDraggingItem] = useState(null);

    const [showResult, setShowResult] = useState(false);
    const [finalMessage, setFinalMessage] = useState("");
    const [canFinish, setCanFinish] = useState(false);
    const [answer, setAnswer] = useState(null);


    // ---------- ORDEN IDEAL -----------
    const correctOrder = ["essential", "important", "variable", "capricho"];

    const handleDragStart = (item) => {
        setDraggingItem(item);
    };

    const handleDrop = (target) => {
        if (!draggingItem) return;

        const newList = [...items];
        const fromIndex = newList.indexOf(draggingItem);
        const toIndex = newList.indexOf(target);

        newList.splice(fromIndex, 1);
        newList.splice(toIndex, 0, draggingItem);

        setItems(newList);
        setDraggingItem(null);
    };

    const evaluateOrder = () => {
        let mistakes = 0;

        for (let i = 0; i < items.length - 1; i++) {
            const currType = correctOrder.indexOf(items[i].type);
            const nextType = correctOrder.indexOf(items[i + 1].type);

            if (nextType < currType) mistakes++;
        }

        if (mistakes === 0) {
            setFinalMessage(
                "🎉 ¡Muy bien! Priorizaste tus gastos correctamente.\n" +
                "Primero lo esencial, luego el ahorro, después lo variable y al final los caprichos."
            );
        } else {
            setFinalMessage(
                "⚠ Cuidado. Algunas prioridades están desordenadas.\n" +
                "Asegúrate de priorizar lo esencial antes que los gustos."
            );
        }

        setShowResult(true);
    };

    // ----- ANIMACIÓN FLIP -----
    const animateFLIP = (item, prevRect) => {
        if (!item.ref) return;
        const newRect = item.ref.getBoundingClientRect();

        const invertY = prevRect.top - newRect.top;

        item.ref.animate(
            [
                { transform: `translateY(${invertY}px)` },
                { transform: "translateY(0)" }
            ],
            {
                duration: 160,
                easing: "ease-out"
            }
        );
    };

    const handleDragOver = (targetItem, targetEl) => {
        if (!draggingItem || draggingItem.id === targetItem.id) return;

        const prevRects = items.map((i) => ({
            id: i.id,
            rect: i.ref?.getBoundingClientRect()
        }));

        // reordenar
        setItems((prev) => {
            const newList = [...prev];

            const from = newList.indexOf(draggingItem);
            const to = newList.indexOf(targetItem);

            newList.splice(from, 1);
            newList.splice(to, 0, draggingItem);

            // ANIMAR
            requestAnimationFrame(() => {
                newList.forEach((item) => {
                    const prev = prevRects.find((p) => p.id === item.id);
                    if (prev) animateFLIP(item, prev.rect);
                });
            });

            return newList;
        });
    };

    return (
        <div className="needs-overlay">
            <div className="needs-window">

                <div className="needs-columns">

                    {/* COLUMNA 1 - INFO */}
                    <div className="col-info">
                        <h2> Arma tu Presupuesto</h2>

                        <p className="income">
                            Tu ingreso mensual es:
                            <strong> ${income.toLocaleString("es-CO")} </strong>
                        </p>

                        {!showResult && (
                            <p className="instructions">
                                Arrastra y suelta para ordenar tus prioridades financieras.
                                Cuando termines, haz clic en "Evaluar".
                            </p>
                        )}

                        {showResult && (
                            <p className="summary-label"> Análisis del presupuesto</p>
                        )}

                        {!showResult && (
                            <button className="needs-btn" onClick={evaluateOrder}>
                                Evaluar
                            </button>
                        )}

                        {/* RESULTADOS */}
                        {showResult && (
                            <>
                                <p className="instructions">
                                    ¿Te queda dinero disponible después de tus gastos esenciales?
                                </p>

                                <button
                                    className="needs-btn yes"
                                    onClick={() => {
                                        setAnswer("yes");
                                        setCanFinish(true);
                                    }}
                                >
                                    Sí
                                </button>

                                <button
                                    className="needs-btn no"
                                    onClick={() => {
                                        setAnswer("no");
                                        setCanFinish(true);
                                    }}
                                >
                                    No
                                </button>

                                {canFinish && (
                                    <button className="needs-btn finish" onClick={onComplete}>
                                        Terminar minijuego
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* COLUMNA 2 - LISTA */}
                    <div className="col-list">

                        {!showResult && (
                            <div className="list">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`item type-${item.type} ${draggingItem?.id === item.id ? "dragging" : ""
                                            }`}
                                        draggable
                                        onDragStart={() => handleDragStart(item)}
                                        onDragEnd={() => setDraggingItem(null)}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            handleDragOver(item, e.currentTarget);
                                        }}
                                        onDrop={() => handleDrop(item)}
                                        ref={(el) => (item.ref = el)}
                                    >
                                        {index + 1}. {item.label}
                                    </div>
                                ))}
                            </div>
                        )}

                        {showResult && (
                            <p className="result-message">{finalMessage}</p>
                        )}

                        {answer === "yes" && (
                            <p className="result-message">
                                ¡Genial! Si te sobra dinero después de tus gastos esenciales, puedes ahorrar una parte
                                cada mes o destinarlo a metas personales importantes.
                            </p>
                        )}

                        {answer === "no" && (
                            <p className="result-message">
                                No te preocupes. Revisa en qué puedes reducir gastos o busca alternativas más económicas.
                                A veces pequeños ajustes hacen una gran diferencia.
                            </p>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );

}
