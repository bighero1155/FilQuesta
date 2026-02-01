import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserCosmetics, getImageUrl } from "../services/cosmeticService";
import axios from "../auth/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";

interface UserProfile {
  user_id: number;
  username: string;
  name?: string;
  favorite_color?: string;
  avatar?: string;
  coins?: number;
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

  const navigate = useNavigate();
  const location = useLocation();

  /** Cache-busting key (avatar ONLY) */
  const [avatarKey, setAvatarKey] = useState(Date.now());

  useEffect(() => {
    if (user?.avatar) {
      setAvatarKey(Date.now());
    }
  }, [user?.avatar]);

  /* ================= PROFILE ================= */

  const loadProfile = useCallback(async () => {
    let profile: UserProfile | null = null;

    /** 1️⃣ Highest priority: userData prop */
    if (userData) {
      profile = {
        user_id: userData.user_id,
        username: userData.username,
        name: userData.name,
        favorite_color: userData.favorite_color,
        avatar: userData.avatar, // RAW here on purpose
      };

      setUser(profile);

      if (!skipCosmeticsFetch) {
        await loadCosmetics(profile.user_id);
      }
      return;
    }

    /** 2️⃣ Fallback: localStorage */
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        profile = {
          ...parsed,
          avatar: parsed.avatar, // RAW here on purpose
        };
      } catch {
        profile = null;
      }
    }

    if (!profile) return;

    /** 3️⃣ Optional API fetch if avatar missing */
    if (!skipAvatarFetch && !profile.avatar) {
      try {
        const res = await axios.get(`/public/users/${profile.user_id}`);
        if (res.data?.avatar) {
          profile.avatar = res.data.avatar;

          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            parsed.avatar = profile.avatar;
            localStorage.setItem("user", JSON.stringify(parsed));
          }
        }
      } catch (err) {
        console.error("❌ Failed to fetch public profile:", err);
      }
    }

    setUser(profile);

    if (!skipCosmeticsFetch) {
      await loadCosmetics(profile.user_id);
    }
  }, [userData, skipAvatarFetch, skipCosmeticsFetch]);

  /* ================= COSMETICS ================= */

  const loadCosmetics = async (userId: number) => {
    try {
      const cosmetics = await getUserCosmetics(userId);

      /**
       * Images are ALREADY normalized by the service.
       * Never call getImageUrl again here.
       */
      const items: UserCosmetic[] = cosmetics.map((item: any) => {
        const cosmetic = item.cosmetic || item;

        return {
          cosmetic_id: cosmetic.cosmetic_id ?? item.cosmetic_id,
          type: (cosmetic.type ?? "").toLowerCase(),
          name: cosmetic.name ?? "",
          image: typeof cosmetic.image === "string" ? cosmetic.image : null,
          is_equipped: item.is_equipped ?? false,
        };
      });

      setBadges(items.filter(b => b.type === "badge" && b.is_equipped));
      setNickFrame(items.find(n => n.type === "nick_frame" && n.is_equipped) || null);
    } catch (err) {
      console.error("❌ Failed to load cosmetics:", err);
    }
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.user_id, userData?.avatar, location.pathname]);

  useEffect(() => {
    if (userData) return;

    const refresh = () => loadProfile();

    window.addEventListener("storage", refresh);
    window.addEventListener("userUpdated", refresh);
    window.addEventListener("avatarUpdated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("userUpdated", refresh);
      window.removeEventListener("avatarUpdated", refresh);
    };
  }, [userData, loadProfile]);

  /* ================= RENDER HELPERS ================= */

  const renderAvatar = (avatar?: string) => {
    if (!avatar) {
      return (
        <i
          className="bi bi-person-circle text-white"
          style={{ fontSize: `${avatarSize}px` }}
        />
      );
    }

    /**
     * 🔥 FINAL FIX:
     * 1. Normalize avatar ONCE here
     * 2. Cache-bust ONLY if it's a FULL URL
     */
    const normalized = getImageUrl(avatar);

    const avatarUrl =
      normalized && normalized.startsWith("http")
        ? `${normalized}${normalized.includes("?") ? "&" : "?"}t=${avatarKey}`
        : normalized;

    return (
      <img
        key={avatarKey}
        src={avatarUrl}
        alt="avatar"
        className="rounded-circle"
        style={{
          width: avatarSize,
          height: avatarSize,
          objectFit: "cover",
          border: "3px solid #f4f6f9",
        }}
        onError={(e) => {
          console.error("❌ Avatar failed to load:", avatarUrl);
          e.currentTarget.style.display = "none";
        }}
      />
    );
  };

  const renderNickFrame = () => {
    if (!nickFrame?.image) return null;

    return (
      <img
        src={nickFrame.image}
        alt={nickFrame.name}
        title={nickFrame.name}
        style={{
          width: nickFrameSize,
          height: nickFrameSize,
          objectFit: "contain",
          marginLeft: 8,
        }}
      />
    );
  };

  if (!user) return null;

  /* ================= RENDER ================= */

  return (
    <div
      className="d-flex flex-column align-items-center p-3 text-white"
      style={{
        background: "linear-gradient(to bottom right, #4e60e6, #2d427d)",
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
        style={{ cursor: userData ? "default" : "pointer" }}
      >
        {renderAvatar(user.avatar)}

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
          {badges.map((b) =>
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
                style={{ fontSize: textSize * 0.6 }}
              >
                {b.name}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
