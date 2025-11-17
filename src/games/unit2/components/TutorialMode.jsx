import React, { useState, useEffect } from 'react';
import { TileMap } from './game/TileMap';
import { Player } from './game/Player';
import DialogueBox from './game/DialogueBox';
import { BudgetZones } from './game/BudgetZones';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { tutorialMap, tutorialInteractiveZones } from './data/tutorialMap';
import { tutorialDialogues } from './data/tutorialDialogues';
import { getSpritesByName } from './data/sprites';

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

  const { position, direction, isMoving } = usePlayerMovement(
    { x: 8, y: 10 },
    tutorialMap
  );

  // -----------------------------------------------------
  // Detecta cuando el jugador entra en una zona interactiva
  // -----------------------------------------------------
  useEffect(() => {
    const zone = tutorialInteractiveZones.find(
      (z) => z.x === position.x && z.y === position.y
    );

    if (zone && !showDialogue) {
      handleZoneInteraction(zone);
    }
  }, [position, showDialogue]);

  // -----------------------------------------------------
  // Maneja la interacción según el tipo de zona
  // -----------------------------------------------------
  const handleZoneInteraction = (zone) => {
    if (zone.type === 'assistant') {
      setCurrentDialogue(tutorialDialogues[tutorialStep]);
      setShowDialogue(true);
    } else if (zone.type === 'budget_table') {
      setShowBudgetZones(true);
    }
  };

  // -----------------------------------------------------
  // Continuar diálogo (MK-25)
  // -----------------------------------------------------
  const handleDialogueContinue = () => {
    // Si quedan diálogos del tutorial
    if (tutorialStep < tutorialDialogues.length - 1) {
      setTutorialStep(tutorialStep + 1);
      setCurrentDialogue(tutorialDialogues[tutorialStep + 1]);
    } else {
      // Último diálogo → cerrar diálogo
      setShowDialogue(false);

      // Mostrar zonas de presupuesto si aún no se han visto
      if (!showBudgetZones) {
        setShowBudgetZones(true);
      }
    }
  };

  // -----------------------------------------------------
  // Cuando el usuario completa las zonas del presupuesto
  // -----------------------------------------------------
  const handleBudgetComplete = (finalBudget) => {
    setBudget(finalBudget);

    // Continuamos con el siguiente paso del tutorial
    if (tutorialStep < tutorialDialogues.length - 1) {
      setTutorialStep(tutorialStep + 1);
      setCurrentDialogue(tutorialDialogues[tutorialStep + 1]);
      setShowDialogue(true);
      setShowBudgetZones(false);
    } else {
      // No quedan más pasos → tutorial finalizado
      onComplete();
    }
  };

  // -----------------------------------------------------
  // Render principal
  // -----------------------------------------------------
  return (
    <div className="tutorial-mode">
      {/* Encabezado del tutorial */}
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

      {/* Viewport del juego */}
      <div className="game-viewport">
        {/* Mapa completo del tutorial */}
        <TileMap mapData={tutorialMap} />

        {/* Jugador */}
        <Player
          position={position}
          direction={direction}
          isMoving={isMoving}
        />

        {/* Zonas interactivas visuales */}
        {tutorialInteractiveZones.map((zone) => (
          <div
            key={zone.id}
            className={`interactive-zone interactive-zone--${zone.type}`}
            style={{
              left: `${zone.x * 64}px`,
              top: `${zone.y * 64}px`,
            }}
          >
            {zone.type === 'assistant' && <span className="zone-icon">🤖</span>}
            {zone.type === 'needs_zone' && <span className="zone-icon">🛒</span>}
            {zone.type === 'wants_zone' && <span className="zone-icon">🎮</span>}
            {zone.type === 'savings_zone' && <span className="zone-icon">🐷</span>}
            {zone.type === 'budget_table' && <span className="zone-icon">📊</span>}
          </div>
        ))}

        {/* Diálogo de MK-25 */}
        {showDialogue && currentDialogue && (() => {
          const speakerName =
            currentDialogue.speaker === 'assistant'
              ? 'MK-25'
              : currentDialogue.speaker === 'player'
              ? 'Tú'
              : 'Sistema';

          const { speakingSprite, idleSprite } = getSpritesByName(speakerName);

          return (
            <DialogueBox
              text={currentDialogue.text}
              speakerName={speakerName}
              onNext={handleDialogueContinue}
              speakingSprite={speakingSprite}
              idleSprite={idleSprite}
            />
          );
        })()}
        {/* Panel de presupuesto (cuando el jugador llega a la mesa) */}
        {showBudgetZones && (
          <BudgetZones
            totalIncome={monthlyIncome}
            currentBudget={budget}
            tutorialMode={true}
            onComplete={handleBudgetComplete}
            onClose={() => setShowBudgetZones(false)}
          />
        )}
      </div>

      {/* Indicador de controles */}
      <div className="controls-hint">
        <p>⬆⬇⬅➡ / WASD para mover | ENTER para interactuar</p>
      </div>
    </div>
  );
}

export default { TutorialMode };
