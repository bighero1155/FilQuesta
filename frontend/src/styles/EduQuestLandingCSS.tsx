const EduQuestLandingCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Press Start 2P', monospace;
      line-height: 1.6;
      overflow-x: hidden;
      background: url('/assets/luzon5.jpg') center/cover no-repeat fixed;
      scroll-behavior: smooth;
    }

    .hero-section {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      position: relative;
      z-index: 2;
      background: rgba(0, 0, 0, 0.3);
      will-change: transform;
    }

    .hero-title {
      font-size: clamp(2rem, 8vw, 4rem);
      font-weight: bold;
      color: white;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      animation: glow 2s ease-in-out infinite alternate;
    }

    @keyframes glow {
      from { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.2); }
      to { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.4); }
    }

    .hero-subtitle {
      font-size: clamp(0.7rem, 2vw, 1rem);
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
      max-width: 600px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      line-height: 1.8;
    }

    .start-button {
      background: linear-gradient(45deg, #ff6b6b, #feca57);
      color: white;
      border: none;
      padding: 1.5rem 3rem;
      font-size: clamp(0.8rem, 2vw, 1rem);
      font-weight: bold;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      text-transform: uppercase;
      letter-spacing: 2px;
      position: relative;
      overflow: hidden;
      font-family: 'Press Start 2P', monospace;
    }

    .start-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
    }

    .start-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s;
    }

    .start-button:hover::before {
      left: 100%;
    }

    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 43%;
      transform: translateX(-30%);
      color: white;
      font-size: 0.6rem;
      text-align: center;
      animation: bounce 2s infinite;
      width: max-content;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-10px); }
      60% { transform: translateX(-50%) translateY(-5px); }
    }

    .scroll-down-arrow {
      width: 20px;
      height: 20px;
      border: 2px solid white;
      border-top: none;
      border-left: none;
      transform: rotate(45deg);
      margin: 10px auto;
    }

    .floating {
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .content-section {
      position: relative;
      z-index: 2;
      background: white;
      min-height: 100vh;
      padding: 4rem 2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      font-size: clamp(1.2rem, 4vw, 2rem);
      color: #333;
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
      line-height: 1.8;
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 4px;
      background: linear-gradient(45deg, #ff6b6b, #feca57);
      border-radius: 2px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .feature-card {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.6s ease;
      text-align: center;
      position: relative;
      overflow: hidden;
      opacity: 0;
      transform: translateY(30px);
    }

    .feature-card.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .feature-title {
      font-size: clamp(0.8rem, 2vw, 1rem);
      color: #333;
      margin-bottom: 1rem;
      font-weight: bold;
    }

    .feature-description {
      color: #666;
      line-height: 1.8;
      font-size: clamp(0.6rem, 1.5vw, 0.8rem);
      font-family: Arial, sans-serif;
    }

    .testimonials-section {
      background: #f8fafc;
      padding: 4rem 2rem;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .testimonial-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      position: relative;
      transition: all 0.6s ease;
      opacity: 0;
      transform: translateY(30px);
    }

    .testimonial-card.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .testimonial-text {
      font-style: italic;
      color: #555;
      margin-bottom: 1rem;
      font-size: clamp(0.6rem, 1.5vw, 0.8rem);
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }

    .testimonial-author {
      font-weight: bold;
      color: #333;
      font-size: clamp(0.6rem, 1.5vw, 0.8rem);
    }

    .cta-section {
      background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
      padding: 4rem 2rem;
      text-align: center;
      color: white;
    }

    .cta-title {
      font-size: clamp(1.2rem, 4vw, 2rem);
      margin-bottom: 1rem;
      font-weight: bold;
    }

    .cta-subtitle {
      font-size: clamp(0.7rem, 2vw, 1rem);
      margin-bottom: 2rem;
      opacity: 0.9;
      font-family: Arial, sans-serif;
    }

    .footer {
      background: #1a202c;
      color: white;
      padding: 3rem 2rem 1rem;
      text-align: center;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .footer-link {
      color: #cbd5e0;
      text-decoration: none;
      transition: color 0.3s ease;
      font-size: 0.7rem;
    }

    .footer-link:hover {
      color: #feca57;
    }

    .footer-text {
      font-size: 0.6rem;
      font-family: Arial, sans-serif;
    }
  `}</style>
);

export default EduQuestLandingCSS;
