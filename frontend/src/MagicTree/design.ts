import Phaser from "phaser";

/* ----------------------------------------------------------
 🎬 ANIMATIONS
---------------------------------------------------------- */
export const bounce = (scene: Phaser.Scene, target: Phaser.GameObjects.Sprite) => {
  scene.tweens.add({
    targets: target,
    y: target.y - 10,
    yoyo: true,
    duration: 150,
  });
};

export const tiltBasket = (basket: Phaser.GameObjects.Sprite, direction: "left" | "right") => {
  basket.setAngle(direction === "left" ? -5 : 5);
};

/* ----------------------------------------------------------
 ✨ PARTICLES (Improved Glow + Trail)
---------------------------------------------------------- */
export const createSparkle = (scene: Phaser.Scene, x: number, y: number) => {
  const colors = [0xffcc00, 0xff66cc, 0x66ff99, 0x66ccff, 0xffffff, 0xff6600];

  // Particle manager with glow effect
  const emitter = scene.add.particles(x, y, "spark", {
    speed: { min: 80, max: 160 },
    lifespan: { min: 400, max: 800 },
    quantity: 12,
    angle: { min: 0, max: 360 },
    scale: { start: 0.8, end: 0 },
    tint: colors,
    alpha: { start: 1, end: 0 },
    rotate: { min: 0, max: 360 },
    gravityY: 100,
    blendMode: "ADD",
    radial: true,
    frequency: -1,
  });

  // Flicker pulse
  scene.tweens.add({
    targets: emitter,
    alpha: { from: 1, to: 0.3 },
    duration: 200,
    yoyo: true,
    repeat: 2,
  });

  scene.time.delayedCall(800, () => emitter.destroy());
};

/* ----------------------------------------------------------
 🧱 UI ELEMENTS
---------------------------------------------------------- */
export const createScoreText = (scene: Phaser.Scene) => {
  const text = scene.add
    .text(20, 20, "Score: 0", {
      fontFamily: "Fredoka, Arial Black, sans-serif",
      fontSize: "28px",
      color: "#ffea00",
      stroke: "#4d2600",
      strokeThickness: 6,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: "#000000",
        blur: 4,
        fill: true,
      },
    })
    .setScrollFactor(0)
    .setDepth(1000);

  return text;
};

/* ----------------------------------------------------------
 💬 MESSAGES
---------------------------------------------------------- */
export const showMessage = (
  scene: Phaser.Scene,
  message: string,
  color: string = "#fff"
) => {
  const msg = scene.add
    .text(scene.scale.width / 2, scene.scale.height / 2, message, {
      fontFamily: "Fredoka, Arial Black, sans-serif",
      fontSize: "42px",
      color,
      stroke: "#000",
      strokeThickness: 8,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: "#000000",
        blur: 6,
        fill: true,
      },
    })
    .setOrigin(0.5)
    .setAlpha(0)
    .setScale(0.6)
    .setDepth(2000);

  scene.tweens.add({
    targets: msg,
    alpha: 1,
    scale: { from: 0.6, to: 1 },
    ease: "Back.Out",
    duration: 500,
    yoyo: true,
    hold: 600,
    onComplete: () => msg.destroy(),
  });

  createSparkle(scene, msg.x, msg.y + 20);
};

/* ----------------------------------------------------------
 🕹️ GAME BUTTONS
---------------------------------------------------------- */
export const createGameButton = (
  scene: Phaser.Scene,
  label: string,
  x: number,
  y: number,
  color: number = 0x00b300,
  onClick: () => void
) => {
  // --- Button background (rounded rectangle)
  const paddingX = 40;
  const paddingY = 20;
  const cornerRadius = 20;

  const bg = scene.add.graphics();
  bg.fillStyle(color, 1);
  bg.fillRoundedRect(
    x - paddingX,
    y - paddingY,
    280, // width — adjust to fit text width if needed
    80,  // height — adjust based on text size
    cornerRadius
  );
  bg.setDepth(1499);

  // --- Button text
  const text = scene.add
    .text(x + 100, y + 20, label, {
      fontFamily: "Fredoka, Arial Black, sans-serif",
      fontSize: "36px",
      color: "#ffffff",
      align: "center",
      stroke: "#000000",
      strokeThickness: 6,
    })
    .setOrigin(0.5)
    .setDepth(1500);

  // --- Combine into a container (treat as one unit)
  const button = scene.add.container(x, y, [bg, text]).setSize(280, 80);
  button.setInteractive(new Phaser.Geom.Rectangle(0, 0, 280, 80), Phaser.Geom.Rectangle.Contains);

  // --- Hover animation
  button.on("pointerover", () => {
    scene.tweens.add({
      targets: button,
      scale: { from: 1, to: 1.1 },
      duration: 150,
      ease: "Back.Out",
    });
    createSparkle(scene, x, y);
  });

  // --- Click animation
  button.on("pointerdown", () => {
    scene.tweens.add({
      targets: button,
      scale: { from: 1.1, to: 0.9 },
      duration: 100,
      yoyo: true,
      ease: "Back.InOut",
    });
    createSparkle(scene, x, y);
    scene.sound?.play?.("click", { volume: 0.3 });
    onClick();
  });

  // --- Reset on pointer out
  button.on("pointerout", () => {
    scene.tweens.add({
      targets: button,
      scale: { from: button.scale, to: 1 },
      duration: 100,
    });
  });

  return button;
};

