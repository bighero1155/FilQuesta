// src/styles/SharedQuizQuestCSS.tsx
import React from "react";

const SharedQuizQuestCSS: React.FC = () => {
  return (
    <style>{`
      /* Container */
      .quiz-quest-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 80px 20px;
        position: relative;
        overflow: hidden;
      }

      /* Animated background elements */
      .quiz-bg-elements {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 1;
        pointer-events: none;
      }

      .quiz-icon {
        position: absolute;
        font-size: 3rem;
        opacity: 0.12;
        animation: float 20s infinite ease-in-out;
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

      /* Score Panel - Desktop Only */
      .score-panel {
        position: fixed;
        left: 16px;
        top: 16px;
        z-index: 3000;
        background: rgba(255,255,255,0.95);
        padding: 10px 14px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        min-width: 140px;
        text-align: center;
        font-weight: 700;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255,255,255,0.3);
      }

      .score-panel-label {
        font-size: 12px;
        color: #666;
        margin-top: 8px;
        text-align: center;
      }

      .score-panel-label:first-child {
        margin-top: 0;
      }

      .score-panel-value {
        font-size: 20px;
        margin-bottom: 0;
        text-align: center;
        color: #4facfe;
      }

      .score-panel-booster {
        font-size: 14px;
        text-align: center;
        color: #43e97b;
      }

      .score-panel-inventory {
        font-size: 13px;
        text-align: center;
      }

      .score-panel-second-chance {
        margin-top: 6px;
        font-size: 11px;
        text-align: center;
      }

      .score-panel-second-chance.active {
        color: #28a745;
      }

      .score-panel-second-chance.inactive {
        color: #999;
      }

      /* Power-up Buttons */
      .btn-powerup {
        width: 100%;
        font-weight: 700;
        font-size: 11px;
        margin-top: 8px;
        border-radius: 20px;
        transition: all 0.3s ease;
      }

      .btn-powerup:first-of-type {
        margin-top: 8px;
      }

      .btn-powerup + .btn-powerup {
        margin-top: 6px;
      }

      .btn-powerup:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      /* Mobile Score Toggle Button */
      .mobile-score-toggle {
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 3000;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        border-radius: 50%;
        padding: 12px 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border: 2px solid rgba(255,255,255,0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        display: none;
        align-items: center;
        gap: 8px;
      }

      .mobile-score-toggle:hover {
        transform: scale(1.1);
      }

      .mobile-score-toggle:active {
        transform: scale(0.95);
      }

      .mobile-score-value {
        font-size: 18px;
        font-weight: bold;
        color: #4facfe;
      }

      .mobile-chevron {
        font-size: 14px;
        color: #666;
      }

      /* Mobile Score Overlay */
      .mobile-score-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(4px);
        z-index: 3500;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 16px;
        padding-top: 60px;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .mobile-score-panel {
        background: rgba(255,255,255,0.98);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border: 2px solid rgba(255,255,255,0.3);
        animation: slideDown 0.3s ease-out;
        max-height: 90vh;
        overflow-y: auto;
      }

      @keyframes slideDown {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .mobile-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 2px solid #e5e7eb;
        position: sticky;
        top: 0;
        background: rgba(255,255,255,0.98);
        backdrop-filter: blur(10px);
        border-radius: 20px 20px 0 0;
        z-index: 10;
      }

      .mobile-panel-title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin: 0;
      }

      .mobile-panel-close {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
        color: #666;
      }

      .mobile-panel-close:hover {
        background: #f3f4f6;
        color: #333;
      }

      .mobile-panel-close:active {
        transform: scale(0.9);
      }

      .mobile-panel-content {
        padding: 20px;
      }

      .mobile-score-display {
        text-align: center;
        margin-bottom: 20px;
        padding: 20px;
        background: linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1));
        border-radius: 15px;
      }

      .mobile-score-display .score-panel-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
      }

      .mobile-score-display .score-panel-value {
        font-size: 48px;
        color: #4facfe;
        margin: 0;
      }

      .mobile-booster-status {
        background: linear-gradient(135deg, rgba(67, 233, 123, 0.1), rgba(56, 176, 0, 0.1));
        border-radius: 15px;
        padding: 16px;
        margin-bottom: 16px;
      }

      .mobile-booster-status .score-panel-label {
        font-size: 12px;
        margin-bottom: 4px;
      }

      .mobile-booster-status .score-panel-booster {
        font-size: 24px;
        font-weight: bold;
      }

      .mobile-inventory {
        background: #f9fafb;
        border-radius: 15px;
        padding: 16px;
        margin-bottom: 16px;
      }

      .mobile-inventory .score-panel-label {
        font-size: 12px;
        margin-bottom: 12px;
      }

      .mobile-inventory .score-panel-inventory {
        font-size: 16px;
        font-weight: 600;
      }

      .mobile-powerup-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 16px;
      }

      .mobile-powerup-btn {
        width: 100%;
        padding: 14px 20px;
        border-radius: 12px;
        border: none;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .mobile-powerup-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .mobile-powerup-btn:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      }

      .mobile-powerup-btn:not(:disabled):active {
        transform: translateY(0);
      }

      .mobile-powerup-btn.booster {
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: white;
      }

      .mobile-powerup-btn.freeze {
        background: linear-gradient(135deg, #60a5fa, #3b82f6);
        color: white;
      }

      .mobile-second-chance {
        text-align: center;
        padding: 12px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .mobile-second-chance.active {
        background: #d1fae5;
        color: #065f46;
      }

      .mobile-second-chance.inactive {
        background: #f3f4f6;
        color: #9ca3af;
      }

      /* Time Up Overlay */
      .time-up-overlay {
        position: absolute;
        inset: 0;
        background-color: rgba(0,0,0,0.85);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        z-index: 1000;
        transition: opacity 0.8s ease-in-out;
        text-align: center;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }

      .time-up-overlay.fade-out {
        opacity: 0;
      }

      /* Quiz Card */
      .quiz-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
        width: 100%;
        max-width: 700px;
        color: #000;
        padding: 28px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        position: relative;
        z-index: 2;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255,255,255,0.3);
        transition: transform 0.3s ease;
      }

      .quiz-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 70px rgba(0,0,0,0.25);
      }

      /* Timer */
      .quiz-timer {
        font-weight: bold;
        font-size: 1.5rem;
        margin-bottom: 1rem;
        transition: color 0.3s ease, text-shadow 0.3s ease;
        text-align: center;
        padding: 12px;
        border-radius: 15px;
        background: rgba(255,255,255,0.5);
      }

      .quiz-timer.normal {
        color: #4facfe;
        text-shadow: 0 0 10px rgba(79, 172, 254, 0.3);
      }

      .quiz-timer.warning {
        color: #ff1744;
        text-shadow: 0 0 10px #ff5252, 0 0 20px #ff5252;
        animation: pulse-warning 1s infinite;
      }

      .quiz-timer.frozen {
        color: #00e5ff;
        text-shadow: 0 0 10px #00e5ff, 0 0 20px #00e5ff, 0 0 30px #00e5ff;
        animation: pulse-frozen 2s infinite;
      }

      @keyframes pulse-warning {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      @keyframes pulse-frozen {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      /* Question Header */
      .question-header {
        font-weight: bold;
        margin-bottom: 24px;
        font-size: 1.3rem;
        text-align: center;
        color: #4facfe;
        text-shadow: 0 2px 10px rgba(79, 172, 254, 0.2);
      }

      .question-text {
        margin-bottom: 24px;
        font-size: 1.25rem;
        text-align: center;
        line-height: 1.6;
        color: #333;
      }

      /* Question Image */
      .question-image-container {
        margin-bottom: 24px;
        text-align: center;
      }

      .question-image {
        max-height: 300px;
        max-width: 100%;
        object-fit: contain;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        border: 3px solid rgba(79, 172, 254, 0.3);
      }

      /* Options Container */
      .options-container {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      /* Option Button */
      .option-btn {
        padding: 16px;
        border-radius: 15px;
        border: 2px solid #4facfe;
        background: linear-gradient(135deg, rgba(79, 172, 254, 0.15), rgba(0, 242, 254, 0.15));
        color: #000;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
        font-size: 1rem;
        font-weight: 500;
        position: relative;
        overflow: hidden;
      }

      .option-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s;
      }

      .option-btn:hover:not(.answered)::before {
        left: 100%;
      }

      .option-btn:hover:not(.answered) {
        background: linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(0, 242, 254, 0.3));
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3);
      }

      .option-btn.selected:not(.answered) {
        background: linear-gradient(135deg, rgba(79, 172, 254, 0.4), rgba(0, 242, 254, 0.4));
        border-color: #00f2fe;
      }

      .option-btn.answered {
        cursor: not-allowed;
      }

      .option-btn.correct-selected {
        background: linear-gradient(135deg, rgba(67, 233, 123, 0.9), rgba(56, 176, 0, 0.9));
        border: 2px solid #43e97b;
        color: #fff;
        box-shadow: 0 8px 25px rgba(67, 233, 123, 0.4);
      }

      .option-btn.wrong-selected {
        background: linear-gradient(135deg, rgba(230, 57, 70, 0.9), rgba(220, 20, 60, 0.9));
        border: 2px solid #e63946;
        color: #fff;
        box-shadow: 0 8px 25px rgba(230, 57, 70, 0.4);
      }

      .option-btn.correct-answer {
        background: linear-gradient(135deg, rgba(67, 233, 123, 0.5), rgba(56, 176, 0, 0.5));
        border: 2px solid #43e97b;
        color: #fff;
      }

      /* Identification Input */
      .identification-input {
        padding: 16px;
        font-size: 1.1rem;
        border-radius: 15px;
        border: 2px solid #4facfe;
        width: 100%;
        text-align: center;
        transition: all 0.3s ease;
        background: rgba(255,255,255,0.9);
      }

      .identification-input:focus {
        outline: none;
        border-color: #00f2fe;
        box-shadow: 0 0 20px rgba(0, 242, 254, 0.3);
      }

      .identification-input:disabled {
        background-color: #f0f0f0;
        cursor: not-allowed;
      }

      .identification-input.correct {
        border-color: #43e97b;
        background: linear-gradient(135deg, rgba(67, 233, 123, 0.2), rgba(56, 176, 0, 0.2));
        color: #155724;
      }

      .identification-input.wrong {
        border-color: #e63946;
        background: linear-gradient(135deg, rgba(230, 57, 70, 0.2), rgba(220, 20, 60, 0.2));
        color: #e63946;
      }

      /* Identification Submit Button */
      .btn-submit-answer {
        width: 100%;
        padding: 14px;
        font-size: 1.1rem;
        font-weight: bold;
        border-radius: 15px;
        margin-top: 12px;
        transition: all 0.3s ease;
      }

      .btn-submit-answer:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      }

      /* Answer Feedback */
      .answer-feedback {
        font-weight: bold;
        font-size: 1.3rem;
        margin-top: 12px;
        text-align: center;
        animation: fadeInUp 0.5s ease;
      }

      .answer-feedback.correct {
        color: #43e97b;
        text-shadow: 0 0 10px rgba(67, 233, 123, 0.3);
      }

      .answer-feedback.wrong {
        color: #e63946;
        text-shadow: 0 0 10px rgba(230, 57, 70, 0.3);
      }

      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Action Buttons */
      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 24px;
      }

      .btn-next, .btn-submit-quiz {
        padding: 14px 28px;
        font-size: 1.1rem;
        font-weight: bold;
        border-radius: 15px;
        transition: all 0.3s ease;
        border: none;
      }

      .btn-next:hover, .btn-submit-quiz:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .quiz-quest-container {
          padding: 60px 10px;
        }

        .quiz-icon {
          font-size: 2rem;
        }

        /* Hide desktop score panel on mobile */
        .score-panel {
          display: none !important;
        }

        /* Show mobile score toggle on mobile */
        .mobile-score-toggle {
          display: flex !important;
        }

        .quiz-card {
          padding: 20px;
        }

        .quiz-timer {
          font-size: 1.2rem;
        }

        .question-header {
          font-size: 1.1rem;
        }

        .question-text {
          font-size: 1.1rem;
        }

        .question-image {
          max-height: 200px;
        }

        .time-up-overlay {
          font-size: 1.5rem;
          padding: 20px;
          text-align: center;
        }
      }

      @media (min-width: 769px) {
        /* Hide mobile elements on desktop */
        .mobile-score-toggle {
          display: none !important;
        }

        .mobile-score-overlay {
          display: none !important;
        }
      }

      @media (max-width: 480px) {
        .mobile-score-value {
          font-size: 16px;
        }

        .quiz-timer {
          font-size: 1rem;
        }

        .question-header {
          font-size: 1rem;
        }

        .question-text {
          font-size: 1rem;
        }
      }
    `}</style>
  );
};

export default SharedQuizQuestCSS;