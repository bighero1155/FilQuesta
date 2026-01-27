import Phaser from "phaser";
import { getLevelConfig } from "../MagicTree/levels";

const SCENE_KEY = "IntroductionScene";

export default class IntroductionScene extends Phaser.Scene {
  private isMobile: boolean = false;

  private title!: Phaser.GameObjects.Text;
  private instructions!: Phaser.GameObjects.Text;
  private instructionsBg!: Phaser.GameObjects.Rectangle;

  private startText!: Phaser.GameObjects.Text;
  private backText!: Phaser.GameObjects.Text;
  private bg!: Phaser.GameObjects.Image;

  constructor() {
    super(SCENE_KEY);
  }

  init(data: any) {
    // Check multiple sources for the level
    let startLevel = data?.startLevel || data?.level || 1;
    
    // Also check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const levelParam = urlParams.get("level");
    if (levelParam !== null) {
      const parsed = Number(levelParam);
      if (!Number.isNaN(parsed)) {
        startLevel = parsed + 1; // URL levels are 0-indexed
      }
    }
    
    console.log("IntroductionScene - Starting Level:", startLevel); // Debug log
    this.data.set("startLevel", startLevel);
    this.isMobile = this.scale.width < 768;
  }

  preload() {
    this.load.image("introBg", "assets/tree4.jpg");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.isMobile = width < 768;

    /* ================= BACKGROUND ================= */
    this.bg = this.add
      .image(width / 2, height / 2, "introBg")
      .setOrigin(0.5)
      .setDisplaySize(width, height)
      .setDepth(0);

    this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.4)
      .setDepth(1);

    this.createParticles();

    /* ================= TITLE ================= */
    this.title = this.add
      .text(width / 2, height * 0.2, "🍎 Math Fruit Challenge 🍌", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: this.isMobile ? "28px" : "70px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: this.isMobile ? 6 : 12,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#2ecc71",
          blur: 6,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setScale(0)
      .setDepth(20);

    this.tweens.add({
      targets: this.title,
      scale: 1,
      duration: 800,
      ease: "Back.easeOut",
    });

    /* ================= DYNAMIC INSTRUCTIONS ================= */
    const instructionsY = height * 0.45;
    const startLevel = this.data.get("startLevel") || 1;
    const levelConfig = getLevelConfig(startLevel);
    
    // Debug logs
    console.log("Level:", startLevel);
    console.log("Operation:", levelConfig.operation);
    console.log("Multiplier:", levelConfig.fruitMultiplier);
    
    // Get operation-specific instruction text
    const instructionText = this.getInstructionsByOperation(
      levelConfig.operation,
      levelConfig.fruitMultiplier
    );

    this.instructions = this.add
      .text(
        width / 2,
        instructionsY,
        instructionText,
        {
          fontFamily: "Fredoka, Arial",
          fontSize: this.isMobile ? "16px" : "24px",
          color: "#ffffff",
          align: "center",
          wordWrap: {
            width: this.isMobile ? width * 0.8 : width * 0.6,
          },
          stroke: "#000000",
          strokeThickness: this.isMobile ? 5 : 6,
          lineSpacing: this.isMobile ? 8 : 10,
        }
      )
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(31);

    const padding = this.isMobile ? 30 : 40;

    this.instructionsBg = this.add
      .rectangle(
        width / 2,
        instructionsY,
        this.instructions.width + padding,
        this.instructions.height + padding,
        0x000000,
        0.6
      )
      .setOrigin(0.5)
      .setStrokeStyle(3, 0x2ecc71)
      .setAlpha(0)
      .setDepth(30);

    this.tweens.add({
      targets: [this.instructionsBg, this.instructions],
      alpha: 1,
      duration: 600,
      delay: 400,
    });

    /* ================= BACK BUTTON (BOTTOM LEFT ON MOBILE, TOP LEFT ON DESKTOP) ================= */
    const backPadding = this.isMobile ? 20 : 30;
    const backY = this.isMobile ? height - backPadding : backPadding;
    const backOriginY = this.isMobile ? 1 : 0;
    
    this.backText = this.add
      .text(backPadding, backY, "← Back", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: this.isMobile ? "22px" : "28px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: this.isMobile ? 5 : 6,
      })
      .setOrigin(0, backOriginY)
      .setAlpha(0)
      .setDepth(40)
      .setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: this.backText,
      alpha: 1,
      duration: 600,
      delay: 600,
    });

    /* ===== Back Button Hover / Click Animations ===== */
    this.backText.on("pointerover", () => {
      this.tweens.add({
        targets: this.backText,
        scale: 1.1,
        duration: 150,
        ease: "Power2",
      });
    });

    this.backText.on("pointerout", () => {
      this.tweens.add({
        targets: this.backText,
        scale: 1,
        duration: 150,
        ease: "Power2",
      });
    });

    this.backText.on("pointerdown", () => {
      this.tweens.add({
        targets: this.backText,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          window.location.href = "/MagicTree";
        },
      });
    });

    /* ================= START GAME (TEXT ONLY) ================= */
    const buttonY = this.isMobile ? height * 0.82 : height * 0.75;

    this.startText = this.add
      .text(width / 2, buttonY, "🚀 Start Game", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: this.isMobile ? "26px" : "36px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: this.isMobile ? 6 : 8,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(40)
      .setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: this.startText,
      alpha: 1,
      duration: 600,
      delay: 800,
    });

    /* ===== Hover / Click Animations ===== */
    this.startText.on("pointerover", () => {
      this.tweens.add({
        targets: this.startText,
        scale: 1.1,
        duration: 150,
        ease: "Power2",
      });
    });

    this.startText.on("pointerout", () => {
      this.tweens.add({
        targets: this.startText,
        scale: 1,
        duration: 150,
        ease: "Power2",
      });
    });

    this.startText.on("pointerdown", () => {
      this.tweens.add({
        targets: this.startText,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.scene.start("MagicTree", {
            score: 0,
            level: this.data.get("startLevel") || 1,
          });
        },
      });
    });

    this.scale.on("resize", this.handleResize, this);
  }

  /* ================= DYNAMIC INSTRUCTION GENERATOR ================= */
  private getInstructionsByOperation(
    operation: 'addition' | 'subtraction' | 'multiplication' | 'division',
    fruitMultiplier: number
  ): string[] {
    const banana = 2 * fruitMultiplier;
    const orange = 3 * fruitMultiplier;
    const rotten = -fruitMultiplier;

    // Operation-specific goal text
    const goalText = {
      addition: "Add fruits to reach the sum!",
      subtraction: "Subtract to reach the answer!",
      multiplication: "Multiply and collect fruits!",
      division: "Divide and catch the result!",
    };

    if (this.isMobile) {
      return [
        `🎯 ${goalText[operation]}`,
        "",
        "🍏 Apple = 1",
        `🍌 Banana = ${banana}`,
        `🍊 Orange = ${orange}`,
        `🍎 Rotten = ${rotten}`,
        "",
        "➡️ Move with Arrow Keys",
        "💡 Collect wisely!",
        "💡 Every win you get 10 Points!",
      ];
    } else {
      return [
        `🎯 ${goalText[operation]}`,
        "",
        `🍏 Apple = 1, 🍌 Banana = ${banana}, 🍊 Orange = ${orange}, 🍎 Rotten = ${rotten}`,
        "",
        "➡️ Move with Arrow Keys or Touch",
        "💡 Collect wisely, avoid overshooting the fruits value!",
        "💡 Every win you get 10 Points!",
      ];
    }
  }

  /* ================= PARTICLES ================= */
  private createParticles() {
    const fruits = ["🍎", "🍌", "🍊", "🍏"];

    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);

      this.add
        .text(x, y, Phaser.Utils.Array.GetRandom(fruits), {
          fontSize: this.isMobile ? "24px" : "32px",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setAlpha(0.3)
        .setDepth(5);
    }
  }

  /* ================= RESIZE ================= */
  private handleResize(gameSize: Phaser.Structs.Size) {
    const w = gameSize.width;
    const h = gameSize.height;
    this.isMobile = w < 768;

    this.bg.setDisplaySize(w, h).setPosition(w / 2, h / 2);

    this.title
      .setPosition(w / 2, h * 0.1)
      .setFontSize(this.isMobile ? 25 : 60);

    const instructionsY = h * 0.45;

    this.instructions
      .setPosition(w / 2, instructionsY)
      .setFontSize(this.isMobile ? 16 : 24)
      .setWordWrapWidth(this.isMobile ? w * 0.8 : w * 0.6);

    const padding = this.isMobile ? 30 : 40;

    this.instructionsBg
      .setPosition(w / 2, instructionsY)
      .setSize(
        this.instructions.width + padding,
        this.instructions.height + padding
      );

    const backPadding = this.isMobile ? 20 : 30;
    const backY = this.isMobile ? h - backPadding : backPadding;
    const backOriginY = this.isMobile ? 1 : 0;
    
    this.backText
      .setPosition(backPadding, backY)
      .setOrigin(0, backOriginY)
      .setFontSize(this.isMobile ? 22 : 28);

    const buttonY = this.isMobile ? h * 0.82 : h * 0.75;

    this.startText
      .setPosition(w / 2, buttonY)
      .setFontSize(this.isMobile ? 26 : 36);
  }

  destroy() {
    this.scale.off("resize", this.handleResize, this);
  }
}