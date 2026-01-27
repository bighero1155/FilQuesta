// src/components/Quizzes/QuizDashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import { getAllQuizzes, deleteQuiz, Quiz } from "../../services/quizService";
import CreateQuizModal from "../../modals/CreateQuizModal";
import EditQuizModal from "../../modals/EditQuizModal";
import ViewQuizModal from "../../modals/ViewQuizModal";
import AssignQuizModal from "../../modals/AssignQuizModal";
import ShareQuizModal from "../../modals/ShareQuizModal";
import { useAuth } from "../../context/AuthContext";
import QuizDashboardCSS from "../../styles/QuizDashboardCSS";

const QuizDashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
  const [viewQuiz, setViewQuiz] = useState<Quiz | null>(null);
  const [assignQuiz, setAssignQuiz] = useState<Quiz | null>(null);
  const [shareQuiz, setShareQuiz] = useState<Quiz | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { user } = useAuth();

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllQuizzes();
      
      // Optional: Double-check on frontend that quizzes belong to current teacher
      // This is redundant if backend is properly filtered, but adds extra safety
      let filteredData = Array.isArray(data) ? data : [];
      
      if (user?.role === 'teacher') {
        filteredData = filteredData.filter(q => q.teacher_id === user.user_id);
      }
      
      setQuizzes(filteredData);
      setError(null);
    } catch (err: any) {
      console.error("fetchQuizzes:", err);
      setError("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }, [user?.role, user?.user_id]); // Dependencies for useCallback

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]); // Now we can safely include fetchQuizzes

  const handleDelete = async (quizId: number) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    
    try {
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.quiz_id !== quizId));
      setSuccess("Quiz deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("deleteQuiz:", err);
      alert("Error deleting quiz");
    }
  };

  const handleCreateClick = () => {
    if (!user || !user.user_id) {
      alert("No teacher user found. Log in first.");
      return;
    }
    setShowCreateModal(true);
  };

  const handleQuizCreated = async () => {
    await fetchQuizzes();
    setShowCreateModal(false);
    setSuccess("Quiz created successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleEditClick = (quiz: Quiz) => {
    // Security check: only allow editing own quizzes
    if (user?.role === 'teacher' && quiz.teacher_id !== user.user_id) {
      alert("You can only edit your own quizzes");
      return;
    }
    setEditQuiz(quiz);
  };

  const handleQuizUpdated = (updatedQuiz: Quiz) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.quiz_id === updatedQuiz.quiz_id ? updatedQuiz : q))
    );
    setEditQuiz(null);
    setSuccess("Quiz updated successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleViewClick = (quiz: Quiz) => {
    setViewQuiz(quiz);
  };

  const handleAssign = (quiz: Quiz) => {
    // Security check: only allow assigning own quizzes
    if (user?.role === 'teacher' && quiz.teacher_id !== user.user_id) {
      alert("You can only assign your own quizzes");
      return;
    }
    setAssignQuiz(quiz);
  };

  const handleShare = (quiz: Quiz) => {
    // Security check: only allow sharing own quizzes
    if (user?.role === 'teacher' && quiz.teacher_id !== user.user_id) {
      alert("You can only share your own quizzes");
      return;
    }
    setShareQuiz(quiz);
  };

  const handleQuizAssigned = () => {
    setAssignQuiz(null);
    setSuccess("Quiz assigned successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleQuizShared = () => {
    setShareQuiz(null);
    setSuccess("Quiz shared successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const totalQuestions = quizzes.reduce(
    (sum, q) => sum + (Array.isArray(q.questions) ? q.questions.length : 0),
    0
  );

  const avgQuestions =
    quizzes.length > 0 ? Math.round(totalQuestions / quizzes.length) : 0;

  return (
    <>
      <QuizDashboardCSS />
      
      <div className="quiz-dashboard-container">
        {/* Header Section */}
        <div className="quiz-dashboard-header">
          <div className="quiz-dashboard-header-content">
            <div className="quiz-dashboard-title-section">
              <h1>
                <span className="quiz-dashboard-icon">📋</span>
                Quiz Dashboard
              </h1>
              <p className="quiz-dashboard-subtitle">
                Create, manage, and track all your quizzes in one place
              </p>
            </div>
            <button
              className="quiz-dashboard-create-btn"
              onClick={handleCreateClick}
              disabled={loading}
            >
              <i className="bi bi-plus-circle"></i> Create New Quiz
            </button>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="quiz-dashboard-alert quiz-dashboard-alert-success">
            <i className="bi bi-check-circle-fill"></i> <strong>{success}</strong>
          </div>
        )}
        {error && (
          <div className="quiz-dashboard-alert quiz-dashboard-alert-danger">
            <i className="bi bi-exclamation-triangle-fill"></i> <strong>{error}</strong>
          </div>
        )}

        {/* Stats Cards */}
        <div className="quiz-dashboard-stats">
          <div className="quiz-dashboard-stat-card">
            <div className="quiz-dashboard-stat-content">
              <div className="quiz-dashboard-stat-icon quiz-dashboard-stat-icon-primary">
                <i className="bi bi-journals"></i>
              </div>
              <div className="quiz-dashboard-stat-details">
                <h6 className="quiz-dashboard-stat-label">Total Quizzes</h6>
                <h3 className="quiz-dashboard-stat-value">{quizzes.length}</h3>
              </div>
            </div>
          </div>

          <div className="quiz-dashboard-stat-card">
            <div className="quiz-dashboard-stat-content">
              <div className="quiz-dashboard-stat-icon quiz-dashboard-stat-icon-success">
                <i className="bi bi-patch-check"></i>
              </div>
              <div className="quiz-dashboard-stat-details">
                <h6 className="quiz-dashboard-stat-label">Total Questions</h6>
                <h3 className="quiz-dashboard-stat-value">{totalQuestions}</h3>
              </div>
            </div>
          </div>

          <div className="quiz-dashboard-stat-card">
            <div className="quiz-dashboard-stat-content">
              <div className="quiz-dashboard-stat-icon quiz-dashboard-stat-icon-info">
                <i className="bi bi-graph-up"></i>
              </div>
              <div className="quiz-dashboard-stat-details">
                <h6 className="quiz-dashboard-stat-label">Avg Questions</h6>
                <h3 className="quiz-dashboard-stat-value">{avgQuestions}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="quiz-dashboard-main-card">
          <div className="quiz-dashboard-card-header">
            <h5 className="quiz-dashboard-card-title">
              <i className="bi bi-list-check"></i>
              Your Quizzes
            </h5>
          </div>

          <div className="quiz-dashboard-card-body">
            {loading ? (
              <div className="quiz-dashboard-loading">
                <div className="quiz-dashboard-spinner"></div>
                <p className="quiz-dashboard-loading-text">Loading your quizzes...</p>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="quiz-dashboard-empty">
                <div className="quiz-dashboard-empty-icon">
                  <i className="bi bi-journal-x"></i>
                </div>
                <h4 className="quiz-dashboard-empty-title">No quizzes yet</h4>
                <p className="quiz-dashboard-empty-text">
                  Create your first quiz to get started with engaging assessments
                </p>
                <button className="quiz-dashboard-empty-btn" onClick={handleCreateClick}>
                  <i className="bi bi-plus-circle"></i> Create Your First Quiz
                </button>
              </div>
            ) : (
              <div className="quiz-dashboard-table-wrapper">
                <table className="quiz-dashboard-table">
                  <thead>
                    <tr>
                      <th>Quiz Title</th>
                      <th>Description</th>
                      <th style={{ textAlign: 'center', width: '100px' }}>Questions</th>
                      <th style={{ textAlign: 'center', width: '280px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((quiz) => (
                      <tr key={quiz.quiz_id}>
                        <td>
                          <div className="quiz-dashboard-quiz-title">{quiz.title}</div>
                        </td>
                        <td>
                          <span className="quiz-dashboard-quiz-description">
                            {quiz.description || "No description provided"}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="quiz-dashboard-question-badge">
                            {Array.isArray(quiz.questions) ? quiz.questions.length : 0}
                          </span>
                        </td>
                        <td>
                          <div className="quiz-dashboard-actions">
                            <button
                              className="quiz-dashboard-action-btn quiz-dashboard-action-btn-info"
                              onClick={() => handleViewClick(quiz)}
                              title="View"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="quiz-dashboard-action-btn quiz-dashboard-action-btn-warning"
                              onClick={() => handleEditClick(quiz)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="quiz-dashboard-action-btn quiz-dashboard-action-btn-primary"
                              onClick={() => handleAssign(quiz)}
                              title="Assign"
                            >
                              <i className="bi bi-person-plus"></i>
                            </button>
                            <button
                              className="quiz-dashboard-action-btn quiz-dashboard-action-btn-success"
                              onClick={() => handleShare(quiz)}
                              title="Share"
                            >
                              <i className="bi bi-share"></i>
                            </button>
                            <button
                              className="quiz-dashboard-action-btn quiz-dashboard-action-btn-danger"
                              onClick={() => handleDelete(quiz.quiz_id!)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <CreateQuizModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleQuizCreated}
        />

        {editQuiz && (
          <EditQuizModal
            isOpen={!!editQuiz}
            onClose={() => setEditQuiz(null)}
            quiz={editQuiz}
            onUpdated={handleQuizUpdated}
          />
        )}

        {viewQuiz && (
          <ViewQuizModal
            isOpen={!!viewQuiz}
            onClose={() => setViewQuiz(null)}
            quiz={viewQuiz}
          />
        )}

        {assignQuiz && (
          <AssignQuizModal
            isOpen={!!assignQuiz}
            onClose={() => setAssignQuiz(null)}
            quiz={assignQuiz}
            onAssigned={handleQuizAssigned}
          />
        )}

        {shareQuiz && (
          <ShareQuizModal
            isOpen={!!shareQuiz}
            onClose={() => setShareQuiz(null)}
            quiz={shareQuiz}
            onShared={handleQuizShared}
          />
        )}
      </div>
    </>
  );
};

export default QuizDashboard;