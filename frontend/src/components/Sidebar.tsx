import React, { useState } from "react";
import ProfileHeader from "../pages/ProfileHeader";
import MyQuizzesWidget from "./Quizzes/MyQuizzesWidget";
import QuestShop from "../modals/QuestShop";

import {
  User,
  Trophy,
  BarChart2,
  LogOut,
  Home,
  School,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  role: string | null;
  loading: boolean;
  onProfile: () => void;
  onNavigate: (path: string) => void;
  onLeaderboard: () => void;
  onProgress: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  role,
  loading,
  onProfile,
  onNavigate,
  onLeaderboard,
  onProgress,
  onLogout,
}) => {
  const [showQuestShop, setShowQuestShop] = useState(false);
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <>
      {/* QUEST SHOP */}
      <QuestShop
        show={showQuestShop}
        onClose={() => setShowQuestShop(false)}
        user={parsedUser}
        setUser={(u) => localStorage.setItem("user", JSON.stringify(u))}
      />

      {/* MOBILE TOPBAR */}
      <div className="mobile-topbar">
        <button className="menu-icon-btn" onClick={toggleMobile}>
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <h3 className="topbar-title">FILQUESTA</h3>

        <button
          className="shop-btn"
          onClick={() => setShowQuestShop(true)}
          disabled={loading}
        >
          <ShoppingCart size={22} />
        </button>
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="brand-text">FILQUESTA</span>
        </div>

        <div className="profile-wrapper">
          <ProfileHeader />
        </div>

        <ul className="sidebar-nav">
          <li>
            <button
              className="nav-link"
              onClick={() => onNavigate("/landing")}
              disabled={loading}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
          </li>

          <li>
            <button className="nav-link" onClick={onProfile}>
              <User size={18} />
              <span>Profile</span>
            </button>
          </li>

          <li>
            <button className="nav-link" onClick={onLeaderboard}>
              <Trophy size={18} />
              <span>Leaderboard</span>
            </button>
          </li>

          <li>
            <button className="nav-link" onClick={onProgress}>
              <BarChart2 size={18} />
              <span>Progress</span>
            </button>
          </li>

          <li>
            <button className="nav-link" onClick={() => onNavigate("/Classroom")}>
              <School size={18} />
              <span>Classroom</span>
            </button>
          </li>

          <li>
            <button
              className="nav-link"
              onClick={() => setShowQuestShop(true)}
            >
              <ShoppingCart size={18} />
              <span>Quest Shop</span>
            </button>
          </li>

          <li>
            <button className="nav-link danger" onClick={onLogout}>
              <LogOut size={18} />
              <span>Quit</span>
            </button>
          </li>
        </ul>

        {role === "student" && (
          <div className="my-quizzes-wrapper">
            <MyQuizzesWidget />
          </div>
        )}
      </div>

      {/* STYLES */}
      <style>{`
        /* ===== DESKTOP SIDEBAR ===== */
        .sidebar {
          height: 100vh;
          width: 290px;  /* ⬅ increased from 250px */
          background: linear-gradient(to bottom right, #0077be, #00c2cb);
          color: #fff;
          position: fixed;
          left: 0;
          top: 0;
          padding: 18px;
          display: flex;
          flex-direction: column;
          z-index: 995;
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          font-family: 'Press Start 2P';
          font-size: 1.1rem;
          margin-bottom: 20px;
        }

        .sidebar-nav {
          list-style: none;
          padding: 0;
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 6px;
          background: none;
          border: none;
          color: white;
          font-family: 'Press Start 2P';
          cursor: pointer;
          transition: 0.2s;
          font-size: 0.82rem; /* fit long labels nicely */
        }

        .nav-link:hover {
          background-color: rgba(255,255,255,0.15);
        }

        .danger:hover {
          background-color: rgba(255,77,77,0.45);
        }

        .my-quizzes-wrapper {
          margin-top: auto;
        }

        /* ===== MOBILE TOPBAR ===== */
        .mobile-topbar {
          display: none;
        }

        /* ===== MOBILE SIDEBAR ===== */
        @media (max-width: 768px) {
          body {
            padding-top: 70px !important;
          }

          .mobile-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #0077be;
            padding: 12px 18px;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 998;
            color: white;
            font-family: 'Press Start 2P';
          }

          .menu-icon-btn, 
          .shop-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
          }

          .topbar-title {
            margin: 0;
            font-size: 1rem;
          }

          .sidebar {
            transform: translateX(-100%);
            top: 70px;
            width: 260px; /* ⬅ increased mobile drawer width */
            height: calc(100vh - 70px);
            position: fixed;
            z-index: 999;
            padding-top: 25px;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .profile-wrapper {
            display: none;
          }

          .sidebar-nav {
            gap: 18px;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
