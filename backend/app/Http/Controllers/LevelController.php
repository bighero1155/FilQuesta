<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class LevelController extends Controller
{
    /**
     * Get all level progress for a user
     * Used by: getUserLevels(), getAllCategoryProgress()
     */
    public function userLevels($user_id)
    {
        // ✅ Ensure user exists (prevents 500s)
        $user = User::find($user_id);
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // ✅ Always return an array (even if empty)
        $levels = Level::where('user_id', $user_id)->get();

        return response()->json($levels, 200);
    }

    /**
     * Create or update progress for a user + game
     * Rule: progress NEVER goes backward
     */
    public function storeOrUpdate(Request $request, $user_id)
    {
        $validator = Validator::make($request->all(), [
            'game_name'       => 'required|string|max:100',
            'unlocked_levels' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // ✅ Ensure user exists
        $user = User::find($user_id);
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // ✅ Fetch existing record (if any)
        $existing = Level::where('user_id', $user_id)
            ->where('game_name', $request->game_name)
            ->first();

        // 🔒 CRITICAL RULE: progress never decreases
        $maxUnlocked = $existing
            ? max($existing->unlocked_levels, $request->unlocked_levels)
            : $request->unlocked_levels;

        // ✅ Create or update safely
        $level = Level::updateOrCreate(
            [
                'user_id'   => $user_id,
                'game_name' => $request->game_name,
            ],
            [
                'unlocked_levels' => $maxUnlocked,
            ]
        );

        return response()->json([
            'message' => 'Level progress saved',
            'level'   => $level,
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
            return response()->json([
                'message' => 'Level not found'
            ], 404);
        }

        $level->delete();

        return response()->json([
            'message' => 'Level record deleted'
        ], 200);
    }

    /**
     * Leaderboard-style list for a game
     */
    public function gameLevels($game_name)
    {
        $levels = Level::where('game_name', $game_name)
            ->with('user:user_id,username')
            ->get()
            ->map(function ($l) {
                return [
                    'user_id'         => $l->user_id,
                    'username'        => $l->user->username ?? null,
                    'unlocked_levels' => (int) $l->unlocked_levels,
                    'updated_at'      => $l->updated_at,
                ];
            });

        return response()->json($levels, 200);
    }

    /**
     * Delete progress for a user & specific game
     */
    public function destroyByUserAndGame($user_id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'game_name' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        Level::where('user_id', $user_id)
            ->where('game_name', $request->game_name)
            ->delete();

        return response()->json([
            'message' => 'Progress deleted'
        ], 200);
    }
}
