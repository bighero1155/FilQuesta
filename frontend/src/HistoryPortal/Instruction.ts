import Phaser from "phaser";
import { HISTORY_LEVELS } from "./levels";

const INTRO_SCENE_KEY = "HistoryPortalIntro";
const MAIN_SCENE_KEY = "HistoryPortalScene";

export default class HistoryPortalIntro extends Phaser.Scene {
  private currentLevelKey: string = "precolonial-luzon-1";
  private resizeTimeout: any = null;

  constructor() {
    super({ key: INTRO_SCENE_KEY });
  }

  init(data: { levelKey?: number }) {
    if (typeof data.levelKey === "number") {
      const levelKeys = Object.keys(HISTORY_LEVELS);
      this.currentLevelKey =
        levelKeys[data.levelKey] ?? "precolonial-luzon-1";
    } else {
      this.currentLevelKey =
        localStorage.getItem("HistoryPortal_currentLevel") ||
        "precolonial-luzon-1";
    }
  }

  preload() {
    this.load.image("historyBg", "/assets/luzon1.jpg");
  }

  create() {
    const { width, height } = this.scale;
    const isMobile = width < 768;
    const isPortrait = height > width;

    // Background
    const bg = this.add
      .image(width / 2, height / 2, "historyBg")
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    // Overlay
    const overlay = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.25)
      .setOrigin(0.5)
      .setAlpha(0);
    
    this.tweens.add({
      targets: overlay,
      alpha: 0.5,
      duration: 1200,
      ease: "Sine.easeInOut",
    });

    // Title
    const titleSize = isMobile ? (isPortrait ? "36px" : "44px") : "64px";
    const titleY = isMobile ? (isPortrait ? height * 0.15 : height * 0.2) : height * 0.25;

    const title = this.add
      .text(width / 2, titleY, "Tuklas Kasaysayan", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: titleSize,
        color: "#FFD700",
        stroke: "#2D1B4E",
        strokeThickness: isMobile ? 6 : 8,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setScale(0.8);

    this.tweens.add({
      targets: title,
      alpha: 1,
      scale: 1,
      duration: 1200,
      ease: "Back.Out",
    });

    this.tweens.add({
      targets: title,
      y: titleY - (isMobile ? 5 : 10),
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Subtitle
    const subtitleSize = isMobile ? (isPortrait ? "18px" : "20px") : "28px";
    const subtitleY = titleY + (isMobile ? 45 : 60);

    const subtitle = this.add
      .text(
        width / 2,
        subtitleY,
        "Pagbabalik Tanaw sa Nakalipas",
        {
          fontFamily: "Fredoka, Arial",
          fontSize: subtitleSize,
          color: "#7FFF00",
          stroke: "#1A472A",
          strokeThickness: isMobile ? 5 : 6,
        }
      )
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 1200,
      delay: 400,
      ease: "Sine.easeOut",
    });

    // Instructions
    const instructionSize = isMobile ? (isPortrait ? "15px" : "17px") : "24px";
    const instructionY = isMobile ? (isPortrait ? height * 0.40 : height * 0.43) : height * 0.47;

    const instructionText = isMobile && isPortrait
      ? "📜 Pindutin ang tamang sagot\n⏰ Mula sa panahon ng ninuno\n❌ Iwasan ang colonial items\n✅ Kumpletuhin ang level!"
      : "📜 Pindutin ang tamang sagot na kaugnay sa kasaysayan\n✅ Kumpletuhin lahat ng antas para manalo!";

    const instructions = this.add
      .text(
        width / 2,
        instructionY,
        instructionText,
        {
          fontFamily: "Fredoka, Arial",
          fontSize: instructionSize,
          color: "#FFFACD",
          align: "center",
          wordWrap: { width: width * (isMobile ? 0.85 : 0.75) },
          lineSpacing: isMobile ? 8 : 10,
          stroke: "#2D1B4E",
          strokeThickness: isMobile ? 4 : 5,
        }
      )
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: instructions,
      alpha: 1,
      duration: 1500,
      delay: 700,
      ease: "Sine.easeOut",
    });

    // Start Button (text only, no background)
    const startY = isMobile ? (isPortrait ? height * 0.70 : height * 0.72) : height * 0.7;
    const btnWidth = isMobile ? 240 : 280;
    const btnHeight = isMobile ? 65 : 80;
    const btnFontSize = isMobile ? "28px" : "34px";

    const startText = this.add
      .text(width / 2, startY, "✨ SIMULAN ✨", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: btnFontSize,
        color: "#FFD700",
        stroke: "#2D1B4E",
        strokeThickness: isMobile ? 6 : 7,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    // Make interactive area larger
    startText.setInteractive(
      new Phaser.Geom.Rectangle(
        -btnWidth / 2,
        -btnHeight / 2,
        btnWidth,
        btnHeight
      ),
      Phaser.Geom.Rectangle.Contains
    );

    this.tweens.add({
      targets: startText,
      alpha: 1,
      scale: 1,
      duration: 900,
      delay: 1000,
      ease: "Back.Out",
    });

    if (!isMobile) {
      startText.on("pointerover", () => {
        this.tweens.add({ targets: startText, scale: 1.05, duration: 150 });
      });
      startText.on("pointerout", () => {
        this.tweens.add({ targets: startText, scale: 1.0, duration: 150 });
      });
    }

    startText.on("pointerdown", () => {
      localStorage.setItem("HistoryPortal_currentLevel", this.currentLevelKey);
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.time.delayedCall(600, () => {
        this.scene.start(MAIN_SCENE_KEY, { levelKey: this.currentLevelKey });
      });
    });

    // Quit
    const quitFontSize = isMobile ? "22px" : "30px";
    const quitX = isMobile ? 60 : 80;
    const quitY = isMobile ? height - 40 : height - 60;

    const quitText = this.add
      .text(quitX, quitY, "Quit", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: quitFontSize,
        color: "#ffffff",
        stroke: "#000",
        strokeThickness: isMobile ? 6 : 8,
        shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 4, fill: true },
      })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);

    quitText.on("pointerover", () => quitText.setTint(0xff5555));
    quitText.on("pointerout", () => quitText.clearTint());
    quitText.on("pointerdown", () => {
      if (!confirm("Are you sure you want to quit History Portal?")) return;
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => (window.location.href = "/historymap"));
    });

    // Store references
    (this as any).uiElements = {
      bg,
      overlay,
      title,
      subtitle,
      instructions,
      startText,
      quitText,
    };

    // Responsive
    this.scale.on("resize", this.handleResize, this);
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      const w = gameSize.width;
      const h = gameSize.height;
      const isMobile = w < 768;
      const isPortrait = h > w;

      const elements = (this as any).uiElements;
      if (!elements) return;

      // Background & overlay
      elements.bg.setPosition(w / 2, h / 2).setDisplaySize(w, h);
      elements.overlay.setPosition(w / 2, h / 2).setDisplaySize(w, h);

      // Title
      const titleSize = isMobile ? (isPortrait ? 36 : 44) : 64;
      const titleY = isMobile ? (isPortrait ? h * 0.15 : h * 0.2) : h * 0.25;
      elements.title.setPosition(w / 2, titleY).setFontSize(titleSize);

      // Subtitle
      const subtitleSize = isMobile ? (isPortrait ? 18 : 20) : 28;
      const subtitleY = titleY + (isMobile ? 45 : 60);
      elements.subtitle.setPosition(w / 2, subtitleY).setFontSize(subtitleSize);

      // Instructions
      const instructionSize = isMobile ? (isPortrait ? 15 : 17) : 24;
      const instructionY = isMobile ? (isPortrait ? h * 0.40 : h * 0.43) : h * 0.47;
      elements.instructions
        .setPosition(w / 2, instructionY)
        .setFontSize(instructionSize)
        .setWordWrapWidth(w * (isMobile ? 0.85 : 0.75));

      // Start button
      const startY = isMobile ? (isPortrait ? h * 0.70 : h * 0.72) : h * 0.7;
      const btnFontSize = isMobile ? 28 : 34;
      
      elements.startText.setPosition(w / 2, startY).setFontSize(btnFontSize);

      // Quit button
      const quitFontSize = isMobile ? 22 : 30;
      const quitX = isMobile ? 60 : 80;
      const quitY = isMobile ? h - 40 : h - 60;
      elements.quitText.setPosition(quitX, quitY).setFontSize(quitFontSize);
    }, 200);
  }

  shutdown() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.scale.off("resize", this.handleResize, this);
  }
}