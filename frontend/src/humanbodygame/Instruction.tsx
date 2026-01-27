// Instruction.ts
import Phaser from "phaser";

export default class Instruction {
  private scene: Phaser.Scene;
  private container?: Phaser.GameObjects.Container;
  private isMobile: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.isMobile = this.scene.scale.width < 768;
  }

  show(onClose: () => void) {
    const { width, height } = this.scene.cameras.main;
    this.isMobile = width < 768;

    if (this.container) {
      this.container.setVisible(true);
      return;
    }

    const baseTextStyle = {
      fontFamily: "Fredoka, Arial, sans-serif",
      color: "#ffffff",
    };

    // Create simple particle texture if not exists
    if (!this.scene.textures.exists('particle')) {
      const graphics = this.scene.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0xffffff);
      graphics.fillCircle(4, 4, 4);
      graphics.generateTexture('particle', 8, 8);
      graphics.destroy();
    }

    // Animated particles background
    const particlesBg = this.scene.add.particles(0, 0, 'particle', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      lifespan: 4000,
      speed: { min: 10, max: 30 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.6, end: 0 },
      blendMode: 'ADD',
      frequency: 200,
      tint: [0x4CAF50, 0x81C784, 0x66BB6A]
    });

    // Glassmorphic background overlay
    const bg = this.scene.add
      .rectangle(0, 0, width, height, 0x000000, 0.85)
      .setOrigin(0)
      .setInteractive();

    bg.setAlpha(0);
    this.scene.tweens.add({
      targets: bg,
      alpha: 0.85,
      duration: 400,
      ease: "Power2",
    });

    // Panel dimensions
    const panelWidth = this.isMobile ? width * 0.92 : Math.min(width * 0.65, 750);
    const panelHeight = this.isMobile ? height * 0.85 : Math.min(height * 0.8, 650);

    // Glowing shadow layers
    const shadowLayers: Phaser.GameObjects.Rectangle[] = [];
    for (let i = 3; i >= 1; i--) {
      const shadow = this.scene.add
        .rectangle(
          width / 2 + i * 3,
          height / 2 + i * 3,
          panelWidth,
          panelHeight,
          0x4CAF50,
          0.08 * i
        )
        .setOrigin(0.5);
      shadowLayers.push(shadow);
    }

    // Main panel with gradient effect (simulate with shapes)
    const panelBg = this.scene.add
      .rectangle(width / 2, height / 2, panelWidth, panelHeight, 0x0f1419)
      .setOrigin(0.5);

    // Gradient overlay
    const gradientOverlay = this.scene.add
      .rectangle(width / 2, height / 2, panelWidth, panelHeight, 0x1a2332, 0.7)
      .setOrigin(0.5);

    // Neon border with glow
    const borderGlow = this.scene.add
      .rectangle(width / 2, height / 2, panelWidth + 4, panelHeight + 4, 0x4CAF50, 0)
      .setStrokeStyle(6, 0x4CAF50, 0.4)
      .setOrigin(0.5);

    const border = this.scene.add
      .rectangle(width / 2, height / 2, panelWidth, panelHeight, 0x000000, 0)
      .setStrokeStyle(2, 0x66BB6A, 1)
      .setOrigin(0.5);

    // Animated pulse effect on border
    this.scene.tweens.add({
      targets: borderGlow,
      alpha: 0.6,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Animated corner decorations
    const cornerSize = this.isMobile ? 20 : 25;
    const cornerOffset = 15;
    const corners = [
      { x: width / 2 - panelWidth / 2 + cornerOffset, y: height / 2 - panelHeight / 2 + cornerOffset, angle: 0 },
      { x: width / 2 + panelWidth / 2 - cornerOffset, y: height / 2 - panelHeight / 2 + cornerOffset, angle: 90 },
      { x: width / 2 - panelWidth / 2 + cornerOffset, y: height / 2 + panelHeight / 2 - cornerOffset, angle: 270 },
      { x: width / 2 + panelWidth / 2 - cornerOffset, y: height / 2 + panelHeight / 2 - cornerOffset, angle: 180 },
    ];

    const cornerGraphics: Phaser.GameObjects.Graphics[] = [];
    corners.forEach((corner, index) => {
      const graphics = this.scene.add.graphics();
      graphics.lineStyle(3, 0x4CAF50, 1);
      
      // L-shaped corner
      graphics.beginPath();
      graphics.moveTo(corner.x - cornerSize / 2, corner.y);
      graphics.lineTo(corner.x, corner.y);
      graphics.lineTo(corner.x, corner.y - cornerSize / 2);
      graphics.strokePath();
      
      graphics.setRotation((corner.angle * Math.PI) / 180);
      cornerGraphics.push(graphics);

      // Pulse animation with delay
      this.scene.tweens.add({
        targets: graphics,
        alpha: 0.4,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        delay: index * 200,
        ease: "Sine.easeInOut",
      });
    });

    // Header section with icon
    const headerY = height / 2 - panelHeight / 2 + (this.isMobile ? 60 : 70);
    
    // Icon background glow
    const iconGlow = this.scene.add
      .circle(width / 2, headerY - (this.isMobile ? 30 : 35), this.isMobile ? 35 : 42, 0x4CAF50, 0.3)
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: iconGlow,
      scale: 1.2,
      alpha: 0.5,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Icon
    const icon = this.scene.add
      .text(width / 2, headerY - (this.isMobile ? 30 : 35), "🎮", {
        fontSize: this.isMobile ? "50px" : "64px",
      })
      .setOrigin(0.5);

    // Title with neon glow effect
    const titleText = "HOW TO PLAY";
    const titleGlow = this.scene.add
      .text(width / 2, headerY + (this.isMobile ? 15 : 20), titleText, {
        ...baseTextStyle,
        fontSize: this.isMobile ? "36px" : "48px",
        fontStyle: "bold",
        color: "#4CAF50",
      })
      .setOrigin(0.5)
      .setAlpha(0.4);

    const title = this.scene.add
      .text(width / 2, headerY + (this.isMobile ? 15 : 20), titleText, {
        ...baseTextStyle,
        fontSize: this.isMobile ? "36px" : "48px",
        fontStyle: "bold",
        stroke: "#2d5016",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: titleGlow,
      scale: 1.05,
      alpha: 0.6,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Instructions with modern card design
    const instructionsY = headerY + (this.isMobile ? 80 : 100);
    const lines = [
      { icon: "🧩", text: "Drag each organ to its correct position", color: 0x4CAF50 },
      { icon: "⭐", text: "Earn points for accurate placements", color: 0xFFD700 },
      { icon: "⏱️", text: "Complete before the timer runs out", color: 0xFF6B6B },
      { icon: "⛔", text: "Avoid incorrect placements", color: 0xFF5252 },
      { icon: "🏆", text: "Master all organs to achieve victory!", color: 0xFFC107 },
    ];

    const instructionElements: Phaser.GameObjects.GameObject[] = [];
    const lineHeight = this.isMobile ? 60 : 68;
    const startY = instructionsY;

    lines.forEach((line, index) => {
      const yPos = startY + index * lineHeight;
      
      // Card background with accent color
      const cardBg = this.scene.add
        .rectangle(
          width / 2,
          yPos,
          panelWidth * 0.85,
          this.isMobile ? 50 : 56,
          0x131920,
          0.8
        )
        .setOrigin(0.5)
        .setStrokeStyle(2, line.color, 0.6);

      // Left accent bar
      const accentBar = this.scene.add
        .rectangle(
          width / 2 - panelWidth * 0.425 + 3,
          yPos,
          6,
          this.isMobile ? 50 : 56,
          line.color,
          1
        )
        .setOrigin(0.5);

      // Icon with background
      const iconBg = this.scene.add
        .circle(
          width / 2 - panelWidth * 0.37,
          yPos,
          this.isMobile ? 18 : 20,
          line.color,
          0.2
        )
        .setOrigin(0.5);

      const iconText = this.scene.add
        .text(width / 2 - panelWidth * 0.37, yPos, line.icon, {
          fontSize: this.isMobile ? "26px" : "30px",
        })
        .setOrigin(0.5);

      // Instruction text
      const text = this.scene.add
        .text(width / 2 - panelWidth * 0.28, yPos, line.text, {
          ...baseTextStyle,
          fontSize: this.isMobile ? "17px" : "21px",
          color: "#e8f5e9",
        })
        .setOrigin(0, 0.5);

      instructionElements.push(cardBg, accentBar, iconBg, iconText, text);

      // Stagger animation
      [cardBg, accentBar, iconBg, iconText, text].forEach(el => {
        el.setAlpha(0);
        el.setPosition(el.x - 30, el.y);
      });

      this.scene.tweens.add({
        targets: [cardBg, accentBar, iconBg, iconText, text],
        alpha: 1,
        x: `+=${30}`,
        duration: 500,
        delay: 400 + index * 120,
        ease: "Back.easeOut",
      });

      // Hover effect for cards
      cardBg.setInteractive();
      cardBg.on("pointerover", () => {
        this.scene.tweens.add({
          targets: [cardBg, accentBar],
          scaleX: 1.02,
          scaleY: 1.05,
          duration: 200,
          ease: "Power2",
        });
        cardBg.setFillStyle(0x1a2332, 1);
      });

      cardBg.on("pointerout", () => {
        this.scene.tweens.add({
          targets: [cardBg, accentBar],
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: "Power2",
        });
        cardBg.setFillStyle(0x131920, 0.8);
      });
    });

    // Start button with premium design
    const buttonY = height / 2 + panelHeight / 2 - (this.isMobile ? 60 : 70);
    const buttonWidth = this.isMobile ? 200 : 240;
    const buttonHeight = this.isMobile ? 56 : 64;

    // Button outer glow
    const btnOuterGlow = this.scene.add
      .rectangle(width / 2, buttonY, buttonWidth + 20, buttonHeight + 20, 0x4CAF50, 0.2)
      .setOrigin(0.5);

    // Button glow
    const btnGlow = this.scene.add
      .rectangle(width / 2, buttonY, buttonWidth + 8, buttonHeight + 8, 0x4CAF50, 0.4)
      .setOrigin(0.5);

    // Invisible interactive area for button
    const startBtnBg = this.scene.add
      .rectangle(width / 2, buttonY, buttonWidth, buttonHeight, 0x000000, 0)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Button text
    const startBtnText = this.scene.add
      .text(width / 2, buttonY, "🚀 START PLAYING", {
        fontSize: this.isMobile ? "22px" : "28px",
        fontStyle: "bold",
        fontFamily: "Fredoka, Arial Black, sans-serif",
        color: "#4CAF50",
        stroke: "#1b5e20",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Button interactions
    startBtnBg.on("pointerup", () => {
      this.scene.tweens.add({
        targets: [startBtnText],
        scaleX: 0.92,
        scaleY: 0.92,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.hide();
          onClose();
        },
      });
    });

    startBtnBg.on("pointerover", () => {
      this.scene.tweens.add({
        targets: [startBtnText],
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 250,
        ease: "Back.easeOut",
      });
      startBtnText.setColor("#66BB6A");
    });

    startBtnBg.on("pointerout", () => {
      this.scene.tweens.add({
        targets: [startBtnText],
        scaleX: 1,
        scaleY: 1,
        duration: 250,
        ease: "Back.easeOut",
      });
      startBtnText.setColor("#4CAF50");
    });

    // Pulsing button glow
    this.scene.tweens.add({
      targets: [btnOuterGlow, btnGlow],
      scale: 1.15,
      alpha: 0.6,
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Collect all elements
    const panelElements = [
      bg,
      particlesBg,
      ...shadowLayers,
      panelBg,
      gradientOverlay,
      borderGlow,
      border,
      ...cornerGraphics,
      iconGlow,
      icon,
      titleGlow,
      title,
      ...instructionElements,
      btnOuterGlow,
      btnGlow,
      startBtnBg,
      startBtnText,
    ];

    // Initial animation
    panelElements.forEach((el) => {
      if (el !== bg && 'setScale' in el && typeof el.setScale === 'function') {
        el.setScale(0.85);
      }
      if (el !== bg && 'setAlpha' in el && typeof el.setAlpha === 'function') {
        el.setAlpha(0);
      }
    });

    this.scene.tweens.add({
      targets: panelElements.filter(el => el !== bg),
      scale: 1,
      alpha: 1,
      duration: 500,
      ease: "Back.easeOut",
      delay: 150,
    });

    this.container = this.scene.add.container(0, 0, panelElements);
    this.container.setDepth(9999);
  }

  hide() {
    if (this.container) {
      this.scene.tweens.add({
        targets: this.container.list,
        alpha: 0,
        scale: 0.9,
        duration: 350,
        ease: "Back.easeIn",
        onComplete: () => {
          this.container?.setVisible(false);
        },
      });
    }
  }

  destroy() {
    this.container?.destroy(true);
    this.container = undefined;
  }
}