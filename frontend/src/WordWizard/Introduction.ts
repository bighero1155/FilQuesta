// src/WordWizard/Introduction.ts - FIXED LEVEL & SCORE DISPLAY
import Phaser from "phaser";

const INTRO_SCENE_KEY = "WordWizardIntro";
const MAIN_SCENE_KEY = "WordWizardScene";

export default class WordWizardIntro extends Phaser.Scene {
  private currentLevel = 0;
  private currentScore = 0;
  private levelText?: Phaser.GameObjects.Text;
  private scoreText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: INTRO_SCENE_KEY });
  }

  init(data: { level?: number; score?: number }) {
    // ✅ Get level and score from localStorage first (session data)
    try {
      const storedScore = localStorage.getItem("wordwizard_session_score");
      
      this.currentScore = storedScore ? parseInt(storedScore) : 0;
      this.currentLevel = data.level ?? 0;
    } catch {
      this.currentScore = 0;
      this.currentLevel = 0;
    }

    // Override with data passed from scene (if any)
    if (data?.score !== undefined) {
      this.currentScore = data.score;
    }
    if (data?.level !== undefined) {
      this.currentLevel = data.level;
    }
    
    // ✅ Also check URL parameters for level and score
    const params = new URLSearchParams(window.location.search);
    const urlLevel = parseInt(params.get("level") || "0", 10);
    const urlScore = parseInt(params.get("score") || "0", 10);
    
    if (urlLevel > 0 && this.currentLevel === 0) {
      this.currentLevel = urlLevel;
    }
    if (urlScore > 0 && this.currentScore === 0) {
      this.currentScore = urlScore;
    }
  }

  preload() {
    // Preload the Luzon background image
    this.load.image("luzonBg", "/assets/medieval1.jpg");
  }

  create() {
    const { width, height } = this.scale;
    const isMobile = width < 768;

    // 🌄 Background image for theme
    const bg = this.add
      .image(width / 2, height / 2, "luzonBg")
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    // Overlay for contrast
    const overlay = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.25)
      .setOrigin(0.5)
      .setAlpha(0);
    this.tweens.add({
      targets: overlay,
      alpha: 0.4,
      duration: 1200,
      ease: "Sine.easeInOut",
    });

    // 🌟 Game Title - Responsive sizing
    const titleSize = isMobile ? "40px" : "64px";
    const titleStroke = isMobile ? 5 : 8;
    const titleY = isMobile ? height * 0.10 : height * 0.25;

    const title = this.add
      .text(width / 2, titleY, "🪄 Word Wizard 🪄", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: titleSize,
        color: "#ffffff",
        stroke: "#1e293b",
        strokeThickness: titleStroke,
        shadow: { offsetX: 4, offsetY: 4, color: "#000", blur: 8, fill: true },
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
      y: title.y - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // 📖 Story Text - Responsive sizing and positioning
    const storySize = isMobile ? "16px" : "22px";
    const storyStroke = isMobile ? 2 : 4;
    const storyY = isMobile ? height * 0.26 : height * 0.36;
    const storyWrap = isMobile ? width * 0.9 : width * 0.75;

    const story = this.add
      .text(
        width / 2,
        storyY,
        "You are a wizard, and you are here to help the people of the Nafia Kingdom. For unknown reasons, their belongings, animals, places, and more have stopped appearing. You discovered that they are only invisible. You have the enchantments to bring everything back to normal. You are their only hope!",
        {
          fontFamily: "Fredoka, Arial",
          fontSize: storySize,
          color: "#ffd700",
          align: "center",
          wordWrap: { width: storyWrap },
          stroke: "#000000",
          strokeThickness: storyStroke,
          shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 5, fill: true },
        }
      )
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: story,
      alpha: 1,
      duration: 1500,
      delay: 400,
      ease: "Sine.easeOut",
    });

    // 📜 Instructions - Responsive sizing and positioning
    const instructionsSize = isMobile ? "18px" : "26px";
    const instructionsStroke = isMobile ? 3 : 5;
    const instructionsY = isMobile ? height * 0.52 : height * 0.54;
    const instructionsWrap = isMobile ? width * 0.9 : width * 0.8;

    const instructions = this.add
      .text(
        width / 2,
        instructionsY,
        [
          "✨ Drag letters to the correct slots to form the word.",
          "💡 You can reshuffle by dragging letters back.",
          "🏆 Complete all words to finish the level!",
          "⚠️ If You Fail It Will Restart Your Score Streak So Be Careful!",
        ],
        {
          fontFamily: "Fredoka, Arial",
          fontSize: instructionsSize,
          color: "#ffffff",
          align: "center",
          wordWrap: { width: instructionsWrap },
          stroke: "#000000",
          strokeThickness: instructionsStroke,
          shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 6, fill: true },
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

    // 🎮 Start Button - Responsive sizing
    const btnWidth = isMobile ? 200 : 260;
    const btnHeight = isMobile ? 60 : 80;
    const btnTextSize = isMobile ? "26px" : "34px";
    const btnStroke = isMobile ? 4 : 6;
    const startY = isMobile ? height * 0.73 : height * 0.68;

    // Invisible interactive area for the button
    const startBtn = this.add
      .rectangle(width / 2, startY, btnWidth, btnHeight, 0x000000, 0)
      .setOrigin(0.5)
      .setAlpha(1)
      .setScale(0.8)
      .setInteractive({ useHandCursor: true });

    const startText = this.add
      .text(width / 2, startY, "✨ Start Level ✨", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: btnTextSize,
        color: "#ffffff",
        stroke: "#1e293b",
        strokeThickness: btnStroke,
        shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 6, fill: true },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: [startBtn, startText],
      alpha: 1,
      scale: 1,
      duration: 900,
      delay: 1000,
      ease: "Back.Out",
    });

    // Glow pulse - only on text now
    this.tweens.add({
      targets: startText,
      scale: { from: 1, to: 1.05 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Hover animations
    startBtn.on("pointerover", () => {
      this.tweens.add({ 
        targets: [startBtn, startText], 
        scale: isMobile ? 1.08 : 1.1, 
        duration: 150, 
        ease: "Sine.easeOut" 
      });
    });
    startBtn.on("pointerout", () => {
      this.tweens.add({ 
        targets: [startBtn, startText], 
        scale: 1.0, 
        duration: 150, 
        ease: "Sine.easeOut" 
      });
    });

    // 🎬 Start game → WordWizardScene
    startBtn.on("pointerdown", () => {
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.time.delayedCall(600, () => {
        this.scene.start(MAIN_SCENE_KEY, { 
          level: this.currentLevel,
          score: this.currentScore 
        });
      });
    });

    // 📊 LEVEL & SCORE DISPLAY - Below Start Button (Independent Positioning)
    const levelY = isMobile ? height * 0.82 : height * 0.77;
    const scoreY = isMobile ? height * 0.88 : height * 0.82;
    const infoTextSize = isMobile ? "22px" : "28px";
    const infoStroke = isMobile ? 4 : 5;

    // Level Display
    this.levelText = this.add
      .text(width / 2, levelY, `📘 Level: ${this.currentLevel + 1}`, {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: infoTextSize,
        color: "#ffd700",
        stroke: "#1e293b",
        strokeThickness: infoStroke,
        shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 6, fill: true },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Score Display - positioned independently with streak indicator
    const streakText = this.currentScore >= 50 ? " 🔥" : "";
    this.scoreText = this.add
      .text(width / 2, scoreY, `⭐ Score: ${this.currentScore}${streakText}`, {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: infoTextSize,
        color: "#ffffff",
        stroke: "#1e293b",
        strokeThickness: infoStroke,
        shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 6, fill: true },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Fade in animations
    this.tweens.add({
      targets: [this.levelText, this.scoreText],
      alpha: 1,
      duration: 900,
      delay: 1200,
      ease: "Sine.easeOut",
    });

    // Gentle pulse animation for score if there's a streak
    if (this.currentScore >= 50) {
      this.tweens.add({
        targets: this.scoreText,
        scale: { from: 1, to: 1.08 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    // 🚪 Quit Button - Bottom Left
    const quitSize = isMobile ? "22px" : "30px";
    const quitStroke = isMobile ? 5 : 8;
    const quitX = isMobile ? 50 : 80;
    const quitY = isMobile ? height - 40 : height - 60;

    const quitText = this.add
      .text(quitX, quitY, "Quit", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: quitSize,
        color: "#ffffff",
        stroke: "#000",
        strokeThickness: quitStroke,
        shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 4, fill: true },
      })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);

    quitText.on("pointerover", () => quitText.setTint(0xff5555));
    quitText.on("pointerout", () => quitText.clearTint());
    quitText.on("pointerdown", () => {
      if (!confirm("Are you sure you want to quit Word Wizard?")) return;
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => (window.location.href = "/wordwizardmap"));
    });

    // 🧩 Responsive layout on resize
    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      const w = gameSize.width;
      const h = gameSize.height;
      const mobile = w < 768;

      // Update background and overlay
      bg.setDisplaySize(w, h);
      overlay.setDisplaySize(w, h);
      bg.setPosition(w / 2, h / 2);
      overlay.setPosition(w / 2, h / 2);

      // Update title
      const newTitleSize = mobile ? "40px" : "64px";
      const newTitleY = mobile ? h * 0.10 : h * 0.25;
      title.setFontSize(newTitleSize);
      title.setPosition(w / 2, newTitleY);

      // Update story
      const newStorySize = mobile ? "16px" : "22px";
      const newStoryY = mobile ? h * 0.26 : h * 0.36;
      const newStoryWrap = mobile ? w * 0.9 : w * 0.75;
      story.setFontSize(newStorySize);
      story.setPosition(w / 2, newStoryY);
      story.setWordWrapWidth(newStoryWrap);

      // Update instructions
      const newInstructionsSize = mobile ? "18px" : "26px";
      const newInstructionsY = mobile ? h * 0.52 : h * 0.54;
      const newInstructionsWrap = mobile ? w * 0.9 : w * 0.8;
      instructions.setFontSize(newInstructionsSize);
      instructions.setPosition(w / 2, newInstructionsY);
      instructions.setWordWrapWidth(newInstructionsWrap);

      // Update start button
      const newBtnWidth = mobile ? 200 : 260;
      const newBtnHeight = mobile ? 60 : 80;
      const newBtnTextSize = mobile ? "26px" : "34px";
      const newStartY = mobile ? h * 0.73 : h * 0.68;
      startBtn.setSize(newBtnWidth, newBtnHeight);
      startBtn.setPosition(w / 2, newStartY);
      startText.setFontSize(newBtnTextSize);
      startText.setPosition(w / 2, newStartY);

      // Update level & score display with independent positioning
      const newLevelY = mobile ? h * 0.82 : h * 0.77;
      const newScoreY = mobile ? h * 0.88 : h * 0.82;
      const newInfoTextSize = mobile ? "22px" : "28px";
      
      if (this.levelText) {
        this.levelText.setFontSize(newInfoTextSize);
        this.levelText.setPosition(w / 2, newLevelY);
      }
      
      if (this.scoreText) {
        this.scoreText.setFontSize(newInfoTextSize);
        this.scoreText.setPosition(w / 2, newScoreY);
      }

      // Update quit button
      const newQuitSize = mobile ? "22px" : "30px";
      const newQuitX = mobile ? 50 : 80;
      const newQuitY = mobile ? h - 40 : h - 60;
      quitText.setFontSize(newQuitSize);
      quitText.setPosition(newQuitX, newQuitY);
    });
  }
}