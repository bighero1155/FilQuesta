import Phaser from "phaser";

/**
 * 🎉 Colorful falling confetti effect (Phaser 3.60+ compatible)
 */
export function showCongratulationsConfetti(scene: Phaser.Scene) {
  const width = scene.scale.width;

  const confettiColors = [
    0xff4757,
    0x1e90ff,
    0x2ed573,
    0xffc312,
    0xe84393,
    0x9980fa,
  ];

  // Generate textures
  confettiColors.forEach((color, index) => {
    const g = scene.add.graphics();

    // Rect
    g.fillStyle(color, 1);
    g.fillRect(0, 0, 12, 18);
    g.generateTexture("confetti_rect_" + index, 12, 18);
    g.clear();

    // Circle
    g.fillStyle(color, 1);
    g.fillCircle(7, 7, 7);
    g.generateTexture("confetti_circle_" + index, 14, 14);
    g.destroy();
  });

  // Main emitter system — Phaser 3.60 requires (x, y, textureKey, config)
  const particles = scene.add.particles(0, 0, "confetti_rect_0", {
    x: { min: 0, max: width },
    y: -20,

    lifespan: 4000,
    speedY: { min: 200, max: 420 },
    speedX: { min: -50, max: 50 },

    angle: { min: 260, max: 280 },
    rotate: { min: 0, max: 360 },

    scale: { start: 1, end: 0.5 },
    gravityY: 80,

    quantity: 8,
    frequency: 90,

    // Must be set to a default frame
    frame: "confetti_rect_0",
  });

  particles.setDepth(200);

  // ✔ Phaser 3.60 requires callback on the emitter, not frame:()
  particles.emitCallback = (particle: Phaser.GameObjects.Particles.Particle) => {
    const idx = Math.floor(Math.random() * confettiColors.length);
    const isCircle = Math.random() > 0.5;
    const frameKey = isCircle ? `confetti_circle_${idx}` : `confetti_rect_${idx}`;
    particle.frame = scene.textures.getFrame(frameKey)!;
  };

  // Stop emission after 2 seconds
  scene.time.delayedCall(2000, () => {
    particles.stop();
  });

  // Destroy entire particle system
  scene.time.delayedCall(5000, () => {
    particles.destroy();
  });
}
