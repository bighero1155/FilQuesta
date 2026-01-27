import Phaser from "phaser";
import { updateUserProgress } from "../services/userService";
import { saveCategoryLevel, getAllCategoryProgress, hasCompletedAnyLevelOne } from "../services/levelService";
import { logPageVisit, logGameOver } from "../services/pageVisitService";
import { LevelConfig, getLevelConfig } from "./levels";
import { createStyledButtons, createQuitButton } from "./buttons";
import {
  createBackground,
  createSlot,
  createTile,
  createInfoText,
  showSlotFeedback,
  createInputField,        
  createSubmitButton,      
  createStaticLetterDisplay 
} from "./design";
import { showCongratulationsConfetti } from "./congratulations";
import { PowerUpLogic } from "../components/Powerups/powerUpLogic";
import { getUserPowerUps, UserPowerUp } from "../services/powerUpService";

const SCENE_KEY = "WordWizardScene";
const WORDWIZARD_CATEGORIES = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"];

export default class WordWizardScene extends Phaser.Scene {
  private userId: number | null = null;
  private score = 0;
  private consecutiveLevelsCompleted = 0;
  private slots: Phaser.GameObjects.Zone[] = [];
  private tiles: Phaser.GameObjects.Container[] = [];
  private infoText?: Phaser.GameObjects.Text;
  private _levelInfoText?: Phaser.GameObjects.Text;
  private activeButtons: Phaser.GameObjects.Container[] = [];

  private level!: LevelConfig;
  private currentLevel = 1;
  private currentCategoryId = "BASIC";
  private currentLevelInCategory = 1;
  private categoryProgress: Record<string, number> = {
    BASIC: 0,
    NORMAL: 0,
    HARD: 0,
    ADVANCED: 0,
    EXPERT: 0,
  };

  private startTime = 0;
  private timeRemaining = 90;
  private timerEvent: Phaser.Time.TimerEvent | null = null;
  private timerText?: Phaser.GameObjects.Text;
  private inventory: Record<string, number> = {
    time_freeze: 0,
    second_chance: 0,
    score_booster: 0,
  };
  private nextScoreMultiplier = 1;

  // ⌨️ NEW: Typing mode properties
  private isTypingMode = false;
  private typingInputField?: HTMLInputElement;
  private typingSubmitButton?: Phaser.GameObjects.Container;
  private staticLettersText?: Phaser.GameObjects.Text;

  private isSecondChanceActive = false;

  constructor() {
    super({ key: SCENE_KEY });
  }

  init(data: { levelId?: number }) {
    this.userId = this.getUserId();
    if (!this.userId) {
      alert("❌ User not found! Please log in again.");
      window.location.href = "/landing";
      return;
    }

    try {
      const storedScore = localStorage.getItem("wordwizard_session_score");
      const storedStreak = localStorage.getItem("wordwizard_streak");
      
      this.score = storedScore ? parseInt(storedScore) : 0;
      this.consecutiveLevelsCompleted = storedStreak ? parseInt(storedStreak) : 0;
    } catch {
      this.score = 0;
      this.consecutiveLevelsCompleted = 0;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const levelParam = urlParams.get("level");
    const categoryParam = urlParams.get("category");

    let startLevel = data?.levelId ?? null;

    if (levelParam !== null) {
      const parsed = Number(levelParam);
      if (!Number.isNaN(parsed)) startLevel = parsed + 1;
    }

    this.currentLevel = startLevel ?? 1;

    if (categoryParam) {
      this.currentCategoryId = categoryParam;
      const categoryIndex = WORDWIZARD_CATEGORIES.indexOf(categoryParam);
      this.currentLevelInCategory = this.currentLevel - categoryIndex * 15;
    } else {
      this.calculateCategoryFromGlobalLevel(this.currentLevel);
    }

    this.level = getLevelConfig(this.currentLevel);
    this.startTime = Date.now();
  }

  private calculateCategoryFromGlobalLevel(globalLevel: number) {
    const categoryIndex = Math.floor((globalLevel - 1) / 15);
    const levelInCategory = ((globalLevel - 1) % 15) + 1;

    this.currentCategoryId = WORDWIZARD_CATEGORIES[categoryIndex] || "BASIC";
    this.currentLevelInCategory = levelInCategory;
  }

  private getUserId(): number | null {
    try {
      const userIdStr = localStorage.getItem("user_id");
      if (userIdStr) return Number(userIdStr);
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return Number(user.user_id || user.id);
      }
      return null;
    } catch {
      return null;
    }
  }

  private getCategoryDisplayName(): string {
    const categoryEmojis: Record<string, string> = {
      BASIC: "🟢 BASIC",
      NORMAL: "🔵 NORMAL",
      HARD: "🔴 HARD",
      ADVANCED: "🟠 ADVANCED",
      EXPERT: "💀 EXPERT",
    };
    return categoryEmojis[this.currentCategoryId] || this.currentCategoryId;
  }

  async create() {
    createBackground(this);

    if (!this.userId) return;

    try {
      this.categoryProgress = await getAllCategoryProgress(
        this.userId,
        "WordWizard",
        WORDWIZARD_CATEGORIES
      );
    } catch {
      this.categoryProgress = { BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0 };
    }

    const unlockedInCategory = this.categoryProgress[this.currentCategoryId] || 0;
    const hasCompletedAnyLevel1 = await hasCompletedAnyLevelOne(
      this.userId,
      "WordWizard",
      WORDWIZARD_CATEGORIES
    );

    if (this.currentLevelInCategory === 1) {
      const totalProgress = Object.values(this.categoryProgress).reduce((sum, val) => sum + val, 0);
      if (!hasCompletedAnyLevel1 && totalProgress > 0) {
        alert("🚫 Complete any Level 1 first to unlock all Level 1s!");
        window.location.href = "/wordwizardmap";
        return;
      }
    } else {
      if (this.currentLevelInCategory > unlockedInCategory) {
        alert(`🚫 Complete ${this.currentCategoryId} Level ${this.currentLevelInCategory - 1} first!`);
        window.location.href = "/wordwizardmap";
        return;
      }
    }

    this.timeRemaining = this.level.time;

    this.infoText = createInfoText(this, "");
    this.createLevelInfoText();
    this.createLevel();
    createQuitButton(this);
    await logPageVisit(this.userId, SCENE_KEY, 0);
    this.createTimerAndHUD();

    // ⌨️ Only set up drag events if NOT in typing mode
    if (!this.isTypingMode) {
      this.input.on("dragstart", (_: any, go: any) => {
        go.setAlpha(0.6);
        for (const slot of this.slots) {
          if ((slot as any).filled === go) {
            (slot as any).filled = null;
            break;
          }
        }
      });

      this.input.on("drag", (_: any, go: any, dragX: number, dragY: number) => {
        go.x = dragX;
        go.y = dragY;
      });

      this.input.on("dragend", (_: any, go: any) => {
        go.setAlpha(1);
        this.trySnap(go);
      });
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleSceneEnd, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.handleSceneEnd, this);
  }

  private createLevelInfoText() {
    const isMobile = this.scale.width < 768;
    const levelInfoFontSize = isMobile ? "16px" : "22px";
    const levelInfoY = isMobile ? 55 : 60;
    const levelInfoX = isMobile ? this.scale.width - 380 : this.scale.width - 1400;

    this._levelInfoText = this.add.text(
      levelInfoX,
      levelInfoY,
      `${this.getCategoryDisplayName()}\nLevel ${this.currentLevelInCategory}`,
      {
        fontSize: levelInfoFontSize,
        fontStyle: "bold",
        color: "#ffffff",
        backgroundColor: "#4a5568dd",
        padding: isMobile ? { x: 8, y: 4 } : { x: 12, y: 6 },
        align: "center",
      }
    );
  }

  private async handleSceneEnd() {
    if (!this.userId) return;
    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    await logPageVisit(this.userId, SCENE_KEY, timeSpent);
    
    // ⌨️ Clean up HTML input if exists
    if (this.typingInputField) {
      this.typingInputField.remove();
      this.typingInputField = undefined;
    }
  }

  private clearButtons() {
    this.activeButtons.forEach((btn) => btn.destroy());
    this.activeButtons = [];
  }

  private clearLevelElements() {
  this.slots.forEach((s) => s.destroy());
  this.tiles.forEach((t) => t.destroy());
  this.slots = [];
  this.tiles = [];
  
  // ⌨️ Clean up typing mode elements
  if (this.typingInputField) {
    this.typingInputField.remove();
    this.typingInputField = undefined;
  }
  if (this.typingSubmitButton) {
    this.typingSubmitButton.destroy();
    this.typingSubmitButton = undefined;
  }
  if (this.staticLettersText) {
    this.staticLettersText.destroy(); // Now it's a container
    this.staticLettersText = undefined;
  }
}

  private createLevel() {
    this.clearButtons();
    this.clearLevelElements();

    const currentWord = this.level.words[0];

    // ⌨️ Determine if this level should use typing mode (levels 11-15)
    this.isTypingMode = this.currentLevelInCategory >= 11;

    if (this.isTypingMode) {
      this.createTypingMode(currentWord);
    } else {
      this.createDragAndDropMode(currentWord);
    }

    this.resetTimer();
    this.updateInfoText();
  }

  // ⌨️ Create drag-and-drop mode (original behavior for levels 1-10)
  private createDragAndDropMode(currentWord: { word: string; description: string }) {
    const letters = Phaser.Utils.Array.Shuffle(currentWord.word.split(""));

    const isMobile = this.scale.width < 768;
    const centerX = this.scale.width / 2;

    const slotY = isMobile ? this.scale.height * 0.6 : this.scale.height * 0.28;
    const spacing = isMobile ? 70 : 130;

    const startX = centerX - ((currentWord.word.length - 1) * spacing) / 2;

    for (let i = 0; i < currentWord.word.length; i++) {
      const slot = createSlot(this, startX + i * spacing, slotY);
      (slot as any).expected = currentWord.word[i];
      (slot as any).filled = null;
      this.slots.push(slot);
    }

    const tileY = isMobile ? this.scale.height * 0.8 : this.scale.height * 0.51;
    const tileStartX = centerX - ((letters.length - 1) * spacing) / 2;

    letters.forEach((letter, i) => {
      const tile = createTile(this, letter, tileStartX + i * spacing, tileY);
      (tile as any).home = { x: tile.x, y: tile.y };
      (tile as any).letter = letter;
      this.tiles.push(tile);
    });
  }

  // ⌨️ NEW: Create typing mode (levels 11-15)
private createTypingMode(currentWord: { word: string; description: string }) {
  const isMobile = this.scale.width < 768;
  const centerX = this.scale.width / 2;
  const centerY = this.scale.height / 2;

  const letters = Phaser.Utils.Array.Shuffle(currentWord.word.split(""));

  // Display scrambled letters using the new design function
  const lettersY = isMobile ? centerY - 40 : centerY - 100;
  const letterDisplay = createStaticLetterDisplay(this, letters, centerX, lettersY);
  this.staticLettersText = letterDisplay as any; // Store for cleanup

  // Create HTML input field using the new design function
  const inputY = isMobile ? centerY + 28 : centerY + 40;
  this.typingInputField = createInputField(
    centerX,
    inputY,
    currentWord.word.length,
    () => this.handleTypingSubmit()
  );

  // Create submit button using the new design function
  const buttonY = isMobile ? centerY + 100 : centerY + 130;
  this.typingSubmitButton = createSubmitButton(
    this,
    centerX,
    buttonY,
    () => this.handleTypingSubmit()
  );
}

  // ⌨️ NEW: Handle typing mode submission
  private async handleTypingSubmit() {
    if (!this.typingInputField) return;

    const answer = this.typingInputField.value.trim().toUpperCase();
    const target = this.level.words[0].word;

    if (answer === target) {
      // Correct answer
      if (this.timerEvent) {
        this.timerEvent.remove(false);
        this.timerEvent = null;
      }

      this.consecutiveLevelsCompleted += 1;

      const pointsToAdd = Math.round(this.level.scorePerWord * this.nextScoreMultiplier);
      this.score += pointsToAdd;
      
      try {
        localStorage.setItem("wordwizard_session_score", this.score.toString());
        localStorage.setItem("wordwizard_streak", this.consecutiveLevelsCompleted.toString());
      } catch (e) {
        console.error("Failed to save score/streak:", e);
      }
      
      try {
        if (this.userId) {
          await updateUserProgress(this.userId, pointsToAdd);
        }
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
      
      this.nextScoreMultiplier = 1;
      
      // Show success feedback
      this.showTypingFeedback(true);
      this.time.delayedCall(600, () => this.showWinScreen());
    } else {
      // Wrong answer
      this.showTypingFeedback(false);
      this.time.delayedCall(800, async () => {
        await this.handleFail();
      });
    }
  }

  // ⌨️ NEW: Show visual feedback for typing mode
  private showTypingFeedback(correct: boolean) {
    if (this.staticLettersText) {
      // Pulse animation on the entire container
      this.tweens.add({
        targets: this.staticLettersText,
        scale: { from: 1, to: 1.1 },
        duration: 300,
        yoyo: true,
        repeat: 1,
      });
    }

    const feedbackText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 150,
      correct ? "✓ CORRECT!" : "✗ WRONG!",
      {
        fontSize: "48px",
        fontStyle: "bold",
        color: correct ? "#10b981" : "#ef4444",
        stroke: "#000000",
        strokeThickness: 6,
      }
    )
      .setOrigin(0.5)
      .setDepth(100)
      .setAlpha(0);

    this.tweens.add({
      targets: feedbackText,
      alpha: 1,
      scale: { from: 0.5, to: 1.2 },
      duration: 300,
      onComplete: () => {
        this.tweens.add({
          targets: feedbackText,
          alpha: 0,
          duration: 500,
          delay: 200,
          onComplete: () => feedbackText.destroy(),
        });
      },
    });
  }

  private updateInfoText() {
    if (!this.infoText) return;
    const currentWord = this.level.words[0];

    const streakText = this.consecutiveLevelsCompleted >= 3 
      ? ` 🔥 ${this.consecutiveLevelsCompleted}x STREAK!` 
      : "";

    // ⌨️ Add mode indicator for typing levels
    const modeText = this.isTypingMode ? "" : "";

    this.infoText.setFontSize(29);
    this.infoText.setText(
      `⭐ Score: ${this.score}${streakText}${modeText}\n` +
        `💡 ${currentWord.description}`
    );
  }

  private trySnap(tileContainer: Phaser.GameObjects.Container) {
    const threshold = 60;
    let snapped = false;

    for (const slot of this.slots) {
      if (!(slot as any).filled) {
        const dist = Phaser.Math.Distance.Between(
          tileContainer.x,
          tileContainer.y,
          slot.x,
          slot.y
        );
        if (dist < threshold) {
          tileContainer.setPosition(slot.x, slot.y);
          (slot as any).filled = tileContainer;
          snapped = true;
          break;
        }
      }
    }

    if (!snapped) {
      const home = (tileContainer as any).home;
      tileContainer.setPosition(home.x, home.y);
    }

    this.checkComplete();
  }

  private async checkComplete() {
    const filled = this.slots.every((s) => (s as any).filled);
    if (!filled) return;

    const answer = this.slots
      .map((s) => ((s as any).filled as any)?.letter || "")
      .join("");
    const target = this.level.words[0].word;

    if (answer === target) {
      if (this.timerEvent) {
        this.timerEvent.remove(false);
        this.timerEvent = null;
      }

      this.consecutiveLevelsCompleted += 1;

      const pointsToAdd = Math.round(this.level.scorePerWord * this.nextScoreMultiplier);
      this.score += pointsToAdd;
      
      try {
        localStorage.setItem("wordwizard_session_score", this.score.toString());
        localStorage.setItem("wordwizard_streak", this.consecutiveLevelsCompleted.toString());
      } catch (e) {
        console.error("Failed to save score/streak:", e);
      }
      
      try {
        if (this.userId) {
          await updateUserProgress(this.userId, pointsToAdd);
        }
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
      
      this.nextScoreMultiplier = 1;
      this.slots.forEach((slot) => showSlotFeedback(this, slot, true));
      this.time.delayedCall(600, () => this.showWinScreen());
    } else {
      this.slots.forEach((slot) => showSlotFeedback(this, slot, false));
      this.time.delayedCall(800, async () => {
        await this.handleFail();
      });
    }
  }

  private async handleFail() {
    if (this.timerEvent) {
      this.timerEvent.remove(false);
      this.timerEvent = null;
    }

    // ⭐ NEW: Check if Second Chance was manually activated FIRST (before checking inventory)
    if (this.isSecondChanceActive) {
      this.isSecondChanceActive = false; // ⭐ Consume the active Second Chance
      
      // ⌨️ Reset based on mode
      if (this.isTypingMode) {
        if (this.typingInputField) {
          this.typingInputField.value = "";
          this.typingInputField.focus();
        }
      } else {
        this.resetTiles();
      }
      
      this.resetTimer();
      this.showSecondChanceMessage();
      return; // ⭐ Exit early - Second Chance saved the player!
    }

    // Only check inventory if Second Chance wasn't manually activated
    await this.fetchInventoryAndUpdateHUD();
    const hasSecondChance = (this.inventory.second_chance || 0) > 0;

    if (hasSecondChance) {
      await PowerUpLogic.activateSecondChance(this.userId!, this);
      await this.fetchInventoryAndUpdateHUD();
      
      // ⌨️ Reset based on mode
      if (this.isTypingMode) {
        if (this.typingInputField) {
          this.typingInputField.value = "";
          this.typingInputField.focus();
        }
      } else {
        this.resetTiles();
      }
      
      this.resetTimer();
      this.showSecondChanceMessage();
    } else {
      this.consecutiveLevelsCompleted = 0;
      this.score = 0;
      try {
        localStorage.setItem("wordwizard_streak", "0");
        localStorage.setItem("wordwizard_session_score", "0");
      } catch (e) {
        console.error("Failed to reset streak/score:", e);
      }
      
      await logGameOver(this.userId!, SCENE_KEY);
      this.showGameOverScreen();
    }
  }

  private showSecondChanceMessage() {
    const msg = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "♻️ Second Chance!", {
        font: "bold 48px Arial",
        color: "#00ff99",
        stroke: "#006644",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(200);
    this.tweens.add({
      targets: msg,
      alpha: 0,
      duration: 1500,
      ease: "Cubic.easeOut",
      onComplete: () => msg.destroy(),
    });
  }

  private async showGameOverScreen() {
    this.clearLevelElements();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const gameOverText = this.add
      .text(centerX, centerY - 40, "💀 Game Over!", {
        font: "bold 56px Arial",
        color: "#f87171",
        stroke: "#7f1d1d",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(10);

    const retryText = this.add
      .text(centerX, centerY + 20, "Returning to map...", {
        font: "28px Arial",
        color: "#fff",
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.tweens.add({
      targets: [gameOverText, retryText],
      alpha: 0,
      duration: 1500,
      ease: "Cubic.easeOut",
      onComplete: () => {
        gameOverText.destroy();
        retryText.destroy();
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.time.delayedCall(650, () => {
          window.location.href = "/wordwizardmap";
        });
      },
    });
  }

  private resetTiles() {
    this.tiles.forEach((tile) => {
      const home = (tile as any).home;
      tile.setPosition(home.x, home.y);
    });
    this.slots.forEach((slot) => {
      (slot as any).filled = null;
    });
  }

  private async showWinScreen() {
    this.clearLevelElements();
    showCongratulationsConfetti(this);

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const isMobile = this.scale.width < 768;

    let s = 1;
    if (isMobile) {
      const baseWidth = 1600;
      const baseHeight = 900;
      const scaleW = this.scale.width / baseWidth;
      const scaleH = this.scale.height / baseHeight;
      s = Math.min(scaleW, scaleH);
      s *= 1.1;
      if (window.devicePixelRatio > 1.5) s *= 1.05;
      s = Phaser.Math.Clamp(s * 1.2, 0.5, 2.2);
    }

    if (this.infoText) {
      this.infoText.setVisible(false);
    }

    const correctFontSize = isMobile ? Math.round(48 * s * 1.6) : 64;
    const correctYOffset = isMobile ? -60 : -80;
    const correctStroke = isMobile ? 6 : 8;

    const correctText = this.add
      .text(centerX, centerY + correctYOffset, "✨ AMAZING! ✨", {
        font: `bold ${correctFontSize}px Arial`,
        color: "#fbbf24",
        stroke: "#d97706",
        strokeThickness: correctStroke,
      })
      .setOrigin(0.5)
      .setDepth(10)
      .setScale(0);

    const targetScale = isMobile ? 1.0 : 1.2;
    this.tweens.add({
      targets: correctText,
      scale: targetScale,
      duration: 600,
      ease: "Bounce.easeOut",
    });

    const pulseFrom = isMobile ? 1.0 : 1.2;
    const pulseTo = isMobile ? 1.05 : 1.25;
    this.tweens.add({
      targets: correctText,
      scale: { from: pulseFrom, to: pulseTo },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    const scoreFontSize = isMobile ? Math.round(32 * s * 1.6) : 42;
    const scoreYOffset = isMobile ? 5 : 10;
    const scoreStroke = isMobile ? 4 : 6;

    const scoreText = this.add
      .text(centerX, centerY + scoreYOffset, `🏆 Total Score: ${this.score} 🏆`, {
        font: `bold ${scoreFontSize}px Arial`,
        color: "#ffffff",
        stroke: "#8b5cf6",
        strokeThickness: scoreStroke,
      })
      .setOrigin(0.5)
      .setDepth(10)
      .setAlpha(0);

    this.tweens.add({
      targets: scoreText,
      alpha: 1,
      duration: 500,
      delay: 300,
      ease: "Power2",
    });

    const floatAmount = isMobile ? 3 : 5;
    this.tweens.add({
      targets: scoreText,
      y: centerY + scoreYOffset - floatAmount,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    const sparkleGraphics = this.add.graphics();
    sparkleGraphics.fillStyle(0xfef3c7, 1);
    const sparkleSize = isMobile ? 3 : 4;
    sparkleGraphics.fillCircle(sparkleSize, sparkleSize, sparkleSize);
    sparkleGraphics.generateTexture("winSparkle", sparkleSize * 2, sparkleSize * 2);
    sparkleGraphics.destroy();

    const sparkleSpeed = isMobile ? { min: 30, max: 100 } : { min: 50, max: 150 };
    const sparkleQuantity = isMobile ? 1 : 2;
    const sparkleFrequency = isMobile ? 150 : 100;

    const sparkleEmitter = this.add.particles(centerX, centerY + correctYOffset, "winSparkle", {
      speed: sparkleSpeed,
      angle: { min: 0, max: 360 },
      scale: { start: isMobile ? 1.0 : 1.2, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      quantity: sparkleQuantity,
      frequency: sparkleFrequency,
      blendMode: "ADD",
    });
    sparkleEmitter.setDepth(9);

    this.time.delayedCall(3000, () => {
      sparkleEmitter.stop();
    });

    const buttons = createStyledButtons(this, [
      {
        label: "➡️ Next Level",
        color: "#4CAF50",
        onClick: async () => {
          if (this.infoText) this.infoText.setVisible(true);

          correctText.destroy();
          scoreText.destroy();
          sparkleEmitter.destroy();
          buttons.forEach((b) => b.destroy());
          this.clearLevelElements();

          await this.unlockNextLevel();
          
          const hasNextLevel = this.currentLevelInCategory < 15;

          if (hasNextLevel) {
            const nextGlobalLevel = this.currentLevel + 1;
            const nextCategoryId = this.currentCategoryId;
            window.location.href = `/wordwizard?level=${nextGlobalLevel - 1}&category=${nextCategoryId}`;
          } else {
            try {
              localStorage.setItem("wordwizard_session_score", "0");
              localStorage.setItem("wordwizard_streak", "0");
            } catch (e) {
              console.error("Failed to reset score/streak:", e);
            }
            alert(`🎉 You finished ${this.currentCategoryId}! Final Score: ${this.score}`);
            window.location.href = "/wordwizardmap";
          }
        },
      },
    ]);
  }

  private async unlockNextLevel() {
    if (!this.userId) return;
    const nextLevelInCategory = this.currentLevelInCategory + 1;

    const currentUnlocked = this.categoryProgress[this.currentCategoryId] || 0;

    if (nextLevelInCategory > currentUnlocked) {
      try {
        await saveCategoryLevel(
          this.userId,
          "WordWizard",
          this.currentCategoryId,
          nextLevelInCategory
        );
        this.categoryProgress[this.currentCategoryId] = nextLevelInCategory;

        window.dispatchEvent(new CustomEvent("levels:updated"));
      } catch (e) {
        console.error("Failed to save category progress:", e);
      }
    }
  }

  private createTimerAndHUD() {
    this.timerText = this.add
      .text(24, 24, `⏱ ${this.timeRemaining}s`, {
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: "24px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setDepth(50);

    const startX = this.scale.width - 240;
    const startY = 24;

    const createInventoryRow = (
      y: number,
      emoji: string,
      label: string,
      type: "time_freeze" | "second_chance" | "score_booster",
      color: string
    ) => {
      const rowY = startY + y;

      const nameText = this.add
        .text(startX, rowY, `${emoji} ${label}: `, {
          fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: "18px",
          fontStyle: "600",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0, 0)
        .setDepth(50);

      const countText = this.add
        .text(startX + 150, rowY, "0", {
          fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: "18px",
          fontStyle: "bold",
          color: "#ffff00",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0, 0)
        .setDepth(50);

      const btnX = startX + 180;
      const btnWidth = 60;
      const btnHeight = 28;

      const btnBg = this.add.graphics();
      btnBg.fillStyle(parseInt(color.replace("#", "0x")), 1);
      btnBg.fillRoundedRect(btnX, rowY - 2, btnWidth, btnHeight, 6);
      btnBg.lineStyle(2, 0xffffff, 0.8);
      btnBg.strokeRoundedRect(btnX, rowY - 2, btnWidth, btnHeight, 6);
      btnBg.setDepth(50);
      btnBg.setInteractive(
        new Phaser.Geom.Rectangle(btnX, rowY - 2, btnWidth, btnHeight),
        Phaser.Geom.Rectangle.Contains
      );

      const btnText = this.add
        .text(btnX + btnWidth / 2, rowY + btnHeight / 2 - 2, "Use", {
          fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: "16px",
          fontStyle: "bold",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setDepth(51);

      btnBg.on("pointerdown", async () => {
        await this.handleUsePowerUp(type);
      });

      const container = this.add.container(0, 0);
      container.add([nameText, countText, btnBg, btnText]);
      return { container, countText };
    };

    const row1 = createInventoryRow(0, "❄️", "Time Freeze", "time_freeze", "#3b82f6");
    const row2 = createInventoryRow(35, "🔄", "2nd Chance", "second_chance", "#10b981");
    const row3 = createInventoryRow(70, "⭐", "Score Booster", "score_booster", "#f59e0b");

    (this as any)._inventoryTexts = { row1, row2, row3 };
    this.fetchInventoryAndUpdateHUD();
  }

  private async fetchInventoryAndUpdateHUD() {
    if (!this.userId) return;
    try {
      const res: UserPowerUp[] = await getUserPowerUps(this.userId);
      this.inventory = {
        time_freeze: 0,
        second_chance: 0,
        score_booster: 0,
      };
      res.forEach((item) => {
        const type = item.power_up?.type;
        if (type) (this.inventory as any)[type] = item.quantity;
      });
      const invTexts = (this as any)._inventoryTexts;
      if (invTexts) {
        invTexts.row1.countText.setText(`${this.inventory.time_freeze}`);
        invTexts.row2.countText.setText(`${this.inventory.second_chance}`);
        invTexts.row3.countText.setText(`${this.inventory.score_booster}`);
      }
    } catch (err) {
      console.error("Failed to fetch power-up inventory:", err);
    }
  }

  private async handleUsePowerUp(type: "time_freeze" | "second_chance" | "score_booster") {
    if (!this.userId) return;
    const qty = this.inventory[type] || 0;
    if (qty <= 0) {
      const warning = this.add
        .text(this.scale.width / 2, this.scale.height / 2, "⚠️ No power-up available", {
          fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: "22px",
          fontStyle: "bold",
          color: "#ffffff",
          stroke: "#ef4444",
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(200);
      this.time.delayedCall(1600, () => warning.destroy());
      return;
    }
    
    // ⭐ NEW: Prevent activating Second Chance if already active
    if (type === "second_chance" && this.isSecondChanceActive) {
      const warning = this.add
        .text(this.scale.width / 2, this.scale.height / 2, "♻️ Second Chance already active!", {
          fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: "22px",
          fontStyle: "bold",
          color: "#ffffff",
          stroke: "#10b981",
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(200);
      this.time.delayedCall(1600, () => warning.destroy());
      return;
    }
    
    try {
      if (type === "time_freeze") {
        await PowerUpLogic.activateTimeFreeze(this.userId!, this, 10);
      } else if (type === "score_booster") {
        const mult = await PowerUpLogic.activateScoreBooster(this.userId!, this, 2);
        this.nextScoreMultiplier = mult || 1;
      } else if (type === "second_chance") {
        await PowerUpLogic.activateSecondChance(this.userId!, this);
        
        // ⭐ NEW: Mark Second Chance as active when manually used
        this.isSecondChanceActive = true;
        
        // ⌨️ Reset based on mode
        if (this.isTypingMode) {
          if (this.typingInputField) {
            this.typingInputField.value = "";
            this.typingInputField.focus();
          }
        } else {
          this.resetTiles();
        }
        
        this.resetTimer();
      }
      await this.fetchInventoryAndUpdateHUD();
    } catch (err) {
      console.error("Error using power-up:", err);
    }
  }

  private resetTimer() {
    if (this.timerEvent) {
      this.timerEvent.remove(false);
      this.timerEvent = null;
    }

    this.timeRemaining = this.level.time;

    if (this.timerText) {
      this.timerText.setText(`⏱ ${this.timeRemaining}s`);

      if (this.timeRemaining <= 10) {
        this.timerText.setColor("#ef4444");
      } else if (this.timeRemaining <= 15) {
        this.timerText.setColor("#f59e0b");
      } else {
        this.timerText.setColor("#ffffff");
      }
    }

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: async () => {
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);

        if (this.timerText) {
          this.timerText.setText(`⏱ ${this.timeRemaining}s`);

          if (this.timeRemaining <= 5) {
            this.timerText.setColor("#dc2626");
            this.tweens.add({
              targets: this.timerText,
              scale: { from: 1, to: 1.2 },
              duration: 300,
              yoyo: true,
            });
          } else if (this.timeRemaining <= 10) {
            this.timerText.setColor("#ef4444");
          }
        }

        if (this.timeRemaining <= 0) {
          if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
          }
          await this.handleFail();
        }
      },
    });
  }

  shutdown() {
    if (this.timerEvent) {
      this.timerEvent.remove(false);
      this.timerEvent = null;
    }
    
    if (this.typingInputField) {
      this.typingInputField.remove();
      this.typingInputField = undefined;
    }
  }
}