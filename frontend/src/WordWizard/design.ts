// src/WordWizard/design.ts
import Phaser from "phaser";

/**
 * 📱 Responsive scaling helper - SEPARATED for desktop and mobile
 */
export function getScale(scene: Phaser.Scene) {
  const isMobile = scene.scale.width < 768;
  
  if (isMobile) {
    // Mobile: Dynamic scaling based on screen size
    const baseWidth = 1600;
    const baseHeight = 900;
    const scaleW = scene.scale.width / baseWidth;
    const scaleH = scene.scale.height / baseHeight;
    let scale = Math.min(scaleW, scaleH);
    
    scale *= 1.1;
    if (window.devicePixelRatio > 1.5) scale *= 1.05;
    
    return Phaser.Math.Clamp(scale * 1.2, 0.5, 2.2);
  } else {
    // Desktop: Fixed scale (no dynamic calculations)
    return 1.0; // ⬅️ Fixed scale for desktop
  }
}

// --- COLORS & FONTS ---
export const COLORS = {
  background: ["#667eea", "#764ba2"],
  slotBorder: 0x9f7aea,
  slotFill: 0xffffff,
  slotShadow: 0x805ad5, 

  tileFill: "#fbbf24",
  tileStroke: "#f59e0b",
  tileText: "#1f2937",
  tileShadow: 0xd97706,

  correct: "#34d399",
  wrong: "#f87171",

  infoText: "#ffffff",
  buttonBg: "#8b5cf6",
  buttonText: "#ffffff",

  sparkle: 0xfef3c7,
  winSparkle: 0xfde047,
};

/**
 * 🧹 Utility to clear leftover design objects before creating new ones
 */
export function clearDesignElements(scene: Phaser.Scene) {
  scene.children.list.forEach((child: any) => {
    if (child?.tag === "design-element") child.destroy();
  });
}

// --- BACKGROUND ---
export function createBackground(scene: Phaser.Scene, imageKey?: string) {
  clearDesignElements(scene);

  if (imageKey && scene.textures.exists(imageKey)) {
    const bg = scene.add.image(scene.scale.width / 2, scene.scale.height / 2, imageKey);
    bg.setDisplaySize(scene.scale.width, scene.scale.height);
    (bg as any).tag = "design-element";
  } else {
    const graphics = scene.add.graphics();
    const { width, height } = scene.scale;

    for (let i = 0; i < height; i++) {
      const t = i / height;
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.HexStringToColor(COLORS.background[0]),
        Phaser.Display.Color.HexStringToColor(COLORS.background[1]),
        100,
        t * 100
      );
      graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
      graphics.fillRect(0, i, width, 1);
    }

    graphics.setDepth(-2);
    (graphics as any).tag = "design-element";
    createSoftShapes(scene);
  }

  createFloatingSparkles(scene);
}

// --- SOFT DECORATIVE SHAPES ---
function createSoftShapes(scene: Phaser.Scene) {
  const isMobile = scene.scale.width < 768;
  const s = getScale(scene);
  
  const shapes = scene.add.graphics();
  shapes.setDepth(-1);
  (shapes as any).tag = "design-element";

  if (isMobile) {
    // Mobile: Use scale factor
    shapes.fillStyle(0xffffff, 0.05);
    shapes.fillCircle(120 * s, 120 * s, 140 * s);
    shapes.fillCircle(scene.scale.width - 150 * s, 160 * s, 120 * s);
    shapes.fillCircle(scene.scale.width / 2, scene.scale.height - 100 * s, 160 * s);

    shapes.fillStyle(0xffffff, 0.03);
    shapes.fillCircle(scene.scale.width - 180 * s, scene.scale.height - 140 * s, 200 * s);
    shapes.fillCircle(150 * s, scene.scale.height - 160 * s, 120 * s);
  } else {
    // Desktop: Fixed sizes
    shapes.fillStyle(0xffffff, 0.05);
    shapes.fillCircle(120, 120, 140);
    shapes.fillCircle(scene.scale.width - 150, 160, 120);
    shapes.fillCircle(scene.scale.width / 2, scene.scale.height - 100, 160);

    shapes.fillStyle(0xffffff, 0.03);
    shapes.fillCircle(scene.scale.width - 180, scene.scale.height - 140, 200);
    shapes.fillCircle(150, scene.scale.height - 160, 120);
  }
}

// --- WORD SLOTS ---
export function createSlot(scene: Phaser.Scene, x: number, y: number) {
  const isMobile = scene.scale.width < 768;
  const s = getScale(scene);
  
  // ⬅️ FIXED: Desktop uses fixed values, mobile uses LARGER scale factor
  const size = isMobile ? 130 * s : 110; // Mobile: 130 (bigger)
  const radius = isMobile ? 22 * s : 20;
  const yOffset = isMobile ? 0 : 130; // Mobile: no offset for fullscreen
  const lineWidth = isMobile ? 5 * s : 4; // Mobile: thicker border
  
  y += yOffset;

  const shadow = scene.add.graphics();
  shadow.fillStyle(COLORS.slotShadow, 0.3);
  shadow.fillRoundedRect(
    x - size / 2 + (isMobile ? 3 * s : 3), 
    y - size / 2 + (isMobile ? 3 * s : 3), 
    size, 
    size, 
    radius
  );
  shadow.setDepth(1);
  (shadow as any).tag = "design-element";

  const g = scene.add.graphics();
  g.fillStyle(COLORS.slotFill, 1);
  g.lineStyle(lineWidth, COLORS.slotBorder, 1);
  g.fillRoundedRect(x - size / 2, y - size / 2, size, size, radius);
  g.strokeRoundedRect(x - size / 2, y - size / 2, size, size, radius);
  g.setDepth(2);
  (g as any).tag = "design-element";

  const slot = scene.add.zone(x, y, size, size);
  (slot as any).graphics = g;
  (slot as any).shadow = shadow;
  (slot as any).expected = "";
  (slot as any).filled = null;
  (slot as any).tag = "design-element";

  slot.on("destroy", () => {
    shadow.destroy();
    g.destroy();
  });

  return slot;
}

// --- LETTER TILES ---
export function createTile(scene: Phaser.Scene, letter: string, x: number, y: number) {
  const isMobile = scene.scale.width < 768;
  const s = getScale(scene);

  const size = isMobile ? 120 * s : 100; // Mobile/pc
  const radius = isMobile ? 22 * s : 20; // Mobile/pc
  const yOffset = isMobile ? 0 : 160; // Mobile/pc
  const shadowOffset = isMobile ? 4 * s : 3; // Mobile/pc
  const lineWidth = isMobile ? 4 * s : 3; // Mobile/pc
  
  y += yOffset;

  const container = scene.add.container(x, y);
  (container as any).tag = "design-element";

  const shadow = scene.add.graphics();
  shadow.fillStyle(COLORS.tileShadow, 0.4);
  shadow.fillRoundedRect(-size / 2 + shadowOffset, -size / 2 + shadowOffset, size, size, radius);
  container.add(shadow);

  const bg = scene.add.graphics();
  bg.fillStyle(Phaser.Display.Color.HexStringToColor(COLORS.tileFill).color, 1);
  bg.lineStyle(lineWidth, Phaser.Display.Color.HexStringToColor(COLORS.tileStroke).color, 1);
  bg.fillRoundedRect(-size / 2, -size / 2, size, size, radius);
  bg.strokeRoundedRect(-size / 2, -size / 2, size, size, radius);
  container.add(bg);

  const fontSize = isMobile ? Math.round(70 * s * 1.6) : 60; // Mobile/pc
  const text = scene.add
    .text(0, 0, letter, {
      font: `bold ${fontSize}px Arial`,
      color: COLORS.tileText,
    })
    .setOrigin(0.5);
  container.add(text);

  container.setSize(size, size);
  container.setDepth(3);

  (container as any).home = { x, y };
  (container as any).letter = letter;
  (container as any).bg = bg;
  (container as any).text = text;

  container.setInteractive({ draggable: true, useHandCursor: true });

  if (!isMobile) {
    container.on("pointerover", () => {
      scene.tweens.add({ targets: container, scale: 1.1, duration: 150, ease: "Back.easeOut" });
    });
    container.on("pointerout", () => {
      scene.tweens.add({ targets: container, scale: 1, duration: 150, ease: "Back.easeIn" });
    });
  }

  return container;
}

// --- INFO TEXT ---
export function createInfoText(scene: Phaser.Scene, text: string) {
  const isMobile = scene.scale.width < 768;
  const s = getScale(scene);
  
  const fontSize = isMobile ? Math.round(38 * s * 1.6) : 42; // Mobile/pc
  const yPos = isMobile ? 140 : 40; // Mobile/pc
  const strokeThickness = isMobile ? 5 : 5;  // Mobile/pc

  const label = scene.add
    .text(scene.scale.width / 2, yPos, text, {
      font: `bold ${fontSize}px Arial`,
      color: COLORS.infoText,
      stroke: "#5b21b6",
      strokeThickness: strokeThickness,
      align: "center",
    })
    .setOrigin(0.5, 0)
    .setDepth(10);

  (label as any).tag = "design-element";

  scene.tweens.add({
    targets: label,
    y: yPos + 5,
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });

  return label;
}

// --- FLOATING SPARKLES ---
function createFloatingSparkles(scene: Phaser.Scene) {
  const isMobile = scene.scale.width < 768;
  const s = getScale(scene);

  const graphics = scene.add.graphics();
  graphics.fillStyle(COLORS.sparkle, 1);
  graphics.fillCircle(3, 3, 3);
  graphics.generateTexture("sparkleParticle", 6, 6);
  graphics.destroy();

  if (isMobile) {
    const density = 0.6;
    const emitter = scene.add.particles(0, 0, "sparkleParticle", {
      x: { min: 0, max: scene.scale.width },
      y: { min: -20, max: scene.scale.height },
      lifespan: 5000,
      speedY: { min: 10 * density, max: 35 * density },
      speedX: { min: -10 * density, max: 10 * density },
      scale: { start: s, end: 0 },
      alpha: { start: 0.6, end: 0 },
      quantity: Math.round(1 * density),
      frequency: 250,
    });
    emitter.setDepth(0);
    (emitter as any).tag = "design-element";
  } else {
    const emitter = scene.add.particles(0, 0, "sparkleParticle", {
      x: { min: 0, max: scene.scale.width },
      y: { min: -20, max: scene.scale.height },
      lifespan: 5000,
      speedY: { min: 10, max: 35 },
      speedX: { min: -10, max: 10 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.6, end: 0 },
      quantity: 1,
      frequency: 250,
    });
    emitter.setDepth(0);
    (emitter as any).tag = "design-element";
  }
}

// --- FEEDBACK ANIMATION ---
export function showSlotFeedback(scene: Phaser.Scene, slot: Phaser.GameObjects.Zone, isCorrect: boolean) {
  const isMobile = scene.scale.width < 768;
  const s = getScale(scene);
  
  const g = (slot as any).graphics;
  const color = isCorrect ? COLORS.correct : COLORS.wrong;
  const colorObj = Phaser.Display.Color.HexStringToColor(color);

  const size = isMobile ? 110 * s : 110;  // Mobile/pc
  const radius = isMobile ? 20 * s : 20;  // Mobile/pc
  const lineWidth = isMobile ? 4 * s : 4;  // Mobile/pc

  scene.tweens.add({
    targets: { value: 0 },
    value: 1,
    duration: 300,
    yoyo: true,
    onUpdate: (tween) => {
      const t = tween.getValue();
      if (t == null) return;
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(
        colorObj,
        Phaser.Display.Color.HexStringToColor("#ffffff"),
        100,
        t * 100
      );
      g.clear();
      g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1);
      g.lineStyle(lineWidth, COLORS.slotBorder, 1);
      g.fillRoundedRect(slot.x - size / 2, slot.y - size / 2, size, size, radius);
      g.strokeRoundedRect(slot.x - size / 2, slot.y - size / 2, size, size, radius);
    },
  });
}
export function createInputField(
  x: number,
  y: number,
  maxLength: number,
  onSubmit: () => void
): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = maxLength;
  input.placeholder = "Type the word here...";
  input.style.position = "absolute";
  input.style.left = `${x - 150}px`;
  input.style.top = `${y - 25}px`;
  input.style.width = "300px";
  input.style.height = "50px";
  input.style.fontSize = "24px";
  input.style.textAlign = "center";
  input.style.textTransform = "uppercase";
  input.style.border = "3px solid #fbbf24";
  input.style.borderRadius = "10px";
  input.style.backgroundColor = "#1f2937";
  input.style.color = "#ffffff";
  input.style.outline = "none";
  input.style.fontWeight = "bold";
  input.style.zIndex = "1000";

  // Auto-convert to uppercase
  input.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.toUpperCase();
  });

  // Submit on Enter key
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  });

  document.body.appendChild(input);

  // Auto-focus the input
  setTimeout(() => input.focus(), 100);

  return input;
}

// --- TYPING MODE: SUBMIT BUTTON ---
export function createSubmitButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  onClick: () => void
): Phaser.GameObjects.Container {
  const isMobile = scene.scale.width < 768;
  const buttonWidth = isMobile ? 180 : 220;
  const buttonHeight = isMobile ? 50 : 60;

  const container = scene.add.container(x, y);

  const bg = scene.add.graphics();
  bg.fillStyle(0x10b981, 1);
  bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);
  bg.lineStyle(4, 0xffffff, 1);
  bg.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);

  const text = scene.add.text(0, 0, "✓ SUBMIT", {
    fontSize: isMobile ? "24px" : "32px",
    fontStyle: "bold",
    color: "#ffffff",
  })
    .setOrigin(0.5);

  container.add([bg, text]);
  container.setDepth(10);
  container.setInteractive(
    new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight),
    Phaser.Geom.Rectangle.Contains
  );

  container.on("pointerdown", onClick);

  container.on("pointerover", () => {
    bg.clear();
    bg.fillStyle(0x059669, 1);
    bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);
    bg.lineStyle(4, 0xffffff, 1);
    bg.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);
  });

  container.on("pointerout", () => {
    bg.clear();
    bg.fillStyle(0x10b981, 1);
    bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);
    bg.lineStyle(4, 0xffffff, 1);
    bg.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);
  });

  return container;
}

// --- TYPING MODE: STATIC LETTER DISPLAY ---
export function createStaticLetterDisplay(
  scene: Phaser.Scene,
  letters: string[],
  x: number,
  y: number
): Phaser.GameObjects.Container {
  const isMobile = scene.scale.width < 768;
  const s = getScale(scene);

  const size = isMobile ? 120 * s : 100;
  const radius = isMobile ? 22 * s : 20;
  const spacing = isMobile ? 70 : 130;
  const lineWidth = isMobile ? 4 * s : 3;

  const container = scene.add.container(0, 0);
  container.setDepth(10);

  const startX = x - ((letters.length - 1) * spacing) / 2;

  letters.forEach((letter, i) => {
    const tileX = startX + i * spacing;
    const tileY = y;

    // Shadow
    const shadow = scene.add.graphics();
    shadow.fillStyle(COLORS.tileShadow, 0.4);
    const shadowOffset = isMobile ? 4 * s : 3;
    shadow.fillRoundedRect(
      tileX - size / 2 + shadowOffset,
      tileY - size / 2 + shadowOffset,
      size,
      size,
      radius
    );
    container.add(shadow);

    // Background
    const bg = scene.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(COLORS.tileFill).color, 1);
    bg.lineStyle(lineWidth, Phaser.Display.Color.HexStringToColor(COLORS.tileStroke).color, 1);
    bg.fillRoundedRect(tileX - size / 2, tileY - size / 2, size, size, radius);
    bg.strokeRoundedRect(tileX - size / 2, tileY - size / 2, size, size, radius);
    container.add(bg);

    // Letter text
    const fontSize = isMobile ? Math.round(70 * s * 1.6) : 60;
    const text = scene.add.text(tileX, tileY, letter, {
      font: `bold ${fontSize}px Arial`,
      color: COLORS.tileText,
    }).setOrigin(0.5);
    container.add(text);
  });

  return container;
}