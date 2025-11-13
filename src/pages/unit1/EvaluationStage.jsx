import React, { useState } from 'react';
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import '../css/unit1.css';

export default function EvaluationStage({ onComplete, unitColor }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const questions = [
    {
      id: 0,
      question: '¿Cuál de estas es una meta SMART?',
      options: [
        { id: 'a', text: 'Quiero ahorrar dinero', isCorrect: false },
        { id: 'b', text: 'Voy a ahorrar mucho este año', isCorrect: false },
        { id: 'c', text: 'Ahorrar $10,000 en 12 meses depositando $833 mensuales', isCorrect: true },
        { id: 'd', text: 'Algún día tendré ahorros', isCorrect: false }
      ],
      explanation: 'Una meta SMART debe ser específica, medible, alcanzable, relevante y temporal. La opción C cumple todos estos criterios.'
    },
    {
      id: 1,
      question: '¿Qué significa la "M" en SMART?',
      options: [
        { id: 'a', text: 'Motivadora', isCorrect: false },
        { id: 'b', text: 'Medible', isCorrect: true },
        { id: 'c', text: 'Mensual', isCorrect: false },
        { id: 'd', text: 'Moderna', isCorrect: false }
      ],
      explanation: 'La "M" significa Medible. Debes poder medir tu progreso con números concretos.'
    },
    {
      id: 2,
      question: 'Si quieres ahorrar $6,000 en 6 meses, ¿cuánto debes ahorrar mensualmente?',
      options: [
        { id: 'a', text: '$500', isCorrect: false },
        { id: 'b', text: '$1,000', isCorrect: true },
        { id: 'c', text: '$1,500', isCorrect: false },
        { id: 'd', text: '$2,000', isCorrect: false }
      ],
      explanation: '$6,000 ÷ 6 meses = $1,000 mensuales. Esta es la cantidad que necesitas ahorrar cada mes.'
    },
    {
      id: 3,
      question: '¿Cuál NO es una característica de una meta financiera efectiva?',
      options: [
        { id: 'a', text: 'Tiene una fecha límite clara', isCorrect: false },
        { id: 'b', text: 'Es vaga y general', isCorrect: true },
        { id: 'c', text: 'Se puede medir el progreso', isCorrect: false },
        { id: 'd', text: 'Es realista y alcanzable', isCorrect: false }
      ],
      explanation: 'Una meta efectiva debe ser específica, no vaga. Las metas generales son difíciles de cumplir.'
    },
    {
      id: 4,
      question: '¿Por qué es importante que una meta sea "Temporal"?',
      options: [
        { id: 'a', text: 'Para poder procrastinar', isCorrect: false },
        { id: 'b', text: 'Para crear urgencia y mantener el enfoque', isCorrect: true },
        { id: 'c', text: 'Para poder cambiarla cuando quieras', isCorrect: false },
        { id: 'd', text: 'No es importante', isCorrect: false }
      ],
      explanation: 'Establecer un plazo crea urgencia y te ayuda a mantener el enfoque en tu objetivo.'
    }
  ];

  const handleSelectOption = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = () => {
    setAnswers({ ...answers, [currentQuestion]: selectedOption });
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setSelectedOption(null);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      const correctOption = q.options.find(opt => opt.isCorrect);
      if (userAnswer === correctOption.id) {
        correct++;
      }
    });
    return correct;
  };

  const isAnswered = answers[currentQuestion] !== undefined;
  const userAnswer = answers[currentQuestion];
  const currentQuestionData = questions[currentQuestion];
  const correctOption = currentQuestionData?.options.find(opt => opt.isCorrect);

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;

    return (
      <div className="stage-container">
        <div className="results-container">
          <div className="results-card">
            <div className={`results-icon ${passed ? 'results-icon-success' : 'results-icon-fail'}`}>
              {passed ? <Trophy /> : <XCircle />}
            </div>
            
            <h2 className="results-title">
              {passed ? '¡Felicidades!' : 'Necesitas practicar más'}
            </h2>
            
            <div className="results-score">
              <div className="score-number">{score}/{questions.length}</div>
              <div className="score-percentage">{percentage.toFixed(0)}%</div>
            </div>
            
            <div className="results-message">
              {passed 
                ? 'Has demostrado un excelente entendimiento de las metas SMART. ¡Continúa al siguiente módulo!' 
                : 'Revisa el video y el tutorial nuevamente para reforzar los conceptos.'}
            </div>

            <div className="results-details">
              <h3 className="results-details-title">Resumen de Respuestas</h3>
              {questions.map((q, index) => {
                const userAns = answers[index];
                const correctOpt = q.options.find(opt => opt.isCorrect);
                const isCorrect = userAns === correctOpt.id;
                
                return (
                  <div key={q.id} className={`answer-summary ${isCorrect ? 'answer-correct' : 'answer-incorrect'}`}>
                    <div className="answer-summary-header">
                      {isCorrect ? <CheckCircle /> : <XCircle />}
                      <span>Pregunta {index + 1}</span>
                    </div>
                    <div className="answer-summary-question">{q.question}</div>
                    {!isCorrect && (
                      <div className="answer-summary-explanation">
                        <strong>Respuesta correcta:</strong> {correctOpt.text}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="results-actions">
              <button onClick={handleRetry} className="retry-button">
                <RotateCcw />
                Intentar de nuevo
              </button>
              {passed && (
                <button onClick={onComplete} className="complete-button">
                  Siguiente Unidad
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stage-container">
      <div className="evaluation-layout">
        {/* Question Card */}
        <div className="question-container">
          <div className="question-header">
            <div className="question-progress">
              Pregunta {currentQuestion + 1} de {questions.length}
            </div>
            <div className="question-progress-bar">
              <div 
                className="question-progress-fill"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="question-content">
            <h2 className="question-text">{currentQuestionData.question}</h2>

            <div className="options-list">
              {currentQuestionData.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const isUserAnswer = userAnswer === option.id;
                const showCorrect = isAnswered && option.isCorrect;
                const showIncorrect = isAnswered && isUserAnswer && !option.isCorrect;

                return (
                  <button
                    key={option.id}
                    onClick={() => !isAnswered && handleSelectOption(option.id)}
                    disabled={isAnswered}
                    className={`option-button ${isSelected && !isAnswered ? 'option-selected' : ''} ${showCorrect ? 'option-correct' : ''} ${showIncorrect ? 'option-incorrect' : ''}`}
                  >
                    <div className="option-letter">{option.id.toUpperCase()}</div>
                    <div className="option-text">{option.text}</div>
                    {showCorrect && <CheckCircle className="option-icon" />}
                    {showIncorrect && <XCircle className="option-icon" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`explanation-box ${userAnswer === correctOption.id ? 'explanation-success' : 'explanation-error'}`}>
                <div className="explanation-header">
                  {userAnswer === correctOption.id ? (
                    <>
                      <CheckCircle />
                      <span>¡Correcto!</span>
                    </>
                  ) : (
                    <>
                      <XCircle />
                      <span>Incorrecto</span>
                    </>
                  )}
                </div>
                <div className="explanation-text">{currentQuestionData.explanation}</div>
              </div>
            )}

            <div className="question-actions">
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption || isAnswered}
                className="submit-button"
              >
                {currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Sidebar */}
        <div className="evaluation-sidebar">
          <div className="progress-card">
            <h3 className="progress-card-title">Preguntas</h3>
            
            <div className="questions-grid">
              {questions.map((q, index) => {
                const isAnswered = answers[index] !== undefined;
                const isCurrent = index === currentQuestion;
                const userAns = answers[index];
                const correctOpt = q.options.find(opt => opt.isCorrect);
                const isCorrect = isAnswered && userAns === correctOpt.id;

                return (
                  <div
                    key={q.id}
                    className={`question-indicator ${isCurrent ? 'question-current' : ''} ${isAnswered ? (isCorrect ? 'question-answered-correct' : 'question-answered-wrong') : ''}`}
                  >
                    {isAnswered ? (
                      isCorrect ? <CheckCircle /> : <XCircle />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="sidebar-divider" />

            <div className="tips-box">
              <div className="tips-title">💡 Consejo</div>
              <div className="tips-text">
                Lee cada pregunta cuidadosamente. Recuerda los conceptos del video y el tutorial.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
