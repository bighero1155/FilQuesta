<?php
// app/Http/Controllers/ClassroomMessageController.php

namespace App\Http\Controllers;

use App\Models\ClassroomMessage;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class ClassroomMessageController extends Controller
{
    /**
     * Get all messages for a classroom
     */
    public function index($classroomId)
    {
        $messages = ClassroomMessage::where('classroom_id', $classroomId)
            ->with('user:user_id,username,first_name,last_name,avatar')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'message_id' => $message->message_id,
                    'classroom_id' => $message->classroom_id,
                    'user_id' => $message->user_id,
                    'username' => $message->user->username,
                    'first_name' => $message->user->first_name ?? '',
                    'last_name' => $message->user->last_name ?? '',
                    'avatar' => $message->user->avatar,
                    'message' => $message->message,
                    'timestamp' => $message->created_at->toISOString(),
                ];
            });

        return response()->json($messages);
    }

    /**
     * Store a new message
     */
    public function store(Request $request, $classroomId)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,user_id',
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $message = ClassroomMessage::create([
            'classroom_id' => $classroomId,
            'user_id' => $request->user_id,
            'message' => $request->message,
        ]);

        // Load the user relationship
        $message->load('user:user_id,username,first_name,last_name,avatar');

        return response()->json([
            'message_id' => $message->message_id,
            'classroom_id' => $message->classroom_id,
            'user_id' => $message->user_id,
            'username' => $message->user->username,
            'first_name' => $message->user->first_name ?? '',
            'last_name' => $message->user->last_name ?? '',
            'avatar' => $message->user->avatar,
            'message' => $message->message,
            'timestamp' => $message->created_at->toISOString(),
        ], 201);
    }
}