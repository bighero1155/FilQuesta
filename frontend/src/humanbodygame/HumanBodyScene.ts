// HumanBodyScene.ts
import Phaser from "phaser";
import { updateUserProgress, getUserProfile } from "../services/userService";
import { saveCategoryLevel, getAllCategoryProgress } from "../services/levelService";
import { logPageVisit, logGameOver } from "../services/pageVisitService";
import { LevelConfig, getLevelConfig } from "./HumanBodyLevels";
import Congratulations from "./Congratulations";
import Instruction from "./Instruction";
import GameOver from "./GameOver";
import HumanSceneButtons from "./buttons";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  // ── Orbit fields — only populated for HARD (astronomy) levels ──
  isCenter?: boolean;
  orbitCenterX?: number;
  orbitCenterY?: number;
  orbitRadius?: number;
  currentAngleDeg?: number;
};

const SCENE_KEY = "HumanBodyScene";
const HUMANBODY_CATEGORIES = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"];

// ─── Scene ────────────────────────────────────────────────────────────────────

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

  // Orbit speed in deg/sec (negative = counter-clockwise). Non-zero only for HARD.
  private orbitSpeedDegPerSec = 0;

  private userId: number | null = null;

  // Category-based tracking
  private currentLevel = 1;
  private currentCategoryId = "BASIC";
  private currentLevelInCategory = 1;
  private categoryProgress: Record<string, number> = {
    BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0,
  };

  // Analytics
  private sceneStartTime = 0;
  private hasLoggedVisit = false;

  constructor() {
    super(SCENE_KEY);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private isMobile(): boolean {
    return this.scale.width < 768;
  }

  /** True whenever the current category uses the astronomy / orbit gameplay. */
  private isAstronomy(): boolean {
    return this.currentCategoryId === "HARD";
  }

  /** True whenever the current category uses the life cycle circular gameplay. */
  private isLifecycle(): boolean {
    return this.currentCategoryId === "EXPERT";
  }

  private getBackgroundImage(): string {
    switch (this.currentCategoryId) {
      case "BASIC":
        return "/assets/pyramid.png";
      case "NORMAL":
        return "/assets/human5.png";
      case "HARD":
        return this.level?.backgroundImage ?? "/assets/astronomy/space_bg.png";
      case "ADVANCED":
        return "/assets/habitat/habitat.png";
      case "EXPERT":
        return "/assets/lifecycle/lifecycle_bg.png";
      default:
        return "/assets/human5.png";
    }
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  init(data: { levelId?: number }) {
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

    if (categoryParam) {
      this.currentCategoryId = categoryParam;
      const categoryIndex = HUMANBODY_CATEGORIES.indexOf(categoryParam);
      this.currentLevelInCategory = this.currentLevel - categoryIndex * 15;
    } else {
      this.calculateCategoryFromGlobalLevel(this.currentLevel);
    }

    this.level = getLevelConfig(this.currentLevel);
    this.snapRadius = this.level.snapRadius;
    this.scorePerPart = this.level.scorePerPart;

    // Pull orbit speed from level config (0 for all non-HARD levels)
    this.orbitSpeedDegPerSec = this.level.orbitSpeed ?? 0;

    this.sceneStartTime = Date.now();
    this.hasLoggedVisit = false;
  }

  private calculateCategoryFromGlobalLevel(globalLevel: number) {
    const categoryIndex = Math.floor((globalLevel - 1) / 15);
    const levelInCategory = ((globalLevel - 1) % 15) + 1;
    this.currentCategoryId = HUMANBODY_CATEGORIES[categoryIndex] || "BASIC";
    this.currentLevelInCategory = levelInCategory;
  }

  preload() {
    // Lifecycle mode uses a programmatic gradient — no background image to load
    if (!this.isLifecycle()) {
      this.load.image("body", this.getBackgroundImage());
    }

    const loaded = new Set<string>();
    this.level.parts.forEach((part) => {
      if (!loaded.has(part.assetKey)) {
        loaded.add(part.assetKey);
        this.load.image(part.assetKey, part.imagePath);
      }
    });
  }

  async create() {
    try {
      this.categoryProgress = await getAllCategoryProgress(
        this.userId!, "HumanBody", HUMANBODY_CATEGORIES
      );
    } catch {
      this.categoryProgress = {
        BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0,
      };
    }

    const unlockedInCategory = this.categoryProgress[this.currentCategoryId] || 0;
    if (this.currentLevelInCategory > 1 && this.currentLevelInCategory > unlockedInCategory) {
      alert(`🚫 Complete ${this.currentCategoryId} Level ${this.currentLevelInCategory - 1} first!`);
      window.location.href = "/HumanBody";
      return;
    }

    this.timeLeft = this.level.time;
    this.score = 0;
    this.bodyParts = [];
    this.gameStarted = false;

    this.scale.resize(window.innerWidth, window.innerHeight);
    this.scale.on("resize", this.handleResize, this);

    const isMobile = this.isMobile();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // ── Physics ──
    if (this.isAstronomy()) {
      this.physics.world.gravity.y = 0; // Zero gravity in space
      this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);
    } else {
      this.physics.world.gravity.y = 300;
      this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height - 50);
    }

    this.input.setTopOnly(true);

    // ── Background colour + animated decorations ──
    if (this.isAstronomy()) {
      this.cameras.main.setBackgroundColor("#000010");
      this.createStarfield();
    } else if (this.isLifecycle()) {
      // Gradient drawn below — no animated overlay needed
    } else {
      this.cameras.main.setBackgroundColor("#8fceed");
      this.createAnimatedBackground();
    }

    // ── Background image ──
    if (this.isAstronomy()) {
      if (this.textures.exists("body")) {
        this.add
          .image(centerX, centerY, "body")
          .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
          .setAlpha(0.5)
          .setDepth(-5);
      }
    } else if (this.currentCategoryId === "ADVANCED") {
      // Habitat image fills the full screen — no tint needed, it's already illustrated
      this.add
        .image(centerX, centerY, "body")
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        .setDepth(-5);
    } else if (this.isLifecycle()) {
      // Rich gradient background — no image needed
      this.cameras.main.setBackgroundColor("#0d1f0d");
      const { width, height } = this.cameras.main;
      const grad = this.add.graphics().setDepth(-10);
      // Top half: deep forest green → dark teal
      grad.fillGradientStyle(0x0a2a0a, 0x0a2a0a, 0x0d3d2a, 0x0d3d2a, 1);
      grad.fillRect(0, 0, width, height / 2);
      // Bottom half: dark teal → deep blue-green
      grad.fillGradientStyle(0x0d3d2a, 0x0d3d2a, 0x071a2e, 0x071a2e, 1);
      grad.fillRect(0, height / 2, width, height / 2);
      // Soft radial glow in center
      const glow = this.add.graphics().setDepth(-9);
      for (let r = 260; r >= 0; r -= 20) {
        const alpha = 0.03 * (1 - r / 260);
        glow.fillStyle(0x00ff88, alpha);
        glow.fillCircle(centerX, centerY, r);
      }
    } else {
      let bodyScaleX: number;
      let bodyScaleY: number;

      if (isMobile && this.currentCategoryId === "BASIC") {
        const pyramidNaturalWidth = 1024;
        const pyramidNaturalHeight = 900;
        const pyramidAspect = pyramidNaturalHeight / pyramidNaturalWidth;
        const targetHeight = this.cameras.main.height * 1.0;
        bodyScaleY = targetHeight / pyramidNaturalHeight;
        bodyScaleX = bodyScaleY / pyramidAspect;
      } else {
        bodyScaleX = isMobile ? 1.8 : 2.0;
        bodyScaleY = isMobile ? 1.1 : 1.4;
      }

      this.add.image(centerX, centerY, "body").setScale(bodyScaleX, bodyScaleY).setAlpha(1.3);
    }

    // ── HUD ──
    const scoreFontSize = isMobile ? "20px" : "28px";
    const topRowX = isMobile ? 150 : 170;

    this.scoreText = this.add.text(topRowX, 20, "Score: 0", {
      fontSize: scoreFontSize,
      fontFamily: "Poppins, sans-serif",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: isMobile ? 3 : 4,
      shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 2, fill: true },
    });

    const levelInfoFontSize = isMobile ? "28px" : "38px";
    this.add.text(
      isMobile ? 10 : topRowX + 180,
      isMobile ? 10 : 12,
      `Level ${this.currentLevelInCategory}`,
      {
        fontSize: levelInfoFontSize,
        fontFamily: "Poppins, sans-serif",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: isMobile ? 3 : 4,
        shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 2, fill: true },
      }
    );

    const timerX = isMobile ? this.cameras.main.width - 130 : this.cameras.main.width - 175;
    this.timerText = this.add.text(timerX, 20, `Time: ${this.timeLeft}`, {
      fontSize: scoreFontSize,
      fontFamily: "Poppins, sans-serif",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: isMobile ? 3 : 4,
      shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 2, fill: true },
    });

    // ── Quit button ──
    const backButtonSize = isMobile ? 70 : 80;
    const backY = isMobile ? this.scale.height - 120 : this.scale.height - 50;
    const backX = 10 + backButtonSize / 2;

    this.shadowCircle = this.add.graphics();
    this.shadowCircle.fillStyle(0x000000, 0.2);
    this.shadowCircle.fillCircle(backX + 2, backY + 2, backButtonSize / 2);
    this.shadowCircle.setDepth(9998);

    this.backCircle = this.add.graphics();
    this.backCircle.fillStyle(0xff6b6b, 1);
    this.backCircle.fillCircle(backX, backY, backButtonSize / 2);
    this.backCircle.setDepth(9999);
    this.backCircle.setInteractive(
      new Phaser.Geom.Circle(backX, backY, backButtonSize / 2),
      Phaser.Geom.Circle.Contains
    );

    this.backButton = this.add
      .text(backX, backY, "QUIT", {
        fontSize: isMobile ? "24px" : "28px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#cc0000",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(10000);

    this.backCircle.on("pointerover", () => {
      this.backCircle.clear();
      this.backCircle.fillStyle(0xff5252, 1);
      this.backCircle.fillCircle(backX, backY, backButtonSize / 2);
      this.backButton.setScale(1.1);
    });
    this.backCircle.on("pointerout", () => {
      this.backCircle.clear();
      this.backCircle.fillStyle(0xff6b6b, 1);
      this.backCircle.fillCircle(backX, backY, backButtonSize / 2);
      this.backButton.setScale(1);
    });
    this.backCircle.on("pointerdown", () => {
      this.backCircle.clear();
      this.backCircle.fillStyle(0xcc0000, 1);
      this.backCircle.fillCircle(backX, backY, backButtonSize / 2);
      this.backButton.setScale(0.95);
    });
    this.backCircle.on("pointerup", async () => {
      this.backCircle.clear();
      this.backCircle.fillStyle(0xff6b6b, 1);
      this.backCircle.fillCircle(backX, backY, backButtonSize / 2);
      this.backButton.setScale(1);
      const result = confirm("Do you want to exit the game?");
      if (result) {
        await this.logVisitBeforeExit();
        window.location.href = "/humanbodymap";
      }
    });

    // ── Button manager ──
    this.buttonManager = new HumanSceneButtons(this);
    this.buttonManager.createButtons(centerX, centerY, {
      onRestart: async () => {
        await this.logVisitBeforeExit();
        if (this.gameTimer) this.gameTimer.remove(false);
        this.scene.restart({ levelId: this.currentLevel });
      },
      onNextLevel: async () => {
        await this.logVisitBeforeExit();
        if (this.currentLevelInCategory < 15) {
          const nextGlobalLevel = this.currentLevel + 1;
          window.location.href = `/body-systems?level=${nextGlobalLevel - 1}&category=${this.currentCategoryId}`;
        } else {
          window.location.href = "/humanbodymap";
        }
      },
    });

    // ── Instructions (first time per category) ──
    const instructionKey = `humanBodyInstructionsSeen_${this.currentCategoryId}`;
    const seenInstructions = localStorage.getItem(instructionKey);
    const isFirstLevelOfCategory = this.currentLevelInCategory === 1;

    if (isFirstLevelOfCategory && !seenInstructions) {
      const instructions = new Instruction(this);
      instructions.show(() => {
        localStorage.setItem(instructionKey, "true");
        this.startGame(centerX, centerY);
      });
    } else {
      this.startGame(centerX, centerY);
    }

    this.logInitialVisit();
  }

  // ─── update() — astronomy orbit loop ────────────────────────────────────

  update(_time: number, delta: number) {
    if (!this.gameStarted || !this.isAstronomy()) return;

    const dtSec = delta / 1000;

    this.bodyParts.forEach((part) => {
      // Skip center bodies and any part without orbit params
      if (part.isCenter || part.orbitRadius === undefined) return;

      // Advance angle counter-clockwise
      part.currentAngleDeg! += this.orbitSpeedDegPerSec * dtSec;

      const rad = Phaser.Math.DegToRad(part.currentAngleDeg!);
      const newX = part.orbitCenterX! + Math.cos(rad) * part.orbitRadius;
      const newY = part.orbitCenterY! + Math.sin(rad) * part.orbitRadius;

      // Always keep correctX/Y at the current orbit position
      part.correctX = newX;
      part.correctY = newY;

      if (!part.placed) {
        // Move the hollow orbiting snap target
        part.targetCircle.setPosition(newX, newY);
      } else {
        // Keep the snapped image travelling with its target
        part.image?.setPosition(newX, newY);
        part.targetCircle.setPosition(newX, newY);
      }
    });
  }

  // ─── Backgrounds ─────────────────────────────────────────────────────────

  private createStarfield() {
    const { width, height } = this.cameras.main;

    // Static star layer
    const starGfx = this.add.graphics().setDepth(-10);
    for (let i = 0; i < 200; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const r = Math.random() < 0.7 ? 1 : 2;
      starGfx.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.3, 1.0));
      starGfx.fillCircle(x, y, r);
    }

    // Twinkling stars
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const star = this.add.graphics().setDepth(-9);
      star.fillStyle(0xffffff, 1);
      star.fillCircle(x, y, 2);
      this.tweens.add({
        targets: star,
        alpha: 0.1,
        duration: Phaser.Math.Between(800, 2000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: Phaser.Math.Between(0, 2000),
      });
    }
  }

  private createAnimatedBackground() {
    const { width, height } = this.cameras.main;
    const medicalIcons = ["🫀", "🧠", "🫁", "🩺", "💊", "🏥", "⚕️", "🔬"];

    for (let i = 0; i < 8; i++) {
      const icon = medicalIcons[i % medicalIcons.length];
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      const iconText = this.add
        .text(x, y, icon, { fontSize: this.isMobile() ? "32px" : "48px" })
        .setOrigin(0.5).setAlpha(0.15).setDepth(-1);

      this.tweens.add({ targets: iconText, y: y - 30, duration: Phaser.Math.Between(4000, 6000), yoyo: true, repeat: -1, ease: "Sine.easeInOut", delay: i * 500 });
      this.tweens.add({ targets: iconText, x: x + Phaser.Math.Between(-20, 20), duration: Phaser.Math.Between(3000, 5000), yoyo: true, repeat: -1, ease: "Sine.easeInOut", delay: i * 300 });
      this.tweens.add({ targets: iconText, angle: Phaser.Math.Between(-10, 10), duration: Phaser.Math.Between(5000, 7000), yoyo: true, repeat: -1, ease: "Sine.easeInOut", delay: i * 400 });
    }

    const circleColors = [0xffffff, 0x87CEEB, 0xADD8E6];
    for (let i = 0; i < 3; i++) {
      const circle = this.add.graphics();
      const radius = Phaser.Math.Between(100, 200);
      const x = i === 0 ? -50 : i === 1 ? width + 50 : width / 2;
      const y = i === 0 ? -50 : i === 1 ? height + 50 : height / 2;
      circle.fillStyle(circleColors[i], 0.05).fillCircle(x, y, radius).setDepth(-2);
      this.tweens.add({ targets: circle, scaleX: 1.2, scaleY: 1.2, alpha: 0.1, duration: Phaser.Math.Between(4000, 6000), yoyo: true, repeat: -1, ease: "Sine.easeInOut", delay: i * 1000 });
    }

    for (let i = 0; i < 12; i++) {
      const crossX = Phaser.Math.Between(0, width);
      const crossY = Phaser.Math.Between(0, height);
      const cross = this.add.graphics();
      cross.fillStyle(0xffffff, 0.08);
      cross.fillRect(crossX - 15, crossY - 2, 30, 4);
      cross.fillRect(crossX - 2, crossY - 15, 4, 30);
      cross.setDepth(-1);
      this.tweens.add({ targets: cross, alpha: 0.15, duration: Phaser.Math.Between(3000, 5000), yoyo: true, repeat: -1, ease: "Sine.easeInOut", delay: i * 400 });
    }
  }

  // ─── Analytics ───────────────────────────────────────────────────────────

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

  // ─── Auth ────────────────────────────────────────────────────────────────

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

  // ─── Game Start ──────────────────────────────────────────────────────────

  private startGame(centerX: number, centerY: number) {
    if (this.gameStarted) return;
    this.gameStarted = true;

    if (this.isAstronomy()) {
      this.startAstronomyGame(centerX, centerY);
    } else if (this.isLifecycle()) {
      this.startLifecycleGame(centerX, centerY);
    } else {
      this.startStandardGame(centerX, centerY);
    }

    this.gameTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.updateTimer,
      callbackScope: this,
    });
  }

  // ─── Life Cycle Game (EXPERT) ─────────────────────────────────────────────

  private startLifecycleGame(centerX: number, centerY: number) {
    const isMobile = this.isMobile();
    const colors = [0xffdd00, 0xff8800, 0x44cc44, 0x3399ff, 0xcc44ff];

    // Draw the circular guide ring
    const ringRadius = isMobile ? 130 : 200;
    const ringGfx = this.add.graphics();
    ringGfx.lineStyle(2, 0xffffff, 0.18);
    ringGfx.strokeCircle(centerX, centerY, ringRadius);
    ringGfx.setDepth(-1);

    // Draw curved arrows between the 5 positions BEFORE creating parts
    // so arrows sit behind the snap circles
    this.drawLifecycleArrows(centerX, centerY, this.level.parts.length, isMobile);

    this.bodyParts = this.level.parts.map((p, index) => {
      const color = colors[index % colors.length];
      const snapX = centerX + (isMobile ? p.mobileX : p.x);
      const snapY = centerY + (isMobile ? p.mobileY : p.y);

      // Snap target: numbered circle
      const targetGfx = this.add.graphics();
      const targetR = isMobile ? 22 : 34;
      targetGfx.lineStyle(3, 0xffffff, 0.7);
      targetGfx.strokeCircle(snapX, snapY, targetR);
      targetGfx.fillStyle(0xffffff, 0.12);
      targetGfx.fillCircle(snapX, snapY, targetR);
      targetGfx.setDepth(1);

      // Stage number badge inside the circle
      const orderNum = p.cycleOrder ?? index + 1;
      this.add.text(snapX, snapY, `${orderNum}`, {
        fontSize: isMobile ? "18px" : "22px",
        fontFamily: "Poppins, sans-serif",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      }).setOrigin(0.5).setDepth(2);

      const part: BodyPart = {
        name: p.name,
        correctX: snapX,
        correctY: snapY,
        placed: false,
        targetCircle: targetGfx,
        color,
        description: p.description,
      };

      this.createImagePart(part, p.assetKey, index, p.scale);
      return part;
    });
  }

  /**
   * Draws arc arrows between consecutive snap positions on the pentagon.
   * - Only draws arrows between the `count` nodes that actually exist this level.
   * - On level 5 (all nodes present), closes the loop with a final arrow from 5→1.
   * - Always traverses the arc in the CLOCKWISE direction to avoid backward arcs.
   */
  private drawLifecycleArrows(
    centerX: number,
    centerY: number,
    count: number,
    isMobile: boolean
  ) {
    const radius = isMobile ? 130 : 200;
    const arcR = radius + (isMobile ? 30 : 46); // arc drawn just outside the snap ring
    const baseAngle = -90;                           // top position = -90°
    const stepDeg = 72;                            // 360 / 5

    const gfx = this.add.graphics();
    gfx.setDepth(0);

    // How many arrows to draw:
    //   - levels 1–4: arrows only between the nodes that exist (count-1 arrows, no loop-back)
    //   - level  5:   full loop — 5 arrows including 5→1
    const arrowCount = count === 5 ? 5 : count - 1;

    for (let i = 0; i < arrowCount; i++) {
      const fromDeg = baseAngle + i * stepDeg;
      // Always step clockwise (+72°); wrap cleanly by adding rather than using %
      const toDeg = fromDeg + stepDeg;

      const fromRad = Phaser.Math.DegToRad(fromDeg);
      const toRad = Phaser.Math.DegToRad(toDeg);

      // ── Draw arc as polyline (clockwise, so toRad > fromRad always) ──
      const arcSteps = 14;
      gfx.lineStyle(isMobile ? 2 : 3, 0xffffff, 0.6);
      gfx.beginPath();
      for (let s = 0; s <= arcSteps; s++) {
        const t = s / arcSteps;
        const angle = fromRad + (toRad - fromRad) * t;
        const px = centerX + Math.cos(angle) * arcR;
        const py = centerY + Math.sin(angle) * arcR;
        if (s === 0) gfx.moveTo(px, py);
        else gfx.lineTo(px, py);
      }
      gfx.strokePath();

      // ── Arrowhead at 75% along the arc ──
      const tipT = 0.75;
      const tipAngle = fromRad + (toRad - fromRad) * tipT;
      const tx_tip = centerX + Math.cos(tipAngle) * arcR;
      const ty_tip = centerY + Math.sin(tipAngle) * arcR;

      // Tangent direction (clockwise = derivative of cos/sin)
      const tangentX = -Math.sin(tipAngle); // clockwise tangent
      const tangentY = Math.cos(tipAngle);
      // Outward normal
      const normalX = Math.cos(tipAngle);
      const normalY = Math.sin(tipAngle);

      const sz = isMobile ? 8 : 12;

      gfx.fillStyle(0xffffff, 0.85);
      gfx.fillTriangle(
        // tip — forward in tangent direction
        tx_tip + tangentX * sz, ty_tip + tangentY * sz,
        // base left
        tx_tip - tangentX * sz * 0.5 + normalX * sz * 0.5,
        ty_tip - tangentY * sz * 0.5 + normalY * sz * 0.5,
        // base right
        tx_tip - tangentX * sz * 0.5 - normalX * sz * 0.5,
        ty_tip - tangentY * sz * 0.5 - normalY * sz * 0.5
      );
    }
  }

  // ─── Standard game (BASIC / NORMAL / ADVANCED / EXPERT) ─────────────────

  private startStandardGame(centerX: number, centerY: number) {
    const isMobile = this.isMobile();
    const colors = [0xff3366, 0x33cc99, 0x3399ff, 0xffcc00, 0x00cccc, 0xcc66ff];

    this.bodyParts = this.level.parts.map((p, index) => {
      const color = colors[index % colors.length];
      const targetX = centerX + (isMobile ? p.mobileX : p.x);
      const targetY = centerY + (isMobile ? p.mobileY : p.y);

      const circle = this.add.graphics();
      circle.fillStyle(0xffffff, 0.6);
      circle.fillCircle(targetX, targetY, isMobile ? 18 : 30);

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
  }

  // ─── Astronomy game (HARD) ───────────────────────────────────────────────

  private startAstronomyGame(centerX: number, centerY: number) {
    const isMobile = this.isMobile();
    const colors = [0xffcc00, 0xff9933, 0x33ccff, 0xff3366, 0x66ff99, 0xcc66ff];

    // Faint orbit ring guides
    this.level.parts.forEach((p) => {
      if (!p.isCenter && p.orbitRadius !== undefined) {
        const r = isMobile ? (p.mobileOrbitRadius ?? p.orbitRadius) : p.orbitRadius;
        const ring = this.add.graphics();
        ring.lineStyle(1, 0xffffff, 0.15);
        ring.strokeCircle(centerX, centerY, r);
        ring.setDepth(-1);
      }
    });

    this.bodyParts = this.level.parts.map((p, index) => {
      const color = colors[index % colors.length];
      const orbitR = isMobile
        ? (p.mobileOrbitRadius ?? p.orbitRadius ?? 0)
        : (p.orbitRadius ?? 0);
      const startAngle = p.orbitStartAngle ?? index * 90;

      // Initial snap target position
      let snapX: number;
      let snapY: number;
      if (p.isCenter) {
        snapX = centerX;
        snapY = centerY;
      } else {
        const rad = Phaser.Math.DegToRad(startAngle);
        snapX = centerX + Math.cos(rad) * orbitR;
        snapY = centerY + Math.sin(rad) * orbitR;
      }

      // Draw target indicator
      const targetGfx = this.add.graphics();
      if (p.isCenter) {
        targetGfx.lineStyle(2, 0xffffff, 0.5);
        targetGfx.strokeCircle(snapX, snapY, this.snapRadius);
        targetGfx.lineStyle(1, 0xffffff, 0.2);
        targetGfx.strokeCircle(snapX, snapY, this.snapRadius + 8);
      } else {
        targetGfx.fillStyle(0xffffff, 0.25);
        targetGfx.fillCircle(0, 0, isMobile ? 18 : 26);
        targetGfx.lineStyle(2, 0xffffff, 0.6);
        targetGfx.strokeCircle(0, 0, isMobile ? 18 : 26);
        targetGfx.setPosition(snapX, snapY);
      }
      targetGfx.setDepth(1);

      const part: BodyPart = {
        name: p.name,
        correctX: snapX,
        correctY: snapY,
        placed: false,
        targetCircle: targetGfx,
        color,
        description: p.description,
        isCenter: !!p.isCenter,
        orbitCenterX: centerX,
        orbitCenterY: centerY,
        orbitRadius: p.isCenter ? undefined : orbitR,
        currentAngleDeg: p.isCenter ? undefined : startAngle,
      };

      this.createImagePart(part, p.assetKey, index, p.scale);
      return part;
    });
  }

  // ─── Shared draggable part creator ───────────────────────────────────────

  private createImagePart(part: BodyPart, key: string, index: number, scale: number) {
    const isMobile = this.isMobile();

    // Spawn position — left column
    let x: number;
    let y: number;
    if (this.level.parts.length === 1) {
      x = isMobile ? 80 : 100;
      y = this.cameras.main.height / 2;
    } else {
      x = isMobile ? 60 : 80;
      y = (isMobile ? 100 : 100) + index * (isMobile ? 70 : 130);
    }

    const organScale = isMobile ? scale * 0.7 : scale;

    // Glow aura
    const glowCircle = this.add.graphics();
    glowCircle.setPosition(x, y).setDepth(-1);
    const glowRadius = isMobile ? 22 : 45;

    if (this.isAstronomy()) {
      glowCircle.fillStyle(part.color, 0.18);
      glowCircle.fillCircle(0, 0, glowRadius);
      glowCircle.fillStyle(0xffffff, 0.08);
      glowCircle.fillCircle(0, 0, glowRadius - 8);
    } else {
      glowCircle.fillStyle(0xffffff, 0.3);
      glowCircle.fillCircle(0, 0, glowRadius);
      glowCircle.fillStyle(0xffff00, 0.2);
      glowCircle.fillCircle(0, 0, glowRadius - 5);
      glowCircle.fillStyle(0xffffff, 0.4);
      glowCircle.fillCircle(0, 0, glowRadius - 10);
    }

    this.tweens.add({
      targets: glowCircle,
      alpha: 0.6, scaleX: 1.3, scaleY: 1.3,
      duration: 1000, yoyo: true, repeat: -1, ease: "Sine.easeInOut",
    });

    // Physics image
    const image = this.physics.add.image(x, y, key).setScale(organScale);
    image.setInteractive({ draggable: true, useHandCursor: true });
    const body = image.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setAllowGravity(false);
    if (!this.isAstronomy()) body.setBounce(0.4);
    part.image = image;

    // Labels
    const labelX = isMobile ? this.cameras.main.width - 160 : this.cameras.main.width - 280;
    const labelY = y;
    const circleRadius = isMobile ? 8 : 12;
    const nameFontSize = isMobile ? "12px" : "17px";
    const descFontSize = isMobile ? "12px" : "17px";
    const descWrapWidth = isMobile ? 130 : 240;
    const textOffsetX = isMobile ? 15 : 25;

    part.colorCircle = this.add.graphics();
    part.colorCircle.fillStyle(part.color);
    part.colorCircle.fillCircle(labelX, labelY + 10, circleRadius);

    part.text = this.add.text(labelX + textOffsetX, labelY, part.name, {
      fontSize: nameFontSize,
      fontFamily: "Poppins, sans-serif",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: isMobile ? 3 : 4,
      shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 2, fill: true },
    });

    part.descriptionText = this.add.text(
      labelX + textOffsetX,
      labelY + (isMobile ? 26 : 32),
      part.description,
      {
        fontSize: descFontSize,
        fontFamily: "Poppins, sans-serif",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: isMobile ? 3 : 4,
        wordWrap: { width: descWrapWidth },
        lineSpacing: isMobile ? 2 : 4,
        shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 2, fill: true },
      }
    );

    if (isMobile) {
      part.colorCircle.setVisible(false);
      part.text.setVisible(false);
      part.descriptionText.setVisible(false);
    }

    // Idle pulse
    this.tweens.add({
      targets: image,
      scaleX: organScale * 1.05, scaleY: organScale * 1.05,
      duration: Phaser.Math.Between(500, 1000),
      delay: Phaser.Math.Between(0, 1000),
      yoyo: true, repeat: -1, ease: "Sine.easeInOut",
    });

    image.on("pointerdown", () => {
      this.tweens.add({ targets: image, scale: organScale * 1.1, duration: 100, yoyo: true, ease: "Sine.easeInOut" });
    });

    image.on("dragstart", () => {
      (image.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      this.tweens.add({ targets: image, scale: organScale * 1.05, duration: 100, yoyo: true });
      glowCircle.setVisible(false);
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
      glowCircle.setPosition(dragX, dragY);

      if (part.colorCircle && part.text && part.descriptionText) {
        const newLabelX = dragX + (isMobile ? 60 : 100);
        const newLabelY = dragY + (isMobile ? -15 : -20);
        part.colorCircle.clear();
        part.colorCircle.fillStyle(part.color);
        part.colorCircle.fillCircle(newLabelX, newLabelY + 10, circleRadius);
        part.text.setPosition(newLabelX + textOffsetX, newLabelY);
        part.descriptionText.setPosition(newLabelX + textOffsetX, newLabelY + (isMobile ? 26 : 32));
      }
    });

    image.on("dragend", (pointer: Phaser.Input.Pointer) => {
      if (part.placed) return;

      const dx = image.x - part.correctX;
      const dy = image.y - part.correctY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.snapRadius) {
        // ✅ Snapped!
        image.setPosition(part.correctX, part.correctY);
        (image.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        (image.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        image.disableInteractive();
        part.placed = true;
        this.score += this.scorePerPart;
        this.scoreText.setText(`Score: ${this.score}`);

        part.targetCircle.clear();
        if (this.isAstronomy() && !part.isCenter) {
          part.targetCircle.fillStyle(part.color, 0.6);
          part.targetCircle.fillCircle(0, 0, isMobile ? 18 : 26);
          part.targetCircle.setPosition(part.correctX, part.correctY);
        } else if (this.isLifecycle()) {
          // Fill the ring with the part color to signal correct placement
          part.targetCircle.fillStyle(part.color, 0.5);
          part.targetCircle.fillCircle(part.correctX, part.correctY, isMobile ? 22 : 34);
          part.targetCircle.lineStyle(3, part.color, 1);
          part.targetCircle.strokeCircle(part.correctX, part.correctY, isMobile ? 22 : 34);
        } else {
          part.targetCircle.fillStyle(part.color, 0.9);
          part.targetCircle.fillCircle(part.correctX, part.correctY, isMobile ? 18 : 30);
        }

        glowCircle.destroy();

        if (part.colorCircle && part.text && part.descriptionText) {
          part.colorCircle.setVisible(false);
          part.text.setVisible(false);
          part.descriptionText.setVisible(false);
        }

        this.tweens.add({
          targets: image,
          scaleX: organScale * 1.25, scaleY: organScale * 1.25,
          duration: 120, yoyo: true, ease: "Back.easeOut",
        });

        this.checkWin();
      } else {
        // ❌ Missed
        if (this.isAstronomy()) {
          (image.body as Phaser.Physics.Arcade.Body).setVelocity(
            (x - image.x) * 1.5,
            (y - image.y) * 1.5
          );
        } else {
          const velocityX = (image.x - pointer.downX) * 2;
          const velocityY = (image.y - pointer.downY) * 2;
          (image.body as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
          (image.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
        }

        glowCircle.setVisible(false);
        glowCircle.setPosition(x, y);

        if (part.colorCircle && part.text && part.descriptionText) {
          const resetLabelX = isMobile ? this.cameras.main.width - 160 : this.cameras.main.width - 280;
          const resetLabelY = y;
          part.colorCircle.clear();
          part.colorCircle.fillStyle(part.color);
          part.colorCircle.fillCircle(resetLabelX, resetLabelY + 10, circleRadius);
          part.text.setPosition(resetLabelX + textOffsetX, resetLabelY);
          part.descriptionText.setPosition(resetLabelX + textOffsetX, resetLabelY + (isMobile ? 26 : 32));
          if (isMobile) {
            part.colorCircle.setVisible(false);
            part.text.setVisible(false);
            part.descriptionText.setVisible(false);
          }
        }
      }
    });
  }

  // ─── Timer ───────────────────────────────────────────────────────────────

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
    if (this.bodyParts.every((p) => p.placed)) {
      if (this.gameTimer) this.gameTimer.remove(false);
      this.endGame(true);
    }
  }

  // ─── End Game ────────────────────────────────────────────────────────────

  private async endGame(success: boolean) {
    await this.logVisitBeforeExit();

    if (success) {
      await this.addScore(this.score);
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
        this.buttonManager.showButtons(this.currentLevelInCategory < 15);
      });
    } else {
      const gameOver = new GameOver(this);
      gameOver.show(() => {
        if (this.gameTimer) this.gameTimer.remove(false);
        this.scene.restart({ levelId: this.currentLevel });
      });
    }
  }

  // ─── Score / Unlock ──────────────────────────────────────────────────────

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

  private async unlockNextLevel() {
    if (!this.userId) return;

    const nextLevel = this.currentLevelInCategory + 1;
    const alreadyUnlocked = this.categoryProgress[this.currentCategoryId] || 0;

    // ✅ Only write to the backend if this completion unlocks a NEW level.
    // Replaying an earlier level (e.g. Level 1 after completing Level 6) must
    // never overwrite the higher progress already stored in the database.
    if (nextLevel <= alreadyUnlocked) {
      console.log(`⏭️ Level ${nextLevel} already unlocked (progress: ${alreadyUnlocked}), skipping save.`);
      return;
    }

    console.log(`🔓 Unlocking Level ${nextLevel} in ${this.currentCategoryId}`);
    try {
      await saveCategoryLevel(this.userId, "HumanBody", this.currentCategoryId, nextLevel);
      this.categoryProgress[this.currentCategoryId] = nextLevel;
      window.dispatchEvent(new CustomEvent("levels:updated"));
      console.log(`✅ Level ${nextLevel} unlocked successfully`);
    } catch (e) {
      console.error("❌ Error unlocking level:", e);
    }
  }

  // ─── Resize ──────────────────────────────────────────────────────────────

  private handleResize(gameSize: Phaser.Structs.Size) {
    this.cameras.resize(gameSize.width, gameSize.height);
  }

  shutdown() {
    this.logVisitBeforeExit();
  }
}