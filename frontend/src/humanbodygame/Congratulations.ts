// src/humanbodygame/Congratulations.ts
import Phaser from "phaser";

export default class Congratulations {
  private scene: Phaser.Scene;
  private container?: Phaser.GameObjects.Container;
  private confettiTimer?: Phaser.Time.TimerEvent;
  private decorations: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(onClose?: () => void) {
    const { width, height } = this.scene.cameras.main;

    this.container = this.scene.add.container(0, 0).setDepth(20000);

    // Responsive sizing
    const isMobile = width < 768;

    // Soft background overlay with gradient effect
    const bg = this.scene.add
      .rectangle(0, 0, width, height, 0x1a1a2e, 0.85)
      .setOrigin(0);
    this.container.add(bg);

    // Create pixelated rounded panel background (responsive)
    const basePanelWidth = isMobile ? Math.min(width - 40, 500) : 600;
    const basePanelHeight = isMobile ? Math.min(height - 100, 500) : 400;
    const panelWidth = basePanelWidth;
    const panelHeight = basePanelHeight;
    const panelX = width / 2;
    const panelY = height / 2;

    const panel = this.createPixelatedRoundedRect(
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      20,
      0x4a5899
    );
    this.container.add(panel);

    // Inner panel for depth
    const innerPanel = this.createPixelatedRoundedRect(
      panelX,
      panelY,
      panelWidth - 20,
      panelHeight - 20,
      16,
      0x5a68a9
    );
    this.container.add(innerPanel);

    // Pixelated font styling (responsive)
    const titleFontSize = isMobile ? "32px" : "48px";
    const pixelFontStyle = {
      fontFamily: 'Courier New, monospace',
      fontSize: titleFontSize,
      fontStyle: "bold",
      color: "#fff4d9",
      align: "center" as const,
    };

    // Congrats text with pixel effect
    const titleY = isMobile ? height / 2 - panelHeight / 2 + 60 : height / 2 - 120;
    const text = this.scene.add
      .text(width / 2, titleY, "CONGRATULATIONS!", pixelFontStyle)
      .setOrigin(0.5)
      .setDepth(20001)
      .setStroke('#8b4513', isMobile ? 3 : 4)
      .setWordWrapWidth(panelWidth - 40);
    this.container.add(text);

    // Animated stars decoration (responsive positioning)
    const starOffset = isMobile ? 120 : 250;
    const starSize = isMobile ? 0.7 : 1;
    const star1 = this.createPixelStar(width / 2 - starOffset, titleY, 0xffeb3b);
    const star2 = this.createPixelStar(width / 2 + starOffset, titleY, 0xffeb3b);
    star1.setScale(starSize);
    star2.setScale(starSize);
    this.container.add(star1);
    this.container.add(star2);

    this.scene.tweens.add({
      targets: [star1, star2],
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Sub-message with pixel styling (responsive)
    const subTextY = isMobile ? height / 2 - 10 : height / 2 - 30;
    const subText2Y = isMobile ? height / 2 + 30 : height / 2 + 20;
    const subFontSize = isMobile ? "20px" : "28px";
    const subFont2Size = isMobile ? "18px" : "24px";
    
    const subText = this.scene.add
      .text(
        width / 2,
        subTextY,
        "You completed the level!",
        {
          fontFamily: 'Courier New, monospace',
          fontSize: subFontSize,
          fontStyle: "bold",
          color: "#a7f3d0",
          align: "center" as const,
          wordWrap: { width: panelWidth - 60 },
        }
      )
      .setOrigin(0.5);
    this.container.add(subText);

    const subText2 = this.scene.add
      .text(
        width / 2,
        subText2Y,
        "Great job exploring!",
        {
          fontFamily: 'Courier New, monospace',
          fontSize: subFont2Size,
          color: "#fde68a",
          align: "center" as const,
          wordWrap: { width: panelWidth - 60 },
        }
      )
      .setOrigin(0.5);
    this.container.add(subText2);

    // Pixelated close button (responsive)
    const btnWidth = isMobile ? 140 : 180;
    const btnHeight = isMobile ? 50 : 60;
    const btnY = isMobile ? height / 2 + panelHeight / 2 - 60 : height / 2 + 130;
    const btnFontSize = isMobile ? "24px" : "32px";
    
    const closeButton = this.createPixelatedRoundedRect(
      width / 2,
      btnY,
      btnWidth,
      btnHeight,
      12,
      0xef4444
    );
    closeButton.setInteractive(
      new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight),
      Phaser.Geom.Rectangle.Contains
    );
    closeButton.on("pointerover", () => {
      this.scene.tweens.add({
        targets: closeButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
      });
    });
    closeButton.on("pointerout", () => {
      this.scene.tweens.add({
        targets: closeButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });
    closeButton.on("pointerup", () => {
      this.destroy();
      if (onClose) onClose();
    });
    this.container.add(closeButton);

    const closeBtnText = this.scene.add
      .text(width / 2, btnY, "CLOSE", {
        fontFamily: 'Courier New, monospace',
        fontSize: btnFontSize,
        fontStyle: "bold",
        color: "#ffffff",
        align: "center" as const,
      })
      .setOrigin(0.5);
    this.container.add(closeBtnText);

    // Pixelated balloons floating up (responsive count and size)
    const balloonCount = isMobile ? 3 : 5;
    const balloonScale = isMobile ? 0.8 : 1;
    
    for (let i = 0; i < balloonCount; i++) {
      const balloon = this.createPixelBalloon(
        Phaser.Math.Between(100, width - 100),
        height + Phaser.Math.Between(50, 150)
      );
      balloon.setScale(balloonScale);
      this.scene.tweens.add({
        targets: balloon,
        y: -100,
        duration: Phaser.Math.Between(6000, 10000),
        repeat: -1,
        delay: i * 800,
        ease: 'Sine.easeInOut',
      });
      this.decorations.push(balloon);
      this.container.add(balloon);
    }

    // Pixelated confetti spawn (responsive spawn rate)
    const confettiDelay = isMobile ? 250 : 150;
    const confettiScale = isMobile ? 0.8 : 1;
    
    this.confettiTimer = this.scene.time.addEvent({
      delay: confettiDelay,
      loop: true,
      callback: () => {
        const x = Phaser.Math.Between(0, width);
        const y = -20;
        const confetti = this.createPixelConfetti(x, y);
        confetti.setScale(confettiScale);
        
        this.scene.physics.add.existing(confetti);
        const body = confetti.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(
          Phaser.Math.Between(-80, 80),
          Phaser.Math.Between(100, 250)
        );
        body.setAllowGravity(false);
        body.setAngularVelocity(Phaser.Math.Between(-200, 200));

        this.scene.time.delayedCall(5000, () => confetti.destroy());
        this.container?.add(confetti);
      },
    });
  }

  // Helper to create pixelated rounded rectangles
  private createPixelatedRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    color: number
  ): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(color, 1);
    
    // Pixelated rounded corners using small rectangles
    const cornerSize = radius;
    
    // Main body
    graphics.fillRect(-width / 2 + cornerSize, -height / 2, width - cornerSize * 2, height);
    graphics.fillRect(-width / 2, -height / 2 + cornerSize, width, height - cornerSize * 2);
    
    // Corners (pixelated rounding)
    const steps = 4;
    for (let i = 0; i < steps; i++) {
      const offset = (cornerSize / steps) * i;
      const size = cornerSize - offset * 2;
      
      // Top-left
      graphics.fillRect(-width / 2 + offset, -height / 2 + offset, size, size / steps);
      // Top-right
      graphics.fillRect(width / 2 - cornerSize + offset, -height / 2 + offset, size, size / steps);
      // Bottom-left
      graphics.fillRect(-width / 2 + offset, height / 2 - cornerSize + offset, size, size / steps);
      // Bottom-right
      graphics.fillRect(width / 2 - cornerSize + offset, height / 2 - cornerSize + offset, size, size / steps);
    }
    
    graphics.setPosition(x, y);
    return graphics;
  }

  // Create a pixelated star shape
  private createPixelStar(x: number, y: number, color: number): Phaser.GameObjects.Graphics {
    const star = this.scene.add.graphics();
    star.fillStyle(color, 1);
    
    // Pixel art star pattern
    const pixelSize = 4;
    const pattern = [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
    ];
    
    pattern.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          star.fillRect(
            colIndex * pixelSize - 10,
            rowIndex * pixelSize - 10,
            pixelSize,
            pixelSize
          );
        }
      });
    });
    
    star.setPosition(x, y);
    return star;
  }

  // Create pixelated balloon
  private createPixelBalloon(x: number, y: number): Phaser.GameObjects.Graphics {
    const balloon = this.scene.add.graphics();
    const colors = [0xff6b9d, 0x4ecdc4, 0xffe66d, 0xa8e6cf, 0xff8b94];
    const color = colors[Phaser.Math.Between(0, colors.length - 1)];
    
    balloon.fillStyle(color, 1);
    
    // Balloon body (pixelated oval)
    const pixelSize = 3;
    const pattern = [
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ];
    
    pattern.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          balloon.fillRect(
            colIndex * pixelSize,
            rowIndex * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      });
    });
    
    // String
    balloon.lineStyle(2, 0x666666);
    balloon.lineBetween(7.5, 21, 7.5, 35);
    
    balloon.setPosition(x, y);
    return balloon;
  }

  // Create pixelated confetti
  private createPixelConfetti(x: number, y: number): Phaser.GameObjects.Graphics {
    const confetti = this.scene.add.graphics();
    const colors = [0xff6b9d, 0x4ecdc4, 0xffe66d, 0xa8e6cf, 0xff8b94, 0xc7b3ff];
    const color = colors[Phaser.Math.Between(0, colors.length - 1)];
    
    confetti.fillStyle(color, 1);
    
    // Simple pixel shapes
    const shapes = [
      [[1, 1], [1, 1]], // square
      [[0, 1, 0], [1, 1, 1], [0, 1, 0]], // plus
      [[1, 0], [1, 1]], // L-shape
      [[1, 1, 1]], // line
    ];
    
    const pattern = shapes[Phaser.Math.Between(0, shapes.length - 1)];
    const pixelSize = 3;
    
    pattern.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          confetti.fillRect(
            colIndex * pixelSize,
            rowIndex * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      });
    });
    
    confetti.setPosition(x, y);
    return confetti;
  }

  destroy() {
    if (this.confettiTimer) {
      this.confettiTimer.remove(false);
      this.confettiTimer = undefined;
    }

    this.decorations.forEach((d) => d.destroy());
    this.decorations = [];

    if (this.container) {
      this.container.destroy(true);
      this.container = undefined;
    }
  }
}