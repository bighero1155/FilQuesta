<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassroomStudent extends Model
{
    protected $table = 'classroom_students';
    protected $fillable = ['classroom_id', 'student_id', 'points'];

    // Classroom relation
    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }

    // Student relation
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'user_id');
    }
}
