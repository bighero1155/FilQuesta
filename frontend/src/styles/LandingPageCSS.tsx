import React from 'react';

const LandingPageCSS: React.FC = () => {
  return (
    <style>{`
      body {
        font-family: "Press Start 2P", monospace;
        background: linear-gradient(135deg, #22c1c3, #2d86fd);
        background-attachment: fixed;
        color: white;
        margin: 0;
      }

      .landing-layout {
        display: flex;
        min-height: 100vh;
        width: 100%;
        position: relative;
        overflow: hidden;
      }

      /* Animated Background Elements */
      .landing-bg-elements {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
        pointer-events: none;
      }

      .game-icon {
        position: absolute;
        font-size: 4.5rem;
        opacity: 0.15;
        animation: float 20s infinite ease-in-out;
      }

      .game-icon-1 { top: 8%; left: 12%; animation-delay: 0s; }
      .game-icon-2 { top: 65%; left: 8%; animation-delay: 3s; }
      .game-icon-3 { top: 18%; right: 23%; animation-delay: 1.5s; }
      .game-icon-4 { bottom: 12%; right: 18%; animation-delay: 4s; }
      .game-icon-5 { top: 75%; right: 28%; animation-delay: 2s; }
      .game-icon-6 { bottom: 35%; left: 22%; animation-delay: 5s; }
      .game-icon-7 { top: 42%; left: 7%; animation-delay: 6s; }
      .game-icon-8 { bottom: 45%; right: 6%; animation-delay: 7s; }
      .game-icon-9 { top: 28%; left: 35%; animation-delay: 8s; }
      .game-icon-10 { bottom: 55%; right: 38%; animation-delay: 9s; }
      .game-icon-11 { top: 82%; left: 45%; animation-delay: 10s; }
      .game-icon-12 { top: 12%; right: 42%; animation-delay: 11s; }
      .game-icon-13 { bottom: 22%; left: 18%; animation-delay: 12s; }
      .game-icon-14 { top: 52%; right: 12%; animation-delay: 13s; }
      .game-icon-15 { bottom: 58%; left: 38%; animation-delay: 14s; }
      .game-icon-16 { top: 32%; left: 52%; animation-delay: 15s; }

      .bg-circle {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        animation: pulse 15s infinite ease-in-out;
      }

      .bg-circle-1 {
        width: 300px;
        height: 300px;
        top: -100px;
        right: -100px;
      }

      .bg-circle-2 {
        width: 400px;
        height: 400px;
        bottom: -150px;
        left: -150px;
        animation-delay: 3s;
      }

      .bg-circle-3 {
        width: 250px;
        height: 250px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: 1.5s;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-30px) rotate(5deg); }
        50% { transform: translateY(-50px) rotate(-5deg); }
        75% { transform: translateY(-30px) rotate(3deg); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.05; }
        50% { transform: scale(1.1); opacity: 0.1; }
      }

      /* ============================
         CONTENT AREA — Desktop
      ============================ */
      .content-area {
        flex: 1;
        padding: 60px 20px;
        padding-left: calc(290px + 20px);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
        position: relative;
        z-index: 5;
      }

      /* ============================
         FLOATING QUIZ CODE BOX
      ============================ */
      .enter-code-top {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
        padding: 14px;
        border-radius: 14px;
        width: 230px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        z-index: 900;
        border: 1px solid rgba(255, 255, 255, 0.25);
      }

      .enter-code-input {
        width: 100%;
        height: 38px;
        background: rgba(255, 255, 255, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        padding: 0 10px;
        color: white;
        font-size: 12px;
        box-sizing: border-box;
      }

      .enter-code-input::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }

      .enter-code-input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .enter-code-btn {
        width: 100%;
        height: 38px;
        margin-top: 8px;
        background: linear-gradient(135deg, #22c1c3, #2d86fd);
        border: none;
        color: white;
        border-radius: 8px;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }

      .enter-code-btn:hover:not(:disabled) {
        opacity: 0.9;
      }

      .enter-code-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .enter-code-error {
        font-size: 10px;
        color: #ffb3b3;
        margin-top: 4px;
        text-align: center;
      }

      /* ============================
         TITLE & QUOTE
      ============================ */
      .main-title-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        text-align: center;
      }

      .main-title {
        font-size: 48px;
        text-shadow: 0 0 12px #22c1c3, 0 0 24px #2d86fd;
        margin: 0;
      }

      .quote-carousel {
        text-align: center;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
      }

      /* ============================
         GAME GRID
      ============================ */
      .game-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 40px;
        width: 100%;
        max-width: 850px;
      }

      .game-card {
        border-radius: 20px;
        border: 2px solid white;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.25);
        cursor: pointer;
      }

      .game-card img {
        width: 100%;
        display: block;
      }

      .game-label {
        background: rgba(0, 0, 0, 0.6);
        padding: 10px;
        text-align: center;
      }

      /* Desktop hover effects */
      @media (min-width: 1025px) {
        .game-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .game-card:hover {
          transform: scale(1.06);
          box-shadow: 0 12px 30px rgba(255, 255, 255, 0.45);
        }
      }

      /* ============================
         TABLET / iPAD (768px–1024px)
         Sidebar is collapsed/icon-only
         or overlaid — content needs
         full width with top padding
      ============================ */
      @media (min-width: 768px) and (max-width: 1024px) {
        .content-area {
          padding-left: 20px !important;
          padding-right: 20px !important;
          padding-top: 100px !important;
          gap: 24px;
        }

        /* Move enter code box below the top nav bar, left-aligned */
        .enter-code-top {
          position: fixed;
          top: 16px;
          right: 16px;
          width: 210px;
          padding: 12px;
          z-index: 950;
        }

        .main-title {
          font-size: 36px;
        }

        .quote-carousel {
          font-size: 13px;
          line-height: 1.7;
          padding: 0 10px;
          text-align: center;
        }

        .game-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          max-width: 100%;
        }
      }

      /* iPads in portrait that are a bit narrower */
      @media (min-width: 768px) and (max-width: 900px) {
        .enter-code-top {
          top: 12px;
          right: 12px;
          width: 190px;
        }

        .main-title {
          font-size: 30px;
        }

        .game-grid {
          gap: 18px;
        }
      }

      /* ============================
         MOBILE (max 767px)
      ============================ */
      @media (max-width: 767px) {
        .content-area {
          padding-left: 16px !important;
          padding-right: 16px !important;
          padding-top: 80px !important;
          padding-bottom: 140px !important; /* space for bottom enter-code box */
          gap: 20px;
        }

        /* Stick enter-code to bottom on mobile */
        .enter-code-top {
          position: fixed;
          top: auto;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          right: auto;
          width: calc(100% - 40px);
          max-width: 360px;
          z-index: 950;
          padding: 12px 14px;
        }

        .main-title {
          font-size: 28px;
        }

        .quote-carousel {
          font-size: 12px;
          line-height: 1.7;
          padding: 0 8px;
          text-align: center;
        }

        .game-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          max-width: 100%;
        }

        .game-label {
          font-size: 11px;
          padding: 8px 6px;
        }
      }

      /* ============================
         SMALL MOBILE (max 500px)
      ============================ */
      @media (max-width: 500px) {
        .content-area {
          padding-top: 70px !important;
          padding-bottom: 150px !important;
          gap: 16px;
        }

        .main-title {
          font-size: 22px;
        }

        .quote-carousel {
          font-size: 10px;
        }

        .game-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .enter-code-top {
          width: calc(100% - 30px);
          max-width: 320px;
          bottom: 15px;
          padding: 12px;
        }

        .enter-code-input {
          height: 42px;
          font-size: 13px;
        }

        .enter-code-btn {
          height: 42px;
          font-size: 12px;
        }
      }

      /* ============================
         EXTRA SMALL (max 380px)
      ============================ */
      @media (max-width: 380px) {
        .content-area {
          padding-top: 65px !important;
          padding-bottom: 155px !important;
        }

        .main-title {
          font-size: 18px;
        }

        .quote-carousel {
          font-size: 9px;
        }

        .enter-code-top {
          bottom: 12px;
          max-width: 290px;
        }
      }
    `}</style>
  );
};

export default LandingPageCSS;