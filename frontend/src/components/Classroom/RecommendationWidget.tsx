import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserRecommendations,
  markRecommendationsRead,
} from "../../services/recommendationService";
import { useAuth } from "../../context/AuthContext";

interface Recommendation {
  id: number;
  game_link: string;
  message?: string;
  read: boolean;
}

const RecommendationWidget: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "student") return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await getUserRecommendations(user.user_id);

        const data = Array.isArray(res)
          ? res
          : Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.recommendations)
          ? res.recommendations
          : [];

        if (isMounted) {
          setRecommendations(data);
          setHasUnread(data.some((r: { read: any }) => !r.read));
        }
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  const handleToggle = async () => {
    setOpen((prev) => !prev);
    if (!open && user) {
      try {
        await markRecommendationsRead(user.user_id);
        setHasUnread(false);
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  if (!user || user.role !== "student") return null;

  const getGameName = (link: string) => {
    switch (link) {
      case "/humanbodymap":
        return "Human Body Game";
      case "/wordwizardmap":
        return "Word Wizard";
      case "/MagicTree":
        return "Magic Tree";
      case "/historymap":
        return "History Portal";
      default:
        return link.replace("/", "").toUpperCase();
    }
  };

  return (
    <>
      <style>{`
        .rec-widget-btn {
          position: fixed;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
          z-index: 1050;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .rec-widget-btn:hover {
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
        }

        .rec-widget-btn i {
          font-size: 1.6rem;
        }

        .rec-unread-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 14px;
          height: 14px;
          background-color: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 6px rgba(239, 68, 68, 0.7);
          animation: rec-pulse 1.5s infinite;
        }

        @keyframes rec-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.8; }
        }

        .rec-panel {
          position: fixed;
          top: 50%;
          right: 100px;
          transform: translateY(-50%) translateX(0);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          width: 340px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          z-index: 1049;
          overflow: hidden;
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: 1;
          pointer-events: all;
          border: 1px solid rgba(249, 115, 22, 0.2);
        }

        .rec-panel.closed {
          opacity: 0;
          transform: translateY(-50%) translateX(30px);
          pointer-events: none;
        }

        .rec-panel-header {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1rem;
        }

        .rec-panel-header i {
          font-size: 1.3rem;
        }

        .rec-panel-header-count {
          margin-left: auto;
          background: rgba(255,255,255,0.25);
          border-radius: 50px;
          padding: 2px 10px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .rec-panel-body {
          padding: 12px 16px;
          max-height: 360px;
          overflow-y: auto;
        }

        .rec-item {
          display: flex;
          flex-direction: column;
          padding: 10px 12px;
          border-radius: 12px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
          border: 1px solid transparent;
        }

        .rec-item.unread {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border-color: rgba(249, 115, 22, 0.2);
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.1);
        }

        .rec-item.read {
          background: #f8f9fa;
        }

        .rec-item:hover {
          transform: translateX(-3px);
          border-color: rgba(249, 115, 22, 0.4);
        }

        .rec-item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .rec-item-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rec-item-icon i {
          color: white;
          font-size: 1rem;
        }

        .rec-item-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.9rem;
          flex: 1;
        }

        .rec-item-badge {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border-radius: 50px;
          padding: 2px 8px;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .rec-item-message {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 5px;
          padding-left: 42px;
        }

        .rec-empty {
          text-align: center;
          padding: 2rem 1rem;
          color: #9ca3af;
        }

        .rec-empty i {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          display: block;
          color: #d1d5db;
        }

        .rec-panel-footer {
          padding: 10px 16px;
          border-top: 1px solid rgba(0,0,0,0.06);
        }

        .rec-close-btn {
          width: 100%;
          padding: 8px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .rec-close-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #374151;
        }

        @media (max-width: 576px) {
          .rec-widget-btn {
            width: 50px;
            height: 50px;
            right: 12px;
            top: auto;
            bottom: 120px;
            transform: none;
          }

          .rec-widget-btn:hover {
            transform: scale(1.1);
          }

          .rec-widget-btn i {
            font-size: 1.3rem;
          }

          .rec-panel {
            top: auto;
            bottom: 180px;
            right: 12px;
            left: 12px;
            width: auto;
            transform: none;
          }

          .rec-panel.closed {
            transform: translateY(20px);
            opacity: 0;
          }

          .rec-panel-body {
            max-height: 280px;
          }
        }
      `}</style>

      {/* Floating Button */}
      <div className="rec-widget-btn" onClick={handleToggle}>
        <i className="bi bi-lightbulb"></i>
        {hasUnread && <span className="rec-unread-dot" />}
      </div>

      {/* Slide Panel */}
      <div className={`rec-panel ${open ? "" : "closed"}`}>
        {/* Header */}
        <div className="rec-panel-header">
          <i className="bi bi-lightbulb"></i>
          Recommendations
          <span className="rec-panel-header-count">
            {recommendations.length}
          </span>
        </div>

        {/* Content */}
        <div className="rec-panel-body">
          {recommendations.length === 0 ? (
            <div className="rec-empty">
              <i className="bi bi-lightbulb"></i>
              <p className="mb-0" style={{ fontSize: "0.875rem" }}>No recommendations yet.</p>
            </div>
          ) : (
            recommendations.map((r) => (
              <div
                key={r.id}
                className={`rec-item ${r.read ? "read" : "unread"}`}
                onClick={() => {
                  navigate(r.game_link);
                  setOpen(false);
                }}
              >
                <div className="rec-item-top">
                  <div className="rec-item-icon">
                    <i className="bi bi-controller"></i>
                  </div>
                  <span className="rec-item-name">{getGameName(r.game_link)}</span>
                  {!r.read && <span className="rec-item-badge">New</span>}
                </div>
                {r.message && (
                  <div className="rec-item-message">{r.message}</div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="rec-panel-footer">
          <button className="rec-close-btn" onClick={() => setOpen(false)}>
            <i className="bi bi-x-circle"></i>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default RecommendationWidget;