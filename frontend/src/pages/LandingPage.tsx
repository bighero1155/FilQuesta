import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import LeaderboardModal from "../modals/LeaderboardModal";
import GameProgressModal from "../modals/GameProgressModal";
import axios from "../auth/axiosInstance";
import LandingPageCSS from "../styles/LandingPageCSS";
import BackgroundMusic from "../components/BackgroundMusic";

interface User {
  role: string;
  [key: string]: any;
}

const QUOTES: string[] = ["Quest your way to knowledge"];

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  const [classCode, setClassCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedUser: string | null = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    try {
      const parsedUser: User = JSON.parse(storedUser);
      setRole(parsedUser.role || null);
    } catch (error) {
      console.error("Failed to parse stored user:", error);
    }
  }, [navigate]);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error: unknown) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.clear();
      navigate("/intro");
    }
  };

  const handleNavigate = (path: string): void => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 1000);
  };

  const handleProfile = (): void => {
    const storedUser: string | null = localStorage.getItem("user");
    if (storedUser) navigate("/profile");
  };

  const handleEnterCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!classCode.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get(`/shared-sessions/${classCode.trim()}`);
      if (res.data) {
        navigate(`/sharedquiz/${classCode.trim()}/lobby`);
      } else {
        setError("Invalid class code. Please try again.");
      }
    } catch (err) {
      setError("Invalid class code. Please try again.");
      console.error("Class code check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-layout">
      <LandingPageCSS />

      {/* Animated Background Elements */}
      <div className="landing-bg-elements">
        <div className="game-icon game-icon-1">🎮</div>
        <div className="game-icon game-icon-2">🏆</div>
        <div className="game-icon game-icon-3">⭐</div>
        <div className="game-icon game-icon-4">🎯</div>
        <div className="game-icon game-icon-5">🎲</div>
        <div className="game-icon game-icon-6">🎪</div>
        <div className="game-icon game-icon-7">🎨</div>
        <div className="game-icon game-icon-8">🎭</div>
        <div className="game-icon game-icon-9">🚀</div>
        <div className="game-icon game-icon-10">💎</div>
        <div className="game-icon game-icon-11">🌟</div>
        <div className="game-icon game-icon-12">🎪</div>
        <div className="game-icon game-icon-13">🎵</div>
        <div className="game-icon game-icon-14">🏅</div>
        <div className="game-icon game-icon-15">🎊</div>
        <div className="game-icon game-icon-16">🎉</div>
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <Sidebar
        role={role}
        loading={loading}
        onProfile={handleProfile}
        onNavigate={handleNavigate}
        onLeaderboard={() => setShowLeaderboard(true)}
        onProgress={() => setShowProgress(true)}
        onLogout={handleLogout}
      />

      <form className="enter-code-top" onSubmit={handleEnterCode}>
        <input
          type="text"
          placeholder="Enter Code"
          className="enter-code-input"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="enter-code-btn" disabled={loading}>
          {loading ? "Checking..." : "Join Quiz"}
        </button>
        {error && <div className="enter-code-error">{error}</div>}
      </form>

      <div className="content-area">
        {/* ✅ Title with logo */}
        <div className="main-title-wrapper">
          <img
            src="/assets/logo.png"
            alt="FilQuesta Logo"
            className="main-title-logo"
          />
          <h1 className="main-title">FILQUESTA</h1>
        </div>

        <div className="quote-carousel">{QUOTES[0]}</div>

        <div className="game-grid">
          <div className="game-card" onClick={() => handleNavigate("/Science")}>
            <img src="/assets/science.png" alt="Science" />
            <div className="game-label">Science</div>
          </div>

          <div className="game-card" onClick={() => handleNavigate("/Mathematics")}>
            <img src="/assets/mathematics.png" alt="Mathematics" />
            <div className="game-label">Mathematics</div>
          </div>

          <div className="game-card" onClick={() => handleNavigate("/English")}>
            <img src="/assets/english.png" alt="English" />
            <div className="game-label">English</div>
          </div>

          <div
            className="game-card"
            onClick={() => handleNavigate("/AralingPanlipunan")}
          >
            <img src="/assets/araling_panlipunan.png" alt="AP" />
            <div className="game-label">Araling Panlipunan</div>
          </div>
        </div>
      </div>

      <LeaderboardModal
        show={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
      <GameProgressModal
        show={showProgress}
        onClose={() => setShowProgress(false)}
      />

      {/* Background Music Player */}
      <BackgroundMusic />
    </div>
  );
};

export default LandingPage;