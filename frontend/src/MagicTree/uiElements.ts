import Phaser from "phaser";

export interface UIElements {
  scoreText: Phaser.GameObjects.Text;
  levelText: Phaser.GameObjects.Text;
  questionText: Phaser.GameObjects.Text;
  sumText: Phaser.GameObjects.Text;
  nextLevelButton?: Phaser.GameObjects.Text;
  restartButton?: Phaser.GameObjects.Text;
  quitButton?: Phaser.GameObjects.Text;
  fruitLegend: Phaser.GameObjects.Text[];
}

/**
 * Create the HUD with CENTERED question and current sum
 */
export function createHUD(scene: Phaser.Scene, score: number, currentLevel: number): UIElements {
  const isMobile = scene.scale.width < 768;
  
  // ✨ HIDDEN Score - kept for compatibility but not displayed
  const scoreText = scene.add.text(-1000, -1000, `Score: ${score}`, { 
    fontFamily: "Fredoka, Arial Black, sans-serif",
    fontSize: "18px",
    color: "#ffd700", 
    stroke: "#ff6600",
    strokeThickness: 3,
  })
  .setVisible(false); // Hide it completely

  // ✨ CENTERED Level, Question and Current Sum
  const centerX = scene.scale.width / 2;
  const topY = isMobile ? 25 : 40;
  const centerSpacing = isMobile ? 45 : 60;
  
  // Level - CENTERED at top (same size as question/current)
  const levelText = scene.add.text(centerX, topY, `Level: ${currentLevel}`, { 
    fontFamily: "Fredoka, Arial Black, sans-serif",
    fontSize: isMobile ? "28px" : "42px",
    color: "#00ffcc", 
    stroke: "#003333",
    strokeThickness: isMobile ? 5 : 7,
    shadow: { offsetX: 3, offsetY: 3, color: "#000", blur: 6, fill: true },
  })
  .setOrigin(0.5);
  
  // Question - CENTERED below level
  const questionText = scene.add.text(centerX, topY + centerSpacing, "", { 
    fontFamily: "Fredoka, Arial Black, sans-serif",
    fontSize: isMobile ? "28px" : "42px",
    color: "#ff9900", 
    stroke: "#663300",
    strokeThickness: isMobile ? 5 : 7,
    shadow: { offsetX: 3, offsetY: 3, color: "#000", blur: 6, fill: true },
  })
  .setOrigin(0.5);
  
  // Current Sum - CENTERED below question
  const sumText = scene.add.text(centerX, topY + (centerSpacing * 2), "Current: 0", { 
    fontFamily: "Fredoka, Arial Black, sans-serif",
    fontSize: isMobile ? "28px" : "42px",
    color: "#ffffff", 
    stroke: "#000",
    strokeThickness: isMobile ? 5 : 7,
    shadow: { offsetX: 3, offsetY: 3, color: "#000", blur: 6, fill: true },
  })
  .setOrigin(0.5);

  // Empty fruit legend array (not displayed but kept for interface compatibility)
  const fruitLegend: Phaser.GameObjects.Text[] = [];

  return { scoreText, levelText, questionText, sumText, fruitLegend };
}

/**
 * Show Next Level UI with Confetti - RESPONSIVE
 */
export function showNextLevelUI(
  scene: Phaser.Scene,
  ui: UIElements,
  currentLevel: number,
  maxLevel: number,
  onRestart: () => void
) {
  if (ui.nextLevelButton) ui.nextLevelButton.destroy();
  if (currentLevel >= maxLevel) {
    onRestart();
    return;
  }

  const isMobile = scene.scale.width < 768;
  
  const btnWidth = isMobile ? 200 : 260;
  const btnHeight = isMobile ? 60 : 80;
  const fontSize = isMobile ? "28px" : "36px";
  const strokeThickness = isMobile ? 4 : 5;

  // Confetti container to track all confetti pieces
  const confettiPieces: Phaser.GameObjects.Rectangle[] = [];

  // Spawn confetti continuously
  const confettiTimer = scene.time.addEvent({
    delay: 150,
    loop: true,
    callback: () => {
      const x = Phaser.Math.Between(0, scene.scale.width);
      const y = -20;
      const size = Phaser.Math.Between(6, 14);
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500];
      const color = colors[Phaser.Math.Between(0, colors.length - 1)];

      const confetti = scene.add.rectangle(x, y, size, size, color);
      confetti.setDepth(999);
      
      // Add physics
      scene.physics.add.existing(confetti);
      const body = confetti.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(150, 350)
      );
      body.setAngularVelocity(Phaser.Math.Between(-200, 200));
      body.setAllowGravity(false);

      confettiPieces.push(confetti);

      // Remove after falling off screen
      scene.time.delayedCall(4000, () => {
        confetti.destroy();
        const index = confettiPieces.indexOf(confetti);
        if (index > -1) confettiPieces.splice(index, 1);
      });
    },
  });

  // Congratulations text above button with smooth jumping animation
  const congratsText = scene.add.text(
    scene.scale.width / 2, 
    scene.scale.height / 2 - 20, 
    "Congratulations \n You Win!", 
    {
      fontFamily: "Fredoka, Arial Black, sans-serif",
      fontSize: isMobile ? "25px" : "48px",
      color: "#ffff00",
      stroke: "#ff6600",
      align: 'center',
      strokeThickness: isMobile ? 6 : 8,
      shadow: { offsetX: 3, offsetY: 3, color: "#000", blur: 8, fill: true },
    }
  ).setOrigin(0.5).setDepth(1000);

  // Smooth jumping animation
  scene.tweens.add({
    targets: congratsText,
    y: scene.scale.height / 2 - 50,
    duration: 600,
    ease: 'Sine.easeInOut',
    repeat: -1,
    yoyo: true
  });

  const graphics = scene.add.graphics();
  graphics.setDepth(1000);
  const btnX = scene.scale.width / 2 - btnWidth / 2;
  const btnY = scene.scale.height / 2 + 80 - btnHeight / 2;

  graphics.fillStyle(0x00aa00, 1);
  graphics.fillRoundedRect(btnX, btnY, btnWidth, btnHeight, 25);

  ui.nextLevelButton = scene
    .add
    .text(scene.scale.width / 2, scene.scale.height / 2 + 80, "Next Level", {
      fontSize: fontSize,
      color: "#fff",
      fontStyle: "bold",
      stroke: "#000000ff",
      strokeThickness: strokeThickness,
      shadow: { offsetX: 3, offsetY: 3, color: "#000", blur: 8, fill: true },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .setDepth(1000);

  ui.nextLevelButton.on("pointerover", () => {
    scene.tweens.add({ targets: ui.nextLevelButton, scale: 1.1, duration: 150, ease: "Power2" });
  });
  ui.nextLevelButton.on("pointerout", () => {
    scene.tweens.add({ targets: ui.nextLevelButton, scale: 1, duration: 150, ease: "Power2" });
  });

  ui.nextLevelButton.on("pointerdown", () => {
    scene.tweens.add({
      targets: ui.nextLevelButton,
      scale: 0.95,
      yoyo: true,
      duration: 100,
      onComplete: () => {
        // Clean up confetti
        confettiTimer.remove();
        confettiPieces.forEach(c => c.destroy());
        
        graphics.destroy();
        congratsText.destroy();
        ui.nextLevelButton?.destroy();
        ui.nextLevelButton = undefined;
        
        // Redirect to map instead of continuing to next level
        scene.cameras.main.fadeOut(300, 0, 0, 0);
        scene.time.delayedCall(400, () => {
          window.location.href = "/MagicTree";
        });
      },
    });
  });
}

/**
 * Show Restart Button - RESPONSIVE
 */
export function showRestartButton(scene: Phaser.Scene, onRestart: () => void) {
  const isMobile = scene.scale.width < 768;
  
  const btnWidth = isMobile ? 200 : 260;
  const btnHeight = isMobile ? 60 : 80;
  const fontSize = isMobile ? "28px" : "36px";
  const strokeThickness = isMobile ? 4 : 5;

  // Failed text above button with smooth jumping animation
  const failedText = scene.add.text(
    scene.scale.width / 2, 
    scene.scale.height / 2 - 20, 
    "You Failed! Try Again", 
    {
      fontFamily: "Fredoka, Arial Black, sans-serif",
      fontSize: isMobile ? "32px" : "48px",
      color: "#ff3333",
      stroke: "#660000",
      strokeThickness: isMobile ? 6 : 8,
      shadow: { offsetX: 3, offsetY: 3, color: "#000", blur: 8, fill: true },
    }
  ).setOrigin(0.5);

  // Smooth jumping animation
  scene.tweens.add({
    targets: failedText,
    y: scene.scale.height / 2 - 50,
    duration: 600,
    ease: 'Sine.easeInOut',
    repeat: -1,
    yoyo: true
  });

  const graphics = scene.add.graphics();
  const btnX = scene.scale.width / 2 - btnWidth / 2;
  const btnY = scene.scale.height / 2 + 80 - btnHeight / 2;

  graphics.fillStyle(0x993333, 1);
  graphics.fillRoundedRect(btnX, btnY, btnWidth, btnHeight, 25);

  const restartButton = scene
    .add
    .text(scene.scale.width / 2, scene.scale.height / 2 + 80, "Restart", {
      fontSize: fontSize,
      color: "#fff",
      fontStyle: "bold",
      stroke: "#660000",
      strokeThickness: strokeThickness,
      shadow: { offsetX: 3, offsetY: 3, color: "#000", blur: 8, fill: true },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

  restartButton.on("pointerover", () => {
    scene.tweens.add({ targets: restartButton, scale: 1.1, duration: 150, ease: "Power2" });
  });
  restartButton.on("pointerout", () => {
    scene.tweens.add({ targets: restartButton, scale: 1, duration: 150, ease: "Power2" });
  });

  restartButton.on("pointerdown", () => {
    scene.tweens.add({
      targets: restartButton,
      scale: 0.95,
      yoyo: true,
      duration: 100,
      onComplete: () => {
        graphics.destroy();
        failedText.destroy();
        restartButton.destroy();
        onRestart();
      },
    });
  });

  return restartButton;
}

/**
 * Create Quit Button - RESPONSIVE (Positioned at bottom-left)
 */
export function createQuitButton(scene: Phaser.Scene): Phaser.GameObjects.Text {
  const isMobile = scene.scale.width < 768;
  
  const padding = isMobile ? 15 : 20;
  const btnWidth = isMobile ? 100 : 120;
  const btnHeight = isMobile ? 40 : 50;
  const fontSize = isMobile ? "22px" : "26px";
  const strokeThickness = isMobile ? 4 : 5;
  
  const x = btnWidth / 2 + padding;
  const y = scene.scale.height - btnHeight / 2 - padding;

  const bg = scene.add.graphics();
  bg.fillStyle(0x333399, 0.9);
  bg.fillRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 12);
  bg.setDepth(1000);

  const quitButton = scene.add.text(x, y, "Quit", {
    fontFamily: "Fredoka, Arial Black, sans-serif",
    fontSize: fontSize,
    color: "#fff",
    stroke: "#000066",
    strokeThickness: strokeThickness,
  })
  .setOrigin(0.5)
  .setInteractive({ useHandCursor: true })
  .setDepth(1001);

  quitButton.on("pointerover", () => {
    scene.tweens.add({ targets: quitButton, scale: 1.15, duration: 120, ease: "Power2" });
  });
  quitButton.on("pointerout", () => {
    scene.tweens.add({ targets: quitButton, scale: 1, duration: 120, ease: "Power2" });
  });

  quitButton.on("pointerdown", () => {
    scene.tweens.add({
      targets: quitButton,
      scale: 0.9,
      yoyo: true,
      duration: 100,
      onComplete: () => {
        const confirmQuit = window.confirm("👋 Are you sure you want to quit and return to the map?");
        if (confirmQuit) {
          scene.cameras.main.fadeOut(300, 0, 0, 0);
          scene.time.delayedCall(400, () => {
            window.location.href = "/MagicTree";
          });
        }
      },
    });
  });

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    bg.destroy();
    quitButton.destroy();
  });

  return quitButton; 
}