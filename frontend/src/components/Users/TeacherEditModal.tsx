import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateUser } from "../../services/userService";
import { getImageUrl } from "../../services/cosmeticService";
import TeacherEditModalCSS from "../../styles/TeacherEditModalCSS";

interface Props {
  show: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  "/assets/teacher1.jpg",
  "/assets/teacher2.jpg",
  "/assets/fteacher1.jpg",
  "/assets/fteacher2.jpg",
  "/assets/fteacher3.jpg",
];

const TeacherEditModal: React.FC<Props> = ({ show, onClose }) => {
  const { user } = useAuth();

  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!show || !user) return;

    const stored = JSON.parse(localStorage.getItem("user") || "{}");

    setForm({
      first_name: stored.first_name || "",
      middle_name: stored.middle_name || "",
      last_name: stored.last_name || "",
      username: stored.username || "",
      email: stored.email || "",
      contact_number: stored.contact_number || "",
      age: stored.age || "",
      address: stored.address || "",
      school: stored.school || "",
      section: stored.section || "",
      password: "",
      avatar: stored.avatar || "",
    });

    setSelectedAvatar(stored.avatar || null);
    setErrors({});
    setMessage(null);
  }, [show, user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
    setErrors({});
    setMessage(null);
  };

  const handleAvatarSelect = (url: string) => {
    setSelectedAvatar(url);
    setForm((f: any) => ({ ...f, avatar: url }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setMessage(null);
    setErrors({});

    const payload: any = { ...form, role: "teacher" };
    if (!form.password) delete payload.password;

    try {
      const updated = await updateUser((user as any).user_id, payload);

      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...updated }));

      setMessage({ type: "success", text: "Profile updated successfully!" });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      if (err.response?.status === 422) {
        const serverErrors = err.response.data.errors;
        setErrors(serverErrors);

        const keys = Object.keys(serverErrors);
        if (keys.includes("username")) {
          setMessage({ type: "error", text: "Username is already taken!" });
        } else if (keys.includes("email")) {
          setMessage({ type: "error", text: "Email is already in use!" });
        } else if (keys.includes("contact_number")) {
          setMessage({ type: "error", text: "Contact number is already in use!" });
        } else {
          setMessage({ type: "error", text: "Please fix the errors below." });
        }
      } else if (err.response?.status === 500) {
        setMessage({ type: "error", text: "Server error. Please try again." });
      } else {
        setMessage({ type: "error", text: "Update failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  // Use centralized getImageUrl for avatar display
  const displayAvatar = selectedAvatar ? getImageUrl(selectedAvatar) : undefined;

  return (
    <>
      <TeacherEditModalCSS /> 

      <div className="te-overlay" onClick={onClose}>
        <div className="te-modal" onClick={(e) => e.stopPropagation()}>
          <div className="te-header">
            <h2 className="te-title">EDIT PROFILE</h2>
            <button className="te-close" onClick={onClose}>CLOSE</button>
          </div>

          <div className="te-body">
            {message && (
              <div className={`te-alert te-alert-${message.type}`}>
                {message.text}
              </div>
            )}

            {Object.keys(errors).length > 0 && !message && (
              <div className="te-alert te-alert-error">
                Please fix the errors below
              </div>
            )}

            <div className="te-content">
              <div className="te-avatar-section">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="avatar"
                    className="te-avatar-preview"
                    onError={(e) => {
                      console.error("TeacherEditModal - Avatar failed to load:", displayAvatar);
                      // Fallback to placeholder if image fails
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.te-avatar-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'te-avatar-placeholder';
                        placeholder.innerHTML = '<i class="bi bi-person-fill"></i>';
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                ) : (
                  <div className="te-avatar-placeholder">
                    <i className="bi bi-person-fill"></i>
                  </div>
                )}

                <div>
                  <div className="te-avatar-label">CHOOSE AVATAR</div>
                  <div className="te-avatar-grid">
                    {PRESET_AVATARS.map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => handleAvatarSelect(src)}
                        className={`te-avatar-btn ${selectedAvatar === src ? "selected" : ""}`}
                      >
                        <img src={src} alt="preset" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <form className="te-form" onSubmit={handleSubmit}>
                <div className="te-form-row">
                  <div className="te-form-group">
                    <label className="te-label">First Name</label>
                    <input
                      className={`te-input ${errors.first_name ? "error" : ""}`}
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                    {errors.first_name && (
                      <div className="te-error-text">{errors.first_name.join(", ")}</div>
                    )}
                  </div>

                  <div className="te-form-group">
                    <label className="te-label">Middle Name</label>
                    <input
                      className="te-input"
                      name="middle_name"
                      value={form.middle_name}
                      onChange={handleChange}
                      placeholder="Middle Name"
                    />
                  </div>
                </div>

                <div className="te-form-row">
                  <div className="te-form-group">
                    <label className="te-label">Last Name</label>
                    <input
                      className={`te-input ${errors.last_name ? "error" : ""}`}
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                    {errors.last_name && (
                      <div className="te-error-text">{errors.last_name.join(", ")}</div>
                    )}
                  </div>

                  <div className="te-form-group">
                    <label className="te-label">Username</label>
                    <input
                      className={`te-input ${errors.username ? "error" : ""}`}
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Username"
                    />
                    {errors.username && (
                      <div className="te-error-text">{errors.username.join(", ")}</div>
                    )}
                  </div>
                </div>

                <div className="te-form-row">
                  <div className="te-form-group">
                    <label className="te-label">Email</label>
                    <input
                      type="email"
                      className={`te-input ${errors.email ? "error" : ""}`}
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    {errors.email && (
                      <div className="te-error-text">{errors.email.join(", ")}</div>
                    )}
                  </div>

                  <div className="te-form-group">
                    <label className="te-label">Contact Number</label>
                    <input
                      className={`te-input ${errors.contact_number ? "error" : ""}`}
                      name="contact_number"
                      value={form.contact_number}
                      onChange={handleChange}
                      placeholder="Contact Number"
                    />
                    {errors.contact_number && (
                      <div className="te-error-text">{errors.contact_number.join(", ")}</div>
                    )}
                  </div>
                </div>

                <div className="te-form-row">
                  <div className="te-form-group">
                    <label className="te-label">Age</label>
                    <input
                      type="number"
                      className={`te-input ${errors.age ? "error" : ""}`}
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="Age"
                    />
                    {errors.age && (
                      <div className="te-error-text">{errors.age.join(", ")}</div>
                    )}
                  </div>

                  <div className="te-form-group">
                    <label className="te-label">School</label>
                    <input
                      className={`te-input ${errors.school ? "error" : ""}`}
                      name="school"
                      value={form.school}
                      onChange={handleChange}
                      placeholder="School"
                    />
                    {errors.school && (
                      <div className="te-error-text">{errors.school.join(", ")}</div>
                    )}
                  </div>
                </div>

                <div className="te-form-row">
                  <div className="te-form-group">
                    <label className="te-label">Section</label>
                    <input
                      className={`te-input ${errors.section ? "error" : ""}`}
                      name="section"
                      value={form.section}
                      onChange={handleChange}
                      placeholder="Section"
                    />
                    {errors.section && (
                      <div className="te-error-text">{errors.section.join(", ")}</div>
                    )}
                  </div>

                  <div className="te-form-group">
                    <label className="te-label">New Password</label>
                    <input
                      type="password"
                      className="te-input"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                </div>

                <div className="te-form-group">
                  <label className="te-label">Address</label>
                  <input
                    className={`te-input ${errors.address ? "error" : ""}`}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                  {errors.address && (
                    <div className="te-error-text">{errors.address.join(", ")}</div>
                  )}
                </div>

                <div className="te-actions">
                  <button
                    type="button"
                    className="te-btn te-btn-secondary"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="te-btn te-btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "SAVING..." : "SAVE CHANGES"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherEditModal;