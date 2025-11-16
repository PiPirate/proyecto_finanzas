import React, { useState, useEffect, useCallback } from 'react';
import TileMap from './game/TileMap.jsx';
import Player from './game/Player.jsx';
import NPC from './game/NPC.jsx';
import DialogueBox from '../../core/dialogue/DialogueBox.jsx';
import BudgetPanel from "./game/BudgetPanel.jsx";
import ExpenseGamePanel from "./game/ExpenseGamePanel.jsx";
import FreelanceGamePanel from "./game/FreelanceGamePanel.jsx";
import MemoryGamePanel from './game/MemoryGamePanel.jsx';

import {
  gameMap,
  interactiveObjects,
  mk25Dialogues,
  zoneDialogues
} from './data/gameMap.js';

export default function GameWorld({ onComplete }) {

  const [playerPos, setPlayerPos] = useState({ x: 8, y: 10 });
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);

  const [gameState, setGameState] = useState('exploring');
  const [currentDialogueQueue, setCurrentDialogueQueue] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [currentObject, setCurrentObject] = useState(null);
  const [currentMemoryZone, setCurrentMemoryZone] = useState(null);

  // MK-25 tour states
  const [mk25Pos, setMk25Pos] = useState({ x: 8, y: 2 });
  const [mk25Direction, setMk25Direction] = useState('down');
  const [mk25Moving, setMk25Moving] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [isOnTour, setIsOnTour] = useState(false);
  const [tourPhase, setTourPhase] = useState('idle');

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

  const TOUR_WAYPOINTS = {
    start: { x: 8, y: 2 },
    needs: { x: 2, y: 8 },
    wants: { x: 8, y: 8 },
    savings: { x: 13, y: 8 },
    end: { x: 8, y: 2 },
  };

  useEffect(() => {
    if (!storyProgress.intro) {
      setTimeout(() => {
        startDialogueSequence(mk25Dialogues.intro);
        setStoryProgress(prev => ({ ...prev, intro: true }));
      }, 500);
    }
  }, []);

  const getCurrentObjective = () => {
    if (!storyProgress.learnBudget)
      return "📊 Ve a la Mesa de Planificación (arriba izquierda) y habla con ella";

    if (!storyProgress.tourStarted)
      return "🔍 Inicia el tour para aprender sobre las zonas";

    if (!storyProgress.tourCompleted) {
      const missing = [];
      if (!storyProgress.tourNeedsVisited) missing.push("Necesidades 🛒");
      if (!storyProgress.tourWantsVisited) missing.push("Gustos 🎮");
      if (!storyProgress.tourSavingsVisited) missing.push("Ahorro 🐷");
      return `🔍 Completa el tour: ${missing.join(", ")}`;
    }

    if (!storyProgress.firstChallenge)
      return "💻 Ve a la Computadora de Gestión para tu primer desafío";

    if (!storyProgress.finalChallenge && daysCompleted < 5)
      return `💻 Avanza con el desafío del mes (${daysCompleted}/5 días)`;

    return "🎉 ¡Completaste todo!";
  };

  const startDialogueSequence = (dialogues) => {
    setCurrentDialogueQueue(dialogues);
    setCurrentDialogueIndex(0);
    setGameState("dialogue");
  };

  const isWalkable = (x, y) => {
    if (y < 0 || y >= gameMap.length || x < 0 || x >= gameMap[0].length)
      return false;
    return gameMap[y][x] === 0;
  };

  const getObjectAt = (x, y) =>
    interactiveObjects.find((obj) => obj.x === x && obj.y === y);

  const handleMove = useCallback((newDir) => {
    if (gameState !== "exploring") return;

    setDirection(newDir);

    let newX = playerPos.x;
    let newY = playerPos.y;

    if (newDir === "up") newY--;
    if (newDir === "down") newY++;
    if (newDir === "left") newX--;
    if (newDir === "right") newX++;

    if (isWalkable(newX, newY)) {
      setIsMoving(true);
      setPlayerPos({ x: newX, y: newY });
      setTimeout(() => setIsMoving(false), 200);
    }
  }, [playerPos, gameState]);

  const handleInteract = useCallback(() => {
    if (gameState !== "exploring") return;

    // Tile que está justo enfrente
    let ix = playerPos.x;
    let iy = playerPos.y;

    if (direction === "up") iy--;
    if (direction === "down") iy++;
    if (direction === "left") ix--;
    if (direction === "right") ix++;

    // 1️⃣ Primero: intentar tile exacto enfrente
    let obj = getObjectAt(ix, iy);

    // 2️⃣ Si no hay objeto enfrente, intentar cualquier zona muy cerca (1 tile)
    if (!obj) {
      obj = interactiveObjects.find(o =>
        Math.abs(o.x - playerPos.x) <= 1 &&
        Math.abs(o.y - playerPos.y) <= 1
      );
    }

    // 3️⃣ Si al final hay objeto → interactuar
    if (obj) {
      setCurrentObject(obj);
      handleObjectInteraction(obj);
    }
  }, [playerPos, direction, gameState, storyProgress]);


  const handleObjectInteraction = (obj) => {

    switch (obj.id) {

      case "mk25_assistant":
        handleMK25Interaction();
        break;

      case "planning_desk":
        if (!storyProgress.learnBudget) {
          setGameState("budget");
        } else {
          startDialogueSequence([
            {
              speaker: "system",
              text: "Ya configuraste tu presupuesto.",
              emotion: "neutral",
            },
          ]);
        }
        break;

      case "needs_area":
      case "wants_area":
      case "savings_area":
        if (!storyProgress.tourCompleted) {
          startDialogueSequence([
            {
              speaker: "system",
              text: "⚠️ Completa el tour primero.",
              emotion: "neutral",
            },
          ]);
        } else {
          const zone =
            obj.id === "needs_area"
              ? "needs"
              : obj.id === "wants_area"
                ? "wants"
                : "savings";

          setTimeout(() => {
            setCurrentMemoryZone(zone);
            setGameState("memory_game");
          }, 100);
        }
        break;

      case "management_pc":
        if (!storyProgress.learnBudget) {
          startDialogueSequence([
            {
              speaker: "system",
              text: "Primero configura tu presupuesto.",
              emotion: "neutral",
            },
          ]);
        } else if (!storyProgress.tourCompleted) {
          startDialogueSequence([
            {
              speaker: "assistant",
              text: "Primero completa el tour.",
              emotion: "thinking",
            },
          ]);
        } else {
          startDialogueSequence(mk25Dialogues.beforeSimulation);
          setTimeout(() => {
            setGameState("expense_game");
          }, 100);
        }
        break;

      case "freelance_desk":
        startDialogueSequence(zoneDialogues.freelance);
        setTimeout(() => {
          setGameState("freelance_game");
        }, 1000);
        break;
    }
  };

  const handleMK25Interaction = () => {

    if (!storyProgress.learnBudget) {
      startDialogueSequence([
        {
          speaker: "assistant",
          text: "Ve a la Mesa de Planificación.",
          emotion: "neutral",
        },
      ]);
      return;
    }

    if (!storyProgress.tourStarted) {
      setStoryProgress(prev => ({ ...prev, tourStarted: true }));
      startDialogueSequence(mk25Dialogues.afterBudget);
      setTimeout(() => startTourMovement(), 500);
      return;
    }

    if (!storyProgress.tourCompleted) {
      startDialogueSequence([
        {
          speaker: "assistant",
          text: "Termina el tour.",
          emotion: "thinking",
        },
      ]);
      return;
    }

    if (!storyProgress.firstChallenge) {
      startDialogueSequence(mk25Dialogues.afterTour);
      return;
    }

    startDialogueSequence(mk25Dialogues.helpReminder);
  };

  // TOUR MOVEMENT
  const startTourMovement = () => {
    setIsOnTour(true);
    setGameState("tour");
    setCurrentTourStep(1);

    moveToWaypoint(TOUR_WAYPOINTS.needs, () => {
      setGameState("dialogue");
      startDialogueSequence([
        {
          speaker: "assistant",
          text: "🛒 Zona del REFRIGERADOR. Representa tus NECESIDADES.",
          emotion: "happy",
        },
        {
          speaker: "assistant",
          text: "Debes destinar el 50% de tus ingresos a necesidades.",
          emotion: "thinking",
        },
        {
          speaker: "assistant",
          text: "¡Vamos a la siguiente zona!",
          emotion: "happy",
        },
      ]);
    });
  };

  const continueTourToWants = () => {
    setGameState("tour");
    setCurrentTourStep(2);

    moveToWaypoint(TOUR_WAYPOINTS.wants, () => {
      setGameState("dialogue");
      startDialogueSequence([
        {
          speaker: "assistant",
          text: "🎮 Esta es la zona de GUSTOS.",
          emotion: "happy",
        },
        {
          speaker: "assistant",
          text: "Puedes usar aquí el 30% de tu presupuesto.",
          emotion: "thinking",
        },
        {
          speaker: "assistant",
          text: "Última parada...",
          emotion: "happy",
        },
      ]);
    });
  };

  const continueTourToSavings = () => {
    setGameState("tour");
    setCurrentTourStep(3);

    moveToWaypoint(TOUR_WAYPOINTS.savings, () => {
      setGameState("dialogue");
      startDialogueSequence([
        {
          speaker: "assistant",
          text: "🐷 Alcancía: tu AHORRO.",
          emotion: "happy",
        },
        {
          speaker: "assistant",
          text: "Aquí va el 20% de tu presupuesto.",
          emotion: "neutral",
        },
        {
          speaker: "assistant",
          text: "¡Tour completado! Volvamos.",
          emotion: "happy",
        },
      ]);
    });
  };

  const returnToBase = () => {
    setGameState("tour");
    setCurrentTourStep(4);

    moveToWaypoint(TOUR_WAYPOINTS.end, () => {
      setGameState("dialogue");
      startDialogueSequence([
        {
          speaker: "assistant",
          text: "¡Excelente! Ya conoces las 3 zonas del presupuesto.",
          emotion: "happy",
        },
      ]);

      if (onComplete) setTimeout(onComplete, 2000);
    });
  };

  const moveToWaypoint = (target, onFinish) => {

    const steps = [];
    let current = { ...mk25Pos };

    while (current.x !== target.x) {
      current.x += target.x > current.x ? 1 : -1;
      steps.push({ ...current });
    }
    while (current.y !== target.y) {
      current.y += target.y > current.y ? 1 : -1;
      steps.push({ ...current });
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        setMk25Moving(false);
        onFinish();
        return;
      }

      const next = steps[i];
      const prev = i === 0 ? mk25Pos : steps[i - 1];

      if (next.x > prev.x) setMk25Direction("right");
      if (next.x < prev.x) setMk25Direction("left");
      if (next.y > prev.y) setMk25Direction("down");
      if (next.y < prev.y) setMk25Direction("up");

      setMk25Moving(true);
      setMk25Pos(next);

      if (i > 0) {
        setPlayerPos(steps[i - 1]);
        setIsMoving(true);
        setTimeout(() => setIsMoving(false), 200);
      }

      i++;
    }, 300);
  };

  // DIALOGUE ADVANCE
  const handleDialogueAdvance = () => {

    if (currentDialogueIndex < currentDialogueQueue.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      return;
    }

    const last = currentDialogueIndex === currentDialogueQueue.length - 1;

    if (isOnTour && last) {
      if (currentTourStep === 1 && !storyProgress.tourWantsVisited) {
        setStoryProgress(p => ({ ...p, tourNeedsVisited: true }));
        setTimeout(() => continueTourToWants(), 500);
      }

      else if (currentTourStep === 2 && !storyProgress.tourSavingsVisited) {
        setStoryProgress(p => ({ ...p, tourWantsVisited: true }));
        setTimeout(() => continueTourToSavings(), 500);
      }

      else if (currentTourStep === 3 && !storyProgress.tourCompleted) {
        setStoryProgress(p => ({
          ...p,
          tourSavingsVisited: true,
          tourCompleted: true
        }));
        setTimeout(() => returnToBase(), 500);
      }
    }

    setGameState("exploring");
    setCurrentDialogueQueue([]);
    setCurrentDialogueIndex(0);
    setCurrentObject(null);
  };

  // KEYBOARD HANDLING
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (key === "enter" || key === " " || key === "z") {
        e.preventDefault();

        if (gameState === "dialogue") handleDialogueAdvance();
        else handleInteract();
        return;
      }

      if (gameState !== "exploring") return;

      if (key === "arrowup" || key === "w") handleMove("up");
      if (key === "arrowdown" || key === "s") handleMove("down");
      if (key === "arrowleft" || key === "a") handleMove("left");
      if (key === "arrowright" || key === "d") handleMove("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

  }, [handleMove, handleInteract, gameState, currentDialogueIndex, currentDialogueQueue]);

  const handleBudgetComplete = (budget) => {
    setPlayerBudget(budget);
    setStoryProgress(prev => ({ ...prev, learnBudget: true }));
    setGameState("exploring");
    setCurrentObject(null);

    setTimeout(() => startDialogueSequence(mk25Dialogues.afterBudget), 500);
  };

  const handleExpenseGameComplete = (results) => {
    setPlayerBudget(results.finalBudget);
    setDaysCompleted(prev => prev + 1);

    if (!storyProgress.firstChallenge) {
      setStoryProgress(p => ({ ...p, firstChallenge: true }));
      setTimeout(() => startDialogueSequence(mk25Dialogues.afterFirstChallenge), 500);
    }

    if (daysCompleted + 1 >= 5 && !storyProgress.finalChallenge) {
      setStoryProgress(p => ({ ...p, finalChallenge: true }));
      setTimeout(() => startDialogueSequence(mk25Dialogues.finalComplete), 500);
    }

    setGameState("exploring");
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
            <button className="objective-close" onClick={() => setShowObjective(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="game-viewport">

        <TileMap mapData={gameMap} />

        {interactiveObjects
          .filter(obj => {
            if (obj.id === 'mk25_assistant' && isOnTour) return false;
            if (obj.id === 'mk25_assistant' && storyProgress.tourStarted && !storyProgress.tourCompleted) return false;
            return true;
          })
          .map(obj => {

            const isNearby =
              Math.abs(playerPos.x - obj.x) <= 1 &&
              Math.abs(playerPos.y - obj.y) <= 1;

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
                  zIndex: 5
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

        <Player
          position={playerPos}
          direction={direction}
          isMoving={isMoving}
        />

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

      {gameState === "dialogue" &&
        currentDialogueQueue[currentDialogueIndex] &&
        (() => {
          const dialogue = currentDialogueQueue[currentDialogueIndex];
          const speakerName =
            dialogue.speaker === "assistant"
              ? "MK-25"
              : dialogue.speaker === "player"
                ? "Tú"
                : "Sistema";

          return (
            <DialogueBox
              visible={true}
              text={dialogue.text}
              speakerName={speakerName}
              speakingSprite={null}
              idleSprite={null}
              onNext={handleDialogueAdvance}
            />
          );
        })()}

      {gameState === "budget" && (
        <BudgetPanel
          totalIncome={10000}
          currentBudget={playerBudget}
          onComplete={handleBudgetComplete}
          onClose={() => setGameState("exploring")}
        />
      )}

      {gameState === "expense_game" && (
        <ExpenseGamePanel
          currentDay={daysCompleted + 1}
          playerBudget={playerBudget}
          onComplete={handleExpenseGameComplete}
          onClose={() => setGameState("exploring")}
        />
      )}

      {gameState === "freelance_game" && (
        <FreelanceGamePanel
          currentDay={daysCompleted + 1}
          playerBudget={playerBudget}
          onComplete={handleExpenseGameComplete}
          onClose={() => setGameState("exploring")}
        />
      )}

      {gameState === "memory_game" && currentMemoryZone && (
        <MemoryGamePanel
          zone={currentMemoryZone}
          onComplete={() => {
            setStoryProgress(prev => ({
              ...prev,
              [`${currentMemoryZone}GameCompleted`]: true
            }));
            setGameState("exploring");
            setCurrentMemoryZone(null);
          }}
          onClose={() => {
            setGameState("exploring");
            setCurrentMemoryZone(null);
          }}
        />
      )}

    </div>
  );
}
