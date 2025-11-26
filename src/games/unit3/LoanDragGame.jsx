import React, { useCallback, useEffect, useRef, useState } from "react";
import "./css/LoanDragGame.css";

export default function LoanDragGame({ visible, onComplete }) {
    if (!visible) return null;

    // ----------------------------------------------------------
    // 📘 MÓDULOS DE ANÁLISIS FINANCIERO
    // ----------------------------------------------------------
    const modules = [
        // MÓDULO 1
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

        // MÓDULO 2
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
        
        // MÓDULO 3
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

        // MÓDULO 4
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

        // MÓDULO 5
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

        // MÓDULO 6
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

        // MÓDULO 7
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

    // Refs para manejar eventos táctiles/pointer
    const touchItemRef = useRef(null);
    const touchTargetRef = useRef(null);
    const activePointerRef = useRef(null); // ID del puntero activo (para PointerEvent)
    const activePointerTypeRef = useRef(null); // Tipo de puntero ('pointer' o 'touch' para Legacy)
    const activeTouchIdRef = useRef(null); // ID del toque activo (para TouchEvent Legacy)

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData("itemId", item.id);
        setHint(item.hint);
        setFeedback("");
    };

    // Función principal de resolución de drop (usada para Drag and Drop y Touch)
    const resolveDrop = useCallback(
        (itemId, zoneId) => {
            if (!itemId || !zoneId) return;

            const correct = correctMap[itemId] === zoneId;
            const moduleItems = modules[currentModule]?.items ?? [];
            const hintText = moduleItems.find((i) => i.id === itemId)?.hint ?? "";

            setDropped((prev) => ({ ...prev, [itemId]: zoneId }));

            if (correct) {
                setFeedback(`✔ ¡Muy bien! ${hintText}`);
                
                // Usamos la función de actualización de setLocked para verificar si el módulo terminó
                setLocked((prev) => {
                    const updated = { ...prev, [itemId]: true };
                    
                    // Comprueba si todos los ítems están bloqueados (incluyendo el actual)
                    const allCorrect = Object.keys(correctMap).every((key) => updated[key]);

                    if (allCorrect) {
                        setTimeout(() => {
                            setFeedback("🎉 ¡Completaste todas las asociaciones correctamente!");
                            // Doble seguridad para el bloqueo visual
                            setLocked({
                                liquidez: true,
                                rentabilidad: true,
                                endeudamiento: true,
                                eficiencia: true,
                            });
                        }, 200);
                    }

                    return updated;
                });

            } else {
                setFeedback(`🤔 No corresponde aquí.\n💡 Pista: ${hintText}`);
                setDropped((prev) => ({ ...prev, [itemId]: null }));
            }
            setHint(""); // Limpiar pista después del intento
        },
        [correctMap, currentModule, modules]
    );

    const handleDrop = (e, zoneId) => {
        const itemId = e.dataTransfer.getData("itemId");
        resolveDrop(itemId, zoneId);
    };

    const getZoneIdFromPoint = useCallback((clientX, clientY) => {
        const el = document.elementFromPoint(clientX, clientY);
        // Busca el dropzone más cercano
        const zoneEl = el?.closest?.('[data-zone-id]');
        return zoneEl?.dataset?.zoneId || null;
    }, []);

    // --- Manejo de Puntero (Moderno: PointerEvent) ---
    const handleTouchStart = (e, item) => {
        if (e.pointerType !== 'touch') return;
        if (locked[item.id]) return;
        if (activePointerRef.current !== null) return; // Solo un toque a la vez

        e.preventDefault();
        touchItemRef.current = item.id;
        activePointerRef.current = e.pointerId;
        activePointerTypeRef.current = 'pointer';
        touchTargetRef.current = null;

        if (e.target.setPointerCapture) {
            try {
                e.target.setPointerCapture(e.pointerId);
            } catch (err) {
                // Si falla el capture, se ignora
            }
        }

        setHint(item.hint);
        setFeedback("");
    };

    const handleGlobalPointerMove = useCallback(
        (e) => {
            if (e.pointerType !== 'touch') return;
            if (activePointerTypeRef.current !== 'pointer') return;
            if (activePointerRef.current !== e.pointerId || !touchItemRef.current) return;
            e.preventDefault(); // Previene el scroll

            touchTargetRef.current = getZoneIdFromPoint(e.clientX, e.clientY);
        },
        [getZoneIdFromPoint]
    );

    const handleGlobalPointerEnd = useCallback(
        (e) => {
            if (e.pointerType !== 'touch') return;
            if (activePointerTypeRef.current !== 'pointer') return;
            if (activePointerRef.current !== e.pointerId || !touchItemRef.current) return;
            e.preventDefault();

            // Resuelve la caída usando la zona actual (si existe) o la última conocida (touchTargetRef)
            const zoneId = getZoneIdFromPoint(e.clientX, e.clientY) || touchTargetRef.current;
            
            // Si hay una zona válida, resuelve el drop
            if (zoneId) {
                resolveDrop(touchItemRef.current, zoneId);
            }

            // Restablece el estado
            touchItemRef.current = null;
            touchTargetRef.current = null;
            activePointerRef.current = null;
            activePointerTypeRef.current = null;
            activeTouchIdRef.current = null;
        },
        [getZoneIdFromPoint, resolveDrop]
    );

    // --- Manejo de Toque (Legacy: TouchEvent) ---

    const handleLegacyTouchStart = (e, item) => {
        if ("PointerEvent" in window) return; // Si soporta PointerEvent, ignora Legacy
        if (locked[item.id]) return;
        if (activePointerRef.current !== null) return; // Solo un toque a la vez

        const touch = e.touches?.[0];
        if (!touch) return;
        e.preventDefault();

        touchItemRef.current = item.id;
        activePointerRef.current = touch.identifier; // Usamos identifier como ID del puntero
        activePointerTypeRef.current = 'touch';
        activeTouchIdRef.current = touch.identifier;
        touchTargetRef.current = null;

        setHint(item.hint);
        setFeedback("");
    };

    const handleGlobalTouchMove = useCallback(
        (e) => {
            if (activePointerTypeRef.current !== 'touch') return;
            // Busca el toque activo por ID
            const touch = Array.from(e.touches || []).find((t) => t.identifier === activeTouchIdRef.current);
            if (!touch || !touchItemRef.current) return;
            e.preventDefault();

            touchTargetRef.current = getZoneIdFromPoint(touch.clientX, touch.clientY);
        },
        [getZoneIdFromPoint]
    );

    const handleGlobalTouchEnd = useCallback(
        (e) => {
            if (activePointerTypeRef.current !== 'touch') return;
            // Busca el toque que terminó
            const touch = Array.from(e.changedTouches || []).find((t) => t.identifier === activeTouchIdRef.current);
            if (!touch || !touchItemRef.current) return;
            e.preventDefault();

            const zoneId = getZoneIdFromPoint(touch.clientX, touch.clientY) || touchTargetRef.current;
            if (zoneId) {
                resolveDrop(touchItemRef.current, zoneId);
            }

            // Restablece el estado
            touchItemRef.current = null;
            touchTargetRef.current = null;
            activePointerRef.current = null;
            activePointerTypeRef.current = null;
            activeTouchIdRef.current = null;
        },
        [getZoneIdFromPoint, resolveDrop]
    );

    const handlePointerCancel = useCallback(() => {
        // Restablece todo el estado en caso de interrupción (ej. llamada entrante)
        touchItemRef.current = null;
        touchTargetRef.current = null;
        activePointerRef.current = null;
        activePointerTypeRef.current = null;
        activeTouchIdRef.current = null;
    }, []);

    // --- Efecto de Escucha Global ---
    useEffect(() => {
        // Pointer Events (Moderno)
        window.addEventListener('pointermove', handleGlobalPointerMove, { passive: false });
        window.addEventListener('pointerup', handleGlobalPointerEnd, { passive: false });
        window.addEventListener('pointercancel', handlePointerCancel);

        // Touch Events (Legacy)
        window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
        window.addEventListener('touchend', handleGlobalTouchEnd, { passive: false });
        window.addEventListener('touchcancel', handlePointerCancel, { passive: false });

        return () => {
            window.removeEventListener('pointermove', handleGlobalPointerMove);
            window.removeEventListener('pointerup', handleGlobalPointerEnd);
            window.removeEventListener('pointercancel', handlePointerCancel);

            window.removeEventListener('touchmove', handleGlobalTouchMove);
            window.removeEventListener('touchend', handleGlobalTouchEnd);
            window.removeEventListener('touchcancel', handlePointerCancel);
        };
    }, [handleGlobalPointerEnd, handleGlobalPointerMove, handleGlobalTouchEnd, handleGlobalTouchMove, handlePointerCancel]);

    // --- Lógica del Flujo del Juego ---

    const moduleCompleted =
        locked.liquidez &&
        locked.rentabilidad &&
        locked.endeudamiento &&
        locked.eficiencia;

    const nextModule = () => {
        if (currentModule < modules.length - 1) {
            setCurrentModule(currentModule + 1);
            setHint("");
            setFeedback("");
            setDropped({ liquidez: null, rentabilidad: null, endeudamiento: null, eficiencia: null });
            setLocked({ liquidez: false, rentabilidad: false, endeudamiento: false, eficiencia: false });
            setShuffledItems(shuffle(modules[currentModule + 1].items));
        } else setShowEnding(true);
    };

    function shuffle(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    // --- Renderizado ---

    if (showIntro) {
        return (
            <div className="loan-game-overlay">
            <div className="loan-game-window intro minigame-container">
                    <h2>Aprende sobre análisis financieros</h2>
                    <p>No necesitas saber nada. Aquí aprenderás paso a paso, arrastrando ideas claras y entendibles.</p>
                    <button className="loan-finish-btn" onClick={() => {
                        setShowIntro(false);
                        setShuffledItems(shuffle(modules[0].items));
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

    return (
        <div className="loan-game-overlay">
            <div className="loan-game-window minigame-container">

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
                            
                            // Eventos de inicio de arrastre para móvil
                            onPointerDown={(e) => e.pointerType === 'touch' && handleTouchStart(e, item)}
                            onTouchStart={(e) => handleLegacyTouchStart(e, item)} 
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
                            data-zone-id={zone.zone}
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