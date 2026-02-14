// src/HistoryPortal/HistoryPortalScene.ts - With Design System
import Phaser from "phaser";
import { HISTORY_LEVELS } from "./levels";
import { logPageVisit, logGameOver } from "../services/pageVisitService";
import { updateUserProgress, getUserProfile } from "../services/userService";
import { saveCategoryLevel, getAllCategoryProgress } from "../services/levelService";
import { 
  getTextStyle, 
  getCategoryTheme, 
  ANIMATIONS, 
  LAYOUT, 
  UI_COLORS,
  STAR_FIELD 
} from "./design";

const SCENE_KEY = "HistoryPortalScene";
const HISTORY_CATEGORIES = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"];

export default class HistoryPortalScene extends Phaser.Scene {
  private portalImage?: Phaser.GameObjects.Image;

  // ── BLUR EFFECT ──────────────────────────────────────────────────────────────
  // Two extra semi-transparent copies of the portal image are stacked on top.
  // Together they make the portal look frosted / blurred.
  // On first correct answer all three tweens fade them out simultaneously,
  // giving the player a satisfying "reveal" reward.
  private blurLayers: Phaser.GameObjects.GameObject[] = [];
  private portalRevealed = false;
  // ─────────────────────────────────────────────────────────────────────────────

  private currentLevelKey = "history-1";
  private items: Array<Phaser.GameObjects.Container> = [];
  private correctItemsPlaced = 0;
  private totalCorrectItems = 0;
  private gameEnded = false;
  private userId: number | null = null;
  private hintText?: Phaser.GameObjects.Text;
  private hintVisible = false;

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
  private score = 0;
  private scorePerCorrectItem = 10;

  constructor() {
    super(SCENE_KEY);
  }

  // Get category display name with emoji
  private getCategoryDisplayName(): string {
    const theme = getCategoryTheme(this.currentCategoryId);
    return `${theme.emoji} ${theme.displayName}`;
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

  // Calculate category and level from global level number
  private calculateCategoryFromGlobalLevel(globalLevel: number) {
    const categoryIndex = Math.floor((globalLevel - 1) / 15);
    const levelInCategory = ((globalLevel - 1) % 15) + 1;
    
    this.currentCategoryId = HISTORY_CATEGORIES[categoryIndex] || "BASIC";
    this.currentLevelInCategory = levelInCategory;
  }

  // ✅ NEW: Fisher-Yates shuffle — returns a new shuffled copy of the array
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  init(data?: { levelId?: number }) {
    console.log("🎯 INIT - Data received:", data);
    
    this.userId = this.getUserId();
    if (!this.userId) {
      alert("❌ User not found! Please log in again.");
      window.location.href = "/landing";
      return;
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
    
    // Extract category and level from URL or calculate from global level
    if (categoryParam) {
      this.currentCategoryId = categoryParam;
      // Calculate level within category from global level
      const categoryIndex = HISTORY_CATEGORIES.indexOf(categoryParam);
      this.currentLevelInCategory = this.currentLevel - (categoryIndex * 15);
    } else {
      // Calculate category and level from global level number
      this.calculateCategoryFromGlobalLevel(this.currentLevel);
    }

    // Derive the level key from currentLevel (replaces the old levelKey path)
    const keys = Object.keys(HISTORY_LEVELS);
    this.currentLevelKey = keys[this.currentLevel - 1] || "history-1";
    
    console.log("📌 Current level key:", this.currentLevelKey);
    console.log("📊 Category:", this.currentCategoryId, "Level:", this.currentLevelInCategory);
    
    // Initialize analytics tracking
    this.sceneStartTime = Date.now();
    this.hasLoggedVisit = false;

    // Reset blur state on every init (covers restarts too)
    this.blurLayers = [];
    this.portalRevealed = false;
  }

  preload() {
    console.log("🔄 PRELOAD STARTED");
    
    const level = HISTORY_LEVELS[this.currentLevelKey];
    console.log("📚 Level data:", level);
    
    if (!level) {
      console.error("❌ Level not found:", this.currentLevelKey);
      return;
    }
    
    if (!level.portal_image) {
      console.warn("⚠️ No portal_image defined for this level");
      return;
    }
    
    console.log("📸 Loading portal image:", level.portal_image);
    
    this.load.on('filecomplete', (key: string) => {
      console.log('✅ LOADED:', key);
    });
    
    this.load.on('loaderror', (file: any) => {
      console.error('❌ FAILED:', file.key, file.src);
    });
    
    this.load.image("portal-image", level.portal_image);
  }

  async create() {
    console.log("🎮 CREATE STARTED");
    
    const { width, height } = this.scale;
    console.log("📏 Canvas:", width, "x", height);
    
    const level = HISTORY_LEVELS[this.currentLevelKey];
    
    // Mobile detection
    const isMobile = width < 768;
    const isPortrait = height > width;
    
    // Background
    const theme = getCategoryTheme(this.currentCategoryId);
    this.cameras.main.setBackgroundColor(theme.background);

    // Fetch category progress (async)
    try {
      this.categoryProgress = await getAllCategoryProgress(this.userId!, "History", HISTORY_CATEGORIES);
    } catch {
      this.categoryProgress = { BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0 };
    }

    // ✅ Level 1 is ALWAYS playable
    // ✅ Levels 2-15: Must complete previous level in THIS category
    const unlockedInCategory = this.categoryProgress[this.currentCategoryId] || 0;
    
    if (this.currentLevelInCategory > 1 && this.currentLevelInCategory > unlockedInCategory) {
      alert(`🚫 Complete ${this.currentCategoryId} Level ${this.currentLevelInCategory - 1} first!`);
      window.location.href = "/historymap";
      return;
    }
    
    // Stars
    for (let i = 0; i < STAR_FIELD.count; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(STAR_FIELD.sizeMin, STAR_FIELD.sizeMax);
      this.add.circle(x, y, size, 0xffffff, STAR_FIELD.opacity);
    }
    
    // Get layout for current device
    const layout = isMobile 
      ? (isPortrait ? LAYOUT.mobilePortrait : LAYOUT.mobile) 
      : LAYOUT.desktop;
    
    // TITLE with category and level
    const titleStyle = getTextStyle('title', isMobile, isPortrait);
    const titleText = `${this.getCategoryDisplayName()} - Level ${this.currentLevelInCategory}\n${level.title}`;
    
    this.add.text(width / 2, layout.titleY, titleText, {
      ...titleStyle,
      wordWrap: { width: width * 0.9 }
    }).setOrigin(0.5).setDepth(10);
    
    // Question
    const questionStyle = getTextStyle('question', isMobile, isPortrait);
    
    this.add.text(width / 2, layout.questionY, level.question, {
      ...questionStyle,
      wordWrap: { width: width * 0.85 }
    }).setOrigin(0.5).setDepth(10);

    // BACK TO MAP button at the top
    const backBtnY = isMobile ? (isPortrait ? 600 : 15) : 20;
    const backBtnStyle = getTextStyle('backButton', isMobile, isPortrait);
    const backBtn = this.add.text(width - (isMobile ? 120 : 30), backBtnY, "BACK TO MAP", backBtnStyle)
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    
    backBtn.on("pointerdown", async () => {
      await this.logVisitBeforeExit();
      window.location.href = "/historymap";
    });

    if (!isMobile) {
      backBtn.on("pointerover", () => {
        this.tweens.add({ 
          targets: backBtn, 
          scale: 1.05, 
          duration: ANIMATIONS.buttonHover.duration 
        });
      });

      backBtn.on("pointerout", () => {
        this.tweens.add({ 
          targets: backBtn, 
          scale: 1, 
          duration: ANIMATIONS.buttonHover.duration 
        });
      });
    }

    // HINT BUTTON - Click to show/hide hint
    if (level.hint) {
      const hintButtonStyle = getTextStyle('hintButton', isMobile, isPortrait);
      
      const hintButton = this.add.text(
        width / 2,
        layout.hintButtonY,
        "💡 Hint",
        hintButtonStyle
      )
        .setOrigin(0.5)
        .setDepth(10)
        .setInteractive({ useHandCursor: true });

      const hintTextY = layout.hintButtonY + 50;
      const hintTextStyle = getTextStyle('hintText', isMobile, isPortrait);
      
      this.hintText = this.add.text(
        width / 2,
        hintTextY,
        level.hint,
        {
          ...hintTextStyle,
          wordWrap: { width: width * 0.85 }
        }
      )
        .setOrigin(0.5)
        .setDepth(10)
        .setAlpha(0);

      hintButton.on("pointerdown", () => {
        this.hintVisible = !this.hintVisible;
        
        if (this.hintVisible) {
          this.tweens.add({
            targets: this.hintText,
            alpha: 1,
            y: hintTextY,
            duration: ANIMATIONS.hintReveal.duration,
            ease: ANIMATIONS.hintReveal.ease
          });
        } else {
          this.tweens.add({
            targets: this.hintText,
            alpha: 0,
            y: hintTextY - 10,
            duration: ANIMATIONS.hintHide.duration,
            ease: ANIMATIONS.hintHide.ease
          });
        }
      });

      if (!isMobile) {
        hintButton.on("pointerover", () => {
          this.tweens.add({ 
            targets: hintButton, 
            scale: 1.15, 
            duration: ANIMATIONS.buttonHover.duration 
          });
        });

        hintButton.on("pointerout", () => {
          this.tweens.add({ 
            targets: hintButton, 
            scale: 1, 
            duration: ANIMATIONS.buttonHover.duration 
          });
        });
      }
    }
    
    // ── PORTAL IMAGE + BLUR LAYERS ────────────────────────────────────────────
    const textureExists = this.textures.exists("portal-image");
    console.log("🖼️ Texture exists?", textureExists);
    
    let portalX: number, portalY: number, portalSize: number;
    
    if (isMobile) {
      if (isPortrait) {
        portalX = width / 2;
        portalY = height * 0.25;
        portalSize = 200;
      } else {
        portalX = width * 0.75;
        portalY = height * 0.4;
        portalSize = 250;
      }
    } else {
      portalX = width * 0.7;
      portalY = height / 2;
      portalSize = 400;
    }
    
    if (textureExists) {
      console.log("✅ Creating portal image...");
      
      // Base portal image (fully visible at all times)
      this.portalImage = this.add.image(portalX, portalY, "portal-image");
      this.portalImage.setDisplaySize(portalSize, portalSize);
      this.portalImage.setDepth(5);

      // ── Fake-blur overlay layers ─────────────────────────────────────────
      // All layers sit at depth 6-8, BELOW items (depth 15).
      // Heavier alphas + wider offsets = stronger blur illusion.

      // Layer 1: white wash — kills colour clarity
      const blurBase = this.add.image(portalX, portalY, "portal-image")
        .setDisplaySize(portalSize, portalSize)
        .setTint(0xffffff)
        .setAlpha(0.75)
        .setDepth(6);

      // Layer 2-3: wide offset copies — strong double-vision blur
      const blurOffset1 = this.add.image(portalX + 7, portalY + 7, "portal-image")
        .setDisplaySize(portalSize, portalSize)
        .setAlpha(0.50)
        .setDepth(7);

      const blurOffset2 = this.add.image(portalX - 7, portalY - 7, "portal-image")
        .setDisplaySize(portalSize, portalSize)
        .setAlpha(0.50)
        .setDepth(7);

      // Layer 4: dark overlay — makes image unreadable
      const blurHeavy = this.add.image(portalX, portalY, "portal-image")
        .setDisplaySize(portalSize, portalSize)
        .setTint(0x111133)
        .setAlpha(0.70)
        .setDepth(8);

      this.blurLayers = [blurBase, blurOffset1, blurOffset2, blurHeavy];

      // Add a "?" label on the blurred portal so the intent is clear
      // alpha must be set via .setAlpha(), not inside TextStyle
      const blurLabel = this.add.text(portalX, portalY, "?", {
        fontSize: isMobile ? "48px" : "80px",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 6,
      })
        .setOrigin(0.5)
        .setDepth(9)    // above all blur layers (6-8), below items (15)
        .setAlpha(0.9);

      // Keep a direct reference so revealPortal() can tween it out
      this.blurLayers.push(blurLabel);
      
      console.log("✅ Portal image + blur layers created!");
    } else {
      console.error("❌ Portal image texture not found!");
    }
    // ─────────────────────────────────────────────────────────────────────────
    
    // Calculate total correct items
    this.totalCorrectItems = level.items.filter((item: any) => item.is_correct).length;
    this.correctItemsPlaced = 0;
    this.gameEnded = false;
    this.items = [];
    this.score = 0;

    // Build grid slot positions
    let startY: number, startX: number, spacingX: number, spacingY: number;
    let itemWidth: number, itemHeight: number;
    
    if (isMobile) {
      if (isPortrait) {
        startY = height * 0.5;
        startX = width * 0.25;
        spacingX = width * 0.5;
        spacingY = 80;
        itemWidth = width * 0.4;
        itemHeight = 50;
      } else {
        startY = height * 0.28;
        startX = width * 0.1;
        spacingX = width * 0.35;
        spacingY = 70;
        itemWidth = width * 0.25;
        itemHeight = 50;
      }
    } else {
      startY = 300;
      startX = 200;
      spacingX = width * 0.23;
      spacingY = 150;
      itemWidth = 300;
      itemHeight = 60;
    }

    // Pre-build the ordered grid slot coordinates
    const slots = level.items.map((_: any, i: number) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      return {
        x: startX + col * spacingX,
        y: startY + row * spacingY,
      };
    });

    // ✅ Shuffle only the items, keeping slots in place
    const shuffledItems = this.shuffleArray(level.items);

    const itemStyle = getTextStyle('itemButton', isMobile, isPortrait);

    // Log initial visit
    this.logInitialVisit();
    
    shuffledItems.forEach((item: any, i: number) => {
      const { x: itemX, y } = slots[i];

      console.log(`📦 Creating item ${i} ("${item.label}") at slot ${i} → x=${itemX}, y=${y}`);
      
      const container = this.add.container(itemX, y);
      
      const text = this.add.text(0, 0, item.label, {
        ...itemStyle,
        wordWrap: { width: itemWidth - 20 }
      }).setOrigin(0.5);
      
      container.add([text]);
      container.setSize(itemWidth, itemHeight);
      // Depth 15 — always above blur layers (6-9) and "?" label (9)
      container.setDepth(15);
      container.setInteractive({ useHandCursor: true });
      
      (container as any).itemData = item;
      (container as any).originalX = itemX;
      (container as any).originalY = y;
      
      this.items.push(container);
      
      // Click handler
      container.on("pointerdown", () => {
        if (this.gameEnded || !this.portalImage) return;

        // Lift above everything while in flight so blur never hides it
        container.setDepth(30);

        console.log("🖱️ Clicked item:", item.label);
        
        // Animate to portal
        this.tweens.add({
          targets: container,
          x: this.portalImage!.x,
          y: this.portalImage!.y,
          scale: 0.8,
          duration: ANIMATIONS.itemToPortal.duration,
          ease: ANIMATIONS.itemToPortal.ease,
          onComplete: async () => {
            if (item.is_correct) {
              console.log("✅ Correct item!");
              
              // Destroy item
              container.destroy();
              this.items = this.items.filter(c => c !== container);
              this.correctItemsPlaced++;
              this.score += this.scorePerCorrectItem;

              // ── REVEAL PORTAL on first correct answer ──────────────────
              if (!this.portalRevealed) {
                this.revealPortal();
              }
              // ────────────────────────────────────────────────────────────
              
              // Show success effect
              this.showSuccessEffect(this.portalImage!.x, this.portalImage!.y);
              
              // Show success text
              const feedbackStyle = getTextStyle('feedback', isMobile, isPortrait);
              const successText = this.add.text(
                this.portalImage!.x,
                this.portalImage!.y - (isMobile ? 60 : 100),
                "✓ Correct!",
                {
                  ...feedbackStyle,
                  color: UI_COLORS.success.text
                }
              ).setOrigin(0.5).setDepth(25);
              
              this.tweens.add({
                targets: successText,
                alpha: 0,
                y: successText.y - 50,
                duration: 1000,
                onComplete: () => successText.destroy()
              });
              
              // Check win
              if (this.correctItemsPlaced >= this.totalCorrectItems) {
                await this.endGame(true);
              }
              
            } else {
              console.log("❌ Wrong item!");
              
              // Show error effect
              this.showErrorEffect(container);
              
              // Shake
              this.cameras.main.shake(
                ANIMATIONS.cameraShake.duration, 
                ANIMATIONS.cameraShake.intensity
              );
              
              // Return to its assigned slot position
              this.tweens.add({
                targets: container,
                x: (container as any).originalX,
                y: (container as any).originalY,
                scale: 1,
                duration: ANIMATIONS.itemReturn.duration,
                ease: ANIMATIONS.itemReturn.ease,
                onComplete: () => container.setDepth(15),
              });
              
              // End game
              await this.endGame(false);
            }
          }
        });
      });
      
      // Hover effect (desktop only)
      if (!isMobile) {
        container.on("pointerover", () => {
          this.tweens.add({
            targets: container,
            scale: ANIMATIONS.itemHover.scale,
            duration: ANIMATIONS.itemHover.duration
          });
        });
        
        container.on("pointerout", () => {
          this.tweens.add({
            targets: container,
            scale: 1,
            duration: ANIMATIONS.itemHover.duration
          });
        });
      }
      
      console.log(`  ✅ Item created at x=${itemX}, y=${y} (slot ${i})`);
    });
  }

  // ── PORTAL REVEAL ──────────────────────────────────────────────────────────
  /**
   * Fade out all blur layers so the portal image is fully revealed.
   * Called the first time the player selects a correct answer.
   * Safe to call multiple times (guarded by portalRevealed flag).
   */
  private revealPortal(): void {
    if (this.portalRevealed) return;
    this.portalRevealed = true;

    console.log("✨ Revealing portal image…");

    // Instantly destroy all blur layers — no animation, clean and snappy
    this.blurLayers.forEach((layer) => {
      if (layer && layer.active) layer.destroy();
    });
    this.blurLayers = [];
  }
  // ──────────────────────────────────────────────────────────────────────────

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

  // ---------- Visual Effect Methods ----------
  private showSuccessEffect(x: number, y: number): void {
    const config = ANIMATIONS.successParticles;
    
    for (let i = 0; i < config.count; i++) {
      const angle = (i / config.count) * Math.PI * 2;
      const circle = this.add
        .circle(x, y, 8, UI_COLORS.success.particles)
        .setDepth(20);

      this.tweens.add({
        targets: circle,
        x: x + Math.cos(angle) * config.distance,
        y: y + Math.sin(angle) * config.distance,
        alpha: 0,
        scale: 0.5,
        duration: config.duration,
        ease: config.ease,
        onComplete: () => circle.destroy(),
      });
    }
  }

  private showErrorEffect(target: Phaser.GameObjects.GameObject): void {
    this.tweens.add({
      targets: target,
      x: `+=${8}`,
      duration: 50,
      yoyo: true,
      repeat: 3,
    });
  }

  private createConfetti(width: number, height: number): void {
    const confettiColors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf, 0xff8b94];
    const config = ANIMATIONS.confetti;
    
    this.time.addEvent({
      delay: config.interval,
      repeat: config.repeat,
      callback: () => {
        for (let i = 0; i < config.count; i++) {
          const x = Phaser.Math.Between(0, width);
          const y = -20;
          const size = Phaser.Math.Between(8, 16);
          const color = Phaser.Utils.Array.GetRandom(confettiColors);
          
          const confetti = this.add.rectangle(x, y, size, size, color)
            .setDepth(55)
            .setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));
          
          this.tweens.add({
            targets: confetti,
            y: height + 50,
            rotation: `+=${Phaser.Math.FloatBetween(2, 4) * Math.PI}`,
            x: `+=${Phaser.Math.Between(-100, 100)}`,
            duration: Phaser.Math.Between(config.fallDuration.min, config.fallDuration.max),
            ease: "Linear",
            onComplete: () => confetti.destroy(),
          });
          
          this.tweens.add({
            targets: confetti,
            x: `+=${Phaser.Math.Between(-30, 30)}`,
            duration: config.wiggleDuration,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
        }
      },
    });
  }
  
  private async endGame(won: boolean): Promise<void> {
    if (this.gameEnded) return;
    this.gameEnded = true;
    
    console.log(won ? "🎉 YOU WIN!" : "❌ GAME OVER");

    await this.logVisitBeforeExit();
    
    const { width, height } = this.scale;
    const isMobile = width < 768;

    if (won) {
      // ✅ Update score first
      await this.addScore(this.score);
      
      // ✅ Then unlock next level
      await this.unlockNextLevel();
    } else {
      await this.logGameOverEvent();
    }

    if (won) {
      this.createConfetti(width, height);
    }
    
    // Overlay
    const overlay = this.add.rectangle(0, 0, width, height, UI_COLORS.overlayDark, 0)
      .setOrigin(0)
      .setDepth(100)
      .setInteractive();

    this.tweens.add({
      targets: overlay,
      alpha: 0.75,
      duration: 300,
    });
    
    // Modal background
    const modalWidth = isMobile ? width * 0.85 : 400;
    const modalHeight = isMobile ? 200 : 250;
    
    const modal = this.add.graphics().setDepth(101);
    
    modal.fillStyle(won ? UI_COLORS.success.modal : UI_COLORS.failure.modal, 1);
    modal.fillRoundedRect(
      width / 2 - modalWidth / 2,
      height / 2 - modalHeight / 2,
      modalWidth,
      modalHeight,
      20
    );
    modal.lineStyle(4, 0xffffff, 1);
    modal.strokeRoundedRect(
      width / 2 - modalWidth / 2,
      height / 2 - modalHeight / 2,
      modalWidth,
      modalHeight,
      20
    );
    modal.setAlpha(0).setScale(0.8);
    
    // Title
    const modalTitleStyle = getTextStyle('modalTitle', isMobile, false);
    
    const title = this.add.text(
      width / 2,
      height / 2 - 40,
      won ? "🎉 Mahusay!" : "❌ Mali Gawin Ulit!",
      modalTitleStyle
    ).setOrigin(0.5).setDepth(102).setAlpha(0);
    
    // Button
    const buttonText = won ? "Sunod na Antas →" : "Ulitin";
    const modalBtnStyle = getTextStyle('modalButton', isMobile, false);
    
    const button = this.add.text(
      width / 2,
      height / 2 + 50,
      buttonText,
      {
        ...modalBtnStyle,
        backgroundColor: won ? "#007744" : "#991122"
      }
    ).setOrigin(0.5).setDepth(102).setAlpha(0).setInteractive({ useHandCursor: true });

    // Animate modal in
    this.tweens.add({
      targets: modal,
      alpha: 1,
      scale: 1,
      duration: ANIMATIONS.fadeIn.duration,
      ease: ANIMATIONS.fadeIn.ease,
    });

    this.tweens.add({
      targets: [title, button],
      alpha: 1,
      y: "-=10",
      duration: ANIMATIONS.fadeIn.duration,
      delay: 200,
      ease: "Sine.easeOut",
    });
    
    // Hover effect (desktop only)
    if (!isMobile) {
      button.on("pointerover", () => {
        this.tweens.add({ 
          targets: button, 
          scale: ANIMATIONS.buttonHover.scale, 
          duration: ANIMATIONS.buttonHover.duration 
        });
      });
      
      button.on("pointerout", () => {
        this.tweens.add({ 
          targets: button, 
          scale: 1, 
          duration: ANIMATIONS.buttonHover.duration 
        });
      });
    }
    
    button.on("pointerdown", () => {
      if (won) {
        const hasNextLevel = this.currentLevelInCategory < 15;
        
        if (hasNextLevel) {
          const nextGlobalLevel = this.currentLevel + 1;
          const nextCategoryId = this.currentCategoryId;
          this.cameras.main.fadeOut(400);
          this.time.delayedCall(400, () => {
            window.location.href = `/history-portal?level=${nextGlobalLevel - 1}&category=${nextCategoryId}`;
          });
        } else {
          this.cameras.main.fadeOut(400);
          this.time.delayedCall(400, () => {
            window.location.href = "/historymap";
          });
        }
      } else {
        this.scene.restart({ levelId: this.currentLevel });
      }
    });
  }

  // ✅ WORKING - Same pattern as HumanBody's addScore
  private async addScore(points: number) {
    if (!this.userId) return;
    
    try {
      await updateUserProgress(this.userId, points);
      
      const updated = await getUserProfile(this.userId);
      if (updated?.total_score !== undefined) {
        localStorage.setItem("totalScore", updated.total_score.toString());
      }
      
      console.log("✅ Score updated successfully");
    } catch (e) {
      console.error("❌ Error updating score:", e);
    }
  }

  // ✅ FIXED - Same exact pattern as HumanBody's unlockNextLevel
  private async unlockNextLevel() {
    if (!this.userId) return;

    const completedLevel = this.currentLevelInCategory;
    const nextLevel = completedLevel + 1;

    console.log(`🔓 Unlocking Level ${nextLevel} in ${this.currentCategoryId}`);

    try {
      await saveCategoryLevel(this.userId, "History", this.currentCategoryId, nextLevel);
      
      this.categoryProgress[this.currentCategoryId] = nextLevel;
      
      window.dispatchEvent(new CustomEvent("levels:updated"));
      
      console.log(`✅ Level ${nextLevel} unlocked successfully`);
    } catch (e) {
      console.error("❌ Error unlocking level:", e);
    }
  }

  shutdown() {
    this.logVisitBeforeExit();
  }
}