import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import StudentLoginModalCSS from "../styles/StudentLoginModalCSS";

interface Props {
  show: boolean;
  studentId: string;
  onClose: () => void;
  onSuccess: () => void;
  onBack: () => void;
}

const StudentLoginModal = ({
  show,
  onClose,
  onSuccess,
  onBack,
}: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (isLoggedIn && user?.role === "student") {
      onClose();
      onSuccess();
    }
  }, [isLoggedIn, user, onClose, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
    } catch {
      setError("Invalid username or password!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <StudentLoginModalCSS />

      <div className="sl-overlay" onClick={onClose}>
        <div className="sl-modal" onClick={(e) => e.stopPropagation()}>
          
          <div className="sl-header">
            <div className="sl-logo">🎮</div>
            <h2 className="sl-title">FILQUESTA</h2>
            <p className="sl-subtitle">Student Login Portal</p>
          </div>

          <div className="sl-body">
            {error && (
              <div className="sl-alert">⚠️ {error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="sl-form-group">
                <label className="sl-label">Username</label>
                <input
                  type="text"
                  className="sl-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="sl-form-group">
                <label className="sl-label">Password</label>
                <div className="sl-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="sl-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    style={{ paddingRight: "45px" }}
                  />
                  <button
                    type="button"
                    className="sl-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="sl-actions">
                <button
                  type="submit"
                  className="sl-btn sl-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="sl-spinner"></span>
                      LOGGING IN...
                    </>
                  ) : (
                    "🗝️ LOGIN"
                  )}
                </button>

                <button
                  type="button"
                  className="sl-btn sl-btn-secondary"
                  onClick={onBack}
                >
                  ⬅️ BACK
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentLoginModal;
