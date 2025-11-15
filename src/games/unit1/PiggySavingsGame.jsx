// src/games/unit1/PiggySavingsGame.jsx
import React, { useMemo, useState } from 'react';
import './css/PiggySavingsGame.css';

import pigIcon from '../../assets/unit1/icons/pig_icon.png';

const piggyEvents = [
  {
    id: 'found_money',
    text: 'Encontraste 10.000 pesos en el bolsillo de un pantalón viejo.',
    feedback: {
      guardar:
        'Decides guardar los 10.000 en la alcancía. Dinero que no esperabas y ahora se acerca a tu meta.',
      gastar:
        'Lo gastas en algo rápido. No es “malo”, pero perdiste la oportunidad de acercarte a tu objetivo sin esfuerzo.',
      postergar:
        'Lo dejas en el bolsillo para “ver después”. Si no decides a tiempo, es más fácil que se termine yendo en cualquier cosa.',
    },
    deltas: {
      guardar: +2,
      gastar: -2,
      postergar: 0,
    },
  },
  {
    id: 'fancy_coffee',
    text: 'Te antojaste de un café caro aunque ya tomaste uno hoy.',
    feedback: {
      guardar:
        'Respiras hondo y decides no comprarlo. Lo que ibas a gastar va directo a tu alcancía. Buen autocontrol.',
      gastar:
        'Compras el café. Disfrutable, sí, pero si se vuelve costumbre, tu meta se aleja un poco cada día.',
      postergar:
        'Dices “tal vez más tarde”. A veces solo posponer también ayuda a evitar compras por impulso.',
    },
    deltas: {
      guardar: +2,
      gastar: -2,
      postergar: +1,
    },
  },
  {
    id: 'two_for_one',
    text: 'Te ofrecieron una promo 2x1, pero no lo necesitabas.',
    feedback: {
      guardar:
        'Recuerdas que “barato” no es lo mismo que “necesario”. No compras nada y mantienes tu meta intacta.',
      gastar:
        'La promo te convence y compras. Pagas menos por unidad, pero más de lo que realmente ibas a gastar.',
      postergar:
        'Decides pensarlo y no compras todavía. A veces dejar pasar la promoción también es cuidarte.',
    },
    deltas: {
      guardar: +2,
      gastar: -2,
      postergar: 0,
    },
  },
  {
    id: 'small_payment',
    text: 'Recibiste un pequeño pago inesperado por ayudar a alguien.',
    feedback: {
      guardar:
        'Lo guardas completo en la alcancía. Los ingresos extra son perfectos para empujar tu meta.',
      gastar:
        'Lo gastas celebrando. Está bien disfrutar, pero piensa qué parte podrías destinar a tus objetivos.',
      postergar:
        'Lo dejas “por ahí” sin decidir. Cuando el dinero no tiene plan, suele desaparecer.',
    },
    deltas: {
      guardar: +3,
      gastar: -1,
      postergar: 0,
    },
  },
  {
    id: 'cute_thing',
    text: 'Viste algo lindo en una tienda, pero no lo necesitas.',
    feedback: {
      guardar:
        'Te acuerdas de tu meta y decides no comprarlo. Estás eligiendo tu objetivo por encima del impulso.',
      gastar:
        'Lo compras “porque estaba lindo”. Uno solo no parece mucho, pero muchos “antojos” se suman.',
      postergar:
        'Lo dejas en tu lista de deseos para revisarlo después. Si luego sigue siendo importante, podrás decidir con más calma.',
    },
    deltas: {
      guardar: +2,
      gastar: -2,
      postergar: +1,
    },
  },
  {
    id: 'deadline_close',
    text: 'Tu meta tiene un plazo cercano y aún te falta un poco.',
    feedback: {
      guardar:
        'Ajustas algunos gastos y decides guardar un poco más estos días. Esa constancia final marca la diferencia.',
      gastar:
        'Piensas “ya no alcanzo” y gastas sin cuidar. Cuando te rindes, la meta deja de avanzar.',
      postergar:
        'No tomas decisiones claras y dejas que todo siga igual. Si no cambias nada, tampoco cambia el resultado.',
    },
    deltas: {
      guardar: +3,
      gastar: -3,
      postergar: 0,
    },
  },
];

function getPigSizeClass(score) {
  if (score <= -3) return 'piggy-pig--tiny';
  if (score <= 0) return 'piggy-pig--small';
  if (score <= 4) return 'piggy-pig--normal';
  if (score <= 7) return 'piggy-pig--big';
  return 'piggy-pig--huge';
}

export default function PiggySavingsGame({ visible, onFinished }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chosenActions, setChosenActions] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');

  const totalEvents = piggyEvents.length;

  const currentEvent = useMemo(
    () => piggyEvents[index] || null,
    [index]
  );

  if (!visible) return null;

  const handleChoice = (choiceKey) => {
    if (!currentEvent || hasAnswered) return;

    const delta = currentEvent.deltas[choiceKey] || 0;
    const newScore = score + delta;

    setScore(newScore);
    setHasAnswered(true);
    setFeedback(currentEvent.feedback[choiceKey] || '');

    setChosenActions((prev) => [
      ...prev,
      { eventId: currentEvent.id, choice: choiceKey, delta },
    ]);
  };

  const handleNext = () => {
    if (!hasAnswered) return;

    const nextIndex = index + 1;
    const isLast = nextIndex > totalEvents - 1;

    if (isLast) {
      // Aquí se termina el minijuego: cerramos y volvemos al diálogo del cerdito
      if (onFinished) {
        onFinished({ score, chosenActions });
      }
      return;
    }

    setIndex(nextIndex);
    setHasAnswered(false);
    setFeedback('');
  };

  const pigSizeClass = getPigSizeClass(score);
  const isLastCard = index === totalEvents - 1;

  return (
    <div className="piggy-overlay">
      <div className="piggy-frame">
        <div className="piggy-pig-wrapper">
          <img
            src={pigIcon}
            alt="Alcancía"
            className={`piggy-pig ${pigSizeClass}`}
          />
          <p className="piggy-progress-label">
            Progreso de tu meta: {score > 0 ? `+${score}` : score}
          </p>
        </div>

        <div className="piggy-card">
          <p className="piggy-card-text">
            {currentEvent ? currentEvent.text : ''}
          </p>
          <p className="piggy-step-label">
            Decisión {index + 1} de {totalEvents}
          </p>
        </div>

        <div className="piggy-buttons">
          <button
            type="button"
            className="piggy-button piggy-button--save"
            onClick={() => handleChoice('guardar')}
          >
            Guardar
          </button>
          <button
            type="button"
            className="piggy-button piggy-button--spend"
            onClick={() => handleChoice('gastar')}
          >
            Gastar
          </button>
          <button
            type="button"
            className="piggy-button piggy-button--delay"
            onClick={() => handleChoice('postergar')}
          >
            Postergar
          </button>
        </div>

        <p className="piggy-feedback">
          {feedback}
        </p>

        <div className="piggy-bottom-row">
          <button
            type="button"
            className="piggy-next-button"
            disabled={!hasAnswered}
            onClick={handleNext}
          >
            {isLastCard ? 'Terminar' : 'Siguiente decisión'}
          </button>
        </div>
      </div>
    </div>
  );
}
