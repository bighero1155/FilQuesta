<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizSubmission extends Model
{
    // migration created 'quiz_submissions' with ->id() default 'id'
    protected $table = 'quiz_submissions';

    protected $fillable = [
        'quiz_id',
        'student_id',
        'score',
    ];

    // eager-load answers (optional)
    protected $with = ['answers.option', 'answers.question'];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'quiz_id', 'quiz_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id', 'user_id');
    }

    public function answers(): HasMany
    {
        // answers.submission_id references quiz_submissions.id
        return $this->hasMany(QuizAnswer::class, 'submission_id', 'id');
    }
}
