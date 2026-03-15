import { CSSProperties } from 'react';

export const adminReportsStyles = {
  reportsPage: {
    minHeight: '100vh',
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
    position: 'relative',
    overflowX: 'hidden',
  } as CSSProperties,

  reportsBgElements: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
    pointerEvents: 'none',
  } as CSSProperties,

  reportIcon: {
    position: 'absolute',
    fontSize: '3rem',
    opacity: 0.15,
  } as CSSProperties,

  circle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
  } as CSSProperties,

  pageHeader: {
    marginTop: '20px',
  } as CSSProperties,

  pageTitle: {
    color: 'white',
    fontSize: 'clamp(1.8rem, 5vw, 3rem)',
    fontWeight: 'bold',
    textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    marginBottom: '1rem',
  } as CSSProperties,

  pageSubtitle: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  } as CSSProperties,

  statCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.4s ease',
    height: '100%',
  } as CSSProperties,

  statIcon: {
    fontSize: '2rem',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    flexShrink: 0,
  } as CSSProperties,

  statIconBlue: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  } as CSSProperties,

  statIconGreen: {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  } as CSSProperties,

  statIconPurple: {
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  } as CSSProperties,

  statIconPink: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  } as CSSProperties,

  statIconCyan: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00c6ff 100%)',
  } as CSSProperties,

  statIconOrange: {
    background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  } as CSSProperties,

  statContent: {
    flex: 1,
    minWidth: 0,
  } as CSSProperties,

  statNumber: {
    color: '#2c3e50',
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    fontWeight: 'bold',
    margin: 0,
    lineHeight: 1,
  } as CSSProperties,

  statLabel: {
    color: '#7f8c8d',
    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
    margin: '0.4rem 0 0 0',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as CSSProperties,

  dataSection: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '25px',
    padding: '1.5rem',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    overflowX: 'auto',
  } as CSSProperties,

  leaderboardSection: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '25px',
    padding: '1.5rem',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
  } as CSSProperties,

  sectionTitle: {
    color: '#2c3e50',
    fontSize: 'clamp(1.2rem, 3vw, 2rem)',
    fontWeight: 'bold',
  } as CSSProperties,

  // Shared table styles
  quizTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: 'clamp(0.78rem, 2vw, 0.95rem)',
    minWidth: '500px',
  } as CSSProperties,

  quizTh: {
    padding: '0.75rem 0.85rem',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    fontWeight: 600,
    textAlign: 'left' as const,
    whiteSpace: 'nowrap' as const,
    fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
  } as CSSProperties,

  quizTr: {
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    transition: 'background 0.2s',
  } as CSSProperties,

  quizTd: {
    padding: '0.75rem 0.85rem',
    color: '#2c3e50',
    verticalAlign: 'middle' as const,
    fontSize: 'clamp(0.78rem, 2vw, 0.95rem)',
  } as CSSProperties,

  quizBadge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    borderRadius: '20px',
    padding: '0.2rem 0.6rem',
    fontWeight: 600,
    fontSize: 'clamp(0.72rem, 1.8vw, 0.85rem)',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  quizEditBtn: {
    background: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.35rem 0.65rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  } as CSSProperties,

  quizDeleteBtn: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.35rem 0.65rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  } as CSSProperties,

  deleteSuccessAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    borderRadius: '10px',
    padding: '0.75rem 1.25rem',
    marginBottom: '1rem',
    fontSize: '0.95rem',
    fontWeight: 500,
  } as CSSProperties,

  leaderboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  } as CSSProperties,

  leaderboardRow: {
    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
    border: '2px solid rgba(79, 172, 254, 0.3)',
    borderRadius: '15px',
    padding: '0.9rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  leaderboardRowTopThree: {
    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
    borderColor: 'rgba(251, 191, 36, 0.5)',
  } as CSSProperties,

  rankBadge: {
    minWidth: '44px',
    width: '44px',
    height: '44px',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'white',
    boxShadow: '0 4px 10px rgba(79, 172, 254, 0.3)',
    flexShrink: 0,
  } as CSSProperties,

  rankBadgeTopThree: {
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    boxShadow: '0 4px 10px rgba(251, 191, 36, 0.4)',
  } as CSSProperties,

  playerInfoSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    minWidth: 0,
  } as CSSProperties,

  playerAvatarWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    overflow: 'hidden',
    flexShrink: 0,
  } as CSSProperties,

  playerAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as CSSProperties,

  playerText: {
    flex: 1,
    minWidth: 0,
  } as CSSProperties,

  playerUsername: {
    fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '0.15rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  playerRankText: {
    fontSize: 'clamp(0.72rem, 2vw, 0.85rem)',
    color: '#7f8c8d',
  } as CSSProperties,

  playerScores: {
    textAlign: 'right' as const,
    flexShrink: 0,
  } as CSSProperties,

  combinedScore: {
    fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
    fontWeight: 'bold',
    color: '#4facfe',
    lineHeight: 1,
    marginBottom: '0.2rem',
  } as CSSProperties,

  combinedScoreTopThree: {
    color: '#fbbf24',
  } as CSSProperties,

  scoreDetails: {
    fontSize: 'clamp(0.65rem, 1.8vw, 0.85rem)',
    color: '#7f8c8d',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  errorCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '25px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    margin: '2rem auto',
  } as CSSProperties,

  errorIcon: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
  } as CSSProperties,

  errorCardTitle: {
    color: '#e74c3c',
    marginBottom: '1rem',
    fontWeight: 'bold',
  } as CSSProperties,

  errorCardText: {
    color: '#666',
    fontSize: '1rem',
    marginBottom: '1.5rem',
  } as CSSProperties,

  btnRetry: {
    background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as CSSProperties,
};

export const adminReportsStyleString = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-30px) rotate(5deg); }
    50% { transform: translateY(-50px) rotate(-5deg); }
    75% { transform: translateY(-30px) rotate(3deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.08; }
    50% { transform: scale(1.1); opacity: 0.15; }
  }

  .report-icon { animation: float 20s infinite ease-in-out; }
  .icon-1 { top: 10%; left: 15%; animation-delay: 0s; }
  .icon-2 { top: 60%; left: 10%; animation-delay: 3s; }
  .icon-3 { top: 20%; right: 20%; animation-delay: 1.5s; }
  .icon-4 { bottom: 15%; right: 15%; animation-delay: 4s; }
  .icon-5 { top: 70%; right: 25%; animation-delay: 2s; }
  .icon-6 { bottom: 30%; left: 25%; animation-delay: 5s; }

  .circle { animation: pulse 15s infinite ease-in-out; }
  .circle-1 { width: 300px; height: 300px; top: -100px; right: -100px; }
  .circle-2 { width: 400px; height: 400px; bottom: -150px; left: -150px; animation-delay: 3s; }
  .circle-3 { width: 250px; height: 250px; top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 1.5s; }

  .stat-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  }

  .quiz-table-row:hover {
    background: rgba(79, 172, 254, 0.06);
  }

  .quiz-edit-btn:hover {
    background: #d68910 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.4);
  }

  .quiz-delete-btn:hover {
    background: #c0392b !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
  }

  .leaderboard-row:hover {
    transform: translateX(4px);
    box-shadow: 0 5px 20px rgba(79, 172, 254, 0.3);
    border-color: rgba(79, 172, 254, 0.5);
  }

  .leaderboard-row.top-three:hover {
    box-shadow: 0 5px 20px rgba(251, 191, 36, 0.4);
  }

  .btn-retry:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
  }

  /* ── Tablet (≤992px) ── */
  @media (max-width: 992px) {
    .report-icon { font-size: 2.2rem; }
  }

  /* ── Mobile (≤768px) ── */
  @media (max-width: 768px) {
    .report-icon { font-size: 1.6rem; }

    /* Stats: 2 per row on mobile */
    .admin-reports-row .col-md-4,
    .admin-reports-row .col-md-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }

    /* Section padding tightened */
    .admin-data-section {
      padding: 1rem !important;
      border-radius: 16px !important;
    }

    /* Leaderboard row: tighter */
    .leaderboard-row {
      padding: 0.75rem 0.85rem;
      gap: 0.6rem;
    }

    /* Score details: hide on very small */
    .admin-score-details {
      display: none;
    }

    /* Table scroll hint */
    .admin-table-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 8px;
    }

    .admin-table-wrapper::after {
      content: '← scroll →';
      display: block;
      text-align: center;
      font-size: 0.7rem;
      color: #aaa;
      padding: 4px 0 2px;
    }

    /* Page header tighter */
    .admin-reports-header {
      margin-top: 10px !important;
    }
  }

  /* ── Small Mobile (≤480px) ── */
  @media (max-width: 480px) {
    /* Stats: 1 per row on very small screens */
    .admin-reports-row .col-md-4,
    .admin-reports-row .col-md-6 {
      flex: 0 0 100%;
      max-width: 100%;
    }

    .admin-page-title {
      font-size: 1.5rem !important;
    }

    .admin-page-subtitle {
      font-size: 0.85rem !important;
    }

    .leaderboard-row {
      padding: 0.65rem 0.75rem;
    }

    .admin-section-title {
      font-size: 1.1rem !important;
    }
  }

  /* ── Large screens (≥1400px) ── */
  @media (min-width: 1400px) {
    .admin-stat-icon {
      width: 80px !important;
      height: 80px !important;
      font-size: 3.5rem !important;
    }

    .admin-stat-number {
      font-size: 2.8rem !important;
    }
  }
`;