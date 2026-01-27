// src/styles/resultsCSS.tsx

export const resultsStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem 1rem',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #87e0ddff 0%, #e38b4cff 50%, #7ac1ecff 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
  },

  backButtonWrapper: {
    position: 'absolute' as const,
    top: '30px',
    left: '30px',
    zIndex: 10,
  },

  // Animated background elements
  bgElements: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
  },

  trophy: {
    position: 'absolute' as const,
    fontSize: '3rem',
    opacity: 0.15,
  },

  trophy1: {
    top: '10%',
    left: '15%',
  },

  trophy2: {
    top: '60%',
    left: '10%',
  },

  trophy3: {
    top: '20%',
    right: '20%',
  },

  trophy4: {
    bottom: '15%',
    right: '15%',
  },

  trophy5: {
    top: '70%',
    right: '25%',
  },

  trophy6: {
    bottom: '30%',
    left: '25%',
  },

  circle: {
    position: 'absolute' as const,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
  },

  circle1: {
    width: '300px',
    height: '300px',
    top: '-100px',
    right: '-100px',
  },

  circle2: {
    width: '400px',
    height: '400px',
    bottom: '-150px',
    left: '-150px',
  },

  circle3: {
    width: '250px',
    height: '250px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },

  contentWrapper: {
    position: 'relative' as const,
    zIndex: 2,
    width: '100%',
    maxWidth: '1000px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },

  title: {
    color: '#ffffff',
    fontSize: '3rem',
    fontWeight: 'bold' as const,
    marginBottom: '1rem',
    textAlign: 'center' as const,
    textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)',
  },

  subtitle: {
    color: '#ffffff',
    fontSize: '1.2rem',
    marginBottom: '2rem',
    textAlign: 'center' as const,
    opacity: 0.9,
  },

  profileHeaderWrapper: {
    width: '100%',
    maxWidth: '900px',
    marginBottom: '30px',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },

  resultsCard: {
    background: 'linear-gradient(to bottom, rgba(255, 154, 86, 0.85), rgba(255, 106, 0, 0.85))',
    width: '100%',
    maxWidth: '900px',
    borderRadius: '24px',
    padding: '3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.4s ease',
  },

  resultsTitle: {
    color: '#fff',
    fontSize: '2rem',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    marginBottom: '3rem',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },

  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
  },

  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2rem',
    borderRadius: '20px',
    minHeight: '100%',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.4s ease',
    flex: '1',
    minWidth: '250px',
    maxWidth: '300px',
    overflow: 'hidden',
    position: 'relative' as const,
  },

  statCardScore: {
    border: '3px solid #ff8c42',
  },

  statCardAccuracy: {
    border: '3px solid #ff6a00',
  },

  statCardRank: {
    border: '3px solid #ffb347',
  },

  statIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    textAlign: 'center' as const,
    display: 'block',
    transition: 'transform 0.4s ease',
  },

  statLabel: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },

  statLabelScore: {
    color: '#d94f00',
  },

  statLabelAccuracy: {
    color: '#c44500',
  },

  statLabelRank: {
    color: '#e67300',
  },

  statValue: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },

  statValueScore: {
    color: '#b33d00',
  },

  statValueAccuracy: {
    color: '#993800',
  },

  statValueRank: {
    color: '#cc5c00',
  },

  statSubtext: {
    fontSize: '1.25rem',
    color: '#666',
    textAlign: 'center' as const,
  },

  submittedText: {
    color: '#fff',
    fontSize: '1.1rem',
    textAlign: 'center' as const,
    marginTop: '2rem',
    textShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },

  loadingContainer: {
    textAlign: 'center' as const,
    marginTop: '3rem',
    color: '#fff',
    fontSize: '1.5rem',
  },

  alertContainer: {
    padding: '2rem',
    position: 'relative' as const,
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 50%, #ffd89b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  alertBackButton: {
    position: 'absolute' as const,
    top: '20px',
    left: '20px',
  },

  alertMessage: {
    marginTop: '3rem',
    textAlign: 'center' as const,
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  },
} as const;

export type ResultsStyles = typeof resultsStyles;