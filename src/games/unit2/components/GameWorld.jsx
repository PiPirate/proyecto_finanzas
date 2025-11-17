import React, { useState, useEffect, useCallback } from 'react';
import { TileMap } from './game/TileMap';
import { Player } from './game/Player';
import { NPC } from './game/NPC';
import DialogueBox from './game/DialogueBox';
import { BudgetPanel } from './game/BudgetPanel';
import { ExpenseGamePanel } from './game/ExpenseGamePanel';
import { FreelanceGamePanel } from './game/FreelanceGamePanel';
import { MemoryGamePanel } from './game/MemoryGamePanel';

import {
  gameMap,
  interactiveObjects,
  mk25Dialogues,
  zoneDialogues
} from './data/gameMap';

import mk25Sprite from '../assets/mk25sprite.png';

// Estados del juego
const GAME_STATES = {
  EXPLORING: 'exploring',
  DIALOGUE: 'dialogue',
  BUDGET: 'budget',
  EXPENSE_GAME: 'expense_game',
  FREELANCE_GAME: 'freelance_game',
  MEMORY_GAME: 'memory_game',
  TOUR: 'tour'
};

// Direcciones
const DIR = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};

// Waypoints del tour
const TOUR_WAYPOINTS = {
  start: { x: 8, y: 2 },
  needs: { x: 2, y: 9 },
  wants: { x: 10, y: 8 },
  savings: { x: 14, y: 2 },
  end: { x: 8, y: 2 }
};

export function GameWorld({ onComplete } = {}) {
  // Estado del jugador
  const [playerPos, setPlayerPos] = useState({ x: 8, y: 10 });
  const [direction, setDirection] = useState(DIR.DOWN);
  const [isMoving, setIsMoving] = useState(false);

  // Estado del juego
  const [gameState, setGameState] = useState(GAME_STATES.EXPLORING);

  // Estado de diálogos
  const [currentDialogueQueue, setCurrentDialogueQueue] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

  const [currentObject, setCurrentObject] = useState(null);
  const [currentMemoryZone, setCurrentMemoryZone] = useState(null);

  // Estado del tour (MK-25)
  const [mk25Pos, setMk25Pos] = useState(TOUR_WAYPOINTS.start);
  const [mk25Direction, setMk25Direction] = useState(DIR.DOWN);
  const [mk25Moving, setMk25Moving] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [isOnTour, setIsOnTour] = useState(false);

  // Progreso narrativo
  const [storyProgress, setStoryProgress] = useState({
    intro: false,
    learnBudget: false,
    tourStarted: false,
    tourNeedsVisited: false,
    tourWantsVisited: false,
    tourSavingsVisited: false,
    tourCompleted: false,
    needsGameCompleted: false,
    wantsGameCompleted: false,
    savingsGameCompleted: false,
    needsZone: false,
    wantsZone: false,
    savingsZone: false,
    firstChallenge: false,
    finalChallenge: false
  });

  // Presupuesto
  const [playerBudget, setPlayerBudget] = useState({
    needs: 0,
    wants: 0,
    savings: 0
  });

  // Progreso de los 5 días
  const [daysCompleted, setDaysCompleted] = useState(0);

  // Texto inferior de interacción
  const [facingObjectName, setFacingObjectName] = useState(null);

  const TILE_SIZE = 64;

  /* -------------------------------------------------------------
    INTRO AUTOMÁTICO
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!storyProgress.intro) {
      setTimeout(() => {
        startDialogueSequence(mk25Dialogues.intro);
        setStoryProgress(prev => ({ ...prev, intro: true }));
      }, 500);
    }
  }, []);

  /* -------------------------------------------------------------
    OBJETIVO ACTUAL
  ------------------------------------------------------------- */
  const getCurrentObjective = () => {
    if (!storyProgress.learnBudget) return '📊 Ve a la Mesa de Planificación';
    if (!storyProgress.tourStarted) return '🔍 Inicia el tour con MK-25';
    if (!storyProgress.tourCompleted) {
      const missing = [];
      if (!storyProgress.tourNeedsVisited) missing.push('Necesidades 🛒');
      if (!storyProgress.tourWantsVisited) missing.push('Gustos 🎮');
      if (!storyProgress.tourSavingsVisited) missing.push('Ahorro 🐷');
      return `Completa el tour: ${missing.join(', ')}`;
    }
    if (!storyProgress.firstChallenge) return '💻 Ve a la computadora para el primer desafío';
    if (!storyProgress.finalChallenge && daysCompleted < 5)
      return `💻 Completa los 5 días (${daysCompleted}/5)`;
    return '🎉 ¡Ya completaste todo!';
  };

  /* -------------------------------------------------------------
    INICIAR DIÁLOGO
  ------------------------------------------------------------- */
  const startDialogueSequence = (dialogues) => {
    setCurrentDialogueQueue(dialogues);
    setCurrentDialogueIndex(0);
    setGameState(GAME_STATES.DIALOGUE);
  };

  /* -------------------------------------------------------------
    COLISIONES
  ------------------------------------------------------------- */
  const isWalkable = (x, y) => {
    if (y < 0 || y >= gameMap.length || x < 0 || x >= gameMap[0].length) return false;
    return gameMap[y][x] === 0;
  };

  const getObjectAt = (x, y) => {
    return interactiveObjects.find(
      (obj) => Math.abs(obj.x - x) < 0.6 && Math.abs(obj.y - y) < 0.6
    );
  };

  /* -------------------------------------------------------------
    MOVIMIENTO DEL JUGADOR
  ------------------------------------------------------------- */
  const handleMove = useCallback(
    (newDir) => {
      if (gameState !== GAME_STATES.EXPLORING) return;

      setDirection(newDir);

      let newX = playerPos.x;
      let newY = playerPos.y;

      if (newDir === DIR.UP) newY--;
      if (newDir === DIR.DOWN) newY++;
      if (newDir === DIR.LEFT) newX--;
      if (newDir === DIR.RIGHT) newX++;

      const collideMK25 =
        Math.abs(newX - mk25Pos.x) < 0.6 && Math.abs(newY - mk25Pos.y) < 0.6;

      if (isWalkable(newX, newY) && !collideMK25) {
        setIsMoving(true);
        setPlayerPos({ x: newX, y: newY });
        setTimeout(() => setIsMoving(false), 200);
      }

      updateFacingObject(newX, newY, newDir);
    },
    [playerPos, gameState, mk25Pos]
  );

  /* -------------------------------------------------------------
    QUÉ OBJETO ESTÁ MIRANDO EL JUGADOR
  ------------------------------------------------------------- */
  const updateFacingObject = (x, y, dir) => {
    let tx = x;
    let ty = y;

    if (dir === DIR.UP) ty--;
    if (dir === DIR.DOWN) ty++;
    if (dir === DIR.LEFT) tx--;
    if (dir === DIR.RIGHT) tx++;

    const obj = getObjectAt(tx, ty);
    const nearby = obj && Math.abs(x - obj.x) <= 1 && Math.abs(y - obj.y) <= 1;

    setFacingObjectName(nearby ? obj.name : null);
  };

  /* -------------------------------------------------------------
    INTERACTUAR (ENTER / Z / ESPACIO)
  ------------------------------------------------------------- */
  const handleInteract = useCallback(() => {
    if (gameState !== GAME_STATES.EXPLORING) return;

    let ix = playerPos.x;
    let iy = playerPos.y;

    if (direction === DIR.UP) iy--;
    if (direction === DIR.DOWN) iy++;
    if (direction === DIR.LEFT) ix--;
    if (direction === DIR.RIGHT) ix++;

    const obj = getObjectAt(ix, iy);
    if (obj) handleObjectInteraction(obj);
  }, [playerPos, direction, gameState]);

  /* -------------------------------------------------------------
    INTERACCIÓN SEGÚN OBJETO
  ------------------------------------------------------------- */
  const handleObjectInteraction = (obj) => {
    switch (obj.id) {
      case 'mk25_assistant':
        return handleMK25Interaction();

      case 'planning_desk':
        if (!storyProgress.learnBudget) {
          setGameState(GAME_STATES.BUDGET);
        } else {
          startDialogueSequence([
            {
              speaker: 'system',
              text: 'Ya configuraste tu presupuesto. Puedes volver cuando quieras.',
              emotion: 'neutral'
            }
          ]);
        }
        break;

      case 'needs_area':
        return tryStartZoneMinigame('needs', '🛒 Zona de Necesidades');

      case 'wants_area':
        return tryStartZoneMinigame('wants', '🎮 Zona de Gustos');

      case 'savings_area':
        return tryStartZoneMinigame('savings', '🐷 Zona de Ahorro');

      case 'management_pc':
        return handlePCInteraction();

      case 'freelance_desk':
        startDialogueSequence(zoneDialogues.freelance);
        setTimeout(() => setGameState(GAME_STATES.FREELANCE_GAME), 800);
        break;
    }
  };

  /* -------------------------------------------------------------
    INTERACCIÓN CON MK-25
  ------------------------------------------------------------- */
  const handleMK25Interaction = () => {
    if (!storyProgress.learnBudget) {
      return startDialogueSequence([
        {
          speaker: 'assistant',
          text: 'Ve a la Mesa de Planificación para configurar tu presupuesto.',
          emotion: 'neutral'
        }
      ]);
    }

    if (!storyProgress.tourStarted) {
      setStoryProgress((p) => ({ ...p, tourStarted: true }));
      startDialogueSequence(mk25Dialogues.afterBudget);
      return setTimeout(() => startTourMovement(), 500);
    }

    if (!storyProgress.tourCompleted) {
      const missing = [];
      if (!storyProgress.tourNeedsVisited) missing.push('🛒 Necesidades');
      if (!storyProgress.tourWantsVisited) missing.push('🎮 Gustos');
      if (!storyProgress.tourSavingsVisited) missing.push('🐷 Ahorro');

      return startDialogueSequence([
        {
          speaker: 'assistant',
          text: `Aún falta visitar: ${missing.join(', ')}`,
          emotion: 'thinking'
        }
      ]);
    }

    startDialogueSequence(mk25Dialogues.helpReminder);
  };

  /* -------------------------------------------------------------
    INICIO DEL TOUR AUTOMÁTICO
  ------------------------------------------------------------- */
  const startTourMovement = () => {
    setIsOnTour(true);
    setGameState(GAME_STATES.TOUR);
    setCurrentTourStep(1);
    moveToWaypoint(TOUR_WAYPOINTS.needs, () => {
      setGameState(GAME_STATES.DIALOGUE);
      startDialogueSequence([
        {
          speaker: 'assistant',
          text: '🛒 Zona de necesidades: gastos esenciales.',
          emotion: 'neutral'
        },
        {
          speaker: 'assistant',
          text: 'Aquí va el 50% de tu presupuesto.',
          emotion: 'thinking'
        },
        {
          speaker: 'assistant',
          text: '¡Vamos a la siguiente zona!',
          emotion: 'happy'
        }
      ]);
    });
  };

  /* -------------------------------------------------------------
    TE TOCA DECIR:
    👉 “Continuar con la Parte 2”
  ------------------------------------------------------------- */
  /* -------------------------------------------------------------
    MOVER A MK-25 HACIA UN WAYPOINT (ruta automática del tour)
  ------------------------------------------------------------- */
  const moveToWaypoint = (target, onArrive) => {
    setMk25Moving(true);

    const step = () => {
      setMk25Pos(prev => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;

        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          setMk25Moving(false);
          if (onArrive) onArrive();
          return prev;
        }

        const stepX = dx !== 0 ? dx / Math.abs(dx) : 0;
        const stepY = dy !== 0 ? dy / Math.abs(dy) : 0;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (stepX > 0) setMk25Direction(DIR.RIGHT);
          else setMk25Direction(DIR.LEFT);
        } else {
          if (stepY > 0) setMk25Direction(DIR.DOWN);
          else setMk25Direction(DIR.UP);
        }

        return { x: prev.x + stepX * 0.1, y: prev.y + stepY * 0.1 };
      });

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  /* -------------------------------------------------------------
    INICIO DE CADA ZONA DEL TOUR
  ------------------------------------------------------------- */
  const handleTourAdvance = () => {
    if (currentTourStep === 1) {
      setCurrentTourStep(2);
      moveToWaypoint(TOUR_WAYPOINTS.wants, () => {
        startDialogueSequence(mk25Dialogues.tourWants);
      });
    } else if (currentTourStep === 2) {
      setCurrentTourStep(3);
      moveToWaypoint(TOUR_WAYPOINTS.savings, () => {
        startDialogueSequence(mk25Dialogues.tourSavings);
      });
    } else if (currentTourStep === 3) {
      setCurrentTourStep(4);
      moveToWaypoint(TOUR_WAYPOINTS.end, () => {
        setStoryProgress(p => ({ ...p, tourCompleted: true }));
        startDialogueSequence(mk25Dialogues.afterTour);
        setIsOnTour(false);
      });
    }
  };

  /* -------------------------------------------------------------
    INICIAR MINIJUEGO AL ENTRAR A UNA ZONA (si aplica)
  ------------------------------------------------------------- */
  const tryStartZoneMinigame = (zone, zoneLabel) => {
    if (!storyProgress.tourStarted) return;

    const progressKey = `tour${zoneLabel.includes('Necesidades') ? 'Needs'
      : zoneLabel.includes('Gustos') ? 'Wants'
        : 'Savings'}Visited`;

    if (!storyProgress[progressKey]) {
      setStoryProgress(prev => ({ ...prev, [progressKey]: true }));

      if (zone === 'needs')
        startDialogueSequence(zoneDialogues.needs);
      else if (zone === 'wants')
        startDialogueSequence(zoneDialogues.wants);
      else if (zone === 'savings')
        startDialogueSequence(zoneDialogues.savings);

      setTimeout(() => {
        setCurrentMemoryZone(zone);
        setGameState(GAME_STATES.MEMORY_GAME);
      }, 800);
    }
  };

  /* -------------------------------------------------------------
    INTERACCIÓN CON LA COMPUTADORA (simulador principal)
  ------------------------------------------------------------- */
  const handlePCInteraction = () => {
    if (!storyProgress.tourCompleted) {
      startDialogueSequence([
        {
          speaker: 'assistant',
          text: 'Primero completa el tour para entender tu casa y tus gastos.',
          emotion: 'neutral'
        }
      ]);
      return;
    }

    if (!storyProgress.firstChallenge) {
      setStoryProgress(prev => ({ ...prev, firstChallenge: true }));
      startDialogueSequence(mk25Dialogues.beforeSimulation);
      setTimeout(() => {
        setGameState(GAME_STATES.EXPENSE_GAME);
      }, 800);
      return;
    }

    if (!storyProgress.finalChallenge) {
      startDialogueSequence([
        {
          speaker: 'assistant',
          text: 'Continúa trabajando en el simulador hasta completar los 5 días.',
          emotion: 'thinking'
        }
      ]);
      setGameState(GAME_STATES.EXPENSE_GAME);
      return;
    }
  };

  /* -------------------------------------------------------------
    AVANZAR DIÁLOGO
  ------------------------------------------------------------- */
  const handleDialogueNext = () => {
    const nextIndex = currentDialogueIndex + 1;

    if (nextIndex < currentDialogueQueue.length) {
      setCurrentDialogueIndex(nextIndex);
      return;
    }

    setGameState(GAME_STATES.EXPLORING);

    if (isOnTour) {
      handleTourAdvance();
    }
  };

  /* -------------------------------------------------------------
    INPUT DE MOVIMIENTO
  ------------------------------------------------------------- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === GAME_STATES.DIALOGUE) {
        if (e.key === 'Enter' || e.key === ' ') {
          handleDialogueNext();
        }
        return;
      }

      if (gameState !== GAME_STATES.EXPLORING) return;

      if (e.key === 'ArrowUp' || e.key === 'w') handleMove(DIR.UP);
      if (e.key === 'ArrowDown' || e.key === 's') handleMove(DIR.DOWN);
      if (e.key === 'ArrowLeft' || e.key === 'a') handleMove(DIR.LEFT);
      if (e.key === 'ArrowRight' || e.key === 'd') handleMove(DIR.RIGHT);

      if (e.key === 'Enter' || e.key === ' ' || e.key === 'z') {
        handleInteract();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    handleMove,
    handleInteract,
    currentDialogueQueue,
    currentDialogueIndex
  ]);

  /* -------------------------------------------------------------
    ACTUALIZAR PRESUPUESTO DESPUÉS DEL MÓDULO DE PRESUPUESTO
  ------------------------------------------------------------- */
  const handleBudgetComplete = (newBudget) => {
    setPlayerBudget(newBudget);
    setGameState(GAME_STATES.EXPLORING);

    setStoryProgress(prev => ({
      ...prev,
      learnBudget: true
    }));
  };

  /* -------------------------------------------------------------
    COMPLETAR MINIJUEGO DE MEMORIA
  ------------------------------------------------------------- */
  const handleMemoryComplete = () => {
    setGameState(GAME_STATES.EXPLORING);

    if (currentMemoryZone === 'needs')
      setStoryProgress(prev => ({ ...prev, needsGameCompleted: true }));
    if (currentMemoryZone === 'wants')
      setStoryProgress(prev => ({ ...prev, wantsGameCompleted: true }));
    if (currentMemoryZone === 'savings')
      setStoryProgress(prev => ({ ...prev, savingsGameCompleted: true }));

    setCurrentMemoryZone(null);
  };

  /* -------------------------------------------------------------
    COMPLETAR SIMULADOR DE GASTOS (DÍAS 1–5)
  ------------------------------------------------------------- */
  const handleExpenseGameComplete = (results) => {
    const { saved } = results;

    setPlayerBudget(prev => ({
      ...prev,
      savings: prev.savings + saved
    }));

    setDaysCompleted(prev => prev + 1);

    if (daysCompleted + 1 >= 5) {
      setStoryProgress(prev => ({ ...prev, finalChallenge: true }));
      startDialogueSequence([
        {
          speaker: 'assistant',
          text: '¡Completaste todos los días del simulador! Habla conmigo para finalizar.',
          emotion: 'happy'
        }
      ]);
    }

    setGameState(GAME_STATES.EXPLORING);
  };

  /* -------------------------------------------------------------
    COMPLETAR TRABAJO FREELANCE
  ------------------------------------------------------------- */
  const handleFreelanceComplete = (money) => {
    setPlayerBudget(prev => ({
      ...prev,
      savings: prev.savings + money
    }));

    setGameState(GAME_STATES.EXPLORING);
  };
  /* -------------------------------------------------------------
    RENDER PRINCIPAL DEL GAME WORLD
  ------------------------------------------------------------- */
  return (
    <div className="game-world">

      {/* MAPA */}
      <div className="world-map">
        <TileMap mapData={gameMap} />

        {/* NPC PRINCIPAL: MK-25 */}
        <NPC
          x={mk25Pos.x}
          y={mk25Pos.y}
          sprite={mk25Sprite}
          name="MK-25"
          direction={mk25Direction}
          isMoving={mk25Moving}
          tileSize={TILE_SIZE}
        />

        {/* PLAYER */}
        <Player
          position={playerPos}
          direction={direction}
          isMoving={isMoving}
        />
      </div>

      {/* TEXTO DE INTERACCIÓN (abajo) */}
      {facingObjectName && gameState === GAME_STATES.EXPLORING && (
        <div className="interaction-hint">
          <span className="interaction-key">E</span>
          <span className="interaction-text">
            Interactuar con {facingObjectName}
          </span>
        </div>
      )}

      {/* OBJETIVO DEL JUGADOR (arriba izquierda) */}
      <div className="objective-box">
        <p className="objective-title">🎯 Objetivo</p>
        <p className="objective-text">{getCurrentObjective()}</p>
      </div>

      {/* DIÁLOGO */}
      {gameState === GAME_STATES.DIALOGUE && (
        <DialogueBox
          visible={true}
          text={currentDialogueQueue[currentDialogueIndex].text}
          speakerName={
            currentDialogueQueue[currentDialogueIndex].speaker === 'assistant'
              ? 'MK-25'
              : currentDialogueQueue[currentDialogueIndex].speaker
          }
          onNext={handleDialogueNext}
        />
      )}

      {/* PANEL DE PRESUPUESTO */}
      {gameState === GAME_STATES.BUDGET && (
        <BudgetPanel
          totalIncome={10000}
          currentBudget={playerBudget}
          onComplete={handleBudgetComplete}
          onClose={() => setGameState(GAME_STATES.EXPLORING)}
        />
      )}

      {/* SIMULADOR DE GASTOS */}
      {gameState === GAME_STATES.EXPENSE_GAME && (
        <ExpenseGamePanel
          currentDay={daysCompleted + 1}
          playerBudget={playerBudget}
          onComplete={handleExpenseGameComplete}
          onClose={() => setGameState(GAME_STATES.EXPLORING)}
        />
      )}

      {/* TRABAJO FREELANCE */}
      {gameState === GAME_STATES.FREELANCE_GAME && (
        <FreelanceGamePanel
          onComplete={handleFreelanceComplete}
          onClose={() => setGameState(GAME_STATES.EXPLORING)}
        />
      )}

      {/* MINIJUEGO DE MEMORIA */}
      {gameState === GAME_STATES.MEMORY_GAME && (
        <MemoryGamePanel
          zone={currentMemoryZone}
          onComplete={handleMemoryComplete}
          onClose={() => setGameState(GAME_STATES.EXPLORING)}
        />
      )}

      {/* OVERLAY DE PANTALLA NEGRA DURANTE EL TOUR */}
      {isOnTour && (
        <div className="tour-overlay">
          <p className="tour-text">🚶‍♂️ Siguiendo a MK-25...</p>
        </div>
      )}
    </div>
  );
}
export default GameWorld;
