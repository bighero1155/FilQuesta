<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Classroom extends Model
{
    use HasFactory;

    protected $primaryKey = 'classroom_id';
    protected $fillable = ['teacher_id', 'title', 'code', 'description'];

    // Auto-generate 6-character uppercase code when creating a classroom
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($classroom) {
            $classroom->code = strtoupper(Str::random(6));
        });
    }

    // Teacher relation
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id', 'user_id');
    }

    // Students relation with points on pivot
    public function students()
    {
        return $this->belongsToMany(User::class, 'classroom_students', 'classroom_id', 'student_id')
                    ->withPivot('points')
                    ->withTimestamps();
    }
}
