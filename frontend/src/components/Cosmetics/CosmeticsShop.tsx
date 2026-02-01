// src/components/Cosmetics/CosmeticsShop.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCosmetics,
  getUserCosmetics,
  buyCosmetic,
  equipCosmetic,
  Cosmetic,
  UserCosmetic,
} from "../../services/cosmeticService";
import { useAuth } from "../../context/AuthContext";

interface AuthUser {
  user_id: number;
  coins?: number;
  avatar?: string;
}

const CosmeticsShop: React.FC = () => {
  const { user } = useAuth() as { user: AuthUser | null };
  const navigate = useNavigate();

  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [userCosmetics, setUserCosmetics] = useState<UserCosmetic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("all");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        setLoading(true);
        const [allCosmetics, owned] = await Promise.all([
          getCosmetics(),
          getUserCosmetics(user.user_id),
        ]);
        setCosmetics(allCosmetics);
        setUserCosmetics(owned);
      } catch (err) {
        console.error(err);
        setError("Failed to load cosmetics.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  /* ================= DERIVED STATE ================= */
  const ownedIds = useMemo(
    () => new Set(userCosmetics.map((u) => u.cosmetic_id)),
    [userCosmetics]
  );

  const equippedIds = useMemo(
    () =>
      new Set(
        userCosmetics
          .filter((u) => u.is_equipped)
          .map((u) => u.cosmetic_id)
      ),
    [userCosmetics]
  );

  const cosmeticTypes = useMemo(() => {
    const types = new Set(cosmetics.map((c) => c.type));
    return ["all", ...Array.from(types)];
  }, [cosmetics]);

  const filteredCosmetics = useMemo(() => {
    if (selectedTab === "all") return cosmetics;
    return cosmetics.filter((c) => c.type === selectedTab);
  }, [cosmetics, selectedTab]);

  /* ================= ACTIONS ================= */
  const handleBuy = async (id: number) => {
    if (!user) return;

    try {
      await buyCosmetic(id);
      const owned = await getUserCosmetics(user.user_id);
      setUserCosmetics(owned);

      // Update coins in localStorage and trigger refresh
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Fetch updated user data or manually update coins
        const cosmetic = cosmetics.find(c => c.cosmetic_id === id);
        if (cosmetic && parsed.coins !== undefined) {
          parsed.coins -= cosmetic.price;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
      }

      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
      
    } catch (err: any) {
      alert(err?.response?.data?.message || "Buy failed");
    }
  };

  const handleEquip = async (id: number) => {
    if (!user) return;

    try {
      await equipCosmetic(id);
      const owned = await getUserCosmetics(user.user_id);
      setUserCosmetics(owned);

      // Update equipped cosmetic in localStorage
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const equippedCosmetic = cosmetics.find(c => c.cosmetic_id === id);
        if (equippedCosmetic && equippedCosmetic.image) {
          // Update avatar with equipped cosmetic image
          parsed.avatar = equippedCosmetic.image;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
      }

      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));
      
      // Force a page refresh to update all components
      window.location.reload();
      
    } catch (err: any) {
      alert(err?.response?.data?.message || "Equip failed");
    }
  };

  /* ================= STYLES ================= */
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1929 0%, #1a2f4a 50%, #0f2744 100%)",
      padding: "2rem",
      fontFamily: "'Arial', 'Segoe UI', sans-serif",
      color: "#e0f2ff",
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.75rem 1.5rem",
      background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)",
      border: "2px solid rgba(56, 189, 248, 0.3)",
      borderRadius: "12px",
      color: "#e0f2ff",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginBottom: "2rem",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    },
    backIcon: {
      fontSize: "1.25rem",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      padding: "1.5rem 2rem",
      background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)",
      borderRadius: "16px",
      border: "2px solid rgba(56, 189, 248, 0.3)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    } as React.CSSProperties,
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      margin: 0,
      background: "linear-gradient(135deg, #60a5fa, #38bdf8, #7dd3fc)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      textShadow: "0 0 30px rgba(56, 189, 248, 0.5)",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    } as React.CSSProperties,
    titleIcon: {
      fontSize: "2rem",
      filter: "drop-shadow(0 0 10px rgba(56, 189, 248, 0.8))",
    },
    userCoins: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      background: "rgba(15, 23, 42, 0.6)",
      padding: "0.75rem 1.5rem",
      borderRadius: "50px",
      border: "2px solid rgba(96, 165, 250, 0.4)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    },
    coinIcon: {
      fontSize: "1.5rem",
      filter: "drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))",
    },
    coinAmount: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#fbbf24",
      textShadow: "0 0 10px rgba(251, 191, 36, 0.5)",
    },
    coinLabel: {
      fontSize: "0.875rem",
      color: "#94a3b8",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
    },
    tabs: {
      display: "flex",
      gap: "1rem",
      marginBottom: "2rem",
      padding: "0.5rem",
      background: "rgba(15, 23, 42, 0.4)",
      borderRadius: "12px",
      border: "1px solid rgba(56, 189, 248, 0.2)",
      flexWrap: "wrap" as const,
    },
    tabButton: (isActive: boolean) => ({
      flex: 1,
      minWidth: "120px",
      padding: "0.875rem 1.5rem",
      background: isActive
        ? "linear-gradient(135deg, #2563eb, #3b82f6)"
        : "rgba(30, 58, 95, 0.5)",
      border: `2px solid ${isActive ? "#60a5fa" : "rgba(56, 189, 248, 0.3)"}`,
      borderRadius: "8px",
      color: isActive ? "#ffffff" : "#94a3b8",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "capitalize" as const,
      boxShadow: isActive
        ? "0 4px 16px rgba(37, 99, 235, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
        : "none",
    }),
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    card: (owned: boolean, equipped: boolean) => ({
      background: owned
        ? "linear-gradient(135deg, #1e3a5f 0%, #1f4d3f 100%)"
        : "linear-gradient(135deg, #1e3a5f 0%, #234567 100%)",
      border: equipped
        ? "2px solid rgba(251, 191, 36, 0.6)"
        : owned
        ? "2px solid rgba(34, 197, 94, 0.4)"
        : "2px solid rgba(56, 189, 248, 0.3)",
      borderRadius: "16px",
      padding: "1.5rem",
      position: "relative" as const,
      transition: "all 0.3s ease",
      boxShadow: equipped
        ? "0 4px 16px rgba(251, 191, 36, 0.3), 0 0 32px rgba(251, 191, 36, 0.2)"
        : "0 4px 16px rgba(0, 0, 0, 0.3)",
      overflow: "hidden" as const,
    }),
    equippedBadge: {
      position: "absolute" as const,
      top: "1rem",
      right: "1rem",
      background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      color: "#1e3a5f",
      padding: "0.375rem 0.875rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      boxShadow: "0 2px 8px rgba(251, 191, 36, 0.4)",
      zIndex: 1,
    },
    imageContainer: {
      width: "100%",
      height: "200px",
      background: "linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 58, 95, 0.4))",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1rem",
      border: "2px solid rgba(56, 189, 248, 0.2)",
      overflow: "hidden" as const,
      position: "relative" as const,
    },
    image: {
      maxWidth: "90%",
      maxHeight: "90%",
      objectFit: "contain" as const,
      filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
      zIndex: 1,
    },
    placeholder: {
      fontSize: "4rem",
      opacity: 0.5,
      filter: "drop-shadow(0 4px 8px rgba(56, 189, 248, 0.3))",
    },
    info: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.75rem",
    },
    name: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      margin: 0,
      color: "#e0f2ff",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    type: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      background: "rgba(56, 189, 248, 0.2)",
      border: "1px solid rgba(56, 189, 248, 0.4)",
      borderRadius: "20px",
      fontSize: "0.75rem",
      color: "#7dd3fc",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      fontWeight: 600,
      width: "fit-content",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "0.5rem",
      paddingTop: "1rem",
      borderTop: "1px solid rgba(56, 189, 248, 0.2)",
    },
    price: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    priceIcon: {
      fontSize: "1.25rem",
      filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))",
    },
    priceAmount: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#c084fc",
      textShadow: "0 0 8px rgba(168, 85, 247, 0.4)",
    },
    actions: {
      display: "flex",
      gap: "0.5rem",
      alignItems: "center",
    },
    btnBuy: (disabled: boolean) => ({
      padding: "0.625rem 1.25rem",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      background: disabled
        ? "linear-gradient(135deg, #475569, #64748b)"
        : "linear-gradient(135deg, #2563eb, #3b82f6)",
      color: "white",
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
      opacity: disabled ? 0.6 : 1,
    }),
    btnEquip: {
      padding: "0.625rem 1.25rem",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      background: "linear-gradient(135deg, #059669, #10b981)",
      color: "white",
      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
    },
    ownedIndicator: {
      padding: "0.5rem 1rem",
      background: "rgba(34, 197, 94, 0.2)",
      border: "1px solid rgba(34, 197, 94, 0.4)",
      borderRadius: "8px",
      color: "#4ade80",
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase" as const,
    },
    centerBox: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px",
      textAlign: "center" as const,
      background: "rgba(30, 58, 95, 0.3)",
      border: "2px solid rgba(56, 189, 248, 0.3)",
      borderRadius: "16px",
      padding: "3rem",
    },
    spinner: {
      width: "60px",
      height: "60px",
      border: "4px solid rgba(56, 189, 248, 0.2)",
      borderTopColor: "#38bdf8",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "1rem",
    },
    icon: {
      fontSize: "4rem",
      marginBottom: "1rem",
      filter: "drop-shadow(0 4px 12px rgba(56, 189, 248, 0.4))",
    },
  };

  /* ================= STATES ================= */
  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.centerBox}>
          <div style={styles.icon}>🔒</div>
          <h3>Authentication Required</h3>
          <p>Please log in to access the cosmetics shop</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={styles.centerBox}>
          <div style={styles.spinner}></div>
          <p>Loading cosmetics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.centerBox}>
          <div style={styles.icon}>⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button
        style={styles.backButton}
        onClick={() => navigate("/landing")}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #2d5a8a, #3b7ab8)";
          e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.5)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(56, 189, 248, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)";
          e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.3)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        }}
      >
        <span style={styles.backIcon}>←</span>
        Back to Landing
      </button>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>✨</span>
          Cosmetics Shop
          <span style={styles.titleIcon}>✨</span>
        </h1>
        <div style={styles.userCoins}>
          <span style={styles.coinIcon}>💰</span>
          <span style={styles.coinAmount}>{user.coins || 0}</span>
          <span style={styles.coinLabel}>Coins</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {cosmeticTypes.map((type) => (
          <button
            key={type}
            style={styles.tabButton(selectedTab === type)}
            onClick={() => setSelectedTab(type)}
            onMouseEnter={(e) => {
              if (selectedTab !== type) {
                e.currentTarget.style.background = "rgba(45, 90, 138, 0.6)";
                e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.5)";
                e.currentTarget.style.color = "#e0f2ff";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(56, 189, 248, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTab !== type) {
                e.currentTarget.style.background = "rgba(30, 58, 95, 0.5)";
                e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.3)";
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Cosmetics Grid */}
      <div style={styles.grid}>
        {filteredCosmetics.map((c) => {
          if (!c.cosmetic_id) return null;

          const owned = ownedIds.has(c.cosmetic_id);
          const equipped = equippedIds.has(c.cosmetic_id);

          return (
            <div
              key={c.cosmetic_id}
              style={styles.card(owned, equipped)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.6)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(56, 189, 248, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = equipped
                  ? "rgba(251, 191, 36, 0.6)"
                  : owned
                  ? "rgba(34, 197, 94, 0.4)"
                  : "rgba(56, 189, 248, 0.3)";
                e.currentTarget.style.boxShadow = equipped
                  ? "0 4px 16px rgba(251, 191, 36, 0.3), 0 0 32px rgba(251, 191, 36, 0.2)"
                  : "0 4px 16px rgba(0, 0, 0, 0.3)";
              }}
            >
              {equipped && (
                <div style={styles.equippedBadge}>
                  <span>✓</span> Equipped
                </div>
              )}

              <div style={styles.imageContainer}>
                {typeof c.image === "string" ? (
                  <img src={c.image} alt={c.name} style={styles.image} />
                ) : (
                  <div style={styles.placeholder}>
                    <span>🎨</span>
                  </div>
                )}
              </div>

              <div style={styles.info}>
                <h3 style={styles.name}>{c.name}</h3>
                <span style={styles.type}>{c.type}</span>

                <div style={styles.footer}>
                  <div style={styles.price}>
                    <span style={styles.priceIcon}>💎</span>
                    <span style={styles.priceAmount}>{c.price}</span>
                  </div>

                  <div style={styles.actions}>
                    {!owned && (
                      <button
                        style={styles.btnBuy(
                          user.coins !== undefined && user.coins < c.price
                        )}
                        onClick={() => handleBuy(c.cosmetic_id!)}
                        disabled={
                          user.coins !== undefined && user.coins < c.price
                        }
                        onMouseEnter={(e) => {
                          if (
                            !(user.coins !== undefined && user.coins < c.price)
                          ) {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #1d4ed8, #2563eb)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 16px rgba(37, 99, 235, 0.5)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (
                            !(user.coins !== undefined && user.coins < c.price)
                          ) {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #2563eb, #3b82f6)";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(37, 99, 235, 0.4)";
                          }
                        }}
                      >
                        Buy
                      </button>
                    )}

                    {owned && !equipped && (
                      <button
                        style={styles.btnEquip}
                        onClick={() => handleEquip(c.cosmetic_id!)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #047857, #059669)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 16px rgba(16, 185, 129, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #059669, #10b981)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(16, 185, 129, 0.4)";
                        }}
                      >
                        Equip
                      </button>
                    )}

                    {owned && <span style={styles.ownedIndicator}>Owned</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCosmetics.length === 0 && (
        <div style={styles.centerBox}>
          <div style={styles.icon}>📦</div>
          <p>No cosmetics available in this category</p>
        </div>
      )}
    </div>
  );
};

export default CosmeticsShop;