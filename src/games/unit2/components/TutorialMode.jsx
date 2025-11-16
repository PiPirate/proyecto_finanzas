// src/games/unit2/components/TutorialMode.jsx

import React, { useState, useEffect } from "react";
import TileMap from "./game/TileMap.jsx";
import Player from "./game/Player.jsx";
import DialogueBox from "../../core/dialogue/DialogueBox.jsx";

import { tutorialMap, tutorialInteractiveZones } from "./data/tutorialMap.js";
import { tutorialDialogues } from "./data/tutorialDialogues.js";

export default function TutorialMode({ onComplete }) {
  const [playerPos, setPlayerPos] = useState({ x: 8, y: 10 });
  const [direction, setDirection] = useState("down");
  const [isMoving, setIsMoving] = useState(false);

  const [dialogueQueue, setDialogueQueue] = useState([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [gameState, setGameState] = useState("dialogue"); // inicia en diálogo
  const TILE_SIZE = 64;

  /** INICIO DEL TUTORIAL **/
  useEffect(() => {
    setTimeout(() => {
      startDialogueSequence([
        tutorialDialogues.find((d) => d.id === "intro_1"),
        tutorialDialogues.find((d) => d.id === "intro_2"),
        tutorialDialogues.find((d) => d.id === "cubetas_1"),
        tutorialDialogues.find((d) => d.id === "cubetas_2"),
      ]);
    }, 300);
  }, []);

  const isWalkable = (x, y) => {
    if (y < 0 || y >= tutorialMap.length || x < 0 || x >= tutorialMap[0].length)
      return false;
    return tutorialMap[y][x] === 0;
  };

  const startDialogueSequence = (dialogs) => {
    setDialogueQueue(dialogs);
    setDialogueIndex(0);
    setGameState("dialogue");
  };

  const handleDialogueAdvance = () => {
    if (dialogueIndex < dialogueQueue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setGameState("exploring");
    }
  };

  const handleMove = (dir) => {
    if (gameState !== "exploring") return;

    setDirection(dir);
    let nx = playerPos.x;
    let ny = playerPos.y;

    if (dir === "up") ny--;
    if (dir === "down") ny++;
    if (dir === "left") nx--;
    if (dir === "right") nx++;

    if (isWalkable(nx, ny)) {
      setIsMoving(true);
      setPlayerPos({ x: nx, y: ny });
      setTimeout(() => setIsMoving(false), 200);
    }
  };

  /** INTERACCIÓN CON ZONAS **/
  const handleInteract = () => {
    if (gameState !== "exploring") return;

    let ix = playerPos.x;
    let iy = playerPos.y;

    if (direction === "up") iy--;
    if (direction === "down") iy++;
    if (direction === "left") ix--;
    if (direction === "right") ix++;

    const zone = tutorialInteractiveZones.find((z) => z.x === ix && z.y === iy);

    if (!zone) return;

    switch (zone.id) {
      case "assistant":
        startDialogueSequence([
          tutorialDialogues.find((d) => d.id === "necesidades_1"),
          tutorialDialogues.find((d) => d.id === "gustos_1"),
          tutorialDialogues.find((d) => d.id === "ahorro_1"),
          tutorialDialogues.find((d) => d.id === "regla_1"),
          tutorialDialogues.find((d) => d.id === "practica_1"),
        ]);
        break;

      case "budget_table":
        startDialogueSequence([
          tutorialDialogues.find((d) => d.id === "feedback_1"),
        ]);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1500);
        break;

      default:
        startDialogueSequence([
          {
            speaker: "system",
            text: "Esta zona será importante más adelante.",
            emotion: "neutral",
          },
        ]);
    }
  };

  /** EVENTOS DE TECLADO **/
  useEffect(() => {
    const handleKey = (e) => {
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

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playerPos, dialogueIndex, gameState]);

  return (
    <div className="tutorial-mode">

      {/* MAPA */}
      <div className="tutorial-map-container">
        <TileMap mapData={tutorialMap} />

        {/* PLAYER */}
        <Player
          position={playerPos}
          direction={direction}
          isMoving={isMoving}
        />
      </div>

      {/* DIÁLOGO */}
      {gameState === "dialogue" &&
        dialogueQueue[dialogueIndex] &&
        (() => {
          const dlg = dialogueQueue[dialogueIndex];
          const speaker =
            dlg.speaker === "assistant" ? "Asesor" :
            dlg.speaker === "system" ? "Sistema" :
            "Tú";

          return (
            <DialogueBox
              visible={true}
              text={dlg.text}
              speakerName={speaker}
              speakingSprite={null}
              idleSprite={null}
              onNext={handleDialogueAdvance}
            />
          );
        })()}
    </div>
  );
}
