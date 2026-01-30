<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class LevelController extends Controller
{
    /**
     * Get all MagicTree progress for a user
     * GET /users/{user_id}/levels
     * 
     * Returns: { "BASIC": 1, "NORMAL": 0, "HARD": 0, "ADVANCED": 0, "EXPERT": 0 }
     */
    public function userLevels($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Fetch all MagicTree levels for this user
        $levels = Level::where('user_id', $user_id)
            ->whereIn('game_name', [
                'MagicTree_BASIC',
                'MagicTree_NORMAL',
                'MagicTree_HARD',
                'MagicTree_ADVANCED',
                'MagicTree_EXPERT'
            ])
            ->get();

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
            }
        }

        return response()->json($progress);
    }

    /**
     * Save or update progress for a game
     * POST /users/{user_id}/levels
     * 
     * Request body:
     * {
     *   "game_name": "MagicTree_BASIC",
     *   "completed_level": 1
     * }
     * 
     * This will unlock completed_level + 1
     */
    public function storeOrUpdate(Request $request, $user_id)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'game_name' => 'required|string|max:100',
            'completed_level' => 'required|integer|min:1|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $gameName = $request->game_name;
        $completedLevel = $request->completed_level;
        $nextLevel = $completedLevel + 1;

        // Fetch existing progress (if any)
        $existing = Level::where('user_id', $user_id)
            ->where('game_name', $gameName)
            ->first();

        // 🔒 CRITICAL RULE: Progress must NEVER go backward
        // If user already unlocked level 5, completing level 2 should NOT downgrade to level 3
        $finalUnlockedLevel = $existing 
            ? max($existing->unlocked_levels, $nextLevel)
            : $nextLevel;

        // Save to database
        $level = Level::updateOrCreate(
            [
                'user_id'   => $user_id,
                'game_name' => $gameName,
            ],
            [
                'unlocked_levels' => $finalUnlockedLevel,
            ]
        );

        Log::info("✅ Level saved: User {$user_id}, Game {$gameName}, Completed Level {$completedLevel}, Unlocked Level {$finalUnlockedLevel}");

        return response()->json([
            'success' => true,
            'message' => "Level {$completedLevel} completed, level {$nextLevel} unlocked",
            'unlocked_levels' => $finalUnlockedLevel,
        ], 200);
    }

    /**
     * Delete a single level record (admin/debug use)
     */
    public function destroy($user_id, $id)
    {
        $level = Level::where('id', $id)
            ->where('user_id', $user_id)
            ->first();

        if (!$level) {
            return response()->json(['message' => 'Level not found'], 404);
        }

        $level->delete();

        return response()->json(['message' => 'Level deleted']);
    }

    /**
     * Leaderboard-style list for a game
     */
    public function gameLevels($game_name)
    {
        return response()->json(
            Level::where('game_name', $game_name)
                ->with('user:user_id,username')
                ->get()
                ->map(fn ($l) => [
                    'user_id'         => $l->user_id,
                    'username'        => $l->user->username ?? null,
                    'unlocked_levels' => $l->unlocked_levels,
                    'updated_at'      => $l->updated_at,
                ])
        );
    }

    /**
     * Delete progress for a user & game
     */
    public function destroyByUserAndGame($user_id, Request $request)
    {
        $request->validate([
            'game_name' => 'required|string|max:100',
        ]);

        Level::where('user_id', $user_id)
            ->where('game_name', $request->game_name)
            ->delete();

        return response()->json([
            'message' => 'Progress deleted',
        ]);
    }
}