// src/modals/ViewQuizModal.tsx
import React from "react";
import { Quiz } from "../services/quizService";
import { getImageUrl } from "../services/cosmeticService";

interface ViewQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
}

const ViewQuizModal: React.FC<ViewQuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header bg-info text-white">
              <h1 className="modal-title fs-5 d-flex align-items-center">
                <i className="bi bi-eye me-2"></i>
                Quiz Preview
              </h1>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {/* Quiz Header Info */}
              <div className="mb-4">
                <div className="card border-0 bg-light shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="card-title text-primary mb-3 d-flex align-items-center">
                      <i className="bi bi-journal-text me-2"></i>
                      {quiz.title}
                    </h3>
                    <p className="card-text text-muted mb-3" style={{ fontSize: '0.95rem' }}>
                      {quiz.description || (
                        <em className="text-muted">
                          No description provided
                        </em>
                      )}
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.85rem' }}>
                        <i className="bi bi-question-circle me-1"></i>
                        {quiz.questions?.length || 0} Questions
                      </span>
                      <span className="badge bg-success px-3 py-2" style={{ fontSize: '0.85rem' }}>
                        <i className="bi bi-check-circle me-1"></i>
                        Ready to Use
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              {quiz.questions && quiz.questions.length > 0 ? (
                <div>
                  <h5 className="text-primary mb-4 d-flex align-items-center">
                    <i className="bi bi-list-ol me-2"></i>
                    Questions & Answers
                  </h5>

                  <div className="questions-preview">
                    {quiz.questions.map((q, qIndex) => (
                      <div key={qIndex} className="card mb-4 border shadow-sm">
                        <div className="card-header bg-white border-bottom py-3">
                          <div className="d-flex align-items-start gap-3">
                            <div
                              className="badge bg-primary d-flex align-items-center justify-content-center"
                              style={{ 
                                minWidth: "45px", 
                                height: "45px",
                                fontSize: "1rem",
                                borderRadius: "8px"
                              }}
                            >
                              Q{qIndex + 1}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
                                {q.question_text || (
                                  <em className="text-muted">
                                    No question text
                                  </em>
                                )}
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div className="card-body p-4">
                          {/* Question Image */}
                          {q.question_image && (
                            <div className="mb-4 text-center">
                              <img
                                src={getImageUrl(q.question_image)}
                                alt={`Question ${qIndex + 1}`}
                                className="img-fluid rounded border shadow-sm"
                                style={{ maxHeight: "400px", maxWidth: "100%" }}
                                onError={(e) => {
                                  console.error('Failed to load image:', q.question_image);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          {/* Answer Options */}
                          {q.options && q.options.length > 0 ? (
                            <div>
                              <h6 className="text-secondary mb-3 fw-semibold">
                                <i className="bi bi-list-check me-2"></i>
                                Answer Options:
                              </h6>
                              <div className="row g-3 mb-3">
                                {q.options.map((o, oIndex) => (
                                  <div key={oIndex} className="col-md-6">
                                    <div
                                      className={`d-flex align-items-center p-3 rounded border ${
                                        o.is_correct
                                          ? "bg-success-subtle border-success"
                                          : "bg-light border-secondary border-opacity-25"
                                      }`}
                                      style={{ 
                                        minHeight: '60px',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <div
                                        className={`badge me-3 d-flex align-items-center justify-content-center ${
                                          o.is_correct
                                            ? "bg-success"
                                            : "bg-secondary"
                                        }`}
                                        style={{ 
                                          minWidth: "32px", 
                                          height: "32px",
                                          fontSize: "0.9rem",
                                          borderRadius: "6px"
                                        }}
                                      >
                                        {String.fromCharCode(65 + oIndex)}
                                      </div>
                                      <span
                                        className={o.is_correct ? "fw-semibold" : ""}
                                        style={{ fontSize: '0.95rem', lineHeight: '1.4' }}
                                      >
                                        {o.option_text || (
                                          <em className="text-muted">
                                            Empty option
                                          </em>
                                        )}
                                      </span>
                                      {o.is_correct && (
                                        <div className="ms-auto d-flex align-items-center gap-1">
                                          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '1.2rem' }}></i>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Correct Answer Summary */}
                              <div className="p-3 bg-info-subtle rounded border border-info border-opacity-25">
                                <div className="d-flex align-items-center gap-2">
                                  <i className="bi bi-info-circle text-info" style={{ fontSize: '1.1rem' }}></i>
                                  <small className="text-info mb-0">
                                    <strong>Correct Answer(s): </strong>
                                    {q.options
                                      ?.filter((o) => o.is_correct)
                                      .map((o, i, arr) => (
                                        <span key={i} className="fw-semibold">
                                          {String.fromCharCode(
                                            65 + q.options!.indexOf(o)
                                          )}
                                          {i < arr.length - 1 ? ", " : ""}
                                        </span>
                                      )) || "None selected"}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 bg-light rounded">
                              <i className="bi bi-exclamation-triangle text-warning me-2" style={{ fontSize: '1.5rem' }}></i>
                              <p className="text-muted mb-0">
                                No answer options provided
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-question-circle display-1 text-muted"></i>
                  <h5 className="text-muted mt-3">No Questions Yet</h5>
                  <p className="text-muted">
                    This quiz doesn't have any questions added yet.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer bg-light border-top py-3">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Quiz ID: {quiz.quiz_id} | Total Questions:{" "}
                  {quiz.questions?.length || 0}
                </div>
                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={onClose}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewQuizModal;