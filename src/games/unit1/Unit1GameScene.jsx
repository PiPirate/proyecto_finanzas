// src/games/unit1/Unit1GameScene.jsx
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import TileMap from '../core/map/TileMap';
import Player from '../core/player/Player';
import usePlayerMovement from '../core/hooks/usePlayerMovement';
import useCameraFollow from '../core/hooks/useCameraFollow';
import DialogueBox from '../core/dialogue/DialogueBox';
import BudgetConsole from './BudgetConsole';
import PiggySavingsGame from './PiggySavingsGame';
import { useDeviceMode } from '../../hooks/useDeviceMode';

import {
  unit1MapMatrix,
  unit1TileSize,
  unit1PlayerStart,
  unit1InteractiveZones,
} from '../../data/games/unit1Map';

import hallImage from '../../assets/unit1/mapa_banco.png';
import girlSpriteSheet from '../../assets/general/la socia caminando.png';

// Rostros
import girlFaceTalking from '../../assets/general/player_face_hablando.png';
import girlFaceNeutral from '../../assets/general/player_face_neutral.png';
import advisorFaceTalking from '../../assets/unit1/asesor_player_talking.png';
import advisorFaceNeutral from '../../assets/unit1/asesor_player_neutral.png';

// Icono del cerdito / alcancía
import pigFace from '../../assets/unit1/icons/pig_icon.png';


import InteractionMarker from '../core/ui/InteractionMarker';


// Monitor neutro
import budgetComputerImage from '../../assets/unit1/null_desktop.png';

import './css/Unit1GameScene.css';

// Diálogo inicial (habla Carmina)
const introDialogue = [
  'Bueno… aquí estamos. Primera unidad del módulo de finanzas...',
  'La verdad, al igual que tú, siempre he querido entender mejor qué pasa con mi dinero: qué entra, qué sale y en qué se va.',
  'Porque muchas veces solo sentimos que “no alcanza”, pero no sabemos exactamente por qué.',
  'En esta unidad vamos a empezar por lo básico: ingresos, gastos y cómo ordenarlos en un presupuesto sencillo.',
  'Para eso vamos a hablar con el asesor financiero de aquella mesa. Él nos ayudará a leer mejor nuestro dinero del día a día.',
  'Acércate a él y haz click en su escritorio para comenzar.',
];

// Diálogo principal con el asesor (multi-personaje)
const advisorMainDialogue = [
  {
    speaker: 'Asesor',
    text: 'Bienvenidos. Me alegra que hayan decidido dedicar un rato a entender su dinero.',
  },
  {
    speaker: 'Asesor',
    text: 'Antes de empezar, pensemos en algo sencillo: el dinero siempre está entrando y saliendo.',
  },
  {
    speaker: 'Asesor',
    text: 'Cuando sabes cuánto entra, cuánto sale y en qué lo gastas, es más fácil tomar decisiones tranquilas.',
  },
  {
    speaker: 'Asesor',
    text: 'En esta unidad vamos a revisar lo básico: ingresos, gastos, ahorro y un presupuesto sencillo.',
  },
  {
    speaker: 'Asesor',
    text: 'Llamamos ingresos a todo el dinero que recibes: mesada, trabajo, ayudas, ventas u otros pagos.',
  },
  {
    speaker: 'Asesor',
    text: 'Llamamos gastos a todo lo que pagas: transporte, comida, datos del celular, salidas y también los pequeños antojos.',
  },
  {
    speaker: 'Asesor',
    text: 'El ahorro es la parte del dinero que decides guardar para más adelante, en lugar de gastarla de inmediato.',
  },
  {
    speaker: 'Carmina',
    text: 'Suena útil. A veces siento que el dinero simplemente desaparece.',
  },
  {
    speaker: 'Asesor',
    text: 'Por eso primero vamos a usar una herramienta para separar ejemplos de ingresos y gastos y verlos juntos en un presupuesto.',
  },
  {
    speaker: 'Asesor',
    text: 'Debes ir a la mesa del presupuesto inicial de al lado y hacer click en el computador.',
  },
  {
    speaker: 'Asesor',
    text: 'Allí verás, de forma visual, cómo se organiza lo que entra, lo que sale y lo que puedes guardar.',
  },
];

// Diálogo corto del asesor después de la primera vez
// (antes de haber terminado el entrenamiento con MK25)
const advisorRepeatDialogue = [
  {
    speaker: 'Asesor',
    text: 'Espero que ya hayan pasado por la mesa de presupuesto para revisar sus ingresos y gastos.',
  },
];

// Escena: regreso al asesor después de terminar con MK25
const advisorPostMkDialogue = [
  {
    speaker: 'Carmina',
    text: 'Asesor, ya organizamos los ejemplos en el presupuesto del computador.',
  },
  {
    speaker: 'Asesor',
    text: '¡Perfecto! Ya viste cómo se ven juntos tus ingresos, tus gastos y cuánto podrías guardar.',
  },
  {
    speaker: 'Asesor',
    text: 'Pero entender los números en pantalla no basta si en el día a día tomas decisiones que vacían tu bolsillo. Ahora veremos cómo se alimenta el ahorro.',
  },
  {
    speaker: 'Carmina',
    text: 'O sea, cómo pasar de solo mirar el presupuesto… a usarlo en la vida real.',
  },
  {
    speaker: 'Asesor',
    text: 'Exacto. Para eso está la alcancía. Allí vas a practicar cómo tus decisiones pequeñas y constantes hacen crecer lo que ahorras.',
  },
  {
    speaker: 'Asesor',
    text: 'Ve hacia la alcancía con forma de cerdito y prepárate para un ejercicio práctico sobre decisiones de gasto y ahorro.',
  },
];

// Diálogo del asesor después de haber dado la instrucción de la alcancía
const advisorWaitPigDialogue = [
  {
    speaker: 'Asesor',
    text: 'Ve primero a la alcancía y pon en práctica lo que aprendiste sobre presupuesto y ahorro.',
  },
];

// Diálogo de reconexión cuando ya terminaste y vuelves a tocar el computador
const reconnectingDialogue = ['Reconectando...'];

// Diálogo de la Alcancía antes del minijuego
const pigIntroDialogue = [
  {
    speaker: 'Alcancía',
    text: 'Hola, soy la Alcancía. Hasta ahora ya sabes algo muy importante: de dónde viene tu dinero y en qué se está yendo.',
  },
  {
    speaker: 'Alcancía',
    text: 'Pero que el dinero alcance no depende solo de hacer una lista. Depende de muchas decisiones pequeñas y constantes.',
  },
  {
    speaker: 'Alcancía',
    text: 'El ahorro aparece cuando eliges guardar una parte de tu dinero en lugar de gastarlo sin pensar.',
  },
  {
    speaker: 'Alcancía',
    text: 'En este ejercicio vas a ver cómo cada decisión hace que tu ahorro crezca, se estanque o incluso retroceda.',
  },
  {
    speaker: 'Alcancía',
    text: 'No se trata de prohibirte todo, sino de entender qué tanto cada gasto cuida o descuida tu bolsillo.',
  },
  {
    speaker: 'Carmina',
    text: 'O sea que aquí voy a probar si mis decisiones están ayudando a mi ahorro o lo están vaciando.',
  },
  {
    speaker: 'Alcancía',
    text: 'Exacto. Vamos a jugar para que lo veas clarito, decisión por decisión.',
  },
];

// Diálogo final del cerdito tras el minijuego (marca unidad completada)
const pigOutroDialogue = [
  {
    speaker: 'Alcancía',
    text: 'Con esto completas el recorrido de la Unidad 1.',
  },
  {
    speaker: 'Alcancía',
    text: 'Ya sabes leer mejor tu dinero: reconocer ingresos, identificar gastos, armar un presupuesto sencillo y hacer que el ahorro crezca con decisiones pequeñas pero constantes.',
  },
  {
    speaker: 'Carmina',
    text: 'Gracias, en serio. Creo que ahora sí entendemos mejor qué pasa con nuestro dinero.',
  },
  {
    speaker: 'Alcancía',
    text: 'Ahora sí estás lista para el siguiente desafío, donde pondrás en práctica todo lo que aprendiste.',
  },
];

// onGoalReached: callback que se dispara cuando la unidad termina del todo
function Unit1GameScene({ onGoalReached }) {
  const { isMobile } = useDeviceMode();

  // 'intro' | 'advisorMain' | 'advisorRepeat' | 'advisorPostMk' | 'advisorWaitPig' | 'reconnecting' | 'pigIntro' | 'pigOutro' | null
  const [dialogueMode, setDialogueMode] = useState('intro');
  const [dialogueIndex, setDialogueIndex] = useState(0);

  // Estados de progreso
  const [advisorMainDone, setAdvisorMainDone] = useState(false);
  const [mkTrainingFinished, setMkTrainingFinished] = useState(false);
  const [advisorPostMkDone, setAdvisorPostMkDone] = useState(false);

  // Menú de presupuesto (monitor MK25)
  const [isBudgetConsoleOpen, setIsBudgetConsoleOpen] = useState(false);

  // Juego del cerdito
  const [pigIntroDone, setPigIntroDone] = useState(false);
  const [isPiggyGameOpen, setIsPiggyGameOpen] = useState(false);

  // Marca que la unidad ya terminó (bloquea movimiento)
  const [unitFinished, setUnitFinished] = useState(false);

  const isDialogueVisible =
    dialogueMode !== null ||
    isBudgetConsoleOpen ||
    isPiggyGameOpen ||
    unitFinished;

  const currentDialogueText = useMemo(() => {
    if (dialogueMode === 'intro') {
      return introDialogue[dialogueIndex] || '';
    }

    if (dialogueMode === 'advisorMain') {
      const entry = advisorMainDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }

    if (dialogueMode === 'advisorRepeat') {
      const entry = advisorRepeatDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }

    if (dialogueMode === 'advisorPostMk') {
      const entry = advisorPostMkDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }

    if (dialogueMode === 'advisorWaitPig') {
      const entry = advisorWaitPigDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }

    if (dialogueMode === 'reconnecting') {
      return reconnectingDialogue[dialogueIndex] || '';
    }

    if (dialogueMode === 'pigIntro') {
      const entry = pigIntroDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }

    if (dialogueMode === 'pigOutro') {
      const entry = pigOutroDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }

    return '';
  }, [dialogueMode, dialogueIndex]);

  const speakerName = useMemo(() => {
    if (dialogueMode === 'intro') return 'Carmina';

    if (dialogueMode === 'advisorMain') {
      const entry = advisorMainDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }

    if (dialogueMode === 'advisorRepeat') {
      const entry = advisorRepeatDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }

    if (dialogueMode === 'advisorPostMk') {
      const entry = advisorPostMkDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }

    if (dialogueMode === 'advisorWaitPig') {
      const entry = advisorWaitPigDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }

    if (dialogueMode === 'reconnecting') {
      return '';
    }

    if (dialogueMode === 'pigIntro') {
      const entry = pigIntroDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }

    if (dialogueMode === 'pigOutro') {
      const entry = pigOutroDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }

    return '';
  }, [dialogueMode, dialogueIndex]);

  // Selección dinámica de rostro según quién hable
  const { currentSpeakingSprite, currentIdleSprite } = useMemo(() => {
    if (!dialogueMode) {
      return { currentSpeakingSprite: null, currentIdleSprite: null };
    }

    if (speakerName === 'Asesor') {
      return {
        currentSpeakingSprite: advisorFaceTalking,
        currentIdleSprite: advisorFaceNeutral,
      };
    }

    if (speakerName === 'Carmina') {
      return {
        currentSpeakingSprite: girlFaceTalking,
        currentIdleSprite: girlFaceNeutral,
      };
    }

    if (speakerName === 'Alcancía' || speakerName === 'Cerdito') {
      return {
        currentSpeakingSprite: pigFace,
        currentIdleSprite: pigFace,
      };
    }

    return {
      currentSpeakingSprite: null,
      currentIdleSprite: null,
    };
  }, [dialogueMode, speakerName]);

  const canMove = !isDialogueVisible;

  const handleStep = useCallback(() => {
    // triggers al pisar, si quieres luego
  }, []);

  const {
    tilePosition,
    pixelPosition,
    isMoving,
    direction,
  } = usePlayerMovement({
    initialTilePosition: unit1PlayerStart,
    tileSize: unit1TileSize,
    mapMatrix: unit1MapMatrix,
    blockingTileTypes: [1, 2],
    interactiveTileTypes: [],
    moveDuration: 260,
    onStep: handleStep,
    canMove,
  });

  const mapDimensions = useMemo(
    () => ({
      width: unit1MapMatrix[0].length * unit1TileSize,
      height: unit1MapMatrix.length * unit1TileSize,
    }),
    [],
  );

  const { cameraPosition, viewportRef } = useCameraFollow({
    playerPixelPosition: pixelPosition,
    mapDimensions,
    isEnabled: isMobile,
  });
  // cameraPosition almacena el offset del mundo para mantener al jugador centrado (clamp dentro del hook).

  const handleTileClick = ({ x, y, value }) => {
    if (isDialogueVisible) return;
    if (value !== 2) return;

    const dx = Math.abs(x - tilePosition.x);
    const dy = Math.abs(y - tilePosition.y);
    if (Math.max(dx, dy) > 1) return;

    const zoneMeta =
      unit1InteractiveZones.find((z) => z.x === x && z.y === y) || null;
    if (!zoneMeta) return;

    // Asesor
    if (zoneMeta.type === 'advisor') {
      if (!advisorMainDone) {
        setDialogueMode('advisorMain');
        setDialogueIndex(0);
      } else if (advisorMainDone && !mkTrainingFinished) {
        setDialogueMode('advisorRepeat');
        setDialogueIndex(0);
      } else if (advisorMainDone && mkTrainingFinished && !advisorPostMkDone) {
        setDialogueMode('advisorPostMk');
        setDialogueIndex(0);
      } else {
        setDialogueMode('advisorWaitPig');
        setDialogueIndex(0);
      }
      return;
    }

    // Mesa de presupuesto (computador)
    if (zoneMeta.type === 'budget-station') {
      if (!advisorMainDone) return;

      if (mkTrainingFinished) {
        setDialogueMode('reconnecting');
        setDialogueIndex(0);
        return;
      }

      setIsBudgetConsoleOpen(true);
      return;
    }

    // Alcancía / cerdito
    if (zoneMeta.type === 'piggy-bank') {
      if (!advisorPostMkDone) return;

      if (!pigIntroDone) {
        setDialogueMode('pigIntro');
        setDialogueIndex(0);
        return;
      }

      // Si ya vimos el intro, abrimos directamente el minijuego
      setIsPiggyGameOpen(true);
      return;
    }
  };

  const currentHintType = useMemo(() => {
    // 1) Antes de asesor principal -> resaltar asesor
    if (!advisorMainDone) return 'advisor';

    // 2) Asesor visto, falta consola de presupuesto -> resaltar mesa presupuesto
    if (advisorMainDone && !mkTrainingFinished) return 'budget-station';

    // 3) Consola lista, falta cerdito -> resaltar piggy
    if (advisorPostMkDone && !pigIntroDone) return 'piggy-bank';

    // 4) Si ya hiciste todo -> nada
    return null;
  }, [advisorMainDone, mkTrainingFinished, advisorPostMkDone, pigIntroDone]);



  const findNearestInteractive = useCallback(() => {
    const MAX_DISTANCE = 1.25;

    let closest = null;
    let closestDistance = Infinity;

    unit1InteractiveZones.forEach((zone) => {
      const tileValue = unit1MapMatrix?.[zone.y]?.[zone.x];
      if (tileValue !== 2) return;

      const dist = Math.hypot(zone.x - tilePosition.x, zone.y - tilePosition.y);
      if (dist <= MAX_DISTANCE && dist < closestDistance) {
        closest = zone;
        closestDistance = dist;
      }
    });

    return closest;
  }, [tilePosition.x, tilePosition.y]);

  const handleDialogueNext = () => {
    if (dialogueMode === 'intro') {
      if (dialogueIndex < introDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
      }
      return;
    }

    if (dialogueMode === 'advisorMain') {
      if (dialogueIndex < advisorMainDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
        setAdvisorMainDone(true);
      }
      return;
    }

    if (dialogueMode === 'advisorRepeat') {
      if (dialogueIndex < advisorRepeatDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
      }
      return;
    }

    if (dialogueMode === 'advisorPostMk') {
      if (dialogueIndex < advisorPostMkDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
        setAdvisorPostMkDone(true);
      }
      return;
    }

    if (dialogueMode === 'advisorWaitPig') {
      if (dialogueIndex < advisorWaitPigDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
      }
      return;
    }

    if (dialogueMode === 'reconnecting') {
      if (dialogueIndex < reconnectingDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
      }
      return;
    }

    if (dialogueMode === 'pigIntro') {
      if (dialogueIndex < pigIntroDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
        setPigIntroDone(true);
        setIsPiggyGameOpen(true); // lanza el minijuego del cerdito
      }
      return;
    }

    if (dialogueMode === 'pigOutro') {
      if (dialogueIndex < pigOutroDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        // Aquí SÍ se termina de verdad el tutorial (después del cerdito)
        setDialogueMode(null);
        setDialogueIndex(0);
        setUnitFinished(true);

        // Avisamos hacia arriba para que TutorialStage muestre el modal
        if (typeof onGoalReached === 'function') {
          onGoalReached();
        }
      }
      return;
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
        const value = unit1MapMatrix?.[nearest.y]?.[nearest.x] ?? 2;
        handleTileClick({ x: nearest.x, y: nearest.y, value });
      }
    };

    window.addEventListener('mobile-action', handleMobileAction);
    return () => window.removeEventListener('mobile-action', handleMobileAction);
  }, [findNearestInteractive, handleDialogueNext, handleTileClick, isDialogueVisible, isMobile]);

  return (
    <div className="unit1-game-container">
      <TileMap
        mapMatrix={unit1MapMatrix}
        tileSize={unit1TileSize}
        mapImage={hallImage}
        onTileClick={handleTileClick}
        cameraPosition={isMobile ? cameraPosition : null}
        viewportRef={isMobile ? viewportRef : null}
      >
        {currentHintType &&
          unit1InteractiveZones
            .filter((zone) => zone.type === currentHintType)
            .map((zone) => (
              <InteractionMarker
                key={`${zone.x}-${zone.y}-${zone.type}`}
                tileX={zone.x}
                tileY={zone.y}
                tileSize={unit1TileSize}
              />
            ))}

        <Player
          pixelPosition={pixelPosition}
          tileSize={unit1TileSize}
          isMoving={isMoving}
          spriteSheet={girlSpriteSheet}
          direction={direction}
        />
      </TileMap>

      <DialogueBox
        visible={dialogueMode !== null}
        text={currentDialogueText}
        speakingSprite={currentSpeakingSprite}
        idleSprite={currentIdleSprite}
        speakerName={speakerName}
        onNext={handleDialogueNext}
      />

      <BudgetConsole
        visible={isBudgetConsoleOpen}
        computerImage={budgetComputerImage}
        onTrainingFinished={() => {
          setIsBudgetConsoleOpen(false);
          setMkTrainingFinished(true);
        }}
      />

      <PiggySavingsGame
        visible={isPiggyGameOpen}
        onFinished={() => {
          setIsPiggyGameOpen(false);   // se cierra la ventana del juego
          setDialogueMode('pigOutro'); // y pasamos al diálogo final del cerdito
          setDialogueIndex(0);
        }}
      />
    </div>
  );
}

export default Unit1GameScene;
