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
        0%, 100% {
          transform: translateY(0) rotate(0deg);
        }
        25% {
          transform: translateY(-30px) rotate(5deg);
        }
        50% {
          transform: translateY(-50px) rotate(-5deg);
        }
        75% {
          transform: translateY(-30px) rotate(3deg);
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.05;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.1;
        }
      }

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

      .main-title {
        font-size: 65px;
        text-shadow: 0 0 12px #22c1c3, 0 0 24px #2d86fd;
        margin-top: 0;
      }

      .quote-carousel {
        text-align: center;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
      }

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
      @media (min-width: 769px) {
        .game-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .game-card:hover {
          transform: scale(1.06);
          box-shadow: 0 12px 30px rgba(255, 255, 255, 0.45);
        }
      }

      /* Tablet breakpoint */
      @media (max-width: 900px) {
        .game-grid {
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 25px;
        }
      }

      /* Mobile breakpoint */
      @media (max-width: 768px) {
        .content-area {
          padding-left: 20px !important;
          padding-right: 20px;
          padding-top: 80px !important;
          gap: 20px;
        }

        .enter-code-top {
          top: auto;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          right: auto;
          width: calc(100% - 40px);
          max-width: 320px;
          z-index: 950;
        }

        .main-title {
          font-size: 42px;
          margin-top: 0;
          order: -2;
        }

        .quote-carousel {
          font-size: 13px;
          line-height: 1.6;
          order: -1;
        }

        .game-grid {
          order: 1;
        }
      }

      /* Small mobile breakpoint */
      @media (max-width: 600px) {
        .content-area {
          padding-top: 90px !important;
        }

        .main-title {
          font-size: 32px;
        }

        .quote-carousel {
          font-size: 11px;
        }

        .game-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .enter-code-top {
          width: calc(100% - 30px);
          max-width: 300px;
          padding: 12px;
          bottom: 15px;
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

      /* Extra small mobile */
      @media (max-width: 400px) {
        .content-area {
          padding-top: 100px !important;
        }

        .main-title {
          font-size: 28px;
        }

        .quote-carousel {
          font-size: 10px;
        }

        .enter-code-top {
          bottom: 12px;
          max-width: 280px;
        }
      }
    `}</style>
  );
};

export default LandingPageCSS;