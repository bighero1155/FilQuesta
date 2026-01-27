import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center min-vh-100 position-relative"
      style={{
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #209cff 50%, #68e0cf 75%, #a8edea 100%)",
        backgroundSize: "400% 400%",
        animation: "oceanWave 8s ease-in-out infinite",
      }}
    >
      {/* Main content */}
      <div className="text-center text-white position-relative z-index-1">
        <h1
          className="display-1 fw-bold mb-3"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            fontSize: "clamp(3rem, 8vw, 8rem)",
          }}
        >
          404
        </h1>

        <h2
          className="h3 mb-4 fw-light"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
        >
          Lost in the Digital Void
        </h2>

        <p
          className="lead mb-5 px-3"
          style={{
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            maxWidth: "600px",
            margin: "0 auto 2rem auto",
          }}
        >
          The page you're looking for has drifted away like a message in a
          bottle. Let's navigate you back to safe lands.
        </p>

        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <Link
            to="/landing"
            className="btn btn-lg px-4 py-3 fw-semibold text-decoration-none"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              color: "#2c5aa0",
              border: "none",
              borderRadius: "50px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
            }}
          >
            🏠 Return to Dashboard
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes oceanWave {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
