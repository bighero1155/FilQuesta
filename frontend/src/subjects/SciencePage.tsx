import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

const SciencePage: React.FC = () => {
  const navigate = useNavigate();

  const handleInternalBodyClick = () => {
    navigate("/humanbodymap");
  };

  return (
    <div
      className="science-page d-flex flex-column align-items-center justify-content-center text-white position-relative"
      style={{
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "60px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        overflow: "hidden",
      }}
    >
      <BackButton to="/Landing" />
      {/* Animated background elements */}
      <div className="science-bg-elements">
        <div className="molecule molecule-1">⚛️</div>
        <div className="molecule molecule-2">🧬</div>
        <div className="molecule molecule-3">🔬</div>
        <div className="molecule molecule-4">🧪</div>
        <div className="molecule molecule-5">⚗️</div>
        <div className="molecule molecule-6">🌡️</div>
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="container text-center position-relative" style={{ zIndex: 2 }}>
        <h1 className="display-4 fw-bold mb-3 text-glow">
          🔬 Science 
        </h1>
        <p className="lead mb-5 px-3" style={{ maxWidth: "600px", margin: "0 auto" }}>
          Explore the wonders of science through fun and interactive learning games
        </p>

        <div className="row justify-content-center">
          {/* Internal Human Body Card - Centered */}
          <div className="col-md-8 col-lg-6 mb-4">
            <div
              className="game-card shadow-lg border-0 text-white position-relative"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                height: "320px",
                backgroundImage: `url('/assets/humanbody.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "all 0.4s ease",
              }}
              onClick={handleInternalBodyClick}
            >
              <div
                className="card-overlay d-flex flex-column justify-content-center align-items-center h-100 w-100"
                style={{
                  background: "linear-gradient(to bottom, rgba(102, 126, 234, 0.7), rgba(118, 75, 162, 0.8))",
                  transition: "all 0.4s ease",
                }}
              >
                <div className="emoji-icon mb-3" style={{ fontSize: "5rem" }}>
                  🫀
                </div>
                <h4 className="fw-bold mb-2" style={{ fontSize: "1.8rem" }}>
                  Internal Human Body
                </h4>
                <p className="mb-4 px-4" style={{ fontSize: "1.1rem" }}>
                  Explore organs and internal systems!
                </p>
                <button 
                  className="btn btn-light fw-semibold px-5 py-3 play-btn"
                  style={{
                    borderRadius: "30px",
                    border: "none",
                    color: "#667eea",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                  }}
                >
                  Play Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .text-glow {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3),
                       0 0 40px rgba(255, 255, 255, 0.2);
        }

        .science-bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .molecule {
          position: absolute;
          font-size: 3rem;
          opacity: 0.15;
          animation: float 20s infinite ease-in-out;
        }

        .molecule-1 {
          top: 10%;
          left: 15%;
          animation-delay: 0s;
        }

        .molecule-2 {
          top: 60%;
          left: 10%;
          animation-delay: 3s;
        }

        .molecule-3 {
          top: 20%;
          right: 20%;
          animation-delay: 1.5s;
        }

        .molecule-4 {
          bottom: 15%;
          right: 15%;
          animation-delay: 4s;
        }

        .molecule-5 {
          top: 70%;
          right: 25%;
          animation-delay: 2s;
        }

        .molecule-6 {
          bottom: 30%;
          left: 25%;
          animation-delay: 5s;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          animation: pulse 15s infinite ease-in-out;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          bottom: -150px;
          left: -150px;
          animation-delay: 3s;
        }

        .circle-3 {
          width: 250px;
          height: 250px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 1.5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) rotate(5deg);
          }
          50% {
            transform: translateY(-50px) rotate(-5deg);
          }
          75% {
            transform: translateY(-30px) rotate(3deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.05;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }

        .game-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .game-card:hover {
          transform: translateY(-15px) scale(1.03);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4) !important;
        }

        .game-card:hover .card-overlay {
          background: linear-gradient(to bottom, rgba(102, 126, 234, 0.85), rgba(118, 75, 162, 0.95));
        }

        .game-card:hover .emoji-icon {
          transform: scale(1.15) rotate(5deg);
          transition: transform 0.4s ease;
        }

        .play-btn {
          transition: all 0.3s ease;
        }

        .game-card:hover .play-btn {
          background: white !important;
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .game-card:active {
          transform: translateY(-12px) scale(1.01);
        }

        @media (max-width: 768px) {
          .molecule {
            font-size: 2rem;
          }
          
          .display-4 {
            font-size: 2.5rem;
          }

          .game-card {
            height: 280px !important;
          }

          .emoji-icon {
            font-size: 4rem !important;
          }

          h4 {
            font-size: 1.5rem !important;
          }

          .play-btn {
            font-size: 1rem !important;
            padding: 0.75rem 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SciencePage;