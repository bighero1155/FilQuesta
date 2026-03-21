import React, { useEffect, useState, useMemo, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  addUser,
} from "../../services/userService";
import ErrorHandler from "../ErrorHandler";
import UserManagementCSS from "../../styles/UserManagementCSS";
import { Edit, Trash2, UserPlus, X, KeyRound } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

interface User {
  user_id: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  age?: string;
  address?: string;
  school?: string;
  contact_number?: string;
  username: string;
  section?: string;
  email?: string;
  role: string;
  password?: string;
}

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const [users, setUsers] = useState<User[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  // ── Reset password state ──────────────────────────────────────────────────
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetErrors, setResetErrors] = useState<Record<string, string>>({});
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSaving, setResetSaving] = useState(false);
  // ─────────────────────────────────────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  const handleDelete = useCallback(async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(prevUsers => prevUsers.filter((user) => user.user_id !== userId));
        setSuccess("✓ User successfully deleted!");
      } catch (err: any) {
        console.error("Error deleting user:", err);
        const errorMsg = err?.response?.data?.message || "Failed to delete user.";
        setError(errorMsg);
      }
    }
  }, []);

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
    setFormData(user);
    setIsAdding(false);
    clearMessages();
  }, [clearMessages]);

  const handleAdd = useCallback(() => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      age: "",
      address: "",
      school: "",
      contact_number: "",
      username: "",
      section: "",
      email: "",
      role: "student",
      password: "",
    });
    setEditingUser(null);
    setIsAdding(true);
    clearMessages();
  }, [clearMessages]);

  const closeModal = useCallback(() => {
    setEditingUser(null);
    setIsAdding(false);
    setFormData({});
    clearMessages();
  }, [clearMessages]);

  const handleFormChange = useCallback((field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
    if (error) {
      setError(null);
    }
  }, [error, fieldErrors]);

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.first_name?.trim()) errors.first_name = "First name is required";
    if (!formData.last_name?.trim())  errors.last_name  = "Last name is required";
    if (!formData.username?.trim())   errors.username   = "Username is required";
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
    if (!formData.age?.trim()) {
      errors.age = "Age is required";
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 1 || age > 150) {
        errors.age = "Please enter a valid age between 1 and 150";
      }
    }
    if (!formData.role?.trim()) errors.role = "Role is required";
    
    if (isAdding && !formData.password?.trim()) {
      errors.password = "Password is required";
    } else if (isAdding && formData.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, isAdding]);

  const handleSave = useCallback(async () => {
    const isValid = validateForm();
    if (!isValid) return;

    try {
      setSaving(true);
      setError(null);
      
      const dataToSend = {
        ...formData,
        age: formData.age ? String(formData.age) : "",
      };

      if (isAdding) {
        const newUser = await addUser(dataToSend);
        setUsers(prevUsers => [...prevUsers, newUser.user]);
        closeModal();
        setTimeout(() => setSuccess("✓ User successfully added!"), 100);
      } else if (editingUser) {
        await updateUser(editingUser.user_id, dataToSend);
        setUsers(prevUsers =>
          prevUsers.map((u) =>
            u.user_id === editingUser.user_id ? { ...u, ...dataToSend } as User : u
          )
        );
        closeModal();
        setTimeout(() => setSuccess("✓ User successfully updated!"), 100);
      }
    } catch (err: any) {
      console.error("Error saving user:", err);
      if (err?.response?.data?.errors) {
        const errors = err.response.data.errors;
        const serverFieldErrors: Record<string, string> = {};
        Object.entries(errors).forEach(([field, messages]: [string, any]) => {
          serverFieldErrors[field] = Array.isArray(messages) ? messages[0] : messages;
        });
        setFieldErrors(serverFieldErrors);
        setError("Please correct the errors below.");
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message) {
        setError(`Failed to save user: ${err.message}`);
      } else {
        setError("Failed to save user. Please check all required fields and try again.");
      }
    } finally {
      setSaving(false);
    }
  }, [formData, isAdding, editingUser, validateForm, closeModal]);

  // ── Reset password handlers ───────────────────────────────────────────────
  const openResetModal = useCallback((user: User) => {
    setResetTarget(user);
    setResetPassword("");
    setResetConfirm("");
    setResetErrors({});
    setShowResetPassword(false);
    setShowResetConfirm(false);
  }, []);

  const closeResetModal = useCallback(() => {
    setResetTarget(null);
    setResetPassword("");
    setResetConfirm("");
    setResetErrors({});
  }, []);

  const handleResetSave = useCallback(async () => {
    const errors: Record<string, string> = {};

    if (!resetPassword.trim()) {
      errors.password = "New password is required";
    } else if (resetPassword.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (resetPassword.length > 72) {
      errors.password = "Password must not exceed 72 characters";
    }

    if (!resetConfirm.trim()) {
      errors.confirm = "Please confirm the password";
    } else if (resetPassword !== resetConfirm) {
      errors.confirm = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setResetErrors(errors);
      return;
    }

    try {
      setResetSaving(true);
      await updateUser(resetTarget!.user_id, {
        ...resetTarget,
        age: resetTarget!.age ? String(resetTarget!.age) : "",
        password: resetPassword,
      });
      closeResetModal();
      setTimeout(() => setSuccess(`✓ Password reset for ${resetTarget!.username}!`), 100);
    } catch (err: any) {
      setResetErrors({ password: err?.response?.data?.message || "Failed to reset password." });
    } finally {
      setResetSaving(false);
    }
  }, [resetPassword, resetConfirm, resetTarget, closeResetModal]);
  // ─────────────────────────────────────────────────────────────────────────

  const filteredUsers = useMemo(() => {
    return users.filter((user) => user.role !== "admin");
  }, [users]);

  return (
    <div className="user-management-wrapper">
      <UserManagementCSS />
      
      {/* Success Alert */}
      {success && (
        <div 
          className="alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" 
          role="alert"
          style={{ 
            zIndex: 9999, 
            minWidth: '300px',
            maxWidth: '90%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          <strong>{success}</strong>
          <button type="button" className="btn-close" onClick={clearMessages} aria-label="Close"></button>
        </div>
      )}

      {/* Error Alert */}
      {error && !editingUser && !isAdding && (
        <div 
          className="alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" 
          role="alert"
          style={{ 
            zIndex: 9999, 
            minWidth: '300px',
            maxWidth: '90%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          <strong>Error:</strong> {error}
          <button type="button" className="btn-close" onClick={clearMessages} aria-label="Close"></button>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to   { transform: translate(-50%, 0);    opacity: 1; }
        }
      `}</style>
      
      <ErrorHandler message={error} type="error" clearMessage={clearMessages} />
      <ErrorHandler message={success} type="success" clearMessage={clearMessages} />

      <div className="user-management-header">
        <h2 className="user-management-title">User Management</h2>
        <button className="btn-add-user" onClick={handleAdd}>
          <UserPlus size={20} />
          <span>Add User</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Address</th>
                <th>School</th>
                <th>Contact</th>
                <th>Username</th>
                <th>Section</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td className="name-cell">
                    <div>{user.first_name}</div>
                    {user.middle_name && <div className="middle-name">{user.middle_name}</div>}
                    <div>{user.last_name}</div>
                  </td>
                  <td>{user.age}</td>
                  <td>{user.address}</td>
                  <td>{user.school}</td>
                  <td>{user.contact_number}</td>
                  <td>{user.username}</td>
                  <td>{user.section}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge-role badge-${user.role}`}>
                      {user.role === 'teacher' && '👨‍🏫 '}
                      {user.role === 'student' && '🎓 '}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action btn-edit" onClick={() => handleEdit(user)}>
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                      {/* ── Only visible to admin ── */}
                      {isAdmin && (
                        <button className="btn-action btn-reset" onClick={() => openResetModal(user)}>
                          <KeyRound size={16} />
                          <span>Reset PW</span>
                        </button>
                      )}
                      <button className="btn-action btn-delete" onClick={() => handleDelete(user.user_id)}>
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="no-users-alert">No users found.</div>
        )}
      </div>

      {/* ── Edit / Add Modal (unchanged) ── */}
      {(editingUser || isAdding) && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-container">
            <div className="modal-header-custom">
              <h3 className="modal-title">
                {isAdding ? "Add New User" : `Edit User: ${editingUser?.username}`}
              </h3>
              <button className="btn-close-custom" onClick={closeModal} disabled={saving}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-custom">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Error:</strong> {error}
                  <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input type="text" className={`form-input ${fieldErrors.first_name ? 'is-invalid' : ''}`} value={formData.first_name || ""} onChange={(e) => handleFormChange('first_name', e.target.value)} placeholder="Enter first name" disabled={saving} />
                  {fieldErrors.first_name && <div className="error-text">{fieldErrors.first_name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Middle Name</label>
                  <input type="text" className="form-input" value={formData.middle_name || ""} onChange={(e) => handleFormChange('middle_name', e.target.value)} placeholder="Enter middle name" disabled={saving} />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input type="text" className={`form-input ${fieldErrors.last_name ? 'is-invalid' : ''}`} value={formData.last_name || ""} onChange={(e) => handleFormChange('last_name', e.target.value)} placeholder="Enter last name" disabled={saving} />
                  {fieldErrors.last_name && <div className="error-text">{fieldErrors.last_name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input type="number" className={`form-input ${fieldErrors.age ? 'is-invalid' : ''}`} value={formData.age || ""} onChange={(e) => handleFormChange('age', e.target.value)} placeholder="Enter age" min="1" max="150" disabled={saving} />
                  {fieldErrors.age && <div className="error-text">{fieldErrors.age}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-input" value={formData.address || ""} onChange={(e) => handleFormChange('address', e.target.value)} placeholder="Enter address" disabled={saving} />
                </div>

                <div className="form-group">
                  <label className="form-label">School</label>
                  <input type="text" className="form-input" value={formData.school || ""} onChange={(e) => handleFormChange('school', e.target.value)} placeholder="Enter school" disabled={saving} />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input type="tel" className="form-input" value={formData.contact_number || ""} onChange={(e) => handleFormChange('contact_number', e.target.value)} placeholder="Enter contact number" disabled={saving} />
                </div>

                <div className="form-group">
                  <label className="form-label">Username *</label>
                  <input type="text" className={`form-input ${fieldErrors.username ? 'is-invalid' : ''}`} value={formData.username || ""} onChange={(e) => handleFormChange('username', e.target.value)} placeholder="Enter username" disabled={saving} />
                  {fieldErrors.username && <div className="error-text">{fieldErrors.username}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Section</label>
                  <input type="text" className="form-input" value={formData.section || ""} onChange={(e) => handleFormChange('section', e.target.value)} placeholder="Enter section" disabled={saving} />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className={`form-input ${fieldErrors.email ? 'is-invalid' : ''}`} value={formData.email || ""} onChange={(e) => handleFormChange('email', e.target.value)} placeholder="Enter email" disabled={saving} />
                  {fieldErrors.email && <div className="error-text">{fieldErrors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className={`form-input ${fieldErrors.role ? 'is-invalid' : ''}`} value={formData.role || "student"} onChange={(e) => handleFormChange('role', e.target.value)} disabled={saving}>
                    <option value="student">🎓 Student</option>
                    <option value="teacher">👨‍🏫 Teacher</option>
                  </select>
                  {fieldErrors.role && <div className="error-text">{fieldErrors.role}</div>}
                </div>

                {isAdding && (
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input type="password" className={`form-input ${fieldErrors.password ? 'is-invalid' : ''}`} value={formData.password || ""} onChange={(e) => handleFormChange('password', e.target.value)} placeholder="Enter password (min 8 characters)" disabled={saving} minLength={8} />
                    {fieldErrors.password ? (
                      <div className="error-text">{fieldErrors.password}</div>
                    ) : (
                      <small className="helper-text">Minimum 8 characters</small>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer-custom">
              <button className="btn-modal btn-cancel" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="btn-modal btn-save" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>{isAdding ? "Adding..." : "Saving..."}</>
                ) : (
                  isAdding ? "Add User" : "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset Password Modal (admin only) ── */}
      {isAdmin && resetTarget && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeResetModal(); }}>
          <div className="modal-container" style={{ maxWidth: 480 }}>
            <div className="modal-header-custom" style={{ background: "linear-gradient(135deg, #f5576c, #e74c3c)" }}>
              <h3 className="modal-title">
                🔑 Reset Password — {resetTarget.username}
              </h3>
              <button className="btn-close-custom" onClick={closeResetModal} disabled={resetSaving}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-custom">
              <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Enter a new password for <strong>{resetTarget.username}</strong>. They will need to use this to log in.
              </p>

              <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
                {/* New password */}
                <div className="form-group">
                  <label className="form-label">New Password *</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showResetPassword ? "text" : "password"}
                      className={`form-input ${resetErrors.password ? "is-invalid" : ""}`}
                      value={resetPassword}
                      onChange={(e) => {
                        setResetPassword(e.target.value);
                        if (resetErrors.password) setResetErrors(prev => ({ ...prev, password: "" }));
                      }}
                      placeholder="Min. 8 characters"
                      maxLength={72}
                      disabled={resetSaving}
                      style={{ paddingRight: "2.75rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(v => !v)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#667eea", fontSize: "1.1rem" }}
                    >
                      {showResetPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {resetErrors.password && <div className="error-text">{resetErrors.password}</div>}
                </div>

                {/* Confirm password */}
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showResetConfirm ? "text" : "password"}
                      className={`form-input ${resetErrors.confirm ? "is-invalid" : ""}`}
                      value={resetConfirm}
                      onChange={(e) => {
                        setResetConfirm(e.target.value);
                        if (resetErrors.confirm) setResetErrors(prev => ({ ...prev, confirm: "" }));
                      }}
                      placeholder="Re-enter new password"
                      maxLength={72}
                      disabled={resetSaving}
                      style={{ paddingRight: "2.75rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(v => !v)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#667eea", fontSize: "1.1rem" }}
                    >
                      {showResetConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {/* Live match */}
                  {resetConfirm.length > 0 && (
                    <div style={{ fontSize: "0.82rem", marginTop: "4px", color: resetPassword === resetConfirm ? "#198754" : "#f5576c" }}>
                      {resetPassword === resetConfirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </div>
                  )}
                  {resetErrors.confirm && <div className="error-text">{resetErrors.confirm}</div>}
                </div>
              </div>
            </div>

            <div className="modal-footer-custom">
              <button className="btn-modal btn-cancel" onClick={closeResetModal} disabled={resetSaving}>Cancel</button>
              <button
                className="btn-modal btn-save"
                onClick={handleResetSave}
                disabled={resetSaving}
                style={{ background: "linear-gradient(135deg, #f5576c, #e74c3c)" }}
              >
                {resetSaving ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Resetting...</>
                ) : (
                  "🔑 Reset Password"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;