<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; 

class UserController extends Controller
{
    /**
     * Store a new user.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name'      => 'nullable|string|max:55',
            'middle_name'     => 'nullable|string|max:55',
            'last_name'       => 'nullable|string|max:55',
            'age'             => 'required|string|max:3',
            'address'         => 'nullable|string|max:255',
            'school'          => 'nullable|string|max:255',
            'contact_number'  => 'nullable|string|max:55',
            'username'        => 'required|string|max:55|unique:users,username',
            'section'         => 'nullable|string|max:55',
            'email'           => 'nullable|email',
            'password'        => 'required|string',
            'role'            => 'required|in:student,teacher',
            'coins'           => 'nullable|integer|min:0',
            'total_score'     => 'nullable|integer|min:0',
            'avatar'          => 'nullable|string|max:255',
            'rank'            => 'nullable|string|max:55',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'first_name'      => $request->first_name,
            'middle_name'     => $request->middle_name,
            'last_name'       => $request->last_name,
            'age'             => $request->age,
            'address'         => $request->address,
            'school'          => $request->school,
            'contact_number'  => $request->contact_number,
            'username'        => $request->username,
            'section'         => $request->section,
            'email'           => $request->email,
            'password'        => Hash::make($request->password),
            'role'            => $request->role,
            'coins'           => $request->coins ?? 0,
            'total_score'     => $request->total_score ?? 0,
            'avatar'          => $request->avatar,
            'rank'            => $request->rank ?? 'Beginner',
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    /**
     * Display all users excluding soft-deleted ones.
     */
    public function index(Request $request)
    {
        $query = User::whereNull('deleted_at');
        
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->get([
            'user_id',
            'first_name',
            'middle_name',
            'last_name',
            'age',
            'address',
            'school',
            'contact_number',
            'username',
            'section',
            'email',
            'role',
            'coins',
            'total_score',
            'avatar',
            'rank',
            'last_login_at',
            'deleted_at'
        ]);

        return response()->json($users);
    }

    /**
     * Show a single user profile.
     */
    public function show($user_id)
    {
        $user = User::select(
            'user_id',
            'first_name',
            'middle_name',
            'last_name',
            'age',
            'address',
            'school',
            'contact_number',
            'username',
            'section',
            'email',
            'role',
            'coins',
            'total_score',
            'avatar',
            'rank'
        )->find($user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    /**
     * Update a user.
     */
    public function update(Request $request, $user_id)
    {
        $validator = Validator::make($request->all(), [
            'first_name'      => 'nullable|string|max:55',
            'middle_name'     => 'nullable|string|max:55',
            'last_name'       => 'nullable|string|max:55',
            'age'             => 'required|string|max:3',
            'address'         => 'nullable|string|max:255',
            'school'          => 'nullable|string|max:255',
            'contact_number'  => 'nullable|string|max:55|unique:users,contact_number,' . $user_id . ',user_id',
            'username'        => 'required|string|max:55|unique:users,username,' . $user_id . ',user_id',
            'section'         => 'nullable|string|max:55',
            'email'           => 'nullable|email|unique:users,email,' . $user_id . ',user_id',
            'password'        => 'nullable|string',
            'role'            => 'required|in:student,teacher',
            'coins'           => 'nullable|integer|min:0',
            'total_score'     => 'nullable|integer|min:0',
            'avatar'          => 'nullable|string|max:255',
            'rank'            => 'nullable|string|max:55',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $updateData = $request->only([
            'first_name',
            'middle_name',
            'last_name',
            'age',
            'address',
            'school',
            'contact_number',
            'username',
            'section',
            'email',
            'role',
            'coins',
            'total_score',
            'avatar',
            'rank',
        ]);

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Update user total_score (from game progress).
     */
    public function updateScore(Request $request, $user_id)
    {
        $validator = Validator::make($request->all(), [
            'total_score' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->total_score = $request->total_score;
        $user->save();

        return response()->json([
            'message' => 'Total score updated successfully',
            'total_score' => $user->total_score
        ]);
    }

    /**
     * Soft delete a user.
     */
    public function destroy($user_id)
    {
        $user = User::find($user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User soft deleted successfully']);
    }

    /**
     * ✅ UPDATED: Leaderboard with combined game + shared quiz scores
     */
    public function leaderboard()
    {
        // Get all students with game scores
        $users = User::where('role', 'student')
            ->select([
                'user_id',
                'username',
                'first_name',
                'total_score as game_score',
                'avatar'
            ])
            ->get()
            ->map(function ($user) {
                // Get shared quiz scores from database
                $sharedQuizScore = DB::table('shared_quiz_participants')
                    ->where('student_id', $user->user_id)
                    ->whereNotNull('finished_at')
                    ->sum('score');

                $combinedScore = ($user->game_score ?? 0) + ($sharedQuizScore ?? 0);

                return [
                    'user_id' => $user->user_id,
                    'username' => $user->username ?: $user->first_name ?: 'Unknown',
                    'avatar' => $user->avatar,
                    'total_score' => (int) ($user->game_score ?? 0),
                    'shared_quiz_score' => (int) ($sharedQuizScore ?? 0),
                    'combined_score' => (int) $combinedScore,
                ];
            })
            ->sortByDesc('combined_score')
            ->values()
            ->map(function ($user, $index) {
                // Calculate rank based on position and score
                // ✅ FIX: Only assign top ranks if user has actually earned points
                $rank = 'Beginner'; // Default for new users
                
                if ($user['combined_score'] > 0) {
                    // Only assign position-based ranks if user has points
                    if ($index === 0) {
                        $rank = 'Legendary';
                    } elseif ($index === 1) {
                        $rank = 'Master';
                    } elseif ($index === 2) {
                        $rank = 'Diamond';
                    } elseif ($user['combined_score'] >= 1000) {
                        $rank = 'Platinum';
                    } elseif ($user['combined_score'] >= 500) {
                        $rank = 'Gold';
                    } elseif ($user['combined_score'] >= 200) {
                        $rank = 'Silver';
                    } elseif ($user['combined_score'] >= 100) {
                        $rank = 'Bronze';
                    } else {
                        $rank = 'Beginner';
                    }
                }

                $user['rank'] = $rank;
                return $user;
            });

        return response()->json($users);
    }

    public function publicProfile($user_id)
    {
        $user = User::select('user_id', 'username', 'avatar', 'role')
            ->find($user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Return avatar with full path if exists
        return response()->json([
            'user_id' => $user->user_id,
            'username' => $user->username,
            'avatar' => $user->avatar
                ? asset('storage/' . $user->avatar)
                : null,
            'role' => $user->role,
        ]);
    }
    public function getQuizScore($user_id)
    {
        $sharedQuizScore = DB::table('shared_quiz_participants')
            ->where('student_id', $user_id)
            ->whereNotNull('finished_at')
            ->sum('score');

        return response()->json([
            'user_id' => $user_id,
            'shared_quiz_score' => (int) ($sharedQuizScore ?? 0),
        ]);
    }
}