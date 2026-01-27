// src/modals/ShareQuizModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Quiz, createSharedSession } from "../services/quizService";
import { useAuth } from "../context/AuthContext";

interface ShareQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
  onShared: () => void;
}

const generateRandomCode = (length: number = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const ShareQuizModal: React.FC<ShareQuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
  onShared,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState<string>("");
  const [duration, setDuration] = useState<number>(5); // minutes
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode(generateRandomCode());
      setDuration(5);
    }
  }, [isOpen]);

  const handleStartQuiz = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // create shared session in backend
      const session = await createSharedSession(
        quiz.quiz_id!,
        user.user_id,
        duration
      );

      onShared();
      onClose();

      // navigate teacher directly to lobby
      navigate(`/sharedquiz/${session.code}/lobby`);
    } catch (err) {
      console.error("❌ Failed to create shared session:", err);
      alert("Failed to start shared quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>
          <i className="bi bi-share me-2 text-success"></i> Share Quiz
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <h5 className="fw-bold">{quiz.title}</h5>
          <p className="text-muted mb-3">
            Share this code with your students to join the quiz lobby
          </p>

          <div className="display-4 fw-bold text-success mb-3">{code}</div>

          <Form.Group>
            <Form.Label className="fw-semibold">
              Set Quiz Duration (minutes)
            </Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={180}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            <Form.Text className="text-muted">
              Students will have this much time to complete the quiz once it
              starts.
            </Form.Text>
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleStartQuiz} disabled={loading}>
          {loading ? (
            "Starting..."
          ) : (
            <>
              <i className="bi bi-play-circle me-2"></i> Start Quiz
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareQuizModal; 
