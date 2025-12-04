import React, { useState } from 'react';
import { ArrowLeft, Play, CheckCircle, Lock, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './css/UnitPage.css';
import { useDeviceMode } from '../hooks/useDeviceMode';
import { useOrientationLock } from '../hooks/useOrientationLock';

export default function UnitPage({
  unitNumber,
  unitTitle,
  unitColor,
  VideoStage,
  TutorialStage,
  EvaluationStage,
}) {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0); // 0: video, 1: tutorial, 2: evaluación
  const [completedStages, setCompletedStages] = useState([]);
  const { isMobile } = useDeviceMode();
  const { isLandscape } = useOrientationLock();

  const stages = [
    {
      id: 0,
      title: 'Video Explicativo',
      description: 'Aprende los conceptos básicos',
      icon: Play,
      component: VideoStage,
    },
    {
      id: 1,
      title: 'Tutorial Interactivo',
      description: 'Practica con el asistente virtual',
      icon: Circle,
      component: TutorialStage,
    },
    {
      id: 2,
      title: 'Evaluación',
      description: 'Demuestra lo que aprendiste',
      icon: CheckCircle,
      component: EvaluationStage,
    },
  ];

  const handleStageComplete = () => {
    if (!completedStages.includes(currentStage)) {
      setCompletedStages([...completedStages, currentStage]);
    }

    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const canAccessStage = (stageId) => {
    if (stageId === 0) return true;
    return completedStages.includes(stageId - 1);
  };

  const CurrentComponent = stages[currentStage].component;
  const isTutorialStage = currentStage === 1;
  const isEvaluationStage = currentStage === 2;
  const isGameStage = isTutorialStage || isEvaluationStage;
  const shouldShowProgress = !isMobile || !isGameStage;
  const isMobileFullscreenGame = isMobile && isLandscape && isGameStage;

  if (isMobileFullscreenGame) {
    // En móvil horizontal durante el tutorial, ocultamos todo el layout
    // y renderizamos únicamente el contenedor del juego y sus controles.
    return (
      <div className="unit-page unit-page--fullscreen">
        <div className="unit-fullscreen-shell">
          <CurrentComponent
            onComplete={handleStageComplete}
            unitColor={unitColor}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="unit-page">
      <div className="unit-page-container">
        {/* Header */}
        <header className="unit-header">
          <div className="hero-decor-top"></div>
          <div className="hero-decor-bottom"></div>

          <div className="hero-content">
            <button onClick={() => navigate('/')} className="back-button">
              <ArrowLeft />
              <span>Volver</span>
            </button>

            <div className="unit-header-info">
              <div className="unit-badge">
                <span>Unidad {unitNumber}</span>
              </div>
              <h1 className="unit-title">{unitTitle}</h1>
            </div>
          </div>
        </header>

        {/* Progress Indicator */}
        {shouldShowProgress && (
          <div className="unit-progress-container">
            <div className="unit-progress-wrapper">
              {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <button
                    onClick={() =>
                      canAccessStage(stage.id) && setCurrentStage(stage.id)
                    }
                    disabled={!canAccessStage(stage.id)}
                    className={`progress-step ${
                      currentStage === stage.id ? 'progress-step-active' : ''
                    } ${
                      completedStages.includes(stage.id)
                        ? 'progress-step-completed'
                        : ''
                    } ${
                      !canAccessStage(stage.id)
                        ? 'progress-step-locked'
                        : ''
                    }`}
                  >
                    <div className="progress-step-icon">
                      {completedStages.includes(stage.id) ? (
                        <CheckCircle className="step-icon-check" />
                      ) : !canAccessStage(stage.id) ? (
                        <Lock className="step-icon-lock" />
                      ) : (
                        <stage.icon className="step-icon-default" />
                      )}
                    </div>
                    <div className="progress-step-content">
                      <div className="progress-step-title">
                        {stage.title}
                      </div>
                      <div className="progress-step-description">
                        {stage.description}
                      </div>
                    </div>
                    <div className="progress-step-number">
                      {index + 1}
                    </div>
                  </button>

                  {index < stages.length - 1 && (
                    <div
                      className={`progress-connector ${
                        completedStages.includes(stage.id)
                          ? 'progress-connector-completed'
                          : ''
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Stage Content */}
        <div className="unit-content">
          <CurrentComponent
            onComplete={handleStageComplete}
            unitColor={unitColor}
          />
        </div>
      </div>
    </div>
  );
}
