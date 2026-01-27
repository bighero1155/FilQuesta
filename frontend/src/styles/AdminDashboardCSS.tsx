// AdminDashboardCSS.tsx
import React from 'react';

const AdminDashboardCSS: React.FC = () => {
  return (
    <style>{`
      .admin-dashboard {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        position: relative;
        overflow-x: hidden;
      }

      /* Animated Background */
      .science-bg-elements {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
        pointer-events: none;
      }

      .molecule {
        position: absolute;
        font-size: 3rem;
        opacity: 0.15;
        animation: float 20s infinite ease-in-out;
      }

      .molecule-1 { top: 10%; left: 15%; animation-delay: 0s; }
      .molecule-2 { top: 60%; left: 10%; animation-delay: 3s; }
      .molecule-3 { top: 20%; right: 20%; animation-delay: 1.5s; }
      .molecule-4 { bottom: 15%; right: 15%; animation-delay: 4s; }
      .molecule-5 { top: 70%; right: 25%; animation-delay: 2s; }
      .molecule-6 { bottom: 30%; left: 25%; animation-delay: 5s; }

      .circle {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        animation: pulse 15s infinite ease-in-out;
      }

      .circle-1 {
        width: 300px;
        height: 300px;
        top: -100px;
        right: -100px;
      }

      .circle-2 {
        width: 400px;
        height: 400px;
        bottom: -150px;
        left: -150px;
        animation-delay: 3s;
      }

      .circle-3 {
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

      /* Navbar */
      .admin-navbar {
        position: relative;
        z-index: 10;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding: 1.5rem 0;
      }

      .navbar-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      }

      .navbar-brand h4 {
        color: white;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        text-align: center;
        margin: 0;
      }

      .nav-tabs-container {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .nav-tab {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        font-size: 1rem;
      }

      .tab-icon {
        flex-shrink: 0;
      }

      .nav-tab:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }

      .nav-tab.active {
        color: white;
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .nav-tab.logout-tab {
        margin-left: auto;
      }

      .nav-tab.logout-tab:hover {
        background: rgba(255, 100, 100, 0.2);
        border-color: rgba(255, 100, 100, 0.3);
      }

      /* Content Area */
      .content-area {
        position: relative;
        z-index: 5;
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .tab-content-wrapper {
        animation: fadeIn 0.3s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Coming Soon Box */
      .coming-soon-box {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        padding: 4rem 2rem;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        margin: 2rem auto;
      }

      .coming-soon-box svg {
        color: #667eea;
      }

      .coming-soon-box h3 {
        color: #667eea;
        margin-bottom: 1rem;
        font-weight: bold;
      }

      .coming-soon-box p {
        color: #666;
        font-size: 1.1rem;
      }

      .cosmetics-content,
      .reports-content {
        animation: fadeIn 0.3s ease-in-out;
      }

      .cosmetics-content h2,
      .reports-content h2 {
        text-align: center;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .molecule {
          font-size: 2rem;
        }

        .navbar-container {
          padding: 0 1rem;
        }

        .nav-tabs-container {
          width: 100%;
          justify-content: center;
        }

        .nav-tab {
          padding: 0.65rem 1.25rem;
          font-size: 0.95rem;
        }

        .nav-tab.logout-tab {
          margin-left: 0;
        }

        .content-area {
          padding: 1rem;
        }

        .navbar-brand h4 {
          font-size: 1.25rem;
        }

        .coming-soon-box {
          padding: 3rem 1.5rem;
        }
      }

      @media (max-width: 576px) {
        .nav-tab {
          padding: 0.6rem 1rem;
          font-size: 0.9rem;
        }

        .tab-icon {
          width: 18px;
          height: 18px;
        }
      }
    `}</style>
  );
};

export default AdminDashboardCSS;