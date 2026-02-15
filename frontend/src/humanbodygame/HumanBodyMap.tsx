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


      {/* Back Button - Top Left (Desktop only, hidden on mobile) */}
      <div style={{ 
        position: "absolute", 
        top: "20px", 
        left: "20px", 
        zIndex: 100,
        display: window.innerWidth < 768 ? "none" : "block",
      }}>
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



      {/* Player Card */}
      <div style={{
        background: "linear-gradient(135deg, #2d1f3d, #1a1a2e)",
        borderRadius: "20px",
        border: "5px solid #fff",
        padding: "clamp(15px, 3vw, 20px)",
        marginBottom: "30px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        gap: "clamp(10px, 3vw, 20px)",
        maxWidth: "clamp(320px, 90%, 600px)",
        margin: "0 auto 30px auto",
      }}>
        {/* Player Icon */}
        <div style={{
          width: "clamp(60px, 15vw, 80px)",
          height: "clamp(60px, 15vw, 80px)",
          background: "linear-gradient(135deg, #E91E63, #9C27B0)",
          borderRadius: "50%",
          border: "4px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(30px, 8vw, 40px)",
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
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%",
      }}>
        {/* LEFT ARROW */}
        <button
          onClick={goToPrevious}
          style={{
            width: "clamp(50px, 10vw, 80px)",
            height: "clamp(50px, 10vw, 80px)",
            background: "linear-gradient(135deg, #fff, #ddd)",
            border: "clamp(3px, 0.5vw, 5px) solid #000",
            borderRadius: "clamp(10px, 2vw, 15px)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(24px, 5vw, 40px)",
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
            borderRadius: "clamp(15px, 3vw, 25px)",
            border: "clamp(4px, 0.8vw, 6px) solid #fff",
            padding: "clamp(20px, 4vw, 30px)",
            boxShadow: `0 12px 40px ${currentSection.color}60`,
            maxWidth: "clamp(320px, 90%, 800px)",
            width: "100%",
            minHeight: "clamp(350px, 60vh, 450px)",
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
            marginBottom: "clamp(10px, 2vw, 20px)",
            flexWrap: "wrap",
            gap: "10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 2vw, 15px)" }}>
              <div style={{
                fontSize: "clamp(2rem, 8vw, 4rem)",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
              }}>
                {currentSection.emoji}
              </div>
              
              <div>
                <div style={{
                  fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
                  fontWeight: "bold",
                  color: "#fff",
                  textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                  textTransform: "uppercase",
                  letterSpacing: "clamp(1px, 0.3vw, 2px)",
                }}>
                  {currentSection.name}
                </div>
                <div style={{
                  fontSize: "clamp(0.8rem, 2.5vw, 1.1rem)",
                  color: "#bbb",
                  fontStyle: "italic",
                }}>
                  {currentSection.subtitle}
                </div>
              </div>
            </div>

            {/* Stars - REMOVED */}
          </div>

          {/* Level Grid (1-15) - BIGGER BUTTONS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "clamp(10px, 2.5vw, 16px)",
            marginBottom: "25px",
            padding: "0 clamp(15px, 4vw, 25px)",
            maxWidth: "clamp(350px, 95%, 650px)",
            margin: "0 auto 25px auto",
          }}>
            {Array.from({ length: LEVELS_PER_CATEGORY }, (_, i) => {
              const levelNumber = i + 1;
              const isUnlocked = levelNumber === 1 || levelNumber <= unlockedInCategory;
              const categoryIndex = LEVEL_SECTIONS.findIndex(s => s.categoryId === currentSection.categoryId);
              const globalLevelId = (categoryIndex * LEVELS_PER_CATEGORY) + levelNumber;

              return (
                <button
                  key={levelNumber}
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      window.location.href = `/body-systems?level=${globalLevelId - 1}&category=${currentSection.categoryId}`;
                    }
                  }}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "50%",
                    background: isUnlocked
                      ? `linear-gradient(135deg, ${currentSection.color}, ${currentSection.darkColor})`
                      : "radial-gradient(circle at top left, #555, #333)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "clamp(16px, 4vw, 20px)",
                    border: isUnlocked ? "4px solid #fff" : "3px solid #444",
                    cursor: isUnlocked ? "pointer" : "not-allowed",
                    boxShadow: isUnlocked
                      ? `0 5px 15px ${currentSection.color}80`
                      : "0 3px 8px rgba(0,0,0,0.5)",
                    transition: "all 0.2s ease",
                    opacity: isUnlocked ? 1 : 0.4,
                    padding: "0",
                    minWidth: "44px",
                    minHeight: "44px",
                    width: "100%",
                  }}
                  onMouseOver={(e) => {
                    if (isUnlocked) {
                      e.currentTarget.style.transform = "scale(1.15)";
                      e.currentTarget.style.boxShadow = `0 8px 20px ${currentSection.color}`;
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = isUnlocked
                      ? `0 5px 15px ${currentSection.color}80`
                      : "0 3px 8px rgba(0,0,0,0.5)";
                  }}
                >
                  {levelNumber}
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div style={{
            background: "rgba(0,0,0,0.5)",
            borderRadius: "clamp(15px, 3vw, 25px)",
            height: "clamp(40px, 8vw, 50px)",
            border: "clamp(3px, 0.6vw, 4px) solid #fff",
            overflow: "hidden",
            position: "relative",
            marginBottom: "clamp(15px, 3vw, 20px)",
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
              fontSize: "clamp(1rem, 4vw, 1.6rem)",
              fontWeight: "bold",
              color: "#fff",
              textShadow: "3px 3px 6px rgba(0,0,0,0.9)",
              pointerEvents: "none",
            }}>
              {progressPercent}%
            </div>
          </div>

          {/* Level Count & Play/Continue Button */}
          <div style={{
            textAlign: "center",
          }}>
            <div style={{
              marginBottom: "clamp(10px, 2vw, 15px)",
              fontSize: "clamp(0.9rem, 3vw, 1.2rem)",
              color: "#fff",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}>
              {unlockedInCategory} / {LEVELS_PER_CATEGORY} LEVELS
            </div>

            {/* Play/Continue Button - Dynamic Text */}
            <button
              onClick={() => {
                const categoryIndex = LEVEL_SECTIONS.findIndex(s => s.categoryId === currentSection.categoryId);
                const firstLevelId = categoryIndex * LEVELS_PER_CATEGORY;
                window.location.href = `/body-systems?level=${firstLevelId}&category=${currentSection.categoryId}`;
              }}
              style={{
                padding: "clamp(10px, 2.5vw, 18px) clamp(25px, 6vw, 50px)",
                background: `linear-gradient(135deg, ${currentSection.color}, ${currentSection.darkColor})`,
                color: "#fff",
                border: "clamp(3px, 0.6vw, 4px) solid #fff",
                borderRadius: "clamp(15px, 3vw, 20px)",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "clamp(1rem, 4vw, 1.6rem)",
                textTransform: "uppercase",
                letterSpacing: "clamp(1px, 0.3vw, 2px)",
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
              ▶ {unlockedInCategory > 1 ? "CONTINUE" : "PLAY"}
            </button>
          </div>
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={goToNext}
          style={{
            width: "clamp(50px, 10vw, 80px)",
            height: "clamp(50px, 10vw, 80px)",
            background: "linear-gradient(135deg, #fff, #ddd)",
            border: "clamp(3px, 0.5vw, 5px) solid #000",
            borderRadius: "clamp(10px, 2vw, 15px)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(24px, 5vw, 40px)",
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

      {/* Back Button - Bottom (Mobile only, hidden on desktop) */}
      <div style={{
        display: window.innerWidth < 768 ? "flex" : "none",
        justifyContent: "center",
        marginBottom: "20px",
      }}>
        <button
          onClick={() => (window.location.href = "/Science")}
          style={{
            padding: "clamp(12px, 3vw, 16px) clamp(30px, 8vw, 50px)",
            background: "linear-gradient(135deg, #334155, #1e293b)",
            color: "#fff",
            border: "4px solid #fff",
            borderRadius: "15px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "clamp(1rem, 4vw, 1.2rem)",
            boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
            transition: "all 0.2s ease-in-out",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.7)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.5)";
          }}
        >
          ◀ Back to Science
        </button>
      </div>
    </div>
  );
};

export default HumanBodyMap;