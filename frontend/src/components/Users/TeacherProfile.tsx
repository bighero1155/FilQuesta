import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../services/cosmeticService";
import TeacherProfileViewModal from "./TeacherProfileViewModal";

const TeacherProfile: React.FC = () => {
  const { user } = useAuth();
  const [showViewModal, setShowViewModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string>("");

  // Load user data and normalize avatar
  const loadUserData = () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        setUsername(parsedUser.username || "Teacher");
        
        const avatarPath = parsedUser.avatar;
        console.log("TeacherProfile - Raw avatar:", avatarPath);
        
        // Use centralized getImageUrl - it returns string | undefined
        const normalizedUrl = avatarPath ? getImageUrl(avatarPath) : undefined;
        console.log("TeacherProfile - Normalized avatar:", normalizedUrl);
        setAvatar(normalizedUrl);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  };

  // Initial load
  useEffect(() => {
    loadUserData();
  }, []);

  // Listen for avatar updates
  useEffect(() => {
    const handleAvatarUpdate = () => {
      console.log("TeacherProfile - Avatar update detected, refreshing...");
      loadUserData();
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener("userUpdated", handleAvatarUpdate);
    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    return () => {
      window.removeEventListener("userUpdated", handleAvatarUpdate);
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  if (!user) return null;

  return (
    <>
      <div
        onClick={() => setShowViewModal(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 0",
          cursor: "pointer",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          marginBottom: 12,
        }}
      >
        {/* Avatar */}
        <div>
          {avatar ? (
            <img
              key={refreshKey}
              src={avatar}
              alt="Profile"
              className="rounded-circle"
              style={{
                width: 52,
                height: 52,
                objectFit: "cover",
                border: "3px solid rgba(255,255,255,0.3)",
              }}
              onError={(e) => {
                console.error("TeacherProfile - Avatar failed to load:", avatar);
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<i class="bi bi-person-circle" style="font-size: 52px; color: #fff"></i>';
                }
              }}
            />
          ) : (
            <i className="bi bi-person-circle" style={{ fontSize: 52, color: "#fff" }} />
          )}
        </div>

        {/* Text */}
        <div style={{ color: "#fff", lineHeight: 1.3 }}>
          <div style={{ fontWeight: 700 }}>{username}</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Teacher</div>
        </div>
      </div>

      <TeacherProfileViewModal show={showViewModal} onClose={() => setShowViewModal(false)} />
    </>
  );
};

export default TeacherProfile;