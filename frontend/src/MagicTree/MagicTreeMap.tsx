import React, { useEffect, useState } from "react";
import { getAllMagicTreeProgress } from "../services/levelService";
import { useAuth } from "../context/AuthContext";
import axios from "../auth/axiosInstance";

const LEVELS_PER_CATEGORY = 15;

const LEVEL_SECTIONS = [
  { 
    name: "BASIC", 
    categoryId: "BASIC",
    color: "#4CAF50", 
    gradient: "linear-gradient(135deg, #4CAF50, #45a049)" 
  },
  { 
    name: "NORMAL", 
    categoryId: "NORMAL",
    color: "#FF9800", 
    gradient: "linear-gradient(135deg, #FF9800, #f57c00)" 
  },
  { 
    name: "HARD", 
    categoryId: "HARD",
    color: "#2196F3", 
    gradient: "linear-gradient(135deg, #2196F3, #1976D2)" 
  },
  { 
    name: "ADVANCED", 
    categoryId: "ADVANCED",
    color: "#9C27B0", 
    gradient: "linear-gradient(135deg, #9C27B0, #7B1FA2)" 
  },
  { 
    name: "EXPERT", 
    categoryId: "EXPERT",
    color: "#E91E63", 
    gradient: "linear-gradient(135deg, #E91E63, #C2185B)" 
  },
];

const MagicTreeMap: React.FC = () => {
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
        // Fetch category progress
        const progress = await getAllMagicTreeProgress(userId);
        setCategoryProgress(progress);

        // Fetch user profile for game score
        const userResponse = await axios.get(`/users/${userId}`);
        setGameScore(userResponse.data.total_score || 0);
      } catch (err) {
        console.error("Failed to load MagicTree data", err);
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
      
      // Refresh category progress when levels are updated
      try {
        const progress = await getAllMagicTreeProgress(userId);
        setCategoryProgress(progress);
      } catch (err) {
        console.error("Failed to refresh MagicTree progress", err);
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
        background: "linear-gradient(180deg, #003366 0%, #0077cc 100%)",
        color: "#fff",
        fontSize: "1.2rem"
      }}>
        Please log in to see the Magic Tree map.
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
        background: "linear-gradient(180deg, #003366 0%, #0077cc 100%)",
        color: "#fff",
        fontSize: "1.2rem"
      }}>
        Loading Magic Tree map…
      </div>
    );
  }

  // Calculate total progress
  const totalLevelsUnlocked = Object.values(categoryProgress).reduce((sum, val) => sum + val, 0);
  const totalLevels = LEVEL_SECTIONS.length * LEVELS_PER_CATEGORY;
  const progressPercentage = Math.round((totalLevelsUnlocked / totalLevels) * 100);

  return (
    <div
      style={{
        textAlign: "center",
        background: "linear-gradient(180deg, #003366 0%, #0077cc 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        overflowX: "hidden",
      }}
    >
      {/* Title */}
      <h1
        style={{
          color: "#fff",
          fontSize: "clamp(2rem, 5vw, 2.5rem)",
          marginBottom: "10px",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          fontFamily: "Fredoka, Arial Black, sans-serif",
        }}
      >
        🌳 Magic Tree Map
      </h1>
      
      {/* Progress Info */}
      <p
        style={{
          color: "#e0e0e0",
          fontSize: "clamp(1rem, 3vw, 1.1rem)",
          marginBottom: "10px",
        }}
      >
        Progress: <strong>{totalLevelsUnlocked}</strong> / {totalLevels} levels unlocked ({progressPercentage}%)
      </p>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "30px",
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "15px",
          overflow: "hidden",
          marginBottom: "20px",
          border: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercentage}%`,
            background: "linear-gradient(90deg, #4CAF50, #2196F3, #9C27B0)",
            transition: "width 0.5s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "10px",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          {progressPercentage > 15 && `${progressPercentage}%`}
        </div>
      </div>

      {/* Score Display */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            padding: "15px 30px",
            borderRadius: "15px",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            minWidth: "150px",
          }}
        >
          <div style={{ color: "#ffd700", fontSize: "1.5rem", fontWeight: "bold" }}>
            🎯 {gameScore}
          </div>
          <div style={{ color: "#fff", fontSize: "0.9rem", marginTop: "5px" }}>
            Game Score
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "30px",
          maxWidth: "1400px",
          width: "100%",
          marginBottom: "30px",
        }}
      >
        {LEVEL_SECTIONS.map((section) => {
          const unlockedInCategory = categoryProgress[section.categoryId] || 0;
          const sectionProgress = Math.round((unlockedInCategory / LEVELS_PER_CATEGORY) * 100);

          // Generate level buttons for this category
          const levelButtons = Array.from({ length: LEVELS_PER_CATEGORY }, (_, i) => {
            const levelNumber = i + 1;
            
            // ✅ YOUR CURRENT UNLOCKING LOGIC: Level 1 always playable, others unlock sequentially
            const isUnlocked = levelNumber === 1 || levelNumber <= unlockedInCategory;

            return {
              levelNumber,
              isUnlocked,
            };
          });

          return (
            <div
              key={section.categoryId}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "15px",
                padding: "20px",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* Section Header */}
              <div
                style={{
                  background: section.gradient,
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  fontWeight: "bold",
                  fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                {section.name}
              </div>

              {/* Section Progress */}
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#fff",
                  marginBottom: "15px",
                  opacity: 0.9,
                }}
              >
                {unlockedInCategory} / {LEVELS_PER_CATEGORY} completed ({sectionProgress}%)
              </div>

              {/* Level Buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "10px",
                }}
              >
                {levelButtons.map((lvl) => {
                  // Calculate the global level ID for navigation
                  const categoryIndex = LEVEL_SECTIONS.findIndex(s => s.categoryId === section.categoryId);
                  const globalLevelId = (categoryIndex * LEVELS_PER_CATEGORY) + lvl.levelNumber;

                  return (
                    <button
                      key={lvl.levelNumber}
                      disabled={!lvl.isUnlocked}
                      onClick={() => {
                        if (lvl.isUnlocked) {
                          // Navigate with global level ID (for backend compatibility)
                          window.location.href = `/magictreescene?level=${globalLevelId - 1}&category=${section.categoryId}`;
                        }
                      }}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        maxWidth: "60px",
                        borderRadius: "50%",
                        background: lvl.isUnlocked
                          ? section.gradient
                          : "radial-gradient(circle at top left, #777, #444)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "clamp(14px, 3vw, 16px)",
                        border: lvl.isUnlocked ? "3px solid #fff" : "2px solid #666",
                        cursor: lvl.isUnlocked ? "pointer" : "not-allowed",
                        boxShadow: lvl.isUnlocked
                          ? "0 4px 10px rgba(0,0,0,0.4)"
                          : "0 2px 5px rgba(0,0,0,0.3)",
                        transition: "all 0.2s ease",
                        opacity: lvl.isUnlocked ? 1 : 0.5,
                        margin: "0 auto",
                      }}
                      onMouseOver={(e) => {
                        if (lvl.isUnlocked) {
                          e.currentTarget.style.transform = "scale(1.15)";
                          e.currentTarget.style.boxShadow = "0 6px 15px rgba(255,255,255,0.4)";
                        }
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = lvl.isUnlocked
                          ? "0 4px 10px rgba(0,0,0,0.4)"
                          : "0 2px 5px rgba(0,0,0,0.3)";
                      }}
                    >
                      {lvl.levelNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        <button
          onClick={() => (window.location.href = "/Mathematics")}
          style={{
            padding: "14px 28px",
            backgroundColor: "#0044aa",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "clamp(16px, 3vw, 18px)",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            transition: "all 0.2s ease-in-out",
            minWidth: "180px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#0066ff";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#0044aa";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ⬅️ Back to Home
        </button>
      </div>
    </div>
  );
};

export default MagicTreeMap;