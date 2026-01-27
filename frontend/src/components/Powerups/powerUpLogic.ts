import { activatePowerUp } from "../../services/powerUpService";

export interface PowerUpHandlers {
  activateTimeFreeze: (
    userId: number,
    scene: Phaser.Scene,
    duration?: number
  ) => Promise<void>;
  activateScoreBooster: (
    userId: number,
    scene: Phaser.Scene,
    multiplier?: number
  ) => Promise<number>;
  activateSecondChance: (userId: number, scene: Phaser.Scene) => Promise<void>;
}

/**
 * 🎮 Centralized logic for using power-ups across all games/scenes.
 * ⚡ All API calls use skipLoading flag to prevent loading screen interruption.
 */
export const PowerUpLogic: PowerUpHandlers = {
  /**
   * 🧊 Time Freeze — pauses all scene updates, timers, and tweens for X seconds.
   * ⚡ API call happens in background without blocking gameplay
   */
  async activateTimeFreeze(userId, scene, duration = 10) {
    console.log(`🧊 Time Freeze activated for ${duration} seconds`);

    // ✅ IMMEDIATE VISUAL FEEDBACK - No waiting for API
    scene.time.timeScale = 0;
    scene.physics.world.timeScale = 0;
    scene.tweens.timeScale = 0;

    // Create ice/freeze overlay effects on screen edges
    const { width, height } = scene.scale;
    
    // Create semi-transparent blue overlay
    const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x0080ff, 0.15)
      .setDepth(90);

    // Create frozen border effect
    const borderGraphics = scene.add.graphics();
    borderGraphics.setDepth(91);
    
    // Animated ice crystals on edges
    const drawFrozenBorder = (alpha: number) => {
      borderGraphics.clear();
      borderGraphics.lineStyle(8, 0x00bfff, alpha);
      borderGraphics.strokeRect(10, 10, width - 20, height - 20);
      
      // Inner glow
      borderGraphics.lineStyle(4, 0xffffff, alpha * 0.5);
      borderGraphics.strokeRect(15, 15, width - 30, height - 30);
    };

    drawFrozenBorder(0.8);

    // Pulsing animation for frozen border
    scene.tweens.add({
      targets: { alpha: 0.8 },
      alpha: 0.4,
      duration: 500,
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) => {
        const obj = tween.targets[0] as any;
        drawFrozenBorder(obj.alpha);
      }
    });

    // Add snowflake particles on the edges
    const snowflakes: Phaser.GameObjects.Graphics[] = [];
    for (let i = 0; i < 20; i++) {
      const isVertical = Math.random() > 0.5;
      const x = isVertical ? (Math.random() > 0.5 ? 30 : width - 30) : Math.random() * width;
      const y = isVertical ? Math.random() * height : (Math.random() > 0.5 ? 30 : height - 30);
      
      const snowflake = scene.add.graphics();
      snowflake.lineStyle(2, 0xffffff, 0.8);
      snowflake.beginPath();
      snowflake.moveTo(x - 5, y);
      snowflake.lineTo(x + 5, y);
      snowflake.moveTo(x, y - 5);
      snowflake.lineTo(x, y + 5);
      snowflake.moveTo(x - 3, y - 3);
      snowflake.lineTo(x + 3, y + 3);
      snowflake.moveTo(x - 3, y + 3);
      snowflake.lineTo(x + 3, y - 3);
      snowflake.closePath();
      snowflake.strokePath();
      snowflake.setDepth(92);
      
      scene.tweens.add({
        targets: snowflake,
        alpha: { from: 0.8, to: 0.2 },
        rotation: Math.PI * 2,
        duration: 2000,
        yoyo: true,
        repeat: -1
      });
      
      snowflakes.push(snowflake);
    }

    const text = scene.add
      .text(width / 2, height / 2, "❄️ TIME FROZEN ❄️", {
        font: "bold 48px Arial",
        color: "#ffffff",
        stroke: "#0066cc",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setAlpha(0);

    // Fade in text
    scene.tweens.add({
      targets: text,
      alpha: 1,
      scale: { from: 0.5, to: 1.2 },
      duration: 500,
      ease: 'Back.easeOut'
    });

    // Pulse animation
    scene.tweens.add({
      targets: text,
      scale: { from: 1.2, to: 1.3 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Resume after the duration
    const resumeTimer = setTimeout(() => {
      scene.time.timeScale = 1;
      scene.physics.world.timeScale = 1;
      scene.tweens.timeScale = 1;
      
      // Fade out and destroy all effects
      scene.tweens.add({
        targets: [overlay, borderGraphics, text, ...snowflakes],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          overlay.destroy();
          borderGraphics.destroy();
          text.destroy();
          snowflakes.forEach(s => s.destroy());
        }
      });
      
      console.log("⏯ Time resumed");
    }, duration * 1000);

    // ⚡ API call in background (skipLoading is already set in service)
    try {
      const res = await activatePowerUp(userId, "time_freeze");
      const actualDuration = res.duration || duration;
      
      // Adjust timer if server returns different duration
      if (actualDuration !== duration) {
        clearTimeout(resumeTimer);
        setTimeout(() => {
          scene.time.timeScale = 1;
          scene.physics.world.timeScale = 1;
          scene.tweens.timeScale = 1;
          
          scene.tweens.add({
            targets: [overlay, borderGraphics, text, ...snowflakes],
            alpha: 0,
            duration: 500,
            onComplete: () => {
              overlay.destroy();
              borderGraphics.destroy();
              text.destroy();
              snowflakes.forEach(s => s.destroy());
            }
          });
        }, actualDuration * 1000);
      }
    } catch (err) {
      console.error("Failed to sync Time Freeze with server:", err);
    }
  },

  /**
   * ⚡ Score Booster — applies a multiplier to the next earned score.
   * Returns the multiplier immediately, syncs with server in background.
   */
  async activateScoreBooster(userId, scene, multiplier = 2) {
    console.log(`⚡ Score Booster activated: x${multiplier}`);

    const { width, height } = scene.scale;

    // Golden energy overlay
    const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0xffd700, 0.12)
      .setDepth(90);

    // Animated golden border
    const borderGraphics = scene.add.graphics();
    borderGraphics.setDepth(91);
    
    const drawGoldenBorder = (alpha: number, offset: number) => {
      borderGraphics.clear();
      borderGraphics.lineStyle(6, 0xffd700, alpha);
      borderGraphics.strokeRect(10 - offset, 10 - offset, width - 20 + offset * 2, height - 20 + offset * 2);
      
      borderGraphics.lineStyle(3, 0xffed4e, alpha * 0.7);
      borderGraphics.strokeRect(15 - offset, 15 - offset, width - 30 + offset * 2, height - 30 + offset * 2);
    };

    drawGoldenBorder(0.9, 0);

    // Expanding pulse animation
    scene.tweens.add({
      targets: { alpha: 0.9, offset: 0 },
      alpha: 0.5,
      offset: 5,
      duration: 600,
      yoyo: true,
      repeat: 2,
      onUpdate: (tween) => {
        const obj = tween.targets[0] as any;
        drawGoldenBorder(obj.alpha, obj.offset);
      }
    });

    // Sparkles around the edges
    const sparkles: Phaser.GameObjects.Graphics[] = [];
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const radius = Math.min(width, height) / 2 - 40;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      const sparkle = scene.add.graphics();
      sparkle.fillStyle(0xffd700, 1);
      
      // Draw a 4-pointed star manually
      sparkle.beginPath();
      for (let p = 0; p < 8; p++) {
        const starAngle = (Math.PI * 2 * p) / 8;
        const starRadius = p % 2 === 0 ? 6 : 3;
        const px = x + Math.cos(starAngle) * starRadius;
        const py = y + Math.sin(starAngle) * starRadius;
        if (p === 0) sparkle.moveTo(px, py);
        else sparkle.lineTo(px, py);
      }
      sparkle.closePath();
      sparkle.fillPath();
      sparkle.setDepth(92);
      
      scene.tweens.add({
        targets: sparkle,
        alpha: { from: 1, to: 0 },
        scale: { from: 1, to: 1.5 },
        duration: 1000,
        delay: i * 30,
        onComplete: () => sparkle.destroy()
      });
      
      sparkles.push(sparkle);
    }

    const text = scene.add
      .text(width / 2, height / 2, `⭐ SCORE BOOST x${multiplier}! ⭐`, {
        font: "bold 48px Arial",
        color: "#ffffff",
        stroke: "#cc8400",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setAlpha(0);

    scene.tweens.add({
      targets: text,
      alpha: 1,
      scale: { from: 0.5, to: 1.3 },
      duration: 400,
      ease: 'Back.easeOut'
    });

    scene.time.delayedCall(2000, () => {
      scene.tweens.add({
        targets: [overlay, borderGraphics, text],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          overlay.destroy();
          borderGraphics.destroy();
          text.destroy();
        }
      });
    });

    // ⚡ API call in background
    try {
      const res = await activatePowerUp(userId, "score_booster");
      const serverMultiplier = res.multiplier || multiplier;
      
      if (serverMultiplier !== multiplier) {
        console.log(`Server returned different multiplier: x${serverMultiplier}`);
        return serverMultiplier;
      }
    } catch (err) {
      console.error("Failed to sync Score Booster with server:", err);
    }

    return multiplier;
  },

  /**
   * ♻️ Second Chance — gives player an in-game retry effect.
   * Shows immediate feedback, syncs with server in background.
   * ⭐ NOTE: This ONLY shows visual effects. The scene handles game state reset.
   */
  async activateSecondChance(userId, scene) {
    console.log("♻️ Second Chance activated");

    const { width, height } = scene.scale;

    // Green revival overlay
    const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x00ff88, 0.2)
      .setDepth(90);

    // Animated green border with revival effect
    const borderGraphics = scene.add.graphics();
    borderGraphics.setDepth(91);
    
    const drawRevivalBorder = (alpha: number, pulseSize: number) => {
      borderGraphics.clear();
      
      // Outer pulse
      borderGraphics.lineStyle(8, 0x00ff88, alpha * 0.5);
      borderGraphics.strokeRect(10 - pulseSize, 10 - pulseSize, width - 20 + pulseSize * 2, height - 20 + pulseSize * 2);
      
      // Inner border
      borderGraphics.lineStyle(5, 0x00cc66, alpha);
      borderGraphics.strokeRect(15, 15, width - 30, height - 30);
      
      // Bright inner glow
      borderGraphics.lineStyle(3, 0xffffff, alpha * 0.6);
      borderGraphics.strokeRect(18, 18, width - 36, height - 36);
    };

    drawRevivalBorder(1, 0);

    // Expanding pulse from center
    scene.tweens.add({
      targets: { alpha: 1, pulseSize: 0 },
      alpha: 0.3,
      pulseSize: 20,
      duration: 800,
      yoyo: true,
      repeat: 1,
      onUpdate: (tween) => {
        const obj = tween.targets[0] as any;
        drawRevivalBorder(obj.alpha, obj.pulseSize);
      }
    });

    // Create heart particles emanating from corners
    const hearts: Phaser.GameObjects.Text[] = [];
    const corners = [
      { x: 50, y: 50 },
      { x: width - 50, y: 50 },
      { x: 50, y: height - 50 },
      { x: width - 50, y: height - 50 }
    ];

    corners.forEach((corner, idx) => {
      for (let i = 0; i < 5; i++) {
        const heart = scene.add.text(corner.x, corner.y, '💚', {
          fontSize: '24px'
        }).setDepth(92).setAlpha(0.8);
        
        const targetX = width / 2;
        const targetY = height / 2;
        
        scene.tweens.add({
          targets: heart,
          x: targetX,
          y: targetY,
          alpha: 0,
          scale: { from: 1, to: 0.3 },
          duration: 1200,
          delay: i * 100 + idx * 50,
          ease: 'Cubic.easeIn',
          onComplete: () => heart.destroy()
        });
        
        hearts.push(heart);
      }
    });

    const text = scene.add
      .text(width / 2, height / 2, "♻️ SECOND CHANCE! ♻️", {
        font: "bold 52px Arial",
        color: "#ffffff",
        stroke: "#00cc66",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(200)
      .setAlpha(0);

    scene.tweens.add({
      targets: text,
      alpha: 1,
      scale: { from: 0.3, to: 1.2 },
      duration: 600,
      ease: 'Elastic.easeOut'
    });

    scene.time.delayedCall(2000, () => {
      scene.tweens.add({
        targets: [overlay, borderGraphics, text],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          overlay.destroy();
          borderGraphics.destroy();
          text.destroy();
        }
      });
    });

    // ⚡ API call in background
    try {
      const res = await activatePowerUp(userId, "second_chance");
      console.log("Second Chance synced with server:", res.message);
    } catch (err) {
      console.error("Failed to sync Second Chance with server:", err);
    }
  },
};