import Phaser from "phaser";
import { saveMagicTreeLevel, getAllMagicTreeProgress } from "../services/levelService";
import { updateUserProgress, getUserProfile } from "../services/userService";
import { getLevelConfig } from "../MagicTree/levels";
import { bounce, createSparkle } from "../MagicTree/design";
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
  private leftButton?: Phaser.GameObjects.Graphics;
  private rightButton?: Phaser.GameObjects.Graphics;
  private isPressingLeft = false;
  private isPressingRight = false;
  private fruitLegend: Phaser.GameObjects.Text[] = [];
  
  // ⏰ Timer Properties
  private timeRemaining = 60;
  private timerText!: Phaser.GameObjects.Text;
  private countdownTimer?: Phaser.Time.TimerEvent;

  // ✅ FIX #2 - Guard flag to prevent duplicate saves
  private levelSaved = false;

  constructor() {
    super(SCENE_KEY);
  }

  async init(data: any) {
    this.score = data?.score ?? 0;
    
    // ✅ FIX #2 - Reset guard flag
    this.levelSaved = false;
    
    // Get level from URL or data
    const urlParams = new URLSearchParams(window.location.search);
    const levelParam = urlParams.get("level");
    const categoryParam = urlParams.get("category");
    
    let startLevel = data?.level ?? null;
    
    if (levelParam !== null) {
      const parsed = Number(levelParam);
      if (!Number.isNaN(parsed)) startLevel = parsed + 1;
    }

    this.currentLevel = startLevel ?? 1;
    
    // Extract category and level from URL or calculate from global level
    if (categoryParam) {
      this.currentCategoryId = categoryParam;
      // Calculate level within category from global level
      const categoryIndex = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"].indexOf(categoryParam);
      this.currentLevelInCategory = this.currentLevel - (categoryIndex * 15);
    } else {
      // Calculate category and level from global level number
      this.calculateCategoryFromGlobalLevel(this.currentLevel);
    }
    
    this.gameActive = true;
    this.currentSum = 0;
    
    // ⏰ Reset timer
    this.timeRemaining = this.getTimeLimitForLevel(this.currentLevel);
    
    try {
      this.time.removeAllEvents();
    } catch (err) {
      console.warn("MagicTree.init: removeAllEvents failed or had nothing to remove", err);
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

    // Check if level is unlocked
    const unlockedInCategory = this.categoryProgress[this.currentCategoryId] || 0;
    const hasCompletedAnyLevel1 = Object.values(this.categoryProgress).some(val => val >= 1);
    
    if (this.currentLevelInCategory === 1) {
      // Level 1: Must have completed any Level 1, OR this is first play ever
      const totalProgress = Object.values(this.categoryProgress).reduce((sum, val) => sum + val, 0);
      if (!hasCompletedAnyLevel1 && totalProgress > 0) {
        alert("🚫 Complete any Level 1 first to unlock all Level 1s!");
        window.location.href = "/MagicTree";
        return;
      }
    } else {
      // Levels 2-10: Must have completed previous level in THIS category
      if (this.currentLevelInCategory > unlockedInCategory) {
        alert(`🚫 Complete ${this.currentCategoryId} Level ${this.currentLevelInCategory - 1} first!`);
        window.location.href = "/MagicTree";
        return;
      }
    }

    this.startTime = Date.now();
  }

  // Calculate category and level from global level number
  private calculateCategoryFromGlobalLevel(globalLevel: number) {
    const categories = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"];
    const categoryIndex = Math.floor((globalLevel - 1) / 15);
    const levelInCategory = ((globalLevel - 1) % 15) + 1;
    
    this.currentCategoryId = categories[categoryIndex] || "BASIC";
    this.currentLevelInCategory = levelInCategory;
  }

  // ⏰ Get time limit based on level difficulty
  private getTimeLimitForLevel(level: number): number {
    const cfg = getLevelConfig(level);
    
    // Adjust time based on operation difficulty
    switch (cfg.operation) {
      case 'addition':
        return 60; // 1 minute for addition
      case 'subtraction':
        return 60; // 1 minute for subtraction
      case 'multiplication':
        return 75; // 1.25 minutes for multiplication
      case 'division':
        return 90; // 1.5 minutes for division
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

    const basketScale = isMobile ? 0.5 : Math.min(this.scale.width / 800, 1) * 0.7;
    const basketY = isMobile ? this.scale.height - 80 : this.scale.height - 50;
    
    this.basket = this.physics.add
      .sprite(this.scale.width / 2, basketY, "basket")
      .setCollideWorldBounds(true)
      .setScale(basketScale)
      .setImmovable(true);
    const body = this.basket.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.moves = true;
    
    const hitboxScale = 0.6; 
    body.setSize(
      this.basket.displayWidth * hitboxScale,
      this.basket.displayHeight * hitboxScale
    );
    body.setOffset(
      (this.basket.width - body.width) / 2,
      (this.basket.height - body.height) / 2
    );

    this.fruits = this.physics.add.group();
    
    this.fruitScale = isMobile ? 0.10 : Math.min(this.scale.width / 800, 1) * 0.15;
    
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
    this.createTimerDisplay(); // ⏰ Create timer display
    this.createFruitLegend();

    if (isMobile) {
      this.createTouchControls();
    }

    this.physics.add.overlap(this.basket, this.fruits, (_b, f) => {
      if (this.gameActive) this.collectFruit(f as Phaser.Physics.Arcade.Sprite);
    });
    
    this.physics.add.overlap(this.fruits, this.ground, (fruit) => {
      (fruit as Phaser.Physics.Arcade.Sprite).destroy();
    });

    this.startFruitTimer();
    this.startQuestion();
    this.startCountdownTimer(); // ⏰ Start the countdown

    this.scale.on("resize", (size: Phaser.Structs.Size) => {
      const resizeIsMobile = size.width < 768;
      this.cameras.resize(size.width, size.height);
      
      const resizeBasketY = resizeIsMobile ? size.height - 80 : size.height - 50;
      this.basket.setX(size.width / 2);
      this.basket.setY(resizeBasketY);
      
      this.ground.setPosition(size.width / 2, size.height - 10);
      if (this.quitButton) this.positionQuitButton();
      this.updateTimerPosition(); // ⏰ Update timer position
      this.updateFruitLegendPosition();
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

  // ⏰ CREATE TIMER DISPLAY (LEFT SIDE)
  private createTimerDisplay() {
    const isMobile = this.scale.width < 768;
    const fontSize = isMobile ? "24px" : "32px";
    const strokeThickness = isMobile ? 4 : 5;
    
    // Position on left side, below fruit legend
    const xPos = isMobile ? 25 : 35;
    const yPos = this.scale.height * 0.65; // Below the legend
    
    this.timerText = this.add.text(
      xPos,
      yPos,
      `⏰ ${this.formatTime(this.timeRemaining)}`,
      {
        fontFamily: "Fredoka, Arial Black, sans-serif",
        fontSize: fontSize,
        color: "#00ff00",
        stroke: "#000000",
        strokeThickness: strokeThickness,
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: "#000",
          blur: 5,
          fill: true,
        },
      }
    )
    .setOrigin(0, 0.5) // Left-aligned
    .setDepth(100);
  }

  // ⏰ UPDATE TIMER POSITION ON RESIZE
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

  // ⏰ FORMAT TIME (MM:SS)
  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ⏰ START COUNTDOWN TIMER
  private startCountdownTimer() {
    if (this.countdownTimer) {
      this.countdownTimer.remove(false);
    }

    this.countdownTimer = this.time.addEvent({
      delay: 1000, // 1 second
      loop: true,
      callback: () => {
        if (this.gameActive) {
          this.timeRemaining--;
          this.updateTimerDisplay();

          // Warning colors
          if (this.timeRemaining <= 10) {
            this.timerText.setColor("#ff0000"); // Red
            
            // Pulse effect when low
            this.tweens.add({
              targets: this.timerText,
              scale: 1.2,
              duration: 200,
              yoyo: true,
              ease: 'Sine.easeInOut'
            });
          } else if (this.timeRemaining <= 30) {
            this.timerText.setColor("#ffaa00"); // Orange
          }

          // Game over when time runs out
          if (this.timeRemaining <= 0) {
            this.handleTimeOut();
          }
        }
      },
    });
  }

  // ⏰ UPDATE TIMER DISPLAY
  private updateTimerDisplay() {
    if (this.timerText) {
      this.timerText.setText(`⏰ ${this.formatTime(this.timeRemaining)}`);
    }
  }

  // ⏰ HANDLE TIME OUT
  private async handleTimeOut() {
    this.stopFruits();
    this.stopCountdown();
    
    // Log game over
    if (this.userId) {
      await logGameOver(this.userId, SCENE_KEY);
    }
    await this.logSessionTime();

    // Show restart button after a short delay
    this.time.delayedCall(1000, () => {
      this.showRestart();
    });
  }

  // ⏰ STOP COUNTDOWN
  private stopCountdown() {
    if (this.countdownTimer) {
      this.countdownTimer.remove(false);
      this.countdownTimer = undefined;
    }
  }

  // CREATE FRUIT LEGEND
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
      return this.add.text(
        startX,
        baseY + index * spacing,
        `${item.emoji} ${item.text}`,
        {
          fontFamily: "Fredoka, Arial Black, sans-serif",
          fontSize,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: isMobile ? 3 : 4,
          shadow: {
            offsetX: 2,
            offsetY: 2,
            color: "#000",
            blur: 4,
            fill: true,
          },
        }
      )
      .setOrigin(0, 0.5)
      .setDepth(100);
    });
  }

  // UPDATE FRUIT LEGEND POSITION ON RESIZE
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

  // Touch Controls
  private createTouchControls() {
    const btnSize = 100;
    const btnY = this.scale.height - 150;
    const padding = 30;

    // Left Button
    this.leftButton = this.add.graphics();
    this.leftButton.fillStyle(0x4a90e2, 0.1);
    this.leftButton.fillRoundedRect(padding, btnY, btnSize, btnSize, 15);
    this.leftButton.lineStyle(4, 0xffffff, 0.1);
    this.leftButton.strokeRoundedRect(padding, btnY, btnSize, btnSize, 15);
    this.leftButton.setDepth(1000);

    this.add.text(padding + btnSize / 2, btnY + btnSize / 2, "◀", {
      fontSize: "48px",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setDepth(1);

    // Right Button
    this.rightButton = this.add.graphics();
    this.rightButton.fillStyle(0x4a90e2, 0.1);
    this.rightButton.fillRoundedRect(
      this.scale.width - btnSize - padding,
      btnY,
      btnSize,
      btnSize,
      15
    );
    this.rightButton.lineStyle(4, 0xffffff, 0.1);
    this.rightButton.strokeRoundedRect(
      this.scale.width - btnSize - padding,
      btnY,
      btnSize,
      btnSize,
      15
    );
    this.rightButton.setDepth(1000);

    this.add.text(
      this.scale.width - btnSize - padding + btnSize / 2,
      btnY + btnSize / 2,
      "▶",
      {
        fontSize: "48px",
        color: "#ffffff",
        fontStyle: "bold",
      }
    )
    .setOrigin(0.5)
    .setDepth(1);

    const leftZone = this.add.zone(
      padding + btnSize / 2,
      btnY + btnSize / 2,
      btnSize,
      btnSize
    )
    .setInteractive()
    .setDepth(1002);

    const rightZone = this.add.zone(
      this.scale.width - btnSize - padding + btnSize / 2,
      btnY + btnSize / 2,
      btnSize,
      btnSize
    )
    .setInteractive()
    .setDepth(1002);

    leftZone.on("pointerdown", () => {
      this.isPressingLeft = true;
      this.leftButton?.setAlpha(1);
    });

    leftZone.on("pointerup", () => {
      this.isPressingLeft = false;
      this.leftButton?.setAlpha(1);
    });

    leftZone.on("pointerout", () => {
      this.isPressingLeft = false;
      this.leftButton?.setAlpha(1);
    });

    rightZone.on("pointerdown", () => {
      this.isPressingRight = true;
      this.rightButton?.setAlpha(1);
    });

    rightZone.on("pointerup", () => {
      this.isPressingRight = false;
      this.rightButton?.setAlpha(1);
    });

    rightZone.on("pointerout", () => {
      this.isPressingRight = false;
      this.rightButton?.setAlpha(1);
    });
  }

  // Quit Button
  private createQuitButton() {
    const isMobile = this.scale.width < 768;
    
    const fontSize = isMobile ? "22px" : "26px";
    const strokeThickness = isMobile ? 3 : 4;
    
    const style = {
      fontFamily: "Fredoka, Arial Black, sans-serif",
      fontSize: fontSize,
      color: "#fff",
      stroke: "#000066",
      strokeThickness: strokeThickness,
    };
    this.quitButton = this.add
      .text(0, 0, "Quit", style)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999)
      .on("pointerover", () =>
        this.tweens.add({ targets: this.quitButton, scale: 1.1, duration: 100 })
      )
      .on("pointerout", () =>
        this.tweens.add({ targets: this.quitButton, scale: 1, duration: 100 })
      )
      .on("pointerdown", async () => {
        const confirmQuit = window.confirm("👋 Quit and return to the map?");
        if (confirmQuit) {
          await this.logSessionTime();
          this.cameras.main.fadeOut(300, 0, 0, 0);
          this.time.delayedCall(400, () => (window.location.href = "/MagicTree"));
        }
      });

    this.positionQuitButton();
  }

  private positionQuitButton() {
    const isMobile = this.scale.width < 768;
    const padY = isMobile ? 230 : 180;
    const padX = isMobile ? 50 : 100;
    const x = padX;
    const y = this.scale.height - padY;
    
    if (this.quitButton) this.quitButton.setPosition(x, y);
  }

  // Gameplay
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
      case 'addition':
        this.targetAnswer = a + b;
        questionText = `${a} + ${b} = ?`;
        break;
        
      case 'subtraction':
        if (a < b) [a, b] = [b, a];
        this.targetAnswer = a - b;
        questionText = `${a} - ${b} = ?`;
        break;
        
      case 'multiplication':
        this.targetAnswer = a * b; 
        questionText = `${a} × ${b} = ?`;
        break;
        
      case 'division':
        this.targetAnswer = Phaser.Math.Between(cfg.minNumber / 10, cfg.maxNumber / 10);
        a = this.targetAnswer * b;
        questionText = `${a} ÷ ${b} = ?`;
        break;
        
      case 'mixed': {
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
        
      case 'fixed': {
        // NEW: Check if multiple questions exist
        if (cfg.questions && cfg.questions.length > 0) {
          // Randomly pick one question from the pool
          const randomIndex = Phaser.Math.Between(0, cfg.questions.length - 1);
          const selectedQuestion = cfg.questions[randomIndex];
          questionText = selectedQuestion.question;
          this.targetAnswer = selectedQuestion.answer;
        } 
        // Fallback to single question (backward compatible)
        else if (cfg.question && cfg.answer !== undefined) {
          questionText = cfg.question;
          this.targetAnswer = cfg.answer;
        } 
        // Final fallback
        else {
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
    let key = "fruit1",
      value = 1,
      rotten = false;
    const roll = Math.random();
    if (roll < 0.3) key = "fruit1";
    else if (cfg.allowRotten && Math.random() > 0.8) {
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

  // ✅ FIX #2 - Updated collectFruit with guard flag
  private async collectFruit(fruit: Phaser.Physics.Arcade.Sprite) {
    const val = (fruit as any).fruitValue;
    const { x, y } = fruit;
    fruit.destroy();
    createSparkle(this, x, y);
    bounce(this, this.basket);

    this.currentSum += val;
    this.ui.sumText.setText("Current: " + this.currentSum);

    if (this.currentSum === this.targetAnswer) {
      // ✅ FIX #2 - Guard against duplicate saves
      if (!this.levelSaved) {
        this.levelSaved = true;
        await this.unlockNextLevel();
      }

      this.stopFruits();
      this.stopCountdown(); // ⏰ Stop timer on success
      await this.addScore(10);
      
      // Determine if there's a next level
      const hasNextLevel = this.currentLevelInCategory < 15;
      
      showNextLevelUI(
        this,
        this.ui,
        this.currentLevelInCategory,
        15, // Max levels per category
        () => {
          if (hasNextLevel) {
            // Go to next level in same category
            const nextGlobalLevel = this.currentLevel + 1;
            this.scene.restart({ 
              score: this.score, 
              level: nextGlobalLevel 
            });
          } else {
            // Completed all levels in category, return to map
            window.location.href = "/MagicTree";
          }
        }
      );
    } else if (this.currentSum > this.targetAnswer || this.currentSum < 0) {
      this.stopFruits();
      this.stopCountdown(); // ⏰ Stop timer on fail
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
    this.ui.restartButton = showRestartButton(this, () =>
      this.scene.restart({ score: 0, level: this.currentLevel })
    );
  }

  private async addScore(points: number) {
    this.score += points;
    this.ui.scoreText.setText("Score: " + this.score);
    if (!this.userId) return;
    try {
      await updateUserProgress(this.userId, points);
      const updated = await getUserProfile(this.userId);
      localStorage.setItem("user", JSON.stringify(updated));
      localStorage.setItem("score", String(this.score));
    } catch (e) {
      console.error("Error updating progress:", e);
    }
  }

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
      return await getAllMagicTreeProgress(uid);
    } catch (error) {
      console.error("Error fetching category progress:", error);
      return { BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0 };
    }
  }

  // ✅ FIX #3 - Hardened unlockNextLevel with correct logic
  private async unlockNextLevel() {
    if (!this.userId) return;

    const unlocked = this.categoryProgress[this.currentCategoryId] || 0;
    const newUnlocked = Math.max(unlocked, this.currentLevelInCategory);

    // Only save if progress increases
    if (newUnlocked > unlocked) {
      try {
        await saveMagicTreeLevel(
          this.userId,
          this.currentCategoryId,
          newUnlocked
        );

        this.categoryProgress[this.currentCategoryId] = newUnlocked;
        window.dispatchEvent(new CustomEvent("levels:updated"));
      } catch (e) {
        console.error("❌ Failed to save category progress:", e);
      }
    }
  }
}