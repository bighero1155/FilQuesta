const SharedQuizBrowserModalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    .qm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      padding: 20px;
      animation: qmFadeIn 0.2s ease;
    }

    @keyframes qmFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .qm-modal {
      background: white;
      border-radius: 16px;
      max-width: 700px;
      width: 100%;
      max-height: 85vh;
      overflow: hidden;
      border: 3px solid #0d6efd;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: qmSlideUp 0.2s ease;
    }

    @keyframes qmSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .qm-header {
      background: linear-gradient(135deg, #0d6efd, #0a58ca);
      padding: 20px 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .qm-title {
      font-family: 'Press Start 2P', cursive;
      font-size: 1rem;
      color: white;
      margin: 0;
      line-height: 1.5;
    }

    .qm-close {
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid white;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .qm-close:hover {
      background: white;
      color: #0d6efd;
    }

    .qm-body {
      padding: 25px;
      max-height: calc(85vh - 80px);
      overflow-y: auto;
    }

    .qm-body::-webkit-scrollbar {
      width: 6px;
    }

    .qm-body::-webkit-scrollbar-thumb {
      background: #0d6efd;
      border-radius: 3px;
    }

    .qm-loading {
      text-align: center;
      padding: 40px 20px;
      color: #0d6efd;
    }

    .qm-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e9ecef;
      border-top-color: #0d6efd;
      border-radius: 50%;
      animation: qmSpin 0.8s linear infinite;
      margin: 0 auto 15px;
    }

    @keyframes qmSpin {
      to { transform: rotate(360deg); }
    }

    .qm-loading-text {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      line-height: 1.6;
    }

    .qm-error {
      background: #fff5f5;
      color: #dc3545;
      border: 2px solid #dc3545;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      font-size: 0.7rem;
      font-family: 'Press Start 2P', cursive;
      line-height: 1.5;
    }

    .qm-empty {
      text-align: center;
      padding: 50px 20px;
      color: #6c757d;
    }

    .qm-empty-icon {
      font-size: 3rem;
      margin-bottom: 15px;
      opacity: 0.4;
    }

    .qm-empty-text {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      line-height: 1.6;
    }

    .qm-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .qm-card {
      background: #f8f9fa;
      border: 2px solid #0d6efd;
      border-radius: 10px;
      padding: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      transition: all 0.2s ease;
    }

    .qm-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
    }

    .qm-info {
      flex: 1;
      min-width: 0;
    }

    .qm-quiz-title {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.75rem;
      color: #0d6efd;
      margin-bottom: 8px;
      line-height: 1.5;
      word-break: break-word;
    }

    .qm-code {
      display: inline-block;
      background: #0d6efd;
      color: white;
      padding: 6px 12px;
      border-radius: 5px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.6rem;
      letter-spacing: 1px;
    }

    .qm-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-shrink: 0;
    }

    .qm-join {
      background: linear-gradient(135deg, #198754, #157347);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.65rem;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .qm-join:hover {
      background: linear-gradient(135deg, #157347, #0f5132);
      transform: translateY(-2px);
    }

    .qm-join:active {
      transform: translateY(0);
    }

    .qm-delete {
      background: linear-gradient(135deg, #dc3545, #bb2d3b);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      height: 42px;
    }

    .qm-delete:hover:not(:disabled) {
      background: linear-gradient(135deg, #bb2d3b, #a02532);
      transform: translateY(-2px);
    }

    .qm-delete:active:not(:disabled) {
      transform: translateY(0);
    }

    .qm-delete:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: linear-gradient(135deg, #dc3545, #bb2d3b);
    }

    @media (max-width: 768px) {
      .qm-modal {
        border-radius: 12px;
      }

      .qm-title {
        font-size: 0.8rem;
      }

      .qm-body {
        padding: 20px;
      }

      .qm-card {
        flex-direction: column;
        align-items: stretch;
      }

      .qm-actions {
        width: 100%;
      }

      .qm-join {
        flex: 1;
      }

      .qm-delete {
        min-width: 44px;
      }
    }

    @media (max-width: 480px) {
      .qm-header {
        padding: 15px 20px;
      }

      .qm-title {
        font-size: 0.7rem;
      }

      .qm-close {
        width: 32px;
        height: 32px;
        font-size: 18px;
      }

      .qm-body {
        padding: 15px;
      }

      .qm-quiz-title {
        font-size: 0.65rem;
      }

      .qm-code {
        font-size: 0.55rem;
        padding: 5px 10px;
      }

      .qm-join {
        font-size: 0.6rem;
        padding: 8px 16px;
      }

      .qm-delete {
        font-size: 16px;
        padding: 8px 14px;
        height: 38px;
      }

      .qm-loading-text,
      .qm-empty-text {
        font-size: 0.65rem;
      }
    }
  `}</style>
);

export default SharedQuizBrowserModalCSS;