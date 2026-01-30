import axios from "axios";
import axiosInstance from "../auth/axiosInstance";

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
  
  console.log("🔍 getUserLevels START");
  console.log(`   📤 GET ${API_URL}/users/${userId}/levels`);
  
  try {
    const response = await axiosInstance.get(`${API_URL}/users/${userId}/levels`, {
      withCredentials: true,
    });
    
    console.log("   📥 Response:", JSON.stringify(response.data, null, 2));
    console.log("🔍 getUserLevels END\n");
    
    return response.data;
  } catch (error) {
    console.error("❌ getUserLevels FAILED:", error);
    throw error;
  }
}

// Save or update levels for a game and user
// SUPPORTS BOTH: Simple game names AND category-based names
export async function saveLevel(
  userId: number,
  gameName: string,
  unlockedLevels: number
): Promise<Level> {
  if (!userId) throw new Error("User ID is undefined");
  
  const requestData = { 
    game_name: gameName, 
    unlocked_levels: unlockedLevels 
  };
  
  console.log("💾 saveLevel START");
  console.log("   📤 REQUEST:");
  console.log(`      URL: ${API_URL}/users/${userId}/levels`);
  console.log("      Method: POST");
  console.log("      Body:", JSON.stringify(requestData, null, 2));
  
  try {
    const response = await axiosInstance.post(
      `${API_URL}/users/${userId}/levels`,
      requestData,
      { withCredentials: true }
    );
    
    console.log("   📥 RESPONSE:");
    console.log("      Status:", response.status);
    console.log("      Data:", JSON.stringify(response.data, null, 2));
    console.log("💾 saveLevel END\n");
    
    return response.data;
  } catch (error) {
    console.error("❌ saveLevel FAILED");
    console.error("   Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("   Response status:", error.response?.status);
      console.error("   Response data:", error.response?.data);
    }
    throw error;
  }
}

// ✅ FIXED: Unlock next level based on completed level
// This ensures unlocked_levels = highest playable level index
export async function unlockNextLevel(
  userId: number,
  gameName: string,
  completedLevel: number
): Promise<Level> {
  try {
    const allLevels = await getUserLevels(userId);
    const current = allLevels.find((l) => l.game_name === gameName);

    const currentUnlocked = current?.unlocked_levels ?? 0;

    // 🔒 Never go backwards - always unlock at least completedLevel + 1
    const nextUnlocked = Math.max(currentUnlocked, completedLevel + 1);

    console.log(
      `🔓 Unlocking ${gameName}: completed=${completedLevel}, unlocked=${nextUnlocked}`
    );

    return await saveLevel(userId, gameName, nextUnlocked);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // First time playing - unlock level after the completed one
      const nextUnlocked = completedLevel + 1;
      console.log(`📝 No existing progress, unlocking level ${nextUnlocked} for ${gameName}`);
      return await saveLevel(userId, gameName, nextUnlocked);
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
  gameBaseName: string,
  categories: string[]
): Promise<Record<string, number>> {
  console.log("📋 getAllCategoryProgress START");
  console.log("   userId:", userId);
  console.log("   gameBaseName:", gameBaseName);
  console.log("   categories:", categories);
  
  try {
    const allLevels = await getUserLevels(userId);
    console.log("   📥 Fetched levels from backend:", JSON.stringify(allLevels, null, 2));

    // ✅ Initialize with 1 (Level 1 is always playable)
    const progress: Record<string, number> = {};
    categories.forEach(cat => {
      progress[cat] = 1;
      console.log(`   🔓 Default: ${cat} = 1`);
    });

    // Update with actual backend values
    allLevels
      .filter(l => l.game_name.startsWith(`${gameBaseName}_`))
      .forEach(level => {
        const category = level.game_name.replace(`${gameBaseName}_`, "");
        if (category in progress) {
          const oldValue = progress[category];
          progress[category] = Math.max(1, level.unlocked_levels);
          console.log(`   📝 Update: ${category} = ${oldValue} → ${progress[category]} (from backend: ${level.unlocked_levels})`);
        }
      });

    console.log("📋 getAllCategoryProgress END");
    console.log("   Final result:", JSON.stringify(progress, null, 2));
    console.log("");
    
    return progress;
  } catch (error) {
    console.error("❌ getAllCategoryProgress FAILED:", error);

    // Safe fallback
    const fallback = Object.fromEntries(categories.map(cat => [cat, 1]));
    console.log("   🔙 Returning fallback:", JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

// Save category progress for any game
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
      await axiosInstance.delete(`${API_URL}/users/${userId}/levels`, {
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
  console.log("📊 getAllMagicTreeProgress START");
  console.log("   userId:", userId);
  
  try {
    const result = await getAllCategoryProgress(userId, "MagicTree", MAGICTREE_CATEGORIES);
    
    console.log("📊 getAllMagicTreeProgress END");
    console.log("   Result:", JSON.stringify(result, null, 2));
    console.log("");
    
    return result;
  } catch (error) {
    console.error("❌ getAllMagicTreeProgress FAILED:", error);
    return { BASIC: 1, NORMAL: 1, HARD: 1, ADVANCED: 1, EXPERT: 1 };
  }
}

export async function saveMagicTreeLevel(
  userId: number,
  categoryId: string,
  levelNumber: number
): Promise<Level> {
  const gameName = `MagicTree_${categoryId}`;
  
  console.log("🌳 saveMagicTreeLevel START");
  console.log("   Input:");
  console.log("      userId:", userId);
  console.log("      categoryId:", categoryId);
  console.log("      levelNumber:", levelNumber);
  console.log("   Computed:");
  console.log("      gameName:", gameName);
  console.log("   Calling saveLevel...\n");
  
  const result = await saveLevel(userId, gameName, levelNumber);
  
  console.log("🌳 saveMagicTreeLevel END");
  console.log("   Result:", JSON.stringify(result, null, 2));
  console.log("");
  
  return result;
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
  await axiosInstance.delete(`${API_URL}/users/${userId}/levels`, {
    data: { game_name: "HumanBodyScene" },
    withCredentials: true, 
  });
}

export async function resetUserLevels2(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axiosInstance.delete(`${API_URL}/users/${userId}/levels`, {
    data: { game_name: "WordWizardScene" },
    withCredentials: true, 
  });
}

export async function resetUserLevels3(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axiosInstance.delete(`${API_URL}/users/${userId}/levels`, {
    data: { game_name: "MathFruitScene" },
    withCredentials: true, 
  });
}

export async function resetUserLevels4(userId: number): Promise<void> {
  if (!userId) throw new Error("User ID is undefined");
  await axiosInstance.delete(`${API_URL}/users/${userId}/levels`, {
    data: { game_name: "HistoryPortalScene" },
    withCredentials: true, 
  });
}