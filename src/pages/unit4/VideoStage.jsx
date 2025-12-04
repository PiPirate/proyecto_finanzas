import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle } from 'lucide-react';
import '../css/VideoStage.css';

import demoVideo from '../../assets/unit4/Videomodulo4.mp4';

export default function VideoStage({ onComplete, unitColor }) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (!isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime || 0;
    const total = videoRef.current.duration || 0;
    if (!total) return;
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setIsCompleted(true);
  };

  const formatTime = (sec) => {
    if (!sec || Number.isNaN(sec)) return '0:00';
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="stage-container">
      <div className="stage-grid">
        {/* VIDEO PLAYER a todo el ancho */}
        <div className="video-section" style={{ gridColumn: '1 / -1' }}>
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

        {/* BOTÓN DE CONTINUAR (solo tras ver el video completo) */}
        {isCompleted && (
          <div
            className="video-continue-wrapper"
            style={{ gridColumn: '1 / -1', marginTop: '16px' }}
          >
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
          </div>
        )}
      </div>
    </div>
  );
}
