import React, { useState, useEffect, useCallback } from 'react';
import { TileMap } from './game/TileMap';
import { Player } from './game/Player';
import { NPC } from './game/NPC';
import { DialogueBox } from './game/DialogueBox';
import { BudgetPanel } from './game/BudgetPanel';
import { ExpenseGamePanel } from './game/ExpenseGamePanel';
import { FreelanceGamePanel } from './game/FreelanceGamePanel';
import { MemoryGamePanel } from './game/MemoryGamePanel';
import { gameMap, interactiveObjects, mk25Dialogues, zoneDialogues } from './data/gameMap';

type GameState = 'exploring' | 'dialogue' | 'budget' | 'expense_game' | 'freelance_game' | 'memory_game' | 'tour';
type Direction = 'up' | 'down' | 'left' | 'right';

interface PlayerPosition {
  x: number;
  y: number;
}

interface StoryProgress {
  intro: boolean;
  learnBudget: boolean;
  tourStarted: boolean;
  tourNeedsVisited: boolean;
  tourWantsVisited: boolean;
  tourSavingsVisited: boolean;
  tourCompleted: boolean;
  needsGameCompleted: boolean;
  wantsGameCompleted: boolean;
  savingsGameCompleted: boolean;
  needsZone: boolean;
  wantsZone: boolean;
  savingsZone: boolean;
  firstChallenge: boolean;
  finalChallenge: boolean;
}

// Posiciones del tour
const TOUR_WAYPOINTS = {
  start: { x: 8, y: 2 },      // Posición inicial de MK-25
  needs: { x: 2, y: 8 },       // Refrigerador
  wants: { x: 8, y: 8 },       // Zona de Ocio
  savings: { x: 13, y: 8 },    // Alcancía
  end: { x: 8, y: 2 },         // Regresa a su posición
};

interface GameWorldProps {
  onComplete?: () => void;
}

export function GameWorld({ onComplete }: GameWorldProps = {}) {
  const [playerPos, setPlayerPos] = useState<PlayerPosition>({ x: 8, y: 10 });
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [gameState, setGameState] = useState<GameState>('exploring');
  const [currentDialogueQueue, setCurrentDialogueQueue] = useState<any[]>([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [currentObject, setCurrentObject] = useState<any>(null);
  const [currentMemoryZone, setCurrentMemoryZone] = useState<'needs' | 'wants' | 'savings' | null>(null);
  
  // Estados del tour
  const [mk25Pos, setMk25Pos] = useState<PlayerPosition>(TOUR_WAYPOINTS.start);
  const [mk25Direction, setMk25Direction] = useState<Direction>('down');
  const [mk25Moving, setMk25Moving] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0); // 0: no iniciado, 1: needs, 2: wants, 3: savings, 4: return
  const [isOnTour, setIsOnTour] = useState(false);
  const [tourPhase, setTourPhase] = useState<'moving' | 'dialogue' | 'idle'>('idle'); // Controlar fases del tour
  
  const [storyProgress, setStoryProgress] = useState<StoryProgress>({
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
    finalChallenge: false,
  });

  const [playerBudget, setPlayerBudget] = useState({
    needs: 0,
    wants: 0,
    savings: 0,
  });

  const [daysCompleted, setDaysCompleted] = useState(0);
  const [showObjective, setShowObjective] = useState(true);

  const TILE_SIZE = 64;

  // Mostrar intro automáticamente al inicio
  useEffect(() => {
    if (!storyProgress.intro) {
      setTimeout(() => {
        startDialogueSequence(mk25Dialogues.intro);
        setStoryProgress(prev => ({ ...prev, intro: true }));
      }, 500);
    }
  }, []);

  const getCurrentObjective = () => {
    if (!storyProgress.learnBudget) {
      return "📊 Ve a la Mesa de Planificación (arriba izquierda) y habla con ella";
    }
    if (!storyProgress.tourStarted) {
      return "🔍 Inicia el tour para aprender sobre las zonas";
    }
    if (!storyProgress.tourCompleted) {
      const missing = [];
      if (!storyProgress.tourNeedsVisited) missing.push("Necesidades 🛒");
      if (!storyProgress.tourWantsVisited) missing.push("Gustos 🎮");
      if (!storyProgress.tourSavingsVisited) missing.push("Ahorro 🐷");
      return `🔍 Completa el tour: ${missing.join(", ")}`;
    }
    if (!storyProgress.firstChallenge) {
      return "💻 Ve a la Computadora de Gestión (arriba derecha) para tu primer desafío";
    }
    if (!storyProgress.finalChallenge && daysCompleted < 5) {
      return `💻 Completa el desafío del mes (${daysCompleted}/5 días)`;
    }
    return "🎉 ¡Completaste todo! Puedes seguir practicando en la computadora";
  };

  const startDialogueSequence = (dialogues: any[]) => {
    setCurrentDialogueQueue(dialogues);
    setCurrentDialogueIndex(0);
    setGameState('dialogue');
  };

  const isWalkable = (x: number, y: number): boolean => {
    if (y < 0 || y >= gameMap.length || x < 0 || x >= gameMap[0].length) {
      return false;
    }
    return gameMap[y][x] === 0;
  };

  const getObjectAt = (x: number, y: number) => {
    return interactiveObjects.find((obj) => obj.x === x && obj.y === y);
  };

  const handleMove = useCallback((newDir: Direction) => {
    if (gameState !== 'exploring') return;

    setDirection(newDir);

    let newX = playerPos.x;
    let newY = playerPos.y;

    switch (newDir) {
      case 'up':
        newY -= 1;
        break;
      case 'down':
        newY += 1;
        break;
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
    }

    if (isWalkable(newX, newY)) {
      setIsMoving(true);
      setPlayerPos({ x: newX, y: newY });
      setTimeout(() => setIsMoving(false), 200);
    }
  }, [playerPos, gameState]);

  const handleInteract = useCallback(() => {
    if (gameState !== 'exploring') return;

    let interactX = playerPos.x;
    let interactY = playerPos.y;

    switch (direction) {
      case 'up':
        interactY -= 1;
        break;
      case 'down':
        interactY += 1;
        break;
      case 'left':
        interactX -= 1;
        break;
      case 'right':
        interactX += 1;
        break;
    }

    const obj = getObjectAt(interactX, interactY);
    
    if (obj) {
      setCurrentObject(obj);
      handleObjectInteraction(obj);
    }
  }, [playerPos, direction, gameState, storyProgress]);

  const handleObjectInteraction = (obj: any) => {
    switch (obj.id) {
      case 'mk25_assistant':
        handleMK25Interaction();
        break;
      
      case 'planning_desk':
        if (!storyProgress.learnBudget) {
          setGameState('budget');
        } else {
          startDialogueSequence([{
            speaker: 'system',
            text: 'Ya configuraste tu presupuesto. Puedes volver aquí si necesitas ajustarlo más adelante.',
            emotion: 'neutral',
          }]);
        }
        break;
      
      case 'needs_area':
        // Minijuego opcional después del tour
        if (!storyProgress.tourCompleted) {
          startDialogueSequence([{
            speaker: 'system',
            text: '⚠️ Primero completa el tour con MK-25 para desbloquear los minijuegos.',
            emotion: 'neutral',
          }]);
        } else {
          startDialogueSequence([{
            speaker: 'system',
            text: '🛒 Zona de Necesidades. ¿Quieres jugar el minijuego de memoria para repasar?',
            emotion: 'neutral',
          }, {
            speaker: 'system',
            text: '[Presiona ENTER para jugar]',
            emotion: 'neutral',
          }]);
          setTimeout(() => {
            setCurrentMemoryZone('needs');
            setGameState('memory_game');
          }, 100);
        }
        break;
      
      case 'wants_area':
        // Minijuego opcional después del tour
        if (!storyProgress.tourCompleted) {
          startDialogueSequence([{
            speaker: 'system',
            text: '⚠️ Primero completa el tour con MK-25 para desbloquear los minijuegos.',
            emotion: 'neutral',
          }]);
        } else {
          startDialogueSequence([{
            speaker: 'system',
            text: '🎮 Zona de Gustos. ¿Quieres jugar el minijuego de memoria para repasar?',
            emotion: 'neutral',
          }, {
            speaker: 'system',
            text: '[Presiona ENTER para jugar]',
            emotion: 'neutral',
          }]);
          setTimeout(() => {
            setCurrentMemoryZone('wants');
            setGameState('memory_game');
          }, 100);
        }
        break;
      
      case 'savings_area':
        // Minijuego opcional después del tour
        if (!storyProgress.tourCompleted) {
          startDialogueSequence([{
            speaker: 'system',
            text: '⚠️ Primero completa el tour con MK-25 para desbloquear los minijuegos.',
            emotion: 'neutral',
          }]);
        } else {
          startDialogueSequence([{
            speaker: 'system',
            text: '🐷 Zona de Ahorro. ¿Quieres jugar el minijuego de memoria para repasar?',
            emotion: 'neutral',
          }, {
            speaker: 'system',
            text: '[Presiona ENTER para jugar]',
            emotion: 'neutral',
          }]);
          setTimeout(() => {
            setCurrentMemoryZone('savings');
            setGameState('memory_game');
          }, 100);
        }
        break;
      
      case 'management_pc':
        if (playerBudget.needs === 0 && playerBudget.wants === 0 && playerBudget.savings === 0) {
          startDialogueSequence([{
            speaker: 'system',
            text: 'Primero necesitas configurar tu presupuesto en la Mesa de Planificación.',
            emotion: 'neutral',
          }]);
        } else if (!storyProgress.tourCompleted) {
          startDialogueSequence([{
            speaker: 'assistant',
            text: 'Primero completa el tour para entender las zonas. Explora el refrigerador, la zona de ocio y la alcancía.',
            emotion: 'thinking',
          }]);
        } else {
          startDialogueSequence(mk25Dialogues.beforeSimulation);
          setTimeout(() => {
            setGameState('expense_game');
          }, 100);
        }
        break;
      
      case 'freelance_desk':
        if (playerBudget.needs === 0 && playerBudget.wants === 0 && playerBudget.savings === 0) {
          startDialogueSequence([{
            speaker: 'system',
            text: 'Primero necesitas configurar tu presupuesto.',
            emotion: 'neutral',
          }]);
        } else {
          startDialogueSequence(zoneDialogues.freelance);
          setTimeout(() => {
            setGameState('freelance_game');
          }, 1000);
        }
        break;
    }
  };

  const handleMK25Interaction = () => {
    if (!storyProgress.learnBudget) {
      startDialogueSequence([{
        speaker: 'assistant',
        text: 'Recuerda: ve a la Mesa de Planificación (arriba a la izquierda) para configurar tu presupuesto.',
        emotion: 'neutral',
      }]);
    } else if (!storyProgress.tourStarted) {
      // Iniciar el tour automático
      setStoryProgress(prev => ({ ...prev, tourStarted: true }));
      startDialogueSequence(mk25Dialogues.afterBudget);
      // Después del diálogo, iniciar movimiento automático
      setTimeout(() => {
        startTourMovement();
      }, 500);
    } else if (!storyProgress.tourCompleted) {
      const missing = [];
      if (!storyProgress.needsGameCompleted) missing.push('Refrigerador 🛒');
      if (!storyProgress.wantsGameCompleted) missing.push('Zona de Ocio 🎮');
      if (!storyProgress.savingsGameCompleted) missing.push('Alcancía 🐷');
      
      startDialogueSequence([{
        speaker: 'assistant',
        text: `Completa el tour visitando: ${missing.join(', ')}. ¡Te espero cuando termines!`,
        emotion: 'thinking',
      }]);
    } else if (!storyProgress.firstChallenge) {
      startDialogueSequence(mk25Dialogues.afterTour);
    } else {
      startDialogueSequence(mk25Dialogues.helpReminder);
    }
  };

  // Sistema de movimiento automático del tour
  const startTourMovement = () => {
    setIsOnTour(true);
    setGameState('tour');
    setCurrentTourStep(1);
    // Mover a la primera zona (Necesidades)
    moveToWaypoint(TOUR_WAYPOINTS.needs, () => {
      // Llegamos a la zona de necesidades
      setGameState('dialogue');
      startDialogueSequence([
        {
          speaker: 'assistant',
          text: '🛒 Esta es la zona del REFRIGERADOR. Representa tus NECESIDADES.',
          emotion: 'happy',
        },
        {
          speaker: 'assistant',
          text: 'Las necesidades son gastos esenciales para vivir: comida, servicios básicos, transporte al trabajo, medicinas...',
          emotion: 'neutral',
        },
        {
          speaker: 'assistant',
          text: 'Según la regla 50-30-20, debes destinar el 50% de tu salario a necesidades.',
          emotion: 'thinking',
        },
        {
          speaker: 'assistant',
          text: '¡Ahora vamos a la siguiente zona! Sígueme...',
          emotion: 'happy',
        }
      ]);
      // El diálogo se continuará automáticamente cuando el jugador presione ENTER
    });
  };

  const continueTourToWants = () => {
    setGameState('tour');
    setCurrentTourStep(2);
    moveToWaypoint(TOUR_WAYPOINTS.wants, () => {
      setGameState('dialogue');
      startDialogueSequence([
        {
          speaker: 'assistant',
          text: '🎮 Esta es la ZONA DE OCIO. Representa tus GUSTOS.',
          emotion: 'happy',
        },
        {
          speaker: 'assistant',
          text: 'Los gustos son cosas que disfrutas pero no son esenciales: streaming, salidas, hobbies, ropa de moda...',
          emotion: 'neutral',
        },
        {
          speaker: 'assistant',
          text: 'Según la regla 50-30-20, puedes destinar el 30% de tu salario a gustos. ¡Diviértete sin culpa!',
          emotion: 'thinking',
        },
        {
          speaker: 'assistant',
          text: 'Última parada del tour... ¡Vamos!',
          emotion: 'happy',
        }
      ]);
      // El diálogo se continuará automáticamente cuando el jugador presione ENTER
    });
  };

  const continueTourToSavings = () => {
    setGameState('tour');
    setCurrentTourStep(3);
    moveToWaypoint(TOUR_WAYPOINTS.savings, () => {
      setGameState('dialogue');
      startDialogueSequence([
        {
          speaker: 'assistant',
          text: '🐷 Esta es la ALCANCÍA. Representa tu AHORRO.',
          emotion: 'happy',
        },
        {
          speaker: 'assistant',
          text: 'El ahorro es dinero que guardas para el futuro: emergencias, metas grandes, inversiones, jubilación...',
          emotion: 'neutral',
        },
        {
          speaker: 'assistant',
          text: 'Según la regla 50-30-20, debes ahorrar el 20% de tu salario. ¡Tu yo del futuro te lo agradecerá!',
          emotion: 'thinking',
        },
        {
          speaker: 'assistant',
          text: '¡Tour completado! Ahora regreso a mi puesto...',
          emotion: 'happy',
        }
      ]);
      // El diálogo se continuará automáticamente cuando el jugador presione ENTER
    });
  };

  const returnToBase = () => {
    setGameState('tour');
    setCurrentTourStep(4);
    setIsOnTour(false);
    moveToWaypoint(TOUR_WAYPOINTS.end, () => {
      setGameState('dialogue');
      startDialogueSequence([
        {
          speaker: 'assistant',
          text: '✅ ¡Excelente! Ya conoces las 3 categorías del presupuesto 50-30-20.',
          emotion: 'happy',
        },
        {
          speaker: 'assistant',
          text: 'Ahora puedes INTERACTUAR con cada zona (Refrigerador 🛒, Zona de Ocio 🎮, Alcancía 🐷) para jugar minijuegos y aprender más.',
          emotion: 'thinking',
        },
        {
          speaker: 'assistant',
          text: 'Cuando estés listo, ve a la COMPUTADORA DE GESTIÓN 💻 (arriba derecha) para empezar el simulador de 5 días. ¡Suerte!',
          emotion: 'happy',
        }
      ]);
      
      // Llamar al callback onComplete cuando termine el tour
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 2000); // 2 segundos después del último diálogo
      }
    });
  };

  const moveToWaypoint = (target: PlayerPosition, onComplete: () => void) => {
    const movementSteps: PlayerPosition[] = [];
    let current = { ...mk25Pos };
    
    // Pathfinding simple: primero horizontal, luego vertical
    while (current.x !== target.x) {
      current = { ...current, x: current.x + (target.x > current.x ? 1 : -1) };
      movementSteps.push({ ...current });
    }
    while (current.y !== target.y) {
      current = { ...current, y: current.y + (target.y > current.y ? 1 : -1) };
      movementSteps.push({ ...current });
    }
    
    // Ejecutar movimiento paso a paso
    let stepIndex = 0;
    const moveInterval = setInterval(() => {
      if (stepIndex >= movementSteps.length) {
        clearInterval(moveInterval);
        setMk25Moving(false);
        onComplete();
        return;
      }
      
      const nextStep = movementSteps[stepIndex];
      const prevStep = stepIndex > 0 ? movementSteps[stepIndex - 1] : mk25Pos;
      
      // Determinar dirección
      if (nextStep.x > prevStep.x) setMk25Direction('right');
      else if (nextStep.x < prevStep.x) setMk25Direction('left');
      else if (nextStep.y > prevStep.y) setMk25Direction('down');
      else if (nextStep.y < prevStep.y) setMk25Direction('up');
      
      setMk25Moving(true);
      setMk25Pos(nextStep);
      
      // Mover al jugador para que siga a MK-25 (con un paso de delay)
      if (stepIndex > 0) {
        const playerTarget = movementSteps[stepIndex - 1];
        setPlayerPos(playerTarget);
        
        // Actualizar dirección del jugador
        if (playerTarget.x > playerPos.x) setDirection('right');
        else if (playerTarget.x < playerPos.x) setDirection('left');
        else if (playerTarget.y > playerPos.y) setDirection('down');
        else if (playerTarget.y < playerPos.y) setDirection('up');
        
        setIsMoving(true);
        setTimeout(() => setIsMoving(false), 200);
      }
      
      stepIndex++;
    }, 300);
  };

  const checkZonesComplete = () => {
    setTimeout(() => {
      if (storyProgress.needsZone && storyProgress.wantsZone && storyProgress.savingsZone) {
        startDialogueSequence(mk25Dialogues.afterZones);
      }
    }, 100);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === 'enter' || key === ' ' || key === 'z') {
        e.preventDefault();
        if (gameState === 'dialogue') {
          handleDialogueAdvance();
        } else {
          handleInteract();
        }
        return;
      }

      if (gameState !== 'exploring') return;

      switch (key) {
        case 'arrowup':
        case 'w':
          e.preventDefault();
          handleMove('up');
          break;
        case 'arrowdown':
        case 's':
          e.preventDefault();
          handleMove('down');
          break;
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          handleMove('left');
          break;
        case 'arrowright':
        case 'd':
          e.preventDefault();
          handleMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleInteract, gameState, currentDialogueIndex, currentDialogueQueue]);

  const handleDialogueAdvance = () => {
    if (currentDialogueIndex < currentDialogueQueue.length - 1) {
      // Avanzar al siguiente diálogo
      setCurrentDialogueIndex(currentDialogueIndex + 1);
    } else {
      // Terminó la secuencia de diálogos
      const isLastDialogue = currentDialogueIndex === currentDialogueQueue.length - 1;
      
      // Detectar si estamos en el tour
      if (isOnTour && currentTourStep === 1 && isLastDialogue && !storyProgress.tourWantsVisited) {
        // Terminó explicación de Necesidades → ir a Gustos
        setGameState('exploring');
        setStoryProgress(prev => ({ ...prev, tourNeedsVisited: true }));
        setTimeout(() => {
          continueTourToWants();
        }, 500);
      } else if (isOnTour && currentTourStep === 2 && isLastDialogue && !storyProgress.tourSavingsVisited) {
        // Terminó explicación de Gustos → ir a Ahorro
        setGameState('exploring');
        setStoryProgress(prev => ({ ...prev, tourWantsVisited: true }));
        setTimeout(() => {
          continueTourToSavings();
        }, 500);
      } else if (isOnTour && currentTourStep === 3 && isLastDialogue && !storyProgress.tourCompleted) {
        // Terminó explicación de Ahorro → regresar a base
        setGameState('exploring');
        setStoryProgress(prev => ({ ...prev, tourSavingsVisited: true, tourCompleted: true }));
        setTimeout(() => {
          returnToBase();
        }, 500);
      } else {
        // Diálogo normal
        setGameState('exploring');
      }
      
      setCurrentDialogueQueue([]);
      setCurrentDialogueIndex(0);
      setCurrentObject(null);
    }
  };

  const handleBudgetComplete = (budget: any) => {
    setPlayerBudget(budget);
    setStoryProgress(prev => ({ ...prev, learnBudget: true }));
    setGameState('exploring');
    setCurrentObject(null);
    
    setTimeout(() => {
      startDialogueSequence(mk25Dialogues.afterBudget);
    }, 500);
  };

  const handleExpenseGameComplete = (results: any) => {
    setPlayerBudget(results.finalBudget);
    setDaysCompleted(prev => prev + 1);
    
    if (!storyProgress.firstChallenge) {
      setStoryProgress(prev => ({ ...prev, firstChallenge: true }));
      setTimeout(() => {
        startDialogueSequence(mk25Dialogues.afterFirstChallenge);
      }, 500);
    }
    
    if (daysCompleted + 1 >= 5 && !storyProgress.finalChallenge) {
      setStoryProgress(prev => ({ ...prev, finalChallenge: true }));
      setTimeout(() => {
        startDialogueSequence(mk25Dialogues.finalComplete);
      }, 500);
    }
    
    setGameState('exploring');
    setCurrentObject(null);
  };

  const totalBudget = playerBudget.needs + playerBudget.wants + playerBudget.savings;

  return (
    <div className="game-world">
      <div className="game-hud">
        <div className="hud-info">
          <span>💰 ${totalBudget.toLocaleString()}</span>
          <span>📅 Días: {daysCompleted}/5</span>
        </div>
        <div className="hud-controls">
          <span>WASD/Flechas: Mover | ENTER/Z: Interactuar</span>
        </div>
      </div>

      {showObjective && (
        <div className="objective-banner">
          <div className="objective-content">
            <span className="objective-icon">🎯</span>
            <span className="objective-text">{getCurrentObjective()}</span>
            <button className="objective-close" onClick={() => setShowObjective(false)}>✕</button>
          </div>
        </div>
      )}

      <div className="game-viewport">
        <TileMap mapData={gameMap} />

        {interactiveObjects
          .filter(obj => {
            // No mostrar MK-25 como objeto interactivo si está en tour
            if (obj.id === 'mk25_assistant' && isOnTour) return false;
            // No mostrar MK-25 como objeto si ya iniciamos el tour
            if (obj.id === 'mk25_assistant' && storyProgress.tourStarted && !storyProgress.tourCompleted) return false;
            return true;
          })
          .map((obj) => {
          const isNearby = Math.abs(playerPos.x - obj.x) <= 1 && Math.abs(playerPos.y - obj.y) <= 1;
          const facingObject = 
            (direction === 'up' && playerPos.x === obj.x && playerPos.y === obj.y + 1) ||
            (direction === 'down' && playerPos.x === obj.x && playerPos.y === obj.y - 1) ||
            (direction === 'left' && playerPos.x === obj.x + 1 && playerPos.y === obj.y) ||
            (direction === 'right' && playerPos.x === obj.x - 1 && playerPos.y === obj.y);

          return (
            <div
              key={obj.id}
              className={`interactive-object interactive-object--${obj.type}`}
              style={{
                position: 'absolute',
                left: `${obj.x * TILE_SIZE}px`,
                top: `${obj.y * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              <span className="object-icon">{obj.icon}</span>
              <div className="object-label">{obj.name}</div>
              {isNearby && facingObject && (
                <div className="interaction-prompt">▼ ENTER</div>
              )}
            </div>
          );
        })}

        <Player position={playerPos} direction={direction} isMoving={isMoving} />
        <NPC 
          x={mk25Pos.x} 
          y={mk25Pos.y} 
          icon="🤖" 
          name="MK-25" 
          direction={mk25Direction} 
          isMoving={mk25Moving}
          tileSize={TILE_SIZE}
        />
      </div>

      {gameState === 'dialogue' && currentDialogueQueue[currentDialogueIndex] && (
        <DialogueBox 
          dialogue={currentDialogueQueue[currentDialogueIndex]} 
          onClose={handleDialogueAdvance}
        />
      )}

      {gameState === 'budget' && (
        <BudgetPanel
          totalIncome={10000}
          currentBudget={playerBudget}
          onComplete={handleBudgetComplete}
          onClose={() => setGameState('exploring')}
        />
      )}

      {gameState === 'expense_game' && (
        <ExpenseGamePanel
          currentDay={daysCompleted + 1}
          playerBudget={playerBudget}
          onComplete={handleExpenseGameComplete}
          onClose={() => setGameState('exploring')}
        />
      )}

      {gameState === 'freelance_game' && (
        <FreelanceGamePanel
          currentDay={daysCompleted + 1}
          playerBudget={playerBudget}
          onComplete={handleExpenseGameComplete}
          onClose={() => setGameState('exploring')}
        />
      )}

      {gameState === 'memory_game' && currentMemoryZone && (
        <MemoryGamePanel
          zone={currentMemoryZone}
          onComplete={() => {
            // Marcar juego como completado (opcional, no afecta el tour)
            setStoryProgress(prev => ({
              ...prev,
              [`${currentMemoryZone}GameCompleted`]: true
            }));
            
            setGameState('exploring');
            setCurrentMemoryZone(null);
          }}
          onClose={() => {
            setGameState('exploring');
            setCurrentMemoryZone(null);
          }}
        />
      )}
    </div>
  );
}