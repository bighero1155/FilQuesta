// src/pages/ProfileHeader.tsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserCosmetics, getImageUrl } from "../services/cosmeticService";
import axios from "../auth/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";

/* ===============================
   TYPES
   =============================== */

interface UserProfile {
  user_id: number;
  username: string;
  name?: string;
  favorite_color?: string;
  avatar?: string;
}

interface UserCosmetic {
  cosmetic_id: number;
  type: string;
  name: string;
  image: string | null;
  is_equipped: boolean;
}

interface ProfileHeaderProps {
  avatarSize?: number;
  badgeSize?: number;
  nickFrameSize?: number;
  textSize?: number;
  userData?: {
    user_id: number;
    username: string;
    name?: string;
    favorite_color?: string;
    avatar?: string;
  };
  skipCosmeticsFetch?: boolean;
  skipAvatarFetch?: boolean;
}

/* ===============================
   COMPONENT
   =============================== */

const ProfileHeader = ({
  avatarSize = 60,
  badgeSize = 28,
  nickFrameSize = 24,
  textSize = 22,
  userData,
  skipCosmeticsFetch = false,
  skipAvatarFetch = false,
}: ProfileHeaderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<UserCosmetic[]>([]);
  const [nickFrame, setNickFrame] = useState<UserCosmetic | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Cache-busting only when avatar CHANGES
  const avatarKeyRef = useRef(Date.now());

  /* ===============================
     LOAD PROFILE
     =============================== */

  const loadProfile = useCallback(async () => {
    let profile: UserProfile | null = null;

    if (userData) {
      profile = {
        user_id: userData.user_id,
        username: userData.username,
        name: userData.name,
        favorite_color: userData.favorite_color,
        avatar: getImageUrl(userData.avatar),
      };
    } else {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          profile = {
            ...parsed,
            avatar: getImageUrl(parsed.avatar),
          };
        } catch {
          profile = null;
        }
      }
    }

    if (!profile) return;

    if (!skipAvatarFetch && !profile.avatar) {
      try {
        const res = await axios.get(`/public/users/${profile.user_id}`);
        if (res.data?.avatar) {
          profile.avatar = getImageUrl(res.data.avatar);
        }
      } catch {
        // silent fail, fallback icon will render
      }
    }

    setAvatarFailed(false);
    avatarKeyRef.current = Date.now();
    setUser(profile);

    if (!skipCosmeticsFetch) {
      await loadCosmetics(profile.user_id);
    }
  }, [userData, skipAvatarFetch, skipCosmeticsFetch]);

  /* ===============================
     LOAD COSMETICS
     =============================== */

  const loadCosmetics = async (userId: number) => {
    try {
      const cosmetics = await getUserCosmetics(userId);

      const items: UserCosmetic[] = cosmetics.map((c: any) => ({
        cosmetic_id: c.cosmetic_id,
        type: c.type,
        name: c.name,
        image: getImageUrl(c.image) ?? null,
        is_equipped: c.is_equipped,
      }));

      setBadges(items.filter(i => i.type === "badge" && i.is_equipped));
      setNickFrame(
        items.find(i => i.type === "nick_frame" && i.is_equipped) || null
      );
    } catch (err) {
      console.error("❌ Failed to load cosmetics:", err);
    }
  };

  /* ===============================
     EFFECTS
     =============================== */

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.user_id, userData?.avatar, location.pathname]);

  useEffect(() => {
    if (userData) return;

    const handler = () => loadProfile();
    window.addEventListener("storage", handler);
    window.addEventListener("avatarUpdated", handler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("avatarUpdated", handler);
    };
  }, [loadProfile, userData]);

  /* ===============================
     RENDER HELPERS
     =============================== */

  const renderAvatar = () => {
    if (!user?.avatar || avatarFailed) {
      return (
        <i
          className="bi bi-person-circle text-white"
          style={{ fontSize: `${avatarSize}px` }}
        />
      );
    }

    return (
      <img
        src={`${user.avatar}?v=${avatarKeyRef.current}`}
        alt="avatar"
        className="rounded-circle"
        style={{
          width: avatarSize,
          height: avatarSize,
          objectFit: "cover",
          border: "3px solid #f4f6f9ff",
        }}
        onError={() => {
          console.error("❌ Avatar failed to load:", user.avatar);
          setAvatarFailed(true);
        }}
      />
    );
  };

  const renderNickFrame = () =>
    nickFrame?.image ? (
      <img
        src={nickFrame.image}
        alt={nickFrame.name}
        style={{
          width: nickFrameSize,
          height: nickFrameSize,
          objectFit: "contain",
          marginLeft: 8,
        }}
      />
    ) : null;

  if (!user) return null;

  /* ===============================
     RENDER
     =============================== */

  return (
    <div
      className="d-flex flex-column align-items-center p-3 text-white"
      style={{
        background: "linear-gradient(to bottom right, #4e60e6ff, #2d427dff)",
        borderRadius: 15,
        border: "2px solid #3b82f6",
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      <button
        onClick={() => !userData && navigate("/profile")}
        disabled={!!userData}
        className="btn btn-link text-white text-decoration-none d-flex flex-column align-items-center"
      >
        {renderAvatar()}

        <div
          className="d-flex align-items-center mt-2 fw-bold"
          style={{ fontSize: textSize, lineHeight: 1.2 }}
        >
          {user.username}
          {renderNickFrame()}
        </div>
      </button>

      {!skipCosmeticsFetch && badges.length > 0 && (
        <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
          {badges.map(b => (
            b.image ? (
              <img
                key={b.cosmetic_id}
                src={b.image}
                alt={b.name}
                title={b.name}
                style={{
                  width: badgeSize,
                  height: badgeSize,
                  objectFit: "contain",
                  backgroundColor: "rgba(255,255,255,0.25)",
                  padding: 2,
                  borderRadius: 6,
                }}
              />
            ) : (
              <span
                key={b.cosmetic_id}
                className="badge bg-info text-dark"
              >
                {b.name}
              </span>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
