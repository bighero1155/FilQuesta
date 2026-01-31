// src/components/Cosmetics/CosmeticsShop.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  getCosmetics,
  getUserCosmetics,
  buyCosmetic,
  equipCosmetic,
  Cosmetic,
  UserCosmetic,
} from "../../services/cosmeticService";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../BackButton";

interface AuthUser {
  user_id: number;
  username: string;
  avatar?: string;
  coins?: number;
}

const CosmeticsShop: React.FC = () => {
  const { user } = useAuth() as { user: AuthUser | null };

  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [userCosmetics, setUserCosmetics] = useState<UserCosmetic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"avatar" | "badge" | "nick_frame">("avatar");
  const [search, setSearch] = useState("");

  /** Load shop cosmetics */
  const fetchCosmetics = useCallback(async () => {
    try {
      const data = await getCosmetics();
      console.log("Loaded cosmetics:", data);
      setCosmetics(data);
    } catch (error) {
      console.error("Failed to load cosmetics:", error);
      alert("Failed to load cosmetics.");
    }
  }, []);

  /** Load user's cosmetics */
  const fetchUserCosmetics = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getUserCosmetics(user.user_id);
      console.log("Loaded user cosmetics:", data);
      setUserCosmetics(data);
    } catch (error) {
      console.error("Failed to load user cosmetics:", error);
      alert("Failed to load your owned cosmetics.");
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCosmetics();
      if (user) {
        await fetchUserCosmetics();
      }
      setLoading(false);
    };
    
    loadData();
  }, [user, fetchCosmetics, fetchUserCosmetics]);

  /** Buy cosmetic */
  const handleBuy = async (cosmeticId: number) => {
    if (!user) return alert("Please log in first.");

    try {
      const result = await buyCosmetic(cosmeticId);
      alert("Purchase successful!");

      const updatedUser = {
        ...user,
        coins: result.remaining_coins ?? user.coins ?? 0,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "user",
          newValue: JSON.stringify(updatedUser),
        })
      );

      await fetchUserCosmetics();
    } catch (error: any) {
      console.error("Purchase error:", error);
      alert(error?.response?.data?.message || "Purchase failed.");
    }
  };

  /** Equip cosmetic */
  const handleEquip = async (cosmeticId: number) => {
    if (!user) return alert("Please log in first.");

    try {
      await equipCosmetic(cosmeticId);

      await fetchUserCosmetics();

      const equipped = cosmetics.find((c) => c.cosmetic_id === cosmeticId);

      // If it's avatar, sync instantly
      if (equipped?.type === "avatar" && typeof equipped.image === "string") {
        const updatedUser = { 
          ...user, 
          avatar: equipped.image
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "user",
            newValue: JSON.stringify(updatedUser),
          })
        );
      }

      // Animation pulse
      const card = document.getElementById(`card-${cosmeticId}`);
      if (card) {
        card.classList.add("equip-pulse");
        setTimeout(() => card.classList.remove("equip-pulse"), 300);
      }

      alert("Cosmetic equipped!");
    } catch (error: any) {
      console.error("Equip error:", error);
      alert(error?.response?.data?.message || "Failed to equip cosmetic.");
    }
  };

  /** Helpers */
  const isOwned = (id: number) => userCosmetics.some((uc) => uc.cosmetic_id === id);
  const isEquipped = (id: number) =>
    userCosmetics.some((uc) => uc.cosmetic_id === id && uc.is_equipped);

  // 🔥 Helper: Get image URL as string (type-safe)
  const getImageUrl = (image: string | File | undefined): string | undefined => {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    // If it's a File object (shouldn't happen from backend), return undefined
    return undefined;
  };

  // Loading state
  if (loading) {
    return (
      <div 
        className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <div className="text-center text-white">
          <div className="spinner-border text-info mb-3" style={{ width: "3rem", height: "3rem" }}></div>
          <p className="fs-5">Loading Cosmetics Shop...</p>
        </div>
      </div>
    );
  }

  /** Filter by tab + search */
  const filtered = cosmetics
    .filter((c) => c.type === activeTab)
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundImage: `url('/assets/market.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <BackButton />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(2px)",
          zIndex: 0,
        }}
      />

      <div className="container text-white position-relative" style={{ zIndex: 2 }}>
        <style>{`
          .shop-title {
            font-family: 'Press Start 2P', cursive;
            color: #00eaff;
            text-shadow: 0 0 10px #00eaff;
            font-size: clamp(1.5rem, 4vw, 2.5rem);
          }

          .tab-btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: bold;
            background: rgba(0,255,255,0.1);
            border: 2px solid rgba(0,255,255,0.3);
            color: #00eaff;
            cursor: pointer;
            transition: 0.25s ease;
            margin-right: 10px;
            margin-bottom: 10px;
            font-family: 'Press Start 2P', cursive;
            font-size: clamp(0.6rem, 2vw, 0.8rem);
          }
          
          .tab-btn:hover {
            background: rgba(0,255,255,0.2);
            transform: translateY(-2px);
          }
          
          .tab-btn.active {
            background: rgba(0,255,255,0.3);
            box-shadow: 0 0 15px #00eaff;
          }

          .search-bar {
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(0,255,255,0.25);
            border-radius: 10px;
            color: #fff;
            padding: 10px 15px;
            width: 100%;
            transition: all 0.3s ease;
          }
          
          .search-bar:focus {
            outline: none;
            border-color: #00eaff;
            box-shadow: 0 0 15px rgba(0, 234, 255, 0.3);
            background: rgba(255,255,255,0.15);
          }
          
          .search-bar::placeholder {
            color: rgba(255,255,255,0.5);
          }

          .cosmetic-card {
            padding: 15px;
            border-radius: 14px;
            background: rgba(255,255,255,0.08);
            border: 2px solid rgba(0,255,255,0.2);
            transition: all 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          
          .cosmetic-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 0 20px rgba(0,255,255,0.35);
          }

          .glow-container {
            background: radial-gradient(circle, rgba(0,255,255,0.35), transparent 65%);
            border-radius: 12px;
            padding: 10px;
            margin-bottom: 10px;
            width: 100%;
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
          }
          
          .cosmetic-image {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
            border-radius: 10px;
            transition: transform 0.3s ease;
          }
          
          .cosmetic-card:hover .cosmetic-image {
            transform: scale(1.05);
          }
          
          .image-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            color: rgba(255,255,255,0.5);
            font-size: 3rem;
          }
          
          .placeholder-text {
            font-size: 0.8rem;
            margin-top: 0.5rem;
            opacity: 0.7;
          }

          .cosmetic-name {
            font-weight: bold;
            color: #00eaff;
            margin-bottom: 8px;
            font-size: 1rem;
            min-height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          
          .cosmetic-description {
            color: #fff;
            font-size: 0.85rem;
            margin-bottom: 10px;
            opacity: 0.8;
            min-height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          
          .cosmetic-price {
            color: #ffd700;
            font-weight: bold;
            font-size: 1.1rem;
            margin-bottom: 12px;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          }

          .glow-btn {
            border: none;
            padding: 10px;
            border-radius: 8px;
            font-weight: bold;
            text-transform: uppercase;
            transition: all 0.25s ease;
            width: 100%;
            cursor: pointer;
            font-size: 0.9rem;
            margin-top: auto;
          }
          
          .glow-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            filter: brightness(1.2);
          }

          .buy-btn { 
            background: linear-gradient(135deg, #28a745, #20c997);
            box-shadow: 0 0 10px #28a745;
            color: #fff;
          }
          
          .equip-btn { 
            background: linear-gradient(135deg, #1e6ef6, #00eaff);
            box-shadow: 0 0 10px #1e6ef6;
            color: #fff;
          }
          
          .equipped-btn { 
            background: linear-gradient(135deg, #6c757d, #495057);
            color: #fff;
            cursor: not-allowed;
            opacity: 0.7;
          }

          .equip-pulse {
            animation: pulseGlow 0.3s ease-out;
          }
          
          @keyframes pulseGlow {
            0% { 
              box-shadow: 0 0 0px cyan;
            }
            50% {
              box-shadow: 0 0 30px cyan;
            }
            100% { 
              box-shadow: 0 0 0px cyan;
            }
          }
          
          @media (max-width: 768px) {
            .shop-title {
              font-size: 1.2rem;
            }
            
            .glow-container {
              height: 120px;
            }
          }
        `}</style>

        <h1 className="text-center fw-bold mb-4 shop-title">🛒 Cosmetics Shop</h1>

        <input
          className="search-bar mb-4"
          placeholder="🔍 Search cosmetic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mb-4 text-center">
          <button
            className={`tab-btn ${activeTab === "avatar" ? "active" : ""}`}
            onClick={() => setActiveTab("avatar")}
          >
            👤 Avatars
          </button>
          <button
            className={`tab-btn ${activeTab === "badge" ? "active" : ""}`}
            onClick={() => setActiveTab("badge")}
          >
            🏆 Badges
          </button>
          <button
            className={`tab-btn ${activeTab === "nick_frame" ? "active" : ""}`}
            onClick={() => setActiveTab("nick_frame")}
          >
            🖼️ Nick Frames
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <p className="text-muted fs-5">
              {search ? "No cosmetics match your search." : "No cosmetics available in this category."}
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((item) => {
              if (!item.cosmetic_id) return null;
              
              const cosmeticId = item.cosmetic_id;
              const owned = isOwned(cosmeticId);
              const equipped = isEquipped(cosmeticId);
              
              // 🔥 Get image URL safely (type-safe)
              const imageUrl = getImageUrl(item.image);
              const hasValidImage = imageUrl && imageUrl.trim() !== "";
              
              return (
                <div key={cosmeticId} className="col-lg-3 col-md-4 col-sm-6 col-12">
                  <div className="cosmetic-card text-center" id={`card-${cosmeticId}`}>
                    {/* 🔥 Image or Placeholder */}
                    <div className="glow-container">
                      {hasValidImage ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="cosmetic-image"
                          loading="lazy"
                          onLoad={() => {
                            console.log(`✅ Image loaded: ${item.name}`);
                          }}
                          onError={(e) => {
                            console.error(`❌ Failed to load image for ${item.name}:`, imageUrl);
                            // Hide broken image and show placeholder
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.image-placeholder')) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'image-placeholder';
                              placeholder.innerHTML = `
                                ${item.type === 'avatar' ? '👤' : item.type === 'badge' ? '🏆' : '🖼️'}
                                <div class="placeholder-text">No Image</div>
                              `;
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      ) : (
                        // 🔥 Show placeholder if no image from the start
                        <div className="image-placeholder">
                          {item.type === 'avatar' ? '👤' : item.type === 'badge' ? '🏆' : '🖼️'}
                          <div className="placeholder-text">No Image</div>
                        </div>
                      )}
                    </div>

                    <h6 className="cosmetic-name">{item.name}</h6>
                    <p className="cosmetic-description">
                      {item.description || "No description available"}
                    </p>
                    <p className="cosmetic-price">🪙 {item.price}</p>

                    {!owned ? (
                      <button
                        className="glow-btn buy-btn"
                        onClick={() => handleBuy(cosmeticId)}
                      >
                        💰 Buy
                      </button>
                    ) : equipped ? (
                      <button className="glow-btn equipped-btn" disabled>
                        ✓ Equipped
                      </button>
                    ) : (
                      <button
                        className="glow-btn equip-btn"
                        onClick={() => handleEquip(cosmeticId)}
                      >
                        ⚡ Equip
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CosmeticsShop;