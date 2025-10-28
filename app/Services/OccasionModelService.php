<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class OccasionModelService {

    protected $fillable = [
        'start',
        'end',
        'location',
        'address',
        'description'
    ];

    public function querySelect(array $select = []) {

        $select_arr = [
            'id',
            'start',
            'end',
            'address',
            'description',
            'created_at',
            'updated_at'
        ];

        if(!$select) {
            $select = $select_arr;
        }
        $select[] = DB::raw('ST_AsText(location) as location');

        return DB::table('occasions')->select($select);
    }

    public function create(array $input) {

        $fillable = array_flip($this->fillable);
        $input = array_intersect_key($input, $fillable);

        if(!empty($input['location'])) {
            $input['location'] = DB::raw("ST_GeogFromText('POINT(".$input['location'][0]." ".$input['location'][1].")')");
        }
        $t_now = Carbon::now();
        $input['created_at'] = $t_now;
        $input['updated_at'] = $t_now;

        $id = DB::table('occasions')->insertGetId($input);

        if(!$id) return [];
        return DB::table('occasions')->find($id);
    }

    public function update(array $input) {

        $id = $input['id'];
        $fillable = array_flip($this->fillable);
        $input = array_intersect_key($input, $fillable);

        if(!empty($input['location'])) {
            $input['location'] = DB::raw("ST_GeogFromText('POINT(".$input['location'][0]." ".$input['location'][1].")')");
        }
        $t_now = Carbon::now();
        $input['updated_at'] = $t_now;

        $is_upd = DB::table('occasions')->where('id', $id)->update($input);

        if(!$is_upd) return [];
        return DB::table('occasions')->find($id);
    }

    public function pointAsArray(string|null $point) {

        if (is_null($point)) return null;
        preg_match('/POINT\(([0-9.]+) ([0-9.]+)\)/', $point, $matches);
        return [$matches[1], $matches[2]];
    }
}
