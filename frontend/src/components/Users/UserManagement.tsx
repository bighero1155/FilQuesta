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
import { Edit, Trash2, UserPlus, X } from 'lucide-react';

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
  const [users, setUsers] = useState<User[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<User>>({});

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
    
    if (!formData.first_name?.trim()) {
      errors.first_name = "First name is required";
    }
    if (!formData.last_name?.trim()) {
      errors.last_name = "Last name is required";
    }
    if (!formData.username?.trim()) {
      errors.username = "Username is required";
    }
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
    if (!formData.role?.trim()) {
      errors.role = "Role is required";
    }
    
    if (isAdding && !formData.password?.trim()) {
      errors.password = "Password is required";
    } else if (isAdding && formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, isAdding]);

  const handleSave = useCallback(async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const dataToSend = {
        ...formData,
        age: formData.age ? String(formData.age) : "",
      };

      console.log("Sending data:", dataToSend);

      if (isAdding) {
        const newUser = await addUser(dataToSend);
        setUsers(prevUsers => [...prevUsers, newUser.user]);
        closeModal();
        setTimeout(() => {
          setSuccess("✓ User successfully added!");
        }, 100);
      } else if (editingUser) {
        await updateUser(editingUser.user_id, dataToSend);
        setUsers(prevUsers =>
          prevUsers.map((u) =>
            u.user_id === editingUser.user_id ? { ...u, ...dataToSend } as User : u
          )
        );
        closeModal();
        setTimeout(() => {
          setSuccess("✓ User successfully updated!");
        }, 100);
      }
    } catch (err: any) {
      console.error("Error saving user:", err);
      console.error("Error response:", err?.response?.data);
      
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
          <button 
            type="button" 
            className="btn-close" 
            onClick={clearMessages}
            aria-label="Close"
          ></button>
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
          <button 
            type="button" 
            className="btn-close" 
            onClick={clearMessages}
            aria-label="Close"
          ></button>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
      
      <ErrorHandler message={error} type="error" clearMessage={clearMessages} />
      <ErrorHandler message={success} type="success" clearMessage={clearMessages} />

      <div className="user-management-header">
        <h2 className="user-management-title">User Management</h2>
        <button className="btn-add-user" onClick={handleAdd}>
          <UserPlus size={20} />
          <span className="btn-add-user-text">Add User</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-responsive-wrapper">
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
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td className="wrap-cell name-cell" data-label="Name">
                    <div className="name-wrapper">
                      <div className="name-line">{user.first_name}</div>
                      {user.middle_name && <div className="name-line middle-name">{user.middle_name}</div>}
                      <div className="name-line">{user.last_name}</div>
                    </div>
                  </td>
                  <td className="nowrap-cell" data-label="Age">{user.age}</td>
                  <td className="wrap-cell" data-label="Address">{user.address}</td>
                  <td className="wrap-cell" data-label="School">{user.school}</td>
                  <td className="wrap-cell" data-label="Contact">{user.contact_number}</td>
                  <td className="wrap-cell" data-label="Username">{user.username}</td>
                  <td className="wrap-cell" data-label="Section">{user.section}</td>
                  <td className="wrap-cell" data-label="Email">{user.email}</td>
                  <td className="nowrap-cell role-cell" data-label="Role">
                    <span className={`badge-role badge-${user.role}`}>
                      {user.role === 'teacher' && '👨‍🏫 '}
                      {user.role === 'student' && '🎓 '}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="actions-cell" data-label="Actions">
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(user)}
                        title="Edit User"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(user.user_id)}
                        title="Delete User"
                      >
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

      {/* Modal */}
      {(editingUser || isAdding) && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
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
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <div className="form-grid">
                {/* First Name */}
                <div className="form-group">
                  <label className="form-label-custom form-label-required">First Name</label>
                  <input
                    type="text"
                    className={`form-input ${fieldErrors.first_name ? 'is-invalid' : ''}`}
                    value={formData.first_name || ""}
                    onChange={(e) => handleFormChange('first_name', e.target.value)}
                    placeholder="Enter first name"
                    disabled={saving}
                    required
                  />
                  {fieldErrors.first_name && (
                    <div className="invalid-feedback d-block">{fieldErrors.first_name}</div>
                  )}
                </div>

                {/* Middle Name */}
                <div className="form-group">
                  <label className="form-label-custom">Middle Name</label>
                  <input
                    type="text"
                    className={`form-input ${fieldErrors.middle_name ? 'is-invalid' : ''}`}
                    value={formData.middle_name || ""}
                    onChange={(e) => handleFormChange('middle_name', e.target.value)}
                    placeholder="Enter middle name"
                    disabled={saving}
                  />
                  {fieldErrors.middle_name && (
                    <div className="invalid-feedback d-block">{fieldErrors.middle_name}</div>
                  )}
                </div>

                {/* Last Name */}
                <div className="form-group">
                  <label className="form-label-custom form-label-required">Last Name</label>
                  <input
                    type="text"
                    className={`form-input ${fieldErrors.last_name ? 'is-invalid' : ''}`}
                    value={formData.last_name || ""}
                    onChange={(e) => handleFormChange('last_name', e.target.value)}
                    placeholder="Enter last name"
                    disabled={saving}
                    required
                  />
                  {fieldErrors.last_name && (
                    <div className="invalid-feedback d-block">{fieldErrors.last_name}</div>
                  )}
                </div>

                {/* Age */}
                <div className="form-group">
                  <label className="form-label-custom form-label-required">Age</label>
                  <input
                    type="number"
                    className={`form-input ${fieldErrors.age ? 'is-invalid' : ''}`}
                    value={formData.age || ""}
                    onChange={(e) => handleFormChange('age', e.target.value)}
                    placeholder="Enter age"
                    min="1"
                    max="150"
                    disabled={saving}
                    required
                  />
                  {fieldErrors.age && (
                    <div className="invalid-feedback d-block">{fieldErrors.age}</div>
                  )}
                </div>

                {/* Address */}
                <div className="form-group">
                  <label className="form-label-custom">Address</label>
                  <input
                    type="text"
                    className={`form-input ${fieldErrors.address ? 'is-invalid' : ''}`}
                    value={formData.address || ""}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    placeholder="Enter address"
                    disabled={saving}
                  />
                  {fieldErrors.address && (
                    <div className="invalid-feedback d-block">{fieldErrors.address}</div>
                  )}
                </div>

                {/* School */}
                <div className="form-group">
                  <label className="form-label-custom">School</label>
                  <input
                    type="text"
                    className={`form-input ${fieldErrors.school ? 'is-invalid' : ''}`}
                    value={formData.school || ""}
                    onChange={(e) => handleFormChange('school', e.target.value)}
                    placeholder="Enter school"
                    disabled={saving}
                  />
                  {fieldErrors.school && (
                    <div className="invalid-feedback d-block">{fieldErrors.school}</div>
                  )}
                </div>

                {/* Contact Number */}
                <div className="form-group">
                  <label className="form-label-custom">Contact Number</label>
                  <input
                    type="tel"
                    className={`form-input ${fieldErrors.contact_number ? 'is-invalid' : ''}`}
                    value={formData.contact_number || ""}
                    onChange={(e) => handleFormChange('contact_number', e.target.value)}
                    placeholder="Enter contact number"
                    disabled={saving}
                  />
                  {fieldErrors.contact_number && (
                    <div className="invalid-feedback d-block">{fieldErrors.contact_number}</div>
                  )}
                </div>

                {/* Username */}
                <div className="form-group">
                  <label className="form-label-custom form-label-required">Username</label>
                  <input
                    type="text"
                    className={`form-input ${fieldErrors.username ? 'is-invalid' : ''}`}
                    value={formData.username || ""}
                    onChange={(e) => handleFormChange('username', e.target.value)}
                    placeholder="Enter username"
                    disabled={saving}
                    required
                  />
                  {fieldErrors.username && (
                    <div className="invalid-feedback d-block">{fieldErrors.username}</div>
                  )}
                </div>

                {/* Section */}
                <div className="form-group">
                  <label className="form-label-custom">Section</label>
                  <input
                    type="text"
                    className={`form-input ${fieldErrors.section ? 'is-invalid' : ''}`}
                    value={formData.section || ""}
                    onChange={(e) => handleFormChange('section', e.target.value)}
                    placeholder="Enter section"
                    disabled={saving}
                  />
                  {fieldErrors.section && (
                    <div className="invalid-feedback d-block">{fieldErrors.section}</div>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label-custom form-label-required">Email</label>
                  <input
                    type="email"
                    className={`form-input ${fieldErrors.email ? 'is-invalid' : ''}`}
                    value={formData.email || ""}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    placeholder="Enter email"
                    disabled={saving}
                    required
                  />
                  {fieldErrors.email && (
                    <div className="invalid-feedback d-block">{fieldErrors.email}</div>
                  )}
                </div>

                {/* Role */}
                <div className="form-group">
                  <label className="form-label-custom form-label-required">Role</label>
                  <select
                    className={`form-select ${fieldErrors.role ? 'is-invalid' : ''}`}
                    value={formData.role || "student"}
                    onChange={(e) => handleFormChange('role', e.target.value)}
                    disabled={saving}
                    required
                  >
                    <option value="student">🎓 Student</option>
                    <option value="teacher">👨‍🏫 Teacher</option>
                  </select>
                  {fieldErrors.role && (
                    <div className="invalid-feedback d-block">{fieldErrors.role}</div>
                  )}
                </div>

                {/* Password */}
                {isAdding && (
                  <div className="form-group">
                    <label className="form-label-custom form-label-required">Password</label>
                    <input
                      type="password"
                      className={`form-input ${fieldErrors.password ? 'is-invalid' : ''}`}
                      value={formData.password || ""}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      placeholder="Enter password (min 6 characters)"
                      disabled={saving}
                      required
                      minLength={6}
                    />
                    {fieldErrors.password ? (
                      <div className="invalid-feedback d-block">{fieldErrors.password}</div>
                    ) : (
                      <small className="text-muted">Minimum 6 characters</small>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer-custom">
              <button 
                className="btn-modal btn-cancel" 
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                className="btn-modal btn-save" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    {isAdding ? "Adding..." : "Saving..."}
                  </>
                ) : (
                  isAdding ? "Add User" : "Save Changes"
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