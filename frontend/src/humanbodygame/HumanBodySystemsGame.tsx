import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import HumanBodyScene from "./HumanBodyScene";
import PhaserBackgroundMusic from "../humanbodygame/PhaserBackgroundMusic"; 

const HumanBodySystemsGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const lastIsMobileRef = useRef<boolean>(window.innerWidth < 768);

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return;

    // Get level and category from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const levelParam = urlParams.get("level");
    const categoryParam = urlParams.get("category");

    // Parse level ID (map sends globalLevelId - 1, so add 1 back)
    const levelId = levelParam ? parseInt(levelParam, 10) + 1 : 1;

    console.log("Starting HumanBodyScene with:", { 
      levelId, 
      category: categoryParam,
      rawLevelParam: levelParam 
    });

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: gameRef.current, 
      backgroundColor: "#d4f1ff",
      scene: [HumanBodyScene],
      physics: { 
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 300 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    phaserGameRef.current = new Phaser.Game(config);

    // Start the scene with the level data
    phaserGameRef.current.scene.start("HumanBodyScene", { levelId });

    const handleResize = () => {
      const currentIsMobile = window.innerWidth < 768;
      
      if (currentIsMobile !== lastIsMobileRef.current) {
        lastIsMobileRef.current = currentIsMobile;
        window.location.reload();
      } else {
        phaserGameRef.current?.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      phaserGameRef.current?.destroy(true);
      phaserGameRef.current = null;
    };
  }, []); // Remove chapterId dependency

  return (
    <>
      <div 
        ref={gameRef} 
        style={{ 
          width: "100vw", 
          height: "100vh",
          margin: 0,
          padding: 0,
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
        }} 
      />
      <PhaserBackgroundMusic audioSrc="/assets/audio/science.mp3" />
    </>
  );
};

export default HumanBodySystemsGame;