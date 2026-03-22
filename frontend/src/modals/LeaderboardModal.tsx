import { useEffect, useState } from "react";
import axios from "../auth/axiosInstance";
import { getImageUrl } from "../services/cosmeticService";

interface LeaderboardUser {
  user_id: number;
  username: string;
  total_score: number;
  shared_quiz_score: number;
  combined_score: number;
  avatar?: string;
  rank: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
}

const LeaderboardModal = ({ show, onClose }: Props) => {
  const [players, setPlayers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      setLoading(true);
      axios
        .get("/leaderboard")
        .then((res) => {
          const normalized = res.data.map((p: LeaderboardUser) => ({
            ...p,
            avatar: getImageUrl(p.avatar),
          }));
          setPlayers(normalized);
        })
        .catch((err) => console.error("Failed to fetch leaderboard:", err))
        .finally(() => setLoading(false));
    }
  }, [show]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  const getRankGlow = (index: number): string => {
    if (index === 0) return "rgba(255, 215, 0, 0.6)";
    if (index === 1) return "rgba(192, 192, 192, 0.6)";
    if (index === 2) return "rgba(205, 127, 50, 0.6)";
    return "transparent";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

        * {
          box-sizing: border-box;
        }

        .lb-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.88);
          z-index: 9998;
          animation: lbFadeIn 0.25s ease forwards;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        @keyframes lbFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes lbSlideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -44%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @keyframes lbFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.08; }
          33% { transform: translateY(-18px) rotate(6deg); opacity: 0.12; }
          66% { transform: translateY(-30px) rotate(-4deg); opacity: 0.08; }
        }

        @keyframes lbShimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        @keyframes lbPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
          50% { box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.15); }
        }

        @keyframes lbSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .lb-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(92vw, 860px);
          max-height: min(88vh, 720px);
          z-index: 9999;
          animation: lbSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          border-radius: 24px;
          background: linear-gradient(160deg, #0f1f5c 0%, #1a3a8a 40%, #2563eb 80%, #3b82f6 100%);
          box-shadow:
            0 32px 80px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'VT323', monospace;
        }

        /* ── Decorative orbs ── */
        .lb-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .lb-orb-1 {
          width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%);
          top: -60px; right: -60px;
        }
        .lb-orb-2 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%);
          bottom: 40px; left: -40px;
        }

        /* ── Floating particles ── */
        .lb-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          border-radius: 24px;
          z-index: 0;
        }
        .lb-particle {
          position: absolute;
          font-size: 1.6rem;
          animation: lbFloat 18s ease-in-out infinite;
        }
        .lb-particle:nth-child(1) { top: 8%; left: 6%; animation-delay: 0s; }
        .lb-particle:nth-child(2) { top: 55%; left: 4%; animation-delay: 3s; }
        .lb-particle:nth-child(3) { top: 18%; right: 8%; animation-delay: 1.5s; }
        .lb-particle:nth-child(4) { bottom: 15%; right: 6%; animation-delay: 4s; }
        .lb-particle:nth-child(5) { top: 72%; right: 22%; animation-delay: 2s; }

        /* ── Header ── */
        .lb-header {
          position: relative;
          z-index: 2;
          padding: 20px 24px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.25);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          flex-shrink: 0;
        }

        .lb-title {
          font-family: 'Press Start 2P', monospace;
          font-size: clamp(0.75rem, 2.5vw, 1.1rem);
          font-weight: 400;
          color: #fff;
          margin: 0;
          letter-spacing: 0.04em;
          text-shadow: 3px 3px 0px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lb-close {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1.3rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.25s;
          flex-shrink: 0;
          line-height: 1;
          padding: 0;
        }
        .lb-close:hover {
          background: rgba(255, 255, 255, 0.22);
          transform: rotate(90deg);
        }

        /* ── Scrollable body ── */
        .lb-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px 18px 24px;
          position: relative;
          z-index: 1;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        .lb-body::-webkit-scrollbar { width: 4px; }
        .lb-body::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
        .lb-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

        /* ── Player row ── */
        .lb-row {
          position: relative;
          display: grid;
          grid-template-columns: 52px 1fr auto;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          margin-bottom: 10px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          overflow: hidden;
          cursor: default;
        }
        .lb-row:last-child { margin-bottom: 0; }

        .lb-row::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          animation: lbShimmer 3.5s ease infinite;
        }

        .lb-row:hover {
          background: rgba(255, 255, 255, 0.13);
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }

        .lb-row.top-1 {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.18), rgba(255, 165, 0, 0.12));
          border-color: rgba(255, 215, 0, 0.4);
          animation: lbPulse 3s ease-in-out infinite;
        }
        .lb-row.top-2 {
          background: linear-gradient(135deg, rgba(220, 220, 220, 0.18), rgba(180, 180, 180, 0.1));
          border-color: rgba(200, 200, 200, 0.4);
        }
        .lb-row.top-3 {
          background: linear-gradient(135deg, rgba(205, 127, 50, 0.18), rgba(160, 100, 40, 0.1));
          border-color: rgba(205, 127, 50, 0.4);
        }

        /* ── Rank badge ── */
        .lb-rank {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          border: 2px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.65rem;
          font-weight: 400;
          color: white;
          flex-shrink: 0;
        }
        .lb-rank.medal { font-size: 1.5rem; background: transparent; border-color: transparent; }

        /* ── Player info ── */
        .lb-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .lb-avatar-wrap {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.2);
        }
        .lb-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .lb-avatar-icon {
          font-size: 1.6rem;
          color: rgba(255,255,255,0.7);
          line-height: 1;
        }

        .lb-details {
          min-width: 0;
          flex: 1;
        }
        .lb-name {
          font-family: 'Press Start 2P', monospace;
          font-size: clamp(0.55rem, 1.5vw, 0.72rem);
          font-weight: 400;
          color: #fff;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.02em;
          text-shadow: 2px 2px 0px rgba(0,0,0,0.4);
        }
        .lb-rank-label {
          font-family: 'VT323', monospace;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          color: #bfdbfe;
          opacity: 0.85;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Score section ── */
        .lb-scores {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
          flex-shrink: 0;
        }
        .lb-combined {
          font-family: 'Press Start 2P', monospace;
          font-size: clamp(0.85rem, 2.5vw, 1.2rem);
          font-weight: 400;
          color: #fbbf24;
          line-height: 1;
          text-shadow: 3px 3px 0px rgba(120, 80, 0, 0.6), 0 0 12px rgba(251, 191, 36, 0.45);
          letter-spacing: 0.01em;
        }
        .lb-breakdown {
          font-family: 'VT323', monospace;
          font-size: clamp(0.85rem, 2vw, 1rem);
          color: #bfdbfe;
          opacity: 0.85;
          white-space: nowrap;
        }

        /* ── Loading ── */
        .lb-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          gap: 16px;
          color: rgba(255,255,255,0.7);
          font-family: 'VT323', monospace;
          font-size: 1.2rem;
        }
        .lb-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255,255,255,0.15);
          border-top-color: #fbbf24;
          border-radius: 50%;
          animation: lbSpin 0.8s linear infinite;
        }

        /* ── Empty state ── */
        .lb-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 180px;
          gap: 10px;
          color: rgba(255,255,255,0.5);
          font-family: 'VT323', monospace;
          font-size: 1.2rem;
        }
        .lb-empty-icon { font-size: 2.5rem; }

        /* ── Mobile tweaks ── */
        @media (max-width: 480px) {
          .lb-modal {
            width: 100vw;
            max-height: 100dvh;
            border-radius: 20px 20px 0 0;
            top: auto;
            bottom: 0;
            left: 0;
            transform: none;
            animation: lbSlideUpMobile 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          @keyframes lbSlideUpMobile {
            from { opacity: 0; transform: translateY(100%); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .lb-header { padding: 16px 16px 14px; }

          .lb-body { padding: 14px 12px 20px; }

          .lb-row {
            grid-template-columns: 40px 1fr auto;
            gap: 10px;
            padding: 12px 12px;
          }

          .lb-rank { width: 40px; height: 40px; font-size: 0.55rem; }
          .lb-rank.medal { font-size: 1.3rem; }

          .lb-avatar-wrap { width: 38px; height: 38px; }
          .lb-avatar-icon { font-size: 1.4rem; }

          .lb-info { gap: 10px; }
        }

        @media (max-width: 360px) {
          .lb-row { grid-template-columns: 36px 1fr auto; gap: 8px; padding: 10px 10px; }
          .lb-rank { width: 36px; height: 36px; font-size: 0.5rem; }
          .lb-avatar-wrap { width: 34px; height: 34px; }
        }
      `}</style>

      {/* Backdrop */}
      <div className="lb-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="lb-modal" role="dialog" aria-modal="true" aria-label="Leaderboard">
        {/* Decorative orbs */}
        <div className="lb-orb lb-orb-1" />
        <div className="lb-orb lb-orb-2" />

        {/* Floating particles */}
        <div className="lb-particles" aria-hidden="true">
          <span className="lb-particle">🏆</span>
          <span className="lb-particle">⭐</span>
          <span className="lb-particle">🎯</span>
          <span className="lb-particle">💎</span>
          <span className="lb-particle">👑</span>
        </div>

        {/* Header */}
        <div className="lb-header">
          <h2 className="lb-title">🏆 Leaderboard</h2>
          <button className="lb-close" onClick={onClose} aria-label="Close leaderboard">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="lb-body">
          {loading ? (
            <div className="lb-loading">
              <div className="lb-spinner" />
              <span>Loading leaderboard…</span>
            </div>
          ) : players.length === 0 ? (
            <div className="lb-empty">
              <span className="lb-empty-icon">📭</span>
              <span>No players yet. Be the first!</span>
            </div>
          ) : (
            players.map((player, index) => {
              const medal = getMedal(index);
              const rowClass = index === 0 ? "top-1" : index === 1 ? "top-2" : index === 2 ? "top-3" : "";

              return (
                <div
                  key={player.user_id}
                  className={`lb-row ${rowClass}`}
                  style={
                    index < 3
                      ? { boxShadow: `0 4px 20px ${getRankGlow(index)}` }
                      : undefined
                  }
                >
                  {/* Rank */}
                  <div className={`lb-rank ${medal ? "medal" : ""}`}>
                    {medal ?? `#${index + 1}`}
                  </div>

                  {/* Info */}
                  <div className="lb-info">
                    {/* Avatar */}
                    <div className="lb-avatar-wrap">
                      {player.avatar?.startsWith("bi") ? (
                        <i className={`${player.avatar} lb-avatar-icon`} />
                      ) : player.avatar ? (
                        <img
                          src={player.avatar}
                          alt={`${player.username}'s avatar`}
                          className="lb-avatar-img"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <i className="bi bi-person-circle lb-avatar-icon" />
                      )}
                    </div>

                    {/* Name & rank label */}
                    <div className="lb-details">
                      <p className="lb-name">{player.username}</p>
                      <p className="lb-rank-label">{player.rank}</p>
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="lb-scores">
                    <span className="lb-combined">
                      Total Score: {player.combined_score || player.total_score}
                    </span>
                    <span className="lb-breakdown">
                      Game Score: {player.total_score} | Quiz: {player.shared_quiz_score ?? 0}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default LeaderboardModal;