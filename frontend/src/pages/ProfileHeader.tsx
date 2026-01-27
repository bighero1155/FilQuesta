// src/pages/ProfileHeader.tsx
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
  total_score?: number;
  rank?: string;
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

  /** Memoized avatar key for cache busting */
  const [avatarKey, setAvatarKey] = useState(Date.now());

  // Update avatar key when user avatar changes
  useEffect(() => {
    if (user?.avatar) {
      setAvatarKey(Date.now());
    }
  }, [user?.avatar]);

  /** Load profile with priority: userData > localStorage > API */
  const loadProfile = useCallback(async () => {
    let profile: UserProfile | null = null;

    // ALWAYS prioritize userData (live lobby data)
    if (userData) {
      // Use the getImageUrl helper for consistent URL handling
      const normalizedAvatar = getImageUrl(userData.avatar);

      profile = {
        user_id: userData.user_id,
        username: userData.username,
        name: userData.name ?? "",
        favorite_color: userData.favorite_color,
        avatar: normalizedAvatar,
      };

      // If userData has avatar and skipAvatarFetch is true, don't fetch from API
      if (userData.avatar && skipAvatarFetch) {
        setUser(profile);
        // Still load cosmetics if not skipped
        if (!skipCosmeticsFetch) {
          await loadCosmetics(profile.user_id);
        }
        return;
      }
    } else {
      // fallback: localStorage
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.avatar = getImageUrl(parsed.avatar);
          profile = parsed;
        } catch {
          profile = null;
        }
      }
    }

    if (!profile) return;

    // Only fetch from API if skipAvatarFetch is false AND no avatar exists
    if (!skipAvatarFetch && !profile.avatar) {
      try {
        // Use axios instance instead of fetch for consistency
        const response = await axios.get(`/public/users/${profile.user_id}`);
        if (response.data && response.data.avatar) {
          profile.avatar = getImageUrl(response.data.avatar);
          
          // Update localStorage if we're not using userData prop
          if (!userData) {
            const stored = localStorage.getItem("user");
            if (stored) {
              const parsedUser = JSON.parse(stored);
              parsedUser.avatar = profile.avatar;
              localStorage.setItem("user", JSON.stringify(parsedUser));
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch public profile:', err);
      }
    }

    setUser(profile);

    // Load cosmetics only if not skipped
    if (!skipCosmeticsFetch) {
      await loadCosmetics(profile.user_id);
    }
  }, [userData, skipAvatarFetch, skipCosmeticsFetch]);

  /** Separate function to load cosmetics */
  const loadCosmetics = async (userId: number) => {
    try {
      const cosmetics = await getUserCosmetics(userId);

      console.log("🔍 Raw cosmetics from getUserCosmetics:", cosmetics);

      // Transform cosmetic images the SAME WAY as avatar - using getImageUrl
      const items: UserCosmetic[] = cosmetics.map((item: any) => {
        const cosmetic = item.cosmetic || item;
        const rawImage = cosmetic.image;
        
        // ✅ Apply getImageUrl transformation - same as avatar!
        const transformedImage = getImageUrl(rawImage);
        
        console.log("📦 Processing cosmetic:", {
          name: cosmetic.name,
          type: cosmetic.type,
          rawImage: rawImage,
          transformedImage: transformedImage,
        });

        return {
          cosmetic_id: cosmetic.cosmetic_id ?? item.cosmetic_id,
          type: (cosmetic.type ?? "").toLowerCase(),
          name: cosmetic.name ?? "",
          image: transformedImage ?? null, // Use getImageUrl transformation like avatar
          is_equipped: item.is_equipped ?? false,
        };
      });

      const equippedBadges = items.filter((b) => b.type === "badge" && b.is_equipped);
      const equippedNickFrame = items.find((n) => n.type === "nick_frame" && n.is_equipped) || null;

      console.log("🎖️ Final equipped badges:", equippedBadges);
      console.log("🖼️ Final equipped nick frame:", equippedNickFrame);

      setBadges(equippedBadges);
      setNickFrame(equippedNickFrame);
    } catch (err) {
      console.error("❌ Failed to load cosmetics:", err);
    }
  };

  // Re-run when userData or location changes
  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.user_id, userData?.avatar, location.pathname]);

  // Listen to storage events for avatar changes (only when not using userData)
  useEffect(() => {
    if (userData) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" && e.newValue) {
        loadProfile();
      }
    };

    const handleCustomStorage = () => {
      loadProfile();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storage", handleCustomStorage);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage", handleCustomStorage);
    };
  }, [userData, loadProfile]);

  const handleProfileClick = () => {
    if (!userData) navigate("/profile");
  };

  const renderAvatar = (avatar?: string) => {
    if (!avatar) {
      return (
        <i
          className="bi bi-person-circle text-white"
          style={{ fontSize: `${avatarSize}px` }}
        />
      );
    }

    // Add cache-busting timestamp only if avatar changed
    const avatarUrl = avatar.includes('?') 
      ? avatar
      : `${avatar}?t=${avatarKey}`;

    return (
      <img
        key={avatarKey}
        src={avatarUrl}
        alt="avatar"
        className="rounded-circle"
        style={{
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          objectFit: "cover",
          border: "3px solid #f4f6f9ff",
        }}
        onError={(e) => {
          console.error('Avatar image failed to load:', avatarUrl);
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  };

  const renderNickFrame = () => {
    if (!nickFrame || !nickFrame.image) {
      console.log("❌ No nick frame or no image:", nickFrame);
      return null;
    }

    console.log("🖼️ Rendering nick frame with image:", nickFrame.image);

    return (
      <img
        src={nickFrame.image}
        alt={nickFrame.name}
        title={nickFrame.name}
        style={{
          width: `${nickFrameSize}px`,
          height: `${nickFrameSize}px`,
          objectFit: "contain",
          marginLeft: "8px",
        }}
        onError={(e) => {
          console.error('❌ Nick frame failed to load. Attempted URL:', nickFrame.image);
          console.error('❌ Image element src:', e.currentTarget.src);
        }}
      />
    );
  };

  if (!user) return null;

  return (
    <div
      className="d-flex flex-column align-items-center p-3 text-white"
      style={{
        background: "linear-gradient(to bottom right, #4e60e6ff, #2d427dff)",
        borderRadius: "15px",
        border: "2px solid #3b82f6",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      <button
        onClick={handleProfileClick}
        disabled={!!userData}
        className="btn btn-link text-white text-decoration-none d-flex flex-column align-items-center"
        style={{
          cursor: userData ? "default" : "pointer",
        }}
      >
        {renderAvatar(user.avatar)}

        <div
          className="d-flex align-items-center mt-2 fw-bold"
          style={{ fontSize: `${textSize}px`, lineHeight: 1.2 }}
        >
          {user.username}
          {renderNickFrame()}
        </div>
      </button>

      {/* Badges */}
      {!skipCosmeticsFetch && badges.length > 0 && (
        <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
          {badges.map((b) => {
            if (!b.image) {
              return (
                <span
                  key={b.cosmetic_id}
                  className="badge bg-info text-dark shadow-sm"
                  style={{
                    fontSize: `${textSize * 0.6}px`,
                    padding: "6px 8px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.25)",
                  }}
                >
                  {b.name}
                </span>
              );
            }

            return (
              <img
                key={b.cosmetic_id}
                src={b.image}
                alt={b.name}
                title={b.name}
                style={{
                  width: `${badgeSize}px`,
                  height: `${badgeSize}px`,
                  objectFit: "contain",
                  backgroundColor: "rgba(255,255,255,0.25)",
                  padding: "2px",
                  borderRadius: "6px",
                }}
                onError={(e) => {
                  console.error('❌ Badge failed to load:', b.image);
                  console.error('❌ Badge image element src:', e.currentTarget.src);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;