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
    fontSize: '3rem',
    fontWeight: 'bold',
    textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    marginBottom: '1rem',
  } as CSSProperties,

  pageSubtitle: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: '1.2rem',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  } as CSSProperties,

  statCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.4s ease',
    height: '100%',
  } as CSSProperties,

  statIcon: {
    fontSize: '3.5rem',
    width: '80px',
    height: '80px',
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

  statContent: {
    flex: 1,
  } as CSSProperties,

  statNumber: {
    color: '#2c3e50',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: 0,
    lineHeight: 1,
  } as CSSProperties,

  statLabel: {
    color: '#7f8c8d',
    fontSize: '1rem',
    margin: '0.5rem 0 0 0',
    fontWeight: 600,
  } as CSSProperties,

  dataSection: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '25px',
    padding: '2.5rem',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
  } as CSSProperties,

  leaderboardSection: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '25px',
    padding: '2.5rem',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
  } as CSSProperties,

  sectionTitle: {
    color: '#2c3e50',
    fontSize: '2rem',
    fontWeight: 'bold',
  } as CSSProperties,

  leaderboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as CSSProperties,

  leaderboardRow: {
    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
    border: '2px solid rgba(79, 172, 254, 0.3)',
    borderRadius: '15px',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  leaderboardRowTopThree: {
    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
    borderColor: 'rgba(251, 191, 36, 0.5)',
  } as CSSProperties,

  rankBadge: {
    minWidth: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: 'white',
    boxShadow: '0 4px 10px rgba(79, 172, 254, 0.3)',
  } as CSSProperties,

  rankBadgeTopThree: {
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    boxShadow: '0 4px 10px rgba(251, 191, 36, 0.4)',
  } as CSSProperties,

  playerInfoSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  } as CSSProperties,

  playerAvatarWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    overflow: 'hidden',
  } as CSSProperties,

  playerAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as CSSProperties,

  playerText: {
    flex: 1,
  } as CSSProperties,

  playerUsername: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '0.25rem',
  } as CSSProperties,

  playerRankText: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
  } as CSSProperties,

  playerScores: {
    textAlign: 'right',
  } as CSSProperties,

  combinedScore: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#4facfe',
    lineHeight: 1,
    marginBottom: '0.25rem',
  } as CSSProperties,

  combinedScoreTopThree: {
    color: '#fbbf24',
  } as CSSProperties,

  scoreDetails: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
  } as CSSProperties,

  errorCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '25px',
    padding: '3rem',
    textAlign: 'center',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    margin: '2rem auto',
  } as CSSProperties,

  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  } as CSSProperties,

  errorCardTitle: {
    color: '#e74c3c',
    marginBottom: '1rem',
    fontWeight: 'bold',
  } as CSSProperties,

  errorCardText: {
    color: '#666',
    fontSize: '1.1rem',
    marginBottom: '2rem',
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

// CSS string for animations and pseudo-classes that can't be done inline
export const adminReportsStyleString = `
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
      opacity: 0.08;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.15;
    }
  }

  .report-icon {
    animation: float 20s infinite ease-in-out;
  }

  .icon-1 {
    top: 10%;
    left: 15%;
    animation-delay: 0s;
  }

  .icon-2 {
    top: 60%;
    left: 10%;
    animation-delay: 3s;
  }

  .icon-3 {
    top: 20%;
    right: 20%;
    animation-delay: 1.5s;
  }

  .icon-4 {
    bottom: 15%;
    right: 15%;
    animation-delay: 4s;
  }

  .icon-5 {
    top: 70%;
    right: 25%;
    animation-delay: 2s;
  }

  .icon-6 {
    bottom: 30%;
    left: 25%;
    animation-delay: 5s;
  }

  .circle {
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

  .stat-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  }

  .leaderboard-row:hover {
    transform: translateX(5px);
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

  @media (max-width: 768px) {
    .report-icon {
      font-size: 2rem;
    }

    .page-title {
      font-size: 2rem;
    }

    .page-subtitle {
      font-size: 1rem;
    }

    .stat-card {
      padding: 1.5rem;
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
    }

    .stat-number {
      font-size: 2rem;
    }

    .data-section {
      padding: 1.5rem;
    }

    .leaderboard-section {
      padding: 1.5rem;
    }

    .section-title {
      font-size: 1.5rem;
    }

    .leaderboard-row {
      padding: 1rem;
      gap: 1rem;
    }

    .rank-badge {
      min-width: 40px;
      height: 40px;
      font-size: 1rem;
    }

    .player-avatar-wrapper {
      width: 40px;
      height: 40px;
    }

    .player-username {
      font-size: 1rem;
    }

    .combined-score {
      font-size: 1.4rem;
    }

    .score-details {
      font-size: 0.75rem;
    }
  }
`;