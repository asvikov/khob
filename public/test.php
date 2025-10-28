<?php

class NTest {

    public function tt() {

        foreach(['a', 'b', 'c'] as $role) {
            if($role === 'c') {
                break;
                return 'break';
                
            }
            echo $role;
        }
    }

    public function ttt() {
        $ar1 = [
        ['a', 'b'],
        ['c', 'd']
    ];

        foreach($ar1 as $el1) {
        foreach($el1 as $val1) {
            if($val1 === 'b') return $val1;
        }
        echo 't';
    }
    }
}

$ntestcl = new NTest();
echo $ntestcl->ttt();






ttt();