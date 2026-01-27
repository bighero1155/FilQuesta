import React, { useState } from "react";
import recommendationService from "../../services/recommendationService";

interface RecommendModalProps {
  teacherId: number;
  studentId: number;
  studentName: string;
  onClose: () => void;
  onSent?: () => void;
}

const RecommendModal: React.FC<RecommendModalProps> = ({
  teacherId,
  studentId,
  studentName,
  onClose,
  onSent,
}) => {
  const [selectedGame, setSelectedGame] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!selectedGame) {
      alert("Please select a game to recommend.");
      return;
    }

    setLoading(true);
    try {
      await recommendationService.create(teacherId, studentId, selectedGame, message);
      alert("✅ Recommendation sent successfully!");
      if (onSent) onSent();
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send recommendation.");
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
              backgroundColor: "#007bff",
              color: "white",
              borderBottom: "none",
            }}
          >
            <h5 className="modal-title">
              🎯 Recommend a Game for {studentName}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <label className="form-label">Select a Game</label>
            <select
              className="form-select mb-3"
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              <option value="">-- Choose Game --</option>
              <option value="/humanbodygame">Human Body Game</option>
              <option value="/wordwizardmap">Word Wizard</option>
              <option value="/MagicTree">Magic Tree</option>
              <option value="/historymap">History Portal</option>
            </select>

            <label className="form-label">Optional Message</label>
            <textarea
              className="form-control"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note or encouragement..."
            ></textarea>
          </div>

          <div className="modal-footer border-0">
            <button
              className="btn btn-primary"
              disabled={loading}
              onClick={handleRecommend}
            >
              {loading ? "Sending..." : "Send Recommendation"}
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendModal;
