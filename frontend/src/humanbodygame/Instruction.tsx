// Instruction.ts
import Phaser from "phaser";

export default class Instruction {
  private scene: Phaser.Scene;
  private container?: Phaser.GameObjects.Container;
  private tweens: Phaser.Tweens.Tween[] = [];
  private isMobile: boolean = false;

  // ─── Design tokens ────────────────────────────────────────────────────────
  private static readonly C = {
    bg:       0x0a0d14,
    panel:    0x111620,
    border:   0x1e2d40,
    accent:   0x00e5a0,       // teal-green
    accentDim:0x00b57e,
    gold:     0xf5c842,
    red:      0xff5c7a,
    white:    0xffffff,
    textDim:  0x7a8fa6,
  };

  private static readonly STEPS = [
    { icon: "🧩", label: "Drag organs",    desc: "to their correct body position",   col: 0x00e5a0 },
    { icon: "⭐", label: "Earn points",    desc: "for every accurate placement",      col: 0xf5c842 },
    { icon: "⏱️", label: "Beat the clock", desc: "before the timer hits zero",        col: 0xff5c7a },
    { icon: "🚫", label: "Stay careful",   desc: "wrong drops cost you dearly",       col: 0xff8c42 },
    { icon: "🏆", label: "Master all",     desc: "organs to claim total victory",     col: 0xa78bfa },
  ];
  // ──────────────────────────────────────────────────────────────────────────

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  show(onClose: () => void) {
    const { width, height } = this.scene.cameras.main;
    this.isMobile = width < 768;

    if (this.container) {
      this.container.setVisible(true);
      this.container.setDepth(9999);
      return;
    }

    const C = Instruction.C;
    const mobile = this.isMobile;

    // Panel geometry
    const pw = mobile ? width * 0.92 : Math.min(width * 0.6, 680);
    const ph = mobile ? height * 0.88 : Math.min(height * 0.85, 620);
    const cx = width  / 2;
    const cy = height / 2;

    const elements: Phaser.GameObjects.GameObject[] = [];

    // ── 1. Backdrop ─────────────────────────────────────────────────────────
    const backdrop = this.scene.add
      .rectangle(0, 0, width, height, 0x000000, 0.78)
      .setOrigin(0)
      .setAlpha(0)
      .setInteractive();               // block clicks below

    this.track(this.scene.tweens.add({ targets: backdrop, alpha: 0.78, duration: 300, ease: "Sine.Out" }));
    elements.push(backdrop);

    // ── 2. Panel card ───────────────────────────────────────────────────────
    const card = this.scene.add
      .rectangle(cx, cy, pw, ph, C.panel)
      .setOrigin(0.5)
      .setStrokeStyle(1.5, C.border);
    elements.push(card);

    // Subtle top highlight stripe
    const highlight = this.scene.add
      .rectangle(cx, cy - ph / 2 + 1, pw - 4, 3, C.accent, 0.8)
      .setOrigin(0.5, 0);
    elements.push(highlight);

    // ── 3. Header ───────────────────────────────────────────────────────────
    const headerY = cy - ph / 2 + (mobile ? 54 : 62);

    const iconSize  = mobile ? 44 : 52;
    const iconCircle = this.scene.add
      .circle(cx, headerY, iconSize / 2 + 6, C.accent, 0.12)
      .setOrigin(0.5);
    const iconEmoji  = this.scene.add
      .text(cx, headerY, "🫀", { fontSize: `${iconSize}px` })
      .setOrigin(0.5);

    const titleFontSize = mobile ? "28px" : "36px";
    const titleY = headerY + (mobile ? 44 : 52);

    const titleText = this.scene.add
      .text(cx, titleY, "HOW  TO  PLAY", {
        fontFamily: "'Orbitron', 'Fredoka', monospace",
        fontSize: titleFontSize,
        fontStyle: "bold",
        color: "#ffffff",
        letterSpacing: 4,
      })
      .setOrigin(0.5);

    const subtitleText = this.scene.add
      .text(cx, titleY + (mobile ? 28 : 34), "Organ Placement Challenge", {
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        fontSize: mobile ? "14px" : "16px",
        color: `#${C.accent.toString(16).padStart(6, "0")}`,
      })
      .setOrigin(0.5)
      .setAlpha(0.85);

    elements.push(iconCircle, iconEmoji, titleText, subtitleText);

    // Divider line
    const divY = titleY + (mobile ? 48 : 56);
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, C.border, 1);
    divider.beginPath();
    divider.moveTo(cx - pw * 0.42, divY);
    divider.lineTo(cx + pw * 0.42, divY);
    divider.strokePath();
    elements.push(divider);

    // ── 4. Step rows ────────────────────────────────────────────────────────
    const rowH    = mobile ? 56 : 62;
    const rowW    = pw * 0.88;
    const firstRowY = divY + (mobile ? 40 : 46);

    Instruction.STEPS.forEach((step, i) => {
      const ry = firstRowY + i * rowH;

      // Row tint background (very subtle)
      const rowBg = this.scene.add
        .rectangle(cx, ry, rowW, rowH - 6, step.col, 0.04)
        .setOrigin(0.5)
        .setAlpha(0);
      elements.push(rowBg);

      // Left pill / icon badge
      const badgeR = mobile ? 18 : 20;
      const badgeX = cx - rowW / 2 + badgeR + 6;
      const badge = this.scene.add
        .circle(badgeX, ry, badgeR, step.col, 0.18)
        .setOrigin(0.5)
        .setAlpha(0);
      const badgeIcon = this.scene.add
        .text(badgeX, ry, step.icon, { fontSize: mobile ? "20px" : "24px" })
        .setOrigin(0.5)
        .setAlpha(0);

      // Bold label
      const labelX = badgeX + badgeR + (mobile ? 12 : 14);
      const label = this.scene.add
        .text(labelX, ry - (mobile ? 5 : 6), step.label, {
          fontFamily: "'Orbitron', monospace",
          fontSize: mobile ? "13px" : "15px",
          fontStyle: "bold",
          color: `#${step.col.toString(16).padStart(6, "0")}`,
        })
        .setOrigin(0, 0.5)
        .setAlpha(0);

      // Description text
      const desc = this.scene.add
        .text(labelX, ry + (mobile ? 9 : 10), step.desc, {
          fontFamily: "'Fredoka', 'Nunito', sans-serif",
          fontSize: mobile ? "13px" : "14px",
          color: `#${C.textDim.toString(16).padStart(6, "0")}`,
        })
        .setOrigin(0, 0.5)
        .setAlpha(0);

      // Right accent dot
      const dotX = cx + rowW / 2 - 12;
      const dot = this.scene.add
        .circle(dotX, ry, 3, step.col, 0.6)
        .setOrigin(0.5)
        .setAlpha(0);

      elements.push(rowBg, badge, badgeIcon, label, desc, dot);

      // Staggered slide-in
      const delay = 350 + i * 90;
      const targets = [rowBg, badge, badgeIcon, label, desc, dot];
      targets.forEach(t => { (t as any).x -= 20; });

      this.track(this.scene.tweens.add({
        targets,
        alpha: { from: 0, to: 1 },
        x:     `+=20`,
        duration: 380,
        delay,
        ease: "Cubic.Out",
      }));
    });

    // ── 5. START button ─────────────────────────────────────────────────────
    const btnY  = cy + ph / 2 - (mobile ? 52 : 62);
    const btnW  = mobile ? 210 : 240;
    const btnH  = mobile ? 48 : 56;

    // Button background (solid, rounded feel via graphics)
    const btnBg = this.scene.add.graphics();
    this.drawRoundRect(btnBg, cx - btnW / 2, btnY - btnH / 2, btnW, btnH, 10, C.accent, 1);
    elements.push(btnBg);

    // Sheen overlay
    const sheen = this.scene.add.graphics();
    this.drawRoundRect(sheen, cx - btnW / 2, btnY - btnH / 2, btnW, btnH / 2, 10, 0xffffff, 0.08);
    elements.push(sheen);

    // Button label
    const btnLabel = this.scene.add
      .text(cx, btnY, "START PLAYING", {
        fontFamily: "'Orbitron', monospace",
        fontSize: mobile ? "16px" : "18px",
        fontStyle: "bold",
        color: "#0a0d14",
        letterSpacing: 2,
      })
      .setOrigin(0.5);
    elements.push(btnLabel);

    // Invisible hit area
    const btnHit = this.scene.add
      .rectangle(cx, btnY, btnW, btnH)
      .setOrigin(0.5)
      .setAlpha(0.001)
      .setInteractive({ useHandCursor: true });
    elements.push(btnHit);

    // Button interactions
    btnHit.on("pointerover", () => {
      this.scene.tweens.add({ targets: btnBg, alpha: 0.85, duration: 150 });
      this.scene.tweens.add({ targets: btnLabel, scaleX: 1.04, scaleY: 1.04, duration: 150, ease: "Back.Out" });
    });
    btnHit.on("pointerout", () => {
      this.scene.tweens.add({ targets: btnBg, alpha: 1, duration: 150 });
      this.scene.tweens.add({ targets: btnLabel, scaleX: 1, scaleY: 1, duration: 150 });
    });
    btnHit.on("pointerdown", () => {
      this.scene.tweens.add({ targets: [btnBg, btnLabel], scaleX: 0.96, scaleY: 0.96, duration: 80, ease: "Quad.In" });
    });
    btnHit.on("pointerup", () => {
      this.scene.tweens.add({
        targets: [btnBg, btnLabel],
        scaleX: 1,
        scaleY: 1,
        duration: 80,
        ease: "Quad.Out",
        onComplete: () => { this.hide(); onClose(); },
      });
    });

    // Pulsing glow ring under button
    const glowRing = this.scene.add.graphics();
    glowRing.lineStyle(6, C.accent, 0.18);
    glowRing.strokeRoundedRect(cx - btnW / 2 - 6, btnY - btnH / 2 - 6, btnW + 12, btnH + 12, 14);
    elements.push(glowRing);

    this.track(this.scene.tweens.add({
      targets: glowRing,
      alpha: { from: 0.5, to: 0 },
      scaleX: 1.08,
      scaleY: 1.2,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    }));

    // ── 6. Panel entrance ───────────────────────────────────────────────────
    const panelItems = [card, highlight, iconCircle, iconEmoji, titleText, subtitleText, divider, btnBg, sheen, btnLabel, btnHit, glowRing];
    panelItems.forEach(el => {
      if ('setAlpha' in el) (el as any).setAlpha(0);
      if ('setScale' in el) (el as any).setScale(0.92);
    });

    this.track(this.scene.tweens.add({
      targets: panelItems,
      alpha: 1,
      scale: 1,
      duration: 420,
      delay: 80,
      ease: "Back.Out(1.4)",
    }));

    // ── 7. Container ────────────────────────────────────────────────────────
    this.container = this.scene.add.container(0, 0, elements);
    this.container.setDepth(9999);
  }

  hide() {
    if (!this.container) return;
    this.scene.tweens.add({
      targets: this.container.list,
      alpha: 0,
      scale: 0.94,
      duration: 280,
      ease: "Cubic.In",
      onComplete: () => this.container?.setVisible(false),
    });
  }

  destroy() {
    this.tweens.forEach(t => t.remove());
    this.tweens = [];
    this.container?.destroy(true);
    this.container = undefined;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Keep tween refs so we can clean up on destroy. */
  private track(tween: Phaser.Tweens.Tween) {
    this.tweens.push(tween);
    return tween;
  }

  /**
   * Draw a filled rounded rectangle via Phaser Graphics.
   * Phaser 3's `fillRoundedRect` handles the radius natively.
   */
  private drawRoundRect(
    g: Phaser.GameObjects.Graphics,
    x: number, y: number, w: number, h: number,
    r: number, color: number, alpha: number
  ) {
    g.fillStyle(color, alpha);
    g.fillRoundedRect(x, y, w, h, r);
  }
}