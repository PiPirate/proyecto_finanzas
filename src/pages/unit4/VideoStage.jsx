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
    if (!sec) return '0:00';
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Puntos clave ultra resumidos
  const keyPoints = [
    {
      id: 1,
      title: 'Define tus metas',
      description: 'Saber qué quieres lograr guía tus decisiones con el dinero.',
    },
    {
      id: 2,
      title: 'Corto vs largo plazo',
      description: 'Hay metas para pronto y metas que toman más tiempo.',
    },
    {
      id: 3,
      title: 'Separa primero',
      description: 'Aparta algo para tus metas antes de empezar a gastar.',
    },
    {
      id: 4,
      title: 'Piensa antes de gastar',
      description: 'Pregúntate si esa compra te acerca o te aleja de tus metas.',
    },
    {
      id: 5,
      title: 'Constancia > montos grandes',
      description: 'Pequeñas decisiones buenas, repetidas, hacen la diferencia.',
    },
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
                    <div className="key-point-description">
                      {point.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-divider" />

            <div className="example-box">
              <div className="example-label">Ejemplo</div>
              <div className="example-content">
                "Carmina recibe un pago. Primero separa una parte para su meta
                de estudiar y luego decide cuánto usar para divertirse. Así sus
                decisiones diarias apoyan sus metas."
              </div>
            </div>
          </div>

          {isCompleted && (
            <button onClick={onComplete} className="continue-button">
              Continuar al Tutorial
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
