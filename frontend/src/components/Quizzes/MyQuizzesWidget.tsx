import React, { useEffect, useState } from "react";
import { getStudentQuizzes } from "../../services/quizService";
import { useAuth } from "../../context/AuthContext";
import TakeQuizModal from "../../modals/TakeQuizModal";

interface QuizAssignment {
  quiz_id: number;
  title: string;
  description?: string;
  status?: "not_started" | "in_progress" | "completed";
}

const MyQuizzesWidget: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenQuizzes, setHiddenQuizzes] = useState<Set<number>>(new Set());

  // Modal state
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const fetchData = async () => {
    if (!user || user.role !== "student") return;
    try {
      setLoading(true);
      const data = await getStudentQuizzes(user.user_id);

      const mapped: QuizAssignment[] = (Array.isArray(data) ? data : []).map(
        (q: any) => ({
          quiz_id: q.quiz_id,
          title: q.title,
          description: q.description,
          status: q.completed ? "completed" : "not_started",
        })
      );

      setQuizzes(mapped);
      setError(null);
    } catch (err) {
      console.error("getStudentQuizzes error:", err);
      setError("Failed to load assigned quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (!user || user.role !== "student") return null;

  const handleStartQuiz = (quizId: number) => {
    setActiveQuizId(quizId);
    setShowModal(true);
  };

  const handleCloseQuiz = (quizId: number) => {
    setHiddenQuizzes((prev) => new Set([...prev, quizId]));
  };

  const handleQuizSubmitted = () => {
    fetchData();
  };

  const visibleQuizzes = quizzes.filter(
    (quiz) => !hiddenQuizzes.has(quiz.quiz_id)
  );

  return (
    <>
      <div className="my-quizzes-widget">
        <h4 className="widget-title">📘 Quick Quests!</h4>

        {loading && <div className="text-center text-secondary">Loading...</div>}
        {error && <div className="text-center text-danger fw-semibold">{error}</div>}
        {!loading && visibleQuizzes.length === 0 && (
          <div className="text-center text-muted">No quizzes assigned.</div>
        )}

        <div className="quiz-list">
          {visibleQuizzes.map((quiz) => (
            <div key={quiz.quiz_id} className="quiz-card">
              <button
                className="close-btn"
                onClick={() => handleCloseQuiz(quiz.quiz_id)}
                title="Hide quiz"
              >
                ✕
              </button>

              <div className="quiz-body">
                <h5 className="quiz-title">{quiz.title}</h5>
                <p className="quiz-desc">
                  {quiz.description || "No description"}
                </p>

                <div className="quiz-actions">
                  {quiz.status === "completed" ? (
                    <button className="btn-completed" disabled>
                      ✅ Completed
                    </button>
                  ) : (
                    <button
                      className="btn-start"
                      onClick={() => handleStartQuiz(quiz.quiz_id)}
                    >
                      Start Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && ( 
        <TakeQuizModal
          show={showModal}
          quizId={activeQuizId}
          onClose={() => {
            setShowModal(false);
            setActiveQuizId(null);
          }}
          onSubmitted={handleQuizSubmitted}
        />
      )}

      <style>{`
        .my-quizzes-widget {
          max-height: 250px; 
          overflow-y: auto;
          padding-right: 4px;
        }

        .widget-title {
          font-size: 0.85rem;
          text-align: center;
          font-weight: bold;
          margin-bottom: 8px;
          color: #fff;
        }

        .quiz-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quiz-card {
          background: #f9fafb;
          border-radius: 6px;
          padding: 8px;
          position: relative;
          font-size: 0.75rem;
        }

        .close-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          background: #dc3545;
          border: none;
          color: #fff;
          width: 18px;
          height: 18px;
          font-size: 12px;
          border-radius: 50%;
          line-height: 1;
          cursor: pointer;
        }

        .quiz-title {
          font-size: 0.8rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis; 
        }

        .quiz-desc {
          font-size: 0.7rem;
          color: #555;
          margin: 0 0 6px;
          max-height: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .quiz-actions {
          text-align: center;
        }

        .btn-start,
        .btn-completed {
          padding: 3px 8px;
          font-size: 0.7rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-start {
          background: #007bff;
          color: white;
        }
        .btn-start:hover {
          background: #0069d9;
        }

        .btn-completed {
          background: #28a745;
          color: white;
        }
      `}</style>
    </>
  );
};

export default MyQuizzesWidget;
