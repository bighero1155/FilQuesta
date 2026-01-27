import Phaser from "phaser";

interface ButtonConfig {
  label: string;
  color: string;
  onClick?: () => void;
}

export function createStyledButtons(scene: Phaser.Scene, configs: ButtonConfig[]) {
  const created: Phaser.GameObjects.Container[] = [];
  const total = configs.length;

  const isMobile = scene.scale.width < 768;

  // Button sizes
  const width = isMobile ? 220 : 240;
  const height = isMobile ? 65 : 70;

  const screenW = scene.scale.width;
  const screenH = scene.scale.height;

  // ⬅️ CHANGED: Vertical layout instead of horizontal
  const centerX = screenW / 2;
  
  // ⬅️ ADJUSTABLE: Move buttons up/down by changing this value
  // centerY - value = move UP
  // centerY + value = move DOWN
  const verticalOffset = isMobile ? 150 : 180; // Adjust this number!
  const centerY = screenH / 2 + verticalOffset; // Add offset to move down

  // ⬅️ ADJUSTABLE: Vertical spacing between buttons
  const verticalSpacing = isMobile ? 20 : 30; // Gap between buttons vertically

  // Calculate starting Y position to center all buttons vertically
  const totalHeight = total * height + (total - 1) * verticalSpacing;
  const startY = centerY - totalHeight / 2 + height / 2;

  configs.forEach((cfg, index) => {
    // ⬅️ CHANGED: Position buttons vertically
    const x = centerX;
    const y = startY + index * (height + verticalSpacing);

    const cornerRadius = isMobile ? 18 : 20;

    // Colors
    const bg = scene.add.graphics();
    const baseColor = Phaser.Display.Color.HexStringToColor(cfg.color).color;
    const darkColor = Phaser.Display.Color.HexStringToColor(cfg.color).darken(35).color;

    // Button background
    bg.fillGradientStyle(baseColor, darkColor, darkColor, baseColor, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
    bg.lineStyle(4, 0x000000, 0.9);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);

    const fontSize = isMobile ? "24px" : "26px";
    const strokeThickness = isMobile ? 5 : 6;

    // Label text
    const label = scene.add.text(0, 0, cfg.label, {
      fontFamily: "Fredoka, Arial Black, sans-serif",
      fontSize: fontSize,
      color: "#ffffff",
      stroke: "#000",
      strokeThickness: strokeThickness,
      align: "center",
    }).setOrigin(0.5);

    const container = scene.add.container(x, y, [bg, label]);
    container.setSize(width, height);
    container.setInteractive({ useHandCursor: true });
    created.push(container);

    // Hover animation
    container.on("pointerover", () => {
      scene.tweens.add({
        targets: container,
        scale: 1.07,
        duration: 120,
        ease: "Power1",
      });
    });

    container.on("pointerout", () => {
      scene.tweens.add({
        targets: container,
        scale: 1,
        duration: 120,
        ease: "Power1",
      });
    });

    // Click animation
    container.on("pointerdown", () => {
      scene.tweens.add({
        targets: container,
        scale: 0.94,
        duration: 80,
        yoyo: true,
        ease: "Back.InOut",
      });
      bg.setAlpha(0.7);
      cfg.onClick?.();
    });

    container.on("pointerup", () => {
      bg.setAlpha(1);
    });
  });

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    created.forEach(btn => btn.destroy());
  });
  scene.events.once(Phaser.Scenes.Events.DESTROY, () => {
    created.forEach(btn => btn.destroy());
  });

  return created;
}

/* Quit button - Now with responsive fixes */
export function createQuitButton(scene: Phaser.Scene) {
  const isMobile = scene.scale.width < 768;
  
  const x = isMobile ? 80 : 95;
  const y = isMobile ? 630 : 750;
  
  const width = isMobile ? 140 : 150;
  const height = isMobile ? 60 : 65;
  const cornerRadius = isMobile ? 16 : 18;

  // --- Background ---
  const bg = scene.add.graphics();
  const baseColor = Phaser.Display.Color.HexStringToColor("#f44336").color; // red
  const darkColor = Phaser.Display.Color.HexStringToColor("#b71c1c").color;

  bg.fillGradientStyle(baseColor, darkColor, darkColor, baseColor, 1);
  bg.fillRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
  bg.lineStyle(4, 0x000000, 0.9);
  bg.strokeRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);

  const fontSize = isMobile ? "26px" : "28px";
  const strokeThickness = isMobile ? 5 : 6;

  // --- Label ---
  const label = scene.add.text(0, 0, "Quit", {
    fontFamily: "Fredoka, Arial Black, sans-serif",
    fontSize: fontSize,
    color: "#fff",
    stroke: "#000",
    strokeThickness: strokeThickness, 
  }).setOrigin(0.5);

  // --- Container ---
  const container = scene.add.container(x, y, [bg, label]);
  container.setSize(width, height);
  container.setInteractive({ useHandCursor: true });
  container.setDepth(10);

  // --- Hover animation ---
  let hoverTween: Phaser.Tweens.Tween | null = null;
  container.on("pointerover", () => {
    if (hoverTween) hoverTween.stop();
    hoverTween = scene.tweens.add({
      targets: container,
      scale: 1.1,
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

  // --- Click ---
  container.on("pointerdown", () => {
    scene.tweens.add({
      targets: container,
      scale: 0.95,
      duration: 100,
      yoyo: true,
      ease: "Back.InOut",
    });
    bg.setAlpha(0.7);
  });

  container.on("pointerup", () => {
    bg.setAlpha(1);
    const confirmQuit = window.confirm("⚠️ Quit the game and return to map?");
    if (confirmQuit) {
      window.location.href = "/wordwizardmap";
    }
  });

  // --- Cleanup ---
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => container.destroy());
  scene.events.once(Phaser.Scenes.Events.DESTROY, () => container.destroy());

  return container;
}