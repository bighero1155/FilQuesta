import React, { useState } from "react";
import AxiosInstance from "../auth/axiosInstance";
import { UserFormData } from "../Errors/UserFieldErrors";
import StudentRegisterModalCSS from "../styles/StudentRegisterModalCSS";

interface StudentRegisterModalProps {
  onSuccess: (studentId: string) => void;
  onClose: () => void;
}

type StudentFormData = Pick<
  UserFormData,
  | "first_name"
  | "middle_name"
  | "last_name"
  | "username"
  | "age"
  | "address"
  | "password"
  | "role"
> & {
  school: string;
  section: string;
  password_confirmation: string;
};

// ── Password strength helper ──────────────────────────────────────────────────
type StrengthLevel = "too-short" | "weak" | "fair" | "good" | "strong";

const getPasswordStrength = (password: string): StrengthLevel => {
  if (password.length === 0) return "too-short";
  if (password.length < 8) return "too-short";

  const hasUpper  = /[A-Z]/.test(password);
  const hasLower  = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const isLong    = password.length >= 12;

  const score = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

  if (score === 1) return "weak";
  if (score === 2) return "fair";
  if (score >= 3 && isLong) return "strong";
  if (score === 3) return "good";
  return "good";
};

const strengthConfig: Record<StrengthLevel, { label: string; color: string; bars: number }> = {
  "too-short": { label: "Min. 8 characters required", color: "#adb5bd", bars: 0 },
  weak:        { label: "Weak",                        color: "#ff6b6b", bars: 1 },
  fair:        { label: "Fair",                        color: "#fd7e14", bars: 2 },
  good:        { label: "Good",                        color: "#feca57", bars: 3 },
  strong:      { label: "Strong 💪",                   color: "#00ff88", bars: 4 },
};
// ─────────────────────────────────────────────────────────────────────────────

const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
  onSuccess,
  onClose,
}) => {
  const [step, setStep] = useState(0);

  const stepImages = [
    "/assets/students.jpg",
    "/assets/students.jpg",
    "/assets/school.jpg",
    "/assets/lock.jpg",
  ];

  const [formData, setFormData] = useState<StudentFormData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    age: "",
    address: "",
    school: "",
    section: "",
    password: "",
    password_confirmation: "",
    role: "student",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // derived strength
  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo     = strengthConfig[passwordStrength];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage(null);
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.first_name.trim()) newErrors.first_name = "Required";
      if (!formData.last_name.trim())  newErrors.last_name  = "Required";
    } else if (step === 1) {
      if (!formData.username.trim()) newErrors.username = "Required";
      if (!formData.age.trim())      newErrors.age      = "Required";
    } else if (step === 2) {
      if (!formData.address.trim()) newErrors.address = "Required";
      if (!formData.school.trim())  newErrors.school  = "Required";
      if (!formData.section.trim()) newErrors.section = "Required";
    } else if (step === 3) {
      if (!formData.password.trim()) {
        newErrors.password = "Required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (formData.password.length > 72) {
        newErrors.password = "Password must not exceed 72 characters";
      }
      if (!formData.password_confirmation.trim()) {
        newErrors.password_confirmation = "Confirm password";
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
      setMessage(null);
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(0, s - 1));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      setSubmitting(true);
      setMessage(null);

      const response = await AxiosInstance.post("/register", formData);

      setMessage({ type: "success", text: "Registration successful!" });

      setTimeout(() => {
        onSuccess(response.data.user.user_id);
      }, 1000);
    } catch (error: any) {
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        const formattedErrors: Record<string, string> = {};

        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = backendErrors[key][0];
        });

        if (backendErrors.username) {
          setMessage({ type: "error", text: "Username is already taken!" });
          setStep(1);
        } else {
          setMessage({ type: "error", text: "Please fix the errors below." });
        }

        setErrors(formattedErrors);
      } else {
        setMessage({ type: "error", text: "Registration failed. Try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <StudentRegisterModalCSS />

      <div className="sr-overlay" onClick={onClose}>
        <div className="sr-modal" onClick={(e) => e.stopPropagation()}>

          <div className="sr-header">
            <img src={stepImages[step]} className="sr-header-image" />
            <div className="sr-header-content">
              <h2 className="sr-title">JOIN AS STUDENT</h2>
              <div className="sr-progress">
                <div
                  className="sr-progress-fill"
                  style={{ width: `${((step + 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="sr-body">
            {message && (
              <div className={`sr-alert sr-alert-${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="sr-step-content" key={step}>

                {/* ── Step 0: Name ── */}
                {step === 0 && (
                  <>
                    <div className="sr-form-group">
                      <label className="sr-label">First Name</label>
                      <input
                        className={`sr-input ${errors.first_name ? "error" : ""}`}
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      {errors.first_name && <div className="sr-error-text">{errors.first_name}</div>}
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-label">Middle Name (Optional)</label>
                      <input
                        className="sr-input"
                        name="middle_name"
                        value={formData.middle_name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-label">Last Name</label>
                      <input
                        className={`sr-input ${errors.last_name ? "error" : ""}`}
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                      {errors.last_name && <div className="sr-error-text">{errors.last_name}</div>}
                    </div>
                  </>
                )}

                {/* ── Step 1: Account ── */}
                {step === 1 && (
                  <>
                    <div className="sr-form-group">
                      <label className="sr-label">Username</label>
                      <input
                        className={`sr-input ${errors.username ? "error" : ""}`}
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      {errors.username && <div className="sr-error-text">{errors.username}</div>}
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-label">Age</label>
                      <input
                        className={`sr-input ${errors.age ? "error" : ""}`}
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        type="number"
                      />
                      {errors.age && <div className="sr-error-text">{errors.age}</div>}
                    </div>
                  </>
                )}

                {/* ── Step 2: School ── */}
                {step === 2 && (
                  <>
                    <div className="sr-form-group">
                      <label className="sr-label">Address</label>
                      <input
                        className={`sr-input ${errors.address ? "error" : ""}`}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errors.address && <div className="sr-error-text">{errors.address}</div>}
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-label">School</label>
                      <input
                        className={`sr-input ${errors.school ? "error" : ""}`}
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                      />
                      {errors.school && <div className="sr-error-text">{errors.school}</div>}
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-label">Section</label>
                      <input
                        className={`sr-input ${errors.section ? "error" : ""}`}
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                      />
                      {errors.section && <div className="sr-error-text">{errors.section}</div>}
                    </div>
                  </>
                )}

                {/* ── Step 3: Password ── */}
                {step === 3 && (
                  <>
                    <div className="sr-form-group">
                      <label className="sr-label">Password</label>
                      <div className="sr-input-group">
                        <input
                          className={`sr-input ${errors.password ? "error" : ""}`}
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Min. 8 characters"
                          value={formData.password}
                          onChange={handleChange}
                          maxLength={72}
                        />
                        <button
                          type="button"
                          className="sr-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>

                      {/* Strength meter */}
                      {formData.password.length > 0 && (
                        <div className="sr-strength-wrapper">
                          <div className="sr-strength-bars">
                            {[1, 2, 3, 4].map((bar) => (
                              <div
                                key={bar}
                                className="sr-strength-bar"
                                style={{
                                  background: strengthInfo.bars >= bar ? strengthInfo.color : "rgba(255,255,255,0.1)",
                                }}
                              />
                            ))}
                          </div>
                          <div className="sr-strength-label" style={{ color: strengthInfo.color }}>
                            {strengthInfo.label}
                          </div>
                          {passwordStrength !== "strong" && formData.password.length >= 8 && (
                            <div className="sr-strength-hint">
                              {!/[A-Z]/.test(formData.password) && <span>+ uppercase</span>}
                              {!/[0-9]/.test(formData.password) && <span>+ number</span>}
                              {!/[^A-Za-z0-9]/.test(formData.password) && <span>+ symbol</span>}
                              {formData.password.length < 12 && <span>+ 12+ chars</span>}
                            </div>
                          )}
                        </div>
                      )}

                      {errors.password && <div className="sr-error-text">{errors.password}</div>}
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-label">Confirm Password</label>
                      <input
                        className={`sr-input ${errors.password_confirmation ? "error" : ""}`}
                        type={showPassword ? "text" : "password"}
                        name="password_confirmation"
                        placeholder="Re-enter password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        maxLength={72}
                      />
                      {/* Live match indicator */}
                      {formData.password_confirmation.length > 0 && (
                        <div
                          className="sr-match-label"
                          style={{
                            color: formData.password === formData.password_confirmation
                              ? "#00ff88"
                              : "#ff6b6b",
                          }}
                        >
                          {formData.password === formData.password_confirmation
                            ? "✓ Passwords match"
                            : "✗ Passwords do not match"}
                        </div>
                      )}
                      {errors.password_confirmation && (
                        <div className="sr-error-text">{errors.password_confirmation}</div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="sr-actions">
                <button
                  type="button"
                  className="sr-btn sr-btn-secondary"
                  onClick={step === 0 ? onClose : prevStep}
                >
                  {step === 0 ? "CANCEL" : "PREVIOUS"}
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    className="sr-btn sr-btn-primary"
                    onClick={nextStep}
                  >
                    NEXT
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="sr-btn sr-btn-success"
                    disabled={submitting}
                  >
                    {submitting ? "CREATING..." : "BEGIN"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentRegisterModal;