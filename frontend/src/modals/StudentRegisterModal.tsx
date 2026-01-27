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

const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
  onSuccess,
  onClose,
}) => {
  const [step, setStep] = useState(0);

  const stepImages = [
    "/assets/students.jpg",
    "/assets/students2.jpg",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage(null);
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.first_name.trim()) newErrors.first_name = "Required";
      if (!formData.last_name.trim()) newErrors.last_name = "Required";
    } else if (step === 1) {
      if (!formData.username.trim()) newErrors.username = "Required";
      if (!formData.age.trim()) newErrors.age = "Required";
    } else if (step === 2) {
      if (!formData.address.trim()) newErrors.address = "Required";
      if (!formData.school.trim()) newErrors.school = "Required";
      if (!formData.section.trim()) newErrors.section = "Required";
    } else if (step === 3) {
      if (!formData.password.trim()) newErrors.password = "Required";
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

      const response = await AxiosInstance.post(
        "/register",
        formData
      );

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
                      {errors.first_name && (
                        <div className="sr-error-text">{errors.first_name}</div>
                      )}
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-label">Middle Name</label>
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
                      {errors.last_name && (
                        <div className="sr-error-text">{errors.last_name}</div>
                      )}
                    </div>
                  </>
                )}

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
                      {errors.username && (
                        <div className="sr-error-text">{errors.username}</div>
                      )}
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
                      {errors.age && (
                        <div className="sr-error-text">{errors.age}</div>
                      )}
                    </div>
                  </>
                )}

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
                      {errors.address && (
                        <div className="sr-error-text">{errors.address}</div>
                      )}
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-label">School</label>
                      <input
                        className={`sr-input ${errors.school ? "error" : ""}`}
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                      />
                      {errors.school && (
                        <div className="sr-error-text">{errors.school}</div>
                      )}
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-label">Section</label>
                      <input
                        className={`sr-input ${errors.section ? "error" : ""}`}
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                      />
                      {errors.section && (
                        <div className="sr-error-text">{errors.section}</div>
                      )}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="sr-form-group">
                      <label className="sr-label">Password</label>
                      <div className="sr-input-group">
                        <input
                          className={`sr-input ${errors.password ? "error" : ""}`}
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="sr-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {errors.password && (
                        <div className="sr-error-text">{errors.password}</div>
                      )}
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-label">Confirm Password</label>
                      <input
                        className={`sr-input ${
                          errors.password_confirmation ? "error" : ""
                        }`}
                        type={showPassword ? "text" : "password"}
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                      />
                      {errors.password_confirmation && (
                        <div className="sr-error-text">
                          {errors.password_confirmation}
                        </div>
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
                    {submitting ? "CREATING..." : "BEGIN QUEST"}
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
