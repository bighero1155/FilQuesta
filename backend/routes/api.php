<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ClassroomMessageController;
use App\Http\Controllers\CosmeticCrudController;
use App\Http\Controllers\PowerUpController;
use App\Http\Controllers\RecommendationController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/public/users/{user_id}', [UserController::class, 'publicProfile']);

Route::get('/config', function () {
    return response()->json([
        'apiBaseUrl' => config('app.url') . '/api',
    ]);
});

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/user-role', function () {
        return response()->json([
            'role' => request()->user()->role
        ]);
    });

    /*
    |--------------------------------------------------------------------------
    | USERS
    |--------------------------------------------------------------------------
    */
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user_id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user_id}', [UserController::class, 'update']);
    Route::delete('/users/{user_id}', [UserController::class, 'destroy']);

    Route::post('/users/{user_id}/progress', [UserController::class, 'updateProgress']);
    Route::put('/users/{user_id}/score', [UserController::class, 'updateScore']);
    Route::get('/users/{user_id}/quiz-score', [UserController::class, 'getQuizScore']);

    Route::get('/leaderboard', [UserController::class, 'leaderboard']);

    /*
    |--------------------------------------------------------------------------
    | LEVELS / GAME PROGRESS  ✅ FIXED
    |--------------------------------------------------------------------------
    */
    Route::get('/users/{user_id}/levels', [LevelController::class, 'userLevels']);
    Route::post('/users/{user_id}/levels', [LevelController::class, 'storeOrUpdate']);
    Route::delete('/users/{user_id}/levels/{id}', [LevelController::class, 'destroy']);
    Route::delete('/users/{user_id}/levels', [LevelController::class, 'destroyByUserAndGame']);

    // Leaderboard-style per-game progress
    Route::get('/games/{game_name}/levels', [LevelController::class, 'gameLevels']);

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD & ACTIVITY
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard-data', [DashboardController::class, 'getStats']);

    Route::post('/page-visits', [ActivityController::class, 'logPageVisit']);
    Route::get('/page-visits', [ActivityController::class, 'getPageVisits']);
    Route::post('/page-visits/gameover', [ActivityController::class, 'logGameOver']);

    /*
    |--------------------------------------------------------------------------
    | QUIZZES
    |--------------------------------------------------------------------------
    */
    Route::get('/quizzes', [QuizController::class, 'index']);
    Route::post('/quizzes', [QuizController::class, 'store']);
    Route::get('/quizzes/{quiz}', [QuizController::class, 'show']);
    Route::put('/quizzes/{quiz}', [QuizController::class, 'update']);
    Route::patch('/quizzes/{quiz}', [QuizController::class, 'update']);
    Route::post('/quizzes/{quiz}', [QuizController::class, 'update']); // file uploads
    Route::delete('/quizzes/{quiz}', [QuizController::class, 'destroy']);

    Route::post('/quizzes/{quiz}/assign', [QuizController::class, 'assign']);
    Route::get('/students/{id}/quizzes', [QuizController::class, 'studentQuizzes']);
    Route::post('/quizzes/{quiz}/submit', [QuizController::class, 'submit']);
    Route::get('/quizzes/{quiz}/results', [QuizController::class, 'results']);
    Route::get('/quiz-results', [QuizController::class, 'allResults']);

    /*
    |--------------------------------------------------------------------------
    | SHARED QUIZ SESSIONS
    |--------------------------------------------------------------------------
    */
    Route::post('/quizzes/{quiz}/shared-sessions', [QuizController::class, 'createSharedSession']);
    Route::post('/shared-sessions/join', [QuizController::class, 'joinSharedSession']);
    Route::post('/shared-sessions/{session}/start', [QuizController::class, 'startSharedSession']);
    Route::get('/shared-sessions/{code}', [QuizController::class, 'getSharedSession']);
    Route::get('/shared-sessions/{session}/results', [QuizController::class, 'sharedSessionResults']);
    Route::post('/shared-sessions/{session}/submit', [QuizController::class, 'submitSharedSession']);
    Route::post('/shared-sessions/{session}/stop', [QuizController::class, 'stopSharedSession']);
    Route::get('/shared-sessions', [QuizController::class, 'listSharedSessions']);
    Route::get('/shared-quiz-results', [QuizController::class, 'allSharedQuizResults']);
    Route::post('/shared-sessions/{code}/reaction', [QuizController::class, 'storeReaction']);
    Route::delete('/shared-sessions/{session}', [QuizController::class, 'deleteSharedSession']);

    /*
    |--------------------------------------------------------------------------
    | CLASSROOMS
    |--------------------------------------------------------------------------
    */
    Route::post('/classrooms', [ClassroomController::class, 'store']);
    Route::post('/classrooms/join', [ClassroomController::class, 'join']);
    Route::get('/classrooms/{id}', [ClassroomController::class, 'show']);
    Route::delete('/classrooms/{id}', [ClassroomController::class, 'destroy']);
    Route::get('/teacher/{teacherId}/classrooms', [ClassroomController::class, 'teacherClassrooms']);
    Route::get('/student/{studentId}/classrooms', [ClassroomController::class, 'studentClassrooms']);
    Route::delete('/classrooms/{classroomId}/students/{studentId}', [ClassroomController::class, 'removeStudent']);

    Route::get('/classrooms/{classroomId}/messages', [ClassroomMessageController::class, 'index']);
    Route::post('/classrooms/{classroomId}/messages', [ClassroomMessageController::class, 'store']);

    /*
    |--------------------------------------------------------------------------
    | COSMETICS
    |--------------------------------------------------------------------------
    */
    Route::get('/cosmetics', [CosmeticCrudController::class, 'index']);
    Route::post('/cosmetics', [CosmeticCrudController::class, 'store']);
    Route::get('/cosmetics/{id}', [CosmeticCrudController::class, 'show']);
    Route::put('/cosmetics/{id}', [CosmeticCrudController::class, 'update']);
    Route::delete('/cosmetics/{id}', [CosmeticCrudController::class, 'destroy']);
    Route::get('/users/{user_id}/cosmetics', [CosmeticCrudController::class, 'userCosmetics']);
    Route::post('/cosmetics/buy', [CosmeticCrudController::class, 'buy']);
    Route::post('/cosmetics/equip', [CosmeticCrudController::class, 'equip']);

    /*
    |--------------------------------------------------------------------------
    | POWER UPS
    |--------------------------------------------------------------------------
    */
    Route::get('/powerups', [PowerUpController::class, 'index']);
    Route::post('/powerups/buy', [PowerUpController::class, 'buy']);
    Route::post('/powerups/use', [PowerUpController::class, 'use']);
    Route::get('/users/{user_id}/powerups', [PowerUpController::class, 'userPowerUps']);

    /*
    |--------------------------------------------------------------------------
    | RECOMMENDATIONS
    |--------------------------------------------------------------------------
    */
    Route::post('/recommendations', [RecommendationController::class, 'store']);
    Route::get('/recommendations/student/{studentId}', [RecommendationController::class, 'studentRecommendations']);
    Route::put('/recommendations/{studentId}/read', [RecommendationController::class, 'markAsRead']);
    Route::get('/recommendations/teacher/{teacherId}', [RecommendationController::class, 'teacherRecommendations']);
    Route::delete('/recommendations/{id}', [RecommendationController::class, 'destroy']);
    Route::put('/recommendations/{id}', [RecommendationController::class, 'update']);
});
