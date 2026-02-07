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

      {/* OVERLAY FOR MOBILE */}
      {mobileOpen && <div className="sidebar-overlay" onClick={toggleMobile}></div>}

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
              onClick={() => {
                onNavigate("/landing");
                setMobileOpen(false);
              }}
              disabled={loading}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
          </li>

          <li>
            <button 
              className="nav-link" 
              onClick={() => {
                onProfile();
                setMobileOpen(false);
              }}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
          </li>

          <li>
            <button 
              className="nav-link" 
              onClick={() => {
                onLeaderboard();
                setMobileOpen(false);
              }}
            >
              <Trophy size={18} />
              <span>Leaderboard</span>
            </button>
          </li>

          <li>
            <button 
              className="nav-link" 
              onClick={() => {
                onProgress();
                setMobileOpen(false);
              }}
            >
              <BarChart2 size={18} />
              <span>Progress</span>
            </button>
          </li>

          <li>
            <button 
              className="nav-link" 
              onClick={() => {
                onNavigate("/Classroom");
                setMobileOpen(false);
              }}
            >
              <School size={18} />
              <span>Classroom</span>
            </button>
          </li>

          <li>
            <button
              className="nav-link"
              onClick={() => {
                setShowQuestShop(true);
                setMobileOpen(false);
              }}
            >
              <ShoppingCart size={18} />
              <span>Quest Shop</span>
            </button>
          </li>

          <li>
            <button 
              className="nav-link danger" 
              onClick={() => {
                onLogout();
                setMobileOpen(false);
              }}
            >
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
          width: 290px;
          background: linear-gradient(to bottom right, #22c1c3, #2d86fd);
          color: #fff;
          position: fixed;
          left: 0;
          top: 0;
          padding: 18px;
          display: flex;
          flex-direction: column;
          z-index: 995;
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .sidebar-header {
          font-family: 'Press Start 2P';
          font-size: 1.1rem;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .brand-text {
          display: block;
        }

        .sidebar-nav {
          list-style: none;
          padding: 0;
          margin: 0;
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sidebar-nav li {
          margin: 0;
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
          font-size: 0.82rem;
          width: 100%;
          text-align: left;
        }

        .nav-link:hover:not(:disabled) {
          background-color: rgba(255,255,255,0.15);
        }

        .nav-link:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .danger:hover:not(:disabled) {
          background-color: rgba(255,77,77,0.45);
        }

        .my-quizzes-wrapper {
          margin-top: auto;
          padding-bottom: 10px;
        }

        .profile-wrapper {
          margin-bottom: 10px;
        }

        /* ===== MOBILE TOPBAR ===== */
        .mobile-topbar {
          display: none;
        }

        .sidebar-overlay {
          display: none;
        }

        /* ===== MOBILE SIDEBAR ===== */
        @media (max-width: 768px) {
          body {
            padding-top: 0 !important;
          }

          .mobile-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(to right, #22c1c3, #2d86fd);
            padding: 14px 18px;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            color: white;
            font-family: 'Press Start 2P';
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            height: 60px;
            box-sizing: border-box;
          }

          .menu-icon-btn, 
          .shop-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
            border-radius: 6px;
          }

          .menu-icon-btn:active,
          .shop-btn:active {
            background-color: rgba(255, 255, 255, 0.1);
          }

          .topbar-title {
            margin: 0;
            font-size: 0.9rem;
            line-height: 1.4;
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1998;
            opacity: 1;
            transition: opacity 0.3s ease;
          }

          .sidebar {
            transform: translateX(-100%);
            top: 0;
            left: 0;
            width: 280px;
            height: 100vh;
            position: fixed;
            z-index: 1999;
            padding: 18px;
            padding-top: 20px;
            box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-header {
            font-size: 1rem;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.2);
          }

          .profile-wrapper {
            display: none;
          }

          .sidebar-nav {
            gap: 12px;
            margin-top: 10px;
          }

          .nav-link {
            font-size: 0.75rem;
            padding: 14px 12px;
          }

          .my-quizzes-wrapper {
            margin-top: 20px;
            padding-bottom: 20px;
          }
        }

        @media (max-width: 480px) {
          .topbar-title {
            font-size: 0.75rem;
          }

          .menu-icon-btn svg,
          .shop-btn svg {
            width: 24px;
            height: 24px;
          }

          .sidebar {
            width: 260px;
          }

          .nav-link {
            font-size: 0.7rem;
            gap: 10px;
          }

          .nav-link svg {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;