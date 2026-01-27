// src/modals/EditQuizModal.tsx
import React, { useState, useEffect } from "react";
import { Quiz, Question, updateQuiz } from "../services/quizService";
import { getImageUrl } from "../services/cosmeticService";

interface EditQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
  onUpdated: (quiz: Quiz) => void;
}

const EditQuizModal: React.FC<EditQuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
  onUpdated,
}) => {
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description || "");
  const [questions, setQuestions] = useState<Question[]>(quiz.questions || []);
  const [loading, setLoading] = useState(false);
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title);
      setDescription(quiz.description || "");
      setQuestions(quiz.questions || []);
      
      const types = (quiz.questions || []).map(q => 
        q.options?.length === 1 ? "identification" : "multiple_choice"
      );
      setQuestionTypes(types);
    }
  }, [quiz]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      questions.forEach(q => {
        if (q.question_image instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(q.question_image));
        }
      });
    };
  }, [questions]);

  if (!isOpen) return null;

  // Helper to get preview URL for images
  const getPreviewUrl = (imagePath: string | File | undefined): string | undefined => {
    if (!imagePath) return undefined;
    
    // New file upload - create blob URL
    if (imagePath instanceof File) {
      return URL.createObjectURL(imagePath);
    }
    
    // Existing image - use centralized getImageUrl
    return getImageUrl(imagePath);
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, { question_text: "", options: [] }]);
    setQuestionTypes((prev) => [...prev, "multiple_choice"]);
  };

  const handleQuestionTypeChange = (index: number, type: string) => {
    const updated = [...questionTypes];
    updated[index] = type;
    setQuestionTypes(updated);

    const updatedQuestions = [...questions];
    if (type === "identification") {
      const existingAnswer = updatedQuestions[index].options?.[0]?.option_text || "";
      updatedQuestions[index].options = [{ option_text: existingAnswer, is_correct: true }];
    } else if (updatedQuestions[index].options?.length === 1) {
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
    if (file) {
      // Revoke old object URL if it exists to prevent memory leaks
      if (updated[index].question_image instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(updated[index].question_image as File));
      }
      // New file uploaded - replace any existing image
      updated[index].question_image = file;
    } else {
      // Remove image
      updated[index].question_image = undefined;
    }
    setQuestions(updated);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...questions];
    updated[index].question_image = undefined;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);

    const updatedTypes = [...questionTypes];
    updatedTypes.splice(index, 1);
    setQuestionTypes(updatedTypes);
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
    if (field === "text") updated[qIndex].options![oIndex].option_text = value;
    else if (field === "correct")
      updated[qIndex].options![oIndex].is_correct = value;
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options!.splice(oIndex, 1);
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Quiz title is required");
      return;
    }

    // Log what we're about to send
    console.log("📝 Questions before submit:", questions.map(q => ({
      text: q.question_text,
      image: q.question_image,
      imageType: q.question_image instanceof File ? 'File' : typeof q.question_image
    })));

    const updatedQuizData: Partial<Quiz> = {
      title: title.trim(),
      description: description.trim() || undefined,
      questions: questions,
    };

    try {
      setLoading(true);
      const updatedQuiz = await updateQuiz(quiz.quiz_id!, updatedQuizData);
      
      console.log("✅ Quiz updated successfully:", updatedQuiz);
      console.log("✅ Updated questions:", updatedQuiz.questions?.map(q => ({
        text: q.question_text,
        image: q.question_image
      })));

      onUpdated(updatedQuiz);
      onClose();
    } catch (err) {
      console.error("❌ Failed to update quiz:", err);
      alert("Failed to update quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      ></div>

      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header bg-warning text-white">
              <h1 className="modal-title fs-5 d-flex align-items-center">
                <i className="bi bi-pencil-square me-2"></i>
                Edit Quiz
              </h1>
            </div>

            <div className="modal-body">
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title text-warning mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Quiz Information
                      </h6>

                      <div className="mb-3">
                        <label
                          htmlFor="editQuizTitle"
                          className="form-label fw-semibold"
                        >
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          id="editQuizTitle"
                          type="text"
                          className="form-control"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter quiz title..."
                        />
                      </div>

                      <div className="mb-0">
                        <label
                          htmlFor="editQuizDescription"
                          className="form-label fw-semibold"
                        >
                          Description
                        </label>
                        <textarea
                          id="editQuizDescription"
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

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-warning mb-0">
                  <i className="bi bi-question-circle me-2"></i>
                  Questions ({questions.length})
                </h6>
                <button
                  type="button"
                  className="btn btn-outline-warning btn-sm"
                  onClick={handleAddQuestion}
                >
                  <i className="bi bi-plus me-1"></i>
                  Add Question
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-question-circle display-4 text-muted"></i>
                  <p className="text-muted mt-2">No questions added yet</p>
                  <button
                    type="button"
                    className="btn btn-warning"
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
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Question Type
                          </label>
                          <div className="btn-group w-100" role="group">
                            <input
                              type="radio"
                              className="btn-check"
                              name={`qtype-${qIndex}`}
                              id={`mc-edit-${qIndex}`}
                              checked={questionTypes[qIndex] === "multiple_choice"}
                              onChange={() => handleQuestionTypeChange(qIndex, "multiple_choice")}
                            />
                            <label className="btn btn-outline-primary" htmlFor={`mc-edit-${qIndex}`}>
                              <i className="bi bi-list-check me-1"></i>
                              Multiple Choice
                            </label>

                            <input
                              type="radio"
                              className="btn-check"
                              name={`qtype-${qIndex}`}
                              id={`id-edit-${qIndex}`}
                              checked={questionTypes[qIndex] === "identification"}
                              onChange={() => handleQuestionTypeChange(qIndex, "identification")}
                            />
                            <label className="btn btn-outline-success" htmlFor={`id-edit-${qIndex}`}>
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

                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Question Image (Optional)
                          </label>
                          
                          {/* Show preview for any image (new File or existing string URL) */}
                          {q.question_image && (
                            <div className="mb-2">
                              <img
                                src={getPreviewUrl(q.question_image)}
                                alt="Preview"
                                className="img-thumbnail"
                                style={{ maxHeight: "150px", maxWidth: "100%" }}
                                onError={(e) => {
                                  console.error("❌ Image failed to load:", getPreviewUrl(q.question_image));
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm d-block mt-2"
                                onClick={() => handleRemoveImage(qIndex)}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Remove Image
                              </button>
                            </div>
                          )}

                          <div className="d-flex align-items-start gap-2">
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (file) {
                                  handleImageChange(qIndex, file);
                                }
                                e.target.value = '';
                              }}
                            />
                          </div>
                          <small className="text-muted">
                            {q.question_image instanceof File
                              ? '✅ New image selected. This will replace any existing image.' 
                              : typeof q.question_image === 'string' && q.question_image
                              ? '⚠️ Current image will be kept. Upload a new file to replace it.' 
                              : 'Select an image file to upload'}
                          </small>
                        </div>

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

            <div className="modal-footer bg-light">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Editing: {quiz.title} | {questions.length} question
                  {questions.length !== 1 ? "s" : ""}
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleSubmit}
                    disabled={loading || !title.trim()}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Update Quiz
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

export default EditQuizModal;