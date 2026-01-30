import React, { useEffect, useState } from "react";
import { getAllMagicTreeProgress } from "../services/levelService";
import { useAuth } from "../context/AuthContext";
import axios from "../auth/axiosInstance";

const LEVELS_PER_CATEGORY = 15;

const LEVEL_SECTIONS = [
  { name: "BASIC", categoryId: "BASIC", gradient: "linear-gradient(135deg,#4CAF50,#45a049)" },
  { name: "NORMAL", categoryId: "NORMAL", gradient: "linear-gradient(135deg,#FF9800,#f57c00)" },
  { name: "HARD", categoryId: "HARD", gradient: "linear-gradient(135deg,#2196F3,#1976D2)" },
  { name: "ADVANCED", categoryId: "ADVANCED", gradient: "linear-gradient(135deg,#9C27B0,#7B1FA2)" },
  { name: "EXPERT", categoryId: "EXPERT", gradient: "linear-gradient(135deg,#E91E63,#C2185B)" },
];

const MagicTreeMap: React.FC = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameScore, setGameScore] = useState(0);

  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({
    BASIC: 0,
    NORMAL: 0,
    HARD: 0,
    ADVANCED: 0,
    EXPERT: 0,
  });

  // ---------------------------
  // Resolve userId
  // ---------------------------
  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
      return;
    }

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserId(Number(parsed.user_id || parsed.id));
      }
    } catch {
      setUserId(null);
    }
  }, [user]);

  // ---------------------------
  // Fetch progress + score
  // ---------------------------
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const progress = await getAllMagicTreeProgress(userId);
        setCategoryProgress(progress);

        const userRes = await axios.get(`/users/${userId}`);
        setGameScore(userRes.data.total_score ?? 0);
      } catch (err) {
        console.error("Failed loading MagicTree map", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  // ---------------------------
  // Listen for level updates
  // ---------------------------
  useEffect(() => {
    const refresh = async () => {
      if (!userId) return;
      const progress = await getAllMagicTreeProgress(userId);
      setCategoryProgress(progress);
    };

    window.addEventListener("levels:updated", refresh);
    return () => window.removeEventListener("levels:updated", refresh);
  }, [userId]);

  if (!userId) return <div>Please log in</div>;
  if (loading) return <div>Loading…</div>;

  const totalUnlocked = Object.values(categoryProgress).reduce((a, b) => a + b, 0);
  const totalLevels = LEVEL_SECTIONS.length * LEVELS_PER_CATEGORY;
  const progressPercent = Math.round((totalUnlocked / totalLevels) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(#003366,#0077cc)", padding: 20 }}>
      <h1 style={{ color: "#fff", textAlign: "center" }}>🌳 Magic Tree Map</h1>

      <p style={{ color: "#fff", textAlign: "center" }}>
        Progress: {totalUnlocked}/{totalLevels} ({progressPercent}%)
      </p>

      <div style={{ textAlign: "center", color: "#fff", marginBottom: 20 }}>
        🎯 {gameScore} Game Score
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
        {LEVEL_SECTIONS.map((section, sectionIndex) => {
          const completed = categoryProgress[section.categoryId] || 0;

          return (
            <div key={section.categoryId} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 16 }}>
              <div style={{ background: section.gradient, padding: 10, color: "#fff", borderRadius: 10 }}>
                {section.name}
              </div>

              <p style={{ color: "#fff", margin: "8px 0" }}>
                {completed} / {LEVELS_PER_CATEGORY} completed
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
                {Array.from({ length: LEVELS_PER_CATEGORY }, (_, i) => {
                  const levelNumber = i + 1;

                  // 🔑 OPTION B UNLOCK RULE
                  const isUnlocked = levelNumber <= completed + 1;

                  const globalLevel =
                    sectionIndex * LEVELS_PER_CATEGORY + levelNumber;

                  return (
                    <button
                      key={levelNumber}
                      disabled={!isUnlocked}
                      onClick={() => {
                        if (!isUnlocked) return;
                        window.location.href =
                          `/magictreescene?level=${globalLevel - 1}&category=${section.categoryId}`;
                      }}
                      style={{
                        aspectRatio: "1",
                        borderRadius: "50%",
                        border: "2px solid #fff",
                        background: isUnlocked ? section.gradient : "#555",
                        color: "#fff",
                        fontWeight: "bold",
                        opacity: isUnlocked ? 1 : 0.4,
                        cursor: isUnlocked ? "pointer" : "not-allowed",
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
    </div>
  );
};

export default MagicTreeMap;
