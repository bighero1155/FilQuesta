import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import IntroductionScene from "./IntroductionScene";
import MagicTree from "./MagicTreeScene";
import MathBackgroundMusic from "../MagicTree/MathBackgroundMusic";

const MagicTreeGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastIsMobileRef = useRef<boolean>(window.innerWidth < 768);

  useEffect(() => {
    if (gameRef.current || !containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: "#87CEEB", 
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      physics: { 
        default: "arcade", 
        arcade: { 
          gravity: { y: 0, x: 0 }, 
          debug: false 
        } 
      },
      scene: [IntroductionScene, MagicTree],
    };

    gameRef.current = new Phaser.Game(config);

    const handleResize = () => {
      const currentIsMobile = window.innerWidth < 768;
      
      if (currentIsMobile !== lastIsMobileRef.current) {
        lastIsMobileRef.current = currentIsMobile;
        window.location.reload();
      } else {
        gameRef.current?.scale.resize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <>
      <div style={{ 
        width: "100vw", 
        height: "100vh", 
        overflow: "hidden",
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        left: 0,
      }}>
        <div 
          ref={containerRef} 
          id="magic-tree-container" 
          style={{ 
            width: "100%", 
            height: "100%",
            margin: 0,
            padding: 0,
          }} 
        />
      </div>
      <MathBackgroundMusic />
    </>
  );
};

export default MagicTreeGame;