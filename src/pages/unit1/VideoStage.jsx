import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle } from 'lucide-react';
import '../css/unit1.css';

export default function VideoStage({ onComplete, unitColor }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && progress === 0) {
      // Simular progreso del video
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            setIsCompleted(true);
            return 100;
          }
          return prev + 2;
        });
      }, 200);
    }
  };

  const keyPoints = [
    { id: 1, title: 'Específica', description: 'Define exactamente qué quieres lograr' },
    { id: 2, title: 'Medible', description: 'Establece métricas claras de éxito' },
    { id: 3, title: 'Alcanzable', description: 'Asegúrate de que sea realista' },
    { id: 4, title: 'Relevante', description: 'Alineada con tus objetivos de vida' },
    { id: 5, title: 'Temporal', description: 'Define un plazo específico' }
  ];

  return (
    <div className="stage-container">
      <div className="stage-grid">
        {/* Video Player */}
        <div className="video-section">
          <div className="video-player">
            <div className="video-screen">
              {!isPlaying && progress === 0 && (
                <div className="video-placeholder">
                  <div className="video-play-button" onClick={handlePlayPause}>
                    <Play />
                  </div>
                  <p className="video-title">¿Qué son las Metas SMART?</p>
                </div>
              )}
              
              {(isPlaying || progress > 0) && (
                <div className="video-content">
                  <div className="video-mockup">
                    <div className="video-mockup-text">
                      <h3>Metas Financieras SMART</h3>
                      <p>Aprende a establecer objetivos financieros efectivos que te ayuden a alcanzar tus sueños.</p>
                      
                      <div className="smart-grid">
                        {keyPoints.map(point => (
                          <div key={point.id} className="smart-item">
                            <div className="smart-letter">{point.title[0]}</div>
                            <div>
                              <div className="smart-title">{point.title}</div>
                              <div className="smart-desc">{point.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <div className="video-completed-badge">
                      <CheckCircle />
                      <span>Video completado</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="video-progress-bar">
                <div className="video-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
            
            {/* Controls */}
            <div className="video-controls">
              <button onClick={handlePlayPause} className="control-button">
                {isPlaying ? <Pause /> : <Play />}
              </button>
              
              <div className="video-time">
                <span>{Math.floor(progress / 10)}:{(progress % 10 * 6).toString().padStart(2, '0')}</span>
                <span className="time-separator">/</span>
                <span>10:00</span>
              </div>
              
              <div className="control-spacer" />
              
              <button onClick={() => setIsMuted(!isMuted)} className="control-button">
                {isMuted ? <VolumeX /> : <Volume2 />}
              </button>
              
              <button className="control-button">
                <Maximize />
              </button>
            </div>
          </div>
        </div>

        {/* Key Points Sidebar */}
        <div className="sidebar-section">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Puntos Clave</h3>
            
            <div className="key-points-list">
              {keyPoints.map((point, index) => (
                <div key={point.id} className="key-point-item">
                  <div className="key-point-number">{index + 1}</div>
                  <div>
                    <div className="key-point-title">{point.title}</div>
                    <div className="key-point-description">{point.description}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="sidebar-divider" />
            
            <div className="example-box">
              <div className="example-label">Ejemplo</div>
              <div className="example-content">
                "Ahorrar $5,000 en 12 meses para el enganche de un auto, depositando $420 mensuales"
              </div>
            </div>
          </div>
          
          {isCompleted && (
            <button onClick={onComplete} className="continue-button">
              Continuar al Tutorial
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}