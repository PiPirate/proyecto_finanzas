import React from 'react';
import UnitPage from '../UnitPage';
import VideoStage from './VideoStage';
import TutorialStage from './TutorialStage';
import EvaluationStage from './EvaluationStage';

export default function Unit1Page() {
  return (
    <UnitPage
      unitId="unidad-2"
      unitNumber={2}
      unitTitle="Mini-presupuesto: 50-30-20"
      unitColor="linear-gradient(135deg, #a855f7, #ec4899)"
      VideoStage={VideoStage}
      TutorialStage={TutorialStage}
      EvaluationStage={EvaluationStage}
    />
  );
}
