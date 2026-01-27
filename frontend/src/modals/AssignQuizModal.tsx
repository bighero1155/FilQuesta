// src/modals/AssignQuizModal.tsx
import React, { useEffect, useState } from "react";
import { getStudents } from "../services/userService";
import { assignQuiz, Quiz } from "../services/quizService";

interface AssignQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
  onAssigned: () => void;
}

interface Student {
  user_id: number;
  username: string | null;
  email: string | null;
}

const AssignQuizModal: React.FC<AssignQuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
  onAssigned,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      setSelected([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data || []);
      setError(null);
    } catch (err) {
      console.error("fetchStudents:", err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAllStudents = () => {
    const filteredStudents = getFilteredStudents();
    const allSelected = filteredStudents.every((s) =>
      selected.includes(s.user_id)
    );

    if (allSelected) {
      // Deselect all filtered students
      setSelected((prev) =>
        prev.filter((id) => !filteredStudents.find((s) => s.user_id === id))
      );
    } else {
      // Select all filtered students
      const newSelections = filteredStudents.map((s) => s.user_id);
      setSelected((prev) => [...new Set([...prev, ...newSelections])]);
    }
  };

  const getFilteredStudents = () => {
    const search = searchTerm.toLowerCase();
    return students.filter((student) => {
      const username = student.username?.toLowerCase() || "";
      const email = student.email?.toLowerCase() || "";
      return username.includes(search) || email.includes(search);
    });
  };

  const handleAssign = async () => {
    if (selected.length === 0) {
      alert("Please select at least one student.");
      return;
    }
    try {
      setLoading(true);
      await assignQuiz(quiz.quiz_id!, selected);
      onAssigned();
      onClose();
    } catch (err) {
      console.error("assignQuiz:", err);
      alert("Failed to assign quiz.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredStudents = getFilteredStudents();
  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selected.includes(s.user_id));

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
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header bg-primary text-white">
              <h1 className="modal-title fs-5 d-flex align-items-center">
                <i className="bi bi-person-plus me-2"></i>
                Assign Quiz
              </h1>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Quiz Info Card */}
              <div className="card bg-light border-0 mb-4">
                <div className="card-body">
                  <h6 className="card-title text-primary mb-2">
                    <i className="bi bi-journal-text me-2"></i>
                    Quiz Details
                  </h6>
                  <h5 className="mb-1">{quiz.title}</h5>
                  <p className="text-muted mb-2">
                    {quiz.description || "No description provided"}
                  </p>
                  <div>
                    <span className="badge bg-primary">
                      <i className="bi bi-question-circle me-1"></i>
                      {quiz.questions?.length || 0} Questions
                    </span>
                  </div>
                </div>
              </div>

              {/* Students Selection Section */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-primary mb-0">
                    <i className="bi bi-people me-2"></i>
                    Select Students
                  </h6>
                  <span className="badge bg-success">
                    {selected.length} Selected
                  </span>
                </div>

                {/* Search Bar */}
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search students by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setSearchTerm("")}
                        title="Clear search"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Select All Button */}
                {filteredStudents.length > 0 && (
                  <div className="mb-3">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        allFilteredSelected
                          ? "btn-outline-danger"
                          : "btn-outline-primary"
                      }`}
                      onClick={toggleAllStudents}
                    >
                      <i
                        className={`bi ${
                          allFilteredSelected ? "bi-check-square" : "bi-square"
                        } me-2`}
                      ></i>
                      {allFilteredSelected ? "Deselect All" : "Select All"}
                      {searchTerm && " (Filtered)"}
                    </button>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Loading State */}
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading students...</p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-people display-1 text-muted"></i>
                    <h6 className="text-muted mt-3">No Students Found</h6>
                    <p className="text-muted">
                      There are no students available to assign this quiz to.
                    </p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-search display-4 text-muted"></i>
                    <h6 className="text-muted mt-3">No Results Found</h6>
                    <p className="text-muted">
                      No students match your search criteria.
                    </p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="students-list">
                    <div
                      className="border rounded"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      {filteredStudents.map((student, index) => (
                        <div
                          key={student.user_id}
                          className={`p-3 ${
                            index !== filteredStudents.length - 1
                              ? "border-bottom"
                              : ""
                          } ${
                            selected.includes(student.user_id)
                              ? "bg-primary-subtle"
                              : "bg-white"
                          }`}
                        >
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`student-${student.user_id}`}
                              checked={selected.includes(student.user_id)}
                              onChange={() => toggleStudent(student.user_id)}
                            />
                            <label
                              className="form-check-label w-100 cursor-pointer"
                              htmlFor={`student-${student.user_id}`}
                            >
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  <div
                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: "40px", height: "40px" }}
                                  >
                                    <i className="bi bi-person"></i>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="fw-semibold text-dark">
                                    {student.username || "Unnamed"}
                                  </div>
                                  <div className="text-muted small">
                                    <i className="bi bi-envelope me-1"></i>
                                    {student.email || "No email"}
                                  </div>
                                </div>
                                {selected.includes(student.user_id) && (
                                  <div className="ms-auto">
                                    <i className="bi bi-check-circle-fill text-primary"></i>
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer bg-light">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  {selected.length} of {students.length} students selected
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
                    className="btn btn-primary"
                    onClick={handleAssign}
                    disabled={loading || selected.length === 0}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Assign to {selected.length} Student
                        {selected.length !== 1 ? "s" : ""}
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

export default AssignQuizModal;
