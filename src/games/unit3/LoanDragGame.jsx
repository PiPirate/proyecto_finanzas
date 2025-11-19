import React, { useState } from "react";
import "./css/LoanDragGame.css";

export default function LoanDragGame({ visible, onComplete }) {
    if (!visible) return null;

    // ----------------------------------------------------------
    // 📘 NUEVOS MÓDULOS, MÁS CLAROS Y PEDAGÓGICOS
    // ----------------------------------------------------------
    const modules = [
        // ----------------------------------------------------
        // MÓDULO 1 — NUEVO Y COHERENTE
        // ----------------------------------------------------
        {
            title: "Módulo 1 — Conceptos esenciales de un préstamo",
            description: "Relaciona cada concepto con su definición correcta.",
            zones: [
                { zone: "zone_capital", label: "¿Qué es el capital de un préstamo?" },
                { zone: "zone_interes", label: "¿Qué son los intereses?" },
                { zone: "zone_deuda", label: "¿Qué es la deuda total?" },
                { zone: "zone_pago", label: "¿Qué son las cuotas del préstamo?" }
            ],
            items: [
                { id: "capital", label: "El dinero inicial que el banco me presta", hint: "Es el monto que recibo al inicio." },
                { id: "interes", label: "El costo que pago por usar el dinero prestado", hint: "Funciona como la ganancia del banco." },
                { id: "deuda", label: "La suma del capital más los intereses generados", hint: "Es todo lo que debo al final." },
                { id: "pago", label: "Los pagos periódicos que hago para devolver el préstamo", hint: "Son las cuotas mensuales." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 2 — NUEVO Y COHERENTE
        // ----------------------------------------------------
        {
            title: "Módulo 2 — ¿Cómo funciona un préstamo?",
            description: "Conecta cada parte del préstamo con su función.",
            zones: [
                { zone: "zone_capital", label: "¿Qué parte del préstamo puedo usar directamente?" },
                { zone: "zone_interes", label: "¿Qué representa el costo del préstamo?" },
                { zone: "zone_deuda", label: "¿Qué refleja el total que debo pagar?" },
                { zone: "zone_pago", label: "¿Qué hago para reducir lo que debo?" }
            ],
            items: [
                { id: "capital", label: "El monto que recibo para gastar o invertir", hint: "Es el dinero que puedo usar." },
                { id: "interes", label: "El porcentaje adicional que cobra el banco", hint: "Ese porcentaje es el interés." },
                { id: "deuda", label: "El capital más los intereses acumulados", hint: "Es mi obligación completa." },
                { id: "pago", label: "Cada cuota que realizo durante el plazo del préstamo", hint: "Cada pago reduce la deuda." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 3 — NUEVO Y COHERENTE
        // ----------------------------------------------------
        {
            title: "Módulo 3 — Consecuencias de mis decisiones",
            description: "Cada acción afecta el préstamo. Relaciónala con su efecto correcto.",
            zones: [
                { zone: "zone_capital", label: "¿Qué pasa si solicito un monto mayor?" },
                { zone: "zone_interes", label: "¿Qué ocurre si la tasa de interés es más alta?" },
                { zone: "zone_deuda", label: "¿Qué pasa si me atraso en los pagos?" },
                { zone: "zone_pago", label: "¿Qué logro si hago pagos anticipados?" }
            ],
            items: [
                { id: "capital", label: "Termino con una deuda más grande", hint: "Más dinero prestado = mayor obligación." },
                { id: "interes", label: "Pago un costo total mucho más alto", hint: "La tasa influye en el valor final." },
                { id: "deuda", label: "La deuda aumenta por los intereses moratorios", hint: "Los retrasos generan cargos extra." },
                { id: "pago", label: "Reduzco el capital más rápido y pago menos intereses", hint: "Pagar antes siempre ayuda." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 4 — NUEVO Y COHERENTE
        // ----------------------------------------------------
        {
            title: "Módulo 4 — Errores frecuentes con préstamos",
            description: "Identifica qué error corresponde a cada tipo de descuido.",
            zones: [
                { zone: "zone_capital", label: "Error al decidir cuánto pedir" },
                { zone: "zone_interes", label: "Error al revisar los costos" },
                { zone: "zone_deuda", label: "Error que incrementa mi obligación final" },
                { zone: "zone_pago", label: "Error relacionado con la puntualidad" }
            ],
            items: [
                { id: "capital", label: "Pedir un monto mayor al necesario", hint: "Esto hace el préstamo más difícil de pagar." },
                { id: "interes", label: "Aceptar una tasa sin compararla con otros bancos", hint: "Podrías pagar mucho más de lo debido." },
                { id: "deuda", label: "Ignorar comisiones y costos adicionales", hint: "Se acumulan y elevan la deuda total." },
                { id: "pago", label: "Realizar los pagos tarde", hint: "Genera multas e intereses moratorios." }
            ]
        },

        {
            title: "Módulo 6 — Tipos de préstamos y sus riesgos",
            description: "Relaciona cada tipo de préstamo con la consecuencia o característica correcta.",
            zones: [
                { zone: "zone_capital", label: "¿Qué préstamo puede ayudarme a mejorar mis ingresos?" },
                { zone: "zone_interes", label: "¿Qué préstamo suele tener un costo muy alto?" },
                { zone: "zone_deuda", label: "¿Qué tipo de préstamo puede generar deudas innecesarias?" },
                { zone: "zone_pago", label: "¿Qué préstamo suele ofrecer pagos estables y predecibles?" }
            ],
            items: [
                { id: "capital", label: "Un préstamo educativo o para herramientas de trabajo", hint: "Puede aumentar mis oportunidades laborales." },
                { id: "interes", label: "Los créditos rápidos con aprobación inmediata", hint: "Suelen tener tasas extremadamente altas." },
                { id: "deuda", label: "Usar crédito para compras impulsivas o poco necesarias", hint: "Terminas endeudándote sin beneficio real." },
                { id: "pago", label: "Un préstamo con tasa fija y cuotas mensuales fijas", hint: "Permite planificar mejor los pagos." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 7 — NUEVO Y COHERENTE
        // ----------------------------------------------------
        {
            title: "Módulo 7 — Escenarios reales y decisiones inteligentes",
            description: "Arrastra cada situación hacia la opción más conveniente según tu objetivo.",
            zones: [
                { zone: "zone_capital", label: "Necesito financiar mi formación o capacitación" },
                { zone: "zone_interes", label: "Tengo una emergencia y necesito dinero rápido" },
                { zone: "zone_deuda", label: "Quiero comprar algo que no es indispensable" },
                { zone: "zone_pago", label: "Necesito un vehículo para trabajar diariamente" }
            ],
            items: [
                { id: "capital", label: "Elegir un préstamo educativo con tasa baja", hint: "Es ideal para estudios y formación profesional." },
                { id: "interes", label: "Solicitar un crédito de consumo con tasa moderada", hint: "Es más seguro que un crédito rápido." },
                { id: "deuda", label: "La mejor opción es ahorrar y evitar endeudarme", hint: "No vale la pena endeudarse por un gusto." },
                { id: "pago", label: "Optar por un crédito vehicular con cuotas fijas", hint: "Útil si lo necesitas para generar ingresos." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 5 — NUEVO Y COHERENTE
        // ----------------------------------------------------
        {
            title: "Módulo 5 — Buenas prácticas al usar préstamos",
            description: "Relaciona cada buena práctica con la acción correcta que deberías tomar.",
            zones: [
                { zone: "zone_capital", label: "Antes de decidir cuánto dinero pedir…" },
                { zone: "zone_interes", label: "Antes de aceptar las condiciones del préstamo…" },
                { zone: "zone_deuda", label: "Para evitar que mi deuda se salga de control…" },
                { zone: "zone_pago", label: "Para no tener problemas con las cuotas mensuales…" }
            ],
            items: [
                { id: "capital", label: "Calculo cuánto puedo pagar sin afectar mis gastos básicos", hint: "Así pido solo el monto que realmente puedo asumir." },
                { id: "interes", label: "Reviso y comparo la tasa de interés en varios bancos", hint: "Comparar me ayuda a elegir el préstamo más barato." },
                { id: "deuda", label: "Evito usar el préstamo para compras impulsivas o innecesarias", hint: "Así no aumento mi deuda por caprichos." },
                { id: "pago", label: "Organizo un presupuesto mensual para asegurar cada pago a tiempo", hint: "Un buen control evita atrasos e intereses adicionales." }
            ]
        }

    ];



    // Correct match (global)
    const correctMap = {
        capital: "zone_capital",
        interes: "zone_interes",
        deuda: "zone_deuda",
        pago: "zone_pago",
    };

    const [currentModule, setCurrentModule] = useState(0);
    const [hint, setHint] = useState("");
    const [feedback, setFeedback] = useState("");
    const [showIntro, setShowIntro] = useState(true);
    const [showEnding, setShowEnding] = useState(false);
    const [shuffledItems, setShuffledItems] = useState([]);

    const [dropped, setDropped] = useState({
        capital: null,
        interes: null,
        deuda: null,
        pago: null,
    });

    const [locked, setLocked] = useState({
        capital: false,
        interes: false,
        deuda: false,
        pago: false,
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
        locked.capital &&
        locked.interes &&
        locked.deuda &&
        locked.pago;

    const nextModule = () => {
        if (currentModule < modules.length - 1) {
            setCurrentModule(currentModule + 1);
            setHint(""); setFeedback("");
            setDropped({ capital: null, interes: null, deuda: null, pago: null });
            setLocked({ capital: false, interes: false, deuda: false, pago: false });
            setShuffledItems(shuffle(modules[currentModule + 1].items));
        } else setShowEnding(true);
    };

    if (showIntro) {
        return (
            <div className="loan-game-overlay">
                <div className="loan-game-window intro">
                    <h2>Aprende sobre préstamos de forma fácil</h2>
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
                <div className="loan-game-window ending">
                    <h2>🎉 ¡Muy bien!</h2>
                    <p>Ahora tienes una comprensión completa y práctica sobre cómo funcionan los préstamos.</p>
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
