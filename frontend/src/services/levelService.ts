import axios from "../auth/axiosInstance";

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

// Get ALL levels for a user
export async function getUserLevels(userId: number): Promise<Level[]> {
  if (!userId) throw new Error("User ID is required");

  const res = await axios.get(`/users/${userId}/levels`);
  return res.data;
}

// Save or update a level
export async function saveLevel(
  userId: number,
  gameName: string,
  unlockedLevels: number
): Promise<Level> {
  if (!userId) throw new Error("User ID is required");

  const res = await axios.post(`/users/${userId}/levels`, {
    game_name: gameName,
    unlocked_levels: unlockedLevels,
  });

  return res.data.level;
}

// Delete a specific level record
export async function deleteLevel(
  userId: number,
  levelId: number
): Promise<void> {
  await axios.delete(`/users/${userId}/levels/${levelId}`);
}

// Delete progress for a specific game
export async function deleteGameProgress(
  userId: number,
  gameName: string
): Promise<void> {
  await axios.delete(`/users/${userId}/levels`, {
    data: { game_name: gameName },
  });
}

/* ========================================
   CATEGORY-BASED HELPERS (GENERIC)
======================================== */

// Get unlocked level for a category
export async function getCategoryProgress(
  userId: number,
  gameBaseName: string,
  categoryId: string
): Promise<number> {
  const levels = await getUserLevels(userId);
  const gameName = `${gameBaseName}_${categoryId}`;
  const record = levels.find((l) => l.game_name === gameName);
  return record?.unlocked_levels ?? 0;
}

// Get ALL category progress for a game
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

// Save category progress
export async function saveCategoryLevel(
  userId: number,
  gameBaseName: string,
  categoryId: string,
  levelNumber: number
): Promise<Level> {
  const gameName = `${gameBaseName}_${categoryId}`;
  return saveLevel(userId, gameName, levelNumber);
}

// Check if ANY category has at least level 1
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

// Reset all categories for a game
export async function resetAllCategoryLevels(
  userId: number,
  gameBaseName: string,
  categories: string[]
): Promise<void> {
  for (const category of categories) {
    await deleteGameProgress(userId, `${gameBaseName}_${category}`);
  }
}

/* ========================================
   MAGIC TREE CONVENIENCE WRAPPERS
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
