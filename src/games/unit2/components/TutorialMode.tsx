import React, { useState, useEffect } from 'react';
import { TileMap } from './game/TileMap';
import { Player } from './game/Player';
import DialogueBox from '../../core/dialogue/DialogueBox';
import { BudgetZones } from './game/BudgetZones';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { tutorialMap, tutorialInteractiveZones } from './data/tutorialMap';
import { tutorialDialogues } from './data/tutorialDialogues';

interface TutorialModeProps {
  onComplete: () => void;
  onBackToMenu: () => void;
}

export function TutorialMode({ onComplete, onBackToMenu }: TutorialModeProps) {
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

  // Detectar interacciones con zonas
  useEffect(() => {
    const zone = tutorialInteractiveZones.find(
      (z) => z.x === position.x && z.y === position.y
    );

    if (zone && !showDialogue) {
      handleZoneInteraction(zone);
    }
  }, [position]);

  const handleZoneInteraction = (zone: any) => {
    if (zone.type === 'assistant') {
      setCurrentDialogue(tutorialDialogues[tutorialStep]);
      setShowDialogue(true);
    } else if (zone.type === 'budget_table') {
      setShowBudgetZones(true);
    }
  };

  const handleDialogueContinue = () => {
    if (tutorialStep < tutorialDialogues.length - 1) {
      setTutorialStep(tutorialStep + 1);
      setCurrentDialogue(tutorialDialogues[tutorialStep + 1]);
    } else {
      setShowDialogue(false);
      // Si completamos todos los diálogos, mostrar zonas de presupuesto
      if (!showBudgetZones) {
        setShowBudgetZones(true);
      }
    }
  };

  const handleBudgetComplete = (finalBudget: typeof budget) => {
    setBudget(finalBudget);
    // Continuar con el siguiente paso del tutorial
    if (tutorialStep < tutorialDialogues.length - 1) {
      setTutorialStep(tutorialStep + 1);
      setCurrentDialogue(tutorialDialogues[tutorialStep + 1]);
      setShowDialogue(true);
      setShowBudgetZones(false);
    } else {
      // Tutorial completado
      onComplete();
    }
  };

  return (
    <div className="tutorial-mode">
      <div className="tutorial-header">
        <div className="tutorial-info">
          <span className="tutorial-step">Tutorial: Paso {tutorialStep + 1}/{tutorialDialogues.length}</span>
          <span className="tutorial-income">Ingreso Mensual: ${monthlyIncome.toLocaleString()}</span>
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

      <div className="game-viewport">
        {/* ASSET: Mapa de la casa */}
        <TileMap mapData={tutorialMap} />

        {/* Jugador */}
        <Player
          position={position}
          direction={direction}
          isMoving={isMoving}
        />

        {/* Zonas interactivas (visual) */}
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

        {/* Diálogos del asistente */}
        {showDialogue && currentDialogue && (() => {
          const speakerName = currentDialogue.speaker === 'assistant' ? 'MK-25' : currentDialogue.speaker === 'player' ? 'Tú' : 'Sistema';
          
          return (
            <DialogueBox
              text={currentDialogue.text}
              speakerName={speakerName}
              onNext={handleDialogueContinue}
              speakingSprite={undefined} // TODO: Add sprite imports
              idleSprite={undefined} // TODO: Add sprite imports
            />
          );
        })()}

        {/* Zonas de presupuesto interactivas */}
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
        <p style={{ fontSize: '14px', textAlign: 'center', opacity: 0.8 }}>
          Usa las flechas ⬆️⬇️⬅️➡️ o WASD para moverte
        </p>
      </div>
    </div>
  );
}