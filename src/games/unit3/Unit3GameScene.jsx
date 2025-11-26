// src/games/unit3/Unit3GameScene.jsx
// -------------------------------------------------------------
// Escena completa para la Unidad 3
// Con 5 zonas interactivas:
// 1. Qué es un préstamo (minijuego de arrastrar)
// 2. Necesidades (clasificador)
// 3. Interés (simulador)
// 4. Ventanilla de crédito (comparador)
// 5. Planificación de pagos (puzzle)
// -------------------------------------------------------------

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import TileMap from '../core/map/TileMap';
import Player from '../core/player/Player';
import usePlayerMovement from '../core/hooks/usePlayerMovement';
import useCameraFollow from '../core/hooks/useCameraFollow';
import { useDeviceMode } from '../../hooks/useDeviceMode';

// Importar tu mapa
import {
    unit3MapMatrix,
    unit3TileSize,
    unit3PlayerStart,
    unit3InteractiveZones
} from '../../data/games/unit3Map';

// Imagen del mapa
import unit3MapImage from '../../assets/unit3/map_unit3.png';

// Sprites del jugador
import girlSpriteSheet from '../../assets/general/la socia caminando.png';
import girlFaceTalking from '../../assets/general/player_face_hablando.png';
import girlFaceNeutral from '../../assets/general/player_face_neutral.png';

// Componentes de minijuegos (los crearás tú después)
import LoanDragGame from './LoanDragGame';
import SnakeFinancialGame from './SnakeFinancialGame';
import NeedsPriorityGame from "./NeedsPriorityGame";
import InterestRunnerGame from "./InterestRunnerGame";

// import LoanComparisonGame from './games/LoanComparisonGame';
// import PaymentPuzzleGame from './games/PaymentPuzzleGame';

// Cuadro de diálogo
import DialogueBox from '../core/dialogue/DialogueBox';

// -------------------------------------------------------------
// 1. DIÁLOGOS DE CADA ZONA
// -------------------------------------------------------------

// -------------------------------------------------------------
// 1. DIÁLOGOS DE CADA ZONA (VERSIÓN ANÁLISIS FINANCIERO)
// -------------------------------------------------------------

const introDialogue = [
    "Bienvenido a la Unidad 3: Fundamentos del Análisis Financiero.",
    "Cada zona del centro financiero tiene una actividad distinta: conceptos financieros, clasificación de indicadores, rentabilidad, riesgo y decisiones estratégicas.",
    "Explora cada sección para desbloquear la comprensión completa de cómo analizar la salud financiera de una empresa.",
    "Ve al cartel de '1' y haz clic sobre la mesa para comenzar."
];

const loanIntroDialogue = [
    "Antes de comenzar, repasemos los conceptos fundamentales del análisis financiero.",
    "Toda evaluación financiera se basa en cuatro pilares clave: liquidez, endeudamiento, rentabilidad y eficiencia.",
    "La liquidez indica si una empresa puede cumplir sus obligaciones inmediatas.",
    "El endeudamiento refleja cuánto depende la empresa de recursos ajenos.",
    "La rentabilidad muestra si la empresa está generando valor.",
    "Y la eficiencia mide qué tan bien aprovecha sus recursos.",
    "Vamos a identificarlos mejor con un minijuego interactivo."
];

const loanPosterDialogue = [
    "Este es el cartel de 'Conceptos financieros esenciales'.",
    "Un buen analista reconoce rápidamente qué representa cada indicador y cómo afecta la situación de la empresa.",
    "¡Vamos a practicar identificándolos en un minijuego visual!"
];

const needsPosterDialogue = [
    "Aquí aprenderás a priorizar indicadores financieros según su relevancia para evaluar la salud de una empresa.",
    "Algunos indicadores son críticos para la supervivencia, otros para evaluar rendimiento o eficiencia.",
    "Ordenarlos correctamente es una habilidad clave en el análisis financiero."
];

const interestPosterDialogue = [
    "Esta zona está dedicada a la rentabilidad.",
    "Tu misión es mantener los márgenes positivos mientras los costos y riesgos intentan reducirlos.",
    "Cada obstáculo rojo activará preguntas sobre análisis de rentabilidad, márgenes y eficiencia.",
    "¡Demuestra que puedes mantener el rendimiento bajo presión!"
];

const creditDeskDialogue = [
    "Has encontrado el simulador oculto de gestión del riesgo financiero.",
    "No es obligatorio para completar la unidad, pero te ayudará a entender cómo los riesgos afectan la estabilidad de una empresa.",
    "Si quieres aceptar el reto y administrar la exposición al riesgo, adelante."
];

const paymentPuzzleDialogue = [
    "Aquí aprenderás a evaluar decisiones financieras estratégicas.",
    "Analizarás alternativas de inversión, su riesgo, su retorno y su impacto en la empresa.",
    "Completa el rompecabezas financiero seleccionando las mejores decisiones."
];

const finalDialogue = [
    "¡Excelente! Has completado todas las zonas de la Unidad 3.",
    "Ahora dominas los conceptos básicos del análisis financiero: liquidez, riesgo, rentabilidad y toma de decisiones.",
    "¡Felicidades! Ya estás a nivel Analista Financiero Junior."
];

const lockedDialogue = [
    "Aún no puedes acceder a esta zona.",
    "Primero debes completar la actividad anterior para continuar con el análisis financiero."
];

const postLoanGameDialogue = [
    "¡Excelente trabajo identificando los conceptos financieros!",
    "Ya diferencias liquidez, endeudamiento, eficiencia y rentabilidad.",
    "Ahora avanza a la zona '2' para aprender a priorizar estos indicadores."
];

const postNeedsGameDialogue = [
    "Muy bien, clasificaste correctamente los indicadores según su importancia estratégica.",
    "Comprender la prioridad de cada indicador es esencial para interpretar estados financieros.",
    "Ahora ve a la zona '3' para aprender cómo mantener márgenes positivos.",
    "O, si quieres, prueba el simulador oculto de riesgo financiero en la computadora.",
    "Pero shhh… sigue siendo un secreto 😉"
];

const postInterestGameDialogue = [
    "¡Excelente! Ya viste cómo las decisiones afectan directamente los márgenes de rentabilidad.",
    "Recuerda: controlar costos, optimizar procesos y analizar riesgos es clave para mantener utilidades.",
    "Puedes seguir explorando el mapa o continuar al siguiente desafío analítico."
];

// -------------------------------------------------------------
// ESCENA PRINCIPAL
// -------------------------------------------------------------

function Unit3GameScene({ onGoalReached }) {
    const { isMobile } = useDeviceMode();
    const [dialogueMode, setDialogueMode] = useState("intro");
    const [dialogueIndex, setDialogueIndex] = useState(0);

    // Estados de actividades completadas
    const [loanDone, setLoanDone] = useState(false);
    const [needsDone, setNeedsDone] = useState(false);
    const [interestDone, setInterestDone] = useState(false);
    const [creditDone, setCreditDone] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);

    // Estado de minijuegos
    const [isLoanGameOpen, setIsLoanGameOpen] = useState(false);
    const [isNeedsGameOpen, setIsNeedsGameOpen] = useState(false);
    const [isInterestGameOpen, setIsInterestGameOpen] = useState(false);
    const [isCreditGameOpen, setIsCreditGameOpen] = useState(false);
    const [isPaymentGameOpen, setIsPaymentGameOpen] = useState(false);

    const allDone = loanDone && needsDone && interestDone && creditDone && paymentDone;

    const isDialogueVisible =
        dialogueMode !== null ||
        isLoanGameOpen ||
        isNeedsGameOpen ||
        isInterestGameOpen ||
        isCreditGameOpen ||
        isPaymentGameOpen;

    // Elección dinámica del diálogo
    const currentDialogueText = useMemo(() => {
        switch (dialogueMode) {
            case "intro": return introDialogue[dialogueIndex];
            case "loanIntro": return loanIntroDialogue[dialogueIndex];
            case "loan": return loanPosterDialogue[dialogueIndex];
            case "needs": return needsPosterDialogue[dialogueIndex];
            case "interest": return interestPosterDialogue[dialogueIndex];
            case "credit": return creditDeskDialogue[dialogueIndex];
            case "payment": return paymentPuzzleDialogue[dialogueIndex];
            case "final": return finalDialogue[dialogueIndex];
            case "locked": return lockedDialogue[dialogueIndex];

            case "postLoan": return postLoanGameDialogue[dialogueIndex];
            case "postNeeds": return postNeedsGameDialogue[dialogueIndex];
            case "postInterest": return postInterestGameDialogue[dialogueIndex];
            default: return "";
        }
    }, [dialogueMode, dialogueIndex]);

    const speakerName = "Carmina";
    const currentSpeakingSprite = girlFaceTalking;
    const currentIdleSprite = girlFaceNeutral;

    const canMove = !isDialogueVisible;

    // Movimiento del jugador EXACTAMENTE como unit1/unit2
    const { tilePosition, pixelPosition, isMoving, direction } = usePlayerMovement({
        initialTilePosition: unit3PlayerStart,
        tileSize: unit3TileSize,
        mapMatrix: unit3MapMatrix,
        blockingTileTypes: [1, 2],
        moveDuration: 260,
        canMove,
    });

    const mapDimensions = useMemo(
        () => ({
            width: unit3MapMatrix[0].length * unit3TileSize,
            height: unit3MapMatrix.length * unit3TileSize,
        }),
        []
    );

    const { cameraPosition, viewportRef } = useCameraFollow({
        playerPixelPosition: pixelPosition,
        mapDimensions,
        isEnabled: isMobile,
    });
    // cameraPosition mantiene el desplazamiento del mapa para que el jugador quede centrado en móvil.

    // -------------------------------------------------------------
    // CONTROL DE CLICK EN ZONAS INTERACTIVAS/ Bloqueo de zonas
    // -------------------------------------------------------------

    const handleTileClick = ({ x, y, value }) => {
        if (isDialogueVisible) return;
        if (value !== 2) return;

        const near =
            Math.abs(x - tilePosition.x) <= 1 &&
            Math.abs(y - tilePosition.y) <= 1;
        if (!near) return;

        const zone = unit3InteractiveZones.find((z) => z.x === x && z.y === y);
        if (!zone) return;

        // 🔥 ORDEN DE LAS ACTIVIDADES
        switch (zone.id) {

            // 1️⃣ PRÉSTAMO (siempre primero)
            case "poster_prestamo":
                if (!loanDone) {
                    setDialogueMode("loanIntro");
                } else {
                    setDialogueMode("locked");
                }
                break;

            // 2️⃣ NECESIDADES (requiere préstamo)
            case "poster_necesidades":
            case "biblioteca":
                if (!loanDone) {
                    setDialogueMode("locked");
                } else if (!needsDone) {
                    setDialogueMode("needs");
                } else {
                    setDialogueMode("locked");
                }
                break;

            // 3️⃣ INTERÉS (requiere necesidades)
            case "poster_interes":
                if (!needsDone) {
                    setDialogueMode("locked");
                } else if (!interestDone) {
                    setDialogueMode("interest");
                } else {
                    setDialogueMode("locked");
                }
                break;


            case "computer":
                setDialogueMode("credit");
                break;

            default:
                break;
        }

        setDialogueIndex(0);
    };

    const findNearestInteractive = useCallback(() => {
        const MAX_DISTANCE = 1.25;
        let closest = null;
        let closestDistance = Infinity;

        unit3InteractiveZones.forEach((zone) => {
            const tileValue = unit3MapMatrix?.[zone.y]?.[zone.x];
            if (tileValue !== 2) return;

            const dist = Math.hypot(zone.x - tilePosition.x, zone.y - tilePosition.y);
            if (dist <= MAX_DISTANCE && dist < closestDistance) {
                closest = zone;
                closestDistance = dist;
            }
        });

        return closest;
    }, [tilePosition.x, tilePosition.y]);

    // misma funcion pero sin bloqueo de zonas / para pruebas

    // const handleTileClick = ({ x, y, value }) => {
    //     // Bloquea si ya hay un diálogo o un minijuego abierto
    //     if (isDialogueVisible) return;

    //     // Solo interactúa con tiles de tipo 2
    //     if (value !== 2) return;

    //     // Debe estar cerca (1 tile de distancia)
    //     const near =
    //         Math.abs(x - tilePosition.x) <= 1 &&
    //         Math.abs(y - tilePosition.y) <= 1;

    //     if (!near) return;

    //     // Buscar la zona interactiva correspondiente
    //     const zone = unit3InteractiveZones.find((z) => z.x === x && z.y === y);
    //     if (!zone) return;

    //     // --------------------------------------------
    //     // CONTROL DE INTERACCIONES (VERSIÓN DEBUG)
    //     // --------------------------------------------
    //     switch (zone.type) {

    //         // POSTERS
    //         case "poster":
    //             if (zone.id.includes("prestamo")) {
    //                 setDialogueMode("loanIntro");
    //             } else if (zone.id.includes("necesidades")) {
    //                 setDialogueMode("needs");
    //             } else if (zone.id.includes("interes")) {
    //                 setDialogueMode("interest");
    //             }
    //             break;

    //         // BIBLIOTECA → minijuego de necesidades
    //         case "library":
    //             setDialogueMode("needs");
    //             break;

    //         // ESCRITORIO → préstamo
    //         case "desk":
    //             setDialogueMode("loanIntro");
    //             break;

    //         // COMPUTADOR → crédito / snake
    //         case "computer":
    //             setDialogueMode("credit");
    //             break;

    //         default:
    //             break;
    //     }

    //     // Reiniciar diálogo siempre al comenzar otro
    //     setDialogueIndex(0);
    // };



    // -------------------------------------------------------------
    // CONTROL DEL BOTÓN "SIGUIENTE" EN LOS DIÁLOGOS
    // -------------------------------------------------------------

    const handleDialogueNext = () => {
        const getArray = () => {
            switch (dialogueMode) {
                case "intro": return introDialogue;
                case "loanIntro": return loanIntroDialogue;
                case "loan": return loanPosterDialogue;
                case "needs": return needsPosterDialogue;
                case "interest": return interestPosterDialogue;
                case "credit": return creditDeskDialogue;
                case "payment": return paymentPuzzleDialogue;
                case "final": return finalDialogue;
                case "locked": return lockedDialogue; // ⚠ NUEVO

                case "postLoan": return postLoanGameDialogue;
                case "postNeeds": return postNeedsGameDialogue;
                case "postInterest": return postInterestGameDialogue;
                default: return [];
        }
    };

    useEffect(() => {
        if (!isMobile) return undefined;

        const handleMobileAction = () => {
            if (isDialogueVisible) {
                handleDialogueNext();
                return;
            }

            const nearest = findNearestInteractive();
            if (nearest) {
                const value = unit3MapMatrix?.[nearest.y]?.[nearest.x] ?? 2;
                handleTileClick({ x: nearest.x, y: nearest.y, value });
            }
        };

        window.addEventListener('mobile-action', handleMobileAction);
        return () => window.removeEventListener('mobile-action', handleMobileAction);
    }, [findNearestInteractive, handleDialogueNext, handleTileClick, isDialogueVisible, isMobile]);

        const arr = getArray();

        // Si aún quedan líneas por mostrar
        if (dialogueIndex < arr.length - 1) {
            setDialogueIndex(dialogueIndex + 1);
            return;
        }

        // -----------------------------------------
        // SI SE TERMINÓ EL DIÁLOGO
        // -----------------------------------------

        switch (dialogueMode) {

            case "intro":
                setDialogueMode(null);
                break;

            case "locked":
                // ❌ Bloqueado → cerrar diálogo y NO abrir minijuego
                setDialogueMode(null);
                break;

            // 1️⃣ PRÉSTAMO
            case "loan":
            case "loanIntro":
                setDialogueMode(null);
                setIsLoanGameOpen(true);
                break;

            // 2️⃣ NECESIDADES
            case "needs":
                setDialogueMode(null);
                setIsNeedsGameOpen(true);
                break;

            // 3️⃣ INTERÉS
            case "interest":
                setDialogueMode(null);
                setIsInterestGameOpen(true);
                break;

            // 4️⃣ CRÉDITO / COMPUTADOR (SNAKE)
            case "credit":
                setDialogueMode(null);
                setIsCreditGameOpen(true);
                break;

            // 5️⃣ PUZZLE FINAL
            case "payment":
                setDialogueMode(null);
                setIsPaymentGameOpen(true);
                break;

            // FINAL GENERAL
            case "final":
                setDialogueMode(null);
                if (typeof onGoalReached === "function") onGoalReached();
                break;

            default:
                setDialogueMode(null);
        }

        setDialogueIndex(0);
    };


    // -------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------

    return (
        <div className="unit3-game-container">
            <TileMap
                mapMatrix={unit3MapMatrix}
                tileSize={unit3TileSize}
                mapImage={unit3MapImage}
                onTileClick={handleTileClick}
                cameraPosition={isMobile ? cameraPosition : null}
                viewportRef={isMobile ? viewportRef : null}
            >
                <Player
                    pixelPosition={pixelPosition}
                    tileSize={unit3TileSize}
                    isMoving={isMoving}
                    spriteSheet={girlSpriteSheet}
                    direction={direction}
                />
            </TileMap>

            {/* DIÁLOGO */}
            <DialogueBox
                visible={dialogueMode !== null}
                text={currentDialogueText}
                speakingSprite={currentSpeakingSprite}
                idleSprite={currentIdleSprite}
                speakerName={speakerName}
                onNext={handleDialogueNext}
            />

            {/* MINIJUEGO 1 — PRÉSTAMO */}
            <LoanDragGame
                visible={isLoanGameOpen}
                onComplete={() => {
                    setIsLoanGameOpen(false);
                    setLoanDone(true);

                    setDialogueMode("postLoan");
                    setDialogueIndex(0);
                }}
            />

            <SnakeFinancialGame
                visible={isCreditGameOpen}
                onComplete={() => {
                    setIsCreditGameOpen(false);
                    setCreditDone(true);
                }}
            />

            <NeedsPriorityGame
                visible={isNeedsGameOpen}
                onComplete={() => {
                    setIsNeedsGameOpen(false);
                    setNeedsDone(true);

                    setDialogueMode("postNeeds");
                    setDialogueIndex(0);
                }}
            />

            <InterestRunnerGame
                visible={isInterestGameOpen}
                onComplete={() => {
                    setIsInterestGameOpen(false);
                    setInterestDone(true);

                    setDialogueMode("postInterest");
                    setDialogueIndex(0);

                    setDialogueMode("final");
                    setDialogueIndex(0);
                }}
            />


        </div>);
}
export default Unit3GameScene;
