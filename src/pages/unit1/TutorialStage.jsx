import React, { useState } from 'react';
import { Bot, Send, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import '../css/unit1.css';

export default function TutorialStage({ onComplete, unitColor }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInputs, setUserInputs] = useState({});
  const [showHint, setShowHint] = useState(false);

  const tutorialSteps = [
    {
      id: 0,
      question: '¿Cuál es tu meta financiera?',
      hint: 'Ejemplo: Comprar un auto, viajar, crear un fondo de emergencia',
      placeholder: 'Ej: Comprar una laptop nueva',
      field: 'goal'
    },
    {
      id: 1,
      question: '¿Cuánto dinero necesitas?',
      hint: 'Sé específico con la cantidad exacta que necesitas',
      placeholder: 'Ej: $15,000',
      field: 'amount',
      type: 'number'
    },
    {
      id: 2,
      question: '¿En cuánto tiempo quieres lograrlo?',
      hint: 'Define un plazo realista en meses',
      placeholder: 'Ej: 12 meses',
      field: 'timeframe',
      type: 'number'
    },
    {
      id: 3,
      question: '¿Cuánto puedes ahorrar mensualmente?',
      hint: 'Calcula: Meta Total ÷ Meses = Ahorro Mensual',
      placeholder: 'Ej: $1,250',
      field: 'monthly',
      type: 'number'
    }
  ];

  const handleInputChange = (value) => {
    setUserInputs({ ...userInputs, [tutorialSteps[currentStep].field]: value });
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    } else {
      // Tutorial completado
      onComplete();
    }
  };

  const currentStepData = tutorialSteps[currentStep];
  const isStepComplete = userInputs[currentStepData.field]?.trim();

  const generateSmartGoal = () => {
    const { goal, amount, timeframe, monthly } = userInputs;
    return `"${goal || 'Mi meta'}" - Ahorrar $${amount || '0'} en ${timeframe || '0'} meses, ahorrando $${monthly || '0'} mensualmente`;
  };

  return (
    <div className="stage-container">
      <div className="tutorial-layout">
        {/* Chat Interface */}
        <div className="tutorial-main">
          <div className="chat-container">
            {/* Messages */}
            <div className="chat-messages">
              {/* Welcome Message */}
              <div className="chat-message bot-message">
                <div className="message-avatar bot-avatar">
                  <Bot />
                </div>
                <div className="message-content">
                  <div className="message-text">
                    ¡Hola! Soy tu asistente virtual. Voy a ayudarte a crear tu primera meta SMART. Responde las siguientes preguntas:
                  </div>
                </div>
              </div>

              {/* Previous Steps */}
              {tutorialSteps.slice(0, currentStep).map((step) => (
                <React.Fragment key={step.id}>
                  <div className="chat-message bot-message">
                    <div className="message-avatar bot-avatar">
                      <Bot />
                    </div>
                    <div className="message-content">
                      <div className="message-text">{step.question}</div>
                    </div>
                  </div>
                  <div className="chat-message user-message">
                    <div className="message-content">
                      <div className="message-text">{userInputs[step.field]}</div>
                      <CheckCircle className="message-check" />
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Current Question */}
              <div className="chat-message bot-message">
                <div className="message-avatar bot-avatar">
                  <Bot />
                </div>
                <div className="message-content">
                  <div className="message-text">{currentStepData.question}</div>
                </div>
              </div>

              {/* Hint */}
              {showHint && (
                <div className="chat-message hint-message">
                  <div className="message-avatar hint-avatar">
                    <Lightbulb />
                  </div>
                  <div className="message-content">
                    <div className="message-text hint-text">
                      <strong>Pista:</strong> {currentStepData.hint}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
              <button 
                onClick={() => setShowHint(!showHint)} 
                className="hint-button"
                title="Ver pista"
              >
                <Lightbulb />
              </button>
              
              <input
                type={currentStepData.type || 'text'}
                value={userInputs[currentStepData.field] || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentStepData.placeholder}
                className="chat-input"
                onKeyPress={(e) => e.key === 'Enter' && isStepComplete && handleNext()}
              />
              
              <button 
                onClick={handleNext}
                disabled={!isStepComplete}
                className="send-button"
              >
                <Send />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Sidebar */}
        <div className="tutorial-sidebar">
          <div className="progress-card">
            <h3 className="progress-card-title">Tu Progreso</h3>
            
            <div className="progress-steps">
              {tutorialSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`progress-item ${index < currentStep ? 'progress-item-complete' : ''} ${index === currentStep ? 'progress-item-active' : ''}`}
                >
                  <div className="progress-item-icon">
                    {index < currentStep ? (
                      <CheckCircle />
                    ) : (
                      <div className="progress-item-number">{index + 1}</div>
                    )}
                  </div>
                  <div className="progress-item-text">{step.question}</div>
                </div>
              ))}
            </div>

            <div className="sidebar-divider" />

            {/* SMART Preview */}
            <div className="smart-preview">
              <div className="smart-preview-title">Tu Meta SMART</div>
              <div className="smart-preview-content">
                {Object.keys(userInputs).length > 0 ? (
                  <div className="smart-goal-text">{generateSmartGoal()}</div>
                ) : (
                  <div className="smart-goal-placeholder">
                    Completa los pasos para ver tu meta SMART
                  </div>
                )}
              </div>
            </div>

            {currentStep === tutorialSteps.length - 1 && isStepComplete && (
              <div className="completion-message">
                <CheckCircle className="completion-icon" />
                <div className="completion-text">
                  ¡Excelente! Has creado tu primera meta SMART
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
