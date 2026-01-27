const StudentRegisterModalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    .sr-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 2100;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: srFadeIn 0.2s ease;
    }

    @keyframes srFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .sr-modal {
      background: #1a1a2e;
      border-radius: 16px;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      border: 4px solid #feca57;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(254, 202, 87, 0.3);
      animation: srSlideUp 0.2s ease;
    }

    @keyframes srSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .sr-header {
      background: linear-gradient(135deg, #ff6b6b, #feca57);
      padding: 0;
      color: white;
      position: relative;
      overflow: hidden;
      border-bottom: 4px solid #f39c12;
    }

    .sr-header-image {
      width: 100%;
      height: 180px;
      object-fit: contain;
      display: block;
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .sr-header-content {
      padding: 25px;
      text-align: center;
      background: linear-gradient(135deg, #ff6b6b, #feca57);
    }

    .sr-title {
      font-family: 'Press Start 2P', cursive;
      font-size: 1.3rem;
      margin: 0 0 15px 0;
      line-height: 1.6;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
      color: #fff;
    }

    .sr-progress {
      background: rgba(0, 0, 0, 0.3);
      height: 10px;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 15px;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .sr-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00ff88, #00d4ff);
      transition: width 0.3s ease;
      box-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
    }

    .sr-body {
      padding: 30px 25px;
      max-height: calc(90vh - 300px);
      overflow-y: auto;
      background: #16213e;
    }

    .sr-body::-webkit-scrollbar {
      width: 8px;
    }

    .sr-body::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #ff6b6b, #feca57);
      border-radius: 4px;
    }

    .sr-alert {
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 0.7rem;
      font-family: 'Press Start 2P', cursive;
      text-align: center;
      line-height: 1.8;
      animation: srSlideDown 0.3s ease;
      border: 3px solid;
    }

    @keyframes srSlideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .sr-alert-success {
      background: rgba(0, 255, 136, 0.15);
      color: #00ff88;
      border-color: #00ff88;
      box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
    }

    .sr-alert-error {
      background: rgba(255, 107, 107, 0.15);
      color: #ff6b6b;
      border-color: #ff6b6b;
      box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
    }

    .sr-step-content {
      animation: srFadeSlide 0.3s ease;
    }

    @keyframes srFadeSlide {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .sr-form-group {
      margin-bottom: 18px;
    }

    .sr-label {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      color: #feca57;
      margin-bottom: 8px;
      display: block;
      line-height: 1.6;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .sr-input {
      width: 100%;
      padding: 12px 14px;
      border: 3px solid #feca57;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.2s ease;
      background: #0f3460;
      color: #fff;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
    }

    .sr-input.error {
      border-color: #ff6b6b;
      box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
    }

    .sr-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .sr-input:focus {
      outline: none;
      border-color: #00ff88;
      box-shadow: 0 0 0 4px rgba(0, 255, 136, 0.2);
      transform: translateY(-2px);
    }

    .sr-input-group {
      display: flex;
    }

    .sr-toggle-btn {
      background: #ff6b6b;
      border: 3px solid #feca57;
      border-left: none;
      color: white;
      padding: 12px 18px;
      border-radius: 0 8px 8px 0;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 18px;
    }

    .sr-toggle-btn:hover {
      background: #ee5a52;
    }

    .sr-error-text {
      font-size: 0.6rem;
      color: #ff6b6b;
      font-family: 'Press Start 2P', cursive;
      margin-top: 6px;
    }

    .sr-actions {
      display: flex;
      gap: 12px;
      margin-top: 25px;
    }

    .sr-btn {
      flex: 1;
      padding: 14px 28px;
      border-radius: 10px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 3px solid;
      box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.3);
    }

    .sr-btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: #764ba2;
    }

    .sr-btn-secondary {
      background: #e74c3c;
      color: white;
      border-color: #c0392b;
    }

    .sr-btn-success {
      background: linear-gradient(135deg, #00ff88, #00d4ff);
      color: #1a1a2e;
      border-color: #00d4ff;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .sr-modal { margin: 10px; }
      .sr-header-image { height: 140px; }
      .sr-body { padding: 25px 20px; }
    }

    @media (max-width: 480px) {
      .sr-header-image { height: 120px; }
      .sr-body { padding: 20px 15px; }
      .sr-actions { flex-direction: column; }
    }
  `}</style>
);

export default StudentRegisterModalCSS;
