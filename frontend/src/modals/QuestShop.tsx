// src/modals/QuestShop.tsx
import React, { useState } from "react";
import axios from "../auth/axiosInstance";
import { useNavigate } from "react-router-dom";

export interface UserProfile {
  user_id: number;
  username: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  coins: number;
  total_score: number;
  role?: string;
  rank: string;
  avatar?: string;
  [key: string]: any;
}

interface QuestShopProps {
  show: boolean;
  onClose: () => void;
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
}

const getRankByCoins = (coins: number): string => {
  if (coins >= 1000) return "Legend";
  if (coins >= 500) return "Pro";
  if (coins >= 100) return "Advanced";
  if (coins >= 50) return "Intermediate";
  return "Beginner";
};

const QuestShop: React.FC<QuestShopProps> = ({
  show,
  onClose,
  user,
  // setUser is not used since we reload the page after conversion
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!show) return null;

  const totalScore = user?.total_score ?? 0;
  const coins = user?.coins ?? 0;
  const coinsToAdd = Math.floor(totalScore / 10);
  const scoreToDeduct = coinsToAdd * 10;

  const handleExchange = async () => {
    if (!user || coinsToAdd === 0) return;
    setLoading(true);
    setSuccess(false);

    const updatedUser = {
      ...user,
      coins: coins + coinsToAdd,
      total_score: totalScore - scoreToDeduct,
      rank: getRankByCoins(coins + coinsToAdd),
    };

    try {
      // Save to database
      await axios.put(`/users/${user.user_id}`, {
        first_name: user.first_name ?? "",
        middle_name: user.middle_name ?? "",
        last_name: user.last_name ?? "",
        age: user.age ?? "",
        address: user.address ?? "",
        school: user.school ?? "",
        contact_number: user.contact_number ?? "",
        username: user.username,
        section: user.section ?? "",
        email: user.email ?? "",
        role: user.role ?? "student",
        coins: updatedUser.coins,
        total_score: updatedUser.total_score,
        avatar: user.avatar ?? "",
        rank: updatedUser.rank,
      });

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("total_score", String(updatedUser.total_score));
      
      // Show success message
      setSuccess(true);
      
      // ✅ FIXED: Automatically reload page after successful conversion
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Wait 1 second to show success message
      
    } catch (err) {
      console.error("Score conversion failed:", err);
      alert("❌ Conversion failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, rgba(26, 35, 126, 0.95), rgba(49, 27, 146, 0.95))",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <style>{`
        @media (max-width: 992px) {
          .shop-grid {
            flex-direction: column !important;
          }
        }

        @media (max-width: 768px) {
          .shop-modal {
            padding: 20px !important;
            max-height: 95vh !important;
          }
        }

        @media (max-width: 480px) {
          .shop-card {
            padding: 20px !important;
          }

          .shop-title {
            font-size: 1.4rem !important;
          }

          .stat-card {
            width: 100% !important;
            justify-content: center;
          }
        }

        .shop-card {
          transition: all 0.3s ease;
        }
        .shop-card:hover {
          transform: translateY(-6px) scale(1.02);
        }
      `}</style>

      <div
        className="shop-modal"
        style={{
          width: "100%",
          maxWidth: "1200px",
          background:
            "linear-gradient(145deg, rgba(30, 30, 60, 0.95), rgba(20, 20, 40, 0.95))",
          borderRadius: "24px",
          padding: "40px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          color: "#fff",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          className="shop-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          <span>🏪 Quest Shop</span>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "none",
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              fontSize: "1.6rem",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "25px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <div
            className="stat-card"
            style={{
              padding: "18px 32px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            🪙 Coins: <b>{coins}</b>
          </div>

          <div
            className="stat-card"
            style={{
              padding: "18px 32px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            ⭐ Score: <b>{totalScore}</b>
          </div>
        </div>

        {success && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "12px",
              background: "rgba(0,255,157,0.2)",
              borderRadius: "10px",
              color: "#00ff9d",
              fontWeight: "bold",
              animation: "pulse 0.5s ease-in-out",
            }}
          >
            ✔ Conversion Successful! Reloading...
          </div>
        )}

        {/* Cards */}
        <div
          className="shop-grid"
          style={{
            display: "flex",
            gap: "25px",
            flexWrap: "wrap",
          }}
        >
          {/* Buy Coins */}
          <div
            className="shop-card"
            style={{
              flex: 1,
              minWidth: "300px",
              background: "rgba(0,255,170,0.15)",
              padding: "30px",
              borderRadius: "20px",
            }}
          >
            <h3>💰 Buy Coins</h3>
            <p>10 Score = 1 Coin</p>

            {coinsToAdd === 0 ? (
              <p style={{ color: "#ffcc66" }}>Not enough score.</p>
            ) : (
              <button
                onClick={handleExchange}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: loading ? "#888" : "#28a745",
                  borderRadius: "10px",
                  border: "none",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading
                  ? "Converting..."
                  : `Convert ${scoreToDeduct} → ${coinsToAdd} Coins`}
              </button>
            )}
          </div>

          {/* Cosmetics */}
          <div
            className="shop-card"
            style={{
              flex: 1,
              minWidth: "300px",
              background: "rgba(102,126,234,0.2)",
              padding: "30px",
              borderRadius: "20px",
            }}
          >
            <h3>✨ Cosmetics</h3>
            <p>Avatars, frames, badges!</p>
            <button
              onClick={() => {
                onClose();
                navigate("/cosmeticshop");
              }}
              style={{
                width: "100%",
                padding: "12px",
                background: "#667eea",
                borderRadius: "10px",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Visit Shop →
            </button>
          </div>

          {/* Power-Ups */}
          <div
            className="shop-card"
            style={{
              flex: 1,
              minWidth: "300px",
              background: "rgba(245,158,11,0.2)",
              padding: "30px",
              borderRadius: "20px",
            }}
          >
            <h3>⚡ Power-Ups</h3>
            <p>Boosts & special items!</p>
            <button
              onClick={() => {
                onClose();
                navigate("/powerupshop");
              }}
              style={{
                width: "100%",
                padding: "12px",
                background: "#f59e0b",
                borderRadius: "10px",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Visit Shop →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestShop;