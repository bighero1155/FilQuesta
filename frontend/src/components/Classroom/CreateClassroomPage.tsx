// src/pages/CreateClassroomPage.tsx
import React, { useState, useEffect } from "react";
import classroomService, { Classroom } from "../../services/classroomService";
import recommendationService from "../../services/recommendationService";
import { useAuth } from "../../context/AuthContext";
import EditRecommendationModal from "../Classroom/EditRecommendationModal";

const CreateClassroomPage: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingRec, setEditingRec] = useState<any | null>(null);
  const [showRecsModal, setShowRecsModal] = useState(false);

  // 🔹 Load teacher's recommendations 
  useEffect(() => {
    if (!user?.user_id) return;
    const fetchRecommendations = async () => {
      try {
        const res = await recommendationService.getByTeacher(user.user_id);
        setRecommendations(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      }
    };
    fetchRecommendations();
  }, [user]);

  // 🔹 Handle classroom creation
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const newClassroom: Partial<Classroom> = {
        title,
        description,
        teacher_id: user.user_id,
      };

      const created = await classroomService.create(newClassroom);
      setCode(created.code);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create classroom");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete recommendation
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this recommendation?")) return;
    try {
      setDeletingId(id);
      await recommendationService.delete(id);
      setRecommendations((prev) =>
        prev.filter((r) => r.recommendation_id !== id)
      );
    } catch (err) {
      console.error("Failed to delete recommendation:", err);
      alert("Failed to delete recommendation.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (rec: any) => setEditingRec(rec);

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center py-5"
      style={{
        background:
          "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)",
      }}
    >
      <style>
        {`
          /* 🔹 Button hover animation styles */
          .animated-btn {
            transition: all 0.3s ease-in-out;
            transform: translateY(0);
          }

          .animated-btn:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
          }

          .recommend-btn {
            transition: all 0.3s ease-in-out;
          }

          .recommend-btn:hover {
            transform: translateY(-2px) scale(1.02);
            background-color: #ffca2c !important;
            box-shadow: 0 6px 12px rgba(255, 193, 7, 0.4);
          }

          .btn-outline-primary:hover {
            background-color: #007bff;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
          }

          .btn-outline-danger:hover {
            background-color: #dc3545;
            color: white !important;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
          }
        `}
      </style>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            {/* ✅ Create Classroom Card */}
            <div
              className="card border-0 shadow-lg p-4 mb-5"
              style={{
                backdropFilter: "blur(12px)",
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: "1.5rem",
              }}
            >
              <div className="card-body text-center">
                <h2
                  className="fw-bold mb-4"
                  style={{
                    color: "#007bff",
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  ✨ Create Your Classroom
                </h2>

                {error && <div className="alert alert-danger">{error}</div>}

                {code ? (
                  <div className="alert alert-success py-4 fs-5 rounded-3">
                    <strong>Classroom created successfully! 🎉</strong>
                    <br />
                    Share this code with your students:
                    <br />
                    <span
                      className="d-inline-block mt-3 px-4 py-2 bg-dark text-white rounded fs-4"
                      style={{
                        letterSpacing: "2px",
                        fontWeight: "bold",
                      }}
                    >
                      {code}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleCreate}>
                    <div className="mb-4 text-start">
                      <label
                        htmlFor="title"
                        className="form-label fw-semibold text-dark"
                      >
                        Classroom Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="form-control form-control-lg rounded-pill px-4"
                        placeholder="Enter classroom title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4 text-start">
                      <label
                        htmlFor="description"
                        className="form-label fw-semibold text-dark"
                      >
                        Description (optional)
                      </label>
                      <textarea
                        id="description"
                        className="form-control form-control-lg rounded-4 px-4 py-3"
                        rows={3}
                        placeholder="Write a short description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg rounded-pill px-5 py-2 fw-bold shadow-sm w-100 animated-btn"
                      disabled={loading}
                      style={{
                        background:
                          "linear-gradient(90deg, #007bff, #00c6ff, #43e97b)",
                        border: "none",
                      }}
                    >
                      {loading ? "Creating..." : "🚀 Create Classroom"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* 🔹 Centered Recommendations Button (unchanged logic, styled) */}
            <div className="d-flex justify-content-center mb-4">
              <button
                className="btn btn-warning btn-lg px-5 py-3 fw-bold shadow recommend-btn"
                style={{ fontSize: "1.2rem" }}
                onClick={() => setShowRecsModal(true)}
              >
                💡 Your Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Recommendations Modal (unchanged logic) */}
      {showRecsModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowRecsModal(false)}
        >
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dialog modal-xl" style={{ maxWidth: "1100px" }}>
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div
                  className="modal-header"
                  style={{ backgroundColor: "#ffc107", color: "white" }}
                >
                  <h5 className="modal-title fw-semibold">💡 Your Recommendations</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setShowRecsModal(false)}
                  />
                </div>
                <div
                  className="modal-body"
                  style={{
                    maxHeight: "70vh",
                    overflowY: "auto",
                    backgroundColor: "#fff9e6",
                  }}
                >
                  {recommendations.length === 0 ? (
                    <div className="text-center text-muted py-5 fs-5">
                      No recommendations yet.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {recommendations.map((rec) => (
                        <div
                          key={rec.recommendation_id}
                          className="d-flex align-items-center justify-content-between border rounded-3 shadow-sm p-3 bg-white"
                          style={{
                            minHeight: "90px",
                            borderLeft: "5px solid #ffc107",
                            flexWrap: "wrap",
                            gap: "10px",
                          }}
                        >
                          <div style={{ minWidth: "160px" }}>
                            <h6 className="text-primary fw-bold mb-0">
                              {rec.student
                                ? `${rec.student.first_name} ${rec.student.last_name}`
                                : "Unknown Student"}
                            </h6>
                            <small className="text-muted">
                              @{rec.student?.username || "unknown"}
                            </small>
                          </div>
                          <div style={{ minWidth: "220px" }}>
                            <strong>Game:</strong>{" "}
                            <a
                              href={rec.game_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {rec.game_link}
                            </a>
                          </div>
                          <div
                            className="text-secondary"
                            style={{ flex: 1, minWidth: "300px" }}
                          >
                            <strong>Message:</strong>{" "}
                            {rec.message || "No message provided."}
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm animated-btn"
                              onClick={() => handleEdit(rec)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm animated-btn"
                              onClick={() =>
                                handleDelete(rec.recommendation_id)
                              }
                              disabled={deletingId === rec.recommendation_id}
                            >
                              {deletingId === rec.recommendation_id
                                ? "Deleting..."
                                : "🗑 Delete"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Edit Recommendation Modal */}
      {editingRec && (
        <EditRecommendationModal
          recommendation={editingRec}
          onClose={() => setEditingRec(null)}
          onUpdated={(updated) => {
            setRecommendations((prev) =>
              prev.map((r) =>
                r.recommendation_id === updated.recommendation_id ? updated : r
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default CreateClassroomPage;
