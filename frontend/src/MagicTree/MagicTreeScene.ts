import Phaser from "phaser";
import { saveLevel, getAllMagicTreeProgress } from "../services/levelService";
import { updateUserProgress, getUserProfile } from "../services/userService";
import { getLevelConfig } from "../MagicTree/levels";
import {
  createHUD,
  showNextLevelUI,
  showRestartButton,
  UIElements,
} from "../MagicTree/uiElements";
import { logPageVisit, logGameOver } from "../services/pageVisitService";

const SCENE_KEY = "MagicTree";

export default class MagicTree extends Phaser.Scene {
  private basket!: Phaser.Physics.Arcade.Sprite;
  private fruits!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private targetAnswer = 0;
  private currentSum = 0;
  private ui!: UIElements;
  private score = 0;
  private currentLevel = 1;
  private currentCategoryId = "BASIC";
  private currentLevelInCategory = 1;
  private gameActive = true;
  private userId: number | null = null;
  private categoryProgress: Record<string, number> = {
    BASIC: 0,
    NORMAL: 0,
    HARD: 0,
    ADVANCED: 0,
    EXPERT: 0,
  };
  private fruitTimer?: Phaser.Time.TimerEvent;
  private ground!: Phaser.GameObjects.Rectangle;  
  private fruitScale = 0.1;
  private quitButton?: Phaser.GameObjects.Text;
  private startTime = Date.now();
  private isPressingLeft = false;
  private isPressingRight = false;
  private fruitLegend: Phaser.GameObjects.Text[] = [];
  private timeRemaining = 60;
  private timerText!: Phaser.GameObjects.Text;
  private countdownTimer?: Phaser.Time.TimerEvent;
  private leftTouchZone?: Phaser.GameObjects.Zone;
  private rightTouchZone?: Phaser.GameObjects.Zone;
  private leftIndicator?: Phaser.GameObjects.Text;
  private rightIndicator?: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEY);
  }

  async init(data: any) {
    this.score = data?.score ?? 0;

    const urlParams = new URLSearchParams(window.location.search);
    const levelParam = urlParams.get("level");
    const categoryParam = urlParams.get("category");

    let startLevel = data?.level ?? null;

    if (levelParam !== null) {
      const parsed = Number(levelParam);
      if (!Number.isNaN(parsed)) startLevel = parsed + 1;
    }

    this.currentLevel = startLevel ?? 1;

    if (categoryParam) {
      this.currentCategoryId = categoryParam;
      const categoryIndex = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"].indexOf(categoryParam);
      this.currentLevelInCategory = this.currentLevel - (categoryIndex * 15);
    } else {
      this.calculateCategoryFromGlobalLevel(this.currentLevel);
    }

    this.gameActive = true;
    this.currentSum = 0;
    this.timeRemaining = this.getTimeLimitForLevel(this.currentLevel);

    try {
      this.time.removeAllEvents();
    } catch (err) {
      console.warn("MagicTree.init: removeAllEvents failed", err);
    }

    this.userId = this.getUserId();
    if (!this.userId) {
      alert("❌ User not found! Please log in again.");
      window.location.href = "/landing";
      return;
    }

    try {
      this.categoryProgress = await this.fetchCategoryProgress(this.userId);
    } catch {
      this.categoryProgress = { BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0 };
    }

    const maxUnlockedInCategory = this.categoryProgress[this.currentCategoryId] ?? 0;
    console.log(`🎮 Init: Category=${this.currentCategoryId}, Level=${this.currentLevelInCategory}, MaxUnlocked=${maxUnlockedInCategory}`);

    if (this.currentLevelInCategory > 1 && this.currentLevelInCategory > maxUnlockedInCategory) {
      alert(`🚫 Level ${this.currentLevelInCategory} is locked. Complete previous levels first.`);
      window.location.href = "/MagicTree";
      return;
    }

    this.startTime = Date.now();
  }

  private calculateCategoryFromGlobalLevel(globalLevel: number) {
    const categories = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"];
    const categoryIndex = Math.floor((globalLevel - 1) / 15);
    const levelInCategory = ((globalLevel - 1) % 15) + 1;

    this.currentCategoryId = categories[categoryIndex] || "BASIC";
    this.currentLevelInCategory = levelInCategory;
  }

  private getTimeLimitForLevel(level: number): number {
    const cfg = getLevelConfig(level);

    switch (cfg.operation) {
      case "addition":
        return 60;
      case "subtraction":
        return 60;
      case "multiplication":
        return 75;
      case "division":
        return 90;
      default:
        return 60;
    }
  }

  preload() {
    this.load.image("background", "assets/tree4.jpg");
    this.load.image("basket", "assets/basket.png");
    this.load.image("fruit1", "assets/apple.png");
    this.load.image("fruit2", "assets/banana.png");
    this.load.image("fruit3", "assets/orange.png");
    this.load.image("rotten", "assets/rotten.png");
  }

  create() {
    const isMobile = this.scale.width < 768;

    this.cameras.main.setBackgroundColor("#87CEEB");
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "background")
      .setOrigin(0.5)
      .setDisplaySize(this.scale.width, this.scale.height);

    const basketScale = isMobile ? 0.5 : 0.7;
    const basketY = isMobile ? this.scale.height - 80 : this.scale.height - 50;

    this.basket = this.physics.add
      .sprite(this.scale.width / 2, basketY, "basket")
      .setCollideWorldBounds(true)
      .setScale(basketScale)
      .setImmovable(true);

    const body = this.basket.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.moves = true;
    body.setSize(this.basket.displayWidth * 0.6, this.basket.displayHeight * 0.6);

    this.fruits = this.physics.add.group();
    this.fruitScale = isMobile ? 0.10 : 0.15;

    this.ground = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height - 10,
      this.scale.width,
      20,
      0x000000,
      0
    );
    this.physics.add.existing(this.ground, true);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.ui = createHUD(this, this.score, this.currentLevelInCategory);
    this.createQuitButton();
    this.createTimerDisplay();
    this.createFruitLegend();

    // Always create touch zones on mobile (replaces buttons)
    if (isMobile) {
      this.createTouchZones();
      this.showTouchIndicators();
    }

    this.physics.add.overlap(this.basket, this.fruits, (_b, f) => {
      if (this.gameActive) this.collectFruit(f as Phaser.Physics.Arcade.Sprite);
    });

    this.physics.add.overlap(this.fruits, this.ground, (fruit) => {
      (fruit as Phaser.Physics.Arcade.Sprite).destroy();
    });

    this.startFruitTimer();
    this.startQuestion();
    this.startCountdownTimer();

    this.scale.on("resize", (size: Phaser.Structs.Size) => {
      const resizeIsMobile = size.width < 768;
      this.cameras.resize(size.width, size.height);

      const resizeBasketY = resizeIsMobile ? size.height - 80 : size.height - 50;
      this.basket.setX(size.width / 2);
      this.basket.setY(resizeBasketY);

      this.ground.setPosition(size.width / 2, size.height - 10);
      if (this.quitButton) this.positionQuitButton();
      this.updateTimerPosition();
      this.updateFruitLegendPosition();

      // Recreate touch zones with updated dimensions
      if (resizeIsMobile) {
        this.createTouchZones();
      }
    });
  }

  update() {
    if (!this.gameActive) return;

    const isMobile = this.scale.width < 768;
    const speed = isMobile ? 500 : 400;

    const movingLeft = this.cursors.left?.isDown || this.isPressingLeft;
    const movingRight = this.cursors.right?.isDown || this.isPressingRight;

    if (movingLeft) {
      this.basket.setVelocityX(-speed);
      this.basket.setAngle(-15);
    } else if (movingRight) {
      this.basket.setVelocityX(speed);
      this.basket.setAngle(15);
    } else {
      this.basket.setVelocityX(0);
      this.basket.setAngle(0);
    }
  }

  // ─── Touch Indicators (shows for 5 seconds then fades) ────────────────────
  private showTouchIndicators() {
    const { width, height } = this.scale;
    const isMobile = this.scale.width < 768;
    const fontSize = isMobile ? "32px" : "40px";

    // Left indicator
    this.leftIndicator = this.add
      .text(width * 0.25, height / 2, "< Left", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: fontSize,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setAlpha(0);

    // Right indicator
    this.rightIndicator = this.add
      .text(width * 0.75, height / 2, "Right >", {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: fontSize,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setAlpha(0);

    // Fade in animation
    this.tweens.add({
      targets: [this.leftIndicator, this.rightIndicator],
      alpha: 0.8,
      duration: 500,
      ease: "Power2",
    });

    // Pulsing animation for 5 seconds
    this.tweens.add({
      targets: [this.leftIndicator, this.rightIndicator],
      scale: { from: 1, to: 1.1 },
      duration: 800,
      yoyo: true,
      repeat: 6, // ~5 seconds total
      ease: "Sine.easeInOut",
    });

    // Fade out after 5 seconds
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: [this.leftIndicator, this.rightIndicator],
        alpha: 0,
        duration: 1000,
        ease: "Power2",
        onComplete: () => {
          this.leftIndicator?.destroy();
          this.rightIndicator?.destroy();
        },
      });
    });
  }

  // ─── Full-screen left/right touch zones (replaces arrow buttons) ───────────
  private createTouchZones() {
    const { width, height } = this.scale;

    // Destroy old zones before recreating (handles resize)
    if (this.leftTouchZone) {
      this.leftTouchZone.destroy();
    }
    if (this.rightTouchZone) {
      this.rightTouchZone.destroy();
    }

    // Left half of screen
    this.leftTouchZone = this.add
      .zone(0, 0, width / 2, height)
      .setOrigin(0, 0)
      .setInteractive()
      .setDepth(500);

    // Right half of screen
    this.rightTouchZone = this.add
      .zone(width / 2, 0, width / 2, height)
      .setOrigin(0, 0)
      .setInteractive()
      .setDepth(500);

    // Left zone listeners
    this.leftTouchZone.on("pointerdown", () => { this.isPressingLeft = true; });
    this.leftTouchZone.on("pointerup", () => { this.isPressingLeft = false; });
    this.leftTouchZone.on("pointerout", () => { this.isPressingLeft = false; });

    // Right zone listeners
    this.rightTouchZone.on("pointerdown", () => { this.isPressingRight = true; });
    this.rightTouchZone.on("pointerup", () => { this.isPressingRight = false; });
    this.rightTouchZone.on("pointerout", () => { this.isPressingRight = false; });
  }

  // ─── Timer ─────────────────────────────────────────────────────────────────
  private createTimerDisplay() {
    const isMobile = this.scale.width < 768;
    const fontSize = isMobile ? "24px" : "32px";
    const strokeThickness = isMobile ? 4 : 5;
    const xPos = isMobile ? 25 : 35;
    const yPos = this.scale.height * 0.65;

    this.timerText = this.add
      .text(xPos, yPos, `⏰ ${this.formatTime(this.timeRemaining)}`, {
        fontFamily: "Arial Black",
        fontSize: fontSize,
        color: "#00ff00",
        stroke: "#000000",
        strokeThickness: strokeThickness,
      })
      .setOrigin(0, 0.5)
      .setDepth(100);
  }

  private updateTimerPosition() {
    const isMobile = this.scale.width < 768;
    const fontSize = isMobile ? "24px" : "32px";
    const xPos = isMobile ? 25 : 35;
    const yPos = this.scale.height * 0.65;

    if (this.timerText) {
      this.timerText.setPosition(xPos, yPos);
      this.timerText.setFontSize(fontSize);
    }
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  private startCountdownTimer() {
    if (this.countdownTimer) {
      this.countdownTimer.remove(false);
    }

    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.gameActive) {
          this.timeRemaining--;
          this.updateTimerDisplay();

          if (this.timeRemaining <= 10) {
            this.timerText.setColor("#ff0000");
            this.tweens.add({
              targets: this.timerText,
              scale: 1.2,
              duration: 200,
              yoyo: true,
              ease: "Sine.easeInOut",
            });
          } else if (this.timeRemaining <= 30) {
            this.timerText.setColor("#ffaa00");
          }

          if (this.timeRemaining <= 0) {
            this.handleTimeOut();
          }
        }
      },
    });
  }

  private updateTimerDisplay() {
    if (this.timerText) {
      this.timerText.setText(`⏰ ${this.formatTime(this.timeRemaining)}`);
    }
  }

  private async handleTimeOut() {
    this.stopFruits();
    this.stopCountdown();

    if (this.userId) {
      await logGameOver(this.userId, SCENE_KEY);
    }
    await this.logSessionTime();

    this.time.delayedCall(1000, () => {
      this.showRestart();
    });
  }

  private stopCountdown() {
    if (this.countdownTimer) {
      this.countdownTimer.remove(false);
      this.countdownTimer = undefined;
    }
  }

  // ─── Fruit Legend ──────────────────────────────────────────────────────────
  private createFruitLegend() {
    const cfg = getLevelConfig(this.currentLevel);
    const isMobile = this.scale.width < 768;

    const banana = 2 * cfg.fruitMultiplier;
    const orange = 3 * cfg.fruitMultiplier;
    const rotten = -cfg.fruitMultiplier;

    const legendData = [
      { emoji: "🍏", text: "= 1" },
      { emoji: "🍌", text: `= ${banana}` },
      { emoji: "🍊", text: `= ${orange}` },
      { emoji: "🍎", text: `= ${rotten}` },
    ];

    const startX = isMobile ? 20 : 30;
    const spacing = isMobile ? 28 : 34;
    const fontSize = isMobile ? "22px" : "28px";

    const blockHeight = legendData.length * spacing;
    const baseY = this.scale.height * 0.35 - blockHeight / 2;

    this.fruitLegend = legendData.map((item, index) => {
      return this.add
        .text(startX, baseY + index * spacing, `${item.emoji} ${item.text}`, {
          fontFamily: "Arial Black",
          fontSize,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: isMobile ? 3 : 4,
        })
        .setOrigin(0, 0.5)
        .setDepth(100);
    });
  }

  private updateFruitLegendPosition() {
    const isMobile = this.scale.width < 768;
    const startX = isMobile ? 20 : 30;
    const spacing = isMobile ? 28 : 34;
    const fontSize = isMobile ? "22px" : "28px";

    const blockHeight = this.fruitLegend.length * spacing;
    const baseY = this.scale.height * 0.35 - blockHeight / 2;

    this.fruitLegend.forEach((text, index) => {
      text.setPosition(startX, baseY + index * spacing);
      text.setFontSize(fontSize);
    });
  }

  // ─── Quit Button (styled like Start Game) ──────────────────────────────────
  private createQuitButton() {
    const isMobile = this.scale.width < 768;
    const fontSize = isMobile ? "22px" : "26px";
    const strokeThickness = isMobile ? 6 : 8;

    const style = {
      fontFamily: "Fredoka, Arial Black, sans-serif",
      fontSize: fontSize,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: strokeThickness,
    };

    this.quitButton = this.add
      .text(0, 0, "QUIT", style)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.positionQuitButton();

    // Hover animation
    this.quitButton.on("pointerover", () => {
      this.tweens.add({
        targets: this.quitButton,
        scale: 1.1,
        duration: 150,
        ease: "Power2",
      });
    });

    // Reset on pointer out
    this.quitButton.on("pointerout", () => {
      this.tweens.add({
        targets: this.quitButton,
        scale: 1,
        duration: 150,
        ease: "Power2",
      });
    });

    // Click animation
    this.quitButton.on("pointerdown", async () => {
      this.tweens.add({
        targets: this.quitButton,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: async () => {
          const confirmQuit = window.confirm("👋 Quit and return to the map?");
          if (confirmQuit) {
            await this.logSessionTime();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(400, () => (window.location.href = "/MagicTree"));
          }
        },
      });
    });
  }

  private positionQuitButton() {
    const isMobile = this.scale.width < 768;
    const padY = isMobile ? 200 : 180;
    const padX = isMobile ? 50 : 100;
    const x = padX;
    const y = this.scale.height - padY;

    if (this.quitButton) this.quitButton.setPosition(x, y);
  }

  // ─── Fruit Spawning ────────────────────────────────────────────────────────
  private startFruitTimer() {
    if (this.fruitTimer) this.fruitTimer.remove(false);
    const cfg = getLevelConfig(this.currentLevel);
    const spawnDelay = (cfg as any).spawnDelay ?? 1200;

    this.fruitTimer = this.time.addEvent({
      delay: spawnDelay,
      loop: true,
      callback: () => {
        if (this.gameActive) this.spawnFruit();
      },
    });
  }

  private startQuestion() {
    this.currentSum = 0;
    this.ui.sumText.setText("Current: 0");
    const cfg = getLevelConfig(this.currentLevel);

    let a = Phaser.Math.Between(cfg.minNumber, cfg.maxNumber);
    let b = Phaser.Math.Between(cfg.minNumber, cfg.maxNumber);
    let questionText = "";

    switch (cfg.operation) {
      case "addition":
        this.targetAnswer = a + b;
        questionText = `${a} + ${b} = ?`;
        break;

      case "subtraction":
        if (a < b) [a, b] = [b, a];
        this.targetAnswer = a - b;
        questionText = `${a} - ${b} = ?`;
        break;

      case "multiplication":
        this.targetAnswer = a * b;
        questionText = `${a} × ${b} = ?`;
        break;

      case "division":
        this.targetAnswer = Phaser.Math.Between(cfg.minNumber / 10, cfg.maxNumber / 10);
        a = this.targetAnswer * b;
        questionText = `${a} ÷ ${b} = ?`;
        break;

      case "mixed": {
        const useMult = Math.random() > 0.5;
        if (useMult && cfg.maxNumber >= 10) {
          a = Phaser.Math.Between(2, Math.min(12, cfg.maxNumber));
          b = Phaser.Math.Between(2, Math.min(12, cfg.maxNumber));
          this.targetAnswer = a * b;
          questionText = `${a} × ${b} = ?`;
        } else {
          const useAdd = Math.random() > 0.5;
          if (useAdd) {
            this.targetAnswer = a + b;
            questionText = `${a} + ${b} = ?`;
          } else {
            if (a < b) [a, b] = [b, a];
            this.targetAnswer = a - b;
            questionText = `${a} - ${b} = ?`;
          }
        }
        break;
      }

      case "fixed": {
        if (cfg.questions && cfg.questions.length > 0) {
          const randomIndex = Phaser.Math.Between(0, cfg.questions.length - 1);
          const selectedQuestion = cfg.questions[randomIndex];
          questionText = selectedQuestion.question;
          this.targetAnswer = selectedQuestion.answer;
        } else if (cfg.question && cfg.answer !== undefined) {
          questionText = cfg.question;
          this.targetAnswer = cfg.answer;
        } else {
          this.targetAnswer = a + b;
          questionText = `${a} + ${b} = ?`;
        }
        break;
      }
    }

    this.ui.questionText.setText(questionText);
  }

  private spawnFruit() {
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const cfg = getLevelConfig(this.currentLevel);
    let key = "fruit1";
    let value = 1;
    let rotten = false;

    const roll = Math.random();
    if (roll < 0.3) {
      key = "fruit1";
    } else if (cfg.allowRotten && Math.random() > 0.8) {
      key = "rotten";
      rotten = true;
      value = -cfg.fruitMultiplier;
    } else {
      const type = Phaser.Math.Between(2, 3);
      key = `fruit${type}`;
      value = type * cfg.fruitMultiplier;
    }

    const f = this.fruits.create(x, 0, key) as Phaser.Physics.Arcade.Sprite;
    (f as any).fruitValue = value;

    const isMobile = this.scale.width < 768;
    const rottenScale = isMobile ? this.fruitScale * 1.3 : this.fruitScale * 1.5;
    f.setScale(rotten ? rottenScale : this.fruitScale);
    f.setCollideWorldBounds(false);

    const body = f.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(true);
    body.moves = true;

    const fallSpeed = isMobile ? 200 : 180;
    f.setVelocityY(fallSpeed * (this.scale.height / 600));

    const rotationSpeed = Phaser.Math.Between(-3, 3);
    f.setAngularVelocity(rotationSpeed * 100);

    const horizontalDrift = Phaser.Math.Between(-20, 20);
    f.setVelocityX(horizontalDrift);
  }

  // ─── Fruit Collection ──────────────────────────────────────────────────────
  private async collectFruit(fruit: Phaser.Physics.Arcade.Sprite) {
    const val = (fruit as any).fruitValue;
    fruit.destroy();

    this.currentSum += val;
    this.ui.sumText.setText("Current: " + this.currentSum);

    if (this.currentSum === this.targetAnswer) {
      this.stopFruits();
      this.stopCountdown();

      await this.addScore(10);
      await this.unlockNextLevel();

      const hasNextLevel = this.currentLevelInCategory < 15;

      showNextLevelUI(
        this,
        this.ui,
        this.currentLevelInCategory,
        15,
        () => {
          if (hasNextLevel) {
            const categoryIndex = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"].indexOf(
              this.currentCategoryId
            );
            const nextGlobalLevel = categoryIndex * 15 + (this.currentLevelInCategory + 1);

            this.scene.restart({
              score: this.score,
              level: nextGlobalLevel,
            });
          } else {
            window.location.href = "/MagicTree";
          }
        }
      );
    } else if (this.currentSum > this.targetAnswer || this.currentSum < 0) {
      this.stopFruits();
      this.stopCountdown();
      if (this.userId) await logGameOver(this.userId, SCENE_KEY);
      await this.logSessionTime();
      this.showRestart();
    }
  }

  private stopFruits() {
    this.gameActive = false;
    if (this.fruitTimer) this.fruitTimer.remove(false);
    this.fruits.clear(true, true);
  }

  private showRestart() {
    // Destroy touch zones when game is over to prevent interference
    if (this.leftTouchZone) {
      this.leftTouchZone.removeAllListeners();
      this.leftTouchZone.destroy();
      this.leftTouchZone = undefined;
    }
    if (this.rightTouchZone) {
      this.rightTouchZone.removeAllListeners();
      this.rightTouchZone.destroy();
      this.rightTouchZone = undefined;
    }
    
    // Reset touch states
    this.isPressingLeft = false;
    this.isPressingRight = false;

    this.ui.restartButton = showRestartButton(this, () => {
      // Properly restart the scene with current level
      this.scene.restart({ 
        score: 0, 
        level: this.currentLevel 
      });
    });
  }

  // ─── Score & Level Unlock ──────────────────────────────────────────────────
  private async addScore(points: number) {
    this.score += points;
    this.ui.scoreText.setText("Score: " + this.score);

    if (!this.userId) return;

    try {
      await updateUserProgress(this.userId, points);

      const updated = await getUserProfile(this.userId);
      localStorage.setItem("user", JSON.stringify(updated));
      localStorage.setItem("score", String(this.score));

      console.log("✅ Score updated successfully");
    } catch (e) {
      console.error("❌ Error updating score:", e);
    }
  }

  private async unlockNextLevel() {
    if (!this.userId) return;

    const completedLevel = this.currentLevelInCategory;
    const nextLevel = completedLevel + 1;
    const gameName = `MagicTree_${this.currentCategoryId}`;

    console.log(`🔓 Unlocking Level ${nextLevel} in ${this.currentCategoryId}`);

    try {
      await saveLevel(this.userId, gameName, nextLevel);

      this.categoryProgress[this.currentCategoryId] = nextLevel;

      window.dispatchEvent(new CustomEvent("levels:updated"));

      console.log(`✅ Level ${nextLevel} unlocked successfully`);
    } catch (e) {
      console.error("❌ Error unlocking level:", e);
    }
  }

  // ─── Analytics ────────────────────────────────────────────────────────────
  private async logSessionTime() {
    if (!this.userId) return;
    const end = Date.now();
    const spent = Math.floor((end - this.startTime) / 1000);
    try {
      await logPageVisit(this.userId, SCENE_KEY, spent);
    } catch (err) {
      console.error("Error logging time:", err);
    }
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────
  private getUserId(): number | null {
    try {
      const id = localStorage.getItem("user_id");
      if (id) return Number(id);
      const u = localStorage.getItem("user");
      return u ? Number(JSON.parse(u).user_id || JSON.parse(u).id) : null;
    } catch {
      return null;
    }
  }

  private async fetchCategoryProgress(uid: number): Promise<Record<string, number>> {
    try {
      const progress = await getAllMagicTreeProgress(uid);
      console.log("📥 Fetched progress:", progress);
      return progress;
    } catch (error) {
      console.error("❌ Error fetching progress:", error);
      return { BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0 };
    }
  }
}