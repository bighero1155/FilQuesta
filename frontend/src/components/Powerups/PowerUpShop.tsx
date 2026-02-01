// src/components/Powerups/PowerUpShop.tsx
import React, { useEffect, useState } from "react";
import { getAllPowerUps, buyPowerUp, PowerUp } from "../../services/powerUpService";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../BackButton";
import "bootstrap/dist/css/bootstrap.min.css";

const PowerUpShop: React.FC = () => {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [coins, setCoins] = useState<number>(0);
  const { user } = useAuth();

  // Icon mapping based on power-up name
  const getPowerUpIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("freeze") || lowerName.includes("time")) {
      return "🧊"; // Ice cube for freeze/time freeze
    } else if (lowerName.includes("second") || lowerName.includes("chance") || lowerName.includes("life") || lowerName.includes("heart")) {
      return "❤️"; // Heart for second chance/extra life
    } else if (lowerName.includes("score") || lowerName.includes("boost") || lowerName.includes("multiplier") || lowerName.includes("double")) {
      return "🪙"; // Coin for score boost/multiplier
    } else {
      return "⚡"; // Default power-up icon
    }
  };

  useEffect(() => {
    const fetchPowerUps = async () => {
      try {
        const data = await getAllPowerUps();
        setPowerUps(data);

        const stored = localStorage.getItem("user");
        const userCoins = stored ? JSON.parse(stored).coins ?? 0 : 0;
        setCoins(userCoins);
      } catch (err) {
        console.error("Failed to load power-ups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPowerUps();
  }, []);

  const handleBuy = async (power_up_id: number, price: number) => {
    if (!user) return;

    if (coins < price) {
      setMessage("❌ Not enough coins!");
      return;
    }

    try {
      const res = await buyPowerUp(user.user_id, power_up_id);
      setMessage(res.message);
      setCoins(res.coins_left);

      // Sync to localStorage
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.coins = res.coins_left;
        localStorage.setItem("user", JSON.stringify(parsed));
      }

      // Animation pulse effect
      const card = document.getElementById(`card-${power_up_id}`);
      if (card) {
        card.classList.add("buy-pulse");
        setTimeout(() => card.classList.remove("buy-pulse"), 300);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Purchase failed.");
    }
  };

  if (loading)
    return <div className="text-center mt-5 text-white">⏳ Loading Power-Up Shop...</div>;

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundImage: `url('/assets/market3.jpg')`,
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

      {/* Content */}
      <div className="container text-center text-white position-relative" style={{ zIndex: 2 }}>
        {/* ==== STYLE ==== */}
        <style>{`
          .shop-title {
            font-family: 'Press Start 2P';
            color: #00eaff;
            text-shadow: 0 0 10px #00eaff;
          }

          .powerup-card {
            padding: 20px;
            border-radius: 14px;
            background: rgba(0,0,0,0.45);
            border: 2px solid #00eaff;
            backdrop-filter: blur(4px);
            transition: 0.3s ease;
            color: white;
          }
          .powerup-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 0 25px rgba(0,255,255,0.5);
            border-color: #00ffff;
          }

          .glow-container {
            background: radial-gradient(circle, rgba(0,255,255,0.35), transparent 65%);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 1rem;
          }

          .coin-display {
            background: rgba(0,0,0,0.4);
            border: 2px solid cyan;
            border-radius: 15px;
            padding: 15px;
            box-shadow: 0 0 15px rgba(0,255,255,0.3);
          }

          .message-alert {
            background: rgba(255,255,255,0.15);
            border: 2px solid rgba(0,255,255,0.5);
            border-radius: 12px;
            padding: 12px;
            animation: fadeIn 0.3s ease;
          }

          .buy-btn {
            background: #1e6ef6;
            box-shadow: 0 0 10px #1e6ef6;
            border: none;
            padding: 10px;
            border-radius: 8px;
            font-weight: 700;
            text-transform: uppercase;
            transition: 0.25s ease;
            width: 75%;
            color: white;
          }
          .buy-btn:hover {
            background: #2a7fff;
            box-shadow: 0 0 20px #1e6ef6;
            transform: scale(1.05);
          }

          /* Buy animation */
          .buy-pulse {
            animation: pulseGlow 0.3s ease-out;
          }
          @keyframes pulseGlow {
            0% { 
              box-shadow: 0 0 0px cyan;
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 30px cyan;
              transform: scale(1.02);
            }
            100% { 
              box-shadow: 0 0 0px cyan;
              transform: scale(1);
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .powerup-title {
            text-shadow: 0 0 6px cyan;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }

          .powerup-description {
            color: #00eaff;
            font-size: 0.95rem;
            margin-bottom: 1rem;
          }

          .powerup-price {
            color: #ffc107;
            font-weight: bold;
            font-size: 1.1rem;
            margin-bottom: 1rem;
          }
        `}</style>

        <h2 className="fw-bold mb-4 shop-title">
          ⚡ Power-Up Shop
        </h2>

        <div className="coin-display w-50 mx-auto mb-4">
          💰 Your Coins: <strong style={{ color: '#ffc107', fontSize: '1.3rem' }}>{coins}</strong>
        </div>

        {message && (
          <div className="message-alert w-50 mx-auto mb-4">
            {message}
          </div>
        )}

        <div className="row justify-content-center g-4">
          {powerUps.map((p) => (
            <div key={p.power_up_id} className="col-lg-4 col-md-6 col-sm-12">
              <div className="powerup-card h-100" id={`card-${p.power_up_id}`}>
                <div className="glow-container">
                  <div style={{
                    fontSize: '3rem',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getPowerUpIcon(p.name)}
                  </div>
                </div>

                <h4 className="powerup-title">
                  {p.name}
                </h4>
                <p className="powerup-description">{p.description}</p>
                <p className="powerup-price">💰 {p.price} coins</p>

                <button
                  className="buy-btn"
                  onClick={() => handleBuy(p.power_up_id, p.price)}
                >
                  Buy {p.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PowerUpShop;