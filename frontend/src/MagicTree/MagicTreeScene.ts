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

  constructor() {
    super(SCENE_KEY);
  }

  async init(data: any) {
    this.score = data?.score ?? 0;
    
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
      this.categoryProgress = { BASIC: 1, NORMAL: 1, HARD: 1, ADVANCED: 1, EXPERT: 1 };
    }

    // 🚨 FIXED: Use max unlocked level for validation
    const maxUnlockedInCategory = this.categoryProgress[this.currentCategoryId] ?? 1;

    console.log(`🎮 Init: Category=${this.currentCategoryId}, Playing Level=${this.currentLevelInCategory}, MaxUnlocked=${maxUnlockedInCategory}`);

    if (this.currentLevelInCategory > maxUnlockedInCategory) {
      alert(
        `🚫 Level ${this.currentLevelInCategory} is locked. Complete previous levels first.`
      );
      window.location.href = "/MagicTree";
      return;
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
    this.createTimerDisplay();
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
    
    const xPos = isMobile ? 25 : 35;
    const yPos = this.scale.height * 0.65;
    
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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              ease: 'Sine.easeInOut'
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

  private createTouchControls() {
    const btnSize = 100;
    const btnY = this.scale.height - 150;
    const padding = 30;

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
        if (cfg.questions && cfg.questions.length > 0) {
          const randomIndex = Phaser.Math.Between(0, cfg.questions.length - 1);
          const selectedQuestion = cfg.questions[randomIndex];
          questionText = selectedQuestion.question;
          this.targetAnswer = selectedQuestion.answer;
        } 
        else if (cfg.question && cfg.answer !== undefined) {
          questionText = cfg.question;
          this.targetAnswer = cfg.answer;
        } 
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

  private async collectFruit(fruit: Phaser.Physics.Arcade.Sprite) {
    const val = (fruit as any).fruitValue;
    const { x, y } = fruit;
    fruit.destroy();
    createSparkle(this, x, y);
    bounce(this, this.basket);

    this.currentSum += val;
    this.ui.sumText.setText("Current: " + this.currentSum);

    if (this.currentSum === this.targetAnswer) {
      console.log("\n🎯 LEVEL COMPLETED!");
      console.log("═══════════════════════════════════════");
      console.log("Level Info:");
      console.log("  Category:", this.currentCategoryId);
      console.log("  Level in Category:", this.currentLevelInCategory);
      console.log("  Global Level:", this.currentLevel);
      console.log("═══════════════════════════════════════\n");

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
            const categoryIndex = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"].indexOf(this.currentCategoryId);
            const nextGlobalLevel = (categoryIndex * 15) + (this.currentLevelInCategory + 1);
            
            console.log("\n🔄 SCENE RESTART");
            console.log("  Next Global Level:", nextGlobalLevel);
            console.log("  Score:", this.score);
            
            this.scene.restart({ 
              score: this.score, 
              level: nextGlobalLevel 
            });
          } else {
            console.log("\n🏁 Category complete! Returning to map...");
            window.location.href = "/MagicTree";
          }
        }
      );
    } else if (this.currentSum > this.targetAnswer || this.currentSum < 0) {
      console.log("\n❌ GAME OVER - Wrong answer");
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
      const progress = await getAllMagicTreeProgress(uid);
      console.log("📥 Fetched category progress:", progress);
      return progress;
    } catch (error) {
      console.error("Error fetching category progress:", error);
      return { BASIC: 1, NORMAL: 1, HARD: 1, ADVANCED: 1, EXPERT: 1 };
    }
  }

  // ✅ ENHANCED: Unlock next level with maximum debugging
  private async unlockNextLevel() {
    if (!this.userId) {
      console.error("❌ unlockNextLevel: No userId!");
      return;
    }

    // 🔒 LOCK: Prevent multiple calls
    if ((this as any)._unlocking) {
      console.warn("⚠️ Already unlocking, skipping duplicate call");
      return;
    }
    (this as any)._unlocking = true;

    const completedLevel = this.currentLevelInCategory;
    const nextLevelToUnlock = completedLevel + 1;

    console.log("\n\n");
    console.log("╔═══════════════════════════════════════════════════════╗");
    console.log("║              🔓 UNLOCK NEXT LEVEL - START             ║");
    console.log("╚═══════════════════════════════════════════════════════╝");
    console.log("");
    console.log("📋 CURRENT STATE:");
    console.log("   userId:", this.userId);
    console.log("   currentCategoryId:", this.currentCategoryId);
    console.log("   currentLevelInCategory:", this.currentLevelInCategory);
    console.log("   completedLevel:", completedLevel);
    console.log("   nextLevelToUnlock:", nextLevelToUnlock);
    console.log("   currentLevel (global):", this.currentLevel);
    console.log("");

    try {
      // Step 0: Check current progress BEFORE saving
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📊 STEP 0: Get current progress (BEFORE save)");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      const progressBefore = await getAllMagicTreeProgress(this.userId);
      console.log("   Progress BEFORE save:", JSON.stringify(progressBefore, null, 2));
      const currentUnlockedBefore = progressBefore[this.currentCategoryId] || 0;
      console.log(`   Current unlocked for ${this.currentCategoryId} BEFORE: ${currentUnlockedBefore}`);
      console.log("");

      // Step 1: Calculate what to save
      const valueToSave = Math.max(currentUnlockedBefore, nextLevelToUnlock);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📝 STEP 1: Calculate value to save");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("   currentUnlockedBefore:", currentUnlockedBefore);
      console.log("   nextLevelToUnlock:", nextLevelToUnlock);
      console.log("   valueToSave:", valueToSave);
      console.log("   (using Math.max to never go backwards)");
      console.log("");

      // Step 2: Save to backend
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("💾 STEP 2: Save to backend");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`   Calling: saveMagicTreeLevel(${this.userId}, "${this.currentCategoryId}", ${valueToSave})`);
      console.log("   ⏳ Waiting for backend response...");
      
      const saveResult = await saveMagicTreeLevel(
        this.userId,
        this.currentCategoryId,
        valueToSave
      );

      console.log("   ✅ Backend response received!");
      console.log("   Response:", JSON.stringify(saveResult, null, 2));
      console.log("");

      // Step 3: Wait for DB to settle
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("⏳ STEP 3: Wait for database to settle");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("   Waiting 1000ms...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("   ✅ Wait complete");
      console.log("");

      // Step 4: Re-fetch to confirm
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔄 STEP 4: Re-fetch progress (AFTER save)");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      this.categoryProgress = await getAllMagicTreeProgress(this.userId);
      console.log("   Progress AFTER save:", JSON.stringify(this.categoryProgress, null, 2));
      console.log("");

      // Step 5: Verify the save worked
      const verifyUnlocked = this.categoryProgress[this.currentCategoryId];
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔍 STEP 5: Verification");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`   Expected value:  ${valueToSave}`);
      console.log(`   Actual value:    ${verifyUnlocked}`);
      console.log(`   Match: ${verifyUnlocked >= valueToSave ? '✅ YES' : '❌ NO'}`);
      console.log("");

      if (verifyUnlocked >= valueToSave) {
        console.log("   🎉 Verification PASSED - Value saved correctly!");
      } else {
        console.error("   ⚠️ Verification FAILED - Value NOT saved correctly!");
        console.error("   This indicates a BACKEND ISSUE.");
        console.error("");
        console.error("   🔄 ATTEMPTING RETRY...");
        console.error("   Calling saveMagicTreeLevel again...");
        
        const retryResult = await saveMagicTreeLevel(this.userId, this.currentCategoryId, valueToSave);
        console.error("   Retry response:", JSON.stringify(retryResult, null, 2));
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.categoryProgress = await getAllMagicTreeProgress(this.userId);
        console.error("   After retry:", JSON.stringify(this.categoryProgress, null, 2));
      }
      console.log("");

      // Step 6: Notify map
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📢 STEP 6: Notify map");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      window.dispatchEvent(new CustomEvent("levels:updated", {
        detail: { 
          category: this.currentCategoryId, 
          level: valueToSave 
        }
      }));
      console.log(`   ✅ Event dispatched: levels:updated with ${this.currentCategoryId} = ${valueToSave}`);
      console.log("");

      console.log("╔═══════════════════════════════════════════════════════╗");
      console.log("║            🎉 UNLOCK SEQUENCE COMPLETE! ✨            ║");
      console.log("╚═══════════════════════════════════════════════════════╝");
      console.log("\n\n");

    } catch (error) {
      console.log("");
      console.log("╔═══════════════════════════════════════════════════════╗");
      console.log("║                ❌ UNLOCK FAILED!                      ║");
      console.log("╚═══════════════════════════════════════════════════════╝");
      console.error("Error:", error);
      if (error instanceof Error) {
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
      }
      console.log("\n\n");
    } finally {
      // 🔓 UNLOCK: Allow future calls
      (this as any)._unlocking = false;
    }
  }
}