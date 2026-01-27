// src/components/GameCaller.tsx
import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import WordWizardIntro from "../WordWizard/Introduction";
import WordWizardScene from "../WordWizard/WordWizardScene";
import EnglishBackgroundMusic from "../WordWizard/EnglishBackgroundMusic";

const GameCaller: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      backgroundColor: "#ffffff",
      parent: "phaser-container",
      scene: [WordWizardIntro, WordWizardScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth, 
        height: window.innerHeight,
      },
      physics: {
        default: "arcade",
        arcade: { debug: false },
      },
      render: {
        pixelArt: false,
        antialias: true,
      },
    };

    gameRef.current = new Phaser.Game(config);

    // ⬅️ SIMPLIFIED: Resize handling
    const resizeGame = () => {
      if (!gameRef.current) return;
      gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resizeGame);
    resizeGame();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      window.removeEventListener("resize", resizeGame);
    };
  }, []);

  return (
    <>
      <div
        id="phaser-container"
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          touchAction: "none",
          backgroundColor: "#667eea", 
          margin: 0, 
          padding: 0, 
          position: "fixed", 
          top: 0,
          left: 0, 
        }}
      />
      <EnglishBackgroundMusic />
    </>
  );
};

export default GameCaller;