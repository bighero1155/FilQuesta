<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cosmetic;
use App\Models\UserCosmetic;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CosmeticCrudController extends Controller
{
    /**
     * 🔥 NEW: Transform cosmetic image paths to full URLs
     * (Same logic as quiz images)
     */
    private function transformCosmeticImage($cosmetic)
    {
        if ($cosmetic->image && !str_starts_with($cosmetic->image, 'http')) {
            $cosmetic->image = asset('storage/' . $cosmetic->image);
        }
        return $cosmetic;
    }

    /**
     * Display all cosmetics (admin view or shop catalog).
     */
    public function index()
    {
        $cosmetics = Cosmetic::all();
        
        // 🔥 Transform all cosmetic images to full URLs
        $cosmetics->transform(function ($cosmetic) {
            return $this->transformCosmeticImage($cosmetic);
        });
        
        return response()->json($cosmetics, 200);
    }

    /**
     * Store a new cosmetic (admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:avatar,badge,nick_frame',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'price' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('cosmetics', 'public');
        }

        $cosmetic = Cosmetic::create($validated);
        
        // 🔥 Transform image to full URL before returning
        $this->transformCosmeticImage($cosmetic);

        return response()->json([
            'message' => 'Cosmetic created successfully.',
            'cosmetic' => $cosmetic,
        ], 201);
    }

    /**
     * Display a specific cosmetic.
     */
    public function show($id)
    {
        try {
            $cosmetic = Cosmetic::findOrFail($id);
            
            // 🔥 Transform image to full URL
            $this->transformCosmeticImage($cosmetic);
            
            return response()->json($cosmetic, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Cosmetic not found.'], 404);
        }
    }

    /**
     * Update an existing cosmetic (admin only).
     */
    public function update(Request $request, $id)
    {
        try {
            $cosmetic = Cosmetic::findOrFail($id);

            $validated = $request->validate([
                'type' => 'sometimes|in:avatar,badge,nick_frame',
                'name' => 'sometimes|string|max:100',
                'description' => 'nullable|string|max:255',
                'price' => 'sometimes|integer|min:0',
                'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            ]);

            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($cosmetic->image && Storage::disk('public')->exists($cosmetic->image)) {
                    Storage::disk('public')->delete($cosmetic->image);
                }

                $validated['image'] = $request->file('image')->store('cosmetics', 'public');
            }

            $cosmetic->update($validated);
            
            // 🔥 Transform image to full URL before returning
            $this->transformCosmeticImage($cosmetic);

            return response()->json([
                'message' => 'Cosmetic updated successfully.',
                'cosmetic' => $cosmetic,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Cosmetic not found.'], 404);
        }
    }

    /**
     * Remove a cosmetic (admin only).
     */
    public function destroy($id)
    {
        try {
            $cosmetic = Cosmetic::findOrFail($id);

            if ($cosmetic->image && Storage::disk('public')->exists($cosmetic->image)) {
                Storage::disk('public')->delete($cosmetic->image);
            }

            $cosmetic->delete();

            return response()->json(['message' => 'Cosmetic deleted successfully.'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Cosmetic not found.'], 404);
        }
    }

    /**
     * Get cosmetics owned by a specific user.
     */
    public function userCosmetics($user_id)
    {
        try {
            $owned = UserCosmetic::with('cosmetic')
                ->where('user_id', $user_id)
                ->get()
                ->map(function ($item) {
                    // 🔥 Transform nested cosmetic image
                    if ($item->cosmetic) {
                        $this->transformCosmeticImage($item->cosmetic);
                    }
                    
                    return [
                        'cosmetic_id' => $item->cosmetic->cosmetic_id,
                        'type' => $item->cosmetic->type,
                        'name' => $item->cosmetic->name,
                        'image' => $item->cosmetic->image, // Now a full URL
                        'is_equipped' => $item->is_equipped,
                    ];
                });

            return response()->json($owned, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to load user cosmetics.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Allow a user to buy a cosmetic using coins.
     */
    public function buy(Request $request)
    {
        $request->validate([
            'cosmetic_id' => 'required|integer|exists:cosmetics,cosmetic_id',
        ]);

        /** @var User $user */
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $cosmetic = Cosmetic::findOrFail($request->cosmetic_id);

        // Already owned?
        $alreadyOwned = UserCosmetic::where('user_id', $user->user_id)
            ->where('cosmetic_id', $cosmetic->cosmetic_id)
            ->exists();

        if ($alreadyOwned) {
            return response()->json(['message' => 'You already own this cosmetic.'], 400);
        }

        // Not enough coins
        if ($user->coins < $cosmetic->price) {
            return response()->json(['message' => 'Not enough coins.'], 400);
        }

        // Deduct coins & grant cosmetic
        $user->coins -= $cosmetic->price;
        $user->save();

        $owned = UserCosmetic::create([
            'user_id' => $user->user_id,
            'cosmetic_id' => $cosmetic->cosmetic_id,
            'is_equipped' => false,
        ]);

        return response()->json([
            'message' => 'Cosmetic purchased successfully.',
            'owned' => $owned,
            'remaining_coins' => $user->coins,
        ], 201);
    }

    /**
     * Equip a cosmetic and update avatar if type = avatar.
     */
    public function equip(Request $request)
    {
        $request->validate([
            'cosmetic_id' => 'required|integer|exists:cosmetics,cosmetic_id',
        ]);

        /** @var User $user */
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $cosmetic = Cosmetic::findOrFail($request->cosmetic_id);

        // Check ownership
        $userCosmetic = UserCosmetic::where('user_id', $user->user_id)
            ->where('cosmetic_id', $cosmetic->cosmetic_id)
            ->first();

        if (!$userCosmetic) {
            return response()->json(['message' => 'You do not own this cosmetic.'], 403);
        }

        // Unequip all cosmetics of the same type
        $userCosmeticsOfType = UserCosmetic::where('user_id', $user->user_id)
            ->whereHas('cosmetic', fn($q) => $q->where('type', $cosmetic->type))
            ->get();

        foreach ($userCosmeticsOfType as $owned) {
            $owned->update(['is_equipped' => false]);
        }

        // Equip the selected one
        $userCosmetic->update(['is_equipped' => true]);

        // 🔥 CRITICAL: If it's an avatar, store the RELATIVE PATH (not full URL)
        // The database should store: "cosmetics/avatar1.png"
        // NOT: "https://backend.railway.app/storage/cosmetics/avatar1.png"
        if ($cosmetic->type === 'avatar') {
            // Get the original relative path from the database
            $originalCosmetic = Cosmetic::findOrFail($cosmetic->cosmetic_id);
            $user->avatar = $originalCosmetic->getOriginal('image') ?? $user->avatar;
            $user->save();
        }

        return response()->json([
            'message' => 'Cosmetic equipped successfully.',
            'equipped' => $userCosmetic,
        ], 200);
    }
}