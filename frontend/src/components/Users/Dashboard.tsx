// src/components/Users/Dashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "../../auth/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import LeaderboardModal from "../../modals/LeaderboardModal";
import { Link } from "react-router-dom";
import UserManagement from "../Users/UserManagement";
import QuizResultsTable from "../Users/QuizResultsTable";

interface DashboardData {
  studentsCount: number;
  teachersCount: number;
}

interface RawUser {
  user_id: number;
  username?: string;
  first_name?: string | null;
  last_name?: string | null;
  section?: string | null;
  role?: "student" | "teacher" | "admin" | string;
}

interface SectionCount {
  name: string;
  count: number;
}

interface PageVisit {
  id: number;
  user_id: number;
  page: string;
  visit_count: number;
  total_time_spent: number;
  updated_at: string;
  user?: {
    username?: string;
  };
}

interface QuizResult {
  submission_id: number;
  student_id: number;
  student_name: string;
  quiz_id: number;
  quiz_title: string;
  score: number;
  total: number;
  submitted_at: string;
}

interface SharedQuizResult {
  participant_id: number;
  student_id: number;
  student_name: string;
  quiz_title: string;
  score: number;
  total: number;
  finished_at: string | null;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [sections, setSections] = useState<SectionCount[]>([]);
  const [pageVisits, setPageVisits] = useState<PageVisit[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [sharedQuizResults, setSharedQuizResults] = useState<SharedQuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        const [statsRes, usersRes, visitsRes, resultsRes, sharedResultsRes] =
          await Promise.allSettled([
            axios.get("/dashboard-data"),
            axios.get("/users"),
            axios.get("/page-visits"),
            axios.get("/quiz-results"),
            axios.get("/shared-quiz-results"),
          ]);

        if (statsRes.status === "fulfilled") {
          setData(statsRes.value.data);
        }

        if (usersRes.status === "fulfilled") {
          const users = usersRes.value.data as RawUser[];

          const map = new Map<string, number>();
          users.forEach((u) => {
            const raw = (u.section ?? "").toString().trim();
            const key = raw.length > 0 ? raw : "Unassigned";
            map.set(key, (map.get(key) || 0) + 1);
          });

          const sectionArray: SectionCount[] = Array.from(map.entries()).map(
            ([name, count]) => ({ name, count })
          );
          sectionArray.sort((a, b) => b.count - a.count);
          setSections(sectionArray);

          if (!data) {
            const studentsCount = users.filter((u) => u.role === "student").length;
            const teachersCount = users.filter((u) => u.role === "teacher").length;
            setData({ studentsCount, teachersCount });
          }
        }

        if (visitsRes.status === "fulfilled") {
          console.log("🔍 Page Visits Response:", visitsRes.value);
          console.log("🔍 Page Visits Data:", visitsRes.value.data);
          const visits = Array.isArray(visitsRes.value.data) 
            ? visitsRes.value.data 
            : visitsRes.value.data?.data || [];
          setPageVisits(visits);
        } else {
          console.error("❌ Page Visits Failed:", visitsRes);
        }

        if (resultsRes.status === "fulfilled") {
          console.log("🔍 Quiz Results Response:", resultsRes.value);
          console.log("🔍 Quiz Results Data:", resultsRes.value.data);
          const results = Array.isArray(resultsRes.value.data)
            ? resultsRes.value.data
            : resultsRes.value.data?.data || [];
          setQuizResults(results);
        } else {
          console.error("❌ Quiz Results Failed:", resultsRes);
        }

        if (sharedResultsRes.status === "fulfilled") {
          console.log("🔍 Shared Quiz Results Response:", sharedResultsRes.value);
          console.log("🔍 Shared Quiz Results Data:", sharedResultsRes.value.data);
          const sharedResults = Array.isArray(sharedResultsRes.value.data)
            ? sharedResultsRes.value.data
            : sharedResultsRes.value.data?.data || [];
          setSharedQuizResults(sharedResults);
        } else {
          console.error("❌ Shared Quiz Results Failed:", sharedResultsRes);
        }
      } catch (err: any) {
        console.error("Failed to fetch dashboard resources:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="container-fluid px-4 py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted fw-normal">Loading your dashboard...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-4 py-4">
        <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center" role="alert" style={{ borderRadius: '12px' }}>
          <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
          <div className="fw-semibold">{error}</div>
        </div>
      </div>
    );
  }

  const totalUsers = (data?.studentsCount ?? 0) + (data?.teachersCount ?? 0);
  const totalSections = sections.length;

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="h2 mb-2 text-dark fw-bold d-flex align-items-center">
              <span className="me-2">👋</span>
              Welcome back, {user?.first_name ?? user?.username}!
            </h1>
            <p className="text-muted mb-0">Here's what's happening with your platform today</p>
          </div>
          <Link to="/QuizDashboard" className="btn btn-primary btn-lg shadow-sm px-4" style={{ borderRadius: '10px' }}>
            <i className="bi bi-journal-text me-2"></i>
            Manage Quizzes
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="bg-primary bg-gradient text-white rounded-3 p-3">
                  <i className="bi bi-people-fill fs-3"></i>
                </div>
                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">Active</span>
              </div>
              <h2 className="mb-2 fw-bold text-dark">{data?.studentsCount ?? 0}</h2>
              <p className="text-muted mb-0 small fw-semibold">TOTAL STUDENTS</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="bg-success bg-gradient text-white rounded-3 p-3">
                  <i className="bi bi-person-workspace fs-3"></i>
                </div>
                <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">Active</span>
              </div>
              <h2 className="mb-2 fw-bold text-dark">{data?.teachersCount ?? 0}</h2>
              <p className="text-muted mb-0 small fw-semibold">TOTAL TEACHERS</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="bg-info bg-gradient text-white rounded-3 p-3">
                  <i className="bi bi-diagram-3-fill fs-3"></i>
                </div>
                <span className="badge bg-info-subtle text-info rounded-pill px-3 py-2">Total</span>
              </div>
              <h2 className="mb-2 fw-bold text-dark">{totalUsers}</h2>
              <p className="text-muted mb-0 small fw-semibold">ALL USERS</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="bg-warning bg-gradient text-white rounded-3 p-3">
                  <i className="bi bi-grid-3x3-gap-fill fs-3"></i>
                </div>
                <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-2">Active</span>
              </div>
              <h2 className="mb-2 fw-bold text-dark">{totalSections}</h2>
              <p className="text-muted mb-0 small fw-semibold">SECTIONS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard & Sections Row */}
      <div className="row g-3 mb-4">
        {/* Leaderboard Card */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="bg-white bg-opacity-25 rounded-3 p-3 d-inline-flex mb-3">
                  <i className="bi bi-trophy-fill fs-2 text-white"></i>
                </div>
                <h4 className="text-white mb-2 fw-bold">Student Rankings</h4>
                <p className="text-white text-opacity-75 mb-4">
                  View top performing students and their achievements
                </p>
              </div>
              <button
                className="btn btn-light shadow-sm fw-semibold"
                onClick={() => setShowLeaderboard(true)}
                style={{ borderRadius: '8px' }}
              >
                <i className="bi bi-trophy me-2"></i>
                View Leaderboard
              </button>
            </div>
          </div>
        </div>

        {/* Sections Overview */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-white border-0 py-3 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
                  <i className="bi bi-folder-fill me-2 text-primary"></i>
                  Students by Section
                </h5>
                <span className="badge bg-primary rounded-pill px-3 py-2">
                  {totalSections} {totalSections === 1 ? 'section' : 'sections'}
                </span>
              </div>
            </div>
            <div className="card-body p-4" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {sections.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-inbox display-4 text-muted opacity-25 mb-3 d-block"></i>
                  <p className="text-muted mb-0">No sections available yet</p>
                </div>
              ) : (
                <div className="row g-3">
                  {sections.map((section) => (
                    <div key={section.name} className="col-6 col-md-4 col-xl-3">
                      <div className="card border-0 shadow-sm text-center" style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                        <div className="card-body py-3 px-2">
                          <div className="bg-primary bg-gradient text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                            <i className="bi bi-folder-fill fs-5"></i>
                          </div>
                          <div className="fw-bold text-dark mb-1 small text-truncate" title={section.name}>
                            {section.name}
                          </div>
                          <div className="h5 mb-0 fw-bold text-primary">
                            {section.count}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-4">
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="card-header bg-white border-0 py-3 px-4">
            <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
              <i className="bi bi-activity me-2 text-primary"></i>
              Recent Activity
            </h5>
          </div>
          <div className="card-body p-0">
            <QuizResultsTable
              pageVisits={pageVisits}
              quizResults={quizResults}
              sharedQuizResults={sharedQuizResults}
            />
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-white border-0 py-3 px-4">
          <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
            <i className="bi bi-people-fill me-2 text-primary"></i>
            User Management
          </h5>
        </div>
        <div className="card-body p-4">
          <UserManagement />
        </div>
      </div>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        show={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  );
};

export default Dashboard;