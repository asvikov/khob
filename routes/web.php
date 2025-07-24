<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::get('/{slug}', function () {
    return view('welcome');
})->where('slug', '.*');

Route::get('/login', function () {
    return view('welcome');
})->name('login');


