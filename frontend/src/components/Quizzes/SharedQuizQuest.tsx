// src/components/Quizzes/SharedQuizQuest.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getSharedSession,
  submitSharedQuizAnswers,
} from "../../services/quizService";
import { getUserPowerUps, activatePowerUp } from "../../services/powerUpService";
import { updateUserProgress } from "../../services/userService";
import RetryModal from "../Quizzes/RetryModal";
import ExitProtection from "../ExitProtection";
import SharedQuizQuestCSS from "../../styles/SharedQuizQuestCSS";
import Loading from "../Loading";

interface Option {
  option_id: number;
  option_text: string;
  is_correct?: boolean;
}

interface Question {
  question_id: number;
  question_text: string;
  question_image?: string;
  options: Option[];
}

const SharedQuizQuest: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | string | null>>({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const [isFrozen, setIsFrozen] = useState(false);
  const [freezeDuration, setFreezeDuration] = useState(0);
  const [timeFreezeCount, setTimeFreezeCount] = useState(0);
  const [hasSecondChance, setHasSecondChance] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [retryIndex, setRetryIndex] = useState(0);
  const [showRetryModal, setShowRetryModal] = useState(false);

  const [score, setScore] = useState(0);
  const [scoreBoosterCount, setScoreBoosterCount] = useState(0);
  const [boosterActive, setBoosterActive] = useState(false);
  const [boosterMultiplier, setBoosterMultiplier] = useState(1);
  const [boosterRemaining, setBoosterRemaining] = useState(0);

  // Mobile panel state
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  const boosterIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const getImageUrl = (imagePath?: string) =>
    imagePath
      ? imagePath.startsWith("http")
        ? imagePath
        : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/storage/${imagePath}`
      : undefined;

  const isIdentificationQuestion = (q: Question): boolean => q.options.length === 1;

  useEffect(() => {
    if (!code || !user) return;

    const fetchData = async () => {
      const data = await getSharedSession(code);
      
      const sessionData = (data as any).session || data;
      
      setSession(sessionData);
      setLoading(false);

      if (user?.user_id) {
        const userPowers = await getUserPowerUps(user.user_id);

        const secondChance = userPowers.some(
          (p) => p.power_up?.type === "second_chance" && p.quantity > 0
        );
        const timeFreeze = userPowers.find((p) => p.power_up?.type === "time_freeze");
        const scoreBooster = userPowers.find((p) => p.power_up?.type === "score_booster");

        setHasSecondChance(secondChance);
        setTimeFreezeCount(timeFreeze ? timeFreeze.quantity : 0);
        setScoreBoosterCount(scoreBooster ? scoreBooster.quantity : 0);
      }
    };

    fetchData();

    return () => {
      if (boosterIntervalRef.current) window.clearInterval(boosterIntervalRef.current);
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    };
  }, [code, user]);

  const handleAnswerChange = (question: Question, option: Option) => {
    if (isAnswered) return;
    setSelectedOption(option.option_id);
    setAnswers((prev) => ({ ...prev, [question.question_id]: option.option_id }));
    const correct = option.is_correct ?? false;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      const points = Math.round(5 * (boosterActive ? boosterMultiplier : 1));
      setScore((p) => p + points);
    } else {
      setWrongQuestions((prev) => {
        if (prev.find((q) => q.question_id === question.question_id)) return prev;
        return [...prev, question];
      });
    }
  };

  const handleTextAnswerSubmit = (question: Question) => {
    if (isAnswered || !textAnswer.trim()) return;
    const normalizedAnswer = textAnswer.trim().toLowerCase();
    const correctAnswer = question.options[0].option_text.toLowerCase().trim();
    const correct = normalizedAnswer === correctAnswer;
    setAnswers((prev) => ({ ...prev, [question.question_id]: textAnswer.trim() }));
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      const points = Math.round(5 * (boosterActive ? boosterMultiplier : 1));
      setScore((p) => p + points);
    } else {
      setWrongQuestions((prev) => {
        if (prev.find((q) => q.question_id === question.question_id)) return prev;
        return [...prev, question];
      });
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setTextAnswer("");
    setIsAnswered(false);
    setIsCorrect(null);
  };

  const activateScoreBooster = async () => {
    if (!user || boosterActive || scoreBoosterCount <= 0) return;
    try {
      const res = await activatePowerUp(user.user_id, "score_booster");
      const mult = res.multiplier ?? 2;
      const duration = 30;

      setBoosterMultiplier(mult);
      setBoosterActive(true);
      setBoosterRemaining(duration);
      setScoreBoosterCount((p) => Math.max(0, p - 1));

      if (boosterIntervalRef.current) window.clearInterval(boosterIntervalRef.current);
      boosterIntervalRef.current = window.setInterval(() => {
        setBoosterRemaining((prev) => {
          if (prev <= 1) {
            if (boosterIntervalRef.current) {
              window.clearInterval(boosterIntervalRef.current);
              boosterIntervalRef.current = null;
            }
            setBoosterActive(false);
            setBoosterMultiplier(1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to activate Score Booster:", err);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!session || !user) return;
    try {
      const questions: Question[] = session.quiz.questions;
      const wrongs: Question[] = [];

      for (const q of questions) {
        const ans = answers[q.question_id];
        if (ans == null) {
          wrongs.push(q);
          continue;
        }

        if (typeof ans === "string") {
          const correct =
            q.options[0].option_text.toLowerCase().trim() === ans.toLowerCase().trim();
          if (!correct) wrongs.push(q);
        } else {
          const correctOpt = q.options.find((o) => o.is_correct);
          if (ans !== correctOpt?.option_id) wrongs.push(q);
        }
      }

      if (wrongs.length > 0) {
        if (hasSecondChance) {
          await activatePowerUp(user.user_id, "second_chance");
          setWrongQuestions(wrongs);
          setRetryIndex(0);
          setShowRetryModal(true);
          return;
        }
        await submitSharedQuizAnswers(session.session_id, user.user_id, answers);

        try {
          await updateUserProgress(user.user_id, score);
        } catch (err) {
          console.error("Failed to update user progress after submit:", err);
        }

        navigate(`/sharedquiz/${code}/results`);
        return;
      }

      await submitSharedQuizAnswers(session.session_id, user.user_id, answers);

      try {
        await updateUserProgress(user.user_id, score);
      } catch (err) {
        console.error("Failed to update user progress after submit:", err);
      }

      navigate(`/sharedquiz/${code}/results`);
    } catch (err) {
      console.error("Submit failed:", err);
      navigate(`/sharedquiz/${code}/results`);
    }
  }, [session, user, answers, navigate, code, hasSecondChance, score]);

  const handleRetryAnswerChange = (questionId: number, answer: number | string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleRetrySubmit = async () => {
    const retryQ = wrongQuestions[retryIndex];
    const ans = answers[retryQ.question_id];
    if (retryQ.options.length === 1 && typeof ans === "string") {
      const correctAnswer = retryQ.options[0].option_text.toLowerCase().trim();
      const isNowCorrect = ans.toLowerCase().trim() === correctAnswer;
      if (isNowCorrect) {
        const points = Math.round(5 * (boosterActive ? boosterMultiplier : 1));
        setScore((p) => p + points);
      }
    } else if (typeof ans === "number") {
      const chosen = retryQ.options.find((o) => o.option_id === ans);
      if (chosen?.is_correct) {
        const points = Math.round(5 * (boosterActive ? boosterMultiplier : 1));
        setScore((p) => p + points);
      }
    }

    if (retryIndex + 1 < wrongQuestions.length) {
      setRetryIndex((p) => p + 1);
    } else {
      setShowRetryModal(false);

      await submitSharedQuizAnswers(session.session_id, user!.user_id, answers);

      try {
        await updateUserProgress(user!.user_id, score);
      } catch (err) {
        console.error("Failed to update user progress after retry submission:", err);
      }

      navigate(`/sharedquiz/${code}/results`);
    }
  };

  useEffect(() => {
    if (session && session.duration_minutes) {
      const totalSeconds = session.duration_minutes * 60;
      setTimeLeft(totalSeconds);
      setTimerRunning(true);
    }
  }, [session]);

  useEffect(() => {
    if (!timerRunning || timeLeft === null) return;
    if (timeLeft <= 0) {
      setTimerRunning(false);
      setShowTimeUp(true);

      const submitSequence = async () => {
        await new Promise((r) => setTimeout(r, 1200));
        setFadeOut(true);
        await new Promise((r) => setTimeout(r, 1300));
        await handleSubmit();
      };

      submitSequence();
      return;
    }

    if (isFrozen) return;

    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => (prev ? Math.max(prev - 1, 0) : null));
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [timeLeft, timerRunning, isFrozen, handleSubmit]);

  useEffect(() => {
    if (!isFrozen || freezeDuration <= 0) return;
    const timer = setTimeout(() => setFreezeDuration((p) => p - 1), 1000);
    if (freezeDuration === 1) setIsFrozen(false);
    return () => clearTimeout(timer);
  }, [isFrozen, freezeDuration]);

  const activateTimeFreeze = async () => {
    if (!user || isFrozen || timeFreezeCount <= 0 || !timerRunning) return;
    try {
      const res = await activatePowerUp(user.user_id, "time_freeze");
      setIsFrozen(true);
      setFreezeDuration(res.duration || 10);
      setTimeFreezeCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to activate Time Freeze:", error);
    }
  };

  if (loading) return <Loading />;

  const questions: Question[] = session.quiz.questions;
  const currentQ = questions[currentIndex];
  const isIdentification = isIdentificationQuestion(currentQ);

  const getOptionClass = (option: Option) => {
    let className = "option-btn";
    if (isAnswered) {
      className += " answered";
      if (option.option_id === selectedOption) {
        className += isCorrect ? " correct-selected" : " wrong-selected";
      } else if (option.is_correct) {
        className += " correct-answer";
      }
    } else if (option.option_id === selectedOption) {
      className += " selected";
    }

    return className;
  };

  const getTimerClass = () => {
    if (isFrozen) return "quiz-timer frozen";
    if (timeLeft !== null && timeLeft <= 30) return "quiz-timer warning";
    return "quiz-timer normal";
  };

  return (
    <>
      <SharedQuizQuestCSS />
      <div className="quiz-quest-container">
        <ExitProtection />
        
        {/* Animated Background Elements */}
        <div className="quiz-bg-elements">
          <div className="quiz-icon quiz-icon-1">📚</div>
          <div className="quiz-icon quiz-icon-2">✏️</div>
          <div className="quiz-icon quiz-icon-3">🎯</div>
          <div className="quiz-icon quiz-icon-4">💡</div>
          <div className="quiz-icon quiz-icon-5">🏆</div>
          <div className="quiz-icon quiz-icon-6">⭐</div>
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>
        
        {/* Desktop Score Panel */}
        <div className="score-panel">
          <div className="score-panel-label">SCORE</div>
          <div className="score-panel-value">{score}</div>

          <div className="score-panel-label">BOOSTER</div>
          <div className="score-panel-booster">
            {boosterActive ? `x${boosterMultiplier} (${boosterRemaining}s)` : `x1`}
          </div>

          <div className="score-panel-label">Inventory</div>
          <div className="score-panel-inventory">
            ⚡ {scoreBoosterCount} • ❄️ {timeFreezeCount} • ❤️ {hasSecondChance ? "1+" : "0"}
          </div>

          <button
            className="btn btn-sm btn-outline-warning btn-powerup"
            onClick={activateScoreBooster}
            disabled={boosterActive || scoreBoosterCount <= 0}
          >
            ⚡ Activate Booster
          </button>

          <button
            className="btn btn-sm btn-outline-primary btn-powerup"
            onClick={activateTimeFreeze}
            disabled={isFrozen || timeFreezeCount <= 0}
          >
            ❄️ Freeze Time
          </button>

          <div className={`score-panel-second-chance ${hasSecondChance ? 'active' : 'inactive'}`}>
            ❤️ Second Chance: {hasSecondChance ? "Ready" : "None"}
          </div>
        </div>

        {/* Mobile Score Toggle Button */}
        <button
          className="mobile-score-toggle"
          onClick={() => setIsMobilePanelOpen(true)}
        >
          <span className="mobile-score-value">{score}</span>
          <span className="mobile-chevron">▲</span>
        </button>

        {/* Mobile Score Overlay */}
        {isMobilePanelOpen && (
          <div 
            className="mobile-score-overlay" 
            onClick={() => setIsMobilePanelOpen(false)}
          >
            <div 
              className="mobile-score-panel" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel Header */}
              <div className="mobile-panel-header">
                <h3 className="mobile-panel-title">Game Stats</h3>
                <button
                  className="mobile-panel-close"
                  onClick={() => setIsMobilePanelOpen(false)}
                >
                  ×
                </button>
              </div>

              {/* Panel Content */}
              <div className="mobile-panel-content">
                {/* Score Display */}
                <div className="mobile-score-display">
                  <div className="score-panel-label">SCORE</div>
                  <div className="score-panel-value">{score}</div>
                </div>

                {/* Booster Status */}
                <div className="mobile-booster-status">
                  <div className="score-panel-label">MULTIPLIER</div>
                  <div className="score-panel-booster">
                    {boosterActive ? `x${boosterMultiplier} (${boosterRemaining}s)` : 'x1'}
                  </div>
                </div>

                {/* Inventory */}
                <div className="mobile-inventory">
                  <div className="score-panel-label">INVENTORY</div>
                  <div className="score-panel-inventory">
                    ⚡ {scoreBoosterCount} • ❄️ {timeFreezeCount} • ❤️ {hasSecondChance ? "1" : "0"}
                  </div>
                </div>

                {/* Power-up Buttons */}
                <div className="mobile-powerup-buttons">
                  <button
                    className="mobile-powerup-btn booster"
                    onClick={() => {
                      activateScoreBooster();
                      setIsMobilePanelOpen(false);
                    }}
                    disabled={boosterActive || scoreBoosterCount <= 0}
                  >
                    <span>⚡</span>
                    <span>Activate Booster</span>
                  </button>

                  <button
                    className="mobile-powerup-btn freeze"
                    onClick={() => {
                      activateTimeFreeze();
                      setIsMobilePanelOpen(false);
                    }}
                    disabled={isFrozen || timeFreezeCount <= 0}
                  >
                    <span>❄️</span>
                    <span>Freeze Time</span>
                  </button>
                </div>

                {/* Second Chance Status */}
                <div className={`mobile-second-chance ${hasSecondChance ? 'active' : 'inactive'}`}>
                  <span>❤️</span>
                  <span>Second Chance: {hasSecondChance ? 'Ready' : 'None'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Time Up Overlay */}
        {showTimeUp && (
          <div className={`time-up-overlay ${fadeOut ? 'fade-out' : ''}`}>
            ⏰ Time's Up! Submitting your answers...
          </div>
        )}

        {/* Retry Modal */}
        {showRetryModal && wrongQuestions[retryIndex] && (
          <RetryModal
            show={showRetryModal}
            retryQuestion={wrongQuestions[retryIndex]}
            retryIndex={retryIndex}
            totalWrong={wrongQuestions.length}
            answers={answers}
            onAnswerChange={handleRetryAnswerChange}
            onSubmit={handleRetrySubmit}
          />
        )}

        {/* Quiz Card */}
        <div className="quiz-card">
          {/* Timer */}
          {timeLeft !== null && (
            <div className={getTimerClass()}>
              {isFrozen ? "❄️ " : "⏳ "}
              Time Left:{" "}
              {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}
            </div>
          )}

          {/* Question Header */}
          <h4 className="question-header">
            Question {currentIndex + 1} of {questions.length}
          </h4>

          {/* Question Text */}
          <p className="question-text">{currentQ.question_text}</p>

          {/* Question Image */}
          {currentQ.question_image && (
            <div className="question-image-container">
              <img
                src={getImageUrl(currentQ.question_image)}
                alt={`Question ${currentIndex + 1}`}
                className="question-image img-fluid"
              />
            </div>
          )}

          {/* Multiple Choice Options */}
          {!isIdentification && (
            <div className="options-container">
              {currentQ.options.map((o) => (
                <div
                  key={o.option_id}
                  className={getOptionClass(o)}
                  onClick={() => handleAnswerChange(currentQ, o)}
                >
                  {o.option_text}
                </div>
              ))}
            </div>
          )}

          {/* Identification Input */}
          {isIdentification && (
            <div className="options-container">
              <input
                type="text"
                className={`identification-input ${
                  isAnswered && isCorrect === true
                    ? "correct"
                    : isAnswered && isCorrect === false
                    ? "wrong"
                    : ""
                }`}
                placeholder="Type your answer here..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={isAnswered}
              />
              {!isAnswered && (
                <button
                  className="btn btn-info btn-submit-answer"
                  onClick={() => handleTextAnswerSubmit(currentQ)}
                >
                  ✓ Submit
                </button>
              )}
              {isAnswered && (
                <div className={`answer-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
                  {isCorrect ? "✅ Correct!" : "❌ Wrong Answer!"}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            {isAnswered && currentIndex < questions.length - 1 && (
              <button className="btn btn-outline-info btn-next" onClick={handleNext}>
                ➡️ Next Question
              </button>
            )}
            {isAnswered && currentIndex === questions.length - 1 && (
              <button className="btn btn-success btn-submit-quiz" onClick={handleSubmit}>
                ✅ Submit Answers
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SharedQuizQuest;