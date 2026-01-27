import React, { useState } from "react";
import recommendationService from "../../services/recommendationService";

interface EditRecommendationModalProps {
  recommendation: any;
  onClose: () => void;
  onUpdated?: (updated: any) => void;
}

const EditRecommendationModal: React.FC<EditRecommendationModalProps> = ({
  recommendation,
  onClose,
  onUpdated,
}) => {
  const [gameLink, setGameLink] = useState(recommendation.game_link);
  const [message, setMessage] = useState(recommendation.message || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!gameLink) {
      alert("Game link cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Pass a single object with game_link and message
      const res = await recommendationService.update(
        recommendation.recommendation_id,
        {
          game_link: gameLink,
          message,
        }
      );

      alert("✅ Recommendation updated successfully!");
      if (onUpdated) onUpdated(res.recommendation || recommendation);
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update recommendation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div
            className="modal-header"
            style={{
              backgroundColor: "#0d6efd",
              color: "white",
              borderBottom: "none",
            }}
          >
            <h5 className="modal-title">✏️ Edit Recommendation</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <label className="form-label fw-semibold text-dark">Game Link</label>
            <input
              type="text"
              className="form-control mb-3 rounded-3 shadow-sm"
              value={gameLink}
              onChange={(e) => setGameLink(e.target.value)}
              placeholder="Enter or update the game link..."
            />

            <label className="form-label fw-semibold text-dark">Message</label>
            <textarea
              className="form-control rounded-3 shadow-sm"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <div className="modal-footer border-0 d-flex justify-content-end gap-2">
            <button
              className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
              style={{
                background:
                  "linear-gradient(90deg, #007bff, #00c6ff, #43e97b)",
                border: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              disabled={loading}
              onClick={handleUpdate}
            >
              {loading ? "Updating..." : "💾 Update"}
            </button>

            <button
              className="btn btn-secondary px-4 py-2 fw-semibold shadow-sm"
              style={{
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecommendationModal;
