<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PowerUp extends Model
{
    protected $primaryKey = 'power_up_id';

    protected $fillable = [
        'name',
        'type',
        'description',
        'price',
        'duration_seconds',
        'multiplier',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_power_ups', 'power_up_id', 'user_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
