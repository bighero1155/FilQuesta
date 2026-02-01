// src/components/Cosmetics/CosmeticsShop.tsx
import React, { useEffect, useMemo, useState } from "react";
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

  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [userCosmetics, setUserCosmetics] = useState<UserCosmetic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  /* ================= ACTIONS ================= */
  const handleBuy = async (id: number) => {
    if (!user) return;

    try {
      await buyCosmetic(id);
      const owned = await getUserCosmetics(user.user_id);
      setUserCosmetics(owned);
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
    } catch (err: any) {
      alert(err?.response?.data?.message || "Equip failed");
    }
  };

  /* ================= STATES ================= */
  if (!user) return <p>Please log in.</p>;
  if (loading) return <p>Loading cosmetics…</p>;
  if (error) return <p>{error}</p>;

  /* ================= RENDER ================= */
  return (
    <div style={{ padding: 20 }}>
      <h2>Cosmetics Shop (Test)</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {cosmetics.map((c) => {
          if (!c.cosmetic_id) return null;

          const owned = ownedIds.has(c.cosmetic_id);
          const equipped = equippedIds.has(c.cosmetic_id);

          return (
            <li
              key={c.cosmetic_id}
              style={{
                border: "1px solid #ccc",
                padding: 12,
                marginBottom: 12,
              }}
            >
              <strong>{c.name}</strong>
              <div>Type: {c.type}</div>
              <div>Price: {c.price}</div>

              {/* IMAGE — SAFE AND STABLE */}
              {typeof c.image === "string" && (
                <img
                  src={c.image}
                  alt={c.name}
                  style={{ maxWidth: 120, marginTop: 8, display: "block" }}
                />
              )}

              {!owned && (
                <button onClick={() => handleBuy(c.cosmetic_id!)}>
                  Buy
                </button>
              )}

              {owned && !equipped && (
                <button onClick={() => handleEquip(c.cosmetic_id!)}>
                  Equip
                </button>
              )}

              {equipped && <span> ✅ Equipped</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CosmeticsShop;
