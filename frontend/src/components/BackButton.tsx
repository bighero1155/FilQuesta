import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // ✅ assumes you already have this

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ current logged-in user

  if (!user) return null;

  const handleStudentBack = () => {
    if ("vibrate" in navigator) navigator.vibrate(10);
    navigate("/Landing");
  };

  const handleTeacherBack = () => {
    if ("vibrate" in navigator) navigator.vibrate(10);
    navigate("/dashboard");
  };

  const baseButtonStyle = {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "12px 28px",
    borderRadius: "18px",
    color: "#fff",
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 700,
    letterSpacing: "1px",
    cursor: "pointer",
    overflow: "hidden",
    userSelect: "none" as const,
    zIndex: 1,
    transition: "transform 0.25s ease, box-shadow 0.35s ease",
  };

  const studentStyle = {
    ...baseButtonStyle,
    border: "2px solid #3b82f6",
    background:
      "linear-gradient(135deg, #0d1b6b 0%, #1e3a8a 45%, #2563eb 100%)",
    boxShadow:
      "0 0 15px rgba(37, 99, 235, 0.6), inset 0 0 10px rgba(59, 130, 246, 0.4)",
  };

  const teacherStyle = {
    ...baseButtonStyle,
    border: "2px solid #3b82f6",
    background:
      "linear-gradient(135deg, #0a2540 0%, #1d4ed8 45%, #3b82f6 100%)",
    boxShadow:
      "0 0 15px rgba(59, 130, 246, 0.6), inset 0 0 10px rgba(147, 197, 253, 0.4)",
  };

  const glowStyle = {
    position: "absolute" as const,
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(255,255,255,0.15), transparent 70%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none" as const,
  };

  const labelStyle = {
    fontSize: "16px",
    textShadow: "0 0 6px rgba(255,255,255,0.3)",
  };

  const sparkleStyle = {
    position: "absolute" as const,
    right: "10px",
    top: "10px",
    opacity: 0.8,
    pointerEvents: "none" as const,
  };

  return (
    <>
      {/* 🎮 Student Back Button */}
      {user.role === "student" && (
        <motion.button
          onClick={handleStudentBack}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.08,
            boxShadow:
              "0 0 25px rgba(59,130,246,0.8), 0 0 45px rgba(59,130,246,0.4)",
            background:
              "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={studentStyle}
        >
          <motion.span
            style={glowStyle}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
          <ArrowLeft size={20} color="#a6c8ff" />
          <span style={labelStyle}>BACK</span>
          <svg
            style={sparkleStyle}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2v4M12 18v4M4 12h4M16 12h4"
              stroke="#60a5fa"
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}

      {/* 🧭 Teacher Dashboard Button */}
      {user.role === "teacher" && (
        <motion.button
          onClick={handleTeacherBack}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.12,
            boxShadow:
              "0 0 40px rgba(147,197,253,0.9), 0 0 60px rgba(59,130,246,0.5)",
            background:
              "linear-gradient(135deg, #1e3a8a 0%, #2563eb 45%, #3b82f6 100%)",
          }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          style={teacherStyle}
        >
          <motion.span
            style={glowStyle}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
          <LayoutDashboard size={20} color="#bbdefb" />
          <span style={labelStyle}>DASHBOARD</span>
          <svg
            style={sparkleStyle}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2v4M12 18v4M4 12h4M16 12h4"
              stroke="#93c5fd"
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </>
  );
};

export default BackButton;
