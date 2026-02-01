// src/modals/GameProgressModal.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AxiosInstance from "../auth/axiosInstance";

interface LevelProgress {
  id: number;
  user_id: number;
  game_name: string;
  unlocked_levels: number;
  updated_at: string;
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

interface GameProgressModalProps {
  show: boolean;
  onClose: () => void;
}

const normalizeArray = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (payload.data && Array.isArray(payload.data)) return payload.data;
  if (payload.results && Array.isArray(payload.results)) return payload.results;
  return [];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
};

const GameProgressModal: React.FC<GameProgressModalProps> = ({
  show,
  onClose,
}) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LevelProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"quests" | "quizzes">("quests");

  useEffect(() => {
    if (!show || !user) return;

    let mounted = true;
    const rawId =
      (user as any)?.user_id ?? (user as any)?.id ?? (user as any)?.userId;
    const userId = Number(rawId || 0);
    if (!userId) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [progressRes, resultsRes] = await Promise.allSettled([
          AxiosInstance.get(`/users/${userId}/levels`),
          AxiosInstance.get(`/quiz-results`),
        ]);

        if (progressRes.status === "fulfilled") {
          const p = normalizeArray(progressRes.value.data ?? progressRes.value);
          if (mounted) setProgress(p);
        }

        if (resultsRes.status === "fulfilled") {
          const raw = normalizeArray(resultsRes.value.data ?? resultsRes.value);
          if (mounted) setQuizResults(raw as QuizResult[]);
        }
      } catch (e) {
        console.error("fetchAll error:", e);
        if (mounted) setError("Failed to fetch progress or quiz results.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [show, user]);

  if (!show) return null;

  const getScorePercent = (score: number, total: number) =>
    total > 0 ? Math.round((score / total) * 100) : 0;

  const getScoreColor = (percent: number) => {
    if (percent >= 80) return "#00e676";
    if (percent >= 50) return "#ffb74d";
    return "#ef5350";
  };

  return (
    <div className="gpm-overlay" onClick={onClose}>
      <div className="gpm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gpm-header">
          <h2 className="gpm-title">📊 Progress</h2>
          <button className="gpm-close" onClick={onClose}>✖</button>
        </div>

        {/* Tabs */}
        <div className="gpm-tabs">
          <button
            className={`gpm-tab ${activeTab === "quests" ? "active" : ""}`}
            onClick={() => setActiveTab("quests")}
          >
            🎮 Quests ({progress.length})
          </button>
          <button
            className={`gpm-tab ${activeTab === "quizzes" ? "active" : ""}`}
            onClick={() => setActiveTab("quizzes")}
          >
            ⚡ Quizzes ({quizResults.length})
          </button>
        </div>

        {/* Body */}
        <div className="gpm-body">
          {loading ? (
            <div className="gpm-loading">
              <div className="gpm-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="gpm-error">{error}</div>
          ) : activeTab === "quests" ? (
            progress.length > 0 ? (
              <>
                {/* Desktop Table */}
                <table className="gpm-table">
                  <thead>
                    <tr>
                      <th>Game</th>
                      <th>Levels</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progress.map((p) => (
                      <tr key={p.id}>
                        <td>{p.game_name}</td>
                        <td>
                          <span className="gpm-badge gpm-badge-blue">
                            {p.unlocked_levels} Unlocked
                          </span>
                        </td>
                        <td className="gpm-date">{formatDate(p.updated_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Cards */}
                <div className="gpm-cards">
                  {progress.map((p) => (
                    <div key={p.id} className="gpm-card">
                      <div className="gpm-card-header">
                        <span className="gpm-card-title">🎮 {p.game_name}</span>
                        <span className="gpm-badge gpm-badge-blue">
                          {p.unlocked_levels} Levels
                        </span>
                      </div>
                      <div className="gpm-card-date">{formatDate(p.updated_at)}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="gpm-empty">
                <div className="gpm-empty-icon">🎮</div>
                <p>No quest progress yet.</p>
                <span>Start playing to unlock levels!</span>
              </div>
            )
          ) : quizResults.length > 0 ? (
            <>
              {/* Desktop Table */}
              <table className="gpm-table">
                <thead>
                  <tr>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((r) => {
                    const percent = getScorePercent(r.score, r.total);
                    return (
                      <tr key={r.submission_id}>
                        <td>{r.quiz_title}</td>
                        <td>
                          <div className="gpm-score-row">
                            <span className="gpm-score-text" style={{ color: getScoreColor(percent) }}>
                              {r.score}/{r.total}
                            </span>
                            <div className="gpm-progress-bar-bg">
                              <div
                                className="gpm-progress-bar-fill"
                                style={{
                                  width: `${percent}%`,
                                  background: getScoreColor(percent),
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="gpm-date">
                          {r.submitted_at ? formatDate(r.submitted_at) : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="gpm-cards">
                {quizResults.map((r) => {
                  const percent = getScorePercent(r.score, r.total);
                  return (
                    <div key={r.submission_id} className="gpm-card">
                      <div className="gpm-card-header">
                        <span className="gpm-card-title">⚡ {r.quiz_title}</span>
                        <span
                          className="gpm-badge"
                          style={{
                            background: `${getScoreColor(percent)}22`,
                            color: getScoreColor(percent),
                            border: `1px solid ${getScoreColor(percent)}44`,
                          }}
                        >
                          {r.score}/{r.total}
                        </span>
                      </div>
                      <div className="gpm-progress-bar-bg" style={{ marginTop: 8 }}>
                        <div
                          className="gpm-progress-bar-fill"
                          style={{
                            width: `${percent}%`,
                            background: getScoreColor(percent),
                          }}
                        />
                      </div>
                      <div className="gpm-card-date">
                        {r.submitted_at ? formatDate(r.submitted_at) : "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="gpm-empty">
              <div className="gpm-empty-icon">⚡</div>
              <p>No quiz results yet.</p>
              <span>Complete a quiz to see your results here!</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* ====== OVERLAY ====== */
        .gpm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          padding: 16px;
        }

        /* ====== MODAL ====== */
        .gpm-modal {
          background: linear-gradient(145deg, rgba(20, 30, 60, 0.95), rgba(15, 20, 45, 0.97));
          border: 1px solid rgba(0, 234, 255, 0.2);
          border-radius: 20px;
          width: 100%;
          max-width: 640px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 234, 255, 0.08);
          overflow: hidden;
          font-family: "Press Start 2P", monospace;
          color: #fff;
        }

        /* ====== HEADER ====== */
        .gpm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 24px 16px;
        }
        .gpm-title {
          margin: 0;
          font-size: 16px;
          color: #00eaff;
          text-shadow: 0 0 10px rgba(0, 234, 255, 0.4);
        }
        .gpm-close {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .gpm-close:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* ====== TABS ====== */
        .gpm-tabs {
          display: flex;
          gap: 8px;
          padding: 0 24px 16px;
        }
        .gpm-tab {
          flex: 1;
          padding: 10px 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.5);
          font-family: "Press Start 2P", monospace;
          font-size: 9px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .gpm-tab:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }
        .gpm-tab.active {
          background: rgba(0, 234, 255, 0.15);
          border-color: rgba(0, 234, 255, 0.4);
          color: #00eaff;
          box-shadow: 0 0 12px rgba(0, 234, 255, 0.15);
        }

        /* ====== BODY (scrollable) ====== */
        .gpm-body {
          flex: 1;
          overflow-y: auto;
          padding: 0 24px 24px;
        }
        .gpm-body::-webkit-scrollbar {
          width: 6px;
        }
        .gpm-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .gpm-body::-webkit-scrollbar-thumb {
          background: rgba(0, 234, 255, 0.3);
          border-radius: 3px;
        }

        /* ====== LOADING ====== */
        .gpm-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          gap: 14px;
        }
        .gpm-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #00eaff;
          border-radius: 50%;
          animation: gpm-spin 0.6s linear infinite;
        }
        @keyframes gpm-spin {
          to { transform: rotate(360deg); }
        }

        /* ====== ERROR ====== */
        .gpm-error {
          background: rgba(239, 83, 80, 0.15);
          border: 1px solid rgba(239, 83, 80, 0.3);
          border-radius: 10px;
          padding: 14px;
          color: #ef5350;
          font-size: 10px;
          text-align: center;
        }

        /* ====== EMPTY STATE ====== */
        .gpm-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 0;
          text-align: center;
          gap: 10px;
        }
        .gpm-empty-icon {
          font-size: 40px;
          opacity: 0.6;
        }
        .gpm-empty p {
          margin: 0;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
        }
        .gpm-empty span {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.35);
        }

        /* ====== DESKTOP TABLE ====== */
        .gpm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        .gpm-table th {
          text-align: left;
          padding: 10px 12px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-weight: normal;
        }
        .gpm-table td {
          padding: 14px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.85);
        }
        .gpm-table tr:last-child td {
          border-bottom: none;
        }
        .gpm-table tr:hover td {
          background: rgba(255, 255, 255, 0.03);
        }
        .gpm-date {
          color: rgba(255, 255, 255, 0.35) !important;
          font-size: 9px !important;
        }

        /* ====== BADGE ====== */
        .gpm-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 9px;
        }
        .gpm-badge-blue {
          background: rgba(0, 234, 255, 0.15);
          color: #00eaff;
          border: 1px solid rgba(0, 234, 255, 0.3);
        }

        /* ====== SCORE + PROGRESS BAR ====== */
        .gpm-score-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gpm-score-text {
          font-size: 11px;
          font-weight: bold;
          min-width: 40px;
        }
        .gpm-progress-bar-bg {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          min-width: 60px;
        }
        .gpm-progress-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease;
        }

        /* ====== MOBILE CARDS (hidden on desktop) ====== */
        .gpm-cards {
          display: none;
          flex-direction: column;
          gap: 10px;
        }
        .gpm-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .gpm-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }
        .gpm-card-title {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.9);
        }
        .gpm-card-date {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 2px;
        }

        /* ====== RESPONSIVE ====== */
        @media (max-width: 520px) {
          .gpm-modal {
            max-height: 90vh;
            border-radius: 16px;
          }
          .gpm-header {
            padding: 18px 18px 12px;
          }
          .gpm-tabs {
            padding: 0 18px 14px;
          }
          .gpm-body {
            padding: 0 18px 20px;
          }

          /* Hide table, show cards */
          .gpm-table {
            display: none;
          }
          .gpm-cards {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

export default GameProgressModal;