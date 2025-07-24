<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Occasion extends Model
{
    protected $fillable = [
        'start',
        'end',
        'location',
        'address',
        'description'
    ];

    protected function casts() :array
    {
        return [
            'start' => 'datetime',
            'end' => 'datetime',
        ];
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function scopeGetWithCoord($query, array $select = []) {

        $select_arr = [
            'id',
            'start',
            'end',
            'address',
            'description',
            'created_at',
            'updated_at',
            DB::raw('ST_AsText(location) as location')
        ];

        if(!$select) {
            $select = $select_arr;
        } else {
            $select[] = DB::raw('ST_AsText(location) as location');
        }

        return $query->select($select);
    }

    /*
    protected function location(): Attribute {

        return Attribute::make(
            get: function(string|null $value) {
                if (is_null($value)) return null;
                preg_match('/POINT\(([0-9.]+) ([0-9.]+)\)/', $value, $matches);
                return [$matches[1], $matches[2]];
            }
        );
    }
        */

    public function createWithCoord(array $input) {

        $fillable = array_flip($this->fillable);

        $input = array_intersect_key($input, $fillable);

        if(!empty($input['location'])) {
            $input['location'] = DB::raw("ST_GeogFromText('POINT(".$input['location'][0]." ".$input['location'][1].")')");
        }

        return $this->create($input);
    }

}
