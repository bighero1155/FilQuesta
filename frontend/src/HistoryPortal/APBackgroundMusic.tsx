import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const APBackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch((error) => {
        console.error('Error auto-playing audio:', error);
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleMusic = (): void => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
      }}
    >
      <button
        onClick={toggleMusic}
        style={{
          width: '50px',
          height: '50px',
          imageRendering: 'pixelated',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
          position: 'relative',
        }}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: isPlaying 
              ? 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)'
              : 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
            boxShadow: isPlaying
              ? '0 0 0 3px #000, 0 0 0 4px #ffd700, 0 4px 12px rgba(255, 215, 0, 0.6), inset 0 2px 4px rgba(255,255,255,0.2)'
              : '0 0 0 3px #000, 0 0 0 4px #4a5568, 0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
            clipPath: `polygon(
              0 4px, 4px 4px, 4px 0,
              calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
              100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
              4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
            )`,
            transition: 'transform 0.2s ease',
          }}
        />
        
        <div 
          style={{
            position: 'absolute',
            inset: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isPlaying 
              ? 'linear-gradient(135deg, #ffed4e 0%, #ffd700 100%)'
              : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            clipPath: `polygon(
              0 3px, 3px 3px, 3px 0,
              calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px,
              100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%,
              3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px)
            )`,
          }}
        >
          {isPlaying ? (
            <Volume2 style={{ width: '24px', height: '24px', color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
          ) : (
            <VolumeX style={{ width: '24px', height: '24px', color: '#9ca3af', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
          )}
        </div>

        {isPlaying && (
          <>
            <div style={{ position: 'absolute', top: '-4px', left: '50%', width: '4px', height: '4px', backgroundColor: '#ffffcc', imageRendering: 'pixelated', animation: 'apPulse 1s ease-in-out infinite', animationDelay: '0s' }} />
            <div style={{ position: 'absolute', top: '-4px', left: '33.33%', width: '4px', height: '4px', backgroundColor: '#ffed4e', imageRendering: 'pixelated', animation: 'apPulse 1s ease-in-out infinite', animationDelay: '0.3s' }} />
            <div style={{ position: 'absolute', top: '-4px', right: '33.33%', width: '4px', height: '4px', backgroundColor: '#ffffcc', imageRendering: 'pixelated', animation: 'apPulse 1s ease-in-out infinite', animationDelay: '0.6s' }} />
          </>
        )}
      </button>

      <audio ref={audioRef} src="/assets/audio/ap.mp3" loop preload="auto" />

      <style>{`
        @keyframes apPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default APBackgroundMusic;