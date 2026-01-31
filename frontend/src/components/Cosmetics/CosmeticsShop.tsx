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
      // ✅ Images are already transformed to full URLs by the service
      setCosmetics(data);
    } catch (error) {
      console.error("Failed to load cosmetics:", error);
      alert("Failed to load cosmetics.");
    }
  }, []);

  /** Load user's owned cosmetics */
  const fetchUserCosmetics = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getUserCosmetics(user.user_id);
      // ✅ Images are already transformed to full URLs by the service
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

      // Update user coins in localStorage
      const updatedUser = {
        ...user,
        coins: result.remaining_coins ?? user.coins ?? 0,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Trigger storage event to update navbar coins
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "user",
          newValue: JSON.stringify(updatedUser),
        })
      );

      // Refresh user cosmetics to show new purchase
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

      // Refresh user cosmetics to update equipped status
      await fetchUserCosmetics();

      const equipped = cosmetics.find((c) => c.cosmetic_id === cosmeticId);

      // ✅ CRITICAL: If it's an avatar, update localStorage with the FULL URL
      // The backend controller stores the relative path in the database,
      // but we need the full URL for the frontend to display it
      if (equipped?.type === "avatar" && typeof equipped.image === "string") {
        const updatedUser = { 
          ...user, 
          avatar: equipped.image // ✅ This is already a full URL from getCosmetics()
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Trigger storage event to update avatar across the app
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "user",
            newValue: JSON.stringify(updatedUser),
          })
        );
      }

      // Animation pulse effect
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

  /** Helper: Check if user owns cosmetic */
  const isOwned = (id: number) => userCosmetics.some((uc) => uc.cosmetic_id === id);
  
  /** Helper: Check if cosmetic is equipped */
  const isEquipped = (id: number) =>
    userCosmetics.some((uc) => uc.cosmetic_id === id && uc.is_equipped);

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

  /** Filter cosmetics by active tab and search query */
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
      {/* BackButton Component */}
      <BackButton />

      {/* Dark overlay for better readability */}
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
        {/* ==== STYLES ==== */}
        <style>{`
          .shop-title {
            font-family: 'Press Start 2P', cursive;
            color: #00eaff;
            text-shadow: 0 0 10px #00eaff, 0 0 20px #00eaff;
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
            transition: all 0.25s ease;
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
            border-color: #00eaff;
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
          }
          
          .cosmetic-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 0 25px rgba(0,255,255,0.4);
            border-color: rgba(0,255,255,0.5);
          }

          .glow-container {
            background: radial-gradient(circle, rgba(0,255,255,0.35), transparent 65%);
            border-radius: 12px;
            padding: 10px;
            margin-bottom: 10px;
            min-height: 130px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .cosmetic-image {
            width: 100%;
            height: 110px;
            object-fit: contain;
            border-radius: 10px;
            transition: transform 0.3s ease;
          }
          
          .cosmetic-card:hover .cosmetic-image {
            transform: scale(1.1);
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
          
          .buy-btn:hover {
            box-shadow: 0 0 20px #28a745;
          }
          
          .equip-btn { 
            background: linear-gradient(135deg, #1e6ef6, #00eaff);
            box-shadow: 0 0 10px #1e6ef6;
            color: #fff;
          }
          
          .equip-btn:hover {
            box-shadow: 0 0 20px #1e6ef6;
          }
          
          .equipped-btn { 
            background: linear-gradient(135deg, #6c757d, #495057);
            color: #fff;
            cursor: not-allowed;
            opacity: 0.7;
          }

          /* Equip animation */
          .equip-pulse {
            animation: pulseGlow 0.3s ease-out;
          }
          
          @keyframes pulseGlow {
            0% { 
              box-shadow: 0 0 0px cyan;
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 30px cyan;
              transform: scale(1.05);
            }
            100% { 
              box-shadow: 0 0 0px cyan;
              transform: scale(1);
            }
          }
          
          /* Image loading placeholder */
          .image-placeholder {
            width: 100%;
            height: 110px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            color: rgba(255,255,255,0.5);
            font-size: 2rem;
          }
          
          /* Responsive font sizes */
          @media (max-width: 768px) {
            .shop-title {
              font-size: 1.2rem;
            }
            
            .tab-btn {
              font-size: 0.6rem;
              padding: 8px 15px;
            }
            
            .cosmetic-name {
              font-size: 0.9rem;
              min-height: 2rem;
            }
            
            .cosmetic-description {
              font-size: 0.75rem;
              min-height: 2rem;
            }
          }
        `}</style>

        {/* ==== TITLE ==== */}
        <h1 className="text-center fw-bold mb-4 shop-title">🛒 Cosmetics Shop</h1>

        {/* ==== SEARCH BAR ==== */}
        <input
          className="search-bar mb-4"
          placeholder="🔍 Search cosmetic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ==== TABS ==== */}
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

        {/* ==== COSMETICS GRID ==== */}
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
              
              return (
                <div key={cosmeticId} className="col-lg-3 col-md-4 col-sm-6 col-12">
                  <div className="cosmetic-card text-center" id={`card-${cosmeticId}`}>
                    {/* Image Container */}
                    <div className="glow-container">
                      {item.image && typeof item.image === "string" ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cosmetic-image"
                          onError={(e) => {
                            console.error("Failed to load cosmetic image:", item.image);
                            // Replace with placeholder
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.image-placeholder')) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'image-placeholder';
                              placeholder.innerHTML = '🖼️';
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">🖼️</div>
                      )}
                    </div>

                    {/* Cosmetic Info */}
                    <h6 className="cosmetic-name">{item.name}</h6>
                    <p className="cosmetic-description">
                      {item.description || "No description available"}
                    </p>
                    <p className="cosmetic-price">🪙 {item.price}</p>

                    {/* Action Button */}
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