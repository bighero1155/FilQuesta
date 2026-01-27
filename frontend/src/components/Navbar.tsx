import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  Home,
  BookOpen,
  Search,
  Users,
  PlusCircle,
  User,
} from "lucide-react";
import SharedQuizBrowserModal from "../modals/SharedQuizBrowserModal";
import TeacherProfile from "./Users/TeacherProfile";
import TeacherProfileViewModal from "./Users/TeacherProfileViewModal";
import NavbarCSS from "../styles/NavbarCSS";

const SIDEBAR_WIDTH = 280;
const TOPBAR_HEIGHT = 70;
const MOBILE_BREAKPOINT = 768;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showBrowser, setShowBrowser] = useState(false);
  const [showTeacherProfile, setShowTeacherProfile] = useState(false);
  const [activeLink, setActiveLink] = useState("/dashboard");
  const navigate = useNavigate();

  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Layout offset handling
  useEffect(() => {
    const applyLayoutOffset = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        document.body.style.paddingLeft = `${SIDEBAR_WIDTH}px`;
        document.body.style.paddingTop = "";
      } else {
        document.body.style.paddingLeft = "";
        document.body.style.paddingTop = `${TOPBAR_HEIGHT}px`;
      }
    };

    applyLayoutOffset();
    window.addEventListener("resize", applyLayoutOffset);

    return () => {
      window.removeEventListener("resize", applyLayoutOffset);
      document.body.style.paddingLeft = "";
      document.body.style.paddingTop = "";
    };
  }, []);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  return (
    <>
      <NavbarCSS />

      <nav className="nav-sidebar" role="navigation">
        {/* HEADER */}
        <div className="nav-header">
          <Link className="nav-brand" to="/dashboard">
            <img
              src="/assets/logo.png"
              alt="FilQuesta Logo"
              className="nav-logo"
            />
            <span className="nav-brand-text">FILQUESTA</span>
          </Link>
        </div>

        {/* DESKTOP TEACHER PROFILE */}
        {isTeacher && (
          <div className="nav-profile-section">
            <TeacherProfile />
          </div>
        )}

        {/* MENU */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              className={`nav-link ${
                activeLink === "/dashboard" ? "active" : ""
              }`}
              to="/dashboard"
              onClick={() => setActiveLink("/dashboard")}
            >
              <Home size={18} className="nav-link-icon" />
              <span className="nav-link-text">DASHBOARD</span>
            </Link>
          </li>

          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => setShowBrowser(true)}
            >
              <Search size={18} className="nav-link-icon" />
              <span className="nav-link-text">QUIZZES</span>
            </button>
          </li>

          {(isAdmin || isTeacher) && (
            <>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activeLink === "/QuizDashboard" ? "active" : ""
                  }`}
                  to="/QuizDashboard"
                  onClick={() => setActiveLink("/QuizDashboard")}
                >
                  <BookOpen size={18} className="nav-link-icon" />
                  <span className="nav-link-text">CREATE QUIZ</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activeLink === "/Classroom" ? "active" : ""
                  }`}
                  to="/Classroom"
                  onClick={() => setActiveLink("/Classroom")}
                >
                  <Users size={18} className="nav-link-icon" />
                  <span className="nav-link-text">CLASSROOMS</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activeLink === "/CreateClassroom" ? "active" : ""
                  }`}
                  to="/CreateClassroom"
                  onClick={() => setActiveLink("/CreateClassroom")}
                >
                  <PlusCircle size={18} className="nav-link-icon" />
                  <span className="nav-link-text">CREATE CLASS</span>
                </Link>
              </li>
            </>
          )}

          {/* 🔥 MOBILE TEACHER BUTTON → OPENS MODAL */}
          {isTeacher && (
            <li className="nav-item nav-teacher-mobile">
              <button
                className="nav-link"
                onClick={() => setShowTeacherProfile(true)}
                aria-label="Teacher Profile"
              >
                <User size={18} className="nav-link-icon" />
                <span className="nav-link-text">PROFILE</span>
              </button>
            </li>
          )}
        </ul>

        {/* LOGOUT */}
        <div className="nav-logout">
          <button className="nav-link" onClick={handleLogout}>
            <LogOut size={18} className="nav-link-icon" />
            <span className="nav-link-text">LOGOUT</span>
          </button>
        </div>
      </nav>

      {/* MODALS */}
      <SharedQuizBrowserModal
        show={showBrowser}
        onClose={() => setShowBrowser(false)}
      />

      <TeacherProfileViewModal
        show={showTeacherProfile}
        onClose={() => setShowTeacherProfile(false)}
      />
    </>
  );
};

export default Navbar;
