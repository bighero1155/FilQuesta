import axios from "../auth/axiosInstance";

// ✅ Don't add /api here - axios interceptor already adds it
const API_URL = import.meta.env.VITE_API_URL;

export interface Level {
  id: number;
  user_id: number;
  game_name: string;
  unlocked_levels: number;
  created_at: string;
  updated_at: string;
}

// ========================================
// CORE FUNCTIONS (Used by ALL games)
// ========================================

// Get all levels of a user
export async function getUserLevels(userId: number): Promise<Level[]> {
  if (!userId) throw new Error("User ID is undefined");
  const response = await axios.get(`${API_URL}/users/${userId}/levels`, {
    withCredentials: true,
  });
  return response.data;
}

// Save or update levels for a game and user
// ⚠️ DEPRECATED: Use unlockNextLevel instead for proper progression
export async function saveLevel(
  userId: number,
  gameName: string,
  unlockedLevels: number
): Promise<Level> {
  if (!userId) throw new Error("User ID is undefined");
  
  console.log(`💾 Saving: User ${userId}, Game: ${gameName}, Level: ${unlockedLevels}`);
  
  const response = await axios.post(
    `${API_URL}/users/${userId}/levels`,
    { game_name: gameName, unlocked_levels: unlockedLevels },
    { withCredentials: true }
  );
  
  console.log('✅ Saved successfully:', response.data);
  return response.data;
}

// ✅ FIXED: Unlock next level based on completed level
// This is the CORRECT way to save progress
export async function unlockNextLevel(
  userId: number,
  gameName: string,
  completedLevel: number
): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");

  console.log(`💾 Saving: User ${userId}, Game: ${gameName}, Level: ${completedLevel}`);

  try {
    const response = await axios.post(
      `${API_URL}/users/${userId}/levels`,
      {
        game_name: gameName,
        completed_level: completedLevel, // ✅ Send completed_level, backend unlocks next
      },
      { withCredentials: true }
    );

    console.log('✅ Level unlocked successfully:', response.data);
  } catch (error: any) {
    console.error('❌ Failed to unlock next level:', error);
    throw error;
  }
}

// ========================================
// GENERIC CATEGORY FUNCTIONS (Reusable for ANY game)
// ========================================

// Get unlocked levels for a specific game category
export async function getCategoryProgress(
  userId: number,
  gameBaseName: string, // e.g., "MagicTree", "WordWizard", "HumanBody"
  categoryId: string     // e.g., "BASIC", "NOUNS", "SKELETAL"
): Promise<number> {
  try {
    const allLevels = await getUserLevels(userId);
    const gameName = `${gameBaseName}_${categoryId}`;
    const record = allLevels.find((l) => l.game_name === gameName);
    return record?.unlocked_levels || 0;
  } catch (error) {
    console.error(`Error fetching ${gameBaseName} ${categoryId} progress:`, error);
    return 0;
  }
}

// Get all category progress for a game
export async function getAllCategoryProgress(
  userId: number,
  gameBaseName: string,     // e.g., "MagicTree"
  categories: string[]       // e.g., ["BASIC", "NORMAL", "HARD"]
): Promise<Record<string, number>> {
  try {
    const allLevels = await getUserLevels(userId);
    const gameLevels = allLevels.filter((l) => l.game_name.startsWith(`${gameBaseName}_`));
    
    const progress: Record<string, number> = {};
    categories.forEach(cat => progress[cat] = 0);

    gameLevels.forEach((level) => {
      const category = level.game_name.replace(`${gameBaseName}_`, "");
      if (category in progress) {
        progress[category] = level.unlocked_levels;
      }
    });

    return progress;
  } catch (error) {
    console.error(`Error fetching ${gameBaseName} progress:`, error);
    return Object.fromEntries(categories.map(cat => [cat, 0]));
  }
}

// Save category progress for any game
// ⚠️ DEPRECATED: Use unlockNextLevel instead
export async function saveCategoryLevel(
  userId: number,
  gameBaseName: string,
  categoryId: string,
  levelNumber: number
): Promise<Level> {
  const gameName = `${gameBaseName}_${categoryId}`;
  return await saveLevel(userId, gameName, levelNumber);
}

// Check if player has completed any Level 1 in any category
export async function hasCompletedAnyLevelOne(
  userId: number,
  gameBaseName: string,
  categories: string[]
): Promise<boolean> {
  try {
    const progress = await getAllCategoryProgress(userId, gameBaseName, categories);
    return Object.values(progress).some((unlocked) => unlocked >= 1);
  } catch (error) {
    console.error(`Error checking Level 1 completion for ${gameBaseName}:`, error);
    return false;
  }
}

// Reset all categories for a game
export async function resetAllCategoryLevels(
  userId: number,
  gameBaseName: string,
  categories: string[]
): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  
  for (const category of categories) {
    try {
      await axios.delete(`${API_URL}/users/${userId}/levels`, {
        data: { game_name: `${gameBaseName}_${category}` },
        withCredentials: true,
      });
    } catch (error) {
      console.error(`Error resetting ${gameBaseName}_${category}:`, error);
    }
  }
}

// ========================================
// MAGICTREE SPECIFIC HELPERS (Convenience wrappers)
// ========================================

const MAGICTREE_CATEGORIES = ["BASIC", "NORMAL", "HARD", "ADVANCED", "EXPERT"];

export async function getMagicTreeCategoryProgress(
  userId: number,
  categoryId: string
): Promise<number> {
  return getCategoryProgress(userId, "MagicTree", categoryId);
}

export async function getAllMagicTreeProgress(userId: number): Promise<Record<string, number>> {
  try {
    // ✅ Use the optimized endpoint that returns formatted progress
    const response = await axios.get(`${API_URL}/users/${userId}/levels`, {
      withCredentials: true,
    });
    
    // Backend now returns { "BASIC": 1, "NORMAL": 0, ... } directly
    return response.data;
  } catch (error) {
    console.error("Error fetching MagicTree progress:", error);
    return { BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0 };
  }
}

// ⚠️ DEPRECATED: Use unlockNextLevel instead
export async function saveMagicTreeLevel(
  userId: number,
  categoryId: string,
  completedLevel: number
): Promise<void> {
  const gameName = `MagicTree_${categoryId}`;
  return unlockNextLevel(userId, gameName, completedLevel);
}

export async function hasMagicTreeCompletedAnyLevelOne(userId: number): Promise<boolean> {
  return hasCompletedAnyLevelOne(userId, "MagicTree", MAGICTREE_CATEGORIES);
}

export async function resetAllMagicTreeLevels(userId: number): Promise<void> {
  return resetAllCategoryLevels(userId, "MagicTree", MAGICTREE_CATEGORIES);
}

// ========================================
// LEGACY RESET FUNCTIONS (For non-category games)
// ========================================

export async function resetUserLevels(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axios.delete(`${API_URL}/users/${userId}/levels`, {
    data: { game_name: "HumanBodyScene" },
    withCredentials: true, 
  });
}

export async function resetUserLevels2(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axios.delete(`${API_URL}/users/${userId}/levels`, {
    data: { game_name: "WordWizardScene" },
    withCredentials: true, 
  });
}

export async function resetUserLevels3(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axios.delete(`${API_URL}/users/${userId}/levels`, {
    data: { game_name: "MathFruitScene" },
    withCredentials: true, 
  });
}

export async function resetUserLevels4(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axios.delete(`${API_URL}/users/${userId}/levels`, {
    data: { game_name: "HistoryPortalScene" },
    withCredentials: true, 
  });
}