// src/components/Users/QuizResultsTable.tsx
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
  const safeSharedQuizResults = Array.isArray(sharedQuizResults)
    ? sharedQuizResults
    : [];

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
      <div className="quiz-results-container">
        {/* Page Visits */}
        <div className="quiz-results-card-wrapper">
          <div className="quiz-results-card card-blue">
            <div className="quiz-results-card-header">
              <div className="quiz-results-header-left">
                <div className="quiz-results-icon-circle blue">
                  <i className="bi bi-activity quiz-results-icon"></i>
                </div>
                <div>
                  <h5 className="quiz-results-card-title">Recent Game Visits</h5>
                  <p className="quiz-results-card-subtitle">User activity tracking</p>
                </div>
              </div>
              <div className="quiz-results-badge">
                {safePageVisits.length}
              </div>
            </div>
            <div className="quiz-results-card-body">
              {safePageVisits.length === 0 ? (
                <div className="quiz-results-empty-state">
                  <i className="bi bi-graph-up quiz-results-empty-icon"></i>
                  <h6 className="quiz-results-empty-title">No page visits logged</h6>
                  <p className="quiz-results-empty-text">User activity will appear here</p>
                </div>
              ) : (
                <div className="quiz-results-items-container">
                  {safePageVisits.slice(0, 5).map((visit, index) => (
                    <div 
                      key={visit.id} 
                      className={`quiz-results-item ${index !== safePageVisits.slice(0, 5).length - 1 ? 'with-border' : ''}`}
                    >
                      <div className="quiz-results-item-left">
                        <div className="quiz-results-item-avatar">
                          <i className="bi bi-person-circle quiz-results-avatar-icon"></i>
                        </div>
                        <div className="quiz-results-item-info">
                          <div className="quiz-results-item-name">
                            {visit.user?.username ?? "Unknown"}
                          </div>
                          <div className="quiz-results-item-page">
                            {visit.page}
                          </div>
                        </div>
                      </div>
                      <div className="quiz-results-item-right">
                        <div className="quiz-results-item-badge blue">
                          {visit.visit_count} visits
                        </div>
                        <div className="quiz-results-item-time">
                          {formatTime(visit.total_time_spent)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Results */}
        <div className="quiz-results-card-wrapper">
          <div className="quiz-results-card card-green">
            <div className="quiz-results-card-header">
              <div className="quiz-results-header-left">
                <div className="quiz-results-icon-circle green">
                  <i className="bi bi-clipboard-check quiz-results-icon"></i>
                </div>
                <div>
                  <h5 className="quiz-results-card-title">Quick Quiz Results</h5>
                  <p className="quiz-results-card-subtitle">Student performance overview</p>
                </div>
              </div>
              <div className="quiz-results-badge">
                {safeQuizResults.length}
              </div>
            </div>
            <div className="quiz-results-card-body">
              {safeQuizResults.length === 0 ? (
                <div className="quiz-results-empty-state">
                  <i className="bi bi-clipboard-data quiz-results-empty-icon"></i>
                  <h6 className="quiz-results-empty-title">No quiz results yet</h6>
                  <p className="quiz-results-empty-text">Quiz submissions will appear here</p>
                </div>
              ) : (
                <div className="quiz-results-items-container">
                  {safeQuizResults.slice(0, 5).map((result, index) => (
                    <div 
                      key={result.submission_id} 
                      className={`quiz-results-item ${index !== safeQuizResults.slice(0, 5).length - 1 ? 'with-border' : ''}`}
                    >
                      <div className="quiz-results-item-left">
                        <div className="quiz-results-item-avatar">
                          <i className="bi bi-person-fill quiz-results-avatar-icon"></i>
                        </div>
                        <div className="quiz-results-item-info">
                          <div className="quiz-results-item-name">
                            {result.student_name}
                          </div>
                          <div className="quiz-results-item-page">
                            {result.quiz_title.length > 25
                              ? `${result.quiz_title.substring(0, 25)}...`
                              : result.quiz_title}
                          </div>
                        </div>
                      </div>
                      <div className="quiz-results-item-right">
                        <div className={`quiz-results-item-badge ${getScoreBadgeClass(result.score, result.total)}`}>
                          {result.score}/{result.total}
                        </div>
                        <div className="quiz-results-item-time">
                          {new Date(result.submitted_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shared Quiz Results */}
        <div className="quiz-results-card-wrapper">
          <div className="quiz-results-card card-purple">
            <div className="quiz-results-card-header">
              <div className="quiz-results-header-left">
                <div className="quiz-results-icon-circle purple">
                  <i className="bi bi-share quiz-results-icon"></i>
                </div>
                <div>
                  <h5 className="quiz-results-card-title">Shared Quiz Results</h5>
                  <p className="quiz-results-card-subtitle">Collaborative assessments</p>
                </div>
              </div>
              <div className="quiz-results-badge">
                {safeSharedQuizResults.length}
              </div>
            </div>
            <div className="quiz-results-card-body">
              {safeSharedQuizResults.length === 0 ? (
                <div className="quiz-results-empty-state">
                  <i className="bi bi-share-fill quiz-results-empty-icon"></i>
                  <h6 className="quiz-results-empty-title">No shared quiz results yet</h6>
                  <p className="quiz-results-empty-text">Shared quiz submissions will appear here</p>
                </div>
              ) : (
                <div className="quiz-results-items-container">
                  {safeSharedQuizResults.slice(0, 5).map((result, index) => (
                    <div 
                      key={result.participant_id} 
                      className={`quiz-results-item ${index !== safeSharedQuizResults.slice(0, 5).length - 1 ? 'with-border' : ''}`}
                    >
                      <div className="quiz-results-item-left">
                        <div className="quiz-results-item-avatar">
                          <i className="bi bi-people-fill quiz-results-avatar-icon"></i>
                        </div>
                        <div className="quiz-results-item-info">
                          <div className="quiz-results-item-name">
                            {result.student_name}
                          </div>
                          <div className="quiz-results-item-page">
                            {result.quiz_title.length > 25
                              ? `${result.quiz_title.substring(0, 25)}...`
                              : result.quiz_title}
                          </div>
                        </div>
                      </div>
                      <div className="quiz-results-item-right">
                        <div className={`quiz-results-item-badge ${getScoreBadgeClass(result.score, result.total)}`}>
                          {result.score}/{result.total}
                        </div>
                        <div className="quiz-results-item-time">
                          {result.finished_at
                            ? new Date(result.finished_at).toLocaleDateString()
                            : "In Progress"}
                        </div>
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
        .quiz-results-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .quiz-results-card-wrapper {
          display: flex;
        }

        .quiz-results-card {
          flex: 1;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          background: white;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .quiz-results-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .quiz-results-card.card-blue {
          border-color: rgba(59, 130, 246, 0.3);
        }

        .quiz-results-card.card-green {
          border-color: rgba(16, 185, 129, 0.3);
        }

        .quiz-results-card.card-purple {
          border-color: rgba(168, 85, 247, 0.3);
        }

        .quiz-results-card-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%);
          border-bottom: 2px solid rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quiz-results-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .quiz-results-icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quiz-results-icon-circle.blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .quiz-results-icon-circle.green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .quiz-results-icon-circle.purple {
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
        }

        .quiz-results-icon {
          font-size: 1.5rem;
          color: white;
        }

        .quiz-results-card-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
        }

        .quiz-results-card-subtitle {
          margin: 0.25rem 0 0 0;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .quiz-results-badge {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          color: #374151;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .quiz-results-card-body {
          padding: 1.5rem;
        }

        .quiz-results-empty-state {
          text-align: center;
          padding: 2rem 1rem;
        }

        .quiz-results-empty-icon {
          font-size: 3rem;
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        .quiz-results-empty-title {
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .quiz-results-empty-text {
          font-size: 0.875rem;
          color: #9ca3af;
          margin: 0;
        }

        .quiz-results-items-container {
          display: flex;
          flex-direction: column;
        }

        .quiz-results-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .quiz-results-item.with-border {
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .quiz-results-item-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 0;
        }

        .quiz-results-item-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quiz-results-avatar-icon {
          font-size: 1.5rem;
          color: #6b7280;
        }

        .quiz-results-item-info {
          flex: 1;
          min-width: 0;
        }

        .quiz-results-item-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .quiz-results-item-page {
          font-size: 0.85rem;
          color: #6b7280;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .quiz-results-item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
          flex-shrink: 0;
          margin-left: 1rem;
        }

        .quiz-results-item-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          white-space: nowrap;
        }

        .quiz-results-item-badge.blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .quiz-results-item-badge.green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .quiz-results-item-badge.yellow {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .quiz-results-item-badge.red {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .quiz-results-item-time {
          font-size: 0.75rem;
          color: #9ca3af;
          white-space: nowrap;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .quiz-results-container {
            grid-template-columns: 1fr;
          }

          .quiz-results-card-header {
            padding: 1rem;
          }

          .quiz-results-card-body {
            padding: 1rem;
          }

          .quiz-results-icon-circle {
            width: 40px;
            height: 40px;
          }

          .quiz-results-icon {
            font-size: 1.2rem;
          }

          .quiz-results-card-title {
            font-size: 1rem;
          }

          .quiz-results-card-subtitle {
            font-size: 0.75rem;
          }

          .quiz-results-item {
            padding: 0.75rem 0;
          }

          .quiz-results-item-name {
            font-size: 0.875rem;
          }

          .quiz-results-item-page {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default QuizResultsTable;