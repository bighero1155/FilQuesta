// src/services/powerUpService.ts
import axios from "../auth/axiosInstance";

const API_URL = "/powerups";

export interface PowerUp {
  power_up_id: number;
  name: string;
  type: "time_freeze" | "second_chance" | "score_booster";
  description: string;
  price: number;
  duration_seconds?: number | null;
  multiplier?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserPowerUp {
  user_power_up_id: number;
  user_id: number;
  power_up_id: number;
  quantity: number;
  power_up?: {
    name: string;
    type: "time_freeze" | "second_chance" | "score_booster";
    description: string;
    price: number;
  };
}

/**
 * Fetch all available power-ups from the shop.
 * ✅ Shows loading screen (for shop browsing)
 */
export const getAllPowerUps = async (): Promise<PowerUp[]> => {
  const { data } = await axios.get<PowerUp[]>(API_URL);
  return data;
};

/**
 * Purchase a power-up using coins.
 * ✅ Shows loading screen (important transaction)
 */
export const buyPowerUp = async (
  user_id: number,
  power_up_id: number
): Promise<{
  message: string;
  coins_left: number;
  quantity: number;
}> => {
  const { data } = await axios.post(`${API_URL}/buy`, {
    user_id,
    power_up_id,
  });
  return data;
};

/**
 * Activate (use) a power-up during gameplay.
 * ⚡ SKIPS loading screen to prevent gameplay interruption
 */
export const activatePowerUp = async (
  user_id: number,
  power_up_type: "time_freeze" | "second_chance" | "score_booster"
): Promise<{
  message: string;
  effect: string;
  remaining: number;
  duration?: number | null;
  multiplier?: number | null;
}> => {
  const { data } = await axios.post(
    `${API_URL}/use`,
    {
      user_id,
      power_up_type,
    },
    {
      skipLoading: true, // ⚡ Skip loading screen
    } as any
  );
  return data;
};

/**
 * Fetch user's power-up inventory.
 * ⚡ SKIPS loading screen for seamless UI updates
 */
export const getUserPowerUps = async (
  user_id: number
): Promise<UserPowerUp[]> => {
  const { data } = await axios.get(`/users/${user_id}/powerups`, {
    skipLoading: true, // ⚡ Skip loading screen
  } as any);
  return data;
};