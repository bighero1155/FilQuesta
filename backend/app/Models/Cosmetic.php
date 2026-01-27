<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cosmetic extends Model
{
    use HasFactory;

    protected $primaryKey = 'cosmetic_id';

    protected $fillable = [
        'type',         // avatar, badge, or nick_frame
        'name',
        'description',
        'price',
        'image',        // stored path or filename
    ];

    /**
     * Relationship: A cosmetic can belong to many users.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_cosmetics', 'cosmetic_id', 'user_id')
            ->withPivot('is_equipped')
            ->withTimestamps();
    }

    /**
     * Relationship: A cosmetic has many userCosmetic entries.
     */
    public function userCosmetics()
    {
        return $this->hasMany(UserCosmetic::class, 'cosmetic_id', 'cosmetic_id');
    }
}
