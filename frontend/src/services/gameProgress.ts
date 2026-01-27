// src/services/gameProgress.ts
import { updateUserProgress, getUserProfile } from "./userService";
import { getUserLevels, saveLevel } from "./levelService";

export interface GameProgressConfig {
  sceneKey: string;  // e.g. "MathFruitScene" or "WordWizardScene"
  maxLevel: number;  // total levels available in the game
}

// --- USER ID HANDLING ---
export function getUserId(): number | null {
  try {
    const userIdStr = localStorage.getItem("user_id");
    if (userIdStr) return Number(userIdStr);
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return Number(user.user_id || user.id);
    }
    return null;
  } catch {
    return null;
  }
}

// --- LEVEL HANDLING ---
export async function fetchUnlockedCount(userId: number, config: GameProgressConfig): Promise<number> {
  const records = await getUserLevels(userId);
  const rec = records.find(r => r.game_name === config.sceneKey);
  const count = Number(rec?.unlocked_levels ?? 0);
  return Math.max(1, Math.min(count, config.maxLevel));
}

export async function unlockNextLevel(
  userId: number,
  currentLevel: number,
  unlockedCount: number,
  config: GameProgressConfig
): Promise<number> {
  const nextLevel = currentLevel + 1;
  if (nextLevel > unlockedCount) {
    try {
      await saveLevel(userId, config.sceneKey, nextLevel);
      unlockedCount = nextLevel;
    } catch (e) {
      console.error("Failed to save unlocked level:", e);
    }
  }
  return Math.min(unlockedCount, config.maxLevel);
}

// --- SCORE HANDLING ---
export async function addScore(userId: number | null, currentScore: number, points: number): Promise<number> {
  const newScore = currentScore + points;
  if (!userId) return newScore;

  try {
    await updateUserProgress(userId, points);
    const updatedUser = await getUserProfile(userId);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("total_score", String(updatedUser.total_score));
  } catch (error) {
    console.error("Failed to update score:", error);
  }

  return newScore;
}
