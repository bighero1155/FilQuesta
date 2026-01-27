import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { filQuestaStyles } from "../styles/filquestaCSS";

const FilQuesta: React.FC = () => {
  const letters = "FILQUESTA".split("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: ""
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLetterClick = (letter: string, index: number) => {
    // The "A" is at index 8 (last letter)
    if (letter === "A" && index === 8) {
      setShowAdminLogin(true);
      setLoginError("");
    }
  };

  const handleAdminLogin = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      // Use the login function from AuthContext
      await login(adminCredentials.username, adminCredentials.password);
      
      // The login function will handle authentication
      // If successful, redirect to admin dashboard
      navigate('/Admin');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Only admin and teacher roles should be able to access
      setLoginError("Invalid credentials or insufficient permissions");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowAdminLogin(false);
    setAdminCredentials({ username: "", password: "" });
    setLoginError("");
  };

  return (
    <>
      <style>{filQuestaStyles}</style>

      <div className="fq-wrapper">
        <div className="fq-sparkle"></div>
        <div className="fq-sparkle"></div>
        <div className="fq-sparkle"></div>
        <div className="fq-sparkle"></div>
        <div className="fq-sparkle"></div>
        
        <div className="fq-container">
          {letters.map((letter, index) => (
            <span 
              key={index} 
              className={`fq-letter ${letter === "A" && index === 8 ? "clickable" : ""}`}
              data-letter={letter}
              onClick={() => handleLetterClick(letter, index)}
              title={letter === "A" && index === 8 ? "Admin Access" : ""}
            >
              {letter}
            </span>
          ))}
        </div>
        
        <div className="fq-subtitle">
          Quest Your Way To Knowledge
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="admin-login-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !isLoading) closeModal();
        }}>
          <div className="admin-login-modal">
            <div className="admin-login-header">
              <button 
                className="btn-close-modal"
                onClick={closeModal}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span style={{ marginLeft: '0.5rem' }}>Admin Access</span>
              </h2>
              <p>Enter your credentials to continue</p>
            </div>
            
            <div className="admin-login-body">
              {loginError && (
                <div className="login-error">
                  {loginError}
                </div>
              )}
              
              <div>
                <div className="login-form-group">
                  <label className="login-label">Username</label>
                  <div className="login-input-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-input-icon">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input
                      type="text"
                      className="login-input"
                      placeholder="Enter admin username"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials({
                        ...adminCredentials,
                        username: e.target.value
                      })}
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="login-form-group">
                  <label className="login-label">Password</label>
                  <div className="login-input-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-input-icon">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <input
                      type="password"
                      className="login-input"
                      placeholder="Enter admin password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials({
                        ...adminCredentials,
                        password: e.target.value
                      })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isLoading) {
                          handleAdminLogin(e);
                        }
                      }}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button onClick={handleAdminLogin} className="btn-login" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                      <span>Logging in</span>
                      <span className="loading-dots">
                        <span className="loading-dot"></span>
                        <span className="loading-dot"></span>
                        <span className="loading-dot"></span>
                      </span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <span style={{ marginLeft: '0.5rem' }}>Login to Admin Dashboard</span>
                    </>
                  )}
                </button>
              </div>

              <div className="admin-hint">
                Admin & Teacher Access Only
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilQuesta;