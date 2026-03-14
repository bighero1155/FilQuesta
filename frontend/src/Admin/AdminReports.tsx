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

interface User {
  user_id: number;
  username: string;
  role: string;
}

const AdminReports: React.FC = () => {
  const [pageVisits, setPageVisits] = useState<PageVisit[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [sharedQuizResults, setSharedQuizResults] = useState<SharedQuizResult[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [pageVisitsRes, quizResultsRes, sharedQuizResultsRes, leaderboardRes, usersRes] = await Promise.all([
        axios.get("/page-visits"),
        axios.get("/quiz-results"),
        axios.get("/shared-quiz-results"),
        axios.get("/leaderboard"),
        axios.get("/users"),
      ]);

      // ✅ Handle both response formats
      setPageVisits(Array.isArray(pageVisitsRes.data) ? pageVisitsRes.data : pageVisitsRes.data.data || []);
      setQuizResults(Array.isArray(quizResultsRes.data) ? quizResultsRes.data : quizResultsRes.data.data || []);
      setSharedQuizResults(Array.isArray(sharedQuizResultsRes.data) ? sharedQuizResultsRes.data : sharedQuizResultsRes.data.data || []);
      
      // Normalize avatar URLs using centralized getImageUrl
      const leaderboardData = Array.isArray(leaderboardRes.data) ? leaderboardRes.data : leaderboardRes.data.data || [];
      const normalizedLeaderboard = leaderboardData.map((player: LeaderboardUser) => ({
        ...player,
        avatar: player.avatar ? getImageUrl(player.avatar) : undefined
      }));
      setLeaderboard(normalizedLeaderboard);

      // Derive student and teacher counts from existing /users endpoint
      const usersData: User[] = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.data || [];
      setTotalStudents(usersData.filter((u) => u.role === "student").length);
      setTotalTeachers(usersData.filter((u) => u.role === "teacher").length);

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

  if (loading) {
    return (
      <div style={styles.reportsPage}>
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

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="text-center py-5">
            <div className="spinner-border text-white" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white mt-3 fs-5">Loading reports...</p>
          </div>
        </div>

        <style>{adminReportsStyleString}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.reportsPage}>
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
      </div>
    );
  }

  return (
    <div style={styles.reportsPage}>
      {/* Animated background elements */}
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

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="text-center mb-5" style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>
            📊 Reports & Analytics
          </h1>
          <p style={styles.pageSubtitle}>
            Track student activity, quiz performance, and engagement metrics
          </p>
        </div>

        {/* Stats Cards - Row 1 */}
        <div className="row mb-4">
          <div className="col-md-4 mb-4">
            <div className="stat-card" style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.statIconBlue}}>👥</div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{stats.totalVisits}</h3>
                <p style={styles.statLabel}>Total Page Visits</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="stat-card" style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.statIconGreen}}>📝</div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{stats.totalQuizzes}</h3>
                <p style={styles.statLabel}>Quiz Submissions</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="stat-card" style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.statIconPurple}}>🎯</div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{stats.avgScore}%</h3>
                <p style={styles.statLabel}>Average Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Row 2 (User Counts) */}
        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <div className="stat-card" style={styles.statCard}>
              <div style={{
                ...styles.statIcon,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              }}>
                🎓
              </div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{totalStudents}</h3>
                <p style={styles.statLabel}>Total Students</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="stat-card" style={styles.statCard}>
              <div style={{
                ...styles.statIcon,
                background: 'linear-gradient(135deg, #4facfe 0%, #00c6ff 100%)',
              }}>
                👩‍🏫
              </div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{totalTeachers}</h3>
                <p style={styles.statLabel}>Total Teachers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Tables */}
        <div className="mb-5" style={styles.dataSection}>
          <QuizResultsTable
            pageVisits={pageVisits}
            quizResults={quizResults}
            sharedQuizResults={sharedQuizResults}
          />
        </div>

        {/* Leaderboard Section */}
        <div style={styles.leaderboardSection}>
          <h2 className="text-center mb-4" style={styles.sectionTitle}>🏆 Top Players Leaderboard</h2>
          <div style={styles.leaderboardContainer}>
            {leaderboard.slice(0, 10).map((player, index) => (
              <div 
                key={player.user_id} 
                className={`leaderboard-row ${index < 3 ? 'top-three' : ''}`}
                style={index < 3 ? {...styles.leaderboardRow, ...styles.leaderboardRowTopThree} : styles.leaderboardRow}
              >
                <div style={index < 3 ? {...styles.rankBadge, ...styles.rankBadgeTopThree} : styles.rankBadge}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div style={styles.playerInfoSection}>
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
                    <div style={styles.playerUsername}>{player.username}</div>
                    <div style={styles.playerRankText}>{player.rank}</div>
                  </div>
                </div>
                <div style={styles.playerScores}>
                  <div style={index < 3 ? {...styles.combinedScore, ...styles.combinedScoreTopThree} : styles.combinedScore}>
                    {player.combined_score || player.total_score}
                  </div>
                  <div style={styles.scoreDetails}>
                    Game: {player.total_score} | Quiz: {player.shared_quiz_score || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{adminReportsStyleString}</style>
    </div>
  );
};

export default AdminReports;