const ClassroomPageCSS = () => (
  <style>{`
    .classroom-page {
      min-height: 100vh;
      padding-top: 80px;
      padding-bottom: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      overflow: hidden;
      position: relative;
    }

    /* Back Button Styles */
    .classroom-back-btn {
      position: fixed;
      top: 14px;
      left: 14px;
      z-index: 9999;

      padding: 16px 36px;
      height: 34px;
      width: fit-content;

      border-radius: 999px;
      border: 1.5px solid rgba(255,255,255,0.6);

      background: linear-gradient(
        180deg,
        rgba(255,255,255,0.95),
        rgba(220,230,255,0.85)
      );

      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0.3px;
      color: #3b4cca;

      box-shadow:
        0 4px 10px rgba(0,0,0,0.18),
        inset 0 1px 0 rgba(255,255,255,0.9);

      cursor: pointer;
      user-select: none;

      transition:
        transform 0.15s ease,
        box-shadow 0.15s ease,
        filter 0.15s ease;
    }

    .classroom-back-btn:hover {
      background-color: #4c51bf;
      transform: translateX(-5px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    /* Text Glow Effect */
    .text-glow {
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.4),
                   0 0 40px rgba(255, 255, 255, 0.3);
    }

    /* Background Elements */
    .classroom-bg-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
      pointer-events: none;
    }

    .classroom-symbol {
      position: absolute;
      font-size: 3rem;
      opacity: 0.12;
      animation: float 20s infinite ease-in-out;
    }

    .symbol-1 { top: 10%; left: 10%; animation-delay: 0s; }
    .symbol-2 { top: 20%; right: 15%; animation-delay: 2s; }
    .symbol-3 { top: 60%; left: 5%; animation-delay: 4s; }
    .symbol-4 { bottom: 20%; right: 10%; animation-delay: 1s; }
    .symbol-5 { top: 70%; right: 20%; animation-delay: 3s; }
    .symbol-6 { bottom: 30%; left: 20%; animation-delay: 5s; }
    .symbol-7 { top: 40%; left: 50%; animation-delay: 2.5s; }
    .symbol-8 { top: 50%; right: 5%; animation-delay: 4.5s; }

    .bg-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      animation: pulse 15s infinite ease-in-out;
    }

    .circle-1 {
      width: 350px;
      height: 350px;
      top: -100px;
      right: -100px;
      animation-delay: 0s;
    }

    .circle-2 {
      width: 450px;
      height: 450px;
      bottom: -150px;
      left: -150px;
      animation-delay: 3s;
    }

    .circle-3 {
      width: 300px;
      height: 300px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 1.5s;
    }

    /* Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-30px) rotate(5deg); }
      50% { transform: translateY(-50px) rotate(-5deg); }
      75% { transform: translateY(-30px) rotate(3deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.06; }
      50% { transform: scale(1.15); opacity: 0.12; }
    }

    /* Loading Screen */
    .classroom-loading {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    }

    .classroom-spinner {
      width: 3rem;
      height: 3rem;
    }

    /* Join Card */
    .classroom-join-card {
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      animation: slideUp 0.6s ease-out;
    }

    .classroom-join-icon {
      font-size: 4rem;
      animation: bounce 2s infinite;
    }

    .classroom-code-input {
      border-radius: 15px;
      font-size: 1.4rem;
      letter-spacing: 0.2em;
      font-weight: 700;
      border: 2px solid #667eea;
      transition: all 0.3s ease;
    }

    .classroom-code-input:focus {
      border-color: #764ba2;
      box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1);
      outline: none;
    }

    .classroom-join-btn {
      border-radius: 15px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 15px;
      transition: all 0.3s ease;
    }

    .classroom-join-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    /* Teacher Dashboard */
    .classroom-list-card {
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.6s ease-out;
    }

    .classroom-card {
      background: linear-gradient(135deg, #667eea15, #764ba215);
      border-radius: 15px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      padding: 1.5rem;
    }

    .classroom-card:hover {
      border-color: #667eea;
      background: linear-gradient(135deg, #667eea25, #764ba225);
      transform: translateX(5px);
      box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
    }

    .classroom-card-badge {
      background: #667eea;
      font-size: 0.9rem;
      padding: 6px 12px;
      border-radius: 8px;
    }

    .classroom-card-arrow {
      font-size: 1.5rem;
      color: #667eea;
      transition: transform 0.3s ease;
    }

    .classroom-card:hover .classroom-card-arrow {
      transform: translateX(5px);
    }

    /* Header Badges */
    .classroom-header-badge {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      font-size: 1rem;
      font-weight: 600;
      border-radius: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1.5rem;
      transition: all 0.3s ease;
    }

    .classroom-header-badge:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    /* Navigation Tabs */
    .classroom-tabs {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 5px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .classroom-tab {
      border-radius: 12px;
      font-weight: 600;
      padding: 10px 25px;
      transition: all 0.3s ease;
      border: none;
      background: transparent;
    }

    .classroom-tab:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    .classroom-tab.active {
      background: white;
      color: #667eea;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .classroom-tab:not(.active) {
      color: white;
    }

    /* Student Card */
    .student-card {
      position: relative;
      padding: 0;
      background: transparent;
    }

    .student-card.clickable {
      cursor: pointer;
    }

    .student-card.clickable:hover {
      transform: translateY(-8px) scale(1.03);
      transition: all 0.3s ease;
    }

    /* Score Badge */
    .student-score-badge {
      position: absolute;
      top: -10px;
      right: -10px;
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      color: #8B4513;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
      border: 3px solid white;
      animation: scoreGlow 2s infinite alternate;
    }

    @keyframes scoreGlow {
      from { box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4); }
      to { box-shadow: 0 4px 20px rgba(255, 215, 0, 0.7), 0 0 30px rgba(255, 215, 0, 0.3); }
    }

    /* Add Points Button */
    .student-add-points {
      position: absolute;
      bottom: -10px;
      right: -10px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 20px;
      border: 3px solid white;
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
      background: #28a745;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .student-add-points:hover {
      transform: scale(1.1) rotate(90deg);
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.6);
      background: #218838;
    }

    /* Empty State */
    .classroom-empty-state {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 3rem;
      animation: fadeIn 0.6s ease-out;
    }

    /* Copy Code Button */
    .classroom-copy-btn {
      border-radius: 25px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      padding: 1rem 3rem;
      background: white;
      color: #667eea;
      font-weight: bold;
      border: none;
      transition: all 0.3s ease;
    }

    .classroom-copy-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
      background: #f8f9fa;
    }

    /* Modal Styles */
    .classroom-modal {
      display: block;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease-out;
    }

    .classroom-modal-content {
      border-radius: 20px;
      border: none;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease-out;
    }

    .classroom-modal-header {
      border-radius: 20px 20px 0 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      padding: 1.5rem;
    }

    .classroom-modal-body {
      padding: 2rem;
    }

    .classroom-modal-footer {
      border: none;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 0 0 20px 20px;
    }

    .classroom-score-display {
      background: linear-gradient(135deg, #ffd70020, #ffed4e20);
      border-radius: 15px;
      border: 2px solid #ffd700;
      padding: 2rem;
      animation: scoreDisplayPulse 2s infinite alternate;
    }

    @keyframes scoreDisplayPulse {
      from { border-color: #ffd700; }
      to { border-color: #ffed4e; }
    }

    .classroom-score-number {
      color: #ffa500;
      font-size: 3rem;
      font-weight: bold;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(255, 165, 0, 0.3);
    }

    .classroom-log-item {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 1rem;
      transition: all 0.3s ease;
    }

    .classroom-log-item:hover {
      background: #e9ecef;
      transform: translateX(5px);
    }

    .classroom-log-badge {
      font-size: 0.9rem;
      padding: 6px 12px;
      border-radius: 8px;
    }

    /* Button Styles */
    .classroom-btn {
      border-radius: 10px;
      font-weight: bold;
      padding: 0.5rem 1.5rem;
      transition: all 0.3s ease;
    }

    .classroom-btn:hover {
      transform: translateY(-2px);
    }

    .classroom-btn-success {
      background: #28a745;
      border: none;
      color: white;
    }

    .classroom-btn-success:hover {
      background: #218838;
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
    }

    .classroom-btn-warning {
      background: #ffc107;
      border: none;
      color: #333;
    }

    .classroom-btn-warning:hover {
      background: #e0a800;
      box-shadow: 0 6px 20px rgba(255, 193, 7, 0.3);
    }

    .classroom-btn-secondary {
      background: #6c757d;
      border: none;
      color: white;
    }

    .classroom-btn-secondary:hover {
      background: #5a6268;
      box-shadow: 0 6px 20px rgba(108, 117, 125, 0.3);
    }

    .classroom-btn-danger {
      background: #dc3545;
      border: none;
      color: white;
    }

    .classroom-btn-danger:hover {
      background: #c82333;
      box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
    }

    .classroom-back-btn:active {
      transform: scale(0.95);
      box-shadow:
        0 3px 8px rgba(0,0,0,0.25),
        inset 0 2px 4px rgba(0,0,0,0.15);
    }

    /* Alert Styles */
    .classroom-alert {
      border-radius: 12px;
      border: none;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      animation: slideDown 0.3s ease-out;
    }

    /* Animations */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .classroom-page {
        padding-top: 60px;
      }

      .classroom-symbol {
        font-size: 2rem;
      }

      .classroom-back-btn {
        padding: 16px 36px;
        font-size: 1.2rem;
      }

      .classroom-header-badge {
        font-size: 0.85rem;
        padding: 8px 15px;
      }

      .classroom-tab {
        padding: 8px 15px;
        font-size: 0.85rem;
      }

      .classroom-tabs {
        flex-direction: column;
        width: 100%;
      }

      .classroom-tab {
        border-radius: 12px;
        margin: 3px 0;
        width: 100%;
      }

      .student-score-badge {
        width: 40px;
        height: 40px;
        font-size: 12px;
      }

      .student-add-points {
        width: 35px;
        height: 35px;
        font-size: 18px;
      }

      .classroom-code-input {
        font-size: 1.1rem;
      }

      .classroom-score-number {
        font-size: 2rem;
      }

      .classroom-copy-btn {
        padding: 0.75rem 2rem;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 576px) {
      .classroom-page {
        padding-top: 50px;
        padding-bottom: 40px;
      }

      .classroom-back-btn {
        top: 10px;
        left: 10px;
        padding: 16px 36px;
        font-size: 1.2rem;
      }

      .text-glow {
        font-size: 1.5rem;
      }

      .classroom-join-icon {
        font-size: 3rem;
      }

      .classroom-modal-body {
        padding: 1rem;
      }
    }
      /* Remove Student Button */ 
.student-remove-btn {
  position: absolute;
  top: -10px;
  left: -10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
  background: #dc3545;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-weight: bold;
  z-index: 10;
}

.student-remove-btn:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.6);
  background: #c82333;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .student-remove-btn {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }
}

@media (max-width: 576px) {
  .student-remove-btn {
    width: 30px;
    height: 30px;
    font-size: 16px;
    top: -8px;
    left: -8px;
  }
}

@media (hover: hover) {
  .classroom-back-btn:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 18px rgba(0,0,0,0.25),
      0 0 10px rgba(120,140,255,0.6);
    filter: brightness(1.05);
  }
}

@media (max-width: 768px) {
  .classroom-back-btn {
    top: auto;
    bottom: 90px; /* above bottom UI */
    left: 14px;

    height: 32px;
    padding: 16px 36px;
    font-size: 1.2rem;
  }
}
  `}</style>
);

export default ClassroomPageCSS;