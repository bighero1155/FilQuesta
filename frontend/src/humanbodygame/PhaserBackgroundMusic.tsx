import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface PhaserBackgroundMusicProps {
  audioSrc?: string;
}

const PhaserBackgroundMusic: React.FC<PhaserBackgroundMusicProps> = ({ 
  audioSrc = "/assets/audio/science.mp3" 
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true); // Start as playing
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Lower volume for science game
      // Auto-play when component mounts
      audioRef.current.play().catch((error) => {
        console.error('Error auto-playing audio:', error);
        setIsPlaying(false); // If auto-play fails, update state
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
        className="phaser-music-btn"
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
        {/* Pixelated border effect */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: isPlaying 
              ? 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)'
              : 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
            boxShadow: isPlaying
              ? '0 0 0 3px #000, 0 0 0 4px #00d4ff, 0 4px 12px rgba(0, 212, 255, 0.6), inset 0 2px 4px rgba(255,255,255,0.2)'
              : '0 0 0 3px #000, 0 0 0 4px #4a5568, 0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
            clipPath: `polygon(
              0 4px, 4px 4px, 4px 0,
              calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
              100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
              4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
            )`,
            transition: 'transform 0.2s ease',
          }}
          className="phaser-music-border"
        />
        
        {/* Inner content */}
        <div 
          style={{
            position: 'absolute',
            inset: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isPlaying 
              ? 'linear-gradient(135deg, #00ccff 0%, #0088cc 100%)'
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

        {/* Animated pixels when playing */}
        {isPlaying && (
          <>
            <div 
              style={{ 
                position: 'absolute',
                top: '-4px',
                left: '50%',
                width: '4px',
                height: '4px',
                backgroundColor: '#66ffff',
                imageRendering: 'pixelated',
                animation: 'phaserPulse 1s ease-in-out infinite',
                animationDelay: '0s'
              }}
            />
            <div 
              style={{ 
                position: 'absolute',
                top: '-4px',
                left: '33.33%',
                width: '4px',
                height: '4px',
                backgroundColor: '#00d4ff',
                imageRendering: 'pixelated',
                animation: 'phaserPulse 1s ease-in-out infinite',
                animationDelay: '0.3s'
              }}
            />
            <div 
              style={{ 
                position: 'absolute',
                top: '-4px',
                right: '33.33%',
                width: '4px',
                height: '4px',
                backgroundColor: '#66ffff',
                imageRendering: 'pixelated',
                animation: 'phaserPulse 1s ease-in-out infinite',
                animationDelay: '0.6s'
              }}
            />
          </>
        )}
      </button>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
      />

      {/* Tooltip */}
      <div 
        className="phaser-music-tooltip"
        style={{
          position: 'absolute',
          bottom: '60px',
          right: '0',
          padding: '6px 10px',
          fontSize: '10px',
          fontWeight: 'bold',
          color: 'white',
          whiteSpace: 'nowrap',
          opacity: 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
          background: '#1a202c',
          boxShadow: '0 0 0 2px #000, 0 0 0 3px #4a5568',
          clipPath: `polygon(
            0 2px, 2px 2px, 2px 0,
            calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px,
            100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%,
            2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px)
          )`,
          imageRendering: 'pixelated',
          fontFamily: 'monospace',
        }}
      >
        {isPlaying ? 'MUSIC ON' : 'MUSIC OFF'}
      </div>

      {/* Keyframes for animation */}
      <style>{`
        @keyframes phaserPulse {
          0%, 100% { 
            opacity: 0.2; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.5); 
          }
        }
        
        .phaser-music-btn:hover .phaser-music-border {
          transform: scale(1.05);
        }
        
        .phaser-music-btn:hover ~ .phaser-music-tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default PhaserBackgroundMusic;