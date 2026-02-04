// src/components/Classroom/ClassroomPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classroomService, { Classroom, Student } from "../../services/classroomService";
import { useAuth } from "../../context/AuthContext";
import { updateUserProgress } from "../../services/userService";
import { getUserGameOverLogs } from "../../services/pageVisitService";
import RecommendModal from "../Classroom/RecommendModal";
import ProfileHeader from "../../pages/ProfileHeader";
import ClassroomMessages from "./ClassroomMessages";
import ClassroomReports from "./ClassroomReports";  
import ClassroomPageCSS from "../../styles/ClassroomPageCSS";
import axios from "../../auth/axiosInstance";

interface StudentWithScore extends Student {
  total_score?: number;
  avatar?: string;
  favorite_color?: string;
}

interface GameOverLog {
  page: string;
  total_gameover: number;
  total_time_spent: number; 
}

const ClassroomPage: React.FC = () => {
  const { user } = useAuth();
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<StudentWithScore[]>([]);
  const [teacherClassrooms, setTeacherClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithScore | null>(null);
  const [gameOverLogs, setGameOverLogs] = useState<GameOverLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'students' | 'reports' | 'messages'>('students');
  const [deletingClassroomId, setDeletingClassroomId] = useState<number | null>(null);

  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  /** Get back navigation path based on user role */
  const getBackPath = () => {
    if (isAdmin) return "/dashboard";
    if (isTeacher) return "/dashboard";
    return "/Classroom";
  };

  /** Fetch all classrooms for teacher */
  const fetchTeacherClassrooms = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await classroomService.getTeacherClassrooms(user.user_id);
      setTeacherClassrooms(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch classrooms");
    } finally {
      setLoading(false);
    }
  }, [user]);

  /** Fetch single classroom details */
  const fetchClassroom = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await classroomService.getById(id);
      setClassroom(data);
      setStudents(data.students || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch classroom");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch student's classroom (if they're already in one)
  const fetchStudentClassroom = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await classroomService.getStudentClassrooms(user.user_id);
      if (data && data.length > 0) {
        const classroomId = data[0].classroom_id;
        const fullClassroom = await classroomService.getById(classroomId);
        setClassroom(fullClassroom);
        setStudents(fullClassroom.students || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch student classroom:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (isTeacher || isAdmin) {
      if (classroomId) {
        fetchClassroom(Number(classroomId));
      } else {
        fetchTeacherClassrooms();
      }
    } else {
      fetchStudentClassroom();
    }
  }, [user, isTeacher, isAdmin, classroomId, fetchClassroom, fetchTeacherClassrooms, fetchStudentClassroom]);

  /** Student joins classroom */
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setJoinError(null);
    setLoading(true);

    try {
      const data = await classroomService.join(joinCode, user.user_id);
      setClassroom(data.classroom);
      setStudents(data.classroom.students || []);
      setJoinCode("");
    } catch (err: any) {
      setJoinError(err.response?.data?.message || "Failed to join classroom");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClassroom = async () => {
    if (!user || !classroom) return;
    
    const confirmLeave = window.confirm(`Are you sure you want to leave "${classroom.title}"?`);
    if (!confirmLeave) return;

    setLoading(true);
    try {
      await classroomService.leave(classroom.classroom_id, user.user_id);
      setClassroom(null);
      setStudents([]);
      alert("You have left the classroom successfully.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to leave classroom");
    } finally {
      setLoading(false);
    }
  };

  /** Delete classroom - for teacher/admin in classroom list view */
  const handleDeleteClassroom = async (classroomId: number, classroomTitle: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!window.confirm(`⚠️ Are you sure you want to DELETE "${classroomTitle}"?\n\nThis will:\n- Remove all students\n- Delete all messages\n- This action CANNOT be undone!`)) {
      return;
    }

    setDeletingClassroomId(classroomId);
    try {
      await axios.delete(`/classrooms/${classroomId}`, {
        skipLoading: true
      } as any);
      
      // Refresh the classroom list
      await fetchTeacherClassrooms();
      alert("Classroom deleted successfully.");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete classroom");
    } finally {
      setDeletingClassroomId(null);
    }
  };

  /** Delete current classroom - for teacher/admin in classroom view */
  const handleDeleteCurrentClassroom = async () => {
    if (!classroom) return;
    
    if (!window.confirm(`⚠️ Are you sure you want to DELETE "${classroom.title}"?\n\nThis will:\n- Remove all students\n- Delete all messages\n- This action CANNOT be undone!`)) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/classrooms/${classroom.classroom_id}`, {
        skipLoading: true
      } as any);
      
      alert("Classroom deleted successfully.");
      navigate(getBackPath());
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete classroom");
    } finally {
      setLoading(false);
    }
  };

  /** Assign points — teachers and admins can use this */
  const handleAssignPoints = async (studentId: number) => {
    if (!isTeacher && !isAdmin) return;

    const points = prompt("Enter points to assign:");
    if (!points || isNaN(Number(points))) return;

    try {
      const scoreToAdd = Number(points);
      await updateUserProgress(studentId, scoreToAdd);
      setStudents((prev) =>
        prev.map((s) =>
          s.user_id === studentId
            ? { ...s, total_score: (s.total_score || 0) + scoreToAdd }
            : s
        )
      );
      alert(`Assigned ${scoreToAdd} points to student`);
    } catch (err) {
      console.error(err);
      alert("Failed to assign points");
    }
  };

  /** Teacher/Admin removes a student from classroom */
  const handleRemoveStudent = async (studentId: number, studentName: string) => {
    if (!isTeacher && !isAdmin || !classroom) return;

    const confirmRemove = window.confirm(
      `Are you sure you want to remove ${studentName} from the classroom?`
    );
    if (!confirmRemove) return;

    setLoading(true);
    try {
      await classroomService.removeStudent(classroom.classroom_id, studentId);
      
      // Remove student from local state
      setStudents((prev) => prev.filter((s) => s.user_id !== studentId));
      
      // Close modal if this student was selected
      if (selectedStudent?.user_id === studentId) {
        setSelectedStudent(null);
      }
      
      alert(`${studentName} has been removed from the classroom.`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove student");
    } finally {
      setLoading(false);
    }
  };

  /** When teacher/admin clicks student → open modal with logs */
  const handleViewStudent = async (student: StudentWithScore) => {
    setSelectedStudent(student);
    setLoadingLogs(true);
    try {
      const logs = await getUserGameOverLogs(student.user_id);
      const filteredLogs = logs.filter((log: any) => log.user_id === student.user_id);
      setGameOverLogs(filteredLogs);
    } catch (err) {
      console.error("Failed to fetch gameover logs:", err);
      setGameOverLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  if (loading) {
    return (
      <>
        <ClassroomPageCSS />
        <div className="classroom-loading d-flex flex-column justify-content-center align-items-center">
          <div className="spinner-border text-white classroom-spinner mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white fw-bold">Loading classroom...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ClassroomPageCSS />
      <div className="classroom-page">
        {/* Back Button */}
        <button
          onClick={() => navigate(getBackPath())}
          className="btn classroom-back-btn"
        >
          ← Back
        </button>

        {/* Floating Background Elements */}
        <div className="classroom-bg-elements">
          <div className="classroom-symbol symbol-1">📚</div>
          <div className="classroom-symbol symbol-2">✏️</div>
          <div className="classroom-symbol symbol-3">🎓</div>
          <div className="classroom-symbol symbol-4">📖</div>
          <div className="classroom-symbol symbol-5">🏆</div>
          <div className="classroom-symbol symbol-6">⭐</div>
          <div className="classroom-symbol symbol-7">📝</div>
          <div className="classroom-symbol symbol-8">🎯</div>
          <div className="bg-circle circle-1"></div>
          <div className="bg-circle circle-2"></div>
          <div className="bg-circle circle-3"></div>
        </div>

        {/* Main Content */}
        <div className="container position-relative" style={{ zIndex: 2 }}>
          {error && (
            <div className="alert alert-danger classroom-alert mb-4">
              {error}
            </div>
          )}

          {/* Student join view */}
          {!isTeacher && !isAdmin && !classroom && (
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="card shadow-lg border-0 p-5 text-center classroom-join-card">
                  <div className="classroom-join-icon mb-3">🎓</div>
                  <h3 className="fw-bold mb-4 text-primary">Join a Classroom</h3>
                  {joinError && (
                    <div className="alert alert-danger classroom-alert mb-4">
                      {joinError}
                    </div>
                  )}
                  <form onSubmit={handleJoin}>
                    <input
                      type="text"
                      className="form-control form-control-lg text-center mb-3 classroom-code-input"
                      placeholder="Enter Classroom Code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      required
                    />
                    <button type="submit" className="btn btn-lg w-100 fw-bold classroom-join-btn">
                      Join Now →
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Teacher/Admin classrooms dashboard */}
          {(isTeacher || isAdmin) && !classroom && teacherClassrooms.length > 0 && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card shadow-lg border-0 p-4 classroom-list-card">
                  <h3 className="fw-bold mb-4 text-primary">📚 My Classrooms</h3>
                  <div className="d-grid gap-3">
                    {teacherClassrooms.map((c) => (
                      <div
                        key={c.classroom_id}
                        className="d-flex justify-content-between align-items-center classroom-card"
                        onClick={() => fetchClassroom(c.classroom_id)}
                        style={{ position: 'relative' }}
                      >
                        <div>
                          <h5 className="mb-2 fw-bold">{c.title}</h5>
                          <span className="badge classroom-card-badge">
                            📋 {c.code}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {/* Delete button */}
                          <button
                            className="btn btn-sm"
                            style={{
                              background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '16px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 8px rgba(238, 90, 111, 0.3)',
                            }}
                            onClick={(e) => handleDeleteClassroom(c.classroom_id, c.title, e)}
                            disabled={deletingClassroomId === c.classroom_id}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(238, 90, 111, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(238, 90, 111, 0.3)';
                            }}
                            title="Delete Classroom"
                          >
                            {deletingClassroomId === c.classroom_id ? "..." : "🗑️"}
                          </button>
                          <span className="classroom-card-arrow">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Classroom view with ProfileHeader */}
          {classroom && (
            <>
              {/* Header Section */}
              <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-white mb-3 text-glow">
                  {classroom.title}
                </h1>
                <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                  {(isTeacher || isAdmin) && (
                    <div className="badge classroom-header-badge">
                      📋 Code: {classroom.code}
                    </div>
                  )}
                  <div className="badge classroom-header-badge">
                    👥 Students: {students.length}
                  </div>
                  {!isTeacher && !isAdmin && (
                    <button
                      className="btn classroom-btn classroom-btn-danger px-4 py-2"
                      onClick={handleLeaveClassroom}
                      style={{ borderRadius: "20px", border: "2px solid white" }}
                    >
                      Leave Classroom
                    </button>
                  )}
                </div>
                {classroom.description && (
                  <p className="text-white mt-3 lead">{classroom.description}</p>
                )}
              </div>

              {/* Top Navigation Tabs */}
              <div className="d-flex justify-content-center mb-4">
                <div className="btn-group shadow-sm classroom-tabs" role="group">
                  <button 
                    className={`btn classroom-tab ${activeTab === 'students' ? 'active' : ''}`}
                    onClick={() => setActiveTab('students')}
                  >
                    👥 Students
                  </button>
                  <button 
                    className={`btn classroom-tab ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                  >
                    📊 Reports
                  </button>
                  <button 
                    className={`btn classroom-tab ${activeTab === 'messages' ? 'active' : ''}`}
                    onClick={() => setActiveTab('messages')}
                  >
                    💬 Messages
                  </button>
                </div>
              </div>

              {/* Students Grid with ProfileHeader */}
              {activeTab === 'students' && (
                <div className="row g-4 justify-content-center">
                  {students.length === 0 ? (
                    <div className="col-12 text-center text-white">
                      <div className="p-5 rounded-4 classroom-empty-state">
                        <h4>No students enrolled yet</h4>
                        <p>Students will appear here once they join the classroom.</p>
                      </div>
                    </div>
                  ) : (
                    students.map((student) => (
                      <div key={student.user_id} className="col-sm-6 col-md-4 col-lg-3">
                        <div
                          className={`student-card ${(isTeacher || isAdmin) ? 'clickable' : ''}`}
                          onClick={() => (isTeacher || isAdmin) && handleViewStudent(student)}
                        >
                          <ProfileHeader
                            userData={{
                              user_id: student.user_id,
                              username: student.username,
                              name: `${student.first_name} ${student.last_name}`,
                              avatar: (student as any).avatar,
                              favorite_color: (student as any).favorite_color,
                            }}
                            avatarSize={80}
                            badgeSize={24}
                            nickFrameSize={20}
                            textSize={16}
                          />
                          
                          {/* Score Badge */}
                          <div className="student-score-badge">
                            {student.total_score || 0}
                          </div>

                          {/* Teacher/Admin Controls */}
                          {(isTeacher || isAdmin) && (
                            <>
                              {/* Remove Student Button - Top Left */}
                              <button
                                className="btn student-remove-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveStudent(
                                    student.user_id,
                                    `${student.first_name} ${student.last_name}`
                                  );
                                }}
                                title="Remove Student"
                              >
                                ✕
                              </button>

                              {/* Add Points Button - Bottom Right */}
                              <button
                                className="btn student-add-points"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignPoints(student.user_id);
                                }}
                                title="Assign Points"
                              >
                                +
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === 'reports' && (
                <div className="row justify-content-center">
                  <div className="col-12">
                    <ClassroomReports 
                      classroomId={classroom.classroom_id}
                      students={students}
                    />
                  </div>
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="row justify-content-center">
                  <div className="col-lg-10 col-xl-8">
                    <ClassroomMessages 
                      classroomId={classroom.classroom_id}
                      classroomTitle={classroom.title}
                    />
                  </div>
                </div>
              )}

              {/* Copy Code & Delete Buttons for Teachers/Admins */}
              {(isTeacher || isAdmin) && (
                <div className="text-center mt-5">
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button
                      className="btn btn-lg classroom-copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(classroom.code);
                        alert("Class code copied to clipboard!");
                      }}
                    >
                      📋 Copy Class Code
                    </button>
                    
                    <button
                      className="btn btn-lg"
                      style={{
                        background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '12px 30px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 15px rgba(238, 90, 111, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={handleDeleteCurrentClassroom}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(238, 90, 111, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(238, 90, 111, 0.3)';
                      }}
                    >
                      🗑️ Delete Classroom
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <div
            className="modal fade show classroom-modal"
            onClick={() => setSelectedStudent(null)}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content classroom-modal-content">
                <div className="modal-header text-white classroom-modal-header">
                  <div>
                    <h5 className="modal-title fw-bold">
                      {selectedStudent.first_name} {selectedStudent.last_name}
                    </h5>
                    <small>@{selectedStudent.username}</small>
                  </div>
                  <button className="btn-close btn-close-white" onClick={() => setSelectedStudent(null)} />
                </div>
                <div className="modal-body classroom-modal-body">
                  <div className="text-center mb-4 classroom-score-display">
                    <h1 className="classroom-score-number mb-0">⭐ {selectedStudent.total_score || 0}</h1>
                    <small className="text-muted fw-bold">Total Points</small>
                  </div>

                  <h6 className="fw-bold mb-3">📊 Game Over Logs</h6>
                  {loadingLogs ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : gameOverLogs.length > 0 ? (
                    <div className="d-grid gap-2">
                      {gameOverLogs.map((g, i) => (
                        <div
                          key={i}
                          className="d-flex justify-content-between align-items-center classroom-log-item"
                        >
                          <span className="fw-bold">{g.page}</span>
                          <span className="badge bg-danger classroom-log-badge">
                            ❌ {g.total_gameover}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center py-3">No records found</p>
                  )}
                </div>
                <div className="modal-footer classroom-modal-footer">
                  {(isTeacher || isAdmin) && (
                    <>
                      <button
                        className="btn classroom-btn classroom-btn-success"
                        onClick={() => handleAssignPoints(selectedStudent.user_id)}
                      >
                        ➕ Assign Points
                      </button>
                      <button 
                        className="btn classroom-btn classroom-btn-warning" 
                        onClick={() => setShowRecommendModal(true)}
                      >
                        💡 Recommend
                      </button>
                      <button
                        className="btn classroom-btn classroom-btn-danger"
                        onClick={() =>
                          handleRemoveStudent(
                            selectedStudent.user_id,
                            `${selectedStudent.first_name} ${selectedStudent.last_name}`
                          )
                        }
                      >
                        🚫 Remove Student
                      </button>
                    </>
                  )}
                  <button 
                    className="btn classroom-btn classroom-btn-secondary" 
                    onClick={() => setSelectedStudent(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommend Modal */}
        {showRecommendModal && selectedStudent && user && (
          <RecommendModal
            teacherId={user.user_id}
            studentId={selectedStudent.user_id}
            studentName={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
            onClose={() => setShowRecommendModal(false)}
            onSent={() => setSelectedStudent(null)}
          />
        )}
      </div>
    </>
  );
};

export default ClassroomPage;