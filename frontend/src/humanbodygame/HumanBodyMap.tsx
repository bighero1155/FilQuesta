import React, { useEffect, useState } from "react";
import { getAllCategoryProgress } from "../services/levelService";
import { useAuth } from "../context/AuthContext";
import axios from "../auth/axiosInstance";

const LEVELS_PER_CATEGORY = 15;

const LEVEL_SECTIONS = [
  { 
    name: "BASIC", 
    categoryId: "BASIC",
    subtitle: "Internal Organs",
    emoji: "🫀",
    color: "#4CAF50", 
    darkColor: "#2d5f2e",
  },
  { 
    name: "NORMAL", 
    categoryId: "NORMAL",
    subtitle: "External Parts",
    emoji: "👤",
    color: "#FF9800", 
    darkColor: "#9d5a00",
  },
  { 
    name: "HARD", 
    categoryId: "HARD",
    subtitle: "Skeleton",
    emoji: "🦴",
    color: "#2196F3", 
    darkColor: "#0d4a7a",
  },
  { 
    name: "ADVANCED", 
    categoryId: "ADVANCED",
    subtitle: "Diseases & Viruses",
    emoji: "🦠",
    color: "#9C27B0", 
    darkColor: "#5e1668",
  },
  { 
    name: "EXPERT", 
    categoryId: "EXPERT",
    subtitle: "Cells",
    emoji: "🔬",
    color: "#E91E63", 
    darkColor: "#8d1139",
  },
];

const HumanBodyMap: React.FC = () => {
  const { user } = useAuth();
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
        const progress = await getAllCategoryProgress(userId, "HumanBody", [
          "BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"
        ]);
        setCategoryProgress(progress);

        const userResponse = await axios.get(`/users/${userId}`);
        setGameScore(userResponse.data.total_score || 0);
      } catch (err) {
        console.error("Failed to load HumanBody data", err);
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
        const progress = await getAllCategoryProgress(userId, "HumanBody", [
          "BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"
        ]);
        setCategoryProgress(progress);
      } catch (err) {
        console.error("Failed to refresh HumanBody progress", err);
      }
    };

    window.addEventListener("levels:updated", handler);
    return () => {
      window.removeEventListener("levels:updated", handler);
    };
  }, [userId]);

  // Navigation functions
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
        background: "#1a1a2e",
        color: "#fff",
        fontSize: "1.2rem",
        fontFamily: "Fredoka, Arial Black, sans-serif",
      }}>
        Please log in to see the Body Explorer map.
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
        background: "#1a1a2e",
        color: "#fff",
        fontSize: "1.2rem",
        fontFamily: "Fredoka, Arial Black, sans-serif",
      }}>
        Loading Body Explorer map…
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
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "20px",
        fontFamily: "Fredoka, Arial Black, sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Decorative Background Elements */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "60px",
        height: "60px",
        background: "linear-gradient(135deg, #4CAF50, #2196F3)",
        borderRadius: "10px",
        border: "4px solid #fff",
        boxShadow: "0 4px 20px rgba(76, 175, 80, 0.5)",
      }} />
      
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        background: "linear-gradient(135deg, #E91E63, #9C27B0)",
        borderRadius: "50%",
        border: "4px solid #fff",
        boxShadow: "0 4px 20px rgba(233, 30, 99, 0.5)",
      }} />

      {/* Back Button - Top Left */}
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 100 }}>
        <button
          onClick={() => (window.location.href = "/Science")}
          style={{
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #334155, #1e293b)",
            border: "4px solid #fff",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          ◀
        </button>
      </div>

      {/* Info Button - Top Right */}
      <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 100 }}>
        <button
          style={{
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #2196F3, #1976D2)",
            border: "4px solid #fff",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            color: "#fff",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(33, 150, 243, 0.6)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          onClick={() => alert(`Body Explorer Progress\n\n${totalLevelsUnlocked}/${totalLevels} Levels Completed\nGame Score: ${gameScore}`)}
        >
          ℹ️
        </button>
      </div>

      {/* Top Decorative Bars */}
      <div style={{
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        marginTop: "10px",
        marginBottom: "20px",
      }}>
        {LEVEL_SECTIONS.map((section, i) => (
          <div
            key={i}
            style={{
              width: "clamp(40px, 8vw, 80px)",
              height: "clamp(15px, 3vw, 25px)",
              background: i === currentCategoryIndex ? section.color : "#444",
              borderRadius: "10px",
              border: "3px solid #fff",
              boxShadow: i === currentCategoryIndex 
                ? `0 4px 15px ${section.color}80` 
                : "0 2px 8px rgba(0,0,0,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={() => setCurrentCategoryIndex(i)}
          />
        ))}
      </div>

      {/* Player Card */}
      <div style={{
        background: "linear-gradient(135deg, #2d1f3d, #1a1a2e)",
        borderRadius: "20px",
        border: "5px solid #fff",
        padding: "20px",
        marginBottom: "30px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        maxWidth: "600px",
        margin: "0 auto 30px auto",
      }}>
        {/* Player Icon */}
        <div style={{
          width: "80px",
          height: "80px",
          background: "linear-gradient(135deg, #E91E63, #9C27B0)",
          borderRadius: "50%",
          border: "4px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          flexShrink: 0,
          boxShadow: "0 4px 20px rgba(233, 30, 99, 0.6)",
        }}>
          🫀
        </div>

        {/* Player Info */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: "bold",
            color: "#fff",
            textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
            marginBottom: "8px",
          }}>
            BODY EXPLORER
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
            color: "#fff",
          }}>
            <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
              {totalLevelsUnlocked}/{totalLevels} ⭐
            </span>
            <span style={{ color: "#FFD700", fontWeight: "bold" }}>
              🎯 {gameScore}
            </span>
          </div>
        </div>
      </div>

      {/* Main Carousel Container */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
      }}>
        {/* LEFT ARROW */}
        <button
          onClick={goToPrevious}
          style={{
            width: "clamp(60px, 8vw, 80px)",
            height: "clamp(60px, 8vw, 80px)",
            background: "linear-gradient(135deg, #fff, #ddd)",
            border: "5px solid #000",
            borderRadius: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(30px, 5vw, 40px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.8)";
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
            background: `linear-gradient(135deg, ${currentSection.darkColor}, #1a1a2e)`,
            borderRadius: "25px",
            border: "6px solid #fff",
            padding: "30px",
            boxShadow: `0 12px 40px ${currentSection.color}60`,
            maxWidth: "600px",
            width: "100%",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Category Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
              }}>
                {currentSection.emoji}
              </div>
              
              <div>
                <div style={{
                  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                  fontWeight: "bold",
                  color: "#fff",
                  textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}>
                  {currentSection.name}
                </div>
                <div style={{
                  fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                  color: "#bbb",
                  fontStyle: "italic",
                }}>
                  {currentSection.subtitle}
                </div>
              </div>
            </div>

            {/* Stars */}
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              {[1, 2, 3].map((star) => (
                <div
                  key={star}
                  style={{
                    width: "clamp(35px, 6vw, 45px)",
                    height: "clamp(35px, 6vw, 45px)",
                    background: star * 5 <= unlockedInCategory 
                      ? "linear-gradient(135deg, #FFD700, #FFA500)" 
                      : "#555",
                    borderRadius: "50%",
                    border: "4px solid #fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(18px, 4vw, 24px)",
                    boxShadow: star * 5 <= unlockedInCategory
                      ? "0 4px 15px rgba(255, 215, 0, 0.7)"
                      : "0 2px 8px rgba(0,0,0,0.5)",
                  }}
                >
                  ⭐
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            background: "rgba(0,0,0,0.5)",
            borderRadius: "25px",
            height: "50px",
            border: "4px solid #fff",
            overflow: "hidden",
            position: "relative",
            marginBottom: "20px",
          }}>
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${currentSection.color}, ${currentSection.darkColor})`,
                transition: "width 0.5s ease",
                boxShadow: `inset 0 -5px 15px rgba(0,0,0,0.4)`,
              }}
            />
            
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
              fontWeight: "bold",
              color: "#fff",
              textShadow: "3px 3px 6px rgba(0,0,0,0.9)",
              pointerEvents: "none",
            }}>
              {progressPercent}%
            </div>
          </div>

          {/* Level Count & Play Button */}
          <div style={{
            textAlign: "center",
          }}>
            <div style={{
              marginBottom: "20px",
              fontSize: "clamp(1rem, 3vw, 1.3rem)",
              color: "#fff",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}>
              {unlockedInCategory} / {LEVELS_PER_CATEGORY} LEVELS
            </div>

            {/* Play Button */}
            <button
              onClick={() => {
                const categoryIndex = LEVEL_SECTIONS.findIndex(s => s.categoryId === currentSection.categoryId);
                const firstLevelId = categoryIndex * LEVELS_PER_CATEGORY;
                window.location.href = `/body-systems?level=${firstLevelId}&category=${currentSection.categoryId}`;
              }}
              style={{
                padding: "clamp(12px, 3vw, 18px) clamp(30px, 6vw, 50px)",
                background: `linear-gradient(135deg, ${currentSection.color}, ${currentSection.darkColor})`,
                color: "#fff",
                border: "4px solid #fff",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
                textTransform: "uppercase",
                letterSpacing: "2px",
                boxShadow: `0 6px 25px ${currentSection.color}80`,
                transition: "all 0.2s ease",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 8px 35px ${currentSection.color}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = `0 6px 25px ${currentSection.color}80`;
              }}
            >
              ▶ PLAY
            </button>
          </div>
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={goToNext}
          style={{
            width: "clamp(60px, 8vw, 80px)",
            height: "clamp(60px, 8vw, 80px)",
            background: "linear-gradient(135deg, #fff, #ddd)",
            border: "5px solid #000",
            borderRadius: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(30px, 5vw, 40px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.8)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
          }}
        >
          ▶
        </button>
      </div>

      {/* Bottom Decorative Bars */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginTop: "30px",
        marginBottom: "20px",
        justifyContent: "center",
      }}>
        {LEVEL_SECTIONS.map((section, i) => (
          <div
            key={i}
            style={{
              width: "clamp(40px, 8vw, 80px)",
              height: "clamp(15px, 3vw, 25px)",
              background: i === currentCategoryIndex ? section.color : "#444",
              borderRadius: "10px",
              border: "3px solid #fff",
              boxShadow: i === currentCategoryIndex 
                ? `0 4px 15px ${section.color}80` 
                : "0 2px 8px rgba(0,0,0,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={() => setCurrentCategoryIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default HumanBodyMap;