import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ Hooks MUST be called before any early return
  const handleStudentBack = useCallback(() => {
    if ("vibrate" in navigator) {
      try { navigator.vibrate(10); } catch { /* ignore on unsupported devices */ }
    }
    navigate("/Landing");
  }, [navigate]);

  const handleTeacherBack = useCallback(() => {
    if ("vibrate" in navigator) {
      try { navigator.vibrate(10); } catch { /* ignore on unsupported devices */ }
    }
    navigate("/dashboard");
  }, [navigate]);

  // Guard: don't render if no user (must come AFTER all hooks)
  if (!user) return null;

  // ─── Shared base styles ───────────────────────────────────────────────────
  const baseButtonStyle: React.CSSProperties = {
    position: "relative",
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
    zIndex: 1,
    // ✅ Cross-device interaction fixes
    touchAction: "manipulation",              // removes 300ms tap delay on mobile
    WebkitTapHighlightColor: "transparent",   // removes gray flash on iOS tap
    WebkitAppearance: "none",                 // normalizes button on Safari/iOS
    MozAppearance: "none",
    appearance: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    border: "none",
    outline: "none",
    // ✅ Prevent text selection on touch
    MozUserSelect: "none",
    msUserSelect: "none",
    // ✅ Transition only non-critical props
    transition: "transform 0.25s ease, box-shadow 0.35s ease",
    // ✅ Ensure button is always tappable — min 44x44 recommended by Apple HIG
    minHeight: "44px",
    minWidth: "44px",
  } as React.CSSProperties;

  const studentStyle: React.CSSProperties = {
    ...baseButtonStyle,
    border: "2px solid #3b82f6",
    background: "linear-gradient(135deg, #0d1b6b 0%, #1e3a8a 45%, #2563eb 100%)",
    boxShadow: "0 0 15px rgba(37, 99, 235, 0.6), inset 0 0 10px rgba(59, 130, 246, 0.4)",
  };

  const teacherStyle: React.CSSProperties = {
    ...baseButtonStyle,
    border: "2px solid #3b82f6",
    background: "linear-gradient(135deg, #0a2540 0%, #1d4ed8 45%, #3b82f6 100%)",
    boxShadow: "0 0 15px rgba(59, 130, 246, 0.6), inset 0 0 10px rgba(147, 197, 253, 0.4)",
  };

  const glowStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at center, rgba(255,255,255,0.15), transparent 70%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none", // ✅ critical — prevents glow from blocking clicks
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "16px",
    textShadow: "0 0 6px rgba(255,255,255,0.3)",
    pointerEvents: "none", // ✅ prevent text from intercepting events
  };

  const sparkleStyle: React.CSSProperties = {
    position: "absolute",
    right: "10px",
    top: "10px",
    opacity: 0.8,
    pointerEvents: "none", // ✅ prevent SVG from intercepting events
  };

  const iconWrapperStyle: React.CSSProperties = {
    pointerEvents: "none", // ✅ prevent icon from intercepting events
    display: "flex",
    alignItems: "center",
  };

  return (
    <>
      {/* ── Inject global CSS for cross-device safety ─────────────────── */}
      <style>{`
        .fq-back-btn {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }
        /* Force pointer cursor on all touch devices */
        @media (hover: none) and (pointer: coarse) {
          .fq-back-btn {
            cursor: pointer !important;
          }
        }
        /* Active state for devices that don't support hover */
        .fq-back-btn:active {
          opacity: 0.85;
          transform: scale(0.97) !important;
        }
      `}</style>

      {/* 🎮 Student Back Button */}
      {user.role === "student" && (
        <motion.button
          type="button"                      // ✅ always specify type
          className="fq-back-btn"
          onClick={handleStudentBack}
          onTouchEnd={(e) => {               // ✅ explicit touch handler for older iOS
            e.preventDefault();
            handleStudentBack();
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 25px rgba(59,130,246,0.8), 0 0 45px rgba(59,130,246,0.4)",
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={studentStyle}
          // ✅ Accessibility
          aria-label="Go back to landing page"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleStudentBack();
            }
          }}
        >
          <motion.span
            style={glowStyle}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
          <span style={iconWrapperStyle}>
            <ArrowLeft size={20} color="#a6c8ff" />
          </span>
          <span style={labelStyle}>BACK</span>
          <svg
            style={sparkleStyle}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
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
          type="button"                      // ✅ always specify type
          className="fq-back-btn"
          onClick={handleTeacherBack}
          onTouchEnd={(e) => {               // ✅ explicit touch handler for older iOS
            e.preventDefault();
            handleTeacherBack();
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.12,
            boxShadow: "0 0 40px rgba(147,197,253,0.9), 0 0 60px rgba(59,130,246,0.5)",
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 45%, #3b82f6 100%)",
          }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          style={teacherStyle}
          // ✅ Accessibility
          aria-label="Go to dashboard"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleTeacherBack();
            }
          }}
        >
          <motion.span
            style={glowStyle}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
          <span style={iconWrapperStyle}>
            <LayoutDashboard size={20} color="#bbdefb" />
          </span>
          <span style={labelStyle}>DASHBOARD</span>
          <svg
            style={sparkleStyle}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
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