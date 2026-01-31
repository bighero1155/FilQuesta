// HumanBodyScene.ts
import Phaser from "phaser";
import { updateUserProgress, getUserProfile } from "../services/userService";
import { saveCategoryLevel, getAllCategoryProgress, hasCompletedAnyLevelOne } from "../services/levelService";
import { logPageVisit, logGameOver } from "../services/pageVisitService";
import { LevelConfig, getLevelConfig } from "./HumanBodyLevels";
import Congratulations from "./Congratulations"; 
import Instruction from "./Instruction"; 
import GameOver from "./GameOver";
import HumanSceneButtons from "./buttons";

type BodyPart = {
  name: string;
  correctX: number;
  correctY: number;
  placed: boolean;
  text?: Phaser.GameObjects.Text;
  descriptionText?: Phaser.GameObjects.Text;
  colorCircle?: Phaser.GameObjects.Graphics; 
  image?: Phaser.Physics.Arcade.Image;
  targetCircle: Phaser.GameObjects.Graphics;
  color: number;
  description: string;
};

const SCENE_KEY = "HumanBodyScene";
const HUMANBODY_CATEGORIES = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"];

export default class HumanBodyScene extends Phaser.Scene {
  private bodyParts: BodyPart[] = [];
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private buttonManager!: HumanSceneButtons;
  private backButton!: Phaser.GameObjects.Text;
  private backCircle!: Phaser.GameObjects.Graphics;
  private shadowCircle!: Phaser.GameObjects.Graphics;

  private score = 0;
  private timeLeft = 60;
  private gameTimer?: Phaser.Time.TimerEvent;
  private gameStarted = false;

  private level!: LevelConfig;
  private snapRadius = 40;
  private scorePerPart = 1;

  private userId: number | null = null;
  
  // Category-based tracking
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

  // Analytics tracking
  private sceneStartTime: number = 0;
  private hasLoggedVisit: boolean = false;

  constructor() {
    super(SCENE_KEY);
  }

  // Helper method to check if mobile
  private isMobile(): boolean {
    return this.scale.width < 768;
  }

  // Get category display name with emoji
  private getCategoryDisplayName(): string {
    const categoryEmojis: Record<string, string> = {
      BASIC: "🟢 BASIC",
      NORMAL: "🔵 NORMAL",
      HARD: "🔴 HARD",
      ADVANCED: "🟠 ADVANCED",
      EXPERT: "💀 EXPERT"
    };
    return categoryEmojis[this.currentCategoryId] || this.currentCategoryId;
  }

  // Get background image based on category
  private getBackgroundImage(): string {
    if (this.currentCategoryId === "BASIC" || this.currentCategoryId === "NORMAL") {
      return "/assets/human5.png";
    } else if (this.currentCategoryId === "HARD") {
      return "/assets/skeleton.png";
    } else if (this.currentCategoryId === "ADVANCED" || this.currentCategoryId === "EXPERT") {
      return "/assets/humanorgans.png";
    }
    return "/assets/human5.png"; // Default fallback
  }

  init(data: { levelId?: number }) {
    this.userId = this.getUserId();
    if (!this.userId) {
      alert("❌ User not found! Please log in again.");
      window.location.href = "/landing";
      return;
    }

    // Get level from URL or data
    const urlParams = new URLSearchParams(window.location.search);
    const levelParam = urlParams.get("level");
    const categoryParam = urlParams.get("category");
    
    let startLevel = data?.levelId ?? null;
    
    if (levelParam !== null) {
      const parsed = Number(levelParam);
      if (!Number.isNaN(parsed)) startLevel = parsed + 1;
    }

    this.currentLevel = startLevel ?? 1;
    
    // Extract category and level from URL or calculate from global level
    if (categoryParam) {
      this.currentCategoryId = categoryParam;
      // Calculate level within category from global level
      const categoryIndex = HUMANBODY_CATEGORIES.indexOf(categoryParam);
      this.currentLevelInCategory = this.currentLevel - (categoryIndex * 15);
    } else {
      // Calculate category and level from global level number
      this.calculateCategoryFromGlobalLevel(this.currentLevel);
    }

    // Load level config HERE (synchronously) before preload runs
    this.level = getLevelConfig(this.currentLevel);
    this.snapRadius = this.level.snapRadius;
    this.scorePerPart = this.level.scorePerPart;

    // Initialize analytics tracking
    this.sceneStartTime = Date.now();
    this.hasLoggedVisit = false;
  }

  // Calculate category and level from global level number
  private calculateCategoryFromGlobalLevel(globalLevel: number) {
    const categoryIndex = Math.floor((globalLevel - 1) / 15);
    const levelInCategory = ((globalLevel - 1) % 15) + 1;
    
    this.currentCategoryId = HUMANBODY_CATEGORIES[categoryIndex] || "BASIC";
    this.currentLevelInCategory = levelInCategory;
  }

  preload() {
    const backgroundImage = this.getBackgroundImage();
    this.load.image("body", backgroundImage);
    
    // Dynamically load only the assets needed for this level using imagePath
    const requiredAssets = new Set<string>();
    
    // Get all asset keys and paths from the current level's parts
    this.level.parts.forEach(part => {
      if (!requiredAssets.has(part.assetKey)) {
        requiredAssets.add(part.assetKey);
        // Load using the explicit imagePath from the level config
        this.load.image(part.assetKey, part.imagePath);
      }
    });
  }

  async create() {
    // Fetch category progress (async)
    try {
      this.categoryProgress = await getAllCategoryProgress(this.userId!, "HumanBody", HUMANBODY_CATEGORIES);
    } catch {
      this.categoryProgress = { BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0 };
    }

    // Check if level is unlocked
    const unlockedInCategory = this.categoryProgress[this.currentCategoryId] || 0;
    const hasCompletedAnyLevel1 = await hasCompletedAnyLevelOne(this.userId!, "HumanBody", HUMANBODY_CATEGORIES);
    
    if (this.currentLevelInCategory === 1) {
      // Level 1: Must have completed any Level 1, OR this is first play ever
      const totalProgress = Object.values(this.categoryProgress).reduce((sum, val) => sum + val, 0);
      if (!hasCompletedAnyLevel1 && totalProgress > 0) {
        alert("🚫 Complete any Level 1 first to unlock all Level 1s!");
        window.location.href = "/HumanBody";
        return;
      }
    } else {
      // Levels 2-15: Must have completed previous level in THIS category
      if (this.currentLevelInCategory > unlockedInCategory) {
        alert(`🚫 Complete ${this.currentCategoryId} Level ${this.currentLevelInCategory - 1} first!`);
        window.location.href = "/HumanBody";
        return;
      }
    }

    // Now continue with game setup
    this.timeLeft = this.level.time;
    this.score = 0;
    this.bodyParts = [];
    this.gameStarted = false;

    this.scale.resize(window.innerWidth, window.innerHeight);
    this.scale.on("resize", this.handleResize, this);

    const isMobile = this.isMobile();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.physics.world.gravity.y = 300;
    
    // Set ground height - adjust groundHeight to make ground higher/lower
    const groundHeight = 50; // Distance from bottom of screen
    this.physics.world.setBounds(
      0, 
      0, 
      this.cameras.main.width, 
      this.cameras.main.height - groundHeight  // Makes ground higher
    );
    
    this.input.setTopOnly(true);
    this.cameras.main.setBackgroundColor("#8fceed");
    
    // Create animated background
    this.createAnimatedBackground();
    
    // Mobile vs Desktop body image scale
    const bodyScaleX = isMobile ? 1.8 : 2.0;
    const bodyScaleY = isMobile ? 1.1 : 1.4;  
    this.add.image(centerX, centerY, "body").setScale(bodyScaleX, bodyScaleY).setAlpha(1.3);

    // Mobile vs Desktop score text
    const scoreFontSize = isMobile ? "20px" : "28px";
    const scorePadding = isMobile ? { x: 10, y: 6 } : { x: 16, y: 8 };
    
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: scoreFontSize,
      fontStyle: "bold",
      color: "#003344",
      backgroundColor: "#aaffffcc",
      padding: scorePadding,
    });

    // Mobile vs Desktop timer text
    const timerX = isMobile ? this.cameras.main.width - 130 : this.cameras.main.width - 175;
    this.timerText = this.add.text(timerX, 20, `Time: ${this.timeLeft}`, {
      fontSize: scoreFontSize,
      fontStyle: "bold",
      color: "#333300",
      backgroundColor: "#ffffaa",
      padding: scorePadding,
    });

    // Level info text (placed under timer)
    const levelInfoFontSize = isMobile ? "16px" : "22px";
    const levelInfoY = isMobile ? 55 : 18; // Position below timer
    const levelInfoX = isMobile ? this.cameras.main.width - 130 : this.cameras.main.width - 350;
    
    this.add.text(
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
        lineSpacing: isMobile ? 2 : 4,
      }
    );

    // Mobile vs Desktop back button - IMPROVED ROUND VERSION
    const backButtonSize = isMobile ? 70 : 80; // Circle diameter
    const backY = isMobile ? this.scale.height - 95 : this.scale.height - 50;
    const backX = 10 + (backButtonSize / 2); // Center the circle properly

    // Create shadow effect
    this.shadowCircle = this.add.graphics();
    this.shadowCircle.fillStyle(0x000000, 0.2);
    this.shadowCircle.fillCircle(backX + 2, backY + 2, backButtonSize / 2);
    this.shadowCircle.setDepth(9998);

    // Create circular background
    this.backCircle = this.add.graphics();
    this.backCircle.fillStyle(0xff6b6b, 1);
    this.backCircle.fillCircle(backX, backY, backButtonSize / 2);
    this.backCircle.setDepth(9999);
    this.backCircle.setInteractive(
      new Phaser.Geom.Circle(backX, backY, backButtonSize / 2),
      Phaser.Geom.Circle.Contains
    );

    // Create sharp text with stroke
    const backFontSize = isMobile ? "24px" : "28px";
    this.backButton = this.add
      .text(backX, backY, "QUIT", {
        fontSize: backFontSize,
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#cc0000", // Sharp red outline
        strokeThickness: 3, // Thickness of the outline
      })
      .setOrigin(0.5, 0.5) // Center the text in the circle
      .setDepth(10000);

    // Interactive states
    this.backCircle.on("pointerover", () => {
      this.backCircle.clear();
      this.backCircle.fillStyle(0xff5252, 1); // Lighter red on hover
      this.backCircle.fillCircle(backX, backY, backButtonSize / 2);
      this.backButton.setScale(1.1);
    });

    this.backCircle.on("pointerout", () => {
      this.backCircle.clear();
      this.backCircle.fillStyle(0xff6b6b, 1); // Original red
      this.backCircle.fillCircle(backX, backY, backButtonSize / 2);
      this.backButton.setScale(1);
    });

    this.backCircle.on("pointerdown", () => {
      this.backCircle.clear();
      this.backCircle.fillStyle(0xcc0000, 1); // Darker red on click
      this.backCircle.fillCircle(backX, backY, backButtonSize / 2);
      this.backButton.setScale(0.95);
    });

    this.backCircle.on("pointerup", async () => {
      this.backCircle.clear();
      this.backCircle.fillStyle(0xff6b6b, 1); // Back to original
      this.backCircle.fillCircle(backX, backY, backButtonSize / 2);
      this.backButton.setScale(1);
      
      const result = confirm("Do you want to exit the game?");
      if (result) {
        await this.logVisitBeforeExit();
        window.location.href = "/humanbodymap";
      }
    });

    // Initialize button manager
    this.buttonManager = new HumanSceneButtons(this);
    this.buttonManager.createButtons(centerX, centerY, {
      onRestart: async () => {
        await this.logVisitBeforeExit();
        if (this.gameTimer) this.gameTimer.remove(false);
        this.scene.restart({ levelId: this.currentLevel });
      },
      onNextLevel: async () => {
        await this.logVisitBeforeExit();
        const hasNextLevel = this.currentLevelInCategory < 15;
        
        if (hasNextLevel) {
          // Go to next level in same category
          const nextGlobalLevel = this.currentLevel + 1;
          const nextCategoryId = this.currentCategoryId;
          window.location.href = `/body-systems?level=${nextGlobalLevel - 1}&category=${nextCategoryId}`;
        } else {
          // Completed all levels in category, return to map
          window.location.href = "/humanbodymap";
        }
      },
    });

    const seenInstructions = localStorage.getItem("humanBodyInstructionsSeen");
    if (!seenInstructions) {
      const instructions = new Instruction(this);
      instructions.show(() => {
        localStorage.setItem("humanBodyInstructionsSeen", "true");
        this.startGame(centerX, centerY);
      });
    } else {
      this.startGame(centerX, centerY);
    }

    // Log page visit when scene is created
    this.logInitialVisit();
  }

  // Create animated background with floating medical icons
  private createAnimatedBackground() {
    const { width, height } = this.cameras.main;

    // Medical icons to float around
    const medicalIcons = ["🫀", "🧠", "🫁", "🩺", "💊", "🏥", "⚕️", "🔬"];
    
    // Create floating medical icons
    for (let i = 0; i < 8; i++) {
      const icon = medicalIcons[i % medicalIcons.length];
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      
      const iconText = this.add.text(x, y, icon, {
        fontSize: this.isMobile() ? "32px" : "48px",
      })
      .setOrigin(0.5)
      .setAlpha(0.15)
      .setDepth(-1);

      // Floating animation
      this.tweens.add({
        targets: iconText,
        y: y - 30,
        duration: Phaser.Math.Between(4000, 6000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 500,
      });

      // Horizontal drift
      this.tweens.add({
        targets: iconText,
        x: x + Phaser.Math.Between(-20, 20),
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 300,
      });

      // Rotation
      this.tweens.add({
        targets: iconText,
        angle: Phaser.Math.Between(-10, 10),
        duration: Phaser.Math.Between(5000, 7000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 400,
      });
    }

    // Create pulsing circles for depth
    const circleColors = [0xffffff, 0x87CEEB, 0xADD8E6];
    
    for (let i = 0; i < 3; i++) {
      const circle = this.add.graphics();
      const radius = Phaser.Math.Between(100, 200);
      const x = i === 0 ? -50 : i === 1 ? width + 50 : width / 2;
      const y = i === 0 ? -50 : i === 1 ? height + 50 : height / 2;
      
      circle.fillStyle(circleColors[i], 0.05);
      circle.fillCircle(x, y, radius);
      circle.setDepth(-2);

      // Pulsing animation
      this.tweens.add({
        targets: circle,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 0.1,
        duration: Phaser.Math.Between(4000, 6000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 1000,
      });
    }

    // Add subtle medical cross patterns
    for (let i = 0; i < 12; i++) {
      const crossX = Phaser.Math.Between(0, width);
      const crossY = Phaser.Math.Between(0, height);
      
      const cross = this.add.graphics();
      cross.fillStyle(0xffffff, 0.08);
      cross.fillRect(crossX - 15, crossY - 2, 30, 4);
      cross.fillRect(crossX - 2, crossY - 15, 4, 30);
      cross.setDepth(-1);

      // Fade in/out animation
      this.tweens.add({
        targets: cross,
        alpha: 0.15,
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 400,
      });
    }
  }

  // ---------- Analytics Methods ----------
  private async logInitialVisit() {
    if (!this.userId || this.hasLoggedVisit) return;
    
    try {
      await logPageVisit(this.userId, SCENE_KEY, 0);
      this.hasLoggedVisit = true;
    } catch (error) {
      console.error("Failed to log initial visit:", error);
    }
  }

  private async logVisitBeforeExit() {
    if (!this.userId) return;

    const timeSpentSeconds = Math.floor((Date.now() - this.sceneStartTime) / 1000);
    
    try {
      await logPageVisit(this.userId, SCENE_KEY, timeSpentSeconds);
    } catch (error) {
      console.error("Failed to log visit before exit:", error);
    }
  }

  private async logGameOverEvent() {
    if (!this.userId) return;

    try {
      await logGameOver(this.userId, SCENE_KEY);
    } catch (error) {
      console.error("Failed to log game over:", error);
    }
  }

  // ---------- Gameplay ----------
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

  private startGame(centerX: number, centerY: number) {
    if (this.gameStarted) return;
    this.gameStarted = true;

    const isMobile = this.isMobile();
    const colors = [0xff3366, 0x33cc99, 0x3399ff, 0xffcc00, 0x00cccc, 0xcc66ff];
    const parts = this.level.parts;

    this.bodyParts = parts.map((p, index) => {
      const color = colors[index % colors.length];
      
      // Use mobile or desktop coordinates based on screen size
      const targetX = centerX + (isMobile ? p.mobileX : p.x);
      const targetY = centerY + (isMobile ? p.mobileY : p.y);
      
      // Draw target circle at the appropriate position
      const circle = this.add.graphics();
      circle.fillStyle(0xffffff, 0.6);
      circle.fillCircle(targetX, targetY, 30);

      const part: BodyPart = {
        name: p.name,
        correctX: targetX,
        correctY: targetY,
        placed: false,
        targetCircle: circle,
        color,
        description: p.description,
      };

      this.createImagePart(part, p.assetKey, index, p.scale);
      return part;
    });

    this.gameTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.updateTimer,
      callbackScope: this,
    });
  }

  private createImagePart(part: BodyPart, key: string, index: number, scale: number) {
    const isMobile = this.isMobile();
    
    let x: number;
    let y: number;
    
    // Single item - place it centered on the left side
    if (this.level.parts.length === 1) {
      const startX = isMobile ? 80 : 100;
      x = startX;
      y = this.cameras.main.height / 2;
    } else {
      // Multiple items - use vertical list layout
      const startX = isMobile ? 60 : 80;
      const startY = isMobile ? 100 : 100;
      const spacing = isMobile ? 70 : 90;
      
      x = startX;
      y = startY + index * spacing;
    }
    
    // Mobile vs Desktop organ scale
    const organScale = isMobile ? scale * 0.7 : scale;
    
    // Create glowing circle behind the image
    const glowCircle = this.add.graphics();
    glowCircle.setPosition(x, y);
    glowCircle.setDepth(-1);
    
    // Draw multiple circles for glow effect
    const glowRadius = isMobile ? 35 : 45;
    glowCircle.fillStyle(0xffffff, 0.3);
    glowCircle.fillCircle(0, 0, glowRadius);
    glowCircle.fillStyle(0xffff00, 0.2);
    glowCircle.fillCircle(0, 0, glowRadius - 5);
    glowCircle.fillStyle(0xffffff, 0.4);
    glowCircle.fillCircle(0, 0, glowRadius - 10);
    
    // Pulsing glow animation
    this.tweens.add({
      targets: glowCircle,
      alpha: 0.6,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    
    const image = this.physics.add.image(x, y, key).setScale(organScale);
    image.setInteractive({ draggable: true, useHandCursor: true });
    (image.body as Phaser.Physics.Arcade.Body).setBounce(0.4);
    (image.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    (image.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    part.image = image;

    // Mobile vs Desktop label positioning
    const labelX = isMobile ? this.cameras.main.width - 160 : this.cameras.main.width - 280;
    const labelY = y;

    // Mobile vs Desktop circle size
    const circleRadius = isMobile ? 8 : 12;

    // Color circle indicator
    part.colorCircle = this.add.graphics();
    part.colorCircle.fillStyle(part.color);
    part.colorCircle.fillCircle(labelX, labelY + 10, circleRadius);

    // Mobile vs Desktop text sizes
    const nameFontSize = isMobile ? "14px" : "20px";
    const descFontSize = isMobile ? "11px" : "16px";
    const descWrapWidth = isMobile ? 130 : 240;
    const textOffsetX = isMobile ? 15 : 25;

    // Name text
    part.text = this.add.text(labelX + textOffsetX, labelY, part.name, {
      fontSize: nameFontSize,
      fontStyle: "bold",
      color: "#003344",
    });

    // Description text
    part.descriptionText = this.add.text(labelX + textOffsetX, labelY + 20, part.description, {
      fontSize: descFontSize,
      fontStyle: "bold",
      color: "#333333",
      wordWrap: { width: descWrapWidth },
    });
    
    // Hide color circle, name AND description on mobile initially
    if (isMobile) {
      part.colorCircle.setVisible(false);
      part.text.setVisible(false);
      part.descriptionText.setVisible(false);
    }

    const randomDelay = Phaser.Math.Between(0, 1000);
    const randomDuration = Phaser.Math.Between(500, 1000);

    this.tweens.add({
      targets: image,
      scaleX: organScale * 1.05,
      scaleY: organScale * 1.05,
      duration: randomDuration,
      delay: randomDelay,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    image.on("pointerdown", () => {
      this.tweens.add({
        targets: image,
        scale: organScale * 1.1,
        duration: 100,
        yoyo: true,
        ease: "Sine.easeInOut",
      });
    });

    image.on("dragstart", () => {
      (image.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      this.tweens.add({ targets: image, scale: organScale * 1.05, duration: 100, yoyo: true });
      
      // Hide glow when dragging starts
      glowCircle.setVisible(false);
      
      // Show color circle, name AND description when dragging on mobile
      if (isMobile && part.colorCircle && part.text && part.descriptionText) {
        part.colorCircle.setVisible(true);
        part.text.setVisible(true);
        part.descriptionText.setVisible(true);
      }
    });

    image.on("drag", (_: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      (image.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      image.setPosition(dragX, dragY);
      (image.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

      // Move glow circle with the dragged item (keep it hidden)
      glowCircle.setPosition(dragX, dragY);

      // Mobile vs Desktop label offset when dragging
      const labelOffsetX = isMobile ? 60 : 100;
      const labelOffsetY = isMobile ? -15 : -20;

      // Update label positions to follow the image
      if (part.colorCircle && part.text && part.descriptionText) {
        const newLabelX = dragX + labelOffsetX;
        const newLabelY = dragY + labelOffsetY;
        
        part.colorCircle.clear();
        part.colorCircle.fillStyle(part.color);
        part.colorCircle.fillCircle(newLabelX, newLabelY + 10, circleRadius);
        
        part.text.setPosition(newLabelX + textOffsetX, newLabelY);
        part.descriptionText.setPosition(newLabelX + textOffsetX, newLabelY + 20);
      }
    });

    image.on("dragend", (pointer: Phaser.Input.Pointer) => {
      if (part.placed) return;

      const dx = image.x - part.correctX;
      const dy = image.y - part.correctY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.snapRadius) {
        // Snap to correct position
        image.setPosition(part.correctX, part.correctY);
        (image.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        (image.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        image.disableInteractive();
        part.placed = true;
        this.score += this.scorePerPart;
        this.scoreText.setText(`Score: ${this.score}`);
        part.targetCircle.clear();
        part.targetCircle.fillStyle(part.color, 0.9);
        part.targetCircle.fillCircle(part.correctX, part.correctY, 30);

        // Destroy glow when placed correctly
        glowCircle.destroy();

        // Hide labels when placed correctly
        if (part.colorCircle && part.text && part.descriptionText) {
          part.colorCircle.setVisible(false);
          part.text.setVisible(false);
          part.descriptionText.setVisible(false);
        }

        this.checkWin();
      } else {
        const velocityX = (image.x - pointer.downX) * 2;
        const velocityY = (image.y - pointer.downY) * 2;
        (image.body as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
        (image.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);

        // Show glow again when item is not placed correctly
        glowCircle.setVisible(true);
        glowCircle.setPosition(x, y);

        // Reset labels
        if (part.colorCircle && part.text && part.descriptionText) {
          const resetLabelX = isMobile ? this.cameras.main.width - 160 : this.cameras.main.width - 280;
          const resetLabelY = y;
          
          part.colorCircle.clear();
          part.colorCircle.fillStyle(part.color);
          part.colorCircle.fillCircle(resetLabelX, resetLabelY + 10, circleRadius);
          
          part.text.setPosition(resetLabelX + textOffsetX, resetLabelY);
          part.descriptionText.setPosition(resetLabelX + textOffsetX, resetLabelY + 20);
          
          // Hide color circle, name AND description again when drag ends on mobile
          if (isMobile) {
            part.colorCircle.setVisible(false);
            part.text.setVisible(false);
            part.descriptionText.setVisible(false);
          }
        }
      }
    });
  }

  private updateTimer() {
    this.timeLeft--;
    this.timerText.setText("Time: " + this.timeLeft);
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      if (this.gameTimer) this.gameTimer.remove(false);
      this.endGame(false);
    }
  }

  private checkWin() {
    if (this.bodyParts.every((part) => part.placed)) {
      if (this.gameTimer) this.gameTimer.remove(false);
      this.endGame(true);
    }
  }

  private async endGame(success: boolean) {
    await this.logVisitBeforeExit();

    if (success) {
      // ✅ Update score first (same pattern as MagicTree)
      await this.addScore(this.score);
      
      // ✅ Then unlock next level (same pattern as MagicTree)
      await this.unlockNextLevel();
    } else {
      await this.logGameOverEvent();
    }

    this.bodyParts.forEach((part) => {
      part.text?.disableInteractive();
      part.image?.disableInteractive();
    });

    if (success) {
      const congrats = new Congratulations(this);
      congrats.show(() => {
        const showNextLevel = this.currentLevelInCategory < 15;
        this.buttonManager.showButtons(showNextLevel);
      });
    } else {
      const gameOver = new GameOver(this);
      gameOver.show(() => {
        if (this.gameTimer) this.gameTimer.remove(false);
        this.scene.restart({ levelId: this.currentLevel });
      });
    }
  }

  // ✅ WORKING - Same pattern as MagicTree's addScore
  private async addScore(points: number) {
    if (!this.userId) return;
    
    try {
      // Update score in backend
      await updateUserProgress(this.userId, points);
      
      // Refresh local user data
      const updated = await getUserProfile(this.userId);
      if (updated?.total_score !== undefined) {
        localStorage.setItem("totalScore", updated.total_score.toString());
      }
      
      console.log("✅ Score updated successfully");
    } catch (e) {
      console.error("❌ Error updating score:", e);
    }
  }

  // ✅ FIXED - Same exact pattern as MagicTree's unlockNextLevel
  private async unlockNextLevel() {
    if (!this.userId) return;

    const completedLevel = this.currentLevelInCategory;
    const nextLevel = completedLevel + 1;

    console.log(`🔓 Unlocking Level ${nextLevel} in ${this.currentCategoryId}`);

    try {
      // Save to backend (same way score is saved)
      await saveCategoryLevel(this.userId, "HumanBody", this.currentCategoryId, nextLevel);
      
      // Update local cache (same way score updates local)
      this.categoryProgress[this.currentCategoryId] = nextLevel;
      
      // Notify map to refresh
      window.dispatchEvent(new CustomEvent("levels:updated"));
      
      console.log(`✅ Level ${nextLevel} unlocked successfully`);
    } catch (e) {
      console.error("❌ Error unlocking level:", e);
    }
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    const { width, height } = gameSize;
    this.cameras.resize(width, height); 
  }

  shutdown() {
    this.logVisitBeforeExit();
  }
}