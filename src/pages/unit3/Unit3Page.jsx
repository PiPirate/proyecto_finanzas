import React from 'react';
import UnitPage from '../UnitPage';
import VideoStage from './VideoStage';
import TutorialStage from './TutorialStage';
import EvaluationStage from './EvaluationStage';

export default function Unit1Page() {
  return (
    <UnitPage
      unitId="unidad-3"
      unitNumber={3}
      unitTitle="Préstamos inteligentes"
      unitColor="linear-gradient(135deg, #22c55e, #10b981)"
      VideoStage={VideoStage}
      TutorialStage={TutorialStage}
      EvaluationStage={EvaluationStage}
    />
  );
}
