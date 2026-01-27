<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Question extends Model
{
    protected $primaryKey = 'question_id';
    
    protected $fillable = [
        'quiz_id',
        'question_text',
        'question_image',
    ];

    // Append full image URL to JSON responses
    protected $appends = ['image_url'];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'quiz_id', 'quiz_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(Option::class, 'question_id', 'question_id');
    }

    // Accessor to get full image URL
    public function getImageUrlAttribute()
    {
        if ($this->question_image) {
            return Storage::url($this->question_image);
        }
        return null;
    }

    // Optional: Delete image when question is deleted
    protected static function booted()
    {
        static::deleting(function ($question) {
            if ($question->question_image) {
                Storage::disk('public')->delete($question->question_image);
            }
        });
    }
}
