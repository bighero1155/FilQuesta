import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AxiosInstance from "../../auth/axiosInstance";
import {
  validateUserForm,
  mergeErrors,
  FieldErrors,
} from "../../Errors/UserFieldErrors";

type FormField =
  | "username"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "age"
  | "address"
  | "contact_number"
  | "email"
  | "password"
  | "confirm_password"
  | "role"
  | "section"
  | "school";

type FormDataType = Record<FormField, string>;

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    age: "",
    address: "",
    contact_number: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "teacher",
    section: "",
    school: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FormField;
    setFormData({ ...formData, [name]: e.target.value });
    setErrors({});
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const localErrors = validateUserForm(formData);

    if (formData.password !== formData.confirm_password) {
      localErrors.confirm_password = ["Passwords do not match"];
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirm_password: _, ...payload } = formData;
      const response = await AxiosInstance.post("/register", payload);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Registration successful.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error: any) {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors;
        setErrors(mergeErrors({}, serverErrors));
        
        // Set user-friendly message for common validation errors
        const errorFields = Object.keys(serverErrors);
        if (errorFields.includes('username')) {
          setMessage("Username is already taken!");
        } else if (errorFields.includes('email')) {
          setMessage("Email is already registered!");
        } else if (errorFields.includes('contact_number')) {
          setMessage("Contact number is already in use!");
        } else {
          setMessage("Please check the form for errors.");
        }
      } else if (error.response?.status === 500) {
        setMessage("Server error. Please try again later.");
      } else if (error.message === "Network Error") {
        setMessage("Connection failed. Check your internet.");
      } else {
        setMessage("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fieldLabels: Record<FormField, string> = {
    username: "Username",
    first_name: "First Name",
    middle_name: "Middle Name",
    last_name: "Last Name",
    age: "Age",
    address: "Address",
    contact_number: "Contact Number",
    email: "Email Address",
    password: "Password",
    confirm_password: "Confirm Password",
    role: "role",
    section: "Section",
    school: "School",
  };

  const step1Fields: FormField[] = ["username", "first_name", "middle_name", "last_name"];
  const step2Fields: FormField[] = ["email", "age", "contact_number", "address"];
  const step3Fields: FormField[] = ["section", "school"];

  const validateStep = (step: number): boolean => {
    const fieldsToCheck = step === 1 ? step1Fields : step === 2 ? step2Fields : step3Fields;
    return fieldsToCheck.every(field => {
      if (field === "middle_name") return true;
      return formData[field].trim() !== "";
    });
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="register-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .register-container {
          min-height: 100vh;
          background: url('/assets/teaching.jpg') center/cover no-repeat fixed;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        .register-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(13, 110, 253, 0.85);
          backdrop-filter: blur(3px);
        }

        .register-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          max-width: 700px;
          width: 100%;
          position: relative;
          z-index: 1;
          border: 4px solid #0d6efd;
        }

        .register-header {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          padding: 30px 25px;
          text-align: center;
          color: white;
          position: relative;
          border-radius: 16px 16px 0 0;
        }

        .back-button {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid white;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-family: 'Press Start 2P', cursive;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .back-button:hover {
          background: white;
          color: #0d6efd;
          transform: translateX(-3px);
        }

        .register-title {
          font-size: 1.5rem;
          font-family: 'Press Start 2P', cursive;
          margin-bottom: 10px;
          line-height: 1.6;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .register-subtitle {
          font-size: 0.7rem;
          font-family: 'Press Start 2P', cursive;
          opacity: 0.95;
          line-height: 1.5;
        }

        .progress-bar {
          background: #e9ecef;
          height: 8px;
          border-radius: 10px;
          overflow: hidden;
          margin: 20px 25px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0d6efd, #0a58ca);
          transition: width 0.4s ease;
          box-shadow: 0 0 10px rgba(13, 110, 253, 0.5);
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 0 25px 20px;
        }

        .step-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #dee2e6;
          transition: all 0.3s ease;
        }

        .step-dot.active {
          background: #0d6efd;
          transform: scale(1.3);
          box-shadow: 0 0 8px rgba(13, 110, 253, 0.6);
        }

        .register-body {
          padding: 30px 25px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: #0d6efd;
          line-height: 1.5;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border: 3px solid #0d6efd;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: white;
          color: #000;
          font-family: Arial, sans-serif;
        }

        .form-input:focus {
          outline: none;
          border-color: #0a58ca;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.2);
          transform: translateY(-2px);
        }

        .form-input.error {
          border-color: #dc3545;
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #0d6efd;
          font-size: 18px;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #0a58ca;
        }

        .error-message {
          color: #dc3545;
          font-size: 0.55rem;
          margin-top: 6px;
          font-family: 'Press Start 2P', cursive;
          line-height: 1.5;
        }

        .alert-message {
          padding: 14px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.6rem;
          font-family: 'Press Start 2P', cursive;
          text-align: center;
          line-height: 1.6;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .alert-success {
          background: rgba(25, 135, 84, 0.15);
          color: #198754;
          border: 3px solid #198754;
        }

        .alert-error {
          background: rgba(220, 53, 69, 0.15);
          color: #dc3545;
          border: 3px solid #dc3545;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn {
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-family: 'Press Start 2P', cursive;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
          line-height: 1.5;
        }

        .btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
        }

        .btn-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          color: white;
          flex: 1;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #0a58ca 0%, #084298 100%);
          transform: translateY(-2px);
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5c636a;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          line-height: 1.8;
        }

        .login-link a {
          color: #0d6efd;
          text-decoration: none;
          margin-left: 4px;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        .step-content {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .register-header {
            padding: 25px 20px;
          }

          .register-title {
            font-size: 1rem;
          }

          .register-subtitle {
            font-size: 0.6rem;
          }

          .register-body {
            padding: 25px 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .back-button {
            font-size: 0.6rem;
            padding: 6px 12px;
          }

          .button-group {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .form-label {
            font-size: 0.55rem;
          }

          .btn {
            font-size: 0.6rem;
          }
        }

        @media (max-width: 480px) {
          .register-container {
            padding: 10px;
          }

          .register-card {
            border-radius: 16px;
          }

          .register-title {
            font-size: 0.9rem;
          }

          .register-subtitle {
            font-size: 0.5rem;
          }

          .form-label {
            font-size: 0.5rem;
          }

          .error-message {
            font-size: 0.5rem;
          }

          .alert-message {
            font-size: 0.55rem;
          }

          .btn {
            font-size: 0.55rem;
            padding: 12px 20px;
          }

          .login-link {
            font-size: 0.55rem;
          }
        }

        input:-webkit-autofill {
          -webkit-text-fill-color: #000 !important;
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
        }
      `}</style>

      <div className="register-card">
        <div className="register-header">
          <Link to="/login" className="back-button">
            ← BACK
          </Link>
          <h1 className="register-title">JOIN FILQUESTA</h1>
          <p className="register-subtitle">Create Your Teacher Account</p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
        </div>

        <div className="step-indicator">
          <div className={`step-dot ${currentStep >= 1 ? 'active' : ''}`}></div>
          <div className={`step-dot ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className={`step-dot ${currentStep >= 3 ? 'active' : ''}`}></div>
          <div className={`step-dot ${currentStep >= 4 ? 'active' : ''}`}></div>
        </div>

        <div className="register-body">
          {message && (
            <div className={`alert-message ${message.includes("successful") ? "alert-success" : "alert-error"}`}>
              {message}
            </div>
          )}

          {Object.keys(errors).length > 0 && !message && (
            <div className="alert-message alert-error">
              Please review the previous sections to continue
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="step-content">
                <div className="form-row">
                  {step1Fields.map((field) => (
                    <div key={field} className="form-group">
                      <label className="form-label">{fieldLabels[field]}</label>
                      <input
                        type="text"
                        name={field}
                        placeholder={fieldLabels[field]}
                        value={formData[field]}
                        onChange={handleChange}
                        className={`form-input ${errors[field] ? 'error' : ''}`}
                      />
                      {errors[field]?.map((err, i) => (
                        <div key={i} className="error-message">{err}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <div className="form-row">
                  {step2Fields.map((field) => (
                    <div key={field} className="form-group">
                      <label className="form-label">{fieldLabels[field]}</label>
                      <input
                        type={field === "email" ? "email" : field === "age" ? "number" : "text"}
                        name={field}
                        placeholder={fieldLabels[field]}
                        value={formData[field]}
                        onChange={handleChange}
                        className={`form-input ${errors[field] ? 'error' : ''}`}
                      />
                      {errors[field]?.map((err, i) => (
                        <div key={i} className="error-message">{err}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <div className="form-row">
                  {step3Fields.map((field) => (
                    <div key={field} className="form-group">
                      <label className="form-label">{fieldLabels[field]}</label>
                      <input
                        type="text"
                        name={field}
                        placeholder={fieldLabels[field]}
                        value={formData[field]}
                        onChange={handleChange}
                        className={`form-input ${errors[field] ? 'error' : ''}`}
                      />
                      {errors[field]?.map((err, i) => (
                        <div key={i} className="error-message">{err}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="step-content">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-input ${errors.password ? 'error' : ''}`}
                      />
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} password-toggle`}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                    {errors.password?.map((err, i) => (
                      <div key={i} className="error-message">{err}</div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirm_password"
                        placeholder="Re-enter Password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className={`form-input ${errors.confirm_password ? 'error' : ''}`}
                      />
                      <i
                        className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"} password-toggle`}
                        onClick={() => setShowConfirm(!showConfirm)}
                      />
                    </div>
                    {errors.confirm_password?.map((err, i) => (
                      <div key={i} className="error-message">{err}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="button-group">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn btn-secondary">
                  PREVIOUS
                </button>
              )}
              {currentStep < 4 ? (
                <button type="button" onClick={nextStep} className="btn btn-primary">
                  NEXT
                </button>
              ) : (
                <button type="submit" disabled={isLoading} className="btn btn-primary">
                  {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
                </button>
              )}
            </div>
          </form>

          <div className="login-link">
            Already have account?
            <a href="/login">Login here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;