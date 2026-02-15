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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "20px",
        fontFamily: "Fredoka, Arial Black, sans-serif",
        position: "relative",
        overflow: "hidden",
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

      {/* Container */}
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}>
        
        {/* Back Button - Top Left */}
        <button
          onClick={() => (window.location.href = "/Science")}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
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
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          ◀
        </button>

        {/* Info Button - Top Right */}
        <button
          style={{
            position: "absolute",
            top: "0",
            right: "0",
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

        {/* Player Card */}
        <div style={{
          background: "linear-gradient(135deg, #2d1f3d, #1a1a2e)",
          borderRadius: "20px",
          border: "5px solid #fff",
          padding: "20px",
          marginTop: "80px",
          marginBottom: "30px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          gap: "20px",
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

        {/* Category Cards */}
        {LEVEL_SECTIONS.map((section) => {
          const unlockedInCategory = categoryProgress[section.categoryId] || 0;
          const progressPercent = Math.round((unlockedInCategory / LEVELS_PER_CATEGORY) * 100);

          return (
            <div
              key={section.categoryId}
              style={{
                background: `linear-gradient(135deg, ${section.darkColor}, #1a1a2e)`,
                borderRadius: "20px",
                border: "5px solid #fff",
                padding: "25px",
                marginBottom: "20px",
                boxShadow: `0 8px 30px ${section.color}40`,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = `0 12px 40px ${section.color}60`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 30px ${section.color}40`;
              }}
              onClick={() => {
                // Navigate to first level of category
                const categoryIndex = LEVEL_SECTIONS.findIndex(s => s.categoryId === section.categoryId);
                const firstLevelId = categoryIndex * LEVELS_PER_CATEGORY;
                window.location.href = `/body-systems?level=${firstLevelId}&category=${section.categoryId}`;
              }}
            >
              {/* Category Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                  }}>
                    {section.emoji}
                  </div>
                  
                  <div>
                    <div style={{
                      fontSize: "clamp(1.5rem, 4vw, 2rem)",
                      fontWeight: "bold",
                      color: "#fff",
                      textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}>
                      {section.name}
                    </div>
                    <div style={{
                      fontSize: "clamp(0.8rem, 2vw, 1rem)",
                      color: "#bbb",
                      fontStyle: "italic",
                    }}>
                      {section.subtitle}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div style={{
                  display: "flex",
                  gap: "5px",
                }}>
                  {[1, 2, 3].map((star) => (
                    <div
                      key={star}
                      style={{
                        width: "clamp(30px, 5vw, 40px)",
                        height: "clamp(30px, 5vw, 40px)",
                        background: star * 5 <= unlockedInCategory 
                          ? "linear-gradient(135deg, #FFD700, #FFA500)" 
                          : "#555",
                        borderRadius: "50%",
                        border: "3px solid #fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "clamp(16px, 3vw, 20px)",
                        boxShadow: star * 5 <= unlockedInCategory
                          ? "0 4px 15px rgba(255, 215, 0, 0.6)"
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
                background: "rgba(0,0,0,0.4)",
                borderRadius: "20px",
                height: "40px",
                border: "3px solid #fff",
                overflow: "hidden",
                position: "relative",
              }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${section.color}, ${section.darkColor})`,
                    transition: "width 0.5s ease",
                    boxShadow: `inset 0 -5px 15px rgba(0,0,0,0.3)`,
                  }}
                />
                
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "clamp(1rem, 3vw, 1.3rem)",
                  fontWeight: "bold",
                  color: "#fff",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
                  pointerEvents: "none",
                }}>
                  {progressPercent}%
                </div>
              </div>

              {/* Level Count */}
              <div style={{
                marginTop: "12px",
                fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              }}>
                {unlockedInCategory} / {LEVELS_PER_CATEGORY} LEVELS
              </div>
            </div>
          );
        })}

        {/* Decorative Bottom Bars */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginTop: "30px",
          justifyContent: "center",
        }}>
          {LEVEL_SECTIONS.map((section, i) => (
            <div
              key={i}
              style={{
                width: "clamp(40px, 8vw, 60px)",
                height: "clamp(15px, 3vw, 20px)",
                background: i === 0 ? section.color : "#444",
                borderRadius: "10px",
                border: "3px solid #fff",
                boxShadow: i === 0 ? `0 4px 15px ${section.color}80` : "0 2px 8px rgba(0,0,0,0.5)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HumanBodyMap;