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

/* ======= DIÁLOGOS ======= */

// Intro: Carmina entrando a la cafetería
const introDialogue = [
  'Hoy quise darme un respiro y vine a esta cafetería a trabajar un rato.',
  'También es una buena excusa para practicar cómo usar el celular y los pagos digitales sin caer en trampas.',
  'Primero voy a pedir algo en la barra.',
  'Acércate al mostrador y haz click para hablar con el barista.',
];

// Diálogo con el barista antes de sentarse
const vendorIntroDialogue = [
  {
    speaker: 'Barista',
    text: '¡Hola! Bienvenida a la cafetería, soy el barista. ¿Qué te sirvo hoy?',
  },
  {
    speaker: 'Carmina',
    text: 'Hola, me gustaría un café y algo para picar mientras estudio.',
  },
  {
    speaker: 'Barista',
    text: 'Perfecto, ya mismo lo preparo. Puedes sentarte en cualquiera de las mesas mientras tanto.',
  },
  {
    speaker: 'Barista',
    text: 'Si revisas tu celular, hazlo con cuidado: muchos fraudes empiezan con un mensaje con un enlace raro.',
  },
  {
    speaker: 'Barista',
    text: 'Si quieres, te enseño a detectarlos. Siéntate en una mesa y haz click para revisar tu teléfono.',
  },
];

// Si vuelve a la barra sin haber hecho el minijuego de links
const vendorReminderDialogue = [
  {
    speaker: 'Barista',
    text: 'Primero revisa el mensaje sospechoso en tu celular sentado en una de las mesas.',
  },
  {
    speaker: 'Barista',
    text: 'Cuando termines, vuelves por acá para hacer el pago con QR.',
  },
];

// Diálogo al sentarse en la mesa de celular (antes del minijuego)
const phoneIntroDialogue = [
  {
    speaker: 'Carmina',
    text: 'Listo, ya estoy sentada. Justo me llegó un mensaje…',
  },
  {
    speaker: 'Carmina',
    text: '“Has ganado un premio exclusivo. Haz clic aquí para reclamarlo antes de 10 minutos.” Suena sospechoso.',
  },
  {
    speaker: 'Carmina',
    text: 'Muchas estafas empiezan así: mensajes urgentes, premios que nunca pediste y enlaces raros.',
  },
  {
    speaker: 'Carmina',
    text: 'Voy a practicar a reconocer enlaces confiables y enlaces peligrosos.',
  },
  {
    speaker: 'Carmina',
    text: 'Vamos a jugar un minijuego rápido: debo decidir qué links parecen seguros y cuáles no.',
  },
];

// Diálogo después del minijuego de links
const phoneOutroDialogue = [
  {
    speaker: 'Carmina',
    text: 'Ok, ahora tengo mucho más claro qué señales revisar antes de tocar un enlace.',
  },
  {
    speaker: 'Carmina',
    text: 'Nada de premios mágicos, nada de urgencias exageradas y siempre revisar el dominio real.',
  },
  {
    speaker: 'Carmina',
    text: 'Ya terminé mi café, es hora de acercarme de nuevo a la barra para pagar.',
  },
];

// Diálogo sobre pago con QR (antes del mini-juego de QR)
const vendorQrIntroDialogue = [
  {
    speaker: 'Barista',
    text: '¿Todo bien con tu pedido? Genial, ahora vamos a pagar con un código QR.',
  },
  {
    speaker: 'Barista',
    text: 'Antes de confirmar el pago, quiero que veamos cómo se ven los QR falsos o peligrosos.',
  },
  {
    speaker: 'Barista',
    text: 'En el mini-juego verás un QR retro en pantalla y varias escenas. Toca el QR y decide si la situación es confiable o sospechosa.',
  },
  {
    speaker: 'Barista',
    text: 'Cuando termines el tutorial, volvemos aquí y simulamos el pago real de tu consumo.',
  },
];

// Diálogo final tras el mini-juego de QR
const vendorQrOutroDialogue = [
  {
    speaker: 'Barista',
    text: 'Listo, ahora ya tienes ojo entrenado para detectar QR peligrosos.',
  },
  {
    speaker: 'Barista',
    text: 'Usamos el QR oficial de la cafetería: el nombre del comercio y el valor coinciden exacto con tu cuenta.',
  },
  {
    speaker: 'Carmina',
    text: 'Gracias, de verdad. Ahora me siento mucho más segura usando mi celular para pagar y recibir mensajes.',
  },
  {
    speaker: 'Barista',
    text: 'Pago aprobado. ¡Disfruta el resto del día y navega siempre con ojo crítico!',
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
