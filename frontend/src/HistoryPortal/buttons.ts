import Phaser from "phaser";

interface ButtonConfig {
  label: string;
  color?: string;
  y: number;
  onClick?: () => void;
}

/**
 * 🔘 Creates interactive game-themed buttons with animated feedback.
 * Automatically cleaned up when the scene ends.
 */
export function createStyledButtons(scene: Phaser.Scene, configs: ButtonConfig[]) {
  const created: Phaser.GameObjects.Container[] = [];
  const centerX = scene.scale.width / 2;

  configs.forEach((cfg) => {
    const color = cfg.color || "#3a7ca5";
    const rect = scene.add
      .rectangle(centerX, cfg.y, 240, 55, Phaser.Display.Color.HexStringToColor(color).color)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0)
      .setScale(0.8);

    const label = scene.add
      .text(centerX, cfg.y, cfg.label, {
        font: "22px 'Fredoka, Arial Black'",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const container = scene.add.container(0, 0, [rect, label]);
    created.push(container);

    // ✨ Entrance animation
    scene.tweens.add({
      targets: [rect, label],
      alpha: 1,
      scale: 1,
      duration: 600,
      ease: "Back.Out",
    });

    // Hover pulse
    rect.on("pointerover", () => {
      scene.tweens.add({
        targets: container,
        scale: 1.08,
        duration: 120,
        ease: "Power1",
      });
    });

    rect.on("pointerout", () => {
      scene.tweens.add({
        targets: container,
        scale: 1.0,
        duration: 120,
        ease: "Power1",
      });
    });

    // Click action
    rect.on("pointerdown", () => {
      rect.setAlpha(0.7);
      if (cfg.onClick) cfg.onClick();
    });

    rect.on("pointerup", () => rect.setAlpha(1));
  });

  const cleanup = () => created.forEach((obj) => obj.destroy());
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
  scene.events.once(Phaser.Scenes.Events.DESTROY, cleanup);

  return created;
}

/**
 * 🚪 Creates a left-side Quit button with WordWizard-style theme.
 * Animated, glowing, and transitions smoothly to /map when clicked.
 */
export function createQuitButton(scene: Phaser.Scene, y: number) {
  const x = scene.scale.width * 0.10; // ⬅️ Left side placement
  const width = 100;
  const height = 40;
  const cornerRadius = 20;

  // 🎨 Gradient background (red-orange theme)
  const bg = scene.add.graphics();
  const colorTop = Phaser.Display.Color.HexStringToColor("#ff4d4d").color;
  const colorBottom = Phaser.Display.Color.HexStringToColor("#b30000").color;
  bg.fillGradientStyle(colorTop, colorBottom, colorBottom, colorTop, 1);
  bg.fillRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
  bg.lineStyle(4, 0x000000, 0.9);
  bg.strokeRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
  bg.setAlpha(0).setScale(0.8);

  const label = scene.add
    .text(0, 0, "Quit", {
      fontFamily: "Fredoka, Arial Black, sans-serif",
      fontSize: "20px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6,
      align: "center",
    })
    .setOrigin(0.5)
    .setAlpha(0);

  const container = scene.add.container(x, y, [bg, label]);
  container.setSize(width, height);
  container.setInteractive({ useHandCursor: true });

  // 🎬 Fade-in animation
  scene.tweens.add({
    targets: [bg, label],
    alpha: 1,
    scale: 1,
    duration: 800,
    ease: "Back.Out",
  });

  // 🌟 Hover animation
  let hoverTween: Phaser.Tweens.Tween | null = null;
  container.on("pointerover", () => {
    if (hoverTween) hoverTween.stop();
    hoverTween = scene.tweens.add({
      targets: container,
      scale: 1.08,
      duration: 150,
      ease: "Power1",
    });
  });

  container.on("pointerout", () => {
    if (hoverTween) hoverTween.stop();
    hoverTween = scene.tweens.add({
      targets: container,
      scale: 1,
      duration: 150,
      ease: "Power1",
    });
  });

  // 🚪 Click animation + action
  container.on("pointerdown", () => {
    bg.setAlpha(0.7);
    scene.tweens.add({
      targets: container,
      scale: 0.95,
      duration: 100,
      yoyo: true,
      ease: "Back.InOut",
    });
    scene.cameras.main.fadeOut(500, 0, 0, 0);
    scene.time.delayedCall(500, () => {
      window.location.href = "/historymap";
    });
  });

  container.on("pointerup", () => bg.setAlpha(1));

  // 🧹 Auto-cleanup
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => container.destroy());
  scene.events.once(Phaser.Scenes.Events.DESTROY, () => container.destroy());

  return container;
}