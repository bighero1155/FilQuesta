<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $primaryKey = 'user_id';

    protected $hidden = [
        'password',
    ];

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'age',
        'address',
        'contact_number',
        'username',
        'section',
        'email',
        'password',
        'role',
        'coins',
        'total_score',
        'avatar', 
        'rank',
        'last_login_at',
        'school',
    ];

    protected $dates = ['deleted_at'];

    /**
     * Relationship: User has many levels.
     */
    public function levels()
    {
        return $this->hasMany(Level::class, 'user_id', 'user_id');
    }

    /**
     * Relationship: User belongs to many quizzes.
     */
    public function quizzes()
    {
        return $this->belongsToMany(Quiz::class, 'quiz_student', 'student_id', 'quiz_id')
            ->withTimestamps();
    }

    /**
     * Relationship: User owns many cosmetics through UserCosmetic pivot.
     */
    public function userCosmetics()
    {
        return $this->hasMany(UserCosmetic::class, 'user_id', 'user_id');
    }

    /**
     * Shortcut: Get cosmetics directly via pivot.
     */
    public function cosmetics()
    {
        return $this->belongsToMany(Cosmetic::class, 'user_cosmetics', 'user_id', 'cosmetic_id')
            ->withPivot('is_equipped')
            ->withTimestamps();
    }

    public function equippedBadge()
    {
        return $this->hasOne(UserCosmetic::class, 'user_id', 'user_id')
            ->where('is_equipped', true)
            ->whereHas('cosmetic', function ($q) {
                $q->where('type', 'badge');
            })
            ->with('cosmetic');
    }

    public function userPowerUps()
    {
        return $this->hasMany(UserPowerUp::class, 'user_id', 'user_id');
    }

    public function powerUps()
    {
        return $this->belongsToMany(PowerUp::class, 'user_power_ups', 'user_id', 'power_up_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    // ✅ NEW: Shared Quiz Session Relationships
    
    /**
     * Relationship: User (as student) participates in shared quiz sessions
     */
    public function sharedQuizParticipations()
    {
        return $this->hasMany(SharedQuizParticipant::class, 'student_id', 'user_id');
    }

    /**
     * Relationship: User (as teacher) creates shared quiz sessions
     */
    public function createdSharedSessions()
    {
        return $this->hasMany(SharedQuizSession::class, 'teacher_id', 'user_id');
    }

    /**
     * Relationship: User's quiz submissions (regular quizzes)
     */
    public function quizSubmissions()
    {
        return $this->hasMany(QuizSubmission::class, 'student_id', 'user_id');
    }
}