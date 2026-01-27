// src/components/Classroom/ClassroomReports.tsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "../../auth/axiosInstance";
import StudentQuizReviewModal from "../../modals/StudentQuizReviewModal";
import { getImageUrl } from "../../services/cosmeticService";

interface Student {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  total_score: number;
  game_score?: number;
  shared_quiz_score?: number;
}

interface ClassroomReportsProps {
  classroomId: number;
  students: Array<{
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    total_score?: number;
    favorite_color?: string;
  }>;
}

const ClassroomReports: React.FC<ClassroomReportsProps> = ({
  students,
}) => {
  const [studentsWithScores, setStudentsWithScores] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const fetchStudentScores = useCallback(async () => {
    setLoading(true);
    try {
      const studentsWithFullData = await Promise.all(
        students.map(async (student) => {
          try {
            const response = await axios.get(`/users/${student.user_id}/quiz-score`);
            
            console.log(`Quiz score for ${student.first_name}:`, response.data);
            
            const sharedQuizScore = response.data.shared_quiz_score || 0;
            const gameScore = student.total_score || 0;
            const totalScore = gameScore + sharedQuizScore;

            console.log(`Student ${student.first_name}: Game=${gameScore}, Quiz=${sharedQuizScore}, Total=${totalScore}`);

            return {
              user_id: student.user_id,
              username: student.username,
              first_name: student.first_name,
              last_name: student.last_name,
              avatar: student.avatar ? getImageUrl(student.avatar) : undefined,
              game_score: gameScore,
              shared_quiz_score: sharedQuizScore,
              total_score: totalScore,
            };
          } catch (error) {
            console.error(`Failed to fetch scores for student ${student.user_id}:`, error);
            return {
              user_id: student.user_id,
              username: student.username,
              first_name: student.first_name,
              last_name: student.last_name,
              avatar: student.avatar ? getImageUrl(student.avatar) : undefined,
              game_score: student.total_score || 0,
              shared_quiz_score: 0,
              total_score: student.total_score || 0,
            };
          }
        })
      );

      console.log('Final students with scores:', studentsWithFullData);
      setStudentsWithScores(studentsWithFullData);
    } catch (error) {
      console.error("Failed to fetch student scores:", error);
      const fallbackData = students.map(s => ({
        user_id: s.user_id,
        username: s.username,
        first_name: s.first_name,
        last_name: s.last_name,
        avatar: s.avatar ? getImageUrl(s.avatar) : undefined,
        game_score: s.total_score || 0,
        shared_quiz_score: 0,
        total_score: s.total_score || 0,
      }));
      setStudentsWithScores(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [students]);

  useEffect(() => {
    fetchStudentScores();
  }, [fetchStudentScores]);

  const getSortedStudents = () => {
    return [...studentsWithScores].sort((a, b) => b.total_score - a.total_score);
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return { emoji: '🥇', label: 'Gold', color: '#FFD700' };
    if (index === 1) return { emoji: '🥈', label: 'Silver', color: '#C0C0C0' };
    if (index === 2) return { emoji: '🥉', label: 'Bronze', color: '#CD7F32' };
    return { emoji: `#${index + 1}`, label: '', color: '#6c757d' };
  };

  const handleViewQuizReview = (student: Student) => {
    setSelectedStudent(student);
    setShowReviewModal(true);
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="reports-container">
          <div className="reports-header">
            <h3>📊 Classroom Reports</h3>
          </div>
          <div className="reports-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading student data...</p>
          </div>
        </div>
      </>
    );
  }

  const sortedStudents = getSortedStudents();

  return (
    <>
      <style>{styles}</style>
      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <h3>📊 Classroom Reports</h3>
          <p className="reports-subtitle">{students.length} Students</p>
        </div>

        {/* Statistics Summary */}
        <div className="reports-stats">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-value">
              {studentsWithScores.reduce((sum, s) => sum + (s.game_score || 0), 0)}
            </div>
            <div className="stat-label">Total Game Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">
              {studentsWithScores.reduce((sum, s) => sum + (s.shared_quiz_score || 0), 0)}
            </div>
            <div className="stat-label">Total Quiz Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">
              {studentsWithScores.length > 0
                ? Math.max(...studentsWithScores.map((s) => s.total_score))
                : 0}
            </div>
            <div className="stat-label">Highest Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">
              {studentsWithScores.reduce((sum, s) => sum + s.total_score, 0)}
            </div>
            <div className="stat-label">Total Points</div>
          </div>
        </div>

        {/* Student Rankings */}
        <div className="reports-body">
          {sortedStudents.length === 0 ? (
            <div className="empty-reports">
              <div className="empty-icon">📊</div>
              <h4>No student data available</h4>
              <p>Students will appear here once they're enrolled in the classroom.</p>
            </div>
          ) : (
            sortedStudents.map((student, index) => {
              const rank = getRankBadge(index);
              const initials = `${student.first_name.charAt(0)}${student.last_name.charAt(0)}`;

              return (
                <div key={student.user_id} className="report-card">
                  <div className="report-rank" style={{ color: rank.color }}>
                    {rank.emoji}
                  </div>
                  
                  <div className="report-avatar">
                    {student.avatar ? (
                      <img 
                        src={student.avatar} 
                        alt={student.username}
                        onError={(e) => {
                          console.error('Failed to load avatar:', student.avatar);
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector('span')) {
                            const span = document.createElement('span');
                            span.textContent = initials;
                            parent.appendChild(span);
                          }
                        }}
                        onLoad={() => {
                          console.log('Avatar loaded successfully:', student.avatar);
                        }}
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>

                  <div className="report-info">
                    <div className="report-name">
                      {student.first_name} {student.last_name}
                    </div>
                    <div className="report-username">@{student.username}</div>
                  </div>

                  <div className="report-scores">
                    <div className="score-item">
                      <span className="score-label">Game</span>
                      <span className="score-value">{student.game_score || 0}</span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Quiz</span>
                      <span className="score-value">{student.shared_quiz_score || 0}</span>
                    </div>
                    <div className="score-item total">
                      <span className="score-label">Total</span>
                      <span className="score-value">{student.total_score}</span>
                    </div>
                  </div>

                  {/* View Quiz Review Button - Fixed with optional chaining */}
                  {(student.shared_quiz_score || 0) > 0 && (
                    <button
                      className="view-review-btn"
                      onClick={() => handleViewQuizReview(student)}
                      title="View quiz review"
                    >
                      📝
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quiz Review Modal */}
      {showReviewModal && selectedStudent && (
        <StudentQuizReviewModal
          student={selectedStudent}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </>
  );
};

const styles = `
  .reports-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    max-width: 900px;
    margin: 0 auto;
  }

  .reports-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 30px;
    text-align: center;
  }

  .reports-header h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .reports-subtitle {
    margin: 8px 0 0 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }

  .reports-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    padding: 20px;
    background: #f8f9fa;
  }

  .stat-card {
    background: white;
    padding: 20px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
  }

  .stat-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .stat-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 5px;
  }

  .stat-label {
    font-size: 0.85rem;
    color: #6c757d;
    font-weight: 600;
  }

  .reports-body {
    padding: 20px;
    max-height: 500px;
    overflow-y: auto;
  }

  .reports-body::-webkit-scrollbar {
    width: 8px;
  }

  .reports-body::-webkit-scrollbar-track {
    background: #f8f9fa;
  }

  .reports-body::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
  }

  .report-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 15px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    position: relative;
  }

  .report-card:hover {
    border-color: #667eea;
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.2);
    transform: translateX(5px);
  }

  .report-rank {
    font-size: 1.5rem;
    font-weight: bold;
    min-width: 50px;
    text-align: center;
  }

  .report-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    flex-shrink: 0;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .report-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .report-avatar span {
    user-select: none;
  }

  .report-info {
    flex: 1;
    min-width: 0;
  }

  .report-name {
    font-weight: bold;
    font-size: 1rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .report-username {
    font-size: 0.85rem;
    color: #6c757d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .report-scores {
    display: flex;
    gap: 15px;
  }

  .score-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
  }

  .score-label {
    font-size: 0.75rem;
    color: #6c757d;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .score-value {
    font-size: 1.2rem;
    font-weight: bold;
    color: #667eea;
  }

  .score-item.total .score-value {
    font-size: 1.5rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .view-review-btn {
    padding: 8px 12px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  .view-review-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
  }

  .view-review-btn:active {
    transform: scale(0.95);
  }

  .empty-reports {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #6c757d;
    text-align: center;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .reports-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #6c757d;
  }

  @media (max-width: 768px) {
    .reports-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .report-card {
      flex-wrap: wrap;
    }

    .report-scores {
      width: 100%;
      justify-content: space-around;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #e9ecef;
    }

    .view-review-btn {
      margin-top: 10px;
    }
  }
`;

export default ClassroomReports;