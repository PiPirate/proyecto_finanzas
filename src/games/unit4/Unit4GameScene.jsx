// src/games/unit4/Unit4GameScene.jsx
import React, { useCallback, useMemo, useState } from 'react';
import TileMap from '../core/map/TileMap';
import Player from '../core/player/Player';
import usePlayerMovement from '../core/hooks/usePlayerMovement';
import { DialogueBoxUnit4 } from '../core/dialogue/DialogueBox';

import {
  unit4MapMatrix,
  unit4TileSize,
  unit4PlayerStart,
  unit4InteractiveZones,
} from '../../data/games/unit4Map';

import LinksSecurityGame from './LinksSecurityGame';
import QrSecurityGame from './QrSecurityGame';

import cafeImage from '../../assets/unit4/mapa_cafeteria.png';
import girlSpriteSheet from '../../assets/general/la socia caminando.png';

// Rostros
import girlFaceTalking from '../../assets/general/player_face_hablando.png';
import girlFaceNeutral from '../../assets/general/player_face_neutral.png';
import advisorFaceTalking from '../../assets/unit1/asesor_player_talking.png';
import advisorFaceNeutral from '../../assets/unit1/asesor_player_neutral.png';

import './css/Unit4GameScene.css';

/* ======= DIÁLOGOS (versión finanzas y metas) ======= */

// Intro: Carmina entrando a la cafetería
const introDialogue = [
  'Hoy vine a esta cafetería a trabajar un rato… y a ponerle orden a mi dinero.',
  'Siempre digo que voy a ahorrar, pero al final del mes no sé en qué se fue todo.',
  'Quiero empezar por lo básico: tomar mejores decisiones con mi plata y definir metas claras.',
  'Primero me acerco al mostrador, pido algo y hablo con el barista.',
];

// Diálogo con el barista antes de sentarse
const vendorIntroDialogue = [
  {
    speaker: 'Barista',
    text: '¡Hola! Bienvenida a la cafetería, soy el barista. ¿Qué te sirvo hoy?',
  },
  {
    speaker: 'Carmina',
    text: 'Hola, me gustaría un café y algo para picar mientras reviso mis metas financieras.',
  },
  {
    speaker: 'Barista',
    text: 'Buenísimo, muchas personas quieren manejar mejor su plata, pero no saben por dónde empezar.',
  },
  {
    speaker: 'Barista',
    text: 'Si quieres, hacemos un entrenamiento rápido: primero vemos decisiones con tu dinero y luego hablamos de metas de corto y largo plazo.',
  },
  {
    speaker: 'Barista',
    text: 'Siéntate en una mesa y revisa “tu celular”: ahí empezarás con las decisiones financieras.',
  },
];

// Si vuelve a la barra sin haber hecho el minijuego de decisiones
const vendorReminderDialogue = [
  {
    speaker: 'Barista',
    text: 'Primero practica las decisiones con tu dinero sentado en una de las mesas.',
  },
  {
    speaker: 'Barista',
    text: 'Cuando termines, vuelves por acá y seguimos con las metas financieras.',
  },
];

// Diálogo al sentarse en la mesa de celular (antes del minijuego 1)
const phoneIntroDialogue = [
  {
    speaker: 'Carmina',
    text: 'Listo, ya estoy sentada. Voy a revisar algunas situaciones típicas con dinero.',
  },
  {
    speaker: 'Carmina',
    text: 'A veces me pagan y me dan ganas de gastarlo todo de una, y luego me acuerdo de mis metas.',
  },
  {
    speaker: 'Carmina',
    text: 'En este mini-juego veré varias decisiones posibles y tendré que decir si son responsables o riesgosas.',
  },
  {
    speaker: 'Carmina',
    text: 'Es una forma sencilla de empezar a entender cómo las decisiones del día a día acercan o alejan mis metas financieras.',
  },
  {
    speaker: 'Carmina',
    text: 'Vamos a jugar un momento: decide si la acción con el dinero es una buena decisión financiera o una que puede traer problemas.',
  },
];

// Diálogo después del minijuego de decisiones
const phoneOutroDialogue = [
  {
    speaker: 'Carmina',
    text: 'Ok, ahora veo más claro qué tipo de decisiones me ayudan a avanzar con mis metas y cuáles me frenan.',
  },
  {
    speaker: 'Carmina',
    text: 'Si separo algo para ahorro y pienso antes de endeudarme, es más fácil que mis metas no se queden solo en deseos.',
  },
  {
    speaker: 'Carmina',
    text: 'Voy a regresar a la barra para seguir con el entrenamiento.',
  },
];

// Diálogo sobre metas financieras (antes del mini-juego 2)
const vendorQrIntroDialogue = [
  {
    speaker: 'Barista',
    text: '¿Cómo te fue con las decisiones? ¡Bien! Ahora vamos con algo clave: las metas financieras.',
  },
  {
    speaker: 'Barista',
    text: 'Una meta financiera es un objetivo claro al que quieres llegar con tu dinero: qué quieres lograr, en cuánto tiempo y con cuánto.',
  },
  {
    speaker: 'Barista',
    text: 'Algunas metas son de corto plazo, como ahorrar para un curso o un viaje pequeño. Otras son de largo plazo, como un fondo de emergencia o comprar vivienda.',
  },
  {
    speaker: 'Barista',
    text: 'En el mini-juego verás distintas metas. Toca la pantalla y decide si son de corto o de largo plazo.',
  },
  {
    speaker: 'Barista',
    text: 'Cuando termines, volvemos aquí y cerramos tu plan financiero del día.',
  },
];

// Diálogo final tras el mini-juego de metas
const vendorQrOutroDialogue = [
  {
    speaker: 'Barista',
    text: 'Listo, ahora ya sabes distinguir metas de corto y de largo plazo.',
  },
  {
    speaker: 'Barista',
    text: 'Cuando defines tus metas con monto, tiempo y propósito, es mucho más fácil saber cuánto necesitas ahorrar y qué decisiones tomar.',
  },
  {
    speaker: 'Carmina',
    text: 'Gracias, de verdad. Ahora siento que mis metas ya no son solo ideas sueltas, sino cosas que puedo planear paso a paso.',
  },
  {
    speaker: 'Barista',
    text: 'Me alegra. Empieza por una meta pequeña y ve avanzando. Lo importante es tener dirección con tu dinero.',
  },
];

function Unit4GameScene({ onGoalReached }) {
  // 'intro' | 'vendorIntro' | 'vendorReminder' | 'phoneIntro'
  // | 'phoneOutro' | 'vendorQrIntro' | 'vendorQrOutro' | null
  const [dialogueMode, setDialogueMode] = useState('intro');
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [vendorIntroDone, setVendorIntroDone] = useState(false);
  const [phoneTrainingFinished, setPhoneTrainingFinished] = useState(false);
  const [qrTrainingFinished, setQrTrainingFinished] = useState(false);
  const [vendorQrDone, setVendorQrDone] = useState(false);

  const [isLinksGameOpen, setIsLinksGameOpen] = useState(false);
  const [isQrGameOpen, setIsQrGameOpen] = useState(false);
  const [unitFinished, setUnitFinished] = useState(false);

  const isDialogueVisible =
    dialogueMode !== null || isLinksGameOpen || isQrGameOpen || unitFinished;

  /* ======= TEXTO ACTUAL DEL DIÁLOGO ======= */

  const currentDialogueText = useMemo(() => {
    if (dialogueMode === 'intro') {
      return introDialogue[dialogueIndex] || '';
    }
    if (dialogueMode === 'vendorIntro') {
      const entry = vendorIntroDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }
    if (dialogueMode === 'vendorReminder') {
      const entry = vendorReminderDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }
    if (dialogueMode === 'phoneIntro') {
      const entry = phoneIntroDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }
    if (dialogueMode === 'phoneOutro') {
      const entry = phoneOutroDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }
    if (dialogueMode === 'vendorQrIntro') {
      const entry = vendorQrIntroDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }
    if (dialogueMode === 'vendorQrOutro') {
      const entry = vendorQrOutroDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }
    return '';
  }, [dialogueMode, dialogueIndex]);

  const speakerName = useMemo(() => {
    if (dialogueMode === 'intro') return 'Carmina';

    if (dialogueMode === 'vendorIntro') {
      const entry = vendorIntroDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }
    if (dialogueMode === 'vendorReminder') {
      const entry = vendorReminderDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }
    if (dialogueMode === 'phoneIntro') {
      const entry = phoneIntroDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }
    if (dialogueMode === 'phoneOutro') {
      const entry = phoneOutroDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }
    if (dialogueMode === 'vendorQrIntro') {
      const entry = vendorQrIntroDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }
    if (dialogueMode === 'vendorQrOutro') {
      const entry = vendorQrOutroDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }

    return '';
  }, [dialogueMode, dialogueIndex]);

  // Selección de rostro según quién habla
  const { currentSpeakingSprite, currentIdleSprite } = useMemo(() => {
    if (!dialogueMode) {
      return { currentSpeakingSprite: null, currentIdleSprite: null };
    }

    // Barista usa el mismo sprite que el asesor
    if (speakerName === 'Barista' || speakerName === 'Asesor') {
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

    return {
      currentSpeakingSprite: girlFaceTalking,
      currentIdleSprite: girlFaceNeutral,
    };
  }, [dialogueMode, speakerName]);

  const canMove = !isDialogueVisible;

  const handleStep = useCallback(() => {
    // Triggers al pisar si quieres más adelante
  }, []);

  const { tilePosition, pixelPosition, isMoving, direction } = usePlayerMovement(
    {
      initialTilePosition: unit4PlayerStart,
      tileSize: unit4TileSize,
      mapMatrix: unit4MapMatrix,
      blockingTileTypes: [1, 2],
      interactiveTileTypes: [],
      moveDuration: 260,
      onStep: handleStep,
      canMove,
    }
  );

  /* ======= CLICK EN TILES ======= */

  const handleTileClick = ({ x, y, value }) => {
    if (isDialogueVisible) return;
    if (value !== 2) return;

    // Distancia máxima para interactuar (más permisiva)
    const dx = Math.abs(x - tilePosition.x);
    const dy = Math.abs(y - tilePosition.y);
    if (Math.max(dx, dy) > 2) return;

    const zoneMeta =
      unit4InteractiveZones.find((z) => z.x === x && z.y === y) || null;
    if (!zoneMeta) return;

    if (zoneMeta.type === 'vendor') {
      if (!vendorIntroDone) {
        setDialogueMode('vendorIntro');
        setDialogueIndex(0);
      } else if (vendorIntroDone && !phoneTrainingFinished) {
        setDialogueMode('vendorReminder');
        setDialogueIndex(0);
      } else if (vendorIntroDone && phoneTrainingFinished && !qrTrainingFinished) {
        setDialogueMode('vendorQrIntro');
        setDialogueIndex(0);
      } else if (
        vendorIntroDone &&
        phoneTrainingFinished &&
        qrTrainingFinished &&
        !vendorQrDone
      ) {
        setDialogueMode('vendorQrOutro');
        setDialogueIndex(0);
      }
      return;
    }

    if (zoneMeta.type === 'phone-table') {
      if (!vendorIntroDone) return;

      if (!phoneTrainingFinished) {
        setDialogueMode('phoneIntro');
        setDialogueIndex(0);
      } else {
        setDialogueMode('phoneOutro');
        setDialogueIndex(0);
      }
      return;
    }
  };

  /* ======= AVANZAR DIÁLOGO ======= */

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

    if (dialogueMode === 'vendorIntro') {
      if (dialogueIndex < vendorIntroDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
        setVendorIntroDone(true);
      }
      return;
    }

    if (dialogueMode === 'vendorReminder') {
      if (dialogueIndex < vendorReminderDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
      }
      return;
    }

    if (dialogueMode === 'phoneIntro') {
      if (dialogueIndex < phoneIntroDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
        setIsLinksGameOpen(true);
      }
      return;
    }

    if (dialogueMode === 'phoneOutro') {
      if (dialogueIndex < phoneOutroDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
      }
      return;
    }

    if (dialogueMode === 'vendorQrIntro') {
      if (dialogueIndex < vendorQrIntroDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
        setIsQrGameOpen(true);
      }
      return;
    }

    if (dialogueMode === 'vendorQrOutro') {
      if (dialogueIndex < vendorQrOutroDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        // FIN REAL de la unidad 4
        setDialogueMode(null);
        setDialogueIndex(0);
        setVendorQrDone(true);
        setUnitFinished(true);

        if (typeof onGoalReached === 'function') {
          onGoalReached();
        }
      }
      return;
    }
  };

  return (
    <div className="unit4-game-container">
      {/* Wrapper escalable solo para Unit 4 */}
      <div className="unit4-game-inner">
        <TileMap
          mapMatrix={unit4MapMatrix}
          tileSize={unit4TileSize}
          mapImage={cafeImage}
          onTileClick={handleTileClick}
        >
          <Player
            pixelPosition={pixelPosition}
            tileSize={unit4TileSize}
            isMoving={isMoving}
            spriteSheet={girlSpriteSheet}
            direction={direction}
          />
        </TileMap>
      </div>

      <DialogueBoxUnit4
        visible={dialogueMode !== null}
        text={currentDialogueText}
        speakingSprite={currentSpeakingSprite}
        idleSprite={currentIdleSprite}
        speakerName={speakerName}
        onNext={handleDialogueNext}
      />

      <LinksSecurityGame
        visible={isLinksGameOpen}
        onFinished={() => {
          setIsLinksGameOpen(false);
          setPhoneTrainingFinished(true);
          setDialogueMode('phoneOutro');
          setDialogueIndex(0);
        }}
      />

      <QrSecurityGame
        visible={isQrGameOpen}
        onFinished={() => {
          setIsQrGameOpen(false);
          setQrTrainingFinished(true);
          setDialogueMode('vendorQrOutro');
          setDialogueIndex(0);
        }}
      />
    </div>
  );
}

export default Unit4GameScene;
