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
          // Normalize avatars using centralized getImageUrl
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

  if (!show) return null;

  // Medal emojis for top 3
  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  return (
    <>
      <style>{`
        .leaderboard-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          z-index: 9998;
          animation: fadeIn 0.3s ease;
        }

        .leaderboard-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 900px;
          max-height: 85vh;
          overflow-y: auto;
          z-index: 9999;
          animation: slideIn 0.4s ease;
          border-radius: 20px;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -60%);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .leaderboard-bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          border-radius: 20px;
        }

        .leaderboard-particle {
          position: absolute;
          font-size: 2rem;
          opacity: 0.1;
          animation: float 15s infinite ease-in-out;
        }

        .leaderboard-particle:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
        .leaderboard-particle:nth-child(2) { top: 60%; left: 15%; animation-delay: 2s; }
        .leaderboard-particle:nth-child(3) { top: 30%; right: 20%; animation-delay: 1s; }
        .leaderboard-particle:nth-child(4) { bottom: 20%; right: 15%; animation-delay: 3s; }
        .leaderboard-particle:nth-child(5) { top: 70%; right: 30%; animation-delay: 1.5s; }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-35px) rotate(-5deg); }
          75% { transform: translateY(-20px) rotate(3deg); }
        }

        .leaderboard-header {
          background: rgba(0, 0, 0, 0.3);
          padding: 25px 30px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(10px);
          border-radius: 20px 20px 0 0;
        }

        .leaderboard-title {
          font-size: 2rem;
          font-weight: bold;
          color: #ffffff;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.5rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .leaderboard-body {
          padding: 30px;
          position: relative;
        }

        .player-row {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 15px 20px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .player-row::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .player-row:hover::before {
          left: 100%;
        }

        .player-row:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(5px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }

        .player-row.top-3 {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          border-color: rgba(255, 215, 0, 0.5);
        }

        .rank-badge {
          min-width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: bold;
          color: white;
        }

        .player-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .player-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(255, 255, 255, 0.3);
          background: rgba(0, 0, 0, 0.2);
        }

        .player-details {
          flex: 1;
        }

        .player-name {
          font-size: 1.1rem;
          font-weight: bold;
          color: white;
          margin: 0;
        }

        .player-rank-text {
          font-size: 0.9rem;
          color: #e0f2fe;
          opacity: 0.8;
        }

        .score-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }

        .total-score {
          font-size: 1.8rem;
          font-weight: bold;
          color: #fbbf24;
          text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
        }

        .score-breakdown {
          font-size: 0.85rem;
          color: #e0f2fe;
          opacity: 0.9;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: white;
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .leaderboard-modal {
            width: 95%;
            max-height: 90vh;
          }

          .leaderboard-title {
            font-size: 1.5rem;
          }

          .player-row {
            padding: 12px 15px;
            gap: 12px;
          }

          .rank-badge {
            min-width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .player-avatar {
            width: 40px;
            height: 40px;
          }

          .player-name {
            font-size: 1rem;
          }

          .total-score {
            font-size: 1.4rem;
          }

          .score-breakdown {
            font-size: 0.75rem;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div className="leaderboard-backdrop" onClick={onClose}></div>

      {/* Modal */}
      <div className="leaderboard-modal">
        {/* Animated background elements */}
        <div className="leaderboard-bg-elements">
          <div className="leaderboard-particle">🏆</div>
          <div className="leaderboard-particle">⭐</div>
          <div className="leaderboard-particle">🎯</div>
          <div className="leaderboard-particle">💎</div>
          <div className="leaderboard-particle">👑</div>
        </div>

        {/* Header */}
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">🏆 Leaderboard</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="leaderboard-body">
          {loading ? (
            <div className="loading-spinner">
              <div>Loading leaderboard...</div>
            </div>
          ) : (
            <div>
              {players.map((player, index) => (
                <div
                  key={player.user_id}
                  className={`player-row ${index < 3 ? 'top-3' : ''}`}
                >
                  {/* Rank */}
                  <div className="rank-badge">
                    {getMedal(index) || `#${index + 1}`}
                  </div>

                  {/* Player Info */}
                  <div className="player-info">
                    {/* Avatar */}
                    {player.avatar?.startsWith("bi") ? (
                      <i
                        className={`${player.avatar} fs-1 text-info`}
                        style={{ width: "50px", textAlign: "center" }}
                      ></i>
                    ) : player.avatar ? (
                      <img
                        src={player.avatar}
                        alt="avatar"
                        className="player-avatar"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          console.error("Failed to load avatar:", player.avatar);
                        }}
                      />
                    ) : (
                      <i
                        className="bi bi-person-circle fs-1 text-light"
                        style={{ width: "50px", textAlign: "center", opacity: 0.6 }}
                      ></i>
                    )}

                    {/* Name & Rank */}
                    <div className="player-details">
                      <p className="player-name">{player.username}</p>
                      <p className="player-rank-text">{player.rank}</p>
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="score-section">
                    <div className="total-score">
                      {player.combined_score || player.total_score}
                    </div>
                    <div className="score-breakdown">
                      Game: {player.total_score} | Quiz: {player.shared_quiz_score || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LeaderboardModal;