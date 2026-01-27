import React, { useState, useEffect } from "react";
import axios from "../auth/axiosInstance";

interface EditProfileModalProps {
  show: boolean;
  onClose: () => void;
  user: any;
  setUser: (user: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  onClose,
  user,
  setUser,
}) => {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    middle_name: user?.middle_name || "",
    last_name: user?.last_name || "",
    age: user?.age || "",
    username: user?.username || "",
    section: user?.section || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ✅ Moved here to always run in consistent hook order
  useEffect(() => {
    if (show) {
      setError(null);
      setSuccess(null);
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...user,
        ...formData,
        role: user.role || "student",
      };

      const res = await axios.put(`/users/${user.user_id}`, payload);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Show temporary success message, then auto-close
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "600px" }}
      >
        <div
          className="modal-content text-light"
          style={{
            background:
              "linear-gradient(to bottom right, #1a2a3a, #203a43, #2c5364)",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          }}
        >
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-info">
              ✏️ Edit Profile 
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body pt-3">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small text-light opacity-75">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill px-3 py-2 bg-dark text-light border-0 shadow-sm"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    maxLength={55}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-light opacity-75">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill px-3 py-2 bg-dark text-light border-0 shadow-sm"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    maxLength={55}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-light opacity-75">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill px-3 py-2 bg-dark text-light border-0 shadow-sm"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    maxLength={55}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-light opacity-75">
                    Age
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill px-3 py-2 bg-dark text-light border-0 shadow-sm"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    maxLength={3}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-light opacity-75">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill px-3 py-2 bg-dark text-light border-0 shadow-sm"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    maxLength={55}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-light opacity-75">
                    Section
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill px-3 py-2 bg-dark text-light border-0 shadow-sm"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    maxLength={55}
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-danger mt-3 py-2 text-center rounded-pill">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success mt-3 py-2 text-center rounded-pill">
                  {success}
                </div>
              )}

              <div className="text-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-4 me-2"
                  onClick={onClose}
                  disabled={saving}
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success rounded-pill px-4 fw-bold"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "✅ Save Changes"}
                </button>
              </div>
            </form>
          </div>

          <div className="pb-3"></div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
