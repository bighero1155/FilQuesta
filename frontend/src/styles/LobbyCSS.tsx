// src/styles/LobbyCSS.tsx
import React from "react";

const LobbyCSS: React.FC = () => {
  return (
    <style>{`
      /* Container */
      .lobby-container {
        min-height: 100vh;
        width: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        overflow: hidden; 
        padding: 80px 20px 100px;
      }

      /* Animated Background Elements */
      .lobby-bg-elements {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 1;
      }

      .quiz-icon {
        position: absolute;
        font-size: 3rem;
        opacity: 0.15;
        animation: float 20s infinite ease-in-out;
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .quiz-icon:hover {
        transform: scale(1.2);
      }

      .quiz-icon-1 {
        top: 10%;
        left: 15%;
        animation-delay: 0s;
      }

      .quiz-icon-2 {
        top: 60%;
        left: 10%;
        animation-delay: 3s;
      }

      .quiz-icon-3 {
        top: 20%;
        right: 20%;
        animation-delay: 1.5s;
      }

      .quiz-icon-4 {
        bottom: 15%;
        right: 15%;
        animation-delay: 4s;
      }

      .quiz-icon-5 {
        top: 70%;
        right: 25%;
        animation-delay: 2s;
      }

      .quiz-icon-6 {
        bottom: 30%;
        left: 25%;
        animation-delay: 5s;
      }

      /* Falling icons (when clicked) */
      .falling-icon {
        position: absolute;
        font-size: 3rem;
        opacity: 0.8;
        pointer-events: none;
        z-index: 50;
      }

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
        animation-delay: 0s;
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

      /* TikTok-style flying icons - Right side */
      .tiktok-flying-icon-right {
        position: fixed;
        right: 10%;
        bottom: -50px;
        font-size: 2.5rem;
        z-index: 100;
        pointer-events: none;
        animation: flyUpTikTokRight 3s ease-out forwards;
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
      }

      /* TikTok-style flying icons - Left side */
      .tiktok-flying-icon-left {
        position: fixed;
        left: 10%;
        bottom: -50px;
        font-size: 2.5rem;
        z-index: 100;
        pointer-events: none;
        animation: flyUpTikTokLeft 3s ease-out forwards;
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
      }

      @keyframes flyUpTikTokRight {
        0% {
          bottom: -50px;
          opacity: 0;
          transform: translateX(0) scale(0.5) rotate(0deg);
        }
        10% {
          opacity: 1;
          transform: translateX(0) scale(1) rotate(10deg);
        }
        25% {
          transform: translateX(-20px) scale(1.1) rotate(-5deg);
        }
        50% {
          transform: translateX(20px) scale(1) rotate(5deg);
        }
        75% {
          transform: translateX(-10px) scale(0.9) rotate(-3deg);
          opacity: 1;
        }
        90% {
          opacity: 0.5;
        }
        100% {
          bottom: 110vh;
          opacity: 0;
          transform: translateX(10px) scale(0.8) rotate(0deg);
        }
      }

      @keyframes flyUpTikTokLeft {
        0% {
          bottom: -50px;
          opacity: 0;
          transform: translateX(0) scale(0.5) rotate(0deg);
        }
        10% {
          opacity: 1;
          transform: translateX(0) scale(1) rotate(-10deg);
        }
        25% {
          transform: translateX(20px) scale(1.1) rotate(5deg);
        }
        50% {
          transform: translateX(-20px) scale(1) rotate(-5deg);
        }
        75% {
          transform: translateX(10px) scale(0.9) rotate(3deg);
          opacity: 1;
        }
        90% {
          opacity: 0.5;
        }
        100% {
          bottom: 110vh;
          opacity: 0;
          transform: translateX(-10px) scale(0.8) rotate(0deg);
        }
      }

      /* Back Button */
      .back-button-wrapper {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 100;
      }

      /* Reactions Container */
      .reactions-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 50;
        overflow: hidden;
      }

      /* Floating Reaction Animation */
      @keyframes smoothFloat {
        0% {
          transform: translateY(0) translateX(0) scale(0.5) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
          transform: translateY(-10vh) translateX(-5px) scale(1) rotate(10deg);
        }
        30% {
          transform: translateY(-30vh) translateX(10px) scale(1.1) rotate(-10deg);
        }
        50% {
          transform: translateY(-50vh) translateX(-8px) scale(1.2) rotate(15deg);
        }
        70% {
          transform: translateY(-70vh) translateX(12px) scale(1.1) rotate(-15deg);
        }
        90% {
          opacity: 0.8;
          transform: translateY(-90vh) translateX(-10px) scale(0.9) rotate(10deg);
        }
        100% {
          opacity: 0;
          transform: translateY(-100vh) translateX(0) scale(0.5) rotate(0deg);
        }
      }

      .floating-reaction {
        position: absolute;
        bottom: 80px;
        font-size: 3rem;
        pointer-events: none;
        animation: smoothFloat 5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        will-change: transform, opacity;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
      }

      /* Main Content */
      .lobby-content {
        width: 100%;
        max-width: 1600px; /* ✅ Increased from 1400px */
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 10;
        position: relative;
      }

      /* Quiz Code Card */
      .quiz-code-card {
        background: rgba(255, 255, 255, 0.95);
        padding: 24px 40px;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        margin-bottom: 32px;
        border: none;
        backdrop-filter: blur(10px);
      }

      .quiz-code-title {
        margin: 0;
        font-size: 1.8rem;
        font-weight: bold;
        color: #667eea;
        text-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
      }

      .quiz-code-value {
        color: #764ba2;
        background: rgba(118, 75, 162, 0.1);
        padding: 4px 16px;
        border-radius: 8px;
      }

      /* Control Buttons */
      .control-buttons {
        margin-bottom: 32px;
      }

      .btn-control {
        padding: 16px 48px;
        font-size: 1.2rem;
        font-weight: bold;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.4s ease;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      }

      .btn-control:hover:not(:disabled) {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
      }

      .btn-control:active:not(:disabled) {
        transform: translateY(-2px) scale(1.02);
      }

      .btn-control:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-start {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .btn-stop {
        background: linear-gradient(135deg, #f093fb, #f5576c);
        color: white;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      /* Participants Grid - ✅✅ EVEN MORE SPACING */
      .participants-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 48px; /* ✅ Increased from 32px to 48px */
        width: 100%;
        padding: 0 40px; /* ✅ Increased from 20px to 40px */
        margin-top: 50px; /* ✅ Increased from 40px to 50px */
        row-gap: 56px; /* ✅ Increased from 40px to 56px */
      }
      
      .participants-grid > * {
        flex: 0 0 auto;
        width: 240px; /* ✅ Increased from 220px to 240px */
      }

      .participant-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px; /* ✅ Increased from 16px */
        padding: 28px; /* ✅ Increased from 24px to 28px */
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        border: none;
        transition: all 0.4s ease;
        backdrop-filter: blur(10px);
        height: 260px; /* ✅ Increased from 240px to 260px */
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .participant-card:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
      }

      .participant-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px; /* ✅ Increased from 16px to 20px */
      }

      /* Avatar Animation */
      @keyframes floatAvatar {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      .participant-avatar {
        animation: floatAvatar 3s ease-in-out infinite;
      }

      .participant-rank {
        font-size: 1.1rem; /* ✅ Increased from 1rem */
        font-weight: bold;
        color: #667eea;
      }

      .score-badge {
        padding: 10px 20px; /* ✅ Increased from 8px 18px */
        border-radius: 20px;
        font-size: 0.95rem; /* ✅ Increased from 0.9rem */
        font-weight: 600;
        color: white;
        transition: all 0.3s ease;
      }

      .score-badge.finished {
        background: linear-gradient(135deg, #667eea, #764ba2);
      }

      .score-badge.pending {
        background: linear-gradient(135deg, #b0b0b0, #808080);
      }

      /* Reaction Bar */
      .reaction-bar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 12px 20px;
        border-radius: 50px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        display: flex;
        gap: 8px;
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
      }

      .reaction-btn {
        background: transparent;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 12px;
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .reaction-btn:hover {
        background: rgba(102, 126, 234, 0.2);
        transform: scale(1.2);
      }

      .reaction-btn:active {
        transform: scale(0.9);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .lobby-container {
          padding: 60px 10px 100px;
        }

        .quiz-icon {
          font-size: 2rem;
        }

        /* TikTok icons - mobile responsive */
        .tiktok-flying-icon-right {
          right: 5%;
          font-size: 2rem;
        }

        .tiktok-flying-icon-left {
          left: 5%;
          font-size: 2rem;
        }

        .quiz-code-card {
          padding: 16px 24px;
        }

        .quiz-code-title {
          font-size: 1.2rem;
        }

        .btn-control {
          padding: 12px 32px;
          font-size: 1rem;
        }

        .participants-grid {
          gap: 28px; /* ✅ Increased mobile spacing */
          padding: 0 15px;
          row-gap: 36px; /* ✅ Increased mobile vertical spacing */
        }
        
        .participants-grid > * {
          width: 190px; /* ✅ Adjusted mobile width */
        }

        .participant-card {
          padding: 20px; /* ✅ Adjusted mobile padding */
          height: 220px; /* ✅ Adjusted mobile height */
        }

        .floating-reaction {
          font-size: 2rem;
        }

        .reaction-bar {
          bottom: 10px;
          padding: 8px 12px;
          gap: 4px;
          max-width: 95%;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
        }

        .reaction-bar::-webkit-scrollbar {
          display: none;
        }

        .reaction-btn {
          font-size: 1.5rem;
          padding: 6px 8px;
          flex-shrink: 0;
        }
      }

      @media (max-width: 480px) {
        .participants-grid {
          gap: 20px;
          row-gap: 28px;
        }

        .participants-grid > * {
          width: 100%;
          max-width: 280px;
        }

        .quiz-code-title {
          font-size: 1rem;
        }

        /* TikTok icons - smaller screens */
        .tiktok-flying-icon-right {
          right: 8%;
          font-size: 1.8rem;
        }

        .tiktok-flying-icon-left {
          left: 8%;
          font-size: 1.8rem;
        }
      }
    `}</style>
  );
};

export default LobbyCSS;