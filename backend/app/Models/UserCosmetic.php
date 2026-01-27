<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCosmetic extends Model
{
    use HasFactory;

    protected $primaryKey = 'user_cosmetic_id';

    protected $fillable = [
        'user_id',
        'cosmetic_id',
        'is_equipped',
    ];

    /**
     * Relationship: Belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Relationship: Belongs to a cosmetic.
     */
    public function cosmetic()
    {
        return $this->belongsTo(Cosmetic::class, 'cosmetic_id', 'cosmetic_id');
    }

    public function badge()
    {
        return $this->belongsTo(Cosmetic::class, 'cosmetic_id')
            ->where('type', 'badge');
    }
}
