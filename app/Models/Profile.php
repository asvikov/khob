<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Profile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'description',
        'birth',
        'settings'
    ];

    protected function casts() :array {

        return [
            'birth' => 'date'
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
