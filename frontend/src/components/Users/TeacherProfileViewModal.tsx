import React, { useEffect, useState } from "react";
import TeacherEditModal from "./TeacherEditModal";
import TeacherProfileViewModalCSS from "../../styles/TeacherProfileViewModalCSS";
import { getImageUrl } from "../../services/cosmeticService";

interface Props {
  show: boolean;
  onClose: () => void;
}

const TeacherProfileViewModal: React.FC<Props> = ({ show, onClose }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [data, setData] = useState<any>({});
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  // Load user data and normalize avatar
  const loadUserData = () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        setData(parsedUser);
        
        const avatarPath = parsedUser.avatar;
        console.log("Modal - Raw avatar path:", avatarPath);
        
        // Use centralized getImageUrl - it returns string | undefined
        const normalizedUrl = avatarPath ? getImageUrl(avatarPath) : undefined;
        console.log("Modal - Normalized avatar:", normalizedUrl);
        setAvatar(normalizedUrl);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  };

  // Load data when modal opens
  useEffect(() => {
    if (!show) return;
    loadUserData();
  }, [show]);

  // Listen for avatar updates
  useEffect(() => {
    const handleAvatarUpdate = () => {
      console.log("Modal - Avatar updated, refreshing...");
      loadUserData();
    };

    window.addEventListener("userUpdated", handleAvatarUpdate);
    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    return () => {
      window.removeEventListener("userUpdated", handleAvatarUpdate);
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  if (!show) return null;

  const profileFields = [
    { label: "Full Name", value: `${data.first_name || ""} ${data.middle_name || ""} ${data.last_name || ""}`.trim() },
    { label: "Username", value: data.username },
    { label: "Email", value: data.email },
    { label: "Contact", value: data.contact_number },
    { label: "Age", value: data.age },
    { label: "Address", value: data.address },
    { label: "School", value: data.school },
    { label: "Section", value: data.section },
  ];

  return (
    <>
      <TeacherProfileViewModalCSS /> 

      <div className="tp-overlay" onClick={onClose}>
        <div className="tp-modal" onClick={(e) => e.stopPropagation()}>
          <div className="tp-header">
            <h2 className="tp-title">TEACHER PROFILE</h2>
            <button className="tp-close" onClick={onClose}>CLOSE</button>
          </div>

          <div className="tp-body">
            <div className="tp-content">
              <div className="tp-avatar-section">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    className="tp-avatar"
                    onError={(e) => {
                      console.error("Modal - Avatar failed to load:", avatar);
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.tp-avatar-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'tp-avatar-placeholder';
                        placeholder.innerHTML = '<i class="bi bi-person-fill"></i>';
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                ) : (
                  <div className="tp-avatar-placeholder">
                    <i className="bi bi-person-fill"></i>
                  </div>
                )}
                <div className="tp-name-badge">
                  {`${data.first_name || ""} ${data.last_name || ""}`.trim() || "Teacher"}
                </div>
              </div>

              <div className="tp-fields">
                {profileFields.filter(f => f.label !== "Full Name").map((field) => (
                  <div key={field.label} className="tp-field">
                    <div className="tp-label">{field.label}</div>
                    <div className="tp-value">{field.value || "—"}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tp-actions">
              <button className="tp-btn" onClick={() => setShowEdit(true)}>
                EDIT PROFILE
              </button>
            </div>
          </div>
        </div>
      </div>

      <TeacherEditModal show={showEdit} onClose={() => setShowEdit(false)} />
    </>
  );
};

export default TeacherProfileViewModal;