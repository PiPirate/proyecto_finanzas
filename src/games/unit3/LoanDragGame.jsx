import React, { useState } from "react";
import "./css/LoanDragGame.css";

export default function LoanDragGame({ visible, onComplete }) {
    if (!visible) return null;

    const modules = [
        {
            description: "Relaciona cada indicador financiero con su definición técnica.",
            zones: [
                { zone: "zone_liquidez", label: "¿Qué evalúa la liquidez?" },
                { zone: "zone_rentabilidad", label: "¿Qué mide la rentabilidad?" },
                { zone: "zone_endeudamiento", label: "¿Qué muestra el nivel de endeudamiento?" },
                { zone: "zone_eficiencia", label: "¿Qué mide la eficiencia operativa?" }
            ],
            items: [
                { id: "liquidez", label: "La capacidad de la empresa para cumplir obligaciones a corto plazo", hint: "Relación entre activos corrientes y pasivos corrientes." },
                { id: "rentabilidad", label: "El rendimiento generado sobre la inversión o el patrimonio", hint: "ROA, ROE, margen neto…" },
                { id: "endeudamiento", label: "La proporción de recursos financiados por terceros", hint: "Deuda total vs patrimonio." },
                { id: "eficiencia", label: "El uso óptimo de recursos para generar ingresos", hint: "Rotación de inventarios, activos, cartera." }
            ]
        },
        {
            description: "Relaciona cada componente con su función dentro del análisis financiero.",
            zones: [
                { zone: "zone_liquidez", label: "Elemento que determina si la empresa puede operar sin falta de efectivo" },
                { zone: "zone_rentabilidad", label: "Elemento clave para evaluar el desempeño financiero" },
                { zone: "zone_endeudamiento", label: "Indicador que refleja el riesgo financiero" },
                { zone: "zone_eficiencia", label: "Indicador que muestra qué tan bien la empresa gestiona sus recursos" }
            ],
            items: [
                { id: "liquidez", label: "Razón corriente y prueba ácida", hint: "Miden disponibilidad inmediata de recursos." },
                { id: "rentabilidad", label: "Margen neto y retorno sobre activos", hint: "Evalúan utilidad en relación a ingresos y activos." },
                { id: "endeudamiento", label: "Índice de apalancamiento financiero", hint: "Mientras más alto, mayor riesgo." },
                { id: "eficiencia", label: "Rotaciones y ciclos operativos", hint: "Evalúan velocidad de conversión de recursos." }
            ]
        },
        {
            description: "Cada decisión afecta los indicadores. Relaciónala con su impacto.",
            zones: [
                { zone: "zone_liquidez", label: "¿Qué pasa si la empresa acumula inventarios?" },
                { zone: "zone_rentabilidad", label: "¿Qué ocurre si bajan los márgenes?" },
                { zone: "zone_endeudamiento", label: "¿Qué pasa si aumenta la deuda de corto plazo?" },
                { zone: "zone_eficiencia", label: "¿Qué ocurre si se optimizan los procesos productivos?" }
            ],
            items: [
                { id: "liquidez", label: "Se reduce la liquidez debido a más capital inmovilizado", hint: "Inventario = dinero detenido." },
                { id: "rentabilidad", label: "Disminuye la rentabilidad debido a menores utilidades", hint: "Menos margen = menos retorno." },
                { id: "endeudamiento", label: "Aumenta el riesgo financiero y la presión de pago", hint: "Más deuda = mayor apalancamiento." },
                { id: "eficiencia", label: "Mejora la eficiencia y aumenta la rotación de activos", hint: "Producción más ágil = más ingresos." }
            ]
        },
        {
            description: "Identifica el error según el mal uso de los indicadores.",
            zones: [
                { zone: "zone_liquidez", label: "Error al interpretar recursos disponibles" },
                { zone: "zone_rentabilidad", label: "Error en evaluación del desempeño" },
                { zone: "zone_endeudamiento", label: "Error que oculta riesgo financiero real" },
                { zone: "zone_eficiencia", label: "Error relacionado con el uso de recursos" }
            ],
            items: [
                { id: "liquidez", label: "Confiar solo en el efectivo y no evaluar activos corrientes", hint: "Liquidez ≠ caja." },
                { id: "rentabilidad", label: "Analizar solo ingresos sin considerar costos", hint: "El margen es clave." },
                { id: "endeudamiento", label: "Ignorar comisiones, intereses y plazos", hint: "No toda deuda pesa igual." },
                { id: "eficiencia", label: "No medir rotaciones ni tiempos de ciclo", hint: "Sin métricas no hay eficiencia." }
            ]
        },
        {
            description: "Relaciona cada buena práctica con su aplicación ideal.",
            zones: [
                { zone: "zone_liquidez", label: "Para evaluar solvencia a corto plazo…" },
                { zone: "zone_rentabilidad", label: "Para medir creación de valor económico…" },
                { zone: "zone_endeudamiento", label: "Para controlar riesgo financiero…" },
                { zone: "zone_eficiencia", label: "Para optimizar procesos operativos…" }
            ],
            items: [
                { id: "liquidez", label: "Revisar activos corrientes frente a obligaciones inmediatas", hint: "Solvencia instantánea." },
                { id: "rentabilidad", label: "Comparar utilidades con inversión y patrimonio", hint: "ROE, ROA, ROI." },
                { id: "endeudamiento", label: "Monitorear el apalancamiento y costos de la deuda", hint: "Equilibrar deuda y capital propio." },
                { id: "eficiencia", label: "Analizar rotaciones y ciclos operativos", hint: "Eficiencia = velocidad + control." }
            ]
        },
        {
            description: "Relaciona el tipo de análisis con su impacto financiero.",
            zones: [
                { zone: "zone_liquidez", label: "Análisis que determina estabilidad a corto plazo" },
                { zone: "zone_rentabilidad", label: "Análisis clave para evaluar valor económico generado" },
                { zone: "zone_endeudamiento", label: "Análisis utilizado para medir riesgos financieros" },
                { zone: "zone_eficiencia", label: "Análisis orientado a la gestión interna" }
            ],
            items: [
                { id: "liquidez", label: "Análisis de liquidez y solvencia inmediata", hint: "Razón corriente, prueba ácida." },
                { id: "rentabilidad", label: "Análisis de rendimiento financiero", hint: "Margen neto, ROA, ROE." },
                { id: "endeudamiento", label: "Análisis de estructura de capital y apalancamiento", hint: "Deuda/patrimonio." },
                { id: "eficiencia", label: "Análisis de productividad y rotaciones", hint: "Rotación de activos, inventarios." }
            ]
        },
        {
            description: "Relaciona cada situación empresarial con el análisis adecuado.",
            zones: [
                { zone: "zone_liquidez", label: "La empresa enfrenta presión de flujo de caja" },
                { zone: "zone_rentabilidad", label: "La empresa quiere evaluar su desempeño económico" },
                { zone: "zone_endeudamiento", label: "La empresa considera financiarse con deuda" },
                { zone: "zone_eficiencia", label: "La empresa busca mejorar su productividad" }
            ],
            items: [
                { id: "liquidez", label: "Aplicar análisis de liquidez para garantizar operación inmediata", hint: "Caja, razón corriente." },
                { id: "rentabilidad", label: "Revisar indicadores de retorno y márgenes", hint: "ROE, margen neto." },
                { id: "endeudamiento", label: "Evaluar apalancamiento antes de asumir obligaciones", hint: "Deuda óptima vs riesgo." },
                { id: "eficiencia", label: "Implementar análisis de procesos y rotaciones", hint: "Ciclos operativos." }
            ]
        }
    ];

    const correctMap = {
        liquidez: "zone_liquidez",
        rentabilidad: "zone_rentabilidad",
        endeudamiento: "zone_endeudamiento",
        eficiencia: "zone_eficiencia",
    };

    const [currentModule, setCurrentModule] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const [showEnding, setShowEnding] = useState(false);

    const [hint, setHint] = useState("");
    const [feedback, setFeedback] = useState("");
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [shuffledItems, setShuffledItems] = useState([]);
    const [moduleCompleted, setModuleCompleted] = useState(false);

    function shuffle(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    const resetModuleState = (moduleIndex) => {
        const module = modules[moduleIndex];
        setCurrentQuestion(0);
        setHint("");
        setFeedback("");
        setSelectedAnswer(null);
        setModuleCompleted(false);
        setShuffledItems(shuffle(module.items));
    };

    const handleAnswer = (itemId) => {
        if (moduleCompleted) return;

        const module = modules[currentModule];
        const zone = module.zones[currentQuestion];
        const zoneId = zone.zone;

        const item = module.items.find((i) => i.id === itemId);
        const hintText = item?.hint ?? "";

        setSelectedAnswer(itemId);

        const correct = correctMap[itemId] === zoneId;

        if (correct) {
            setFeedback(`✔ ¡Muy bien! ${hintText}`);
            setHint("");

            setTimeout(() => {
                const isLastQuestion = currentQuestion === module.zones.length - 1;

                if (isLastQuestion) {
                    setModuleCompleted(true);
                    setFeedback("🎉 ¡Completaste todas las asociaciones correctamente en este módulo!");
                } else {
                    // Nota: Idealmente, aquí se debería eliminar el item correcto de la lista shuffledItems
                    setCurrentQuestion((prev) => prev + 1);
                    setSelectedAnswer(null);
                    setFeedback("");
                    setHint("");
                }
            }, 600);
        } else {
            setFeedback(`🤔 No corresponde aquí.\n💡 Pista: ${hintText}`);
            setHint(hintText);
        }
    };

    const nextModule = () => {
        if (currentModule < modules.length - 1) {
            const nextIndex = currentModule + 1;
            setCurrentModule(nextIndex);
            resetModuleState(nextIndex);
        } else {
            setShowEnding(true);
        }
    };

    if (showIntro) {
        return (
            <div className="loan-game-overlay">
                <div className="loan-game-window intro minigame-container">
                    <h2>Aprende sobre análisis financieros</h2>
                    <p>No necesitas saber nada. Aquí aprenderás paso a paso, seleccionando la respuesta correcta para cada situación.</p>
                    <button className="loan-finish-btn" onClick={() => {
                        setShowIntro(false);
                        resetModuleState(0);
                    }}>
                        Comenzar
                    </button>
                </div>
            </div>
        );
    }

    if (showEnding) {
        return (
            <div className="loan-game-overlay">
                <div className="loan-game-window intro minigame-container">
                    <h2> ¡Muy bien!</h2>
                    <p>Ahora tienes una comprensión completa y práctica sobre cómo funciona el análisis financiero.</p>
                    <button className="loan-finish-btn" onClick={onComplete}>Finalizar</button>
                </div>
            </div>
        );
    }

    const module = modules[currentModule];
    const zone = module.zones[currentQuestion];
    const totalQuestions = module.zones.length;

    return (
        <div className="loan-game-overlay">
            <div className="loan-game-window minigame-container">

                <p className="loan-progress">
                    Módulo {currentModule + 1} de {modules.length} · Pregunta {currentQuestion + 1} de {totalQuestions}
                </p>
                <h2 className="module-title">{module.title}</h2>
                <p className="module-desc">{module.description}</p>

                {hint && <div className="loan-hint-box">💡 {hint}</div>}
                {feedback && <div className="loan-feedback-box">{feedback}</div>}

                <div className="loan-question">
                    <p className="loan-question-label">{zone.label}</p>

                    <div className="loan-options">
                        {shuffledItems.map((item) => {
                            const isSelected = selectedAnswer === item.id;
                            const isCorrectOption =
                                moduleCompleted && correctMap[item.id] === zone.zone;
                            const isWrongSelected =
                                isSelected && !moduleCompleted && correctMap[item.id] !== zone.zone;

                            const classes = [
                                "loan-option-btn",
                                isSelected ? "selected" : "",
                                isCorrectOption ? "correct" : "",
                                isWrongSelected ? "wrong" : "",
                            ]
                                .join(" ")
                                .trim();

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={classes}
                                    onClick={() => handleAnswer(item.id)}
                                    disabled={moduleCompleted}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {moduleCompleted && (
                    <button className="loan-finish-btn loan-next-module-btn" onClick={nextModule}>
                        {currentModule === modules.length - 1 ? "Terminar" : "Siguiente módulo"}
                    </button>
                )}
            </div>
        </div>
    );
}