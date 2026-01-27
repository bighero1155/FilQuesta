<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recommendation;
use App\Models\User;
use Illuminate\Routing\Controller;

class RecommendationController extends Controller
{
    // ✅ Create a recommendation
    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id' => 'required|exists:users,user_id',
            'student_id' => 'required|exists:users,user_id',
            'game_link' => 'required|string',
            'message' => 'nullable|string|max:255',
        ]);

        $recommendation = Recommendation::create($data);

        return response()->json([
            'message' => 'Recommendation created successfully',
            'recommendation' => $recommendation
        ], 201);
    }

    // ✅ Get all recommendations for a student
    public function studentRecommendations($studentId)
    {
        $recommendations = Recommendation::where('student_id', $studentId)
            ->with('teacher:user_id,username,first_name,last_name')
            ->latest()
            ->get();

        return response()->json($recommendations);
    }

    // ✅ Get all recommendations by a teacher
    public function teacherRecommendations($teacherId)
    {
        $recommendations = Recommendation::where('teacher_id', $teacherId)
            ->with('student:user_id,username,first_name,last_name')
            ->latest()
            ->get();

        return response()->json($recommendations);
    }
    public function markAsRead($studentId)
    {
        Recommendation::where('student_id', $studentId)
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'Recommendations marked as read']);
    }
    public function destroy($id)
    {
        $recommendation = Recommendation::find($id);

        if (!$recommendation) {
            return response()->json(['message' => 'Recommendation not found'], 404);
        }

        $recommendation->delete();

        return response()->json(['message' => 'Recommendation deleted successfully']);
    }
    public function update(Request $request, $id)
    {
        $recommendation = Recommendation::find($id);

        if (!$recommendation) {
            return response()->json(['message' => 'Recommendation not found'], 404);
        }

        $data = $request->validate([
            'game_link' => 'required|string',
            'message' => 'nullable|string|max:255',
        ]);

        $recommendation->update($data);

        return response()->json([
            'message' => 'Recommendation updated successfully',
            'recommendation' => $recommendation
        ]);
    }
}
