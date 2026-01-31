import axios from "../auth/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL || "";  ///////

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
// SUPPORTS BOTH: Simple game names AND category-based names
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

// ✅ SIMPLE UNLOCK LOGIC
// When player completes a level, unlock the NEXT level
// Example: Complete Level 1 → Save unlocked_levels = 2 (Level 2 becomes playable)
export async function unlockNextLevel(
  userId: number,
  gameName: string,
  completedLevel: number
): Promise<Level> {
  const nextLevel = completedLevel + 1;
  
  console.log(`🔓 Player completed Level ${completedLevel}. Unlocking Level ${nextLevel}...`);
  
  try {
    const result = await saveLevel(userId, gameName, nextLevel);
    console.log(`✅ SUCCESS! Level ${nextLevel} is now unlocked`);
    return result;
  } catch (error: any) {
    console.error(`❌ Failed to unlock Level ${nextLevel}:`, error);
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
    return record?.unlocked_levels || 1; // ✅ Default to 1 (Level 1 always playable)
  } catch (error) {
    console.error(`Error fetching ${gameBaseName} ${categoryId} progress:`, error);
    return 1;
  }
}

// Get all category progress for a game
export async function getAllCategoryProgress(
  userId: number,
  gameBaseName: string,
  categories: string[]
): Promise<Record<string, number>> {
  try {
    const allLevels = await getUserLevels(userId);

    // ✅ IMPORTANT: default to 1 (Level 1 playable)
    const progress: Record<string, number> = {};
    categories.forEach(cat => (progress[cat] = 1));

    allLevels
      .filter(l => l.game_name.startsWith(`${gameBaseName}_`))
      .forEach(level => {
        const category = level.game_name.replace(`${gameBaseName}_`, "");
        if (category in progress) {
          // ✅ never allow less than 1
          progress[category] = Math.max(1, level.unlocked_levels);
        }
      });

    return progress;
  } catch (error) {
    console.error(`Error fetching ${gameBaseName} progress:`, error);

    // ✅ safe fallback: all categories start at level 1
    return Object.fromEntries(categories.map(cat => [cat, 1]));
  }
}

// Save category progress for any game
// ✅ UPDATED: Now saves completedLevel + 1 directly
export async function saveCategoryLevel(
  userId: number,
  gameBaseName: string,
  categoryId: string,
  completedLevel: number
): Promise<Level> {
  const gameName = `${gameBaseName}_${categoryId}`;
  const nextLevel = completedLevel + 1;
  
  console.log(`🎯 ${gameBaseName} ${categoryId}: Completed Level ${completedLevel}, unlocking Level ${nextLevel}`);
  
  return await saveLevel(userId, gameName, nextLevel);
}

// Check if player has completed any Level 1 in any category
export async function hasCompletedAnyLevelOne(
  userId: number,
  gameBaseName: string,
  categories: string[]
): Promise<boolean> {
  try {
    const progress = await getAllCategoryProgress(userId, gameBaseName, categories);
    // ✅ Check if any category has unlocked level 2 or higher (meaning Level 1 was completed)
    return Object.values(progress).some((unlocked) => unlocked >= 2);
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
  return getAllCategoryProgress(userId, "MagicTree", MAGICTREE_CATEGORIES);
}

// ✅ UPDATED: Now expects completedLevel and saves completedLevel + 1
export async function saveMagicTreeLevel(
  userId: number,
  categoryId: string,
  completedLevel: number
): Promise<Level> {
  return saveCategoryLevel(userId, "MagicTree", categoryId, completedLevel);
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