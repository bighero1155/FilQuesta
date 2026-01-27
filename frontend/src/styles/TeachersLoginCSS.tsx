import React from 'react';

const TeachersLoginCSS: React.FC = () => {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      .teachers-login-container {
        font-family: 'Press Start 2P', cursive;
        background: 
          url("/assets/teaching.jpg") center/cover no-repeat,
          linear-gradient(135deg, #1e90ff, #4169e1, #87ceeb);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }

      /* Glowing faded circles */
      .teachers-login-glow-1 {
        position: absolute;
        top: 10%;
        left: 10%;
        width: 200px;
        height: 200px;
        background: rgba(32, 156, 255, 0.15);
        border-radius: 50%;
        filter: blur(100px);
        pointer-events: none;
      }

      .teachers-login-glow-2 {
        position: absolute;
        bottom: 20%;
        right: 15%;
        width: 150px;
        height: 150px;
        background: rgba(118, 75, 162, 0.15);
        border-radius: 50%;
        filter: blur(80px);
        pointer-events: none;
      }

      /* Back button */
      .teachers-login-back-btn-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        margin: 1rem;
        z-index: 10;
      }

      .teachers-login-back-btn {
        background: #209cff;
        color: #fff;
        border: 2px solid #764ba2;
        font-size: 0.8rem;
        font-family: 'Press Start 2P', cursive;
        border-radius: 6px;
        box-shadow: 3px 3px 0 #764ba2;
        transition: all 0.2s ease;
        padding: 0.5rem 0.75rem;
        text-decoration: none;
        display: inline-block;
      }

      .teachers-login-back-btn:hover {
        background: #1a86d6;
        transform: translate(-1px, -1px);
        box-shadow: 4px 4px 0 #764ba2;
        color: #fff;
      }

      /* Login card wrapper */
      .teachers-login-card-wrapper {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 450px;
        padding: 0 1rem;
      }

      .teachers-login-card {
        background: rgba(255, 255, 255, 0.35);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-radius: 12px;
        box-shadow: 8px 8px 0 #209cff;
        border: 2px solid rgba(255, 255, 255, 0.5);
        padding: 2rem;
      }

      /* Header */
      .teachers-login-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .teachers-login-title {
        color: #012252ff;
        font-size: 1.2rem;
        text-transform: uppercase;
        text-shadow: 2px 2px 0 rgba(32, 156, 255, 0.2);
        margin-bottom: 0.5rem;
        font-weight: bold;
      }

      .teachers-login-subtitle {
        font-size: 0.8rem;
        color: #ffffffff;
        margin-bottom: 0;
      }

      /* Error alert */
      .teachers-login-alert {
        background: rgba(220, 53, 69, 0.1);
        color: #dc3545;
        border-radius: 8px;
        border: 2px solid rgba(220, 53, 69, 0.3);
        font-size: 0.75rem;
        padding: 0.75rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
      }

      .teachers-login-alert-icon {
        margin-right: 0.5rem;
      }

      /* Form */
      .teachers-login-form-group {
        margin-bottom: 1.5rem;
      }

      .teachers-login-label {
        color: #000000ff;
        font-size: 0.8rem;
        font-weight: 600;
        display: block;
        margin-bottom: 0.5rem;
      }

      .teachers-login-input {
        background: white;
        border-radius: 8px;
        font-size: 0.85rem;
        border: 2px solid #68e0cf;
        transition: all 0.3s ease;
        color: #000000ff;
        width: 100%;
        padding: 0.75rem;
      }

      .teachers-login-input:focus {
        outline: none !important;
        border-color: #209cff;
      }

      .teachers-login-input::placeholder {
        color: #6c757d;
        opacity: 0.8;
      }

      /* Submit button */
      .teachers-login-submit-btn {
        background: linear-gradient(135deg, #209cff, #68e0cf);
        color: white;
        border-radius: 10px;
        font-size: 0.9rem;
        box-shadow: 0 8px 20px rgba(32, 156, 255, 0.3);
        transition: all 0.2s ease;
        width: 100%;
        padding: 0.75rem;
        border: none;
        font-weight: 600;
        cursor: pointer;
      }

      .teachers-login-submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(32, 156, 255, 0.4);
      }

      .teachers-login-submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .teachers-login-spinner {
        width: 1rem;
        height: 1rem;
        margin-right: 0.5rem;
        display: inline-block;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: teachers-login-spin 0.6s linear infinite;
      }

      @keyframes teachers-login-spin {
        to { transform: rotate(360deg); }
      }

      /* Register section */
      .teachers-login-register-section {
        margin-top: 1.5rem;
        text-align: center;
      }

      .teachers-login-register-box {
        background: rgba(32, 156, 255, 0.05);
        border: 1px solid rgba(32, 156, 255, 0.1);
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
      }

      .teachers-login-register-text {
        color: #1a91f9ff;
        font-size: 0.8rem;
      }

      .teachers-login-register-link {
        color: #ffffffff;
        transition: color 0.3s ease;
        font-size: 0.8rem;
        text-decoration: none;
        font-weight: 600;
        margin-left: 0.25rem;
      }

      .teachers-login-register-link:hover {
        color: #209cff;
        text-decoration: underline;
      }

      /* --------------------------------------- */
      /*          📱 MOBILE RESPONSIVE            */
      /* --------------------------------------- */

      @media (max-width: 768px) {
        .teachers-login-card {
          padding: 1.5rem !important;
          max-width: 90% !important;
        }

        .teachers-login-title {
          font-size: 1rem !important;
        }

        .teachers-login-input {
          font-size: 0.8rem !important;
          padding: 0.8rem !important;
        }

        .teachers-login-submit-btn {
          font-size: 0.8rem !important;
        }

        .teachers-login-back-btn {
          font-size: 0.65rem !important;
        }
      }

      @media (max-width: 576px) {
        .teachers-login-card {
          padding: 1.2rem !important;
          max-width: 92% !important;
          margin: 10px !important;
        }

        .teachers-login-title {
          font-size: 0.9rem !important;
        }

        .teachers-login-subtitle {
          font-size: 0.7rem !important;
        }

        .teachers-login-input {
          font-size: 0.75rem !important;
          padding: 0.75rem !important;
        }

        .teachers-login-submit-btn {
          font-size: 0.75rem !important;
          padding: 0.8rem !important;
        }

        /* Glow circles smaller on mobile */
        .teachers-login-glow-1,
        .teachers-login-glow-2 {
          transform: scale(0.6);
        }

        /* Back button adjustment */
        .teachers-login-back-btn-wrapper {
          margin: 0.7rem !important;
        }

        .teachers-login-back-btn {
          transform: scale(0.85);
        }
      }
    `}</style>
  );
};

export default TeachersLoginCSS;