// src/components/QuizCodeBox.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuizCodeBox: React.FC = () => {
  const [quizCode, setQuizCode] = useState("");
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.12)",
        padding: "22px",
        borderRadius: "18px",
        border: "2px solid rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
        textAlign: "center",
        animation: "fadeIn 0.4s ease-out",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .quiz-input:focus {
            outline: none;
            border-color: #00eaff !important;
            box-shadow: 0 0 8px #00eaff;
          }

          .quiz-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(0, 138, 255, 0.5);
          }

          .quiz-btn:active {
            transform: scale(0.97);
          }

          @media (max-width: 480px) {
            .quiz-btn {
              font-size: 13px !important;
              height: 38px !important;
            }
            .quiz-input {
              height: 38px !important;
            }
          }
        `}
      </style>

      <div style={{ fontSize: "1rem", marginBottom: "12px", opacity: 0.9 }}>
         <span style={{ color: "#00eaff" }}>Join a Class Quiz</span>
      </div>

      <input
        type="text"
        placeholder="Enter Code"
        value={quizCode}
        onChange={(e) => setQuizCode(e.target.value)}
        className="quiz-input"
        style={{
          width: "100%",
          height: "44px",
          background: "rgba(253, 252, 252, 1)",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: "10px",
          padding: "0 12px",
          color: "black",
          fontSize: "14px",
          marginBottom: "14px",
          transition: "0.2s",
        }}
      />

      <button
        onClick={() => {
          if (!quizCode.trim()) return;
          navigate(`/sharedquiz/${quizCode.trim()}/lobby`);
        }}
        className="quiz-btn"
        style={{
          width: "100%",
          height: "44px",
          background: "linear-gradient(135deg, #00eaff, #008cff)",
          border: "none",
          borderRadius: "10px",
          color: "white",
          fontSize: "15px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.25s ease",
        }}
      >
        Join Quiz →
      </button>
    </div>
  );
};

export default QuizCodeBox;
