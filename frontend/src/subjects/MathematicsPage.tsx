import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

const MathematicsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/MagicTree");
  };

  return (
    <div
      className="mathematics-page d-flex flex-column align-items-center justify-content-center text-white position-relative"
      style={{
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "60px",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd140 100%)",
        overflow: "hidden",
      }}
    >
      <BackButton to="/Landing"/>
      {/* Animated background elements */}
      <div className="math-bg-elements">
        <div className="math-symbol symbol-1">➕</div>
        <div className="math-symbol symbol-2">➖</div>
        <div className="math-symbol symbol-3">✖️</div>
        <div className="math-symbol symbol-4">➗</div>
        <div className="math-symbol symbol-5">🔢</div>
        <div className="math-symbol symbol-6">📐</div>
        <div className="math-symbol symbol-7">📊</div>
        <div className="math-symbol symbol-8">∞</div>
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="container text-center position-relative" style={{ zIndex: 2 }}>
        <h1 className="display-4 fw-bold mb-3 text-glow">
          ➗ Mathematics 
        </h1>
        <p className="lead mb-5 px-3" style={{ maxWidth: "600px", margin: "0 auto" }}>
          Sharpen your math skills through exciting and interactive learning games
        </p>

        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 mb-4">
            <div
              className="game-card shadow-lg border-0 text-white position-relative"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                height: "280px",
                backgroundImage: `url('/assets/math-background.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "all 0.4s ease",
              }}
              onClick={handleCardClick}
            >
              <div
                className="card-overlay d-flex flex-column justify-content-center align-items-center h-100 w-100"
                style={{
                  background: "linear-gradient(to bottom, rgba(245, 87, 108, 0.7), rgba(255, 209, 64, 0.8))",
                  transition: "all 0.4s ease",
                }}
              >
                <div className="emoji-icon mb-3" style={{ fontSize: "4rem" }}>
                  🌳
                </div>
                <h4 className="fw-bold mb-2" style={{ fontSize: "1.5rem" }}>
                  Math Tree
                </h4>
                <p className="mb-3 px-4" style={{ fontSize: "0.95rem" }}>
                  Solve problems and make the magic tree grow!
                </p>
                <button 
                  className="btn btn-light fw-semibold px-4 py-2 play-btn"
                  style={{
                    borderRadius: "25px",
                    border: "none",
                    color: "#f5576c",
                    fontWeight: "600",
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

        .math-bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .math-symbol {
          position: absolute;
          font-size: 3rem;
          opacity: 0.15;
          animation: float 20s infinite ease-in-out;
          font-weight: bold;
        }

        .symbol-1 {
          top: 10%;
          left: 15%;
          animation-delay: 0s;
        }

        .symbol-2 {
          top: 60%;
          left: 10%;
          animation-delay: 3s;
        }

        .symbol-3 {
          top: 20%;
          right: 20%;
          animation-delay: 1.5s;
        }

        .symbol-4 {
          bottom: 15%;
          right: 15%;
          animation-delay: 4s;
        }

        .symbol-5 {
          top: 70%;
          right: 25%;
          animation-delay: 2s;
        }

        .symbol-6 {
          bottom: 30%;
          left: 25%;
          animation-delay: 5s;
        }

        .symbol-7 {
          top: 35%;
          left: 5%;
          animation-delay: 2.5s;
        }

        .symbol-8 {
          top: 45%;
          right: 10%;
          animation-delay: 4.5s;
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

        .game-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
        }

        .game-card:hover .card-overlay {
          background: linear-gradient(to bottom, rgba(245, 87, 108, 0.85), rgba(255, 209, 64, 0.95));
        }

        .game-card:hover .emoji-icon {
          transform: scale(1.1);
          transition: transform 0.4s ease;
        }

        .play-btn {
          transition: all 0.3s ease;
        }

        .game-card:hover .play-btn {
          background: white !important;
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .math-symbol {
            font-size: 2rem;
          }
          
          .display-4 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MathematicsPage;