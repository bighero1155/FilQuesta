import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import HistoryPortalScene from "../HistoryPortal/HistoryPortalScene";
import HistoryPortalIntro from "../HistoryPortal/Instruction";
import { useLocation } from "react-router-dom";
import APBackgroundMusic from "../HistoryPortal/APBackgroundMusic";

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const location = useLocation();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update dimensions on resize with debouncing
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>; 

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // Ensure minimum valid dimensions to prevent WebGL errors
        if (newWidth > 0 && newHeight > 0) {
          setDimensions({ width: newWidth, height: newHeight });
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous game instance
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    // Read `level` from query param
    const params = new URLSearchParams(location.search);
    const levelParam = params.get("level");
    const levelIndex = levelParam ? Number(levelParam) : undefined;

    // Ensure valid dimensions before creating game
    const gameWidth = Math.max(dimensions.width, 320);
    const gameHeight = Math.max(dimensions.height, 480);

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      backgroundColor: "#0e0e10",
      parent: containerRef.current,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gameWidth,
        height: gameHeight,
      },
      physics: {
        default: "arcade",
        arcade: { debug: false },
      },
      scene: [HistoryPortalIntro, HistoryPortalScene],
      render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false,
      },
    };

    try {
      const game = new Phaser.Game(config);
      gameRef.current = game;

      // Start intro scene with passed level
      game.scene.start("HistoryPortalIntro", { levelKey: levelIndex });
    } catch (error) {
      console.error("Failed to initialize Phaser game:", error);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [location, dimensions]);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      />
      <APBackgroundMusic />
    </>
  );
}