import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TeachersLoginCSS from "../styles/TeachersLoginCSS";
import FallingLeaves from "../styles/FallingLeaves";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const redirectToDashboard = useCallback((role: "student" | "teacher" | "admin") => {
    switch (role) {
      case "admin":
      case "teacher":
        navigate("/dashboard", { replace: true });
        break;
      case "student":
        localStorage.clear();
        navigate("/", { replace: true });
        break;
      default:
        localStorage.clear();
        navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn && user) {
      redirectToDashboard(user.role);
    }
  }, [isLoggedIn, user, redirectToDashboard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(identifier, password);
    } catch {
      setError("Invalid username/email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TeachersLoginCSS />
      <FallingLeaves config={{ maxLeaves: 20, leafInterval: 250 }} />
      
      <div className="teachers-login-container">
        {/* Glowing faded circles */}
        <div className="teachers-login-glow-1"></div>
        <div className="teachers-login-glow-2"></div>

        {/* Back button */}
        <div className="teachers-login-back-btn-wrapper">
          <Link to="/" className="teachers-login-back-btn">
            ⬅ Back
          </Link>
        </div>

        {/* Login card */}
        <div className="teachers-login-card-wrapper">
          <div className="teachers-login-card">
            <div className="teachers-login-header">
              <h2 className="teachers-login-title">Welcome Teachers</h2>
              <p className="teachers-login-subtitle">Access Your Teaching Dashboard</p>
            </div>

            {error && (
              <div className="teachers-login-alert">
                <span className="teachers-login-alert-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="teachers-login-form-group">
                <label htmlFor="identifier" className="teachers-login-label">
                  Username or Email
                </label>
                <input
                  type="text"
                  className="teachers-login-input"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="Enter username or email"
                />
              </div>

              <div className="teachers-login-form-group">
                <label htmlFor="password" className="teachers-login-label">
                  Password
                </label>
                <input
                  type="password"
                  className="teachers-login-input"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                className="teachers-login-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="teachers-login-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <span>🔐</span> Teacher Login
                  </>
                )}
              </button>
            </form>

            <div className="teachers-login-register-section">
              <div className="teachers-login-register-box">
                <span className="teachers-login-register-text">
                  Don't have an account?
                </span>
                <Link to="/register" className="teachers-login-register-link">
                  Register now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;