// src/components/Quizzes/RetryModal.tsx
import React from "react";

interface Option {
  option_id: number;
  option_text: string;
  is_correct?: boolean;
}

interface Question {
  question_id: number;
  question_text: string;
  question_image?: string;
  options: Option[];
}

interface RetryModalProps {
  show: boolean;
  retryQuestion: Question;
  retryIndex: number;
  totalWrong: number;
  answers: Record<number, number | string | null>;
  onAnswerChange: (questionId: number, answer: number | string) => void;
  onSubmit: () => void;
}

const RetryModal: React.FC<RetryModalProps> = ({
  show,
  retryQuestion,
  retryIndex,
  totalWrong,
  answers,
  onAnswerChange,
  onSubmit,
}) => {
  if (!show) return null;

  const isIdentification = retryQuestion.options.length === 1;

  const getImageUrl = (image?: string) =>
    image
      ? image.startsWith("http")
        ? image
        : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/storage/${image}`
      : undefined;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "#fff",
        zIndex: 2000,
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h2>❤️ Second Chance ({retryIndex + 1}/{totalWrong})</h2>
      <p className="mt-3 fs-5">Retry your wrong question!</p>

      <div
        className="card p-3 mt-4"
        style={{
          background: "rgba(255,255,255,0.95)",
          color: "#000",
          width: "80%",
          maxWidth: "600px",
          borderRadius: "12px",
        }}
      >
        <h5 className="mb-3">{retryQuestion.question_text}</h5>

        {retryQuestion.question_image && (
          <div className="mb-3">
            <img
              src={getImageUrl(retryQuestion.question_image)}
              alt="Retry Question"
              style={{
                maxHeight: "260px",
                width: "100%",
                objectFit: "contain",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        )}

        {isIdentification ? (
          <div className="d-flex flex-column gap-3 mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Type your retry answer..."
              value={
                typeof answers[retryQuestion.question_id] === "string"
                  ? (answers[retryQuestion.question_id] as string)
                  : ""
              }
              onChange={(e) =>
                onAnswerChange(retryQuestion.question_id, e.target.value)
              }
            />
          </div>
        ) : (
          retryQuestion.options.map((opt) => (
            <div
              key={opt.option_id}
              onClick={() =>
                onAnswerChange(retryQuestion.question_id, opt.option_id)
              }
              style={{
                padding: "10px",
                borderRadius: "8px",
                border:
                  answers[retryQuestion.question_id] === opt.option_id
                    ? "2px solid #4caf50"
                    : "2px solid transparent",
                backgroundColor: "rgba(0,0,0,0.05)",
                cursor: "pointer",
                marginBottom: "8px",
              }}
            >
              {opt.option_text}
            </div>
          ))
        )}

        <button className="btn btn-success mt-3" onClick={onSubmit}>
          Submit Retry
        </button>
      </div>
    </div>
  );
};

export default RetryModal;
