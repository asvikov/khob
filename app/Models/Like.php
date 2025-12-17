<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Like extends Model
{
    use HasFactory;

    protected $fillable = [
        'likeable_id',
        'likeable_type',
        'user_id',
        'type'
    ];

    const TYPE_LIKE = 1;
    const TYPE_DISLIKE = -1;

    public function likeable() {
    
        return $this->morphTo();
    }
}
