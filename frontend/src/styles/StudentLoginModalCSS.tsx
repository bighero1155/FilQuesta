const StudentLoginModalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    .sl-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 2100;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: slFadeIn 0.2s ease;
    }

    @keyframes slFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .sl-modal {
      background: #1a1a2e;
      border-radius: 16px;
      max-width: 500px;
      width: 100%;
      overflow: hidden;
      border: 4px solid #feca57;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(254, 202, 87, 0.3);
      animation: slSlideUp 0.2s ease;
    }

    @keyframes slSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .sl-header {
      background: linear-gradient(135deg, #0d6efd, #0a58ca);
      padding: 30px 25px;
      text-align: center;
      border-bottom: 4px solid #084298;
    }

    .sl-logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 15px;
      background: linear-gradient(135deg, #feca57, #f39c12);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      border: 4px solid #fff;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .sl-title {
      font-family: 'Press Start 2P', cursive;
      font-size: 1.3rem;
      color: #fff;
      margin: 0;
      line-height: 1.6;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
    }

    .sl-subtitle {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.9);
      margin-top: 10px;
      line-height: 1.6;
    }

    .sl-body {
      padding: 30px 25px;
      background: #16213e;
    }

    .sl-alert {
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 0.7rem;
      font-family: 'Press Start 2P', cursive;
      text-align: center;
      line-height: 1.8;
      animation: slSlideDown 0.3s ease;
      background: rgba(255, 107, 107, 0.15);
      color: #ff6b6b;
      border: 3px solid #ff6b6b;
      box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
    }

    @keyframes slSlideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .sl-form-group {
      margin-bottom: 20px;
    }

    .sl-label {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      color: #feca57;
      margin-bottom: 8px;
      display: block;
      line-height: 1.6;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .sl-input-wrapper {
      position: relative;
    }

    .sl-input {
      width: 100%;
      padding: 12px 14px;
      border: 3px solid #0d6efd;
      border-radius: 8px;
      font-size: 0.7rem;
      transition: all 0.2s ease;
      background: #0f3460;
      color: #fff;
      font-family: 'Press Start 2P', cursive;
    }

    .sl-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .sl-input:focus {
      outline: none;
      border-color: #00ff88;
      box-shadow: 0 0 0 4px rgba(0, 255, 136, 0.2), 0 0 15px rgba(13, 110, 253, 0.5);
      transform: translateY(-2px);
    }

    .sl-toggle-btn {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #feca57;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
      width: 24px;
      height: 24px;
    }

    .sl-toggle-btn:hover {
      color: #00ff88;
      transform: translateY(-50%) scale(1.2);
    }

    .sl-actions {
      margin-top: 25px;
    }

    .sl-btn {
      width: 100%;
      padding: 14px 28px;
      border-radius: 10px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 3px solid;
      box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.3);
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .sl-btn-primary {
      background: linear-gradient(135deg, #0d6efd, #0a58ca);
      color: white;
      border-color: #084298;
    }

    .sl-btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #0a58ca, #084298);
      transform: translateY(-3px);
      box-shadow: 7px 7px 0 rgba(0, 0, 0, 0.3), 0 0 20px rgba(13, 110, 253, 0.5);
    }

    .sl-btn-secondary {
      background: transparent;
      color: #feca57;
      border-color: #feca57;
    }

    .sl-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: slSpin 0.8s linear infinite;
      margin-right: 8px;
    }

    @keyframes slSpin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .sl-modal {
        margin: 10px;
        border-radius: 12px;
      }

      .sl-logo {
        width: 70px;
        height: 70px;
        font-size: 2rem;
      }

      .sl-title {
        font-size: 1rem;
      }

      .sl-input {
        font-size: 0.65rem;
      }
    }

    @media (max-width: 480px) {
      .sl-logo {
        width: 60px;
        height: 60px;
        font-size: 1.8rem;
      }

      .sl-title {
        font-size: 0.9rem;
      }

      .sl-input {
        font-size: 0.6rem;
      }
    }
  `}</style>
);

export default StudentLoginModalCSS;
