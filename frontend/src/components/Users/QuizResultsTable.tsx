import React from "react";

interface PageVisit {
  id: number;
  user_id: number;
  page: string;
  visit_count: number;
  total_time_spent: number;
  updated_at: string;
  user?: {
    username?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
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

interface QuizResultsTableProps {
  pageVisits: PageVisit[] | null | undefined;
  quizResults: QuizResult[] | null | undefined;
  sharedQuizResults: SharedQuizResult[] | null | undefined;
}

const QuizResultsTable: React.FC<QuizResultsTableProps> = ({
  pageVisits,
  quizResults,
  sharedQuizResults,
}) => {
  const safePageVisits = Array.isArray(pageVisits) ? pageVisits : [];
  const safeQuizResults = Array.isArray(quizResults) ? quizResults : [];
  const safeSharedQuizResults = Array.isArray(sharedQuizResults) ? sharedQuizResults : [];

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getScoreBadgeClass = (score: number, total: number): string => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "green";
    if (percentage >= 80) return "yellow";
    return "red";
  };

  return (
    <>
      <div className="qrt-scroll-wrapper">
        <div className="qrt-container">

          {/* ── Recent Game Visits ── */}
          <div className="qrt-card qrt-card-blue">
            <div className="qrt-header">
              <div className="qrt-header-left">
                <div className="qrt-icon-circle qrt-blue">
                  <i className="bi bi-activity qrt-icon"></i>
                </div>
                <div className="qrt-header-text">
                  <h5 className="qrt-title">Recent Game Visits</h5>
                  <p className="qrt-subtitle">User activity tracking</p>
                </div>
              </div>
              <span className="qrt-count-badge">{safePageVisits.length}</span>
            </div>

            <div className="qrt-body">
              {safePageVisits.length === 0 ? (
                <div className="qrt-empty">
                  <i className="bi bi-graph-up qrt-empty-icon"></i>
                  <h6 className="qrt-empty-title">No page visits logged</h6>
                  <p className="qrt-empty-text">User activity will appear here</p>
                </div>
              ) : (
                <div className="qrt-list">
                  {safePageVisits.slice(0, 5).map((visit, index) => (
                    <div key={visit.id} className={`qrt-item ${index < safePageVisits.slice(0, 5).length - 1 ? "qrt-item-border" : ""}`}>
                      {/* ✅ Two-column layout: avatar+info on left, badge+time on right */}
                      <div className="qrt-col-left">
                        <div className="qrt-avatar">
                          <i className="bi bi-person-circle qrt-avatar-icon"></i>
                        </div>
                        <div className="qrt-item-info">
                          {/* ✅ Name wraps instead of truncating */}
                          <div className="qrt-item-name">
                            {[visit.user?.first_name, visit.user?.middle_name, visit.user?.last_name]
                              .filter(Boolean).join(" ") || visit.user?.username || "Unknown"}
                          </div>
                          <div className="qrt-item-sub">{visit.page}</div>
                        </div>
                      </div>
                      <div className="qrt-col-right">
                        <span className="qrt-badge qrt-badge-blue">{visit.visit_count} visits</span>
                        <span className="qrt-time">{formatTime(visit.total_time_spent)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Quick Quiz Results ── */}
          <div className="qrt-card qrt-card-green">
            <div className="qrt-header">
              <div className="qrt-header-left">
                <div className="qrt-icon-circle qrt-green">
                  <i className="bi bi-clipboard-check qrt-icon"></i>
                </div>
                <div className="qrt-header-text">
                  <h5 className="qrt-title">Quick Quiz Results</h5>
                  <p className="qrt-subtitle">Student performance overview</p>
                </div>
              </div>
              <span className="qrt-count-badge">{safeQuizResults.length}</span>
            </div>

            <div className="qrt-body">
              {safeQuizResults.length === 0 ? (
                <div className="qrt-empty">
                  <i className="bi bi-clipboard-data qrt-empty-icon"></i>
                  <h6 className="qrt-empty-title">No quiz results yet</h6>
                  <p className="qrt-empty-text">Quiz submissions will appear here</p>
                </div>
              ) : (
                <div className="qrt-list">
                  {safeQuizResults.slice(0, 5).map((result, index) => (
                    <div key={result.submission_id} className={`qrt-item ${index < safeQuizResults.slice(0, 5).length - 1 ? "qrt-item-border" : ""}`}>
                      <div className="qrt-col-left">
                        <div className="qrt-avatar">
                          <i className="bi bi-person-fill qrt-avatar-icon"></i>
                        </div>
                        <div className="qrt-item-info">
                          <div className="qrt-item-name">{result.student_name}</div>
                          <div className="qrt-item-sub">{result.quiz_title}</div>
                        </div>
                      </div>
                      <div className="qrt-col-right">
                        <span className={`qrt-badge qrt-badge-${getScoreBadgeClass(result.score, result.total)}`}>
                          {result.score}/{result.total}
                        </span>
                        <span className="qrt-time">{new Date(result.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Shared Quiz Results ── */}
          <div className="qrt-card qrt-card-purple">
            <div className="qrt-header">
              <div className="qrt-header-left">
                <div className="qrt-icon-circle qrt-purple">
                  <i className="bi bi-share qrt-icon"></i>
                </div>
                <div className="qrt-header-text">
                  <h5 className="qrt-title">Shared Quiz Results</h5>
                  <p className="qrt-subtitle">Collaborative assessments</p>
                </div>
              </div>
              <span className="qrt-count-badge">{safeSharedQuizResults.length}</span>
            </div>

            <div className="qrt-body">
              {safeSharedQuizResults.length === 0 ? (
                <div className="qrt-empty">
                  <i className="bi bi-share-fill qrt-empty-icon"></i>
                  <h6 className="qrt-empty-title">No shared quiz results yet</h6>
                  <p className="qrt-empty-text">Shared quiz submissions will appear here</p>
                </div>
              ) : (
                <div className="qrt-list">
                  {safeSharedQuizResults.slice(0, 5).map((result, index) => (
                    <div key={result.participant_id} className={`qrt-item ${index < safeSharedQuizResults.slice(0, 5).length - 1 ? "qrt-item-border" : ""}`}>
                      <div className="qrt-col-left">
                        <div className="qrt-avatar">
                          <i className="bi bi-people-fill qrt-avatar-icon"></i>
                        </div>
                        <div className="qrt-item-info">
                          <div className="qrt-item-name">{result.student_name}</div>
                          <div className="qrt-item-sub">{result.quiz_title}</div>
                        </div>
                      </div>
                      <div className="qrt-col-right">
                        <span className={`qrt-badge qrt-badge-${getScoreBadgeClass(result.score, result.total)}`}>
                          {result.score}/{result.total}
                        </span>
                        <span className="qrt-time">
                          {result.finished_at
                            ? new Date(result.finished_at).toLocaleDateString()
                            : "In Progress"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .qrt-scroll-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .qrt-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          min-width: 0;
        }

        .qrt-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          overflow: hidden;
          border: 2px solid transparent;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          min-width: 0;
        }

        .qrt-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.18);
        }

        .qrt-card-blue   { border-color: rgba(59,130,246,0.3); }
        .qrt-card-green  { border-color: rgba(16,185,129,0.3); }
        .qrt-card-purple { border-color: rgba(168,85,247,0.3); }

        .qrt-header {
          padding: 1rem 1.1rem;
          background: linear-gradient(135deg,rgba(255,255,255,.9) 0%,rgba(249,250,251,.9) 100%);
          border-bottom: 2px solid rgba(0,0,0,.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .qrt-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 0;
        }

        .qrt-header-text { flex: 1; min-width: 0; }

        .qrt-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .qrt-blue   { background: linear-gradient(135deg,#3b82f6,#2563eb); }
        .qrt-green  { background: linear-gradient(135deg,#10b981,#059669); }
        .qrt-purple { background: linear-gradient(135deg,#a855f7,#9333ea); }

        .qrt-icon { font-size: 1.3rem; color: white; }

        .qrt-title {
          margin: 0;
          font-size: clamp(0.82rem, 2vw, 1.05rem);
          font-weight: 700;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .qrt-subtitle {
          margin: 0.2rem 0 0;
          font-size: clamp(0.7rem, 1.6vw, 0.82rem);
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .qrt-count-badge {
          background: linear-gradient(135deg,#f3f4f6,#e5e7eb);
          color: #374151;
          padding: 0.3rem 0.7rem;
          border-radius: 50px;
          font-size: clamp(0.75rem, 1.8vw, 0.9rem);
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(0,0,0,.08);
          flex-shrink: 0;
        }

        .qrt-body { padding: 1rem 1.1rem; }

        .qrt-empty { text-align: center; padding: 1.5rem 0.5rem; }
        .qrt-empty-icon { font-size: 2.5rem; color: #d1d5db; display: block; margin-bottom: 0.75rem; }
        .qrt-empty-title { font-size: 0.95rem; font-weight: 600; color: #6b7280; margin-bottom: 0.35rem; }
        .qrt-empty-text  { font-size: 0.8rem; color: #9ca3af; margin: 0; }

        .qrt-list { display: flex; flex-direction: column; }

        /* ✅ Each row is now a proper two-column layout */
        .qrt-item {
          display: grid;
          grid-template-columns: 1fr auto; /* left grows, right is fixed width */
          align-items: start;              /* align to top so wrapped names don't look off */
          gap: 0.75rem;
          padding: 0.75rem 0;
        }

        .qrt-item-border { border-bottom: 1px solid rgba(0,0,0,.05); }

        /* ✅ Left column: avatar + text stacked side by side */
        .qrt-col-left {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          min-width: 0;
        }

        .qrt-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg,#e5e7eb,#d1d5db);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px; /* optically align with first line of name */
        }

        .qrt-avatar-icon { font-size: 1.3rem; color: #6b7280; }

        .qrt-item-info { flex: 1; min-width: 0; }

        /* ✅ Name wraps across multiple lines — no more truncation */
        .qrt-item-name {
          font-size: clamp(0.78rem, 2vw, 0.92rem);
          font-weight: 600;
          color: #1f2937;
          white-space: normal;      /* ← allow wrapping */
          word-break: break-word;   /* ← break very long single words */
          line-height: 1.35;
        }

        /* ✅ Subtitle (page / quiz title) also wraps */
        .qrt-item-sub {
          font-size: clamp(0.7rem, 1.7vw, 0.82rem);
          color: #6b7280;
          white-space: normal;
          word-break: break-word;
          line-height: 1.3;
          margin-top: 0.15rem;
        }

        /* ✅ Right column: badge + time, pinned to top-right */
        .qrt-col-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.2rem;
          flex-shrink: 0;
          padding-top: 2px;
        }

        .qrt-badge {
          padding: 0.25rem 0.6rem;
          border-radius: 50px;
          font-size: clamp(0.68rem, 1.7vw, 0.82rem);
          font-weight: 700;
          color: white;
          white-space: nowrap;
        }

        .qrt-badge-blue   { background: linear-gradient(135deg,#3b82f6,#2563eb); }
        .qrt-badge-green  { background: linear-gradient(135deg,#10b981,#059669); }
        .qrt-badge-yellow { background: linear-gradient(135deg,#f59e0b,#d97706); }
        .qrt-badge-red    { background: linear-gradient(135deg,#ef4444,#dc2626); }

        .qrt-time {
          font-size: clamp(0.65rem, 1.5vw, 0.75rem);
          color: #9ca3af;
          white-space: nowrap;
        }

        /* Tablet: 2 columns */
        @media (max-width: 992px) {
          .qrt-container { grid-template-columns: repeat(2, 1fr); }
        }

        /* Mobile: 1 column */
        @media (max-width: 640px) {
          .qrt-scroll-wrapper { overflow-x: visible; }
          .qrt-container { grid-template-columns: 1fr; gap: 1rem; }
          .qrt-header { padding: 0.85rem 1rem; }
          .qrt-body   { padding: 0.85rem 1rem; }
          .qrt-icon-circle { width: 38px; height: 38px; }
          .qrt-icon { font-size: 1.1rem; }
          .qrt-item { padding: 0.65rem 0; }
          .qrt-avatar { width: 32px; height: 32px; }
          .qrt-avatar-icon { font-size: 1.1rem; }
        }

        @media (max-width: 360px) {
          .qrt-header { flex-wrap: wrap; gap: 0.4rem; }
          .qrt-count-badge { margin-left: auto; }
        }
      `}</style>
    </>
  );
};

export default QuizResultsTable;