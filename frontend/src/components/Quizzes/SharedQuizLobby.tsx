// src/components/Quizzes/SharedQuizLobby.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getSharedSession,
  joinSharedSession,
  startSharedSession,
  stopSharedSession,
  sendReaction,
  SharedQuizSession,
  SharedQuizParticipant,
  SharedQuizReaction,
} from "../../services/quizService";

import BackButton from "../BackButton";
import ProfileHeader from "../../pages/ProfileHeader";
import LobbyCSS from "../../styles/LobbyCSS";
import Loading from "../Loading";

interface FlyingIcon {
  id: number;
  icon: string;
  startTime: number;
  isLeft: boolean;
}

// ✅ Extended participant type with cached avatar
interface ExtendedParticipant extends SharedQuizParticipant {
  avatar?: string;
  username?: string;
  avatarCached?: boolean; // Track if we've already fetched the avatar
}

const SharedQuizLobby: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState<SharedQuizSession | null>(null);
  const [participants, setParticipants] = useState<ExtendedParticipant[]>([]);
  const [reactions, setReactions] = useState<SharedQuizReaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingQuiz, setStartingQuiz] = useState(false);
  const [stoppingQuiz, setStoppingQuiz] = useState(false); 
  const [teacherStarting, setTeacherStarting] = useState(false);

  const joinedRef = useRef(false);
  const actionInProgressRef = useRef(false);
  const errorCountRef = useRef(0);
  
  // ✅ Cache avatar data to prevent flickering
  const avatarCacheRef = useRef<Map<number, { avatar?: string; username: string }>>(new Map());

  // TikTok-like flying icons state
  const [flyingIcons, setFlyingIcons] = useState<FlyingIcon[]>([]);
  const flyingIdRef = useRef(0);
  const displayedReactionsRef = useRef(new Set<number>());

  const [fallingIcons, setFallingIcons] = useState<Array<{
    id: number;
    icon: string;
    x: number;
    y: number;
    velocityY: number;
    rotation: number;
  }>>([]);
  const fallingIdRef = useRef(0);

  // Quiz icons positioned randomly
  const quizIcons = [
    { icon: "📝", x: 15, y: 10 },
    { icon: "🎯", x: 10, y: 60 },
    { icon: "🏆", x: 80, y: 20 },
    { icon: "⭐", x: 85, y: 80 },
    { icon: "📚", x: 75, y: 70 },
    { icon: "🎓", x: 25, y: 75 },
  ];

  // Icons for the reaction bar
  const reactionEmojis = ["❤️", "🔥", "👍", "🎉", "✨", "💯", "🌟", "👏"];

  const handleIconClick = (icon: string, x: number, y: number) => {
    const newFallingIcon = {
      id: fallingIdRef.current++,
      icon,
      x,
      y,
      velocityY: 0,
      rotation: 0,
    };

    setFallingIcons(prev => [...prev, newFallingIcon]);

    let currentY = y;
    let velocity = 0;
    let currentRotation = 0;
    const gravity = 0.5;
    const rotationSpeed = 15;

    const animate = () => {
      velocity += gravity;
      currentY += velocity;
      currentRotation += rotationSpeed;

      setFallingIcons(prev =>
        prev.map(item =>
          item.id === newFallingIcon.id
            ? { ...item, y: currentY, velocityY: velocity, rotation: currentRotation }
            : item
        )
      );

      if (currentY < 110) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setFallingIcons(prev => prev.filter(item => item.id !== newFallingIcon.id));
        }, 100);
      }
    };

    requestAnimationFrame(animate);
  };

  // Handle reaction click - send to backend and show immediately
  const handleReactionClick = async (emoji: string) => {
    if (!code) return;

    const isLeft = Math.random() < 0.5;
    const immediateIcon: FlyingIcon = {
      id: flyingIdRef.current++,
      icon: emoji,
      startTime: Date.now(),
      isLeft,
    };

    setFlyingIcons(prev => [...prev, immediateIcon]);

    setTimeout(() => {
      setFlyingIcons(prev => prev.filter(icon => icon.id !== immediateIcon.id));
    }, 3000);

    try {
      await sendReaction(code, emoji);
    } catch (error) {
      console.error("Failed to send reaction:", error);
    }
  };

  // Display reactions from backend
  useEffect(() => {
    reactions.forEach((reaction) => {
      if (!displayedReactionsRef.current.has(reaction.id)) {
        displayedReactionsRef.current.add(reaction.id);

        const isLeft = Math.random() < 0.5;
        const newIcon: FlyingIcon = {
          id: flyingIdRef.current++,
          icon: reaction.emoji,
          startTime: Date.now(),
          isLeft,
        };

        setFlyingIcons(prev => [...prev, newIcon]);

        setTimeout(() => {
          setFlyingIcons(prev => prev.filter(icon => icon.id !== newIcon.id));
        }, 3000);
      }
    });

    const currentReactionIds = new Set(reactions.map(r => r.id));
    displayedReactionsRef.current.forEach(id => {
      if (!currentReactionIds.has(id)) {
        displayedReactionsRef.current.delete(id);
      }
    });
  }, [reactions]);

  const fetchSession = useCallback(async () => {
    if (!code) return;

    try {
      const data = await getSharedSession(code);
      
      // Handle both old and new response formats
      const sessionData = (data as any).session || data;
      const reactionsData = (data as any).reactions || [];

      const participantsList: ExtendedParticipant[] =
        (sessionData as any).participants?.map((p: any) => {
          // ✅ Check if we have cached data for this participant
          const cached = avatarCacheRef.current.get(p.student_id);

          // ✅ Extract avatar from multiple possible locations
          const avatarFromServer = 
            p.avatar || 
            p.student_avatar || 
            p.student?.avatar || 
            (p as any).user?.avatar ||
            undefined;

          // ✅ Extract username from multiple possible locations
          const usernameFromServer = 
            p.student_name || 
            p.name || 
            p.username ||
            p.student?.name ||
            p.student?.username ||
            (p as any).user?.username ||
            `User ${p.student_id}`;

          // ✅ Use cached data if available, otherwise use server data
          const avatar = cached?.avatar || avatarFromServer;
          const username = cached?.username || usernameFromServer;

          // ✅ Update cache if we got new data from server
          if (avatarFromServer || usernameFromServer) {
            avatarCacheRef.current.set(p.student_id, {
              avatar: avatarFromServer || cached?.avatar,
              username: usernameFromServer || cached?.username || `User ${p.student_id}`,
            });
          }

          // ✅ Only log on first load or when data changes
          if (!cached || cached.avatar !== avatar) {
            console.log('Participant data updated:', {
              student_id: p.student_id,
              avatar,
              username,
              cached: !!cached
            });
          }

          return {
            ...p,
            avatar,
            username,
            avatarCached: true,
          };
        }) ?? [];

      setSession(sessionData);
      setParticipants(participantsList);
      setReactions(reactionsData);
      setError(null);
      errorCountRef.current = 0;

      const me = participantsList.find(
        (p: ExtendedParticipant) => p.student_id === user?.user_id
      );

      if (user?.role === "student" && me?.finished_at) {
        navigate(`/sharedquiz/${code}/results`);
      }

      setLoading(false);
    } catch (err: any) {
      console.error("Error loading session:", err);
      errorCountRef.current++;
      
      if (errorCountRef.current >= 5) {
        setError(
          err.response?.status === 404
            ? "❌ Quiz session not found. The session may have been deleted."
            : "❌ Failed to load quiz session. The backend server may be down."
        );
      }
      
      setLoading(false);
    }
  }, [code, navigate, user]);

  useEffect(() => {
    const joinSession = async () => {
      if (user?.role === "student" && !joinedRef.current && code) {
        try {
          await joinSharedSession(code, user.user_id);
          joinedRef.current = true;
        } catch (err) {
          console.error("Failed to join session:", err);
          setError("❌ Failed to join the quiz session.");
        }
      }
      await fetchSession();
    };

    joinSession();
  }, [code, user, fetchSession]);

  useEffect(() => {
    if (errorCountRef.current >= 5) return;
    
    const interval = setInterval(() => {
      if (!actionInProgressRef.current && errorCountRef.current < 5) {
        fetchSession();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [fetchSession]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center mt-5" style={{ color: "white", padding: "20px" }}>
        <BackButton />
        <div style={{
          background: "rgba(220, 53, 69, 0.1)",
          border: "2px solid #dc3545",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "500px",
          margin: "0 auto",
        }}>
          <h2 style={{ marginBottom: "20px" }}>⚠️ Error</h2>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              errorCountRef.current = 0;
              setError(null);
              setLoading(true);
              fetchSession();
            }}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "8px",
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  const rankedParticipants = [...participants].sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;

    if (a.finished_at && b.finished_at) return scoreB - scoreA;
    if (a.finished_at) return -1;
    if (b.finished_at) return 1;
    return 0;
  });

  return (
    <>
      <LobbyCSS />
      
      <div className="lobby-container">
        {/* Back Button */}
        <div className="back-button-wrapper">
          <BackButton />
        </div>

        {/* Animated background elements */}
        <div className="lobby-bg-elements">
          {quizIcons.map((item, index) => (
            <div
              key={index}
              className={`quiz-icon quiz-icon-${index + 1}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
              }}
              onClick={() => handleIconClick(item.icon, item.x, item.y)}
            >
              {item.icon}
            </div>
          ))}
          
          {/* Falling icons */}
          {fallingIcons.map((falling) => (
            <div
              key={falling.id}
              className="falling-icon"
              style={{
                left: `${falling.x}%`,
                top: `${falling.y}%`,
                transform: `rotate(${falling.rotation}deg)`,
              }}
            >
              {falling.icon}
            </div>
          ))}

          {/* TikTok-style flying icons from reactions */}
          {flyingIcons.map((flying) => (
            <div
              key={flying.id}
              className={flying.isLeft ? "tiktok-flying-icon-left" : "tiktok-flying-icon-right"}
            >
              {flying.icon}
            </div>
          ))}

          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>

        {/* Main Content */}
        <div className="lobby-content">
          {/* Quiz Code */}
          <div className="quiz-code-card">
            <h2 className="quiz-code-title">
              🔑 Join Code: <span className="quiz-code-value">{session?.code || code}</span>
            </h2>
          </div>

          {/* Teacher Controls */}
          {user?.role === "teacher" && session && (
            <div className="control-buttons">
              {session.active ? (
                <button
                  className="btn-control btn-stop"
                  disabled={stoppingQuiz}
                  onClick={async () => {
                    actionInProgressRef.current = true;
                    setStoppingQuiz(true);
                    try {
                      await stopSharedSession(session.session_id);
                      setSession({ ...session, active: false });
                    } finally {
                      setStoppingQuiz(false);
                      actionInProgressRef.current = false;
                      await fetchSession();
                    }
                  }}
                >
                  {stoppingQuiz ? "⏳ Stopping..." : "⛔ Stop Quiz"}
                </button>
              ) : (
                <button
                  className="btn-control btn-start"
                  disabled={teacherStarting}
                  onClick={async () => {
                    actionInProgressRef.current = true;
                    setTeacherStarting(true);
                    try {
                      await startSharedSession(session.session_id);
                      setSession({ ...session, active: true });
                    } finally {
                      setTeacherStarting(false);
                      actionInProgressRef.current = false;
                      await fetchSession();
                    }
                  }}
                >
                  {teacherStarting ? "⏳ Starting..." : "▶️ Start Quiz"}
                </button>
              )}
            </div>
          )}

          {/* Student Start Button */}
          {user?.role === "student" && session?.active && (
            <div className="control-buttons">
              <button
                className="btn-control btn-primary"
                disabled={startingQuiz}
                onClick={() => {
                  setStartingQuiz(true);
                  setTimeout(() => {
                    navigate(`/sharedquiz/${code}/quiz`);
                  }, 350);
                }}
              >
                {startingQuiz ? "⏳ Starting..." : "📝 Start Quiz"}
              </button>
            </div>
          )}

          {/* Participants Grid */}
          <div className="participants-grid">
            {rankedParticipants.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px",
                color: "white",
                fontSize: "18px",
              }}>
                <p>👥 No participants yet...</p>
                <p style={{ fontSize: "14px", opacity: 0.7 }}>Waiting for students to join</p>
              </div>
            ) : (
              rankedParticipants.map((p: ExtendedParticipant, index: number) => (
                <div key={p.id || p.student_id} className="participant-card">
                  <div className="participant-content">
                    {/* Avatar - ProfileHeader with cached data */}
                    <div className="participant-avatar">
                      <ProfileHeader
                        key={`${p.student_id}-${p.avatar}`} 
                        userData={{
                          user_id: p.student_id,
                          username: p.username || `User ${p.student_id}`,
                          avatar: p.avatar,
                        }}
                        avatarSize={60}
                        badgeSize={30}
                        nickFrameSize={28}
                        textSize={18}
                      />
                    </div>

                    {/* Rank */}
                    <div className="participant-rank">
                      🏅 Rank: {index + 1}
                    </div>

                    {/* Score Badge */}
                    <span className={`score-badge ${p.finished_at ? 'finished' : 'pending'}`}>
                      {p.finished_at ? `✅ Score: ${p.score}` : "⏳ Not finished"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reaction Bar */}
        <div className="reaction-bar">
          {reactionEmojis.map((emoji) => (
            <button
              key={emoji}
              className="reaction-btn"
              onClick={() => handleReactionClick(emoji)}
              title={`Send ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SharedQuizLobby;