<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OccasionController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

/*
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
*/
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::resource('/users', UserController::class)->except(['edit', 'create']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::resource('/occasions', OccasionController::class)->except(['edit', 'create']);
});

Route::get('/welcom',  [OccasionController::class, 'indexGuest']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forregisterusers', [UserController::class, 'forRegisterUsers']);




Route::get('/test', function(Request $request) {

        dd('test');
});
