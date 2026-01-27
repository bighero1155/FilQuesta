<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAnswer extends Model
{
    protected $table = 'quiz_answers';

    protected $fillable = [
        'submission_id',
        'question_id',
        'option_id',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(QuizSubmission::class, 'submission_id', 'id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id', 'question_id');
    }

    public function option(): BelongsTo
    {
        return $this->belongsTo(Option::class, 'option_id', 'option_id');
    }
}
