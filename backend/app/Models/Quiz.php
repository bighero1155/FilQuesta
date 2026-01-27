<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Quiz extends Model
{
    protected $primaryKey = 'quiz_id';
    protected $fillable = ['teacher_id', 'title', 'description'];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id', 'user_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'quiz_id', 'quiz_id');
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'quiz_student', 'quiz_id', 'student_id')
            ->withTimestamps();
    }
}
