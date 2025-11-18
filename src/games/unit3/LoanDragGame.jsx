import React, { useState } from "react";
import "./css/LoanDragGame.css";

export default function LoanDragGame({ visible, onComplete }) {
    if (!visible) return null;

    // ----------------------------------------------------------
    // 📘 NUEVOS MÓDULOS, MÁS CLAROS Y PEDAGÓGICOS
    // ----------------------------------------------------------
    const modules = [
        // ----------------------------------------------------
        // MÓDULO 1
        // ----------------------------------------------------
        {
            title: "Módulo 1 — Las partes fundamentales de un préstamo",
            description: "Arrastra cada frase hacia la pregunta correspondiente. Todo está explicado de forma sencilla.",
            zones: [
                { zone: "zone_capital", label: "¿Qué recibo del banco?" },
                { zone: "zone_interes", label: "¿Qué pago por usar el dinero prestado?" },
                { zone: "zone_deuda", label: "¿Qué debo devolver en total?" },
                { zone: "zone_pago", label: "¿Cómo devuelvo el préstamo?" }
            ],
            items: [
                { id: "capital", label: "Es el dinero que el banco me entrega al inicio", hint: "Ese dinero inicial se llama capital." },
                { id: "interes", label: "Es el costo extra por pedir dinero prestado", hint: "El interés es lo que el banco cobra por prestarme dinero." },
                { id: "deuda", label: "Es la suma del dinero prestado más los intereses", hint: "La deuda total incluye capital + intereses." },
                { id: "pago", label: "Son los pagos mensuales que hago poco a poco", hint: "Las cuotas mensuales sirven para devolver el préstamo gradualmente." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 2
        // ----------------------------------------------------
        {
            title: "Módulo 2 — ¿Cómo funciona un préstamo en la vida real?",
            description: "Con estas frases te será más fácil entender cómo funciona realmente un préstamo.",
            zones: [
                { zone: "zone_capital", label: "¿Qué recibo cuando aprueban mi solicitud?" },
                { zone: "zone_interes", label: "¿Qué gana el banco con esto?" },
                { zone: "zone_deuda", label: "¿Qué representa mi obligación total?" },
                { zone: "zone_pago", label: "¿Qué realizo todos los meses?" }
            ],
            items: [
                { id: "capital", label: "El monto del préstamo que puedo usar", hint: "Ese es el capital: lo que recibo." },
                { id: "interes", label: "El banco cobra una parte adicional como ganancia", hint: "Ese es el interés." },
                { id: "deuda", label: "Mi obligación total con el banco", hint: "La deuda incluye el dinero prestado + los intereses." },
                { id: "pago", label: "Cada mes pago una cuota fija", hint: "Así devuelvo el préstamo poco a poco." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 3
        // ----------------------------------------------------
        {
            title: "Módulo 3 — ¿Qué pasa si tomo ciertas decisiones?",
            description: "Cada acción tiene un efecto. Aprende cómo influyen en tu préstamo.",
            zones: [
                { zone: "zone_capital", label: "Si pido menos dinero…" },
                { zone: "zone_interes", label: "Si sube la tasa de interés…" },
                { zone: "zone_deuda", label: "Si aumento el plazo del préstamo…" },
                { zone: "zone_pago", label: "Si adelanto un pago…" }
            ],
            items: [
                { id: "capital", label: "Mi deuda será más baja", hint: "Pedir menos reduce tu obligación total." },
                { id: "interes", label: "El préstamo será más costoso", hint: "Una tasa alta = pagar más intereses." },
                { id: "deuda", label: "La deuda total subirá por intereses acumulados", hint: "Más tiempo = más intereses." },
                { id: "pago", label: "Reduciré los intereses futuros", hint: "Pagar antes siempre ayuda." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 4 — ERRORES COMUNES
        // ----------------------------------------------------
        {
            title: "Módulo 4 — Errores comunes al pedir un préstamo",
            description: "Identifica prácticas comunes que pueden afectarte negativamente.",
            zones: [
                { zone: "zone_capital", label: "¿Qué error tiene que ver con pedir demasiado dinero?" },
                { zone: "zone_interes", label: "¿Qué error tiene que ver con no revisar costos?" },
                { zone: "zone_deuda", label: "¿Qué error aumenta mi obligación sin notarlo?" },
                { zone: "zone_pago", label: "¿Qué error afecta mis pagos mensuales?" }
            ],
            items: [
                { id: "capital", label: "Pedir más dinero del que realmente necesito", hint: "Esto aumenta tu deuda innecesariamente." },
                { id: "interes", label: "No revisar la tasa de interés antes de aceptar", hint: "Una tasa alta puede duplicar el costo del préstamo." },
                { id: "deuda", label: "Aceptar plazos muy largos sin entender las consecuencias", hint: "Los plazos largos aumentan la deuda total." },
                { id: "pago", label: "Pagar tarde y generar cobros adicionales", hint: "Retrasos = intereses moratorios + mal historial." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 5 — BUENAS PRÁCTICAS
        // ----------------------------------------------------
        {
            title: "Módulo 5 — Buenas prácticas para manejar préstamos",
            description: "Aprende cómo mejorar tu salud financiera.",
            zones: [
                { zone: "zone_capital", label: "¿Qué debo hacer antes de pedir un préstamo?" },
                { zone: "zone_interes", label: "¿Cómo puedo reducir el costo del préstamo?" },
                { zone: "zone_deuda", label: "¿Cómo evitar que mi deuda crezca?" },
                { zone: "zone_pago", label: "¿Qué hábito mejora mis pagos mensuales?" }
            ],
            items: [
                { id: "capital", label: "Pedir solo lo necesario", hint: "Menos capital = préstamo más fácil de pagar." },
                { id: "interes", label: "Comparar tasas en varios bancos", hint: "Así encuentro el préstamo más barato." },
                { id: "deuda", label: "Mantener un fondo de emergencia", hint: "Evita que recurras a préstamos caros." },
                { id: "pago", label: "Pagar antes de la fecha límite", hint: "Te evita intereses extra y mejora tu historial." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 6 — PRÉSTAMOS BUENOS VS MALOS
        // ----------------------------------------------------
        {
            title: "Módulo 6 — ¿Cuándo un préstamo es bueno o malo?",
            description: "No todos los préstamos son malos. Aprende a diferenciarlos.",
            zones: [
                { zone: "zone_capital", label: "¿Qué préstamo puede ser útil?" },
                { zone: "zone_interes", label: "¿Qué préstamo suele salir caro?" },
                { zone: "zone_deuda", label: "¿Qué puede llevarme a endeudarme de más?" },
                { zone: "zone_pago", label: "¿Qué préstamo suele ser fácil de pagar?" }
            ],
            items: [
                { id: "capital", label: "Un préstamo para estudiar o mejorar mi trabajo", hint: "Puede mejorar mis ingresos futuros." },
                { id: "interes", label: "Préstamos rápidos con tasas muy altas", hint: "Suelen ser extremadamente costosos." },
                { id: "deuda", label: "Comprar cosas innecesarias con crédito", hint: "La deuda crece por razones poco útiles." },
                { id: "pago", label: "Un préstamo con cuotas bajas y tasa razonable", hint: "Esto es más manejable mes a mes." }
            ]
        },

        // ----------------------------------------------------
        // MÓDULO 7 — ¿QUÉ PRÉSTAMO ME CONVIENE?
        // ----------------------------------------------------
        {
            title: "Módulo 7 — Escenarios reales",
            description: "Arrastra cada situación hacia la opción más conveniente.",
            zones: [
                { zone: "zone_capital", label: "Necesito estudiar" },
                { zone: "zone_interes", label: "Tengo una emergencia" },
                { zone: "zone_deuda", label: "Quiero cambiar mi celular" },
                { zone: "zone_pago", label: "Quiero comprar una moto" }
            ],
            items: [
                { id: "capital", label: "Me conviene un préstamo educativo con tasa baja", hint: "Los préstamos educativos son más baratos." },
                { id: "interes", label: "Me conviene un crédito de libre inversión o emergencia", hint: "Para emergencias se usa libre inversión." },
                { id: "deuda", label: "Sería mejor ahorrar y no endeudarme", hint: "Un celular no justifica una deuda." },
                { id: "pago", label: "Necesito un préstamo de vehículo con cuotas fijas", hint: "Son ideales para motos o carros." }
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
