// src/modals/GameProgressModal.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AxiosInstance from "../auth/axiosInstance";

interface LevelProgress {
  id: number;
  user_id: number;
  game_name: string;
  unlocked_levels: number;
  updated_at: string;
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

interface GameProgressModalProps {
  show: boolean;
  onClose: () => void;
}

const normalizeArray = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (payload.data && Array.isArray(payload.data)) return payload.data;
  if (payload.results && Array.isArray(payload.results)) return payload.results;
  return [];
};

// Helper function to format date with full month name and day abbreviation
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',  // Mon, Tue, Wed, etc.
    year: 'numeric',
    month: 'long',     // January, February, March, etc.
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return date.toLocaleDateString('en-US', options);
};

const GameProgressModal: React.FC<GameProgressModalProps> = ({
  show,
  onClose,
}) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LevelProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show || !user) return;

    let mounted = true;
    const rawId =
      (user as any)?.user_id ?? (user as any)?.id ?? (user as any)?.userId;
    const userId = Number(rawId || 0);
    if (!userId) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch quests progress and quiz results like Dashboard
        const [progressRes, resultsRes] = await Promise.allSettled([
          AxiosInstance.get(`/users/${userId}/levels`),
          AxiosInstance.get(`/quiz-results`), 
        ]);

        // Quests Progress
        if (progressRes.status === "fulfilled") {
          const p = normalizeArray(progressRes.value.data ?? progressRes.value);
          if (mounted) setProgress(p);
        } else {
          console.warn("levels fetch failed:", progressRes.reason);
        }

        // Quiz Results
        if (resultsRes.status === "fulfilled") {
          const raw = normalizeArray(resultsRes.value.data ?? resultsRes.value);
          if (mounted) setQuizResults(raw as QuizResult[]); 
        } else {
          console.warn("quiz results fetch failed:", resultsRes.reason);
        }
      } catch (e) {
        console.error("fetchAll error:", e);
        if (mounted) setError("Failed to fetch progress or quiz results.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [show, user]);

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Quests & Quiz Progress</h2>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {loading ? (
          <p>Loading progress...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <h3>Game Quests</h3>
            {progress.length > 0 ? (
              <table className="progress-table">
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Unlocked Levels</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((p) => (
                    <tr key={p.id}>
                      <td>{p.game_name}</td>
                      <td>{p.unlocked_levels}</td>
                      <td>{formatDate(p.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No quest progress found.</p>
            )}

            <h3 style={{ marginTop: 18 }}>Quiz Results</h3>
            {quizResults.length > 0 ? (
              <table className="progress-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((r) => (
                    <tr key={r.submission_id}>
                      <td>{r.student_name}</td>
                      <td>{r.quiz_title}</td>
                      <td>{r.score}</td>
                      <td>{r.total}</td>
                      <td>
                        {r.submitted_at ? formatDate(r.submitted_at) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No quiz results found.</p>
            )}
          </>
        )}
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; top:0; left:0; right:0; bottom:0;
          background: rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:2000;
        }
        .modal-content {
          background:#f0f8ff; color:#1560bd; padding:25px; border-radius:12px; width:600px; max-width:90%;
          box-shadow:0 0 20px rgba(255,255,255,0.3); font-family:"Press Start 2P", monospace; position:relative;
        }
        .modal-content h2 { margin-bottom: 12px; text-align:center; }
        .close-btn { position:absolute; top:15px; right:15px; background:transparent; border:none; font-size:18px; cursor:pointer; color:#1560bd; }
        .progress-table { width:100%; border-collapse:collapse; font-size:12px; margin-bottom:12px; }
        .progress-table th, .progress-table td { border:1px solid #1560bd; padding:8px; text-align:center; }
        .progress-table th { background: skyblue; color:white; }
        .progress-table tr:nth-child(even) { background: rgba(173,216,230,0.4); }
      `}</style>
    </div>
  );
};

export default GameProgressModal;