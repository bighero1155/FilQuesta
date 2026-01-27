<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SharedQuizReaction extends Model
{
    protected $fillable = [
        'session_id',
        'emoji',
    ];

    public function session()
    {
        return $this->belongsTo(SharedQuizSession::class, 'session_id', 'session_id');
    }
}