import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getQuiz, submitQuiz } from "../services/quizService";
import { getImageUrl } from "../services/cosmeticService";
import { useAuth } from "../context/AuthContext";

interface TakeQuizModalProps {
  quizId: number | null;
  show: boolean;
  onClose: () => void;
  onSubmitted?: () => void; 
}

interface FetchedOption {
  option_id?: number;
  option_text: string;
  is_correct?: boolean;
}

interface FetchedQuestion {
  question_id?: number;
  question_text: string;
  question_image?: string;
  options?: FetchedOption[];
}

const TakeQuizModal: React.FC<TakeQuizModalProps> = ({
  quizId,
  show,
  onClose,
  onSubmitted,
}) => {
  const { user } = useAuth();

  const [questions, setQuestions] = useState<FetchedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const isIdentificationQuestion = (q: FetchedQuestion): boolean => 
    q.options ? q.options.length === 1 : false;

  useEffect(() => {
    if (!show || !quizId) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const quiz = await getQuiz(quizId);
        const fetchedQuestions: FetchedQuestion[] = (quiz.questions || []).map(
          (q: any) => ({
            question_id: q.question_id ?? q.id,
            question_text: q.question_text ?? q.text ?? q.question,
            question_image: q.question_image,
            options: (q.options || []).map((o: any) => ({
              option_id: o.option_id ?? o.id,
              option_text: o.option_text ?? o.text,
              is_correct: o.is_correct,
            })),
          })
        );
        setQuestions(fetchedQuestions);
        setCurrentIndex(0);
        setAnswers({});
        setTextAnswer("");
        setIsAnswered(false);
        setIsCorrect(null);
      } catch (err) {
        console.error("Failed to load quiz questions:", err);
        setError("Failed to load quiz.");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId, show]);

  const handleAnswerChange = (question: FetchedQuestion, option: FetchedOption) => {
    if (isAnswered) return;
    
    const qid = question.question_id!;
    setAnswers((prev) => ({
      ...prev,
      [qid]: option.option_id ?? option.option_text,
    }));
    
    const correct = option.is_correct ?? false;
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleTextAnswerSubmit = (question: FetchedQuestion) => {
    if (isAnswered || !textAnswer.trim()) return;
    
    const normalizedAnswer = textAnswer.trim().toLowerCase();
    const correctAnswer = question.options![0].option_text.toLowerCase().trim();
    const correct = normalizedAnswer === correctAnswer;

    setAnswers((prev) => ({ 
      ...prev, 
      [question.question_id!]: textAnswer.trim() 
    }));
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setTextAnswer("");
    setIsAnswered(false);
    setIsCorrect(null);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setTextAnswer("");
    setIsAnswered(false);
    setIsCorrect(null);
  };

  const handleSubmit = async () => {
    if (!quizId || !user) return;
    try {
      setLoading(true);
      setError(null);

      const payload = {
        student_id: user.user_id,
        answers: Object.entries(answers).map(([question_id, answer]) => {
          if (typeof answer === 'string') {
            const question = questions.find(q => q.question_id === Number(question_id));
            return {
              question_id: Number(question_id),
              option_id: question?.options?.[0]?.option_id ?? 0,
              text_answer: answer,
            };
          }
          return {
            question_id: Number(question_id),
            option_id: Number(answer),
          };
        }),
      };

      const result = await submitQuiz(quizId, payload);
      setScore(result.score ?? null);
      setSubmitted(true);

      if (onSubmitted) {
        onSubmitted();
      }
    } catch (err) {
      console.error("❌ Failed to submit quiz:", err);
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const currentQuestion = questions[currentIndex];
  const isIdentification = currentQuestion ? isIdentificationQuestion(currentQuestion) : false;

  const getOptionClass = (option: FetchedOption) => {
    const qid = currentQuestion.question_id!;
    const selectedAnswer = answers[qid];
    let className = "quiz-option";
    
    if (isAnswered) {
      className += " disabled";
      if ((option.option_id ?? option.option_text) === selectedAnswer) {
        className += isCorrect ? " correct" : " wrong";
      } else if (option.is_correct) {
        className += " correct";
      }
    } else if ((option.option_id ?? option.option_text) === selectedAnswer) {
      className += " selected";
    }
    
    return className;
  };

  const modalContent = (
    <>
      <style>{`
        .quiz-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .quiz-modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .quiz-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quiz-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .quiz-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s;
        }

        .quiz-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .quiz-body {
          padding: 32px;
          overflow-y: auto;
          flex: 1;
        }

        .quiz-body::-webkit-scrollbar {
          width: 6px;
        }

        .quiz-body::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 3px;
        }

        .quiz-loading {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .quiz-spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .quiz-error {
          background: #fee;
          color: #c33;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .quiz-submitted {
          text-align: center;
          padding: 40px 20px;
        }

        .quiz-submitted h3 {
          color: #667eea;
          font-size: 1.75rem;
          margin: 16px 0;
        }

        .quiz-submitted p {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 24px;
        }

        .quiz-submitted strong {
          color: #667eea;
          font-size: 1.5rem;
        }

        .quiz-question-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
          font-size: 0.95rem;
          color: #666;
        }

        .quiz-question-counter {
          font-weight: 600;
          color: #667eea;
        }

        .quiz-question-text {
          font-size: 1.25rem;
          font-weight: 500;
          color: #333;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .quiz-image-container {
          margin-bottom: 24px;
          text-align: center;
          background: #f8f9fa;
          padding: 16px;
          border-radius: 12px;
        }

        .quiz-image {
          max-height: 300px;
          max-width: 100%;
          border-radius: 8px;
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .quiz-option {
          background: white;
          border: 2px solid #e0e0e0;
          padding: 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #000;
        }

        .quiz-option:hover:not(.disabled) {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .quiz-option.selected {
          border-color: #667eea;
          background: #f0f3ff;
          color: #000;
        }

        .quiz-option.correct {
          border-color: #28a745;
          background: #e8f5e9;
          color: #000;
        }

        .quiz-option.wrong {
          border-color: #dc3545;
          background: #ffeef0;
          color: #000;
        }

        .quiz-option.disabled {
          cursor: default;
        }

        .quiz-option input[type="radio"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .quiz-input {
          width: 100%;
          padding: 16px;
          font-size: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          transition: border-color 0.2s;
        }

        .quiz-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .quiz-input:disabled {
          background: #f5f5f5;
        }

        .quiz-input.correct {
          border-color: #28a745;
          background: #e8f5e9;
        }

        .quiz-input.wrong {
          border-color: #dc3545;
          background: #ffeef0;
        }

        .quiz-feedback {
          margin-top: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 500;
        }

        .quiz-feedback.correct {
          background: #e8f5e9;
          color: #1e7e34;
        }

        .quiz-feedback.wrong {
          background: #ffeef0;
          color: #c82333;
        }

        .quiz-navigation {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 24px;
        }

        .quiz-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quiz-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quiz-btn-secondary {
          background: #6c757d;
          color: white;
        }

        .quiz-btn-secondary:hover:not(:disabled) {
          background: #5a6268;
        }

        .quiz-btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .quiz-btn-primary:hover {
          opacity: 0.9;
        }

        .quiz-btn-success {
          background: #28a745;
          color: white;
        }

        .quiz-btn-success:hover {
          background: #218838;
        }

        .quiz-btn-submit-text {
          width: 100%;
          margin-top: 12px;
          background: #17a2b8;
          color: white;
        }

        .quiz-btn-submit-text:hover:not(:disabled) {
          background: #138496;
        }

        @media (max-width: 768px) {
          .quiz-body {
            padding: 24px 20px;
          }

          .quiz-question-text {
            font-size: 1.1rem;
          }

          .quiz-option {
            padding: 12px;
          }

          .quiz-navigation {
            flex-direction: column;
          }

          .quiz-btn {
            width: 100%;
          }
        }
      `}</style>
      
      <div className="quiz-overlay" onClick={onClose}>
        <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
          <div className="quiz-header">
            <h2 className="quiz-title">📝 Take Quiz</h2>
            <button className="quiz-close" onClick={onClose}>✕</button>
          </div>

          <div className="quiz-body">
            {loading && (
              <div className="quiz-loading">
                <div className="quiz-spinner"></div>
                <p>Loading quiz...</p>
              </div>
            )}
            
            {error && <div className="quiz-error">{error}</div>}

            {!loading && submitted && (
              <div className="quiz-submitted">
                <div style={{ fontSize: '3rem' }}>🎉</div>
                <h3>Quiz Submitted!</h3>
                <p>Your score: <strong>{score ?? "—"}</strong></p>
                <button className="quiz-btn quiz-btn-primary" onClick={onClose}>
                  Close
                </button>
              </div>
            )}

            {!loading && !submitted && questions.length > 0 && currentQuestion && (
              <>
                <div className="quiz-question-header">
                  <span className="quiz-question-counter">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span>Quiz #{quizId}</span>
                </div>

                <div className="quiz-question-text">
                  {currentQuestion.question_text}
                </div>

                {currentQuestion.question_image && (
                  <div className="quiz-image-container">
                    <img
                      src={getImageUrl(currentQuestion.question_image)}
                      alt={`Question ${currentIndex + 1}`}
                      className="quiz-image"
                      onError={(e) => {
                        console.error("Failed to load question image:", currentQuestion.question_image);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {!isIdentification && (
                  <div className="quiz-options">
                    {currentQuestion.options?.map((opt) => (
                      <div
                        key={opt.option_id ?? opt.option_text}
                        className={getOptionClass(opt)}
                        onClick={() => !isAnswered && handleAnswerChange(currentQuestion, opt)}
                      >
                        <input
                          type="radio"
                          checked={answers[currentQuestion.question_id!] === (opt.option_id ?? opt.option_text)}
                          onChange={() => {}}
                          disabled={isAnswered}
                        />
                        {opt.option_text}
                      </div>
                    ))}
                  </div>
                )}

                {isIdentification && (
                  <div>
                    <input
                      type="text"
                      className={`quiz-input ${
                        isAnswered && isCorrect ? "correct" : 
                        isAnswered && !isCorrect ? "wrong" : ""
                      }`}
                      placeholder="Type your answer..."
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      disabled={isAnswered}
                    />
                    {!isAnswered && (
                      <button
                        className="quiz-btn quiz-btn-submit-text"
                        onClick={() => handleTextAnswerSubmit(currentQuestion)}
                        disabled={!textAnswer.trim()}
                      >
                        Submit Answer
                      </button>
                    )}
                    {isAnswered && (
                      <div className={`quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
                        {isCorrect 
                          ? "✅ Correct!" 
                          : `❌ Wrong! Correct: ${currentQuestion.options![0].option_text}`}
                      </div>
                    )}
                  </div>
                )}

                <div className="quiz-navigation">
                  <button
                    className="quiz-btn quiz-btn-secondary"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    ← Previous
                  </button>

                  {isAnswered && currentIndex < questions.length - 1 && (
                    <button className="quiz-btn quiz-btn-primary" onClick={handleNext}>
                      Next →
                    </button>
                  )}
                  
                  {isAnswered && currentIndex === questions.length - 1 && (
                    <button className="quiz-btn quiz-btn-success" onClick={handleSubmit}>
                      ✅ Submit Quiz
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default TakeQuizModal;