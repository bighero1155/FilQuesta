import api from "../auth/axiosInstance";

/* ========================================
   TYPES
======================================== */

export interface Level {
  id: number;
  user_id: number;
  game_name: string;
  unlocked_levels: number;
  created_at: string;
  updated_at: string;
}

/* ========================================
   CORE LEVEL API
======================================== */

// Get all levels of a user
export async function getUserLevels(userId: number): Promise<Level[]> {
  if (!userId) throw new Error("User ID is undefined");

  const res = await api.get(`/users/${userId}/levels`);
  return res.data;
}

// Save or update levels for a game and user
export async function saveLevel(
  userId: number,
  gameName: string,
  unlockedLevels: number
): Promise<Level> {
  if (!userId) throw new Error("User ID is undefined");

  const res = await api.post(`/users/${userId}/levels`, {
    game_name: gameName,
    unlocked_levels: unlockedLevels,
  });

  return res.data.level;
}

// Increment unlocked_levels automatically
export async function unlockNextLevel(
  userId: number,
  gameName: string
): Promise<Level> {
  const allLevels = await getUserLevels(userId);
  const current = allLevels.find((l) => l.game_name === gameName);
  const nextValue = (current?.unlocked_levels ?? 0) + 1;
  return saveLevel(userId, gameName, nextValue);
}

/* ========================================
   CATEGORY HELPERS
======================================== */

export async function getCategoryProgress(
  userId: number,
  gameBaseName: string,
  categoryId: string
): Promise<number> {
  const levels = await getUserLevels(userId);
  const gameName = `${gameBaseName}_${categoryId}`;
  return levels.find((l) => l.game_name === gameName)?.unlocked_levels ?? 0;
}

export async function getAllCategoryProgress(
  userId: number,
  gameBaseName: string,
  categories: string[]
): Promise<Record<string, number>> {
  const levels = await getUserLevels(userId);

  const progress: Record<string, number> = {};
  categories.forEach((cat) => (progress[cat] = 0));

  levels.forEach((lvl) => {
    if (lvl.game_name.startsWith(`${gameBaseName}_`)) {
      const category = lvl.game_name.replace(`${gameBaseName}_`, "");
      if (category in progress) {
        progress[category] = lvl.unlocked_levels;
      }
    }
  });

  return progress;
}

export async function saveCategoryLevel(
  userId: number,
  gameBaseName: string,
  categoryId: string,
  levelNumber: number
): Promise<Level> {
  return saveLevel(
    userId,
    `${gameBaseName}_${categoryId}`,
    levelNumber
  );
}

export async function hasCompletedAnyLevelOne(
  userId: number,
  gameBaseName: string,
  categories: string[]
): Promise<boolean> {
  const progress = await getAllCategoryProgress(
    userId,
    gameBaseName,
    categories
  );
  return Object.values(progress).some((lvl) => lvl >= 1);
}

export async function resetAllCategoryLevels(
  userId: number,
  gameBaseName: string,
  categories: string[]
): Promise<void> {
  for (const category of categories) {
    await api.delete(`/users/${userId}/levels`, {
      data: { game_name: `${gameBaseName}_${category}` },
    });
  }
}

/* ========================================
   MAGIC TREE HELPERS
======================================== */

const MAGICTREE_CATEGORIES = [
  "BASIC",
  "NORMAL",
  "HARD",
  "ADVANCED",
  "EXPERT",
];

export function getMagicTreeCategoryProgress(
  userId: number,
  categoryId: string
): Promise<number> {
  return getCategoryProgress(userId, "MagicTree", categoryId);
}

export function getAllMagicTreeProgress(
  userId: number
): Promise<Record<string, number>> {
  return getAllCategoryProgress(
    userId,
    "MagicTree",
    MAGICTREE_CATEGORIES
  );
}

export function saveMagicTreeLevel(
  userId: number,
  categoryId: string,
  levelNumber: number
): Promise<Level> {
  return saveCategoryLevel(
    userId,
    "MagicTree",
    categoryId,
    levelNumber
  );
}

export function hasMagicTreeCompletedAnyLevelOne(
  userId: number
): Promise<boolean> {
  return hasCompletedAnyLevelOne(
    userId,
    "MagicTree",
    MAGICTREE_CATEGORIES
  );
}

export function resetAllMagicTreeLevels(
  userId: number
): Promise<void> {
  return resetAllCategoryLevels(
    userId,
    "MagicTree",
    MAGICTREE_CATEGORIES
  );
}

/* ========================================
   LEGACY RESET FUNCTIONS
======================================== */

export async function resetUserLevels(
  userId: number,
  gameName: string
): Promise<void> {
  await api.delete(`/users/${userId}/levels`, {
    data: { game_name: gameName },
  });
}
