import React, { useEffect, useState, useCallback } from "react";
import axios from "../auth/axiosInstance";
import QuizResultsTable from "../components/Users/QuizResultsTable";
import { adminReportsStyles as styles, adminReportsStyleString } from "../styles/AdminReportsCSS";
import { getImageUrl } from "../services/cosmeticService";

interface LeaderboardUser {
  user_id: number;
  username: string;
  total_score: number;
  shared_quiz_score: number;
  combined_score: number;
  avatar?: string;
  rank: string;
}

interface PageVisit {
  id: number;
  user_id: number;
  page: string;
  visit_count: number;
  total_time_spent: number;
  updated_at: string;
  user?: {
    username?: string;
  };
}

interface QuizResult {
  submission_id: number;
  student_id: number;
  student_name: string;
  quiz_id: number;
  quiz_title: string;
  score: number;
  total: number;
  submitted_at: string;
}

interface SharedQuizResult {
  participant_id: number;
  student_id: number;
  student_name: string;
  quiz_title: string;
  score: number;
  total: number;
  finished_at: string | null;
}

// ✅ added
interface Recommendation {
  id: number;
  student_id: number;
  game_link: string;
  message: string | null;
  created_at: string;
  student?: {
    username?: string;
    first_name?: string;
    last_name?: string;
  };
}

const AdminReports: React.FC = () => {
  const [pageVisits, setPageVisits] = useState<PageVisit[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [sharedQuizResults, setSharedQuizResults] = useState<SharedQuizResult[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]); // ✅ added
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [pageVisitsRes, quizResultsRes, sharedQuizResultsRes, leaderboardRes, recommendationsRes] =
        await Promise.all([
          axios.get("/page-visits"),
          axios.get("/quiz-results"),
          axios.get("/shared-quiz-results"),
          axios.get("/leaderboard"),
          axios.get("/recommendations"), // ✅ added — admin sees all recommendations
        ]);

      setPageVisits(Array.isArray(pageVisitsRes.data) ? pageVisitsRes.data : pageVisitsRes.data.data || []);
      setQuizResults(Array.isArray(quizResultsRes.data) ? quizResultsRes.data : quizResultsRes.data.data || []);
      setSharedQuizResults(Array.isArray(sharedQuizResultsRes.data) ? sharedQuizResultsRes.data : sharedQuizResultsRes.data.data || []);

      const leaderboardData = Array.isArray(leaderboardRes.data) ? leaderboardRes.data : leaderboardRes.data.data || [];
      const normalizedLeaderboard = leaderboardData.map((player: LeaderboardUser) => ({
        ...player,
        avatar: player.avatar ? getImageUrl(player.avatar) : undefined
      }));
      setLeaderboard(normalizedLeaderboard);

      // ✅ added
      const recs = Array.isArray(recommendationsRes.data)
        ? recommendationsRes.data
        : recommendationsRes.data?.data || [];
      setRecommendations(recs);

    } catch (err: any) {
      console.error("Failed to fetch reports:", err);
      setError(err.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  const calculateStats = () => {
    const safePageVisits = Array.isArray(pageVisits) ? pageVisits : [];
    const safeQuizResults = Array.isArray(quizResults) ? quizResults : [];
    const safeSharedQuizResults = Array.isArray(sharedQuizResults) ? sharedQuizResults : [];

    const totalVisits = safePageVisits.reduce((sum, visit) => sum + visit.visit_count, 0);
    const totalQuizzes = safeQuizResults.length + safeSharedQuizResults.length;
    const avgScore = safeQuizResults.length > 0
      ? (safeQuizResults.reduce((sum, result) => sum + (result.score / result.total) * 100, 0) / safeQuizResults.length).toFixed(1)
      : "0";

    return { totalVisits, totalQuizzes, avgScore };
  };

  const stats = calculateStats();

  const bgElements = (
    <div style={styles.reportsBgElements}>
      <div className="report-icon icon-1" style={styles.reportIcon}>📊</div>
      <div className="report-icon icon-2" style={styles.reportIcon}>📈</div>
      <div className="report-icon icon-3" style={styles.reportIcon}>📉</div>
      <div className="report-icon icon-4" style={styles.reportIcon}>💹</div>
      <div className="report-icon icon-5" style={styles.reportIcon}>📝</div>
      <div className="report-icon icon-6" style={styles.reportIcon}>🎯</div>
      <div className="circle circle-1" style={styles.circle}></div>
      <div className="circle circle-2" style={styles.circle}></div>
      <div className="circle circle-3" style={styles.circle}></div>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.reportsPage}>
        {bgElements}
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="text-center py-5">
            <div className="spinner-border text-white" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white mt-3 fs-5">Loading reports...</p>
          </div>
        </div>
        <style>{adminReportsStyleString}</style>
        <style>{mobileStyles}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.reportsPage}>
        {bgElements}
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>⚠️</div>
            <h3 style={styles.errorCardTitle}>Failed to Load Reports</h3>
            <p style={styles.errorCardText}>{error}</p>
            <button className="btn-retry" style={styles.btnRetry} onClick={fetchAllReports}>
              🔄 Retry
            </button>
          </div>
        </div>
        <style>{adminReportsStyleString}</style>
        <style>{mobileStyles}</style>
      </div>
    );
  }

  return (
    <div style={styles.reportsPage}>
      {bgElements}

      <div className="container position-relative" style={{ zIndex: 2 }}>

        {/* Page Header */}
        <div className="text-center mb-4 mb-md-5 admin-reports-header" style={styles.pageHeader}>
          <h1 className="admin-reports-title" style={styles.pageTitle}>
            📊 Reports & Analytics
          </h1>
          <p className="admin-reports-subtitle" style={styles.pageSubtitle}>
            Track student activity, quiz performance, and engagement metrics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4 mb-md-5">
          <div className="col-12 col-sm-4 mb-3 mb-sm-4">
            <div className="stat-card" style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.statIconBlue}}>👥</div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{stats.totalVisits}</h3>
                <p style={styles.statLabel}>Total Page Visits</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-4 mb-3 mb-sm-4">
            <div className="stat-card" style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.statIconGreen}}>📝</div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{stats.totalQuizzes}</h3>
                <p style={styles.statLabel}>Quiz Submissions</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-4 mb-3 mb-sm-4">
            <div className="stat-card" style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.statIconPurple}}>🎯</div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{stats.avgScore}%</h3>
                <p style={styles.statLabel}>Average Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Tables */}
        <div className="mb-4 mb-md-5" style={styles.dataSection}>
          <QuizResultsTable
            pageVisits={pageVisits}
            quizResults={quizResults}
            sharedQuizResults={sharedQuizResults}
            recommendations={recommendations} // ✅ fixed
          />
        </div>

        {/* Leaderboard Section */}
        <div style={styles.leaderboardSection}>
          <h2 className="text-center mb-4 admin-reports-section-title" style={styles.sectionTitle}>
            🏆 Top Players Leaderboard
          </h2>
          <div className="admin-reports-leaderboard" style={styles.leaderboardContainer}>
            {leaderboard.slice(0, 10).map((player, index) => (
              <div
                key={player.user_id}
                className={`leaderboard-row admin-reports-leaderboard-row ${index < 3 ? 'top-three' : ''}`}
                style={index < 3 ? {...styles.leaderboardRow, ...styles.leaderboardRowTopThree} : styles.leaderboardRow}
              >
                <div
                  className="admin-reports-rank-badge"
                  style={index < 3 ? {...styles.rankBadge, ...styles.rankBadgeTopThree} : styles.rankBadge}
                >
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div className="admin-reports-player-info" style={styles.playerInfoSection}>
                  <div style={styles.playerAvatarWrapper}>
                    {player.avatar?.startsWith("bi") ? (
                      <i className={`${player.avatar} fs-3`}></i>
                    ) : player.avatar ? (
                      <img
                        src={player.avatar}
                        alt="avatar"
                        style={styles.playerAvatarImg}
                        onError={(e) => {
                          console.error("Failed to load avatar:", player.avatar);
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = '<i class="bi bi-person-circle fs-3"></i>';
                          }
                        }}
                      />
                    ) : (
                      <i className="bi bi-person-circle fs-3"></i>
                    )}
                  </div>
                  <div style={styles.playerText}>
                    <div className="admin-reports-player-username" style={styles.playerUsername}>
                      {player.username}
                    </div>
                    <div style={styles.playerRankText}>{player.rank}</div>
                  </div>
                </div>
                <div className="admin-reports-player-scores" style={styles.playerScores}>
                  <div style={index < 3 ? {...styles.combinedScore, ...styles.combinedScoreTopThree} : styles.combinedScore}>
                    {player.combined_score || player.total_score}
                  </div>
                  <div className="admin-reports-score-details" style={styles.scoreDetails}>
                    Game: {player.total_score} | Quiz: {player.shared_quiz_score || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{adminReportsStyleString}</style>
      <style>{mobileStyles}</style>
    </div>
  );
};

// ✅ Mobile responsive overrides
const mobileStyles = `
  @media (max-width: 768px) {
    .admin-reports-header {
      padding: 1rem 0.5rem !important;
    }

    .admin-reports-title {
      font-size: 1.6rem !important;
    }

    .admin-reports-subtitle {
      font-size: 0.9rem !important;
    }

    .admin-reports-section-title {
      font-size: 1.3rem !important;
    }

    .admin-reports-leaderboard-row {
      flex-wrap: wrap !important;
      gap: 0.5rem !important;
      padding: 0.75rem !important;
    }

    .admin-reports-rank-badge {
      font-size: 1.2rem !important;
      min-width: 36px !important;
      height: 36px !important;
    }

    .admin-reports-player-info {
      flex: 1 !important;
      min-width: 0 !important;
    }

    .admin-reports-player-username {
      font-size: 0.9rem !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 120px !important;
    }

    .admin-reports-player-scores {
      width: 100% !important;
      flex-direction: row !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding-top: 0.25rem !important;
      border-top: 1px solid rgba(255,255,255,0.1) !important;
    }

    .admin-reports-score-details {
      font-size: 0.75rem !important;
    }
  }

  @media (max-width: 480px) {
    .admin-reports-title {
      font-size: 1.3rem !important;
    }

    .admin-reports-player-username {
      max-width: 90px !important;
    }
  }
`;

export default AdminReports;