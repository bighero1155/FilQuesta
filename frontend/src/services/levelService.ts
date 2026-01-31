import axios from "../auth/axiosInstance";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

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

// ✅ UPDATED: Save or update levels - Following score pattern
export async function saveLevel(
  userId: number,
  gameName: string,
  levelToUnlock: number
): Promise<Level> {
  if (!userId) throw new Error("User ID is undefined");
  
  try {
    console.log(`💾 Saving: User ${userId}, Game: ${gameName}, Level: ${levelToUnlock}`);
    
    // Get current progress (like score gets current total_score)
    const allLevels = await getUserLevels(userId);
    const currentLevel = allLevels.find((l) => l.game_name === gameName);
    const currentUnlocked = currentLevel?.unlocked_levels || 0;
    
    // Only update if new level is higher (prevent going backwards)
    const newUnlocked = Math.max(currentUnlocked, levelToUnlock);
    
    console.log(`📊 Current: ${currentUnlocked}, New: ${newUnlocked}`);
    
    // Save to backend (like updateUserProgress saves score)
    const response = await axios.post(
      `${API_URL}/users/${userId}/levels`,
      { game_name: gameName, unlocked_levels: newUnlocked },
      { withCredentials: true }
    );
    
    // Update localStorage (like score updates localStorage)
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!storedUser.levelProgress) {
      storedUser.levelProgress = {};
    }
    storedUser.levelProgress[gameName] = newUnlocked;
    localStorage.setItem("user", JSON.stringify(storedUser));
    
    console.log('✅ Level saved successfully:', response.data);
    return response.data;
    
  } catch (error: any) {
    if (error.response?.status === 404) {
      // First time playing - create new record
      console.log(`📝 Creating new progress for ${gameName}, level ${levelToUnlock}`);
      
      const response = await axios.post(
        `${API_URL}/users/${userId}/levels`,
        { game_name: gameName, unlocked_levels: levelToUnlock },
        { withCredentials: true }
      );
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!storedUser.levelProgress) {
        storedUser.levelProgress = {};
      }
      storedUser.levelProgress[gameName] = levelToUnlock;
      localStorage.setItem("user", JSON.stringify(storedUser));
      
      return response.data;
    }
    
    console.error('❌ Failed to save level:', error);
    throw error;
  }
}

// ✅ DEPRECATED: Use saveLevel directly instead
// Kept for backwards compatibility
export async function unlockNextLevel(
  userId: number,
  gameName: string,
  completedLevel: number
): Promise<Level> {
  const nextLevel = completedLevel + 1;
  return await saveLevel(userId, gameName, nextLevel);
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
    
    // Return 1 for BASIC category by default (first level unlocked)
    // Return 0 for other categories (locked)
    const defaultLevel = categoryId === "BASIC" ? 1 : 0;
    return record?.unlocked_levels || defaultLevel;
  } catch (error) {
    console.error(`Error fetching ${gameBaseName} ${categoryId} progress:`, error);
    // Return 1 for BASIC, 0 for others
    return categoryId === "BASIC" ? 1 : 0;
  }
}

// ✅ UPDATED: Get all category progress - Following score pattern
export async function getAllCategoryProgress(
  userId: number,
  gameBaseName: string,     // e.g., "MagicTree"
  categories: string[]       // e.g., ["BASIC", "NORMAL", "HARD"]
): Promise<Record<string, number>> {
  try {
    console.log(`📥 Fetching ${gameBaseName} progress for user ${userId}`);
    
    // Get all levels from backend (like getUserProfile gets user data)
    const allLevels = await getUserLevels(userId);
    const gameLevels = allLevels.filter((l) => l.game_name.startsWith(`${gameBaseName}_`));
    
    console.log(`📊 Raw ${gameBaseName} levels:`, gameLevels);
    
    // Initialize progress (BASIC starts at 1, others at 0)
    const progress: Record<string, number> = {};
    categories.forEach(cat => {
      progress[cat] = cat === "BASIC" ? 1 : 0;
    });

    // Update with saved progress
    gameLevels.forEach((level) => {
      const category = level.game_name.replace(`${gameBaseName}_`, "");
      if (category in progress) {
        progress[category] = level.unlocked_levels;
      }
    });

    console.log(`✅ Processed ${gameBaseName} progress:`, progress);
    return progress;
    
  } catch (error) {
    console.error(`❌ Error fetching ${gameBaseName} progress:`, error);
    
    // Return defaults if error (BASIC=1, others=0)
    const defaults: Record<string, number> = {};
    categories.forEach(cat => {
      defaults[cat] = cat === "BASIC" ? 1 : 0;
    });
    return defaults;
  }
}

// ✅ UPDATED: Save category progress - Following score pattern
export async function saveCategoryLevel(
  userId: number,
  gameBaseName: string,
  categoryId: string,
  levelNumber: number
): Promise<Level> {
  const gameName = `${gameBaseName}_${categoryId}`;
  
  console.log(`🔓 Unlocking ${gameName} level ${levelNumber}`);
  
  // Use saveLevel which now follows the score pattern
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
    // Check if any category has unlocked level 2 or higher (meaning level 1 was completed)
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
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser.levelProgress) {
        delete storedUser.levelProgress[`${gameBaseName}_${category}`];
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
      
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

// ✅ This is what MagicTree.ts calls - now follows score pattern
export async function getAllMagicTreeProgress(userId: number): Promise<Record<string, number>> {
  return getAllCategoryProgress(userId, "MagicTree", MAGICTREE_CATEGORIES);
}

export async function saveMagicTreeLevel(
  userId: number,
  categoryId: string,
  levelNumber: number
): Promise<Level> {
  return saveCategoryLevel(userId, "MagicTree", categoryId, levelNumber);
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