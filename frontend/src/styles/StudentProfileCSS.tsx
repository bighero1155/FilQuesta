import React from 'react';

const StudentProfileCSS: React.FC = () => {
  return (
    <style>{`
      /* ===== Layout ===== */
      .student-profile {
        flex: 1;
        padding: 2rem 1.5rem;
        padding-left: calc(290px + 1.5rem);
        background: linear-gradient(to bottom right, #275062ff, #45788bff, #2c5364);
        color: #fff;
        display: flex;
        justify-content: center;
        min-height: 100vh;
        width: 100%;
        position: relative;
        overflow: hidden;
      }

      /* Animated Background Elements */
      .profile-bg-elements {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
        pointer-events: none;
      }

      .profile-icon {
        position: absolute;
        font-size: 4.5rem;
        opacity: 0.12;
        animation: float 20s infinite ease-in-out;
      }

      .profile-icon-1 { top: 8%; left: 5%; animation-delay: 0s; }
      .profile-icon-2 { top: 72%; left: 15%; animation-delay: 3s; }
      .profile-icon-3 { top: 25%; right: 8%; animation-delay: 1.5s; }
      .profile-icon-4 { bottom: 18%; right: 25%; animation-delay: 4s; }
      .profile-icon-5 { top: 60%; right: 3%; animation-delay: 2s; }
      .profile-icon-6 { bottom: 12%; left: 35%; animation-delay: 5s; }
      .profile-icon-7 { top: 45%; left: 22%; animation-delay: 6s; }
      .profile-icon-8 { bottom: 35%; right: 12%; animation-delay: 7s; }
      .profile-icon-9 { top: 15%; left: 42%; animation-delay: 8s; }
      .profile-icon-10 { bottom: 55%; right: 38%; animation-delay: 9s; }
      .profile-icon-11 { top: 88%; left: 8%; animation-delay: 10s; }
      .profile-icon-12 { top: 32%; right: 45%; animation-delay: 11s; }
      .profile-icon-13 { bottom: 8%; left: 58%; animation-delay: 12s; }
      .profile-icon-14 { top: 52%; left: 62%; animation-delay: 13s; }
      .profile-icon-15 { bottom: 68%; right: 18%; animation-delay: 14s; }
      .profile-icon-16 { top: 5%; right: 32%; animation-delay: 15s; }

      .profile-bg-circle {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        animation: pulse 15s infinite ease-in-out;
      }

      .profile-bg-circle-1 {
        width: 300px;
        height: 300px;
        top: -100px;
        right: -100px;
      }

      .profile-bg-circle-2 {
        width: 400px;
        height: 400px;
        bottom: -150px;
        left: -150px;
        animation-delay: 3s;
      }

      .profile-bg-circle-3 {
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

      @media (max-width: 768px) {
        .student-profile {
          padding-left: 1rem !important;
          padding-right: 1rem;
          padding-top: 90px;
        }

        .profile-icon {
          font-size: 3rem;
        }
      }

      /* ===== Grid ===== */
      .profile-grid {
        display: grid;
        gap: 1.5rem;
        width: 100%;
        align-items: stretch;
        position: relative;
        z-index: 5;
      }

      @media (min-width: 1100px) {
        .profile-grid {
          grid-template-columns: 160px 160px 160px 1fr;
        }
      }

      @media (min-width: 768px) and (max-width: 1099px) {
        .profile-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        .profile-header-card {
          grid-column: span 3;
        }
      }

      @media (max-width: 767px) {
        .profile-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .profile-header-card {
          grid-column: span 2;
        }
      }

      /* =====================================================
         SMALL STAT CARDS (Coins / Score / Rank)
         ===================================================== */
      .profile-grid > .stat-card {
        aspect-ratio: 1 / 1;
        max-width: 170px;
        padding: 1rem;
        border-radius: 18px;

        /* ✅ NEW: visible square card background */
        background: rgba(255,255,255,0.18);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        margin: 0 auto;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        position: relative;
        z-index: 5;
      }

      .profile-grid > .stat-card .stat-icon {
        font-size: 2rem;
      }

      .profile-grid > .stat-card .stat-label {
        font-size: 0.95rem;
        margin-top: 0.5rem;
        opacity: 0.95;
      }

      .profile-grid > .stat-card .stat-value {
        font-size: 1.15rem;
        font-weight: bold;
        margin-top: 0.3rem;
      }

      /* =====================================================
         BIG STAT CARDS (Games / Quizzes)
         ===================================================== */
      .pill-grid .stat-card {
        background: rgba(255,255,255,0.16);
        backdrop-filter: blur(10px);
        border-radius: 22px;
        aspect-ratio: 1 / 1;
        width: 100%;
        max-width: 260px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 1.4rem;
        box-shadow: 0 6px 18px rgba(0,0,0,0.35);
        position: relative;
        z-index: 5;
      }

      .pill-grid .stat-card .stat-icon {
        font-size: 2.4rem;
      }

      .pill-grid .stat-card .stat-label {
        margin-top: 0.8rem;
        font-size: 1.1rem;
        line-height: 1.3;
        opacity: 0.95;
        word-break: break-word;
      }

      .pill-grid .stat-card .stat-value {
        margin-top: 0.6rem;
        font-size: 1.35rem;
        font-weight: bold;
      }

      /* ===== Profile Header Card ===== */
      .profile-header-card {
        cursor: pointer;
        background: rgba(255,255,255,0.10);
        border-radius: 22px;
        padding: 1.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: brightness(1.25);
        box-shadow: 0 6px 18px rgba(0,0,0,0.35);
        position: relative;
        z-index: 5;
      }

      /* ===== Collapsible Info ===== */
      .collapse-box {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-height 0.35s ease, opacity 0.35s ease;
        position: relative;
        z-index: 5;
      }

      .collapse-box.open {
        max-height: 500px;
        opacity: 1;
      }

      .collapse-content {
        background: rgba(255,255,255,0.06);
        border-radius: 1rem;
      }

      /* ===== Pill Sections ===== */
      .pill-section {
        text-align: center;
        position: relative;
        z-index: 5;
      }

      .pill-section h4 {
        margin-bottom: 1.2rem;
        font-size: 1.15rem;
        opacity: 0.95;
        letter-spacing: 0.5px;
      }

      .pill-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(240px, 1fr));
        gap: 1.6rem;
        justify-content: center;
      }

      @media (max-width: 900px) {
        .pill-grid {
          grid-template-columns: repeat(2, minmax(220px, 1fr));
        }
      }

      @media (max-width: 500px) {
        .pill-grid {
          grid-template-columns: repeat(1, minmax(200px, 1fr));
        }
      }

      /* ===== Future Stats ===== */
      .future-stats {
        background: rgba(255,255,255,0.06);
        padding: 2rem;
        border-radius: 1rem;
        min-height: 180px;
        text-align: center;
        color: #aaa;
        position: relative;
        z-index: 5;
      }
    `}</style>
  );
};

export default StudentProfileCSS;