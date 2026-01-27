// src/pages/StudentProfile.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../auth/axiosInstance";
import { getImageUrl } from "../services/cosmeticService";

import Sidebar from "../components/Sidebar";
import LeaderboardModal from "../modals/LeaderboardModal";
import GameProgressModal from "../modals/GameProgressModal";
import EditProfileModal from "../modals/EditProfileModal";
import ProfileHeader from "./ProfileHeader";
import QuizCodeBox from "../components/QuizCodeBox";
import StudentProfileCSS from "../styles/StudentProfileCSS";

export interface UserProfile {
  user_id: number;
  username: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  age?: string;
  section?: string;
  role?: string;
  avatar?: string;
  coins: number;
  total_score: number;
  rank: string;
}

interface LevelProgress {
  id: number;
  game_name: string;
  unlocked_levels: number;
}

interface QuickQuizResult {
  submission_id: number;
  quiz_title: string;
  score: number;
  total: number;
}

interface SharedQuizResult {
  participant_id: number;
  quiz_title: string;
  score: number;
  total: number;
}

const normalizeArray = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (payload.data && Array.isArray(payload.data)) return payload.data;
  if (payload.results && Array.isArray(payload.results)) return payload.results;
  return [];
};

const getRankByCoins = (coins: number): string => {
  if (coins >= 1000) return "Legend";
  if (coins >= 500) return "Elite";
  if (coins >= 250) return "Adventurer";
  if (coins >= 100) return "Apprentice";
  return "Beginner";
};

const StudentProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [games, setGames] = useState<LevelProgress[]>([]);
  const [quickQuizzes, setQuickQuizzes] = useState<QuickQuizResult[]>([]);
  const [sharedQuizzes, setSharedQuizzes] = useState<SharedQuizResult[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.fontFamily = "'Press Start 2P', cursive";
    return () => {
      document.body.style.fontFamily = "";
    };
  }, []);

  const loadProfile = useCallback(async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }

    try {
      const parsedUser: any = JSON.parse(storedUser);
      
      // Use getImageUrl for avatar normalization
      parsedUser.avatar = getImageUrl(parsedUser.avatar);
      parsedUser.rank = getRankByCoins(parsedUser.coins ?? 0);
      
      // Try to fetch fresh avatar from API
      try {
        const freshUserResponse = await axios.get(`/users/${parsedUser.user_id}`);
        if (freshUserResponse.data && freshUserResponse.data.avatar) {
          // API response already has normalized avatar from userService
          parsedUser.avatar = freshUserResponse.data.avatar;
          
          // Update localStorage with fresh avatar
          const storedData = JSON.parse(storedUser);
          storedData.avatar = freshUserResponse.data.avatar;
          localStorage.setItem("user", JSON.stringify(storedData));
        }
      } catch (apiError) {
        console.error('Failed to fetch fresh user data:', apiError);
      }
      
      setUser(parsedUser);

      // Fetch quick + shared quizzes separately
      const [levelsRes, quickQuizRes, sharedQuizRes] =
        await Promise.allSettled([
          axios.get(`/users/${parsedUser.user_id}/levels`),
          axios.get(`/quiz-results`),
          axios.get(`/shared-quiz-results`),
        ]);

      if (levelsRes.status === "fulfilled") {
        setGames(normalizeArray(levelsRes.value.data));
      }

      if (quickQuizRes.status === "fulfilled") {
        setQuickQuizzes(normalizeArray(quickQuizRes.value.data));
      }

      if (sharedQuizRes.status === "fulfilled") {
        setSharedQuizzes(normalizeArray(sharedQuizRes.value.data));
      }
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Listen for storage changes (e.g., when avatar is updated from cosmetics shop)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" && e.newValue) {
        loadProfile();
      }
    };

    const handleCustomStorage = () => {
      loadProfile();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storage", handleCustomStorage);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage", handleCustomStorage);
    };
  }, [loadProfile]);

  if (loading)
    return <p className="text-center mt-4 text-white">Loading profile...</p>;
  if (!user)
    return <p className="text-center mt-4 text-white">User not found.</p>;

  const fullName =
    [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(" ") || "N/A";

  return (
    <>
      <StudentProfileCSS />

      <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        <Sidebar
          role={user.role || null}
          loading={loading}
          onProfile={() => navigate("/profile")}
          onNavigate={(path) => navigate(path)}
          onLeaderboard={() => setShowLeaderboard(true)}
          onProgress={() => setShowProgress(true)}
          onLogout={() => {
            localStorage.clear();
            navigate("/");
          }}
        />

        <div className="student-profile">
          {/* Animated Background Elements */}
          <div className="profile-bg-elements">
            <div className="profile-icon profile-icon-1">👤</div>
            <div className="profile-icon profile-icon-2">🎖️</div>
            <div className="profile-icon profile-icon-3">📊</div>
            <div className="profile-icon profile-icon-4">🎯</div>
            <div className="profile-icon profile-icon-5">🏆</div>
            <div className="profile-icon profile-icon-6">⭐</div>
            <div className="profile-icon profile-icon-7">💎</div>
            <div className="profile-icon profile-icon-8">🎓</div>
            <div className="profile-icon profile-icon-9">📈</div>
            <div className="profile-icon profile-icon-10">🪙</div>
            <div className="profile-icon profile-icon-11">🎨</div>
            <div className="profile-icon profile-icon-12">🌟</div>
            <div className="profile-icon profile-icon-13">🏅</div>
            <div className="profile-icon profile-icon-14">✨</div>
            <div className="profile-icon profile-icon-15">💪</div>
            <div className="profile-icon profile-icon-16">🎊</div>
            <div className="profile-bg-circle profile-bg-circle-1"></div>
            <div className="profile-bg-circle profile-bg-circle-2"></div>
            <div className="profile-bg-circle profile-bg-circle-3"></div>
          </div>

          <div
            style={{
              maxWidth: "1200px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              position: "relative",
              zIndex: 5,
            }}
          >
            {/* TOP GRID */}
            <div className="profile-grid">
              {[
                { icon: "🪙", label: "Coins", value: user.coins },
                { icon: "🎯", label: "Score", value: user.total_score },
                { icon: "🏆", label: "Rank", value: user.rank },
              ].map((stat, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">{stat.value}</div>
                </div>
              ))}

              <div
                className="profile-header-card"
                onClick={() => setShowInfo(!showInfo)}
              >
                <ProfileHeader
                  avatarSize={140}
                  badgeSize={45}
                  nickFrameSize={40}
                  textSize={28}
                  userData={{
                    user_id: user.user_id,
                    username: user.username,
                    avatar: user.avatar,
                  }}
                  skipAvatarFetch={true}
                />
              </div>
            </div>

            <QuizCodeBox />

            {/* EDIT INFO */}
            <div className={`collapse-box ${showInfo ? "open" : ""}`}>
              <div
                className="collapse-content"
                style={{ padding: showInfo ? "1.5rem" : "0 1.5rem" }}
              >
                <p>Full Name: {fullName}</p>
                <p>Age: {user.age || "N/A"}</p>
                <p>Section: {user.section || "N/A"}</p>
                <p>Role: {user.role || "student"}</p>

                <button
                  className="btn btn-outline-light rounded-pill px-4 mt-2"
                  onClick={() => setShowEditModal(true)}
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </div>

            {/* 🎮 GAME CARDS */}
            <div className="pill-section">
              <h4>🎮 Games</h4>
              <div className="pill-grid">
                {games.length === 0 ? (
                  <div style={{ 
                    gridColumn: "1 / -1", 
                    textAlign: "center", 
                    padding: "2rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px"
                  }}>
                    No game progress yet.
                  </div>
                ) : (
                  games.map((g) => (
                    <div key={g.id} className="stat-card">
                      <div className="stat-label">{g.game_name}</div>
                      <div className="stat-value">
                        {g.unlocked_levels} Levels
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ⚡ QUICK QUIZZES */}
            <div className="pill-section">
              <h4>⚡ Quick Quizzes</h4>
              <div className="pill-grid">
                {quickQuizzes.length === 0 ? (
                  <div style={{ 
                    gridColumn: "1 / -1", 
                    textAlign: "center", 
                    padding: "2rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px"
                  }}>
                    No quick quizzes completed yet.
                  </div>
                ) : (
                  quickQuizzes.map((q) => (
                    <div key={q.submission_id} className="stat-card">
                      <div className="stat-label">{q.quiz_title}</div>
                      <div className="stat-value">
                        {q.score} / {q.total}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 🏁 SHARED QUIZZES */}
            <div className="pill-section">
              <h4>🏁 Shared Quizzes</h4>
              <div className="pill-grid">
                {sharedQuizzes.length === 0 ? (
                  <div style={{ 
                    gridColumn: "1 / -1", 
                    textAlign: "center", 
                    padding: "2rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px"
                  }}>
                    No shared quizzes completed yet.
                  </div>
                ) : (
                  sharedQuizzes.map((q) => (
                    <div key={q.participant_id} className="stat-card">
                      <div className="stat-label">{q.quiz_title}</div>
                      <div className="stat-value">
                        {q.score} / {q.total}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {user && (
            <EditProfileModal
              show={showEditModal}
              onClose={() => setShowEditModal(false)}
              user={user}
              setUser={setUser}
            />
          )}
          <LeaderboardModal
            show={showLeaderboard}
            onClose={() => setShowLeaderboard(false)}
          />
          <GameProgressModal
            show={showProgress}
            onClose={() => setShowProgress(false)}
          />
        </div>
      </div>
    </>
  );
};

export default StudentProfile;