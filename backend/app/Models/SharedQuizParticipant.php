<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SharedQuizParticipant extends Model
{
    protected $fillable = [
        'session_id',
        'student_id',
        'score',
        'finished_at',
    ];

    protected $casts = [
        'finished_at' => 'datetime',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(SharedQuizSession::class, 'session_id', 'session_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id', 'user_id');
    }
}
