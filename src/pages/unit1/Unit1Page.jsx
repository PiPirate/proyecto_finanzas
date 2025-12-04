import React from 'react';
import UnitPage from '../UnitPage';
import VideoStage from './VideoStage';
import TutorialStage from './TutorialStage';
import EvaluationStage from './EvaluationStage';

export default function Unit1Page() {
  return (
    <UnitPage
      unitNumber={1}
      unitTitle="Tu dinero y tus metas"
      unitColor="linear-gradient(135deg, #2563eb, #1d4ed8)"
      VideoStage={VideoStage}
      TutorialStage={TutorialStage}
      EvaluationStage={EvaluationStage}
    />
  );
}
