import React from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to = "/Landing" }) => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate(to)}
        aria-label="Back"
        className="game-back-btn"
      >
        Back
      </button>

      <style>{`
        .game-back-btn {
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 9999;

          padding: 7px 16px;
          height: 36px;
          max-width: fit-content;

          border-radius: 999px;
          border: 1.5px solid rgba(255,255,255,0.6);

          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.9),
            rgba(220,255,235,0.85)
          );

          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          color: #157a55;

          box-shadow:
            0 4px 10px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.9);

          cursor: pointer;
          user-select: none;

          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            filter 0.15s ease;
        }

        /* Desktop hover (game glow) */
        @media (hover: hover) {
          .game-back-btn:hover {
            transform: translateY(-2px);
            box-shadow:
              0 8px 18px rgba(0,0,0,0.22),
              0 0 10px rgba(72, 255, 190, 0.6),
              inset 0 1px 0 rgba(255,255,255,1);
            filter: brightness(1.05);
          }
        }

        /* Mobile placement */
        @media (max-width: 768px) {
          .game-back-btn {
            top: auto;
            bottom: 92px; /* stays above Music button */
            left: 14px;

            height: 34px;
            padding: 6px 14px;
            font-size: 0.8rem;
          }
        }

        /* Press feedback (both desktop & mobile) */
        .game-back-btn:active {
          transform: translateY(0) scale(0.96);
          box-shadow:
            0 3px 8px rgba(0,0,0,0.2),
            inset 0 2px 4px rgba(0,0,0,0.15);
        }
      `}</style>
    </>
  );
};

export default BackButton;
