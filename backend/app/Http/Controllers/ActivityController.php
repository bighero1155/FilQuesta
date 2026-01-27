<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PageVisit;
use Illuminate\Routing\Controller;

class ActivityController extends Controller
{
    /**
     * Log when a user visits a page and how long they spent. 
     */
    public function logPageVisit(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'page' => 'required|string|max:255',
            'time_spent' => 'required|integer|min:0',
        ]);

        $visit = PageVisit::firstOrCreate(
            ['user_id' => $request->user_id, 'page' => $request->page],
            [
                'visit_count' => 0,
                'total_time_spent' => 0,
                'total_gameover' => 0, // ✅ keep total_gameover consistent
            ]
        );

        $visit->increment('visit_count');
        $visit->increment('total_time_spent', $request->time_spent);

        return response()->json([
            'message' => '✅ Page visit logged successfully',
            'data' => $visit,
        ]);
    }

    /**
     * Get the most recent 10 page visits (with user info).
     */
    public function getPageVisits()
    {
        $visits = PageVisit::with('user:user_id,username') // Only load needed fields
            ->orderByDesc('updated_at')
            ->get();

        return response()->json($visits);
    }

    /**
     * Log a game over event for a specific user and page.
     */
    public function logGameOver(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'page' => 'required|string|max:255',
        ]);

        $visit = PageVisit::firstOrCreate(
            ['user_id' => $request->user_id, 'page' => $request->page],
            [
                'visit_count' => 0,
                'total_time_spent' => 0,
                'total_gameover' => 0,
            ]
        );

        $visit->increment('total_gameover');

        return response()->json([
            'message' => '✅ Game over logged successfully',
            'data' => $visit,
        ]);
    }
}
