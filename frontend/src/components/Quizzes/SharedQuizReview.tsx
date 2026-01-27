// src/components/Quizzes/SharedQuizReview.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSharedQuizReview, QuizReviewData, QuizReviewQuestion } from "../../services/quizService";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../BackButton";

const SharedQuizReview: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState<QuizReviewData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sessionId, setSessionId] = useState<number | null>(null);

  // First, get session ID from code
  useEffect(() => {
    const getSessionId = async () => {
      if (!code) return;
      
      try {
        const { getSharedSession } = await import("../../services/quizService");
        const response = await getSharedSession(code);
        const session = response.session || response;
        setSessionId(session.session_id);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    getSessionId();
  }, [code]);

  useEffect(() => {
    const fetchReview = async () => {
      if (!sessionId || !user) return;

      try {
        const data = await getSharedQuizReview(Number(sessionId), user.user_id);
        setReviewData(data);
      } catch (error) {
        console.error("Error fetching quiz review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [sessionId, user]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>⏳</div>
        <p>Loading quiz review...</p>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div style={styles.errorContainer}>
        <p>Unable to load quiz review</p>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          Go Back
        </button>
      </div>
    );
  }

  const currentQuestion = reviewData.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === reviewData.questions.length - 1;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getAnswerStatus = (question: QuizReviewQuestion) => {
    if (question.is_correct) {
      return { icon: "✅", text: "Correct!", color: "#10b981" };
    }
    return { icon: "❌", text: "Incorrect", color: "#ef4444" };
  };

  const status = getAnswerStatus(currentQuestion);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <BackButton />
        <h1 style={styles.title}>{reviewData.quiz_title} - Review</h1>
      </div>

      {/* Score Summary */}
      <div style={styles.scoreCard}>
        <div style={styles.scoreItem}>
          <span style={styles.scoreLabel}>Your Score:</span>
          <span style={styles.scoreValue}>
            {reviewData.participant?.score || reviewData.submission?.score} / {reviewData.total_questions}
          </span>
        </div>
        <div style={styles.scoreItem}>
          <span style={styles.scoreLabel}>Accuracy:</span>
          <span style={styles.scoreValue}>
            {(((reviewData.participant?.score || reviewData.submission?.score || 0) / reviewData.total_questions) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${((currentQuestionIndex + 1) / reviewData.questions.length) * 100}%`,
            }}
          />
        </div>
        <span style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {reviewData.questions.length}
        </span>
      </div>

      {/* Question Card */}
      <div style={styles.questionCard}>
        {/* Status Badge */}
        <div style={{ ...styles.statusBadge, backgroundColor: status.color }}>
          {status.icon} {status.text}
        </div>

        {/* Question */}
        <div style={styles.questionSection}>
          <h2 style={styles.questionNumber}>Question {currentQuestionIndex + 1}</h2>
          <p style={styles.questionText}>{currentQuestion.question_text}</p>
          {currentQuestion.question_image && (
            <img
              src={currentQuestion.question_image}
              alt="Question"
              style={styles.questionImage}
            />
          )}
        </div>

        {/* Answer Section */}
        {currentQuestion.is_identification ? (
          <div style={styles.identificationSection}>
            <div style={styles.answerBox}>
              <strong>Your Answer:</strong>
              <p style={{
                ...styles.answerText,
                color: currentQuestion.is_correct ? "#10b981" : "#ef4444"
              }}>
                {currentQuestion.student_answer || "(No answer provided)"}
              </p>
            </div>
            {!currentQuestion.is_correct && (
              <div style={styles.answerBox}>
                <strong>Correct Answer:</strong>
                <p style={{ ...styles.answerText, color: "#10b981" }}>
                  {currentQuestion.correct_answer}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.optionsSection}>
            {currentQuestion.options.map((option) => {
              const isStudentAnswer = option.option_id === currentQuestion.student_answer;
              const isCorrectAnswer = option.is_correct;

              let optionStyle = { ...styles.option };
              let icon = "";

              if (isCorrectAnswer) {
                optionStyle = { ...optionStyle, ...styles.optionCorrect };
                icon = "✅ ";
              } else if (isStudentAnswer && !isCorrectAnswer) {
                optionStyle = { ...optionStyle, ...styles.optionWrong };
                icon = "❌ ";
              }

              return (
                <div key={option.option_id} style={optionStyle}>
                  {icon}
                  {option.option_text}
                  {isStudentAnswer && (
                    <span style={styles.yourAnswerBadge}>Your Answer</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Explanation (if wrong) */}
        {!currentQuestion.is_correct && (
          <div style={styles.explanationBox}>
            <strong>💡 Note:</strong>
            <p>
              {currentQuestion.is_identification
                ? `The correct answer is "${currentQuestion.correct_answer}"`
                : "Review the correct answer highlighted in green above."}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={styles.navigation}>
        <button
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          style={{
            ...styles.navButton,
            ...(isFirstQuestion && styles.navButtonDisabled),
          }}
        >
          ← Previous
        </button>

        <div style={styles.questionDots}>
          {reviewData.questions.map((q, idx) => (
            <button
              key={q.question_id}
              onClick={() => setCurrentQuestionIndex(idx)}
              style={{
                ...styles.dot,
                ...(idx === currentQuestionIndex && styles.dotActive),
                backgroundColor: q.is_correct ? "#10b981" : "#ef4444",
              }}
              title={`Question ${idx + 1} - ${q.is_correct ? "Correct" : "Incorrect"}`}
            />
          ))}
        </div>

        {isLastQuestion ? (
          <button onClick={() => navigate(-1)} style={styles.finishButton}>
            Finish Review
          </button>
        ) : (
          <button onClick={handleNext} style={styles.navButton}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: "10px",
  },
  scoreCard: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#f3f4f6",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  scoreItem: {
    textAlign: "center",
  },
  scoreLabel: {
    display: "block",
    fontSize: "0.9rem",
    color: "#6b7280",
    marginBottom: "5px",
  },
  scoreValue: {
    display: "block",
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#1f2937",
  },
  progressContainer: {
    marginBottom: "30px",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
    position: "relative",
  },
  statusBadge: {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "8px 16px",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  questionSection: {
    marginBottom: "30px",
  },
  questionNumber: {
    fontSize: "1.2rem",
    color: "#6b7280",
    marginBottom: "10px",
  },
  questionText: {
    fontSize: "1.3rem",
    fontWeight: "500",
    color: "#1f2937",
    lineHeight: "1.6",
  },
  questionImage: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "8px",
    marginTop: "15px",
  },
  identificationSection: {
    marginTop: "20px",
  },
  answerBox: {
    backgroundColor: "#f9fafb",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  answerText: {
    fontSize: "1.1rem",
    fontWeight: "500",
    marginTop: "8px",
  },
  optionsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  option: {
    padding: "15px 20px",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    backgroundColor: "#fff",
    fontSize: "1rem",
    transition: "all 0.2s",
    position: "relative",
  },
  optionCorrect: {
    backgroundColor: "#d1fae5",
    borderColor: "#10b981",
    fontWeight: "500",
  },
  optionWrong: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
    fontWeight: "500",
  },
  yourAnswerBadge: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
  explanationBox: {
    backgroundColor: "#fef3c7",
    border: "2px solid #f59e0b",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "20px",
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  navButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  navButtonDisabled: {
    backgroundColor: "#d1d5db",
    cursor: "not-allowed",
  },
  finishButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#10b981",
    color: "#fff",
    cursor: "pointer",
  },
  questionDots: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  dotActive: {
    transform: "scale(1.5)",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    fontSize: "1.2rem",
    color: "#6b7280",
  },
  spinner: {
    fontSize: "3rem",
    marginBottom: "20px",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  backBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
  },
};

export default SharedQuizReview;