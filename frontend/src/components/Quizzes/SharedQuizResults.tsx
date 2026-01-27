// src/components/Quizzes/SharedQuizResults.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSharedSession,
  getSharedSessionResults,
  SharedQuizSession as ApiSharedQuizSession,
} from "../../services/quizService";
import { getImageUrl } from "../../services/cosmeticService";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../BackButton";
import ProfileHeader from "../../pages/ProfileHeader";
import { resultsStyles } from "../../styles/resultsCSS";

interface SharedQuizSession extends Omit<ApiSharedQuizSession, "quiz"> {
  quiz?: {
    title?: string;
    questions: { question_id: number }[];
  };
  participants?: {
    student_id: number;
    equipped_badge?: { name?: string; image?: string | null } | null;
  }[];
}

interface ParticipantResult {
  student_id: number;
  student_name: string;
  score: number;
  finished_at?: string | null;
  avatar?: string;
  equipped_badge?: {
    name?: string;
    image?: string | null;
  } | null;
}

const SharedQuizResults: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [results, setResults] = useState<ParticipantResult[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [quizTitle, setQuizTitle] = useState<string>("Shared Quiz");
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isReviewButtonHovered, setIsReviewButtonHovered] = useState(false);

  const fetchResults = useCallback(async () => {
    if (!code || !user) return;

    try {
      console.log("🔍 Fetching session with code:", code);
      
      const response = await getSharedSession(code);
      console.log("📦 Full response:", response);
      
      const session: SharedQuizSession = response.session || response;
      
      console.log("📝 Session data:", session);
      console.log("🆔 Session ID:", session.session_id);
      
      if (!session.session_id) {
        console.error("❌ No session_id found in session object");
        throw new Error("Invalid session data: missing session_id");
      }
      
      setTotalQuestions(session.quiz?.questions.length ?? 0);
      setQuizTitle(session.quiz?.title ?? "Shared Quiz");

      const equippedBadge =
        session.participants?.find((p) => p.student_id === user.user_id)
          ?.equipped_badge ?? null;

      console.log("🎯 Fetching results for session_id:", session.session_id);
      
      const res: ParticipantResult[] = await getSharedSessionResults(
        session.session_id
      );
      
      console.log("📊 Results fetched:", res);

      // Use getImageUrl for avatar normalization
      const normalized = res.map((r) => ({
        ...r,
        avatar: getImageUrl(r.avatar),
        equipped_badge: equippedBadge ? {
          ...equippedBadge,
          image: getImageUrl(equippedBadge.image || undefined),
        } : null,
      }));

      setResults(normalized);
    } catch (err) {
      console.error("❌ fetchResults error:", err);
    } finally {
      setLoading(false);
    }
  }, [code, user]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (loading) {
    return <div style={resultsStyles.loadingContainer}>⏳ Loading results...</div>;
  }

  const myResult = results.find((r) => r.student_id === user?.user_id);

  if (!myResult) {
    return (
      <div style={resultsStyles.alertContainer}>
        <div style={resultsStyles.alertBackButton}>
          <BackButton />
        </div>
        <div className="alert alert-warning" style={resultsStyles.alertMessage}>
          ⚠️ No result found for your account.
          <br />
          <small>
            Logged in as: {user?.first_name || user?.username} (ID: {user?.user_id})
          </small>
          <br />
          <small>
            Results count: {results.length}
          </small>
        </div>
      </div>
    );
  }

  const sorted = [...results].sort((a, b) => b.score - a.score);
  const rank = sorted.findIndex((r) => r.student_id === myResult.student_id) + 1;

  const accuracy =
    totalQuestions > 0
      ? ((myResult.score / totalQuestions) * 100).toFixed(1)
      : "0";

  const getCardStyle = (cardType: string) => ({
    ...resultsStyles.statCard,
    ...(cardType === 'score' && resultsStyles.statCardScore),
    ...(cardType === 'accuracy' && resultsStyles.statCardAccuracy),
    ...(cardType === 'rank' && resultsStyles.statCardRank),
    transform: hoveredCard === cardType ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: hoveredCard === cardType 
      ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
      : '0 10px 30px rgba(0, 0, 0, 0.15)',
  });

  const getIconStyle = (cardType: string) => ({
    ...resultsStyles.statIcon,
    transform: hoveredCard === cardType ? 'scale(1.1)' : 'scale(1)',
  });

  const reviewButtonStyle: React.CSSProperties = {
    padding: '15px 40px',
    fontSize: '1.1rem',
    fontWeight: '600',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: isReviewButtonHovered 
      ? '0 6px 16px rgba(59, 130, 246, 0.4)' 
      : '0 4px 12px rgba(59, 130, 246, 0.3)',
    transform: isReviewButtonHovered ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '0 auto',
  };

  return (
    <div style={resultsStyles.container}>
      <div style={resultsStyles.backButtonWrapper}>
        <BackButton />
      </div>

      {/* Animated background elements */}
      <div style={resultsStyles.bgElements}>
        <div className="trophy trophy-1" style={{...resultsStyles.trophy, ...resultsStyles.trophy1}}>🏆</div>
        <div className="trophy trophy-2" style={{...resultsStyles.trophy, ...resultsStyles.trophy2}}>🎯</div>
        <div className="trophy trophy-3" style={{...resultsStyles.trophy, ...resultsStyles.trophy3}}>⭐</div>
        <div className="trophy trophy-4" style={{...resultsStyles.trophy, ...resultsStyles.trophy4}}>🎖️</div>
        <div className="trophy trophy-5" style={{...resultsStyles.trophy, ...resultsStyles.trophy5}}>🏅</div>
        <div className="trophy trophy-6" style={{...resultsStyles.trophy, ...resultsStyles.trophy6}}>✨</div>
        <div className="circle circle-1" style={{...resultsStyles.circle, ...resultsStyles.circle1}}></div>
        <div className="circle circle-2" style={{...resultsStyles.circle, ...resultsStyles.circle2}}></div>
        <div className="circle circle-3" style={{...resultsStyles.circle, ...resultsStyles.circle3}}></div>
      </div>

      <div style={resultsStyles.contentWrapper}>
        <h1 style={resultsStyles.title}>
          🎉 {quizTitle}
        </h1>
        <p style={resultsStyles.subtitle}>
          Congratulations on completing the quiz!
        </p>

        {/* Profile Header */}
        <div style={resultsStyles.profileHeaderWrapper}>
          <ProfileHeader avatarSize={150} badgeSize={40} nickFrameSize={50} textSize={32} />
        </div>

        {/* Results Card */}
        <div style={resultsStyles.resultsCard}>
          <h2 style={resultsStyles.resultsTitle}>Your Quiz Results</h2>

          <div style={resultsStyles.statsRow}>
            <div
              style={getCardStyle('score')}
              onMouseEnter={() => setHoveredCard('score')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={getIconStyle('score')}>✅</div>
              <p style={{ ...resultsStyles.statLabel, ...resultsStyles.statLabelScore }}>
                Score
              </p>
              <p style={{ ...resultsStyles.statValue, ...resultsStyles.statValueScore }}>
                {myResult.score} / {totalQuestions}
              </p>
            </div>

            <div
              style={getCardStyle('accuracy')}
              onMouseEnter={() => setHoveredCard('accuracy')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={getIconStyle('accuracy')}>📊</div>
              <p style={{ ...resultsStyles.statLabel, ...resultsStyles.statLabelAccuracy }}>
                Accuracy
              </p>
              <p style={{ ...resultsStyles.statValue, ...resultsStyles.statValueAccuracy }}>
                {accuracy}%
              </p>
            </div>

            <div
              style={getCardStyle('rank')}
              onMouseEnter={() => setHoveredCard('rank')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={getIconStyle('rank')}>🏅</div>
              <p style={{ ...resultsStyles.statLabel, ...resultsStyles.statLabelRank }}>
                Rank
              </p>
              <p style={{ ...resultsStyles.statValue, ...resultsStyles.statValueRank }}>
                #{rank}
              </p>
              <p style={resultsStyles.statSubtext}>out of {results.length}</p>
            </div>
          </div>

          {myResult.finished_at && (
            <p style={resultsStyles.submittedText}>
              📅 Submitted at: {new Date(myResult.finished_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* Review Quiz Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => navigate(`/shared-quiz/${code}/review`)}
            onMouseEnter={() => setIsReviewButtonHovered(true)}
            onMouseLeave={() => setIsReviewButtonHovered(false)}
            style={reviewButtonStyle}
          >
            <span style={{ fontSize: '1.3rem' }}>📝</span>
            Review Quiz Answers
          </button>
        </div>
      </div>

      <style>{`
        .trophy {
          animation: float 20s infinite ease-in-out;
        }

        .trophy-1 {
          animation-delay: 0s;
        }

        .trophy-2 {
          animation-delay: 3s;
        }

        .trophy-3 {
          animation-delay: 1.5s;
        }

        .trophy-4 {
          animation-delay: 4s;
        }

        .trophy-5 {
          animation-delay: 2s;
        }

        .trophy-6 {
          animation-delay: 5s;
        }

        .circle {
          animation: pulse 15s infinite ease-in-out;
        }

        .circle-1 {
          animation-delay: 0s;
        }

        .circle-2 {
          animation-delay: 3s;
        }

        .circle-3 {
          animation-delay: 1.5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) rotate(5deg);
          }
          50% {
            transform: translateY(-50px) rotate(-5deg);
          }
          75% {
            transform: translateY(-30px) rotate(3deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.05;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }

        @media (max-width: 768px) {
          .trophy {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SharedQuizResults;