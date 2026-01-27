// src/HistoryPortal/design.ts - Game Design System

export interface TextStyleConfig {
  fontSize: string;
  color: string;
  fontFamily?: string;
  fontStyle?: string;
  align?: string;
  stroke?: string;
  strokeThickness?: number;
  shadow?: {
    offsetX: number;
    offsetY: number;
    color: string;
    blur: number;
    stroke: boolean;
    fill: boolean;
  };
  wordWrap?: { width: number };
  padding?: { x: number; y: number };
  backgroundColor?: string;
}

export interface CategoryTheme {
  background: string;
  gradient: { top: string; bottom: string };
  primary: string;
  secondary: string;
  accent: string;
  displayName: string;
  emoji: string;
}

// Category Themes
export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  BASIC: {
    background: "#1a2332",
    gradient: { top: "#0f1419", bottom: "#1a2332" },
    primary: "#4ade80",
    secondary: "#22c55e",
    accent: "#86efac",
    displayName: "BASIC",
    emoji: "🟢"
  },
  NORMAL: {
    background: "#2d1b4e",
    gradient: { top: "#1a0f2e", bottom: "#2d1b4e" },
    primary: "#60a5fa",
    secondary: "#3b82f6",
    accent: "#93c5fd",
    displayName: "NORMAL",
    emoji: "🔵"
  },
  HARD: {
    background: "#3d1e1e",
    gradient: { top: "#2d0f0f", bottom: "#3d1e1e" },
    primary: "#f87171",
    secondary: "#ef4444",
    accent: "#fca5a5",
    displayName: "HARD",
    emoji: "🔴"
  },
  ADVANCED: {
    background: "#2d2416",
    gradient: { top: "#1d1409", bottom: "#2d2416" },
    primary: "#fb923c",
    secondary: "#f97316",
    accent: "#fdba74",
    displayName: "ADVANCED",
    emoji: "🟠"
  },
  EXPERT: {
    background: "#1e1e2d",
    gradient: { top: "#0f0f1a", bottom: "#1e1e2d" },
    primary: "#a78bfa",
    secondary: "#8b5cf6",
    accent: "#c4b5fd",
    displayName: "EXPERT",
    emoji: "💀"
  }
};

// Font Configuration
export const FONTS = {
  primary: "'Press Start 2P', 'Courier New', monospace",
  secondary: "'Orbitron', 'Arial Black', sans-serif",
  body: "'Rajdhani', 'Arial', sans-serif"
};

// Responsive Text Styles
export const TEXT_STYLES = {
  // Title Styles
  title: {
    desktop: {
      fontSize: "32px",
      fontFamily: FONTS.secondary,
      color: "#ffffff",
      fontStyle: "bold",
      align: "center",
      stroke: "#000000",
      strokeThickness: 6,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: "#000000",
        blur: 8,
        stroke: true,
        fill: true
      }
    } as TextStyleConfig,
    mobile: {
      fontSize: "20px",
      fontFamily: FONTS.secondary,
      color: "#ffffff",
      fontStyle: "bold",
      align: "center",
      stroke: "#000000",
      strokeThickness: 4,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: "#000000",
        blur: 6,
        stroke: true,
        fill: true
      }
    } as TextStyleConfig,
    mobilePortrait: {
      fontSize: "18px",
      fontFamily: FONTS.secondary,
      color: "#ffffff",
      fontStyle: "bold",
      align: "center",
      stroke: "#000000",
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 4,
        stroke: true,
        fill: true
      }
    } as TextStyleConfig
  },

  // Question Styles
  question: {
    desktop: {
      fontSize: "22px",
      fontFamily: FONTS.body,
      color: "#7FFF00",
      fontStyle: "bold",
      align: "center",
      stroke: "#0a3d0a",
      strokeThickness: 5,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: "#000000",
        blur: 6,
        stroke: true,
        fill: true
      }
    } as TextStyleConfig,
    mobile: {
      fontSize: "16px",
      fontFamily: FONTS.body,
      color: "#7FFF00",
      fontStyle: "bold",
      align: "center",
      stroke: "#0a3d0a",
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 4,
        stroke: true,
        fill: true
      }
    } as TextStyleConfig,
    mobilePortrait: {
      fontSize: "14px",
      fontFamily: FONTS.body,
      color: "#7FFF00",
      fontStyle: "bold",
      align: "center",
      stroke: "#0a3d0a",
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 4,
        stroke: true,
        fill: true
      }
    } as TextStyleConfig
  },

  // Hint Button Styles
  hintButton: {
    desktop: {
      fontSize: "20px",
      fontFamily: FONTS.body,
      color: "#FFA500",
      fontStyle: "bold",
      align: "center",
      stroke: "#5C3317",
      strokeThickness: 4,
      padding: { x: 15, y: 8 },
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: "#000000",
        blur: 5,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig,
    mobile: {
      fontSize: "16px",
      fontFamily: FONTS.body,
      color: "#FFA500",
      fontStyle: "bold",
      align: "center",
      stroke: "#5C3317",
      strokeThickness: 3,
      padding: { x: 12, y: 6 },
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 4,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig
  },

  // Hint Text Styles
  hintText: {
    desktop: {
      fontSize: "16px",
      fontFamily: FONTS.body,
      color: "#FFE4B5",
      fontStyle: "normal",
      align: "center",
      stroke: "#2a1810",
      strokeThickness: 3,
      padding: { x: 12, y: 8 },
      backgroundColor: "#2a1810"
    } as TextStyleConfig,
    mobile: {
      fontSize: "12px",
      fontFamily: FONTS.body,
      color: "#FFE4B5",
      fontStyle: "normal",
      align: "center",
      stroke: "#2a1810",
      strokeThickness: 2,
      padding: { x: 10, y: 6 },
      backgroundColor: "#2a1810"
    } as TextStyleConfig
  },

  // Item Button Styles
  itemButton: {
    desktop: {
      fontSize: "20px",
      fontFamily: FONTS.primary,
      color: "#ffffff",
      fontStyle: "normal",
      align: "center",
      stroke: "#000000",
      strokeThickness: 4,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: "#000000",
        blur: 0,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig,
    mobile: {
      fontSize: "16px",
      fontFamily: FONTS.primary,
      color: "#ffffff",
      fontStyle: "normal",
      align: "center",
      stroke: "#000000",
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 0,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig
  },

  // Success/Error Feedback
  feedback: {
    desktop: {
      fontSize: "28px",
      fontFamily: FONTS.secondary,
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 5,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: "#000000",
        blur: 8,
        stroke: true,
        fill: true
      }
    } as TextStyleConfig,
    mobile: {
      fontSize: "20px",
      fontFamily: FONTS.secondary,
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 6,
        stroke: true,
        fill: true
      }
    } as TextStyleConfig
  },

  // Navigation Button Styles
  navButton: {
    desktop: {
      fontSize: "20px",
      fontFamily: FONTS.body,
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 3,
      padding: { x: 15, y: 8 },
      backgroundColor: "#4a5568",
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 4,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig,
    mobile: {
      fontSize: "16px",
      fontFamily: FONTS.body,
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 2,
      padding: { x: 10, y: 6 },
      backgroundColor: "#4a5568",
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: "#000000",
        blur: 3,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig
  },

  // Back Button Styles
  backButton: {
    desktop: {
      fontSize: "20px",
      fontFamily: FONTS.body,
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 3,
      padding: { x: 20, y: 10 },
      backgroundColor: "#ff6b6b",
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 4,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig,
    mobile: {
      fontSize: "16px",
      fontFamily: FONTS.body,
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 2,
      padding: { x: 15, y: 8 },
      backgroundColor: "#ff6b6b",
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: "#000000",
        blur: 3,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig
  },

  // Level Indicator
  levelIndicator: {
    desktop: {
      fontSize: "18px",
      fontFamily: FONTS.body,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 4,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig,
    mobile: {
      fontSize: "14px",
      fontFamily: FONTS.body,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: "#000000",
        blur: 3,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig
  },

  // Modal Title
  modalTitle: {
    desktop: {
      fontSize: "42px",
      fontFamily: FONTS.secondary,
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 6,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: "#000000",
        blur: 10,
        stroke: true,
        fill: true
      }
    } as TextStyleConfig,
    mobile: {
      fontSize: "32px",
      fontFamily: FONTS.secondary,
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 5,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: "#000000",
        blur: 8,
        stroke: true,
        fill: true
      }
    } as TextStyleConfig
  },

  // Modal Button
  modalButton: {
    desktop: {
      fontSize: "24px",
      fontFamily: FONTS.body,
      color: "#ffffff",
      fontStyle: "bold",
      padding: { x: 40, y: 15 },
      stroke: "#000000",
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 5,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig,
    mobile: {
      fontSize: "20px",
      fontFamily: FONTS.body,
      color: "#ffffff",
      fontStyle: "bold",
      padding: { x: 30, y: 12 },
      stroke: "#000000",
      strokeThickness: 2,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 4,
        stroke: false,
        fill: true
      }
    } as TextStyleConfig
  }
};

// UI Element Colors
export const UI_COLORS = {
  itemButton: {
    background: null, // No background
    border: 0x4a5568,
    hover: 0x3d4758
  },
  navButton: {
    background: 0x4a5568,
    backgroundHex: "#4a5568"
  },
  backButton: {
    background: 0xff6b6b,
    backgroundHex: "#ff6b6b"
  },
  hintBackground: "#2a1810",
  overlayDark: 0x000000,
  success: {
    modal: 0x00aa66,
    text: "#00ff00",
    particles: 0x00ff88
  },
  failure: {
    modal: 0xcc3344,
    text: "#ff4444"
  }
};

// Animation Configurations
export const ANIMATIONS = {
  itemToPortal: {
    duration: 600,
    ease: "Power2"
  },
  itemReturn: {
    duration: 400,
    ease: "Back.easeOut"
  },
  itemHover: {
    scale: 1.05,
    duration: 150
  },
  buttonHover: {
    scale: 1.1,
    duration: 150
  },
  fadeIn: {
    duration: 400,
    ease: "Back.easeOut"
  },
  successParticles: {
    count: 12,
    duration: 600,
    distance: 100,
    ease: "Cubic.easeOut"
  },
  cameraShake: {
    duration: 300,
    intensity: 0.01
  },
  hintReveal: {
    duration: 300,
    ease: "Back.easeOut"
  },
  hintHide: {
    duration: 200,
    ease: "Sine.easeIn"
  },
  confetti: {
    count: 3,
    interval: 100,
    repeat: 30,
    fallDuration: { min: 2000, max: 3500 },
    wiggleDuration: 800
  }
};

// Layout Configuration
export const LAYOUT = {
  desktop: {
    portalX: 0.7,
    portalY: 0.5,
    portalSize: 400,
    itemX: 0.2,
    itemWidth: 300,
    itemHeight: 60,
    itemStartY: 220,
    itemSpacing: 80,
    titleY: 50,
    questionY: 120,
    hintButtonY: 170,
    navButtonY: 50,
    indicatorY: -200
  },
  mobile: {
    portalX: 0.75,
    portalY: 0.4,
    portalSize: 250,
    itemX: 0.25,
    itemWidth: 0.35,
    itemHeight: 50,
    itemStartY: 0.28,
    itemSpacing: 65,
    titleY: 20,
    questionY: 60,
    hintButtonY: 100,
    navButtonY: 30,
    indicatorY: -40
  },
  mobilePortrait: {
    portalX: 0.5,
    portalY: 0.25,
    portalSize: 200,
    itemX: 0.5,
    itemWidth: 0.85,
    itemHeight: 50,
    itemStartY: 0.5,
    itemSpacing: 70,
    titleY: 30,
    questionY: 90,
    hintButtonY: 140,
    navButtonY: 30,
    indicatorY: 0.4
  }
};

// Helper function to get appropriate text style based on device
export function getTextStyle(
  styleName: keyof typeof TEXT_STYLES,
  isMobile: boolean,
  isPortrait: boolean = false
): TextStyleConfig {
  const styles = TEXT_STYLES[styleName];
  
  if (isMobile && isPortrait && 'mobilePortrait' in styles) {
    return styles.mobilePortrait;
  }
  
  if (isMobile && 'mobile' in styles) {
    return styles.mobile;
  }
  
  return styles.desktop;
}

// Helper function to get category theme
export function getCategoryTheme(categoryId: string): CategoryTheme {
  return CATEGORY_THEMES[categoryId] || CATEGORY_THEMES.BASIC;
}

// Helper function to create gradient background
export function createGradientBackground(
  scene: Phaser.Scene,
  categoryId: string,
  width: number,
  height: number
): Phaser.GameObjects.Rectangle {
  const theme = getCategoryTheme(categoryId);
  
  // Create gradient using Graphics (Phaser doesn't support CSS gradients directly)
  const graphics = scene.add.graphics();
  
  // Create a simple gradient effect by drawing multiple rectangles
  const steps = 20;
  for (let i = 0; i < steps; i++) {
    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.HexStringToColor(theme.gradient.top),
      Phaser.Display.Color.HexStringToColor(theme.gradient.bottom),
      steps,
      i
    );
    
    const rgbColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
    graphics.fillStyle(rgbColor, 1);
    graphics.fillRect(0, (height / steps) * i, width, height / steps + 1);
  }
  
  return scene.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0);
}

// Star field configuration
export const STAR_FIELD = {
  count: 50,
  sizeMin: 1,
  sizeMax: 3,
  opacity: 0.6
};