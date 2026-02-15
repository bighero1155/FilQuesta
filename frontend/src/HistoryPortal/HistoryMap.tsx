// src/HistoryPortal/HistoryMap.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategoryProgress } from "../services/levelService";
import { useAuth } from "../context/AuthContext";
import axios from "../auth/axiosInstance";

const LEVELS_PER_CATEGORY = 15;

const LEVEL_SECTIONS = [
  {
    name: "BASIC",
    categoryId: "BASIC",
    subtitle: "Heograpiya (Geography)",
    emoji: "🗺️",
    color: "#4CAF50",
    darkColor: "#1b4d1c",
  },
  {
    name: "NORMAL",
    categoryId: "NORMAL",
    subtitle: "Kultura at Lipunan (Culture)",
    emoji: "🏛️",
    color: "#E8B84B",
    darkColor: "#7a5a10",
  },
  {
    name: "HARD",
    categoryId: "HARD",
    subtitle: "Kasaysayan (History)",
    emoji: "📜",
    color: "#D2691E",
    darkColor: "#6b2f06",
  },
  {
    name: "ADVANCED",
    categoryId: "ADVANCED",
    subtitle: "Pamahalaan (Government)",
    emoji: "⚖️",
    color: "#4A90D9",
    darkColor: "#1a3a6e",
  },
  {
    name: "EXPERT",
    categoryId: "EXPERT",
    subtitle: "Ekonomiya (Economy)",
    emoji: "🏺",
    color: "#C0392B",
    darkColor: "#6b1111",
  },
];

const HistoryMap: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({
    BASIC: 0,
    NORMAL: 0,
    HARD: 0,
    ADVANCED: 0,
    EXPERT: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Get userId from auth or localStorage
  useEffect(() => {
    let uid: number | null = null;
    if (user?.id) {
      uid = user.id;
    } else {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          uid = Number(parsed.user_id || parsed.id);
        }
      } catch {
        uid = null;
      }
    }
    setUserId(uid);
  }, [user]);

  // Fetch category progress and scores
  useEffect(() => {
    if (!userId) {
      setCategoryProgress({ BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0 });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const progress = await getAllCategoryProgress(userId, "History", [
          "BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT",
        ]);
        setCategoryProgress(progress);

        const userResponse = await axios.get(`/users/${userId}`);
        setGameScore(userResponse.data.total_score || 0);
      } catch (err) {
        console.error("Failed to load History data", err);
        setCategoryProgress({ BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0 });
        setGameScore(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Listen for unlock updates
  useEffect(() => {
    const handler = async () => {
      if (!userId) return;
      try {
        const progress = await getAllCategoryProgress(userId, "History", [
          "BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT",
        ]);
        setCategoryProgress(progress);
      } catch (err) {
        console.error("Failed to refresh History progress", err);
      }
    };

    window.addEventListener("levels:updated", handler);
    return () => window.removeEventListener("levels:updated", handler);
  }, [userId]);

  // Navigation
  const goToPrevious = () => {
    setCurrentCategoryIndex((prev) => (prev === 0 ? LEVEL_SECTIONS.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentCategoryIndex((prev) => (prev === LEVEL_SECTIONS.length - 1 ? 0 : prev + 1));
  };

  if (!userId) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1C0A00 0%, #2E1503 50%, #3B1A07 100%)",
        color: "#E8B84B",
        fontSize: "1.2rem",
        fontFamily: "'Cinzel', Georgia, serif",
      }}>
        Please log in to see the History map.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1C0A00 0%, #2E1503 50%, #3B1A07 100%)",
        color: "#E8B84B",
        fontSize: "1.2rem",
        fontFamily: "'Cinzel', Georgia, serif",
      }}>
        Loading History map…
      </div>
    );
  }

  const totalLevelsUnlocked = Object.values(categoryProgress).reduce((sum, val) => sum + val, 0);
  const totalLevels = LEVEL_SECTIONS.length * LEVELS_PER_CATEGORY;

  const currentSection = LEVEL_SECTIONS[currentCategoryIndex];
  const unlockedInCategory = categoryProgress[currentSection.categoryId] || 0;
  const progressPercent = Math.round((unlockedInCategory / LEVELS_PER_CATEGORY) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1C0A00 0%, #2E1503 50%, #3B1A07 100%)",
        padding: "20px",
        fontFamily: "'Cinzel', Georgia, serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Parchment noise texture overlay */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Floating history icons */}
      <div className="history-bg-elements">
        <span className="history-float h-f1">📜</span>
        <span className="history-float h-f2">⚔️</span>
        <span className="history-float h-f3">🏛️</span>
        <span className="history-float h-f4">🗿</span>
        <span className="history-float h-f5">🏺</span>
        <span className="history-float h-f6">🎖️</span>
      </div>

      {/* Back Button – Top Left (Desktop only) */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 100,
        display: window.innerWidth < 768 ? "none" : "block",
      }}>
        <button
          onClick={() => navigate("/AralingPanlipunan")}
          style={{
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #3B1A07, #1C0A00)",
            border: "3px solid #E8B84B",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            color: "#E8B84B",
            boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ◀
        </button>
      </div>

      {/* Info Button – Top Right */}
      <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 100 }}>
        <button
          style={{
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #D2691E, #6b2f06)",
            border: "3px solid #E8B84B",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(210,105,30,0.5)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onClick={() =>
            alert(
              `History Progress\n\n${totalLevelsUnlocked}/${totalLevels} Levels Completed\nGame Score: ${gameScore}`
            )
          }
        >
          ℹ️
        </button>
      </div>

      {/* Player / Title Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #2E1503, #1C0A00)",
          borderRadius: "20px",
          border: "3px solid #E8B84B",
          padding: "clamp(15px, 3vw, 20px)",
          marginBottom: "30px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(232,184,75,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(10px, 3vw, 20px)",
          maxWidth: "clamp(320px, 90%, 600px)",
          margin: "0 auto 30px auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "clamp(60px, 15vw, 80px)",
            height: "clamp(60px, 15vw, 80px)",
            background: "linear-gradient(135deg, #D2691E, #6b2f06)",
            borderRadius: "50%",
            border: "3px solid #E8B84B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(30px, 8vw, 40px)",
            flexShrink: 0,
            boxShadow: "0 4px 20px rgba(210,105,30,0.6)",
          }}
        >
          📚
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
              fontWeight: "bold",
              color: "#E8B84B",
              textShadow: "2px 2px 6px rgba(0,0,0,0.9)",
              marginBottom: "8px",
              letterSpacing: "2px",
              fontFamily: "'Cinzel Decorative', 'Cinzel', Georgia, serif",
            }}
          >
            HALINA'T MATUTO TAYO!
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              color: "#fff",
            }}
          >
            <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
              {totalLevelsUnlocked}/{totalLevels} ⭐
            </span>
            <span style={{ color: "#E8B84B", fontWeight: "bold" }}>
              🎯 {gameScore}
            </span>
          </div>
        </div>
      </div>

      {/* Main Carousel Container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* LEFT ARROW – Desktop only */}
        <button
          onClick={goToPrevious}
          style={{
            width: "clamp(50px, 10vw, 80px)",
            height: "clamp(50px, 10vw, 80px)",
            background: "linear-gradient(135deg, #E8B84B, #b8892b)",
            border: "clamp(3px, 0.5vw, 5px) solid #1C0A00",
            borderRadius: "clamp(10px, 2vw, 15px)",
            cursor: "pointer",
            display: window.innerWidth < 768 ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(24px, 5vw, 36px)",
            color: "#1C0A00",
            fontWeight: "bold",
            boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(232,184,75,0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
          }}
        >
          ◀
        </button>

        {/* CATEGORY CARD */}
        <div
          style={{
            background: `linear-gradient(135deg, ${currentSection.darkColor}, #1C0A00)`,
            borderRadius: "clamp(15px, 3vw, 25px)",
            border: `clamp(3px, 0.6vw, 4px) solid #E8B84B`,
            padding: "clamp(20px, 4vw, 30px)",
            boxShadow: `0 12px 40px ${currentSection.color}50, inset 0 1px 0 rgba(232,184,75,0.15)`,
            maxWidth: "clamp(320px, 90%, 800px)",
            width: "100%",
            minHeight: "clamp(350px, 60vh, 450px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "clamp(10px, 2vw, 20px)",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 2vw, 15px)" }}>
              <div
                style={{
                  fontSize: "clamp(2rem, 8vw, 4rem)",
                  filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))",
                }}
              >
                {currentSection.emoji}
              </div>

              <div>
                <div
                  style={{
                    fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
                    fontWeight: "bold",
                    color: "#E8B84B",
                    textShadow: "3px 3px 6px rgba(0,0,0,0.9)",
                    textTransform: "uppercase",
                    letterSpacing: "clamp(1px, 0.3vw, 3px)",
                    fontFamily: "'Cinzel', Georgia, serif",
                  }}
                >
                  {currentSection.name}
                </div>
                <div
                  style={{
                    fontSize: "clamp(0.8rem, 2.5vw, 1.1rem)",
                    color: "#c9a96e",
                    fontStyle: "italic",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {currentSection.subtitle}
                </div>
              </div>
            </div>
          </div>

          {/* Decorative divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${currentSection.color}, transparent)`,
              marginBottom: "clamp(10px, 2vw, 18px)",
              opacity: 0.6,
            }}
          />

          {/* Level Grid (1–15) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "clamp(10px, 2.5vw, 16px)",
              marginBottom: "25px",
              padding: "0 clamp(15px, 4vw, 25px)",
              maxWidth: "clamp(350px, 95%, 650px)",
              margin: "0 auto 25px auto",
            }}
          >
            {Array.from({ length: LEVELS_PER_CATEGORY }, (_, i) => {
              const levelNumber = i + 1;
              const isUnlocked = levelNumber === 1 || levelNumber <= unlockedInCategory;
              const categoryIndex = LEVEL_SECTIONS.findIndex(
                (s) => s.categoryId === currentSection.categoryId
              );
              const globalLevelId = categoryIndex * LEVELS_PER_CATEGORY + levelNumber;

              return (
                <button
                  key={levelNumber}
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      navigate(
                        `/history-portal?level=${globalLevelId - 1}&category=${currentSection.categoryId}`
                      );
                    }
                  }}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "50%",
                    background: isUnlocked
                      ? `radial-gradient(circle at 35% 35%, ${currentSection.color}, ${currentSection.darkColor})`
                      : "radial-gradient(circle at top left, #4a3520, #2a1a0a)",
                    color: isUnlocked ? "#fff" : "#5a4030",
                    fontWeight: "bold",
                    fontSize: "clamp(14px, 3.5vw, 18px)",
                    border: isUnlocked
                      ? `3px solid #E8B84B`
                      : "2px solid #4a3520",
                    cursor: isUnlocked ? "pointer" : "not-allowed",
                    boxShadow: isUnlocked
                      ? `0 4px 12px ${currentSection.color}70, inset 0 1px 0 rgba(255,255,255,0.2)`
                      : "0 2px 6px rgba(0,0,0,0.5)",
                    transition: "all 0.2s ease",
                    opacity: isUnlocked ? 1 : 0.45,
                    padding: "0",
                    minWidth: "44px",
                    minHeight: "44px",
                    width: "100%",
                    fontFamily: "'Cinzel', Georgia, serif",
                    textShadow: isUnlocked ? "1px 1px 3px rgba(0,0,0,0.7)" : "none",
                  }}
                  onMouseOver={(e) => {
                    if (isUnlocked) {
                      e.currentTarget.style.transform = "scale(1.15)";
                      e.currentTarget.style.boxShadow = `0 6px 20px ${currentSection.color}, inset 0 1px 0 rgba(255,255,255,0.3)`;
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = isUnlocked
                      ? `0 4px 12px ${currentSection.color}70, inset 0 1px 0 rgba(255,255,255,0.2)`
                      : "0 2px 6px rgba(0,0,0,0.5)";
                  }}
                >
                  {levelNumber}
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div
            style={{
              background: "rgba(0,0,0,0.6)",
              borderRadius: "clamp(15px, 3vw, 25px)",
              height: "clamp(36px, 7vw, 48px)",
              border: `3px solid #E8B84B`,
              overflow: "hidden",
              position: "relative",
              marginBottom: "clamp(15px, 3vw, 20px)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${currentSection.color}, ${currentSection.darkColor})`,
                transition: "width 0.5s ease",
                boxShadow: `inset 0 -4px 12px rgba(0,0,0,0.4)`,
                position: "relative",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "clamp(0.95rem, 3.5vw, 1.4rem)",
                fontWeight: "bold",
                color: "#E8B84B",
                textShadow: "2px 2px 6px rgba(0,0,0,1)",
                pointerEvents: "none",
                fontFamily: "'Cinzel', Georgia, serif",
                letterSpacing: "1px",
              }}
            >
              {progressPercent}%
            </div>
          </div>

          {/* Level Count + Buttons */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                marginBottom: "clamp(10px, 2vw, 15px)",
                fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
                color: "#c9a96e",
                fontWeight: "bold",
                textShadow: "1px 1px 4px rgba(0,0,0,0.9)",
                letterSpacing: "1px",
                fontFamily: "'Cinzel', Georgia, serif",
              }}
            >
              {unlockedInCategory} / {LEVELS_PER_CATEGORY} LEVELS
            </div>

            <div
              style={{
                display: "flex",
                gap: "clamp(10px, 2vw, 15px)",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* LEFT ARROW – Mobile only */}
              <button
                onClick={goToPrevious}
                style={{
                  display: window.innerWidth < 768 ? "flex" : "none",
                  width: "clamp(50px, 12vw, 60px)",
                  height: "clamp(50px, 12vw, 60px)",
                  background: "linear-gradient(135deg, #E8B84B, #b8892b)",
                  border: "3px solid #1C0A00",
                  borderRadius: "12px",
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(18px, 5vw, 22px)",
                  color: "#1C0A00",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                ◀
              </button>

              {/* Play / Continue Button */}
              <button
                onClick={() => {
                  const categoryIndex = LEVEL_SECTIONS.findIndex(
                    (s) => s.categoryId === currentSection.categoryId
                  );
                  const targetLevelNumber = unlockedInCategory === 0 ? 1 : unlockedInCategory;
                  const globalLevelId = categoryIndex * LEVELS_PER_CATEGORY + targetLevelNumber;
                  navigate(
                    `/history-portal?level=${globalLevelId - 1}&category=${currentSection.categoryId}`
                  );
                }}
                style={{
                  padding: "clamp(10px, 2.5vw, 16px) clamp(25px, 6vw, 48px)",
                  background: `linear-gradient(135deg, ${currentSection.color}, ${currentSection.darkColor})`,
                  color: "#fff",
                  border: "3px solid #E8B84B",
                  borderRadius: "clamp(12px, 2.5vw, 18px)",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "clamp(1rem, 3.5vw, 1.5rem)",
                  textTransform: "uppercase",
                  letterSpacing: "clamp(1px, 0.3vw, 2px)",
                  boxShadow: `0 6px 25px ${currentSection.color}70`,
                  transition: "all 0.2s ease",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
                  flexShrink: 0,
                  fontFamily: "'Cinzel', Georgia, serif",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = `0 8px 35px ${currentSection.color}, 0 0 0 2px #E8B84B`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = `0 6px 25px ${currentSection.color}70`;
                }}
              >
                ▶ {unlockedInCategory > 1 ? "CONTINUE" : "PLAY"}
              </button>

              {/* RIGHT ARROW – Mobile only */}
              <button
                onClick={goToNext}
                style={{
                  display: window.innerWidth < 768 ? "flex" : "none",
                  width: "clamp(50px, 12vw, 60px)",
                  height: "clamp(50px, 12vw, 60px)",
                  background: "linear-gradient(135deg, #E8B84B, #b8892b)",
                  border: "3px solid #1C0A00",
                  borderRadius: "12px",
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(18px, 5vw, 22px)",
                  color: "#1C0A00",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT ARROW – Desktop only */}
        <button
          onClick={goToNext}
          style={{
            width: "clamp(50px, 10vw, 80px)",
            height: "clamp(50px, 10vw, 80px)",
            background: "linear-gradient(135deg, #E8B84B, #b8892b)",
            border: "clamp(3px, 0.5vw, 5px) solid #1C0A00",
            borderRadius: "clamp(10px, 2vw, 15px)",
            cursor: "pointer",
            display: window.innerWidth < 768 ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(24px, 5vw, 36px)",
            color: "#1C0A00",
            fontWeight: "bold",
            boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(232,184,75,0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
          }}
        >
          ▶
        </button>
      </div>

      {/* Bottom Category Indicator Bars */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "30px",
          marginBottom: "20px",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {LEVEL_SECTIONS.map((section, i) => (
          <div
            key={i}
            style={{
              width: "clamp(40px, 8vw, 80px)",
              height: "clamp(14px, 2.5vw, 22px)",
              background: i === currentCategoryIndex ? section.color : "#3a2010",
              borderRadius: "8px",
              border: i === currentCategoryIndex ? "2px solid #E8B84B" : "2px solid #5a3520",
              boxShadow:
                i === currentCategoryIndex
                  ? `0 4px 15px ${section.color}80`
                  : "0 2px 6px rgba(0,0,0,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={() => setCurrentCategoryIndex(i)}
          />
        ))}
      </div>

      {/* Back Button – Bottom (Mobile only) */}
      <div
        style={{
          display: window.innerWidth < 768 ? "flex" : "none",
          justifyContent: "center",
          marginBottom: "20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <button
          onClick={() => navigate("/AralingPanlipunan")}
          style={{
            padding: "clamp(12px, 3vw, 16px) clamp(30px, 8vw, 50px)",
            background: "linear-gradient(135deg, #3B1A07, #1C0A00)",
            color: "#E8B84B",
            border: "3px solid #E8B84B",
            borderRadius: "15px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "clamp(1rem, 4vw, 1.2rem)",
            boxShadow: "0 5px 15px rgba(0,0,0,0.6)",
            transition: "all 0.2s ease-in-out",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontFamily: "'Cinzel', Georgia, serif",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(232,184,75,0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.6)";
          }}
        >
          ◀ Back to Home
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&display=swap');

        .history-bg-elements {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .history-float {
          position: absolute;
          font-size: 2.5rem;
          opacity: 0.08;
          animation: histFloat 20s infinite ease-in-out;
        }

        .h-f1 { top: 8%;  left: 12%; animation-delay: 0s; }
        .h-f2 { top: 55%; left: 8%;  animation-delay: 3.5s; font-size: 2rem; }
        .h-f3 { top: 15%; right: 18%; animation-delay: 1.5s; }
        .h-f4 { bottom: 18%; right: 12%; animation-delay: 4s; font-size: 3rem; }
        .h-f5 { top: 65%; right: 22%; animation-delay: 2.5s; font-size: 2rem; }
        .h-f6 { bottom: 35%; left: 22%; animation-delay: 6s; }

        @keyframes histFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%  { transform: translateY(-25px) rotate(4deg); }
          50%  { transform: translateY(-45px) rotate(-4deg); }
          75%  { transform: translateY(-20px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

export default HistoryMap;