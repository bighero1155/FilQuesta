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
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Quiz Header Info */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h3 className="card-title text-primary mb-2">
                        <i className="bi bi-journal-text me-2"></i>
                        {quiz.title}
                      </h3>
                      <p className="card-text text-muted mb-0">
                        {quiz.description || (
                          <em className="text-muted">
                            No description provided
                          </em>
                        )}
                      </p>
                      <div className="mt-3">
                        <span className="badge bg-primary me-2">
                          <i className="bi bi-question-circle me-1"></i>
                          {quiz.questions?.length || 0} Questions
                        </span>
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Ready to Use
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              {quiz.questions && quiz.questions.length > 0 ? (
                <div>
                  <h5 className="text-primary mb-3">
                    <i className="bi bi-list-ol me-2"></i>
                    Questions & Answers
                  </h5>

                  <div className="questions-preview">
                    {quiz.questions.map((q, qIndex) => (
                      <div key={qIndex} className="card mb-4 border">
                        <div className="card-header bg-white">
                          <div className="d-flex align-items-start">
                            <div
                              className="badge bg-primary me-3 mt-1"
                              style={{ minWidth: "40px" }}
                            >
                              Q{qIndex + 1}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 fw-semibold">
                                {q.question_text || (
                                  <em className="text-muted">
                                    No question text
                                  </em>
                                )}
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div className="card-body">
                          {/* Question Image */}
                          {q.question_image && (
                            <div className="mb-3 text-center">
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
                              <h6 className="text-secondary mb-3">
                                Answer Options:
                              </h6>
                              <div className="row">
                                {q.options.map((o, oIndex) => (
                                  <div key={oIndex} className="col-md-6 mb-2">
                                    <div
                                      className={`d-flex align-items-center p-3 rounded border ${
                                        o.is_correct
                                          ? "bg-success-subtle border-success"
                                          : "bg-light border-light"
                                      }`}
                                    >
                                      <div
                                        className={`badge me-2 ${
                                          o.is_correct
                                            ? "bg-success"
                                            : "bg-secondary"
                                        }`}
                                        style={{ minWidth: "24px" }}
                                      >
                                        {String.fromCharCode(65 + oIndex)}
                                      </div>
                                      <span
                                        className={
                                          o.is_correct ? "fw-semibold" : ""
                                        }
                                      >
                                        {o.option_text || (
                                          <em className="text-muted">
                                            Empty option
                                          </em>
                                        )}
                                      </span>
                                      {o.is_correct && (
                                        <div className="ms-auto">
                                          <i className="bi bi-check-circle-fill text-success"></i>
                                          <small className="text-success ms-1 fw-semibold">
                                            Correct
                                          </small>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Correct Answer Summary */}
                              <div className="mt-3 p-2 bg-info-subtle rounded">
                                <small className="text-info">
                                  <i className="bi bi-info-circle me-1"></i>
                                  <strong>Correct Answer(s): </strong>
                                  {q.options
                                    ?.filter((o) => o.is_correct)
                                    .map((o, i, arr) => (
                                      <span key={i}>
                                        {String.fromCharCode(
                                          65 + q.options!.indexOf(o)
                                        )}
                                        {i < arr.length - 1 ? ", " : ""}
                                      </span>
                                    )) || "None selected"}
                                </small>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-3">
                              <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                              <span className="text-muted">
                                No answer options provided
                              </span>
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
            <div className="modal-footer bg-light">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Quiz ID: {quiz.quiz_id} | Total Questions:{" "}
                  {quiz.questions?.length || 0}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
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