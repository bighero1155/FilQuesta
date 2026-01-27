// src/modals/StudentQuizReviewModal.tsx
import React, { useState, useEffect } from "react";
import axios from "../auth/axiosInstance";

interface Student {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

interface QuizAttempt {
  session_id: number;
  quiz_title: string;
  score: number;
  total_questions: number;
  finished_at: string;
  code: string;
}

interface StudentQuizReviewModalProps {
  student: Student;
  onClose: () => void;
}

const StudentQuizReviewModal: React.FC<StudentQuizReviewModalProps> = ({
  student,
  onClose,
}) => {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentQuizzes = async () => {
      setLoading(true);
      try {
        // Fetch all shared quiz participations for this student
        const response = await axios.get(`/shared-quiz-participations/${student.user_id}`);
        console.log("Quiz attempts:", response.data);
        setQuizAttempts(response.data);
      } catch (error) {
        console.error("Error fetching student quizzes:", error);
        setQuizAttempts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentQuizzes();
  }, [student.user_id]);

  const handleViewReview = (quiz: QuizAttempt) => {
    // ✅ Fixed: Use session_id instead of code
    const reviewUrl = `/teacher/shared-quiz-review/${quiz.session_id}/${student.user_id}`;
    console.log("Opening review:", reviewUrl);
    window.open(reviewUrl, '_blank');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-header">
            <div className="student-info">
              <div className="student-avatar">
                {student.avatar ? (
                  <img src={student.avatar} alt={student.username} />
                ) : (
                  <span>{student.first_name.charAt(0)}{student.last_name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3>{student.first_name} {student.last_name}</h3>
                <p>@{student.username}</p>
              </div>
            </div>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading quiz attempts...</p>
              </div>
            ) : quizAttempts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h4>No Quiz Attempts</h4>
                <p>This student hasn't completed any quizzes yet.</p>
              </div>
            ) : (
              <div className="quiz-list">
                <h4>Quiz Attempts ({quizAttempts.length})</h4>
                {quizAttempts.map((quiz) => {
                  const percentage = ((quiz.score / quiz.total_questions) * 100).toFixed(1);
                  const isPassing = parseFloat(percentage) >= 60;

                  return (
                    <div key={quiz.session_id} className="quiz-card">
                      <div className="quiz-info">
                        <div className="quiz-title">{quiz.quiz_title}</div>
                        <div className="quiz-date">
                          📅 {new Date(quiz.finished_at).toLocaleDateString()} at{" "}
                          {new Date(quiz.finished_at).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="quiz-score">
                        <div className={`score-badge ${isPassing ? 'passing' : 'failing'}`}>
                          {quiz.score} / {quiz.total_questions}
                        </div>
                        <div className={`percentage ${isPassing ? 'passing' : 'failing'}`}>
                          {percentage}%
                        </div>
                      </div>

                      <button
                        className="review-btn"
                        onClick={() => handleViewReview(quiz)}
                      >
                        View Review →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="close-footer-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background: white;
    border-radius: 20px;
    max-width: 700px;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 20px 20px 0 0;
  }

  .student-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .student-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    border: 3px solid white;
    overflow: hidden;
  }

  .student-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .student-info h3 {
    margin: 0;
    font-size: 1.3rem;
  }

  .student-info p {
    margin: 5px 0 0 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 25px 30px;
  }

  .modal-body::-webkit-scrollbar {
    width: 8px;
  }

  .modal-body::-webkit-scrollbar-track {
    background: #f8f9fa;
  }

  .modal-body::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
  }

  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #6c757d;
    text-align: center;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f4f6;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .quiz-list h4 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 1.2rem;
  }

  .quiz-card {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
  }

  .quiz-card:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
  }

  .quiz-info {
    flex: 1;
    min-width: 0;
  }

  .quiz-title {
    font-weight: bold;
    font-size: 1.05rem;
    color: #333;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .quiz-date {
    font-size: 0.85rem;
    color: #6c757d;
  }

  .quiz-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .score-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .score-badge.passing {
    background: #d1fae5;
    color: #10b981;
  }

  .score-badge.failing {
    background: #fee2e2;
    color: #ef4444;
  }

  .percentage {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .percentage.passing {
    color: #10b981;
  }

  .percentage.failing {
    color: #ef4444;
  }

  .review-btn {
    padding: 10px 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .review-btn:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .modal-footer {
    padding: 20px 30px;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: flex-end;
  }

  .close-footer-btn {
    padding: 10px 30px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .close-footer-btn:hover {
    background: #5a6268;
  }

  @media (max-width: 768px) {
    .modal-content {
      max-height: 90vh;
    }

    .quiz-card {
      flex-direction: column;
      align-items: stretch;
    }

    .quiz-score {
      flex-direction: row;
      justify-content: space-between;
    }

    .review-btn {
      width: 100%;
    }
  }
`;

export default StudentQuizReviewModal;