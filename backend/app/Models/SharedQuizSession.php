<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SharedQuizSession extends Model
{
    protected $primaryKey = 'session_id';
    
    protected $fillable = [
        'quiz_id',
        'teacher_id',
        'code',
        'active',
        'duration_minutes',
        'started_at',
    ];

    protected $casts = [
        'active' => 'boolean',
        'started_at' => 'datetime',
    ];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'quiz_id', 'quiz_id');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id', 'user_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(SharedQuizParticipant::class, 'session_id', 'session_id');
    }
}