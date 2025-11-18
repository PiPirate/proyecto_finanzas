// src/views/EvaluationStage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/EvaluationStage.css';
import { TowerDefensePanel } from '../../games/unit4/TowerDefensePanel';

export default function EvaluationStage({ onComplete, unitColor }) {
  const navigate = useNavigate();

  const handleGameComplete = () => {
    onComplete();
    navigate('/');
  };

  const handleGameClose = () => {
    navigate(-1);
  };

  return (
    <div className="stage-container" style={{ borderColor: unitColor }}>
      <TowerDefensePanel
        onComplete={handleGameComplete}
        onClose={handleGameClose}
      />
    </div>
  );
}
