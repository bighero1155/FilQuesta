// GameOver.ts
import Phaser from "phaser";

export default class GameOver {
  private scene: Phaser.Scene;
  private container?: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  private isMobile(): boolean {
    return this.scene.scale.width < 768;
  }

  show(onRestart: () => void) {
    const { width, height } = this.scene.cameras.main;
    const isMobile = this.isMobile();

    // Semi-transparent dark background
    const bg = this.scene.add
      .rectangle(0, 0, width, height, 0x000000, 0.7)
      .setOrigin(0);

    // Panel - responsive size
    const panelWidth = isMobile ? width * 0.85 : width * 0.65;
    const panelHeight = isMobile ? height * 0.6 : height * 0.5;
    
    const panel = this.scene.add
      .rectangle(width / 2, height / 2, panelWidth, panelHeight, 0xffffff, 1)
      .setStrokeStyle(isMobile ? 3 : 4, 0xaa0000);

    // Title - responsive size and position
    const titleSize = isMobile ? "28px" : "40px";
    const titleY = isMobile ? height / 2 - 100 : height / 2 - 120;
    
    const title = this.scene.add
      .text(width / 2, titleY, "❌ Game Over", {
        fontSize: titleSize,
        fontStyle: "bold",
        color: "#aa0000",
      })
      .setOrigin(0.5);

    // Message - responsive size and position
    const messageSize = isMobile ? "16px" : "22px";
    const messageY = isMobile ? height / 2 - 20 : height / 2 - 30;
    const messageWrapWidth = isMobile ? width * 0.7 : width * 0.55;
    
    const message = this.scene.add
      .text(
        width / 2,
        messageY,
        [
          "You ran out of time!",
          "⏱ The body parts were not placed in time.",
          "",
          "👉 Try again and be quicker next round!",
        ],
        {
          fontSize: messageSize,
          color: "#333333",
          align: "center",
          wordWrap: { width: messageWrapWidth },
        }
      )
      .setOrigin(0.5);

    // Restart button - responsive size and position
    const btnSize = isMobile ? "22px" : "28px";
    const btnPadding = isMobile ? { x: 18, y: 10 } : { x: 24, y: 12 };
    const btnY = isMobile ? height / 2 + 110 : height / 2 + 130;
    
    const restartBtn = this.scene.add
      .text(width / 2, btnY, "🔁 Restart", {
        fontSize: btnSize,
        fontStyle: "bold",
        backgroundColor: "#0077ff",
        color: "#ffffff",
        padding: btnPadding,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        restartBtn.setBackgroundColor("#0066dd");
      })
      .on("pointerout", () => {
        restartBtn.setBackgroundColor("#0077ff");
      })
      .on("pointerup", () => {
        this.destroy();
        onRestart();
      });

    // Group all into container
    this.container = this.scene.add.container(0, 0, [
      bg,
      panel,
      title,
      message,
      restartBtn,
    ]);
    this.container.setDepth(9999);
  }

  destroy() {
    this.container?.destroy(true);
  }
}