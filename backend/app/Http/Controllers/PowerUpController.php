<?php

namespace App\Http\Controllers;

use App\Models\PowerUp;
use App\Models\UserPowerUp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class PowerUpController extends Controller
{
    /**
     * 🏪 Show all available power-ups for the shop.
     */
    public function index()
    {
        return response()->json(PowerUp::all());
    }

    /**
     * 💰 Buy a power-up using coins.
     */
    public function buy(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'power_up_id' => 'required|exists:power_ups,power_up_id',
        ]);

        $user = User::findOrFail($data['user_id']);
        $powerUp = PowerUp::findOrFail($data['power_up_id']);

        // Check if user has enough coins
        if ($user->coins < $powerUp->price) {
            return response()->json(['message' => 'Not enough coins'], 400);
        }

        // Deduct the cost
        $user->coins -= $powerUp->price;
        $user->save();

        // Add or increment owned quantity
        $owned = UserPowerUp::firstOrCreate(
            ['user_id' => $user->user_id, 'power_up_id' => $powerUp->power_up_id],
            ['quantity' => 0]
        );
        $owned->increment('quantity');

        return response()->json([
            'message' => "{$powerUp->name} purchased successfully",
            'coins_left' => $user->coins,
            'quantity' => $owned->quantity,
        ]);
    }

    /**
     * ⚡ Use (activate) a power-up.
     * Consumes one from the user's inventory.
     */
    public function use(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'power_up_type' => 'required|string|in:time_freeze,second_chance,score_booster',
        ]);

        $userPowerUp = UserPowerUp::whereHas('powerUp', function ($q) use ($data) {
            $q->where('type', $data['power_up_type']);
        })
        ->where('user_id', $data['user_id'])
        ->first();

        if (!$userPowerUp || $userPowerUp->quantity <= 0) {
            return response()->json(['message' => 'Power-up not available'], 400);
        }

        $userPowerUp->decrement('quantity');
        $powerUp = $userPowerUp->powerUp;

        return response()->json([
            'message' => "{$powerUp->name} activated",
            'effect' => $powerUp->type,
            'remaining' => $userPowerUp->quantity,
            'duration' => $powerUp->duration_seconds,
            'multiplier' => $powerUp->multiplier,
        ]);
    }

    /**
     * 🎒 Get all power-ups owned by a user (inventory).
     * Includes the power-up details for each item.
     */
    public function userPowerUps($user_id)
    {
        $user = User::findOrFail($user_id);

        $owned = UserPowerUp::where('user_id', $user_id)
            ->with('powerUp')
            ->get()
            ->map(function ($rec) {
                return [
                    'user_power_up_id' => $rec->user_power_up_id,
                    'user_id' => $rec->user_id,
                    'power_up_id' => $rec->power_up_id,
                    'quantity' => (int) $rec->quantity,
                    'power_up' => $rec->powerUp ? [
                        'power_up_id' => $rec->powerUp->power_up_id,
                        'name' => $rec->powerUp->name,
                        'type' => $rec->powerUp->type,
                        'description' => $rec->powerUp->description,
                        'price' => (int) $rec->powerUp->price,
                        'duration_seconds' => $rec->powerUp->duration_seconds,
                        'multiplier' => $rec->powerUp->multiplier,
                    ] : null,
                ];
            });

        return response()->json($owned);
    }
}
