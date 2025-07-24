<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Models\Role;

class AuthController extends Controller
{
    public function register(RegisterRequest $request) {

        $input = [
            'name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'password' => $request->input('password')
        ];

        if($request->input('parent_id')) {
            $par_user = User::where('id', $request->input('parent_id'))->first(['id']);

            if($par_user) {
                $input['parent_user_id'] = $par_user->id;
            }
        }
        $user = User::create($input);

        if($user->parent_user_id) {
            $coowner_rol = Role::where('name', 'profile_coowner_not_confirmed')->first();
            $user->roles()->save($coowner_rol);
        } else {
            $owner_rol = Role::where('name', 'profile_owner')->first();
            $user->roles()->save($owner_rol);
        }
        return $this->loginResponceToken($user);
    }

    public function login(LoginRequest $request) {

        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            return $this->loginResponceToken($user);
        } else {
            return response()->json(['status' => 'failure'], 200);
        }
    }

    protected function loginResponceToken(User $user) {

        $token = $user->createToken('bearer_token')->plainTextToken;
        $roles = $user->roles->select(['name', 'permissions']);

        $result = [
            'status' => 'success',
            'user' => [
                'bearer_token' => $token,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $roles
            ]
        ];
        return response()->json($result, 200);
    }

    public function logout(Request $request) {

        $request->user()->currentAccessToken()->delete();
        return response()->json(['status' => 'success'], 200);
    }
}
