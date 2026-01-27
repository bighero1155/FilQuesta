<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPowerUp extends Model
{
    protected $primaryKey = 'user_power_up_id';

    protected $fillable = [
        'user_id',
        'power_up_id',
        'quantity',
    ];

    public function powerUp()
    {
        return $this->belongsTo(PowerUp::class, 'power_up_id', 'power_up_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
