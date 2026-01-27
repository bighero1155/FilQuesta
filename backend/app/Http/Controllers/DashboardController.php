<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Routing\Controller;

class DashboardController extends Controller
{
    public function getStats()
    {
        $studentsCount = User::where('role', 'student')->count();
        $teachersCount = User::where('role', 'teacher')->count();

        return response()->json([
            'studentsCount' => $studentsCount,
            'teachersCount' => $teachersCount,
        ]);
    }
}
