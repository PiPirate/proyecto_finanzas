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

import React, { useState, useMemo, useCallback } from 'react';
import TileMap from '../core/map/TileMap';
import Player from '../core/player/Player';
import usePlayerMovement from '../core/hooks/usePlayerMovement';

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

const introDialogue = [
    "Bienvenido a la Unidad 3. Hoy aprenderemos cómo funcionan los préstamos.",
    "Cada zona del banco tiene una actividad distinta: préstamo, necesidades, interés, comparación y planificación.",
    "Explora cada sección para desbloquear la comprensión completa de un préstamo real", "ve al cartel de '¿Qué es un préstamo?' y da clic sobre la mesa para comenzar.",
];

const loanIntroDialogue = [
    "Antes de comenzar, déjame explicarte qué es un préstamo.",
    "Cuando pides un préstamo, recibes un monto inicial llamado capital.",
    "Pero a cambio, debes devolver ese dinero más un costo adicional llamado interés.",
    "La suma total que debes pagar se llama deuda.",
    "Y normalmente esa deuda se paga en cuotas fijas cada mes.",
    "Ahora sí, vamos a verlo con un minijuego para entenderlo mejor."
];

const loanPosterDialogue = [
    "Este es el cartel de '¿Qué es un préstamo?'.",
    "Un préstamo siempre implica un capital inicial, un interés y un pago mensual.",
    "¡Vamos a verlo con un minijuego visual!",
];

const needsPosterDialogue = [
    "En esta zona aprenderás por qué algunas razones para pedir un préstamo son válidas y otras no tanto.",
    "Clasifica los gastos entre necesarios y no necesarios.",
];

const interestPosterDialogue = [
    "Aquí aprenderás cómo la tasa de interés cambia el valor final de tu préstamo.",
    "Usa los sliders para ver cómo sube o baja la cuota.",
];

const creditDeskDialogue = [
    "Has encontrado el minujuego oculto de la computadora.",
    "No es necesario terminarlo para completar el modulo, pero si quieres aceptar el reto, adelante",
];

const paymentPuzzleDialogue = [
    "Finalmente, aprenderás a planificar tus pagos en un calendario mensual.",
    "Completa el rompecabezas para equilibrar tus gastos.",
];

const finalDialogue = [
    "¡Excelente! Has completado todas las zonas de la Unidad 3.",
    "Ahora entiendes qué es un préstamo, cuándo usarlo, cómo calcular interés y cómo elegir la mejor oferta.",
    "¡Eres oficialmente una persona financiera nivel PRO!",
];

const lockedDialogue = [
    "Aún no puedes acceder a esta zona.",
    "Primero debes completar la actividad anterior para continuar."
];

// -------------------------------------------------------------
// ESCENA PRINCIPAL
// -------------------------------------------------------------

function Unit3GameScene({ onGoalReached }) {
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

    // -------------------------------------------------------------
    // CONTROL DE CLICK EN ZONAS INTERACTIVAS/ Bloqueo de zonas
    // -------------------------------------------------------------

    // const handleTileClick = ({ x, y, value }) => {
    //     if (isDialogueVisible) return;
    //     if (value !== 2) return;

    //     const near =
    //         Math.abs(x - tilePosition.x) <= 1 &&
    //         Math.abs(y - tilePosition.y) <= 1;
    //     if (!near) return;

    //     const zone = unit3InteractiveZones.find((z) => z.x === x && z.y === y);
    //     if (!zone) return;

    //     // 🔥 ORDEN DE LAS ACTIVIDADES
    //     switch (zone.id) {

    //         // 1️⃣ PRÉSTAMO (siempre primero)
    //         case "poster_prestamo":
    //             if (!loanDone) {
    //                 setDialogueMode("loanIntro");
    //             } else {
    //                 setDialogueMode("locked");
    //             }
    //             break;

    //         // 2️⃣ NECESIDADES (requiere préstamo)
    //         case "poster_necesidades":
    //         case "biblioteca":
    //             if (!loanDone) {
    //                 setDialogueMode("locked");
    //             } else if (!needsDone) {
    //                 setDialogueMode("needs");
    //             } else {
    //                 setDialogueMode("locked");
    //             }
    //             break;

    //         // 3️⃣ INTERÉS (requiere necesidades)
    //         case "poster_interes":
    //             if (!needsDone) {
    //                 setDialogueMode("locked");
    //             } else if (!interestDone) {
    //                 setDialogueMode("interest");
    //             } else {
    //                 setDialogueMode("locked");
    //             }
    //             break;

    //       
    //          case "computer":
    //             setDialogueMode("credit");
    //             break;

    //         default:
    //             break;
    //     }

    //     setDialogueIndex(0);
    // };

    // misma funcion pero sin bloqueo de zonas

    const handleTileClick = ({ x, y, value }) => {
        // Bloquea si ya hay un diálogo o un minijuego abierto
        if (isDialogueVisible) return;

        // Solo interactúa con tiles de tipo 2
        if (value !== 2) return;

        // Debe estar cerca (1 tile de distancia)
        const near =
            Math.abs(x - tilePosition.x) <= 1 &&
            Math.abs(y - tilePosition.y) <= 1;

        if (!near) return;

        // Buscar la zona interactiva correspondiente
        const zone = unit3InteractiveZones.find((z) => z.x === x && z.y === y);
        if (!zone) return;

        // --------------------------------------------
        // CONTROL DE INTERACCIONES (VERSIÓN DEBUG)
        // --------------------------------------------
        switch (zone.type) {

            // POSTERS
            case "poster":
                if (zone.id.includes("prestamo")) {
                    setDialogueMode("loanIntro");
                } else if (zone.id.includes("necesidades")) {
                    setDialogueMode("needs");
                } else if (zone.id.includes("interes")) {
                    setDialogueMode("interest");
                }
                break;

            // BIBLIOTECA → minijuego de necesidades
            case "library":
                setDialogueMode("needs");
                break;

            // ESCRITORIO → préstamo
            case "desk":
                setDialogueMode("loanIntro");
                break;

            // COMPUTADOR → crédito / snake
            case "computer":
                setDialogueMode("credit");
                break;

            default:
                break;
        }

        // Reiniciar diálogo siempre al comenzar otro
        setDialogueIndex(0);
    };



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
                default: return [];
            }
        };

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
                }}
            />

            <InterestRunnerGame
                visible={isInterestGameOpen}
                onComplete={() => {
                    setIsInterestGameOpen(false);
                    setInterestDone(true);
                }}
            />


        </div>);
}
export default Unit3GameScene;
