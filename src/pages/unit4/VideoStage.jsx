import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle } from 'lucide-react';
import '../css/VideoStage.css';


import demoVideo from '../../assets/unit4/VideoModulo4.mp4'; 


export default function VideoStage({ onComplete, unitColor }) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePlayPause = () => {
    if (!isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setIsCompleted(true);
  };

  const formatTime = (sec) => {
    if (!sec) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

const keyPoints = [
  { 
    id: 1, 
    title: 'Verifica a quién pagas', 
    description: 'Confirma nombre y datos antes de enviar dinero.'
  },
  { 
    id: 2, 
    title: 'Revisa el monto', 
    description: 'Chequea valor y concepto del pago antes de aceptar.'
  },
  { 
    id: 3, 
    title: 'Cuida tus claves', 
    description: 'No compartas PIN ni códigos por chat o llamada.'
  },
  { 
    id: 4, 
    title: 'Detecta mensajes raros', 
    description: 'Desconfía de enlaces con urgencia, premios o amenazas.'
  },
  { 
    id: 5, 
    title: 'Si dudas, detente', 
    description: 'No completes el pago y contacta al soporte oficial.'
  }
];



  return (
    <div className="stage-container">
      <div className="stage-grid">
        
        {/* VIDEO PLAYER */}
        <div className="video-section">
          <div className="video-player">
            
            {/* VIDEO */}
            <div className="video-screen">
              <video
                ref={videoRef}
                src={demoVideo}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnd}
                className="video-element"
              />

              {/* PROGRESS */}
              <div className="video-progress-bar">
                <div 
                  className="video-progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* COMPLETED BADGE */}
              {isCompleted && (
                <div className="video-completed-badge">
                  <CheckCircle />
                  <span>Video completado</span>
                </div>
              )}
            </div>

            {/* CONTROLS */}
            <div className="video-controls">
              {/* Play/Pause */}
              <button onClick={handlePlayPause} className="control-button">
                {isPlaying ? <Pause /> : <Play />}
              </button>

              {/* Time */}
              <div className="video-time">
                <span>{formatTime(videoRef.current?.currentTime)}</span>
                <span className="time-separator">/</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div className="control-spacer" />

              {/* Mute */}
              <button onClick={handleMute} className="control-button">
                {isMuted ? <VolumeX /> : <Volume2 />}
              </button>

              {/* Fullscreen */}
              <button onClick={handleFullscreen} className="control-button">
                <Maximize />
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
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
                "Antes de pagar tu café con QR, confirmas que el nombre del local en la app coincide con el letrero y revisas el monto antes de aceptar."
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
