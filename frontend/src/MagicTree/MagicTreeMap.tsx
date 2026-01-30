import React, { useEffect, useState } from "react";
import {
  getAllMagicTreeProgress,
  hasMagicTreeCompletedAnyLevelOne,
} from "../services/levelService";
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

  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({
    BASIC: 0,
    NORMAL: 0,
    HARD: 0,
    ADVANCED: 0,
    EXPERT: 0,
  });

  const [hasCompletedLevel1, setHasCompletedLevel1] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  // ----------------------------
  // Resolve user ID
  // ----------------------------
  useEffect(() => {
    let uid: number | null = null;

    if (user?.id) {
      uid = user.id;
    } else {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          uid = Number(parsed.user_id || parsed.id);
        }
      } catch {
        uid = null;
      }
    }

    setUserId(uid);
  }, [user]);

  // ----------------------------
  // Fetch map data
  // ----------------------------
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const progress = await getAllMagicTreeProgress(userId);
        setCategoryProgress(progress);

        const completedLevel1 = await hasMagicTreeCompletedAnyLevelOne(userId);
        setHasCompletedLevel1(completedLevel1);

        const userRes = await axios.get(`/users/${userId}`);
        setGameScore(userRes.data.total_score || 0);
      } catch (err) {
        console.error("MagicTree map load failed", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  // ----------------------------
  // Listen for scene unlocks
  // ----------------------------
  useEffect(() => {
    const handler = async () => {
      if (!userId) return;

      const progress = await getAllMagicTreeProgress(userId);
      setCategoryProgress(progress);

      const completedLevel1 = await hasMagicTreeCompletedAnyLevelOne(userId);
      setHasCompletedLevel1(completedLevel1);
    };

    window.addEventListener("levels:updated", handler);
    return () => window.removeEventListener("levels:updated", handler);
  }, [userId]);

  if (!userId || loading) {
    return (
      <div style={{ color: "#fff", minHeight: "100vh", display: "grid", placeItems: "center" }}>
        Loading Magic Tree…
      </div>
    );
  }

  const totalUnlocked = Object.values(categoryProgress).reduce((a, b) => a + b, 0);
  const totalLevels = LEVEL_SECTIONS.length * LEVELS_PER_CATEGORY;
  const percent = Math.round((totalUnlocked / totalLevels) * 100);

  return (
    <div style={{ background: "#003366", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "#fff", textAlign: "center" }}>🌳 Magic Tree Map</h1>

      <p style={{ color: "#fff", textAlign: "center" }}>
        Progress: <strong>{totalUnlocked}</strong> / {totalLevels} ({percent}%)
      </p>

      {/* ✅ SCORE DISPLAY (fixes ESLint warning) */}
      <p style={{ color: "#ffd700", textAlign: "center", fontWeight: "bold" }}>
        🎯 Score: {gameScore}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 30,
          marginTop: 30,
        }}
      >
        {LEVEL_SECTIONS.map((section, catIndex) => {
          const completed = categoryProgress[section.categoryId] || 0;

          return (
            <div
              key={section.categoryId}
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: 20,
                borderRadius: 15,
              }}
            >
              <div
                style={{
                  background: section.gradient,
                  color: "#fff",
                  padding: 10,
                  borderRadius: 10,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {section.name}
              </div>

              <p style={{ color: "#fff", fontSize: 12, marginTop: 10 }}>
                {completed} / {LEVELS_PER_CATEGORY} completed
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 10,
                }}
              >
                {Array.from({ length: LEVELS_PER_CATEGORY }, (_, i) => {
                  const level = i + 1;

                  const isUnlocked =
                    level === 1
                      ? hasCompletedLevel1 || totalUnlocked === 0
                      : level <= completed + 1;

                  const globalLevel =
                    catIndex * LEVELS_PER_CATEGORY + level;

                  return (
                    <button
                      key={level}
                      disabled={!isUnlocked}
                      onClick={() =>
                        isUnlocked &&
                        (window.location.href = `/magictreescene?level=${globalLevel - 1}&category=${section.categoryId}`)
                      }
                      style={{
                        aspectRatio: "1",
                        borderRadius: "50%",
                        background: isUnlocked
                          ? section.gradient
                          : "#555",
                        color: "#fff",
                        fontWeight: "bold",
                        border: "none",
                        cursor: isUnlocked ? "pointer" : "not-allowed",
                        opacity: isUnlocked ? 1 : 0.5,
                      }}
                    >
                      {level}
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
