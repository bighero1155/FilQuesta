<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SharedQuizAnswer extends Model
{
    protected $fillable = [
        'participant_id',
        'question_id',
        'option_id',
        'text_answer',
    ];

    public function participant(): BelongsTo
    {
        return $this->belongsTo(SharedQuizParticipant::class, 'participant_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function option(): BelongsTo
    {
        return $this->belongsTo(Option::class, 'option_id');
    }
}