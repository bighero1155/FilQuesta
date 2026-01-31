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

  /** Load shops */
  const fetchCosmetics = useCallback(async () => {
    try {
      const data = await getCosmetics();
      setCosmetics(data);
    } catch {
      alert("Failed to load cosmetics.");
    }
  }, []);

  /** Load user's cosmetics */
  const fetchUserCosmetics = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getUserCosmetics(user.user_id);
      setUserCosmetics(data);
    } catch {
      alert("Failed to load your owned cosmetics.");
    }
  }, [user]);

  useEffect(() => {
    fetchCosmetics();
    if (user) fetchUserCosmetics();
    setLoading(false);
  }, [user, fetchCosmetics, fetchUserCosmetics]);

  /** Buying cosmetic */
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
      if (equipped?.type === "avatar") {
        const updatedUser = { 
          ...user, 
          avatar: typeof equipped.image === "string" ? equipped.image : undefined 
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
      alert(error?.response?.data?.message || "Failed to equip cosmetic.");
    }
  };

  /** Helpers */
  const isOwned = (id: number) => userCosmetics.some((uc) => uc.cosmetic_id === id);
  const isEquipped = (id: number) =>
    userCosmetics.some((uc) => uc.cosmetic_id === id && uc.is_equipped);

  if (loading) {
    return (
      <div className="text-center my-5 text-white">
        <div className="spinner-border text-info"></div>
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
      {/* BackButton Component */}
      <BackButton />

      {/* Dark overlay */}
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
        {/* ==== STYLE ==== */}
        <style>{`
          .shop-title {
            font-family: 'Press Start 2P';
            color: #00eaff;
            text-shadow: 0 0 10px #00eaff;
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
            font-family: 'Press Start 2P';
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
          }

          .cosmetic-card {
            padding: 15px;
            border-radius: 14px;
            background: rgba(255,255,255,0.08);
            border: 2px solid rgba(0,255,255,0.2);
            transition: 0.2s ease;
          }
          .cosmetic-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 0 20px rgba(0,255,255,0.35);
          }

          .glow-container {
            background: radial-gradient(circle, rgba(0,255,255,0.35), transparent 65%);
            border-radius: 12px;
            padding: 10px;
          }

          .glow-btn {
            border: none;
            padding: 8px;
            border-radius: 8px;
            font-weight: bold;
            text-transform: uppercase;
            transition: 0.25s ease;
            width: 100%;
          }

          .buy-btn { background:#28a745; box-shadow:0 0 10px #28a745; color:#fff; }
          .equip-btn { background:#1e6ef6; box-shadow:0 0 10px #1e6ef6; color:#fff; }
          .equipped-btn { background:#666; color:#fff; }

          /* Equip animation */
          .equip-pulse {
            animation: pulseGlow 0.3s ease-out;
          }
          @keyframes pulseGlow {
            from { box-shadow: 0 0 0px cyan; }
            to { box-shadow: 0 0 20px cyan; }
          }
        `}</style>

        {/* ==== TITLE ==== */}
        <h1 className="text-center fw-bold mb-4 shop-title">🛒 Cosmetics Shop</h1>

        {/* ==== SEARCH ==== */}
        <input
          className="search-bar mb-4"
          placeholder="Search cosmetic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ==== TABS ==== */}
        <div className="mb-4">
          <button
            className={`tab-btn ${activeTab === "avatar" ? "active" : ""}`}
            onClick={() => setActiveTab("avatar")}
          >
            Avatars
          </button>
          <button
            className={`tab-btn ${activeTab === "badge" ? "active" : ""}`}
            onClick={() => setActiveTab("badge")}
          >
            Badges
          </button>
          <button
            className={`tab-btn ${activeTab === "nick_frame" ? "active" : ""}`}
            onClick={() => setActiveTab("nick_frame")}
          >
            Nick Frames
          </button>
        </div>

        {/* ==== GRID ==== */}
        {filtered.length === 0 ? (
          <p className="text-muted">No cosmetics found.</p>
        ) : (
          <div className="row g-4">
            {filtered.map((item) => {
              if (!item.cosmetic_id) return null;
              
              const cosmeticId = item.cosmetic_id;
              
              return (
                <div key={cosmeticId} className="col-lg-3 col-md-4 col-sm-6 col-12">
                  <div className="cosmetic-card text-center" id={`card-${cosmeticId}`}>
                    {item.image && typeof item.image === "string" && (
                      <div className="glow-container mb-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "110px",
                            objectFit: "contain",
                            borderRadius: "10px",
                          }}
                          onError={(e) => {
                            console.error("Failed to load image:", item.image);
                            e.currentTarget.src = "/assets/placeholder.png";
                          }}
                        />
                      </div>
                    )}

                    <h6 className="fw-bold">{item.name}</h6>
                    <p className="text-info small">{item.description}</p>
                    <p className="text-warning fw-bold mb-2">🪙 {item.price}</p>

                    {!isOwned(cosmeticId) ? (
                      <button
                        className="glow-btn buy-btn"
                        onClick={() => handleBuy(cosmeticId)}
                      >
                        Buy
                      </button>
                    ) : isEquipped(cosmeticId) ? (
                      <button className="glow-btn equipped-btn" disabled>
                        Equipped
                      </button>
                    ) : (
                      <button
                        className="glow-btn equip-btn"
                        onClick={() => handleEquip(cosmeticId)}
                      >
                        Equip
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