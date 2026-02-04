// src/modals/CreateQuizModal.tsx
import React, { useState } from "react";
import { createQuiz, Quiz, Question } from "../services/quizService";
import { useAuth } from "../context/AuthContext";

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (quiz: Quiz) => void;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [questionTypes, setQuestionTypes] = useState<string[]>([]); // Track question types

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, { question_text: "", options: [] }]);
    setQuestionTypes((prev) => [...prev, "multiple_choice"]); // Default to multiple choice
  };

  const handleQuestionTypeChange = (index: number, type: string) => {
    const updated = [...questionTypes];
    updated[index] = type;
    setQuestionTypes(updated);

    const updatedQuestions = [...questions];
    if (type === "identification") {
      // For identification, set one empty option with is_correct true
      updatedQuestions[index].options = [{ option_text: "", is_correct: true }];
    } else {
      // For multiple choice, reset to empty options
      updatedQuestions[index].options = [];
    }
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].question_text = text;
    setQuestions(updated);
  };

  const handleImageChange = (index: number, file: File | null) => {
    const updated = [...questions];
    updated[index].question_image = file || undefined;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options!.push({ option_text: "", is_correct: false });
    setQuestions(updated);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    field: "text" | "correct",
    value: any
  ) => {
    const updated = [...questions];
    if (field === "text") {
      updated[qIndex].options![oIndex].option_text = value;
    } else if (field === "correct") {
      updated[qIndex].options![oIndex].is_correct = value;
    }
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options!.splice(oIndex, 1);
    setQuestions(updated);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);

    const updatedTypes = [...questionTypes];
    updatedTypes.splice(qIndex, 1);
    setQuestionTypes(updatedTypes);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!title.trim()) {
      alert("Quiz title is required");
      return;
    }

    const quiz: Quiz = {
      teacher_id: user.user_id,
      title,
      description,
      questions,
    };

    try {
      setLoading(true);
      const createdQuiz = await createQuiz(quiz);
      onCreated(createdQuiz);
      onClose();
      setTitle("");
      setDescription("");
      setQuestions([]);
      setQuestionTypes([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header bg-primary text-white">
              <h1 className="modal-title fs-5 d-flex align-items-center">
                <i className="bi bi-plus-circle me-2"></i>
                Create New Quiz
              </h1>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Quiz Basic Info */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title text-primary mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Quiz Information
                      </h6>

                      <div className="mb-3">
                        <label
                          htmlFor="quizTitle"
                          className="form-label fw-semibold"
                        >
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          id="quizTitle"
                          type="text"
                          className="form-control"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter quiz title..."
                        />
                      </div>

                      <div className="mb-0">
                        <label
                          htmlFor="quizDescription"
                          className="form-label fw-semibold"
                        >
                          Description
                        </label>
                        <textarea
                          id="quizDescription"
                          className="form-control"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Optional description for your quiz..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-primary mb-0">
                  <i className="bi bi-question-circle me-2"></i>
                  Questions ({questions.length})
                </h6>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-question-circle display-4 text-muted"></i>
                  <p className="text-muted mt-2">No questions added yet</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddQuestion}
                  >
                    <i className="bi bi-plus me-2"></i>
                    Add Your First Question
                  </button>
                </div>
              ) : (
                <div className="questions-container">
                  {questions.map((q, qIndex) => (
                    <div key={qIndex} className="card mb-3 border">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">
                          Question {qIndex + 1}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          title="Remove Question"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>

                      <div className="card-body">
                        {/* Question Type Selection */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Question Type
                          </label>
                          <div className="btn-group w-100" role="group">
                            <input
                              type="radio"
                              className="btn-check"
                              name={`qtype-${qIndex}`}
                              id={`mc-${qIndex}`}
                              checked={questionTypes[qIndex] === "multiple_choice"}
                              onChange={() => handleQuestionTypeChange(qIndex, "multiple_choice")}
                            />
                            <label className="btn btn-outline-primary" htmlFor={`mc-${qIndex}`}>
                              <i className="bi bi-list-check me-1"></i>
                              Multiple Choice
                            </label>

                            <input
                              type="radio"
                              className="btn-check"
                              name={`qtype-${qIndex}`}
                              id={`id-${qIndex}`}
                              checked={questionTypes[qIndex] === "identification"}
                              onChange={() => handleQuestionTypeChange(qIndex, "identification")}
                            />
                            <label className="btn btn-outline-success" htmlFor={`id-${qIndex}`}>
                              <i className="bi bi-pencil-square me-1"></i>
                              Identification
                            </label>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Question Text
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={q.question_text}
                            onChange={(e) =>
                              handleQuestionChange(qIndex, e.target.value)
                            }
                            placeholder="Enter your question..."
                          />
                        </div>

                        {/* Image Upload Section */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Question Image (Optional)
                          </label>
                          <div className="d-flex align-items-start gap-2">
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleImageChange(qIndex, file);
                              }}
                            />
                            {q.question_image instanceof File && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleImageChange(qIndex, null)}
                                title="Remove image"
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            )}
                          </div>
                          {q.question_image instanceof File && (
                            <div className="mt-2">
                              <img
                                src={URL.createObjectURL(q.question_image)}
                                alt="Preview"
                                className="img-thumbnail"
                                style={{ maxHeight: "150px", maxWidth: "100%" }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Answer Section - Multiple Choice */}
                        {questionTypes[qIndex] === "multiple_choice" && (
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <label className="form-label fw-semibold mb-0">
                                Answer Options
                              </label>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleAddOption(qIndex)}
                              >
                                <i className="bi bi-plus me-1"></i>
                                Add Option
                              </button>
                            </div>

                            {q.options?.length === 0 ? (
                              <div className="text-center py-3 border rounded bg-light">
                                <i className="bi bi-list-ul text-muted me-2"></i>
                                <span className="text-muted">
                                  No options added
                                </span>
                              </div>
                            ) : (
                              <div className="options-list">
                                {q.options?.map((o, oIndex) => (
                                  <div key={oIndex} className="input-group mb-2">
                                    <span className="input-group-text bg-light">
                                      {String.fromCharCode(65 + oIndex)}
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={o.option_text}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          qIndex,
                                          oIndex,
                                          "text",
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Option ${oIndex + 1}`}
                                    />
                                    <div className="input-group-text">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={o.is_correct}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            qIndex,
                                            oIndex,
                                            "correct",
                                            e.target.checked
                                          )
                                        }
                                        title="Mark as correct answer"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger"
                                      onClick={() =>
                                        handleRemoveOption(qIndex, oIndex)
                                      }
                                      title="Remove option"
                                    >
                                      <i className="bi bi-x"></i>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Answer Section - Identification */}
                        {questionTypes[qIndex] === "identification" && (
                          <div className="mb-3">
                            <label className="form-label fw-semibold">
                              Correct Answer
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={q.options?.[0]?.option_text || ""}
                              onChange={(e) =>
                                handleOptionChange(qIndex, 0, "text", e.target.value)
                              }
                              placeholder="Enter the correct answer..."
                            />
                            <small className="text-muted">
                              <i className="bi bi-info-circle me-1"></i>
                              Students will type their answer. Matching is case-insensitive.
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer bg-light">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleAddQuestion}
                >
                  <i className="bi bi-plus me-1"></i>
                  Add Question
                </button>
                <div className="d-flex gap-2 align-items-center">
                  <div className="text-muted small">
                    <i className="bi bi-info-circle me-1"></i>
                    {questions.length} question{questions.length !== 1 ? "s" : ""}{" "}
                    added
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading || !title.trim()}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Create Quiz
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 

export default CreateQuizModal;