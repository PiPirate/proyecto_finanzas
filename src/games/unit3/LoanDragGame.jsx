import React, { useState } from "react";
import "./css/LoanDragGame.css";

export default function LoanDragGame({ visible, onComplete }) {
    if (!visible) return null;

    // ----------------------------------------------------------
    // 📘 NUEVOS MÓDULOS, MÁS CLAROS Y PEDAGÓGICOS
    // ----------------------------------------------------------
    const modules = [
        // ----------------------------------------------------
        // MÓDULO 1 — CONCEPTOS ESENCIALES DEL ANÁLISIS FINANCIERO
        // ----------------------------------------------------
        {
            title: "Módulo 1 — Conceptos esenciales del análisis financiero",
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

        // ----------------------------------------------------
        // MÓDULO 2 — INTERPRETACIÓN DE ESTADOS FINANCIEROS
        // ----------------------------------------------------
        {
            title: "Módulo 2 — Interpretación de estados financieros",
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

        // ----------------------------------------------------
        // MÓDULO 3 — EFECTO DE LAS DECISIONES FINANCIERAS
        // ----------------------------------------------------
        {
            title: "Módulo 3 — Consecuencias de decisiones financieras",
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

        // ----------------------------------------------------
        // MÓDULO 4 — ERRORES FRECUENTES EN ANÁLISIS FINANCIERO
        // ----------------------------------------------------
        {
            title: "Módulo 4 — Errores frecuentes en análisis financiero",
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

        // ----------------------------------------------------
        // MÓDULO 5 — BUENAS PRÁCTICAS DE ANÁLISIS FINANCIERO
        // ----------------------------------------------------
        {
            title: "Módulo 5 — Buenas prácticas del analista financiero",
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

        // ----------------------------------------------------
        // MÓDULO 6 — TIPOS DE ANÁLISIS FINANCIERO
        // ----------------------------------------------------
        {
            title: "Módulo 6 — Tipos de análisis y riesgos",
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

        // ----------------------------------------------------
        // MÓDULO 7 — ESCENARIOS REALES Y DECISIONES FINANCIERAS
        // ----------------------------------------------------
        {
            title: "Módulo 7 — Escenarios reales y análisis inteligente",
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

    // Mapa correcto
    const correctMap = {
        liquidez: "zone_liquidez",
        rentabilidad: "zone_rentabilidad",
        endeudamiento: "zone_endeudamiento",
        eficiencia: "zone_eficiencia",
    };

    const [currentModule, setCurrentModule] = useState(0);
    const [hint, setHint] = useState("");
    const [feedback, setFeedback] = useState("");
    const [showIntro, setShowIntro] = useState(true);
    const [showEnding, setShowEnding] = useState(false);
    const [shuffledItems, setShuffledItems] = useState([]);

    const [dropped, setDropped] = useState({
        liquidez: null,
        rentabilidad: null,
        endeudamiento: null,
        eficiencia: null,
    });

    const [locked, setLocked] = useState({
        liquidez: false,
        rentabilidad: false,
        endeudamiento: false,
        eficiencia: false,
    });

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData("itemId", item.id);
        setHint(item.hint);
        setFeedback("");
    };

    const handleDrop = (e, zoneId) => {
        const itemId = e.dataTransfer.getData("itemId");
        const correct = correctMap[itemId] === zoneId;

        setDropped(prev => ({ ...prev, [itemId]: zoneId }));

        if (correct) {
            setLocked(prev => ({ ...prev, [itemId]: true }));
            const text = modules[currentModule].items.find(i => i.id === itemId).hint;
            setFeedback(`✔ ¡Muy bien! ${text}`);
        } else {
            const text = modules[currentModule].items.find(i => i.id === itemId).hint;
            setFeedback(`🤔 No corresponde aquí.\n💡 Pista: ${text}`);
        }
    };

    const moduleCompleted =
        locked.liquidez &&
        locked.rentabilidad &&
        locked.endeudamiento &&
        locked.eficiencia;

    const nextModule = () => {
        if (currentModule < modules.length - 1) {
            setCurrentModule(currentModule + 1);
            setHint(""); setFeedback("");
            setDropped({ liquidez: null, rentabilidad: null, endeudamiento: null, eficiencia: null });
            setLocked({ liquidez: false, rentabilidad: false, endeudamiento: false, eficiencia: false });
            setShuffledItems(shuffle(modules[currentModule + 1].items));
        } else setShowEnding(true);
    };

    if (showIntro) {
        return (
            <div className="loan-game-overlay">
                <div className="loan-game-window intro">
                    <h2>Aprende sobre analisís financieros</h2>
                    <p>No necesitas saber nada. Aquí aprenderás paso a paso, arrastrando ideas claras y entendibles.</p>
                    <button className="loan-finish-btn" onClick={() => {
                        setShowIntro(false);
                        setShuffledItems(shuffle(modules[0].items)); // Mezclar módulo inicial
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
                <div className="loan-game-window intro">
                    <h2> ¡Muy bien!</h2>
                    <p>Ahora tienes una comprensión completa y práctica sobre cómo funcionan el analisi financiero.</p>
                    <button className="loan-finish-btn" onClick={onComplete}>Finalizar</button>
                </div>
            </div>
        );
    }

    const module = modules[currentModule];

    function shuffle(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    return (
        <div className="loan-game-overlay">
            <div className="loan-game-window">

                <h2 className="module-title">{module.title}</h2>
                <p className="module-desc">{module.description}</p>

                {hint && <div className="loan-hint-box">💡 {hint}</div>}
                {feedback && <div className="loan-feedback-box">{feedback}</div>}

                <div className="loan-cards">
                    {shuffledItems.map(item => (
                        <div
                            key={item.id}
                            className={`loan-card ${locked[item.id] ? "locked" : ""}`}
                            draggable={!locked[item.id]}
                            onDragStart={(e) => !locked[item.id] && handleDragStart(e, item)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>

                <div className="loan-dropzones">
                    {module.zones.map(zone => (
                        <div
                            key={zone.zone}
                            className="dropzone"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, zone.zone)}
                        >
                            {zone.label}
                        </div>
                    ))}
                </div>

                {moduleCompleted && (
                    <button className="loan-finish-btn" onClick={nextModule}>
                        {currentModule === modules.length - 1 ? "Terminar" : "Siguiente módulo"}
                    </button>
                )}

            </div>
        </div>
    );
}
