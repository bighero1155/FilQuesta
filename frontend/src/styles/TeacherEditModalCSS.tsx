const TeacherEditModalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    .te-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 2100;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: teFadeIn 0.2s ease;
    }

    @keyframes teFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .te-modal {
      background: white;
      border-radius: 16px;
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      border: 3px solid #0d6efd;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: teSlideUp 0.2s ease;
    }

    @keyframes teSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .te-header {
      background: linear-gradient(135deg, #0d6efd, #0a58ca);
      padding: 20px 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .te-title {
      font-family: 'Press Start 2P', cursive;
      font-size: 1rem;
      color: white;
      margin: 0;
      line-height: 1.5;
    }

    .te-close {
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

    .te-close:hover {
      background: white;
      color: #0d6efd;
    }

    .te-body {
      padding: 30px 25px;
      max-height: calc(90vh - 80px);
      overflow-y: auto;
    }

    .te-body::-webkit-scrollbar {
      width: 6px;
    }

    .te-body::-webkit-scrollbar-thumb {
      background: #0d6efd;
      border-radius: 3px;
    }

    .te-alert {
      padding: 14px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 0.6rem;
      font-family: 'Press Start 2P', cursive;
      text-align: center;
      line-height: 1.6;
      animation: teSlideDown 0.3s ease;
    }

    @keyframes teSlideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .te-alert-success {
      background: #d1e7dd;
      color: #0f5132;
      border: 2px solid #0f5132;
    }

    .te-alert-error {
      background: #f8d7da;
      color: #842029;
      border: 2px solid #842029;
    }

    .te-content {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 30px;
    }

    .te-avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    .te-avatar-preview {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      object-fit: cover;
      border: 4px solid #0d6efd;
      box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
    }

    .te-avatar-placeholder {
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
    }

    .te-avatar-label {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.6rem;
      color: #0d6efd;
      line-height: 1.5;
    }

    .te-avatar-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .te-avatar-btn {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
      background: white;
    }

    .te-avatar-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }

    .te-avatar-btn.selected {
      border: 3px solid #0d6efd;
      box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
    }

    .te-avatar-btn:not(.selected) {
      border: 2px solid #dee2e6;
    }

    .te-avatar-btn:hover {
      transform: scale(1.05);
      border-color: #0d6efd;
    }

    .te-form {
      display: grid;
      gap: 16px;
    }

    .te-form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .te-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .te-label {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.55rem;
      color: #0d6efd;
      line-height: 1.5;
    }

    .te-input {
      padding: 10px 12px;
      border: 2px solid #dee2e6;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .te-input:focus {
      outline: none;
      border-color: #0d6efd;
      box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
    }

    .te-input.error {
      border-color: #dc3545;
    }

    .te-error-text {
      font-size: 0.5rem;
      color: #dc3545;
      font-family: 'Press Start 2P', cursive;
      line-height: 1.5;
    }

    .te-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .te-btn {
      flex: 1;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.65rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
    }

    .te-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
    }

    .te-btn-primary {
      background: linear-gradient(135deg, #0d6efd, #0a58ca);
      color: white;
    }

    .te-btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #0a58ca, #084298);
      transform: translateY(-2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2);
    }

    .te-btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .te-btn-secondary {
      background: #6c757d;
      color: white;
    }

    .te-btn-secondary:hover {
      background: #5c636a;
    }

    @media (max-width: 768px) {
      .te-content {
        grid-template-columns: 1fr;
        gap: 25px;
      }

      .te-avatar-section {
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
      }

      .te-avatar-preview,
      .te-avatar-placeholder {
        width: 120px;
        height: 120px;
      }

      .te-avatar-placeholder {
        font-size: 48px;
      }

      .te-avatar-grid {
        grid-template-columns: repeat(5, 1fr);
      }

      .te-avatar-btn {
        width: 50px;
        height: 50px;
      }

      .te-form-row {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .te-modal {
        border-radius: 12px;
      }

      .te-header {
        padding: 15px 20px;
      }

      .te-title {
        font-size: 0.8rem;
      }

      .te-close {
        font-size: 0.55rem;
        padding: 6px 12px;
      }

      .te-body {
        padding: 20px 15px;
      }

      .te-content {
        grid-template-columns: 1fr;
      }

      .te-avatar-section {
        flex-direction: column;
        align-items: center;
      }

      .te-avatar-preview,
      .te-avatar-placeholder {
        width: 100px;
        height: 100px;
      }

      .te-avatar-placeholder {
        font-size: 40px;
      }

      .te-avatar-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .te-avatar-btn {
        width: 55px;
        height: 55px;
      }

      .te-label {
        font-size: 0.5rem;
      }

      .te-input {
        font-size: 13px;
        padding: 9px 11px;
      }

      .te-btn {
        font-size: 0.6rem;
        padding: 10px 20px;
      }

      .te-actions {
        flex-direction: column;
      }
    }
  `}</style>
);

export default TeacherEditModalCSS;
