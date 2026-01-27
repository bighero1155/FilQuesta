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
          setHasUnread(data.some((r: { read: any; }) => !r.read));
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
      case "/humanbodygame":
        return "Human Body Game";
      case "/wordwizard":
        return "Word Wizard";
      case "/magictree":
        return "Magic Tree";
      case "/history-portal":
        return "History Portal";
      default:
        return link.replace("/", "").toUpperCase();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={handleToggle}
        style={{
          position: "fixed",
          top: "50%",
          right: "20px",
          transform: "translateY(-50%)",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 1050,
          fontSize: "24px",
        }}
      >
        📬
        {hasUnread && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "14px",
              height: "14px",
              backgroundColor: "red",
              borderRadius: "50%",
              boxShadow: "0 0 8px red",
            }}
          />
        )}
      </div>

      {/* Slide Panel */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          right: open ? "100px" : "-400px",
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          width: "340px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
          transition: "right 0.4s ease",
          zIndex: 1049,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "12px 16px",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "18px",
          }}
        >
          📘 Recommendations
        </div>

        {/* Content */}
        <div style={{ padding: "15px 20px", maxHeight: "380px", overflowY: "auto" }}>
          {recommendations.length === 0 ? (
            <p className="text-muted text-center mb-2">No recommendations yet.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {recommendations.map((r) => (
                <li
                  key={r.id}
                  className="list-group-item border-0 mb-2 rounded"
                  style={{
                    backgroundColor: r.read ? "#f8f9fa" : "#eaf3ff",
                    padding: "10px 12px",
                    boxShadow: r.read
                      ? "none"
                      : "0 2px 6px rgba(0, 123, 255, 0.2)",
                  }}
                  onClick={() => {
                    navigate(r.game_link);
                    setOpen(false);
                  }}
                >
                  <span
                    className="fw-semibold"
                    style={{ color: "#007bff", cursor: "pointer" }}
                  >
                    {getGameName(r.game_link)}
                  </span>
                  {r.message && (
                    <small className="text-muted mt-1 d-block">{r.message}</small>
                  )}
                  {!r.read && (
                    <span
                      className="badge bg-danger mt-2 align-self-end"
                      style={{ alignSelf: "flex-end" }}
                    >
                      New
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 20px", borderTop: "1px solid #ddd" }}>
          <button
            className="btn btn-sm btn-outline-secondary w-100"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default RecommendationWidget;