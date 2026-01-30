import axios from "../auth/axiosInstance";

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
  
  console.log(`📥 Fetching levels for user ${userId}`);
  
  try {
    const response = await axios.get(`/users/${userId}/levels`, {
      withCredentials: true,
    });
    
    console.log(`✅ Received levels for user ${userId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Failed to fetch levels for user ${userId}:`, error.response?.data || error.message);
    throw error;
  }
}

// ✅ Unlock next level based on completed level
// This is the CORRECT way to save progress
export async function unlockNextLevel(
  userId: number,
  gameName: string,
  completedLevel: number
): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");

  console.log(`📤 Unlocking next level...`);
  console.log(`   User ID: ${userId}`);
  console.log(`   Game: ${gameName}`);
  console.log(`   Completed Level: ${completedLevel}`);

  try {
    const response = await axios.post(
      `/users/${userId}/levels`,
      {
        game_name: gameName,
        completed_level: completedLevel,
      },
      { withCredentials: true }
    );

    console.log('✅✅✅ Level unlocked successfully!');
    console.log('   Response:', response.data);
    
    // Dispatch event to notify UI
    window.dispatchEvent(new Event("levels:updated"));
    console.log('🔔 Dispatched levels:updated event');
    
  } catch (error: any) {
    console.error('❌ Failed to unlock next level!');
    console.error('   Error:', error.response?.data || error.message);
    console.error('   Status:', error.response?.status);
    
    if (error.response?.status === 404) {
      console.error('   🚨 User not found! Check if userId is correct.');
    } else if (error.response?.status === 422) {
      console.error('   🚨 Validation error! Check request data.');
    }
    
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
    console.log(`📊 Fetching ${gameBaseName}_${categoryId} progress for user ${userId}`);
    
    const allLevels = await getUserLevels(userId);
    const gameName = `${gameBaseName}_${categoryId}`;
    const record = allLevels.find((l) => l.game_name === gameName);
    
    const progress = record?.unlocked_levels || 0;
    console.log(`   Progress: ${progress} levels unlocked`);
    
    return progress;
  } catch (error) {
    console.error(`❌ Error fetching ${gameBaseName} ${categoryId} progress:`, error);
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
    console.log(`📊 Fetching all ${gameBaseName} progress for user ${userId}`);
    
    const allLevels = await getUserLevels(userId);
    const gameLevels = allLevels.filter((l) => l.game_name.startsWith(`${gameBaseName}_`));
    
    const progress: Record<string, number> = {};
    categories.forEach(cat => progress[cat] = 0);

    gameLevels.forEach((level) => {
      const category = level.game_name.replace(`${gameBaseName}_`, "");
      if (category in progress) {
        progress[category] = level.unlocked_levels;
        console.log(`   ${category}: ${level.unlocked_levels} levels unlocked`);
      }
    });

    return progress;
  } catch (error) {
    console.error(`❌ Error fetching ${gameBaseName} progress:`, error);
    return Object.fromEntries(categories.map(cat => [cat, 0]));
  }
}

// Check if player has completed any Level 1 in any category
export async function hasCompletedAnyLevelOne(
  userId: number,
  gameBaseName: string,
  categories: string[]
): Promise<boolean> {
  try {
    const progress = await getAllCategoryProgress(userId, gameBaseName, categories);
    const hasCompleted = Object.values(progress).some((unlocked) => unlocked >= 1);
    
    console.log(`✅ Has completed any Level 1 in ${gameBaseName}: ${hasCompleted}`);
    return hasCompleted;
  } catch (error) {
    console.error(`❌ Error checking Level 1 completion for ${gameBaseName}:`, error);
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
  
  console.log(`🔄 Resetting all ${gameBaseName} levels for user ${userId}`);
  
  for (const category of categories) {
    try {
      await axios.delete(`/users/${userId}/levels`, {
        data: { game_name: `${gameBaseName}_${category}` },
        withCredentials: true,
      });
      console.log(`   ✅ Reset ${gameBaseName}_${category}`);
    } catch (error) {
      console.error(`   ❌ Error resetting ${gameBaseName}_${category}:`, error);
    }
  }
  
  console.log(`✅ All ${gameBaseName} levels reset complete`);
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
    console.log(`📊 Fetching MagicTree progress for user ${userId}`);
    
    // ✅ Use the optimized endpoint that returns formatted progress
    const response = await axios.get(`/users/${userId}/levels`, {
      withCredentials: true,
    });
    
    console.log(`✅ MagicTree progress received:`, response.data);
    
    // Backend now returns { "BASIC": 1, "NORMAL": 0, ... } directly
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching MagicTree progress:", error.response?.data || error.message);
    return { BASIC: 0, NORMAL: 0, HARD: 0, ADVANCED: 0, EXPERT: 0 };
  }
}

export async function saveMagicTreeLevel(
  userId: number,
  categoryId: string,
  completedLevel: number
): Promise<void> {
  const gameName = `MagicTree_${categoryId}`;
  console.log(`💾 Saving MagicTree level: ${categoryId} Level ${completedLevel}`);
  return unlockNextLevel(userId, gameName, completedLevel);
}

export async function hasMagicTreeCompletedAnyLevelOne(userId: number): Promise<boolean> {
  return hasCompletedAnyLevelOne(userId, "MagicTree", MAGICTREE_CATEGORIES);
}

export async function resetAllMagicTreeLevels(userId: number): Promise<void> {
  return resetAllCategoryLevels(userId, "MagicTree", MAGICTREE_CATEGORIES);
}

// ========================================
// LEGACY FUNCTIONS (For backward compatibility)
// ========================================

// ⚠️ DEPRECATED: Use unlockNextLevel instead for proper progression
export async function saveLevel(
  userId: number,
  gameName: string,
  unlockedLevels: number
): Promise<Level> {
  if (!userId) throw new Error("User ID is undefined");
  
  console.warn(`⚠️ DEPRECATED: saveLevel() called. Use unlockNextLevel() instead!`);
  console.log(`💾 Saving: User ${userId}, Game: ${gameName}, Level: ${unlockedLevels}`);
  
  const response = await axios.post(
    `/users/${userId}/levels`,
    { game_name: gameName, unlocked_levels: unlockedLevels },
    { withCredentials: true }
  );
  
  console.log('✅ Saved successfully:', response.data);
  return response.data;
}

// ⚠️ DEPRECATED: Use unlockNextLevel instead
export async function saveCategoryLevel(
  userId: number,
  gameBaseName: string,
  categoryId: string,
  levelNumber: number
): Promise<Level> {
  console.warn(`⚠️ DEPRECATED: saveCategoryLevel() called. Use unlockNextLevel() instead!`);
  const gameName = `${gameBaseName}_${categoryId}`;
  return await saveLevel(userId, gameName, levelNumber);
}

// ========================================
// LEGACY RESET FUNCTIONS (For non-category games)
// ========================================

export async function resetUserLevels(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axios.delete(`/users/${userId}/levels`, {
    data: { game_name: "HumanBodyScene" },
    withCredentials: true, 
  });
}

export async function resetUserLevels2(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axios.delete(`/users/${userId}/levels`, {
    data: { game_name: "WordWizardScene" },
    withCredentials: true, 
  });
}

export async function resetUserLevels3(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axios.delete(`/users/${userId}/levels`, {
    data: { game_name: "MathFruitScene" },
    withCredentials: true, 
  });
}

export async function resetUserLevels4(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axios.delete(`/users/${userId}/levels`, {
    data: { game_name: "HistoryPortalScene" },
    withCredentials: true, 
  });
}