<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Classroom;
use App\Models\ClassroomStudent;
use App\Models\User;
use Illuminate\Routing\Controller;

class ClassroomController extends Controller 
{
    // Create classroom
    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id' => 'required|exists:users,user_id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $classroom = Classroom::create($data);
        return response()->json($classroom, 201);
    }

    // Student joins a classroom
    public function join(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string',
            'student_id' => 'required|exists:users,user_id',
        ]);

        $classroom = Classroom::where('code', $data['code'])->firstOrFail();

        // Attach student if not already
        $classroom->students()->syncWithoutDetaching([$data['student_id']]);

        return response()->json([
            'message' => 'Student joined classroom',
            'classroom' => $classroom->load('teacher', 'students'),
        ]);
    }

    // View classroom with students and their points
    public function show($id)
    {
        return Classroom::with(['teacher', 'students'])->findOrFail($id);
    }

    // Teacher assigns points to a student
    public function assignPoints(Request $request, $classroomId, $studentId)
    {
        $data = $request->validate([
            'points' => 'required|integer|min:0',
        ]);

        $pivot = ClassroomStudent::where('classroom_id', $classroomId)
                                 ->where('student_id', $studentId)
                                 ->firstOrFail();

        $pivot->points = $data['points'];
        $pivot->save();

        return response()->json([
            'message' => 'Points updated',
            'student' => $pivot->load('student'),
        ]);
    }

    // Teacher's classrooms
    public function teacherClassrooms($teacherId)
    {
        return Classroom::where('teacher_id', $teacherId)
                        ->with(['students'])
                        ->get();
    }

    // Student's classrooms
    public function studentClassrooms($studentId)
    {
        return Classroom::whereHas('students', fn($q) => $q->where('users.user_id', $studentId))
                        ->with('teacher')
                        ->get();
    }

    // Remove student from classroom (or student leaves)
    public function removeStudent($classroomId, $studentId)
    {
        $classroom = Classroom::findOrFail($classroomId);
        $classroom->students()->detach($studentId);

        return response()->json([
            'message' => 'Successfully left the classroom',
        ]);
    }
    public function destroy($id)
    {
        $classroom = Classroom::findOrFail($id);
        $classroom->students()->detach();
        $classroom->delete();

        return response()->json([
            'message' => 'Classroom deleted successfully',
        ], 200);
    }
}