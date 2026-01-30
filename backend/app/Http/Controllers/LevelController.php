<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class LevelController extends Controller
{
    /**
     * Get all MagicTree progress for a user
     * GET /users/{user_id}/levels
     */
    public function userLevels($user_id)
    {
        Log::info("📥 GET /users/{$user_id}/levels - Request received");
        
        try {
            // Check if user exists
            $user = User::where('user_id', $user_id)->first();
            
            if (!$user) {
                Log::warning("❌ User {$user_id} not found in database");
                return response()->json([
                    'message' => 'User not found',
                    'user_id' => $user_id
                ], 404);
            }
            
            Log::info("✅ User {$user_id} found: {$user->username}");

            // Fetch all MagicTree levels
            $levels = Level::where('user_id', $user_id)
                ->whereIn('game_name', [
                    'MagicTree_BASIC',
                    'MagicTree_NORMAL',
                    'MagicTree_HARD',
                    'MagicTree_ADVANCED',
                    'MagicTree_EXPERT'
                ])
                ->get();

            Log::info("📊 Found {$levels->count()} MagicTree level records for user {$user_id}");

            // Transform to category => unlocked_levels format
            $progress = [
                'BASIC' => 0,
                'NORMAL' => 0,
                'HARD' => 0,
                'ADVANCED' => 0,
                'EXPERT' => 0,
            ];

            foreach ($levels as $level) {
                $category = str_replace('MagicTree_', '', $level->game_name);
                if (isset($progress[$category])) {
                    $progress[$category] = $level->unlocked_levels;
                    Log::info("  → {$category}: {$level->unlocked_levels} levels unlocked");
                }
            }

            Log::info("✅ Returning progress", $progress);
            return response()->json($progress);
            
        } catch (\Exception $e) {
            Log::error("💥 ERROR in userLevels: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save or update progress for a game
     * POST /users/{user_id}/levels
     * 
     * Body: { "game_name": "MagicTree_BASIC", "completed_level": 1 }
     */
    public function storeOrUpdate(Request $request, $user_id)
    {
        Log::info("📥 POST /users/{$user_id}/levels - Request received");
        Log::info("📦 Request body", $request->all());
        
        // Validate input
        $validator = Validator::make($request->all(), [
            'game_name' => 'required|string|max:100',
            'completed_level' => 'required|integer|min:1|max:15',
        ]);

        if ($validator->fails()) {
            Log::warning("❌ Validation failed", $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Check if user exists
            $user = User::where('user_id', $user_id)->first();
            
            if (!$user) {
                Log::warning("❌ User {$user_id} not found");
                return response()->json([
                    'message' => 'User not found',
                    'user_id' => $user_id
                ], 404);
            }
            
            Log::info("✅ User found: {$user->username} (ID: {$user_id})");

            $gameName = $request->game_name;
            $completedLevel = $request->completed_level;
            $nextLevel = $completedLevel + 1;

            Log::info("🎮 Game: {$gameName}");
            Log::info("🏁 Completed Level: {$completedLevel}");
            Log::info("🔓 Next Level to Unlock: {$nextLevel}");

            // Check existing progress
            $existing = Level::where('user_id', $user_id)
                ->where('game_name', $gameName)
                ->first();

            if ($existing) {
                Log::info("📊 Existing record found - Current unlocked_levels: {$existing->unlocked_levels}");
            } else {
                Log::info("📊 No existing record - This is a new entry");
            }

            // Calculate final unlocked level (never go backward)
            $finalUnlockedLevel = $existing 
                ? max($existing->unlocked_levels, $nextLevel)
                : $nextLevel;

            Log::info("🎯 Final unlocked_levels to save: {$finalUnlockedLevel}");

            // Save to database
            DB::beginTransaction();
            
            try {
                $level = Level::updateOrCreate(
                    [
                        'user_id'   => $user_id,
                        'game_name' => $gameName,
                    ],
                    [
                        'unlocked_levels' => $finalUnlockedLevel,
                    ]
                );

                DB::commit();
                
                Log::info("✅✅✅ SUCCESS! Level saved to database");
                Log::info("📌 Record ID: {$level->id}");
                Log::info("📌 User ID: {$level->user_id}");
                Log::info("📌 Game Name: {$level->game_name}");
                Log::info("📌 Unlocked Levels: {$level->unlocked_levels}");
                Log::info("📌 Updated At: {$level->updated_at}");

                // Verify it was actually saved
                $verification = Level::where('user_id', $user_id)
                    ->where('game_name', $gameName)
                    ->first();
                    
                if ($verification) {
                    Log::info("✅ VERIFICATION: Record exists in database with unlocked_levels = {$verification->unlocked_levels}");
                } else {
                    Log::error("⚠️ WARNING: Could not verify record was saved!");
                }

                return response()->json([
                    'success' => true,
                    'message' => "Level {$completedLevel} completed! Level {$nextLevel} unlocked!",
                    'data' => [
                        'user_id' => $level->user_id,
                        'game_name' => $level->game_name,
                        'completed_level' => $completedLevel,
                        'unlocked_levels' => $finalUnlockedLevel,
                        'updated_at' => $level->updated_at,
                    ]
                ], 200);
                
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
            
        } catch (\Exception $e) {
            Log::error("💥 ERROR in storeOrUpdate: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'message' => 'Error saving level',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a single level record
     */
    public function destroy($user_id, $id)
    {
        Log::info("📥 DELETE /users/{$user_id}/levels/{$id}");
        
        try {
            $level = Level::where('id', $id)
                ->where('user_id', $user_id)
                ->first();

            if (!$level) {
                Log::warning("❌ Level record not found");
                return response()->json(['message' => 'Level not found'], 404);
            }

            $level->delete();
            Log::info("✅ Level deleted: ID {$id}");

            return response()->json(['message' => 'Level deleted']);
            
        } catch (\Exception $e) {
            Log::error("💥 ERROR: " . $e->getMessage());
            return response()->json(['message' => 'Error deleting level'], 500);
        }
    }

    /**
     * Leaderboard for a game
     */
    public function gameLevels($game_name)
    {
        Log::info("📥 GET /games/{$game_name}/levels");
        
        try {
            $levels = Level::where('game_name', $game_name)
                ->with('user:user_id,username')
                ->get()
                ->map(fn ($l) => [
                    'user_id'         => $l->user_id,
                    'username'        => $l->user->username ?? null,
                    'unlocked_levels' => $l->unlocked_levels,
                    'updated_at'      => $l->updated_at,
                ]);
                
            Log::info("✅ Found {$levels->count()} records");
            return response()->json($levels);
            
        } catch (\Exception $e) {
            Log::error("💥 ERROR: " . $e->getMessage());
            return response()->json(['message' => 'Error fetching leaderboard'], 500);
        }
    }

    /**
     * Delete progress for a user & game
     */
    public function destroyByUserAndGame($user_id, Request $request)
    {
        Log::info("📥 DELETE /users/{$user_id}/levels (by game)");
        Log::info("📦 Request", $request->all());
        
        $request->validate([
            'game_name' => 'required|string|max:100',
        ]);

        try {
            $deleted = Level::where('user_id', $user_id)
                ->where('game_name', $request->game_name)
                ->delete();

            Log::info("✅ Deleted {$deleted} records");

            return response()->json([
                'message' => 'Progress deleted',
                'deleted_count' => $deleted,
            ]);
            
        } catch (\Exception $e) {
            Log::error("💥 ERROR: " . $e->getMessage());
            return response()->json(['message' => 'Error deleting progress'], 500);
        }
    }
}