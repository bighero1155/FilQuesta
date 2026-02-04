import React, { useEffect, useState, useCallback } from "react";
import { getSharedSessions, deleteSharedSession, SharedQuizSession } from "../services/quizService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import SharedQuizBrowserModalCSS from "../styles/SharedQuizBrowserModalCSS";

interface Props {
  show: boolean;
  onClose: () => void;
}

const SharedQuizBrowserModal: React.FC<Props> = ({ show, onClose }) => {
  const [sessions, setSessions] = useState<SharedQuizSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null); 
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSharedSessions();
      
      // Filter sessions: students see all, teachers see only their own
      let filteredData = Array.isArray(data) ? data : [];
      
      if (user?.role === 'teacher') {
        filteredData = filteredData.filter(s => s.teacher_id === user.user_id);
      }
      
      setSessions(filteredData);
    } catch (err) {
      console.error(err);
      setError("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }, [user?.role, user?.user_id]); // Dependencies for useCallback

  useEffect(() => {
    if (show) {
      fetchSessions();
    }
  }, [show, fetchSessions]); // Now we can safely include fetchSessions

  if (!show) return null;

  const handleJoinQuiz = (code: string) => {
    navigate(`/sharedquiz/${code}/lobby`);
    onClose();
  };

  const handleDeleteQuiz = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this quiz session?")) {
      return;
    }

    setDeletingId(sessionId);
    try {
      await deleteSharedSession(sessionId);
      await fetchSessions(); // Refresh the list
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete quiz session");
    } finally {
      setDeletingId(null);
    }
  };

  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  return (
    <>
      <SharedQuizBrowserModalCSS /> 

      <div className="qm-overlay" onClick={onClose}>
        <div className="qm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="qm-header">
            <h2 className="qm-title">AVAILABLE QUIZZES</h2>
            <button className="qm-close" onClick={onClose}>×</button>
          </div>

          <div className="qm-body">
            {loading ? (
              <div className="qm-loading">
                <div className="qm-spinner"></div>
                <div className="qm-loading-text">Loading...</div>
              </div>
            ) : error ? (
              <div className="qm-error">{error}</div>
            ) : sessions.length === 0 ? (
              <div className="qm-empty">
                <div className="qm-empty-icon">📚</div>
                <div className="qm-empty-text">
                  {isTeacher ? "No Active Quizzes Created by You" : "No Active Quizzes"}
                </div>
              </div>
            ) : (
              <div className="qm-list">
                {sessions.map((s) => {
                  const isOwner = (isTeacher || isAdmin) && s.teacher_id === user?.user_id;
                  
                  return (
                    <div key={s.session_id} className="qm-card">
                      <div className="qm-info">
                        <div className="qm-quiz-title">
                          {s.quiz?.title ?? "Untitled Quiz"}
                        </div>
                        <span className="qm-code">{s.code}</span>
                      </div>
                      <div className="qm-actions">
                        <button
                          className="qm-join"
                          onClick={() => handleJoinQuiz(s.code)}
                        >
                          JOIN
                        </button>
                        {isOwner && (
                          <button
                            className="qm-delete"
                            onClick={(e) => handleDeleteQuiz(s.session_id, e)}
                            disabled={deletingId === s.session_id}
                          >
                            {deletingId === s.session_id ? "..." : "🗑️"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SharedQuizBrowserModal;