<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class LevelController extends Controller
{
    // List levels for a user
    public function userLevels($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $levels = Level::where('user_id', $user_id)->get();
        return response()->json($levels);
    }

    // Create or update levels for a user/game
    public function storeOrUpdate(Request $request, $user_id)
    {
        $validator = Validator::make($request->all(), [
            'game_name'        => 'required|string|max:100',
            'unlocked_levels'  => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $level = Level::updateOrCreate(
            ['user_id' => $user_id, 'game_name' => $request->game_name],
            ['unlocked_levels' => $request->unlocked_levels]
        );

        return response()->json(['message' => 'Level saved', 'level' => $level], 201);
    }

    // Delete a level record
    public function destroy($user_id, $id)
    {
        $level = Level::where('id', $id)
            ->where('user_id', $user_id)
            ->first();

        if (!$level) {
            return response()->json(['message' => 'Level not found'], 404);
        }

        $level->delete();

        return response()->json(['message' => 'Level record deleted']);
    }

    // List all users' levels for a game
    public function gameLevels($game_name)
    {
        $levels = Level::where('game_name', $game_name)
            ->with('user')
            ->get()
            ->map(function ($l) {
                return [
                    'id' => $l->id,
                    'user_id' => $l->user_id,
                    'username' => $l->user->username ?? null,
                    'unlocked_levels' => $l->unlocked_levels,
                    'updated_at' => $l->updated_at,
                ];
            });

        return response()->json($levels);
    }

    public function destroyByUserAndGame($user_id, Request $request)
    {
        $gameName = $request->input('game_name');

        if (!$gameName) {
            return response()->json(['error' => 'game_name is required'], 400);
        }

        Level::where('user_id', $user_id)
            ->where('game_name', $gameName)
            ->delete();

        return response()->json([
            'message' => "Progress for game '{$gameName}' deleted for user {$user_id}"
        ], 200);
    }
}