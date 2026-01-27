// src/utils/responsive.ts
// Helper for dynamic screen scaling and device-specific adjustments.

export const getResponsiveConfig = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Scale adjustment factor (for text, UI, etc.)
  let scale = 1;

  if (width <= 480) {
    // 📱 Small phone
    scale = 0.85;
  } else if (width <= 768) {
    // 📲 Tablet
    scale = 0.95;
  } else if (width <= 1280) {
    // 💻 Laptop
    scale = 1;
  } else {
    // 🖥️ Desktop / Large screens
    scale = 1.15;
  }

  return {
    width,
    height,
    scale,
    isMobile: width <= 768,
    isTablet: width > 768 && width <= 1280,
    isDesktop: width > 1280,
  };
};
