import React from 'react';
import UnitPage from '../UnitPage';
import VideoStage from './VideoStage';
import TutorialStage from './TutorialStage';
import EvaluationStage from './EvaluationStage';

export default function Unit1Page() {
  return (
    <UnitPage
      unitId="unidad-4"
      unitNumber={4}
      unitTitle="Pagos digitales seguros"
      unitColor="linear-gradient(135deg, #f97316, #ef4444)"
      VideoStage={VideoStage}
      TutorialStage={TutorialStage}
      EvaluationStage={EvaluationStage}
    />
  );
}
