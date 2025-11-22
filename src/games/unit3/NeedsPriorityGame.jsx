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
                { id: "rcorriente", label: "📊 Razón Corriente", type: "essential" },
                { id: "pacida", label: "💧 Prueba Ácida", type: "essential" },
                { id: "capital_trabajo", label: "⚙ Capital de Trabajo", type: "essential" },
                { id: "flujo_oper", label: "💵 Flujo Operacional", type: "essential" },
                { id: "caja_disponible", label: "🧾 Caja y Bancos", type: "essential" },

                { id: "cobertura_interes", label: "📉 Cobertura de Intereses", type: "important" },

                { id: "rotacion_inventario", label: "📦 Rotación de Inventarios", type: "variable" },
                { id: "rotacion_cartera", label: "📬 Rotación de Cartera", type: "variable" },
                { id: "ciclo_efectivo", label: "🔄 Ciclo de Conversión de Efectivo", type: "variable" },
                { id: "periodo_prom_pago", label: "📅 Periodo Promedio de Pago", type: "variable" },

                { id: "roe", label: "📈 ROE – Rentabilidad del Patrimonio", type: "capricho" },
                { id: "roa", label: "📉 ROA – Rentabilidad del Activo", type: "capricho" },
                { id: "margen_neto", label: "💼 Margen Neto", type: "capricho" }
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
                "🎉 ¡Excelente! Ordenaste correctamente los indicadores de liquidez.\n" +
                "Primero los indicadores críticos, luego los de solvencia, después los operativos " +
                "y por último los de rentabilidad, que no influyen directamente en la liquidez inmediata."
            );
        } else {
            setFinalMessage(
                "⚠ Atención. Algunos indicadores están mal priorizados.\n" +
                "Recuerda: para evaluar liquidez, primero van razón corriente, prueba ácida, capital de trabajo " +
                "y caja disponible."
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
                        <h2>Análisis de Liquidez — Ordena los Indicadores</h2>

                        <p className="income">
                            La empresa presenta ingresos por:
                            <strong> ${income.toLocaleString("es-CO")} </strong>
                        </p>

                        <p className="instructions">
                            Ordena los indicadores según su prioridad para evaluar la liquidez y capacidad de pago
                            de una empresa.
                            Cuando termines, haz clic en "Evaluar".
                        </p>


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
                                ¡Muy bien! Si después de evaluar la liquidez la empresa tiene excedentes, puede destinarlos a
                                inversión, expansión o fortalecer reservas estratégicas.
                            </p>
                        )}

                        {answer === "no" && (
                            <p className="result-message">
                                La empresa podría enfrentar problemas de solvencia. Es recomendable revisar los pasivos a corto
                                plazo, buscar financiamiento o mejorar la recuperación de cartera.
                            </p>
                        )}


                    </div>
                </div>
            </div>
        </div>
    );

}
