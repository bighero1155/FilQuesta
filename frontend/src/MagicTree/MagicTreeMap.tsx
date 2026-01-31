import React, { useEffect, useState } from "react";
import { getAllMagicTreeProgress } from "../services/levelService";
import { useAuth } from "../context/AuthContext";
import axios from "../auth/axiosInstance";

const LEVELS_PER_CATEGORY = 15;

const LEVEL_SECTIONS = [
  { name: "BASIC", categoryId: "BASIC", gradient: "linear-gradient(135deg, #4CAF50, #45a049)" },
  { name: "NORMAL", categoryId: "NORMAL", gradient: "linear-gradient(135deg, #FF9800, #f57c00)" },
  { name: "HARD", categoryId: "HARD", gradient: "linear-gradient(135deg, #2196F3, #1976D2)" },
  { name: "ADVANCED", categoryId: "ADVANCED", gradient: "linear-gradient(135deg, #9C27B0, #7B1FA2)" },
  { name: "EXPERT", categoryId: "EXPERT", gradient: "linear-gradient(135deg, #E91E63, #C2185B)" },
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

  // Get userId
  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    } else {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserId(parsed.user_id || parsed.id || null);
      }
    }
  }, [user]);

  // Fetch progress + score
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const progress = await getAllMagicTreeProgress(userId);
        setCategoryProgress(progress);

        const userResponse = await axios.get(`/users/${userId}`);
        setGameScore(userResponse.data.total_score || 0);
      } catch (e) {
        console.error("Failed to load MagicTree map data", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  if (!userId) return <div>Please log in</div>;
  if (loading) return <div>Loading…</div>;

  return (
    <div style={{ minHeight: "100vh", padding: 20, background: "#003366" }}>
      <h1 style={{ color: "#fff", textAlign: "center" }}>🌳 Magic Tree Map</h1>

      {/* ✅ SCORE DISPLAY */}
      <div
        style={{
          margin: "20px auto",
          maxWidth: 300,
          padding: "15px 25px",
          borderRadius: 15,
          textAlign: "center",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          border: "2px solid rgba(255,255,255,0.3)",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        <div style={{ fontSize: "1.6rem", color: "#ffd700" }}>🎯 {gameScore}</div>
        <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Game Score</div>
      </div>

      {LEVEL_SECTIONS.map((section) => {
        const unlocked = categoryProgress[section.categoryId] || 0;

        return (
          <div key={section.categoryId} style={{ marginBottom: 30 }}>
            <h2 style={{ color: "#fff" }}>{section.name}</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {Array.from({ length: LEVELS_PER_CATEGORY }, (_, i) => {
                const levelNumber = i + 1;

                // ✅ Level 1 always playable
                const isUnlocked =
                  levelNumber === 1 || levelNumber <= unlocked;

                const categoryIndex = LEVEL_SECTIONS.findIndex(
                  (s) => s.categoryId === section.categoryId
                );
                const globalLevelId = categoryIndex * LEVELS_PER_CATEGORY + levelNumber;

                return (
                  <button
                    key={levelNumber}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked) {
                        window.location.href = `/magictreescene?level=${globalLevelId - 1}&category=${section.categoryId}`;
                      }
                    }}
                    style={{
                      aspectRatio: "1",
                      borderRadius: "50%",
                      fontWeight: "bold",
                      background: isUnlocked ? section.gradient : "#555",
                      color: "#fff",
                      border: "2px solid #fff",
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                      opacity: isUnlocked ? 1 : 0.4,
                    }}
                  >
                    {levelNumber}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MagicTreeMap;
