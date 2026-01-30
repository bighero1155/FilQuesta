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
     * Get all progress records for a user
     */
    public function userLevels($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(
            Level::where('user_id', $user_id)->get()
        );
    }

    /**
     * Save or update progress for a game
     * unlocked_levels = MAX unlocked level
     */
    public function storeOrUpdate(Request $request, $user_id)
    {
        $validator = Validator::make($request->all(), [
            'game_name'       => 'required|string|max:100',
            'unlocked_levels' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $existing = Level::where('user_id', $user_id)
            ->where('game_name', $request->game_name)
            ->first();

        // Never allow progress to go backward
        $maxUnlocked = $existing
            ? max($existing->unlocked_levels, $request->unlocked_levels)
            : $request->unlocked_levels;

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
            'message' => 'Progress saved',
            'level'   => $level,
        ]);
    }

    /**
     * Delete a single level record
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
                ->with('user:id,username')
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
