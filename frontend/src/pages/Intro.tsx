import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentRegisterModal from "../modals/StudentRegisterModal";
import StudentLoginModal from "../modals/StudentLoginModal";
import FallingLeaves from "../styles/FallingLeaves";
import FilQuesta from "../styles/FilQuesta";

const QUOTES = ["Join FilQuesta and Start Learning"];

const Intro: React.FC = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [quoteIndex] = useState(0);
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const particleContainerRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const container = particleContainerRef.current;
    if (!container) return;

    const PARTICLE_COUNT = 15;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement("div");
      particle.className = "floating-particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 20 + "s";
      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach((particle) => particle.remove());
    };
  }, []);

  const handleRegistrationSuccess = (id: string) => {
    setStudentId(id);
    localStorage.setItem("eduquest_student_id", id);
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    localStorage.setItem("eduquest_logged_in", "true");
    setShowLoginModal(false);
    navigate("/landing");
  };

  const handleRoleSelection = (selectedRole: "student" | "teacher" | null) => {
    setRole(selectedRole);
  };

  return (
    <>
      <style>{`
        .floating-particle {
          position: absolute;
          width: 5px;
          height: 5px;
          background: linear-gradient(45deg, #06b6d4, #8b5cf6, #f59e0b);
          border-radius: 50%;
          opacity: 0.7;
          animation: float 25s infinite linear;
          pointer-events: none;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
        }
        .floating-particle:nth-child(odd) {
          background: linear-gradient(45deg, #10b981, #06b6d4);
          animation-duration: 30s;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        }
        .floating-particle:nth-child(3n) {
          background: linear-gradient(45deg, #f472b6, #a78bfa);
          animation-duration: 35s;
          box-shadow: 0 0 10px rgba(244, 114, 182, 0.3);
        }

        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg) translateX(0); opacity: 0; }
          10%, 90% { opacity: 0.7; }
          100% { transform: translateY(-120px) rotate(360deg) translateX(30px); opacity: 0; }
        }

        .main-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%);
          display: flex;
          align-items: stretch;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .main-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .welcome-section {
          flex: 1.2;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem 3rem;
          color: #fff;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.0)),
                      url("/assets/luzon6.jpg") center/cover no-repeat;
        }

        .action-section {
          flex: 1;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 3rem;
          position: relative;
          overflow: hidden;
        }
        .action-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("/assets/luzon6.jpg") center/cover no-repeat;
          filter: blur(12px);
          opacity: 0.35;
          z-index: 0;
        }

        .panel-inner {
          max-width: 420px;
          width: 100%;
          text-align: center;
          position: relative;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .panel-inner h2 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f13ffff;
          margin-bottom: 1rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .panel-inner p {
          color: rgba(32, 5, 150, 0.9);
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
          font-weight: 400;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
        }

        .modern-button {
          display: block;
          width: 100%;
          margin: 0.75rem 0;
          padding: 1.2rem 1.5rem;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          letter-spacing: 0.5px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }
        
        .modern-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s;
        }

        .modern-button:hover::before { left: 100%; }
        .modern-button:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25); }
        .modern-button:active { transform: translateY(-1px) scale(0.98); }

        .btn-success { background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); color: #fff; }
        .btn-warning { background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%); color: #fff; }
        .btn-primary { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%); color: #fff; }
        .btn-info { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%); color: #fff; }
        .btn-purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%); color: #fff; }

        .btn-back { 
          border: 2px solid rgba(255, 255, 255, 0.4); 
          background: rgba(255, 255, 255, 0.2); 
          color: #321cf5ff; 
          backdrop-filter: blur(10px);
          font-weight: 600;
        }
        .btn-back:hover { 
          background: rgba(255, 255, 255, 0.3); 
          border-color: rgba(255, 255, 255, 0.6); 
          color: #0e0d0dff; 
        }

        .button-icon {
          display: inline-block;
          margin-right: 10px;
          font-size: 1.3rem;
          vertical-align: middle;
          transition: transform 0.3s ease;
        }

        .modern-button:hover .button-icon { transform: scale(1.1) rotate(5deg); }

        @media (max-width: 968px) {
          .main-container { flex-direction: column; }
          .welcome-section, .action-section { flex: none; padding: 2rem; }
          .welcome-section { min-height: 40vh; }
          .panel-inner { padding: 2rem 1.5rem; margin: 1rem; }
          .panel-inner h2 { font-size: 1.8rem; }
          .modern-button { padding: 1rem 1.2rem; font-size: 1rem; }
          .floating-particle { display: none; }
        }
      `}</style>

      <div className="main-container">
        <div
          ref={particleContainerRef}
          className="absolute inset-0 pointer-events-none"
        />

        <FallingLeaves />

        <div className="welcome-section">
          <FilQuesta />
        </div>

        <div className="action-section">
          <div className="panel-inner">
            {role === null && (
              <>
                <h2>Get Started</h2>
                <p>{QUOTES[quoteIndex]}</p>
                <button
                  onClick={() => handleRoleSelection("student")}
                  className="modern-button btn-success"
                >
                  <span className="button-icon">👨‍🎓</span>Student
                </button>
                <button
                  onClick={() => handleRoleSelection("teacher")}
                  className="modern-button btn-warning"
                >
                  <span className="button-icon">👩‍🏫</span>Teacher
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="modern-button btn-back"
                >
                  <span className="button-icon">🏠</span>Home
                </button>
              </>
            )}

            {role === "student" && (
              <>
                <h2>Student Portal</h2>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="modern-button btn-primary"
                >
                  <span className="button-icon">🆕</span>Create Account
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="modern-button btn-info"
                >
                  <span className="button-icon">💾</span>Login
                </button>
                <button
                  onClick={() => handleRoleSelection(null)}
                  className="modern-button btn-back"
                >
                  <span className="button-icon">⬅️</span>Back
                </button>
              </>
            )}

            {role === "teacher" && (
              <>
                <h2>Teacher Portal</h2>
                <Link to="/login" className="modern-button btn-purple">
                  <span className="button-icon">👩‍🏫</span>Teacher Login
                </Link>
                <button
                  onClick={() => handleRoleSelection(null)}
                  className="modern-button btn-back"
                >
                  <span className="button-icon">⬅️</span>Back
                </button>
              </>
            )}
          </div>
        </div>

        {showRegisterModal && (
          <StudentRegisterModal
            onSuccess={handleRegistrationSuccess}
            onClose={() => setShowRegisterModal(false)}
          />
        )}

        {showLoginModal && (
          <StudentLoginModal
            studentId={studentId || ""}
            onSuccess={handleLoginSuccess}
            onBack={() => setShowLoginModal(false)}
            show={true}
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default Intro;