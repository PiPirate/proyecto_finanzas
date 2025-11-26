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
        'Decides guardar los 10.000 en la alcancía. Es dinero que no esperabas y ahora aumenta tu ahorro.',
      gastar:
        'Lo gastas en algo rápido. No es “malo”, pero perdiste la oportunidad de fortalecer tu ahorro sin esfuerzo.',
      postergar:
        'Lo dejas en el bolsillo para “ver después”. Si no decides a tiempo, es más fácil que ese dinero termine gastándose en cualquier cosa.',
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
        'Respiras hondo y decides no comprarlo. Lo que ibas a gastar va directo a tu alcancía. Buen control de tus gastos.',
      gastar:
        'Compras el café. Lo disfrutas, sí, pero si se vuelve costumbre, cada día queda menos dinero para otras cosas importantes.',
      postergar:
        'Dices “tal vez más tarde”. A veces solo posponer también ayuda a evitar compras por impulso y cuidar tu bolsillo.',
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
        'Recuerdas que “barato” no es lo mismo que “necesario”. No compras nada y proteges tu dinero para otros gastos.',
      gastar:
        'La promo te convence y compras. Pagas menos por unidad, pero más de lo que realmente ibas a usar.',
      postergar:
        'Decides pensarlo y no compras todavía. A veces dejar pasar la promoción también es una forma de cuidar tu dinero.',
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
        'Lo guardas completo en la alcancía. Los ingresos extra son perfectos para aumentar tu ahorro.',
      gastar:
        'Lo gastas celebrando. Está bien disfrutar, pero piensa qué parte podrías reservar para tu ahorro.',
      postergar:
        'Lo dejas “por ahí” sin decidir. Cuando el dinero no tiene un plan, suele desaparecer en pequeños gastos.',
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
        'Te acuerdas de tu presupuesto y decides no comprarlo. Estás eligiendo cuidar tu dinero por encima del impulso.',
      gastar:
        'Lo compras “porque estaba lindo”. Uno solo no parece mucho, pero muchos “antojos” se van sumando en tus gastos.',
      postergar:
        'Lo dejas en tu lista de deseos para revisarlo después. Si luego sigue siendo importante, podrás decidir con más calma y con tu presupuesto a la vista.',
    },
    deltas: {
      guardar: +2,
      gastar: -2,
      postergar: +1,
    },
  },
  {
    id: 'deadline_close',
    text: 'Se acerca fin de mes y aún no has ahorrado todo lo que tenías pensado.',
    feedback: {
      guardar:
        'Ajustas algunos gastos y decides guardar un poco más estos días. Esa constancia final marca la diferencia en tu ahorro.',
      gastar:
        'Piensas “ya no alcanzo a ahorrar” y gastas sin cuidar. Cuando te rindes, tu ahorro deja de crecer.',
      postergar:
        'No tomas decisiones claras y dejas que todo siga igual. Si no cambias nada, tampoco cambia lo que terminas ahorrando.',
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
      <div className="piggy-frame minigame-container">
        <div className="piggy-pig-wrapper">
          <img
            src={pigIcon}
            alt="Alcancía"
            className={`piggy-pig ${pigSizeClass}`}
          />
          <p className="piggy-progress-label">
            Nivel de ahorro: {score > 0 ? `+${score}` : score}
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
