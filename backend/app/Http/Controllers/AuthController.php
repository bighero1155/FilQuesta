<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password'   => 'required|string',
        ]);

        // Decide if identifier is an email or username
        $field = filter_var($request->identifier, FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'username';

        // Normalize username to lowercase if it's not an email
        $identifier = $field === 'username'
            ? strtolower($request->identifier)
            : $request->identifier;

        $user = User::where($field, $identifier)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'identifier' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Update last login timestamp
        $user->update(['last_login_at' => now()]);

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user'  => $user,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name'     => 'nullable|string|max:55',
            'middle_name'    => 'nullable|string|max:55',
            'last_name'      => 'nullable|string|max:55',
            'age'            => 'required|string|max:3',
            'address'        => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:55|unique:users,contact_number', 
            'username'       => 'required|string|max:55|unique:users,username',       
            'section'        => 'nullable|string|max:55',
            'school'         => 'nullable|string|max:255', 
            'email'          => 'nullable|email|unique:users,email',                  
            'password'       => 'required|string',
            'role'           => 'nullable|in:student,teacher,admin',
        ]);

        // Normalize username to lowercase
        $username = strtolower($request->username);

        $user = User::create([
            'first_name'     => $request->first_name,
            'middle_name'    => $request->middle_name,
            'last_name'      => $request->last_name,
            'age'            => $request->age,
            'address'        => $request->address,
            'contact_number' => $request->contact_number,
            'username'       => $username,
            'section'        => $request->section,
            'school'         => $request->school, 
            'email'          => $request->email,
            'password'       => Hash::make($request->password),
            'role'           => $request->role ?? 'student',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
