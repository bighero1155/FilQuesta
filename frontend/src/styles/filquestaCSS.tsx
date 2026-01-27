// filquestaCSS.tsx
export const filQuestaStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  .fq-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 20px;
    flex-wrap: wrap;
  }

  .fq-letter {
    font-family: 'Press Start 2P', cursive;
    font-size: 4rem;
    font-weight: bold;
    text-shadow: 
      4px 4px 0 rgba(0, 0, 0, 0.3),
      0 0 10px currentColor,
      0 0 0px currentColor;
    animation: bounce 1.5s ease-in-out infinite;
    display: inline-block;
    position: relative;
    transition: all 0.3s ease;
  }

  .fq-letter.clickable {
    cursor: pointer;
  }

  .fq-letter.clickable:hover {
    transform: translateY(-10px) scale(1.2) rotate(5deg);
    filter: brightness(1.3);
  }

  .fq-letter::before {
    content: attr(data-letter);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    opacity: 0.7;
  }

  .fq-letter:nth-child(1) {
    color: #ff6b6b;
    animation-delay: 0s;
  }

  .fq-letter:nth-child(2) {
    color: #feca57;
    animation-delay: 0.1s;
  }

  .fq-letter:nth-child(3) {
    color: #48dbfb;
    animation-delay: 0.2s;
  }

  .fq-letter:nth-child(4) {
    color: #1dd1a1;
    animation-delay: 0.3s;
  }

  .fq-letter:nth-child(5) {
    color: #ff9ff3;
    animation-delay: 0.4s;
  }

  .fq-letter:nth-child(6) {
    color: #54a0ff;
    animation-delay: 0.5s;
  }

  .fq-letter:nth-child(7) {
    color: #00d2d3;
    animation-delay: 0.6s;
  }

  .fq-letter:nth-child(8) {
    color: #8665c7ff;
    animation-delay: 0.7s;
  }

  .fq-letter:nth-child(9) {
    color: #ff9ff3;
    animation-delay: 0.8s;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    25% {
      transform: translateY(-20px) scale(1.05);
    }
    50% {
      transform: translateY(0) scale(1);
    }
  }

  .fq-subtitle {
    font-family: 'Press Start 2P', cursive;
    font-size: 1.2rem;
    text-align: center;
    margin-top: 20px;
    background: linear-gradient(135deg, #7e98edff 0%, #ffffffff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    animation: pulse 2s ease-in-out infinite;
    line-height: 1.8;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }

  .fq-sparkle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
    animation: sparkle 1.5s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes sparkle {
    0%, 100% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .fq-sparkle:nth-child(1) {
    top: 10%;
    left: 20%;
    animation-delay: 0s;
  }

  .fq-sparkle:nth-child(2) {
    top: 30%;
    right: 15%;
    animation-delay: 0.3s;
  }

  .fq-sparkle:nth-child(3) {
    bottom: 20%;
    left: 30%;
    animation-delay: 0.6s;
  }

  .fq-sparkle:nth-child(4) {
    top: 50%;
    right: 25%;
    animation-delay: 0.9s;
  }

  .fq-sparkle:nth-child(5) {
    bottom: 30%;
    right: 20%;
    animation-delay: 1.2s;
  }

  .fq-wrapper {
    position: relative;
  }

  /* Admin Login Modal */
  .admin-login-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .admin-login-modal {
    background: white;
    border-radius: 20px;
    max-width: 450px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.4s ease-out;
    overflow: hidden;
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

  .admin-login-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    text-align: center;
    position: relative;
  }

  .admin-login-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .admin-login-header p {
    margin: 0.5rem 0 0 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }

  .btn-close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-close-modal:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  .btn-close-modal:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .admin-login-body {
    padding: 2rem;
  }

  .login-form-group {
    margin-bottom: 1.5rem;
  }

  .login-label {
    display: block;
    font-weight: 600;
    color: #667eea;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .login-input-wrapper {
    position: relative;
  }

  .login-input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #667eea;
    opacity: 0.7;
  }

  .login-input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    border: 2px solid #e0e7ff;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .login-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  .login-input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .login-error {
    background: #fee;
    color: #c33;
    padding: 0.875rem;
    border-radius: 10px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    border: 1px solid #fcc;
    animation: shake 0.3s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .btn-login {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-login:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  .btn-login:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-login:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .admin-hint {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.85rem;
    color: #999;
  }

  .loading-dots {
    display: inline-flex;
    gap: 4px;
  }

  .loading-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: dotPulse 1.4s infinite ease-in-out;
  }

  .loading-dot:nth-child(1) { animation-delay: 0s; }
  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dotPulse {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }

  @media (max-width: 768px) {
    .fq-letter {
      font-size: 2.5rem;
    }

    .fq-subtitle {
      font-size: 0.8rem;
    }

    .fq-container {
      gap: 4px;
    }

    .admin-login-header h2 {
      font-size: 1.25rem;
    }

    .admin-login-body {
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .fq-letter {
      font-size: 1.8rem;
    }

    .fq-subtitle {
      font-size: 0.7rem;
    }

    .fq-container {
      gap: 2px;
    }

    .admin-login-header {
      padding: 1.5rem;
    }
  }
`;