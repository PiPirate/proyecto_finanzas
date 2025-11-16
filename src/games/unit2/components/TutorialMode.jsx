// TutorialMode.jsx
import React, { useState, useEffect } from 'react';

// Componentes del juego
import TileMap from './game/TileMap';
import Player from '../../core/player/Player';
import DialogueBox from '../../core/dialogue/DialogueBox';
import { BudgetZones } from './game/BudgetZones';

// Nuevo hook de movimiento
import usePlayerMovement from '../../core/hooks/usePlayerMovement';

// Datos del tutorial
import { tutorialMap, tutorialInteractiveZones } from './data/tutorialMap';
import { tutorialDialogues } from './data/tutorialDialogues';

export function TutorialMode({ onComplete, onBackToMenu }) {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showDialogue, setShowDialogue] = useState(true);
  const [currentDialogue, setCurrentDialogue] = useState(tutorialDialogues[0]);
  const [showBudgetZones, setShowBudgetZones] = useState(false);

  const [monthlyIncome] = useState(10000);
  const [budget, setBudget] = useState({
    needs: 0,
    wants: 0,
    savings: 0,
  });

  const tileSize = 64;

  // Nuevo sistema de movimiento
  const {
    tilePosition,
    pixelPosition,
    isMoving,
    direction
  } = usePlayerMovement({
    initialTilePosition: { x: 8, y: 10 },
    tileSize,
    mapMatrix: tutorialMap,
    blockingTileTypes: [1],    // 1 = bloqueado
    interactiveTileTypes: [2], // 2 = zonas interactivas
    moveDuration: 260,
    onStep: handleStep,
  });

  // Llamado cuando el jugador pisa un tile
  function handleStep({ tilePosition }) {
    const zone = tutorialInteractiveZones.find(
      (z) => z.x === tilePosition.x && z.y === tilePosition.y
    );

    if (zone && !showDialogue) {
      handleZoneInteraction(zone);
    }
  }

  function handleZoneInteraction(zone) {
    if (zone.type === "assistant") {
      setCurrentDialogue(tutorialDialogues[tutorialStep]);
      setShowDialogue(true);

    } else if (zone.type === "budget_table") {
      setShowBudgetZones(true);
    }
  }

  // Continuar diálogo
  function handleDialogueContinue() {
    if (tutorialStep < tutorialDialogues.length - 1) {
      setTutorialStep(tutorialStep + 1);
      setCurrentDialogue(tutorialDialogues[tutorialStep + 1]);

    } else {
      setShowDialogue(false);

      if (!showBudgetZones) {
        setShowBudgetZones(true);
      }
    }
  }

  // Presupuesto completado
  function handleBudgetComplete(finalBudget) {
    setBudget(finalBudget);

    if (tutorialStep < tutorialDialogues.length - 1) {
      setTutorialStep(tutorialStep + 1);
      setCurrentDialogue(tutorialDialogues[tutorialStep + 1]);
      setShowDialogue(true);
      setShowBudgetZones(false);

    } else {
      onComplete();
    }
  }

  return (
    <div className="tutorial-mode">

      {/* HEADER */}
      <div className="tutorial-header">
        <div className="tutorial-info">
          <span className="tutorial-step">
            Tutorial: Paso {tutorialStep + 1}/{tutorialDialogues.length}
          </span>
          <span className="tutorial-income">
            Ingreso Mensual: ${monthlyIncome.toLocaleString()}
          </span>
        </div>

        <button 
          onClick={onBackToMenu}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Volver al Menú
        </button>
      </div>

      {/* GAME VIEWPORT */}
      <div className="game-viewport">

        <TileMap mapData={tutorialMap} />

        {/* PLAYER usando pixelPosition */}
        <Player
          pixelPosition={pixelPosition}
          tileSize={tileSize}
          direction={direction}
          isMoving={isMoving}
          spriteSheet={undefined} // aquí pones tu sprite
        />

        {/* Zonas interactivas visibles */}
        {tutorialInteractiveZones.map((zone) => (
          <div
            key={zone.id}
            className={`interactive-zone interactive-zone--${zone.type}`}
            style={{
              left: `${zone.x * tileSize}px`,
              top: `${zone.y * tileSize}px`
            }}
          >
            {zone.type === 'assistant' && "🤖"}
            {zone.type === 'needs_zone' && "🛒"}
            {zone.type === 'wants_zone' && "🎮"}
            {zone.type === 'savings_zone' && "🐷"}
            {zone.type === 'budget_table' && "📊"}
          </div>
        ))}

        {/* Diálogos */}
        {showDialogue && currentDialogue && (
          <DialogueBox
            text={currentDialogue.text}
            speakerName={
              currentDialogue.speaker === 'assistant'
                ? 'MK-25'
                : currentDialogue.speaker === 'player'
                ? 'Tú'
                : 'Sistema'
            }
            onNext={handleDialogueContinue}
            speakingSprite={undefined}
            idleSprite={undefined}
          />
        )}

        {/* Zonas presupuesto */}
        {showBudgetZones && (
          <BudgetZones
            totalIncome={monthlyIncome}
            currentBudget={budget}
            onComplete={handleBudgetComplete}
            tutorialMode={true}
          />
        )}
      </div>

      <div className="tutorial-controls">
        <p style={{ fontSize: "14px", textAlign: "center", opacity: 0.8 }}>
          Usa las flechas ⬆️⬇️⬅️➡️ o WASD para moverte
        </p>
      </div>
    </div>
  );
}
