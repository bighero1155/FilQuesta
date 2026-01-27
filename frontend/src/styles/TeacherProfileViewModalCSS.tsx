const TeacherProfileViewModalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    .tp-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: tpFadeIn 0.2s ease;
    }

    @keyframes tpFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .tp-modal {
      background: white;
      border-radius: 16px;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      border: 3px solid #0d6efd;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: tpSlideUp 0.2s ease;
    }

    @keyframes tpSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .tp-header {
      background: linear-gradient(135deg, #0d6efd, #0a58ca);
      padding: 20px 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tp-title {
      font-family: 'Press Start 2P', cursive;
      font-size: 1rem;
      color: white;
      margin: 0;
      line-height: 1.5;
    }

    .tp-close {
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid white;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.6rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tp-close:hover {
      background: white;
      color: #0d6efd;
    }

    .tp-body {
      padding: 30px 25px;
      max-height: calc(90vh - 80px);
      overflow-y: auto;
    }

    .tp-body::-webkit-scrollbar {
      width: 6px;
    }

    .tp-body::-webkit-scrollbar-thumb {
      background: #0d6efd;
      border-radius: 3px;
    }

    .tp-content {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 25px;
      align-items: start;
    }

    .tp-avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .tp-avatar {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      object-fit: cover;
      border: 4px solid #0d6efd;
      box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
    }

    .tp-avatar-placeholder {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0d6efd, #0a58ca);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 56px;
      border: 4px solid #0d6efd;
      box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
    }

    .tp-name-badge {
      background: linear-gradient(135deg, #0d6efd, #0a58ca);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.5rem;
      text-align: center;
      line-height: 1.5;
      word-break: break-word;
    }

    .tp-fields {
      display: grid;
      gap: 12px;
    }

    .tp-field {
      background: #f8f9fa;
      border-left: 4px solid #0d6efd;
      border-radius: 4px;
      padding: 12px 14px;
      transition: all 0.2s ease;
    }

    .tp-field:hover {
      background: #e7f1ff;
      border-left-width: 6px;
      transform: translateX(2px);
    }

    .tp-label {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.6rem;
      color: #0d6efd;
      margin-bottom: 6px;
      line-height: 1.5;
    }

    .tp-value {
      font-size: 15px;
      color: #333;
      line-height: 1.5;
      word-break: break-word;
    }

    .tp-actions {
      margin-top: 25px;
      display: flex;
      gap: 12px;
    }

    .tp-btn {
      flex: 1;
      background: linear-gradient(135deg, #0d6efd, #0a58ca);
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 8px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
    }

    .tp-btn:hover {
      background: linear-gradient(135deg, #0a58ca, #084298);
      transform: translateY(-2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2);
    }

    .tp-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .tp-modal {
        margin: 10px;
        border-radius: 12px;
      }

      .tp-title {
        font-size: 0.8rem;
      }

      .tp-close {
        font-size: 0.55rem;
        padding: 6px 12px;
      }

      .tp-body {
        padding: 25px 20px;
      }

      .tp-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .tp-avatar-section {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }

      .tp-avatar,
      .tp-avatar-placeholder {
        width: 100px;
        height: 100px;
      }

      .tp-avatar-placeholder {
        font-size: 40px;
      }

      .tp-name-badge {
        font-size: 0.45rem;
        padding: 6px 10px;
      }

      .tp-label {
        font-size: 0.55rem;
      }

      .tp-value {
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      .tp-header {
        padding: 15px 20px;
      }

      .tp-title {
        font-size: 0.7rem;
      }

      .tp-close {
        font-size: 0.5rem;
        padding: 5px 10px;
      }

      .tp-body {
        padding: 20px 15px;
      }

      .tp-content {
        grid-template-columns: 1fr;
      }

      .tp-avatar-section {
        flex-direction: column;
        align-items: center;
      }

      .tp-avatar,
      .tp-avatar-placeholder {
        width: 90px;
        height: 90px;
      }

      .tp-avatar-placeholder {
        font-size: 36px;
      }

      .tp-name-badge {
        font-size: 0.4rem;
        width: 100%;
      }

      .tp-label {
        font-size: 0.5rem;
      }

      .tp-value {
        font-size: 13px;
      }

      .tp-btn {
        font-size: 0.6rem;
        padding: 12px 20px;
      }
    }
  `}</style>
);

export default TeacherProfileViewModalCSS;
