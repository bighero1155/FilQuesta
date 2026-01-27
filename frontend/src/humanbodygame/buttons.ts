// HumanSceneButtons.ts
import Phaser from "phaser";

interface ButtonConfig {
  x: number;
  y: number;
  text: string;
  bgColor: string;
  hoverColor: string;
  callback: () => void;
  width?: number;
  height?: number;
}

export default class HumanSceneButtons {
  private scene: Phaser.Scene;
  public restartButton!: Phaser.GameObjects.Container;
  public nextLevelButton!: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createButtons(
    centerX: number,
    centerY: number,
    callbacks: {
      onRestart: () => void;
      onNextLevel: () => void;
    }
  ) {
    // Restart Button
    this.restartButton = this.createPixelButton({
      x: centerX,
      y: centerY + 50,
      text: "RESTART",
      bgColor: "#ff6b6b",
      hoverColor: "#ff5252",
      callback: callbacks.onRestart,
      width: 240,
      height: 70,
    });

    // Next Level Button
    this.nextLevelButton = this.createPixelButton({
      x: centerX,
      y: centerY + 140,
      text: "NEXT LEVEL",
      bgColor: "#4ecdc4",
      hoverColor: "#45b7af",
      callback: callbacks.onNextLevel,
      width: 240,
      height: 70,
    });
  }

  private createPixelButton(config: ButtonConfig): Phaser.GameObjects.Container {
    const {
      x,
      y,
      text,
      bgColor,
      hoverColor,
      callback,
      width = 240,
      height = 70,
    } = config;

    const borderSize = 4;

    // Create a rectangle sprite that will be the interactive area
    const hitArea = this.scene.add.rectangle(x, y, width, height);
    hitArea.setOrigin(0.5);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.setVisible(false); // Make it invisible but still interactive
    hitArea.setDepth(10001); // Above the container

    // Create container for visual elements only
    const container = this.scene.add.container(x, y);

    // Create pixelated border (outer dark border)
    const outerBorder = this.scene.add.graphics();
    outerBorder.fillStyle(0x000000, 1);
    outerBorder.fillRect(
      -width / 2 - borderSize,
      -height / 2 - borderSize,
      width + borderSize * 2,
      height + borderSize * 2
    );

    // Create main button background
    const bg = this.scene.add.graphics();
    bg.fillStyle(parseInt(bgColor.replace("#", "0x")), 1);
    bg.fillRect(-width / 2, -height / 2, width, height);

    // Create highlight (top-left lighter edge for 3D effect)
    const highlight = this.scene.add.graphics();
    highlight.lineStyle(3, 0xffffff, 0.3);
    highlight.beginPath();
    highlight.moveTo(-width / 2, height / 2);
    highlight.lineTo(-width / 2, -height / 2);
    highlight.lineTo(width / 2, -height / 2);
    highlight.strokePath();

    // Create shadow (bottom-right darker edge for 3D effect)
    const shadow = this.scene.add.graphics();
    shadow.lineStyle(3, 0x000000, 0.3);
    shadow.beginPath();
    shadow.moveTo(width / 2, -height / 2);
    shadow.lineTo(width / 2, height / 2);
    shadow.lineTo(-width / 2, height / 2);
    shadow.strokePath();

    // Create button text with pixelated font
    const buttonText = this.scene.add
      .text(0, 0, text, {
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        fontSize: "20px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Add visual elements to container
    container.add([outerBorder, bg, highlight, shadow, buttonText]);
    container.setDepth(10000);
    container.setVisible(false);

    // Track if button is being hovered
    let isHovered = false;
    const originalY = y;

    // Hover effects - using hitArea instead of container
    hitArea.on("pointerover", () => {
      isHovered = true;
      bg.clear();
      bg.fillStyle(parseInt(hoverColor.replace("#", "0x")), 1);
      bg.fillRect(-width / 2, -height / 2, width, height);
      
      this.scene.tweens.add({
        targets: [container, hitArea],
        y: originalY - 5,
        duration: 100,
        ease: "Power1",
      });
    });

    hitArea.on("pointerout", () => {
      isHovered = false;
      bg.clear();
      bg.fillStyle(parseInt(bgColor.replace("#", "0x")), 1);
      bg.fillRect(-width / 2, -height / 2, width, height);
      
      this.scene.tweens.add({
        targets: [container, hitArea],
        y: originalY,
        duration: 100,
        ease: "Power1",
      });
    });

    hitArea.on("pointerdown", () => {
      this.scene.tweens.add({
        targets: [container, hitArea],
        y: originalY + 3,
        duration: 50,
        ease: "Power1",
      });
    });

    hitArea.on("pointerup", () => {
      // Return to hover or normal state
      const targetY = isHovered ? originalY - 5 : originalY;
      
      this.scene.tweens.add({
        targets: [container, hitArea],
        y: targetY,
        duration: 50,
        ease: "Power1",
        onComplete: callback,
      });
    });

    // Store hitArea reference in container for visibility control
    (container as any).hitArea = hitArea;

    return container;
  }

  showButtons(showNextLevel: boolean = false) {
    this.restartButton.setVisible(true);
    (this.restartButton as any).hitArea.setVisible(true);
    
    if (showNextLevel) {
      this.nextLevelButton.setVisible(true);
      (this.nextLevelButton as any).hitArea.setVisible(true);
    }
  }

  hideButtons() {
    this.restartButton.setVisible(false);
    (this.restartButton as any).hitArea.setVisible(false);
    
    this.nextLevelButton.setVisible(false);
    (this.nextLevelButton as any).hitArea.setVisible(false);
  }
}