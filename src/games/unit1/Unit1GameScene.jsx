// src/games/unit1/Unit1GameScene.jsx
import React, { useCallback, useState, useMemo } from 'react';
import TileMap from '../core/map/TileMap';
import Player from '../core/player/Player';
import usePlayerMovement from '../core/hooks/usePlayerMovement';
import DialogueBox from '../core/dialogue/DialogueBox';
import BudgetConsole from './BudgetConsole';
import PiggySavingsGame from './PiggySavingsGame';

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

// Monitor neutro
import budgetComputerImage from '../../assets/unit1/null_desktop.png';

import './css/Unit1GameScene.css';

// Diálogo inicial (habla Carmina)
const introDialogue = [
  'Bueno… aquí estamos. Primera unidad del módulo de finanzas...',
  'La verdad, al igual que tú, siempre he querido aprender a organizar mejor mi dinero...',
  'Pero nunca supe muy bien por dónde empezar.',
  'Aquí vamos a aprender a convertir nuestras ideas sueltas en metas claras y alcanzables.',
  'Para empezar, vamos a hablar con el asesor financiero de aquella mesa. Él nos guiará por todo este proceso.',
  'Acércate a él y haz click en su escritorio para comenzar.',
];

// Diálogo principal con el asesor (multi-personaje)
const advisorMainDialogue = [
  {
    speaker: 'Asesor',
    text: 'Bienvenidos. Me alegra que hayan decidido empezar a organizar su dinero.',
  },
  {
    speaker: 'Asesor',
    text: 'Antes de comenzar, quiero que piensen en algo: todos tenemos deseos, sueños o planes...',
  },
  {
    speaker: 'Asesor',
    text: 'Pero si no los convertimos en metas concretas, se vuelven difíciles de alcanzar.',
  },
  {
    speaker: 'Asesor',
    text: 'Así que en esta unidad aprenderán a darle forma a esas ideas..',
  },
  {
    speaker: 'Asesor',
    text: 'convertir lo que “quieres algún día” en objetivos medibles, con números, fechas y pasos realistas.',
  },
  {
    speaker: 'Asesor',
    text: 'Luego aprenderán a crear un presupuesto simple para que sepan cómo distribuir su dinero.',
  },
  {
    speaker: 'Asesor',
    text: 'Y por último verán cómo una buena estrategia de ahorro hace que ese objetivo deje de ser un sueño y empiece a ser algo totalmente posible.',
  },
  {
    speaker: 'Carmina',
    text: 'Suena genial. ¿Cuál es el siguiente paso?',
  },
  {
    speaker: 'Asesor',
    text: 'Primero vamos a transformar una meta vaga en una meta clara.',
  },
  {
    speaker: 'Asesor',
    text: 'Para eso deben ir a la mesa de presupuesto inicial de al lado y darle click.',
  },
  {
    speaker: 'Asesor',
    text: 'Allí podrán experimentar de forma visual cómo se estructura un objetivo.',
  },
];

// Diálogo corto del asesor después de la primera vez
// (antes de haber terminado el entrenamiento con MK25)
const advisorRepeatDialogue = [
  {
    speaker: 'Asesor',
    text: 'Espero que ya hayan pasado por la mesa de presupuesto.',
  },
];

// Escena: regreso al asesor después de terminar con MK25
const advisorPostMkDialogue = [
  {
    speaker: 'Carmina',
    text: 'Asesor, hemos terminado.',
  },
  {
    speaker: 'Asesor',
    text: '¡Perfecto! Ya completaste la parte más importante: aprender a definir metas de forma clara y realista.',
  },
  {
    speaker: 'Asesor',
    text: 'Pero una meta, incluso bien definida, no sirve de nada si no tienes un plan para avanzar hacia ella. Por eso ahora veremos cómo se alimenta el ahorro.',
  },
  {
    speaker: 'Carmina',
    text: 'O sea, cómo pasar del papel… a la acción real.',
  },
  {
    speaker: 'Asesor',
    text: 'Exacto. Para eso está la alcancía. Allí vas a practicar cómo tus decisiones pequeñas y constantes hacen crecer tu progreso.',
  },
  {
    speaker: 'Asesor',
    text: 'Ve hacia la alcancía con forma de cerdito y prepárate para un ejercicio práctico.',
  },
];

// Diálogo del asesor después de haber dado la instrucción de la alcancía
const advisorWaitPigDialogue = [
  {
    speaker: 'Asesor',
    text: 'Te estaré esperando. Ve a la alcancía con forma de cerdito para continuar.',
  },
];

// Diálogo de reconexión cuando ya terminaste y vuelves a tocar el computador
const reconnectingDialogue = ['Reconectando...'];

// Diálogo de la Alcancía antes del minijuego
const pigIntroDialogue = [
  {
    speaker: 'Alcancía',
    text: 'Hola, soy la Alcancía. Hasta ahora ya sabes algo muy poderoso: tener metas claras, con un monto y un plazo. Pero esas metas no se cumplen solas.',
  },
  {
    speaker: 'Alcancía',
    text: 'Para que de verdad se puedan alcanzar, necesitas algo más que buenas intenciones: decisiones pequeñas y constantes. ',
  },
  {
    speaker: 'Alcancía',
    text: 'Eso es el ahorro. Cada vez que eliges guardar un poquito en lugar de gastarlo sin pensar, estás moviendo tu meta del “algún día” al “sí va a pasar”.',
  },
  {
    speaker: 'Alcancía',
    text: 'Por eso este paso es tan importante: aquí vas a ver cómo cada decisión suma o resta a tu objetivo.',
  },
  {
    speaker: 'Alcancía',
    text: 'No se trata de prohibirte todo, sino de entender qué tanto te acerca o te aleja de lo que quieres lograr.',
  },
  {
    speaker: 'Carmina',
    text: 'O sea que aquí voy a probar si mis decisiones están ayudando o saboteando mi meta.',
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
    text: 'Ya sabes: Tener metas específicas, organizarlas en un presupuesto, y alimentarlas con decisiones pequeñas pero consistentes.',
  },
  {
    speaker: 'Carmina',
    text: 'Gracias, en serio. Creo que ahora sí entendemos cómo funciona todo.',
  },
  {
    speaker: 'Alcancía',
    text: '¡Estás lista para el desafío final! El lugar donde pondrás en práctica todo lo que aprendiste.',
  },
];

// onComplete: callback que se dispara cuando la unidad termina del todo
function Unit1GameScene({ onComplete }) {
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

  const isDialogueVisible =
    dialogueMode !== null || isBudgetConsoleOpen || isPiggyGameOpen;

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
        setDialogueMode(null);
        setDialogueIndex(0);
        // Aquí marcamos la unidad como completada y avisamos al padre
        if (onComplete) {
          onComplete();
        }
      }
      return;
    }
  };

  return (
    <div className="unit1-game-container">
      <TileMap
        mapMatrix={unit1MapMatrix}
        tileSize={unit1TileSize}
        mapImage={hallImage}
        onTileClick={handleTileClick}
      >
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
