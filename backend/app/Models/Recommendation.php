<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    use HasFactory;

    protected $primaryKey = 'recommendation_id';
    public $incrementing = true;                   
    protected $keyType = 'int';                   
    protected $fillable = [
        'teacher_id',
        'student_id',
        'game_link',
        'message',
        'read',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id', 'user_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'user_id');
    }
}
