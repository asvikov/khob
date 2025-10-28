<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profiles;
use App\Http\Requests\ForRegUsRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Requests\UserStoreRequest;
use Illuminate\Support\Facades\Gate;

use App\Models\Profile;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if(!Gate::allows('viewAny', User::class)) {
            return response('Unauthorized', 403);
        }
        $users = User::all();
        return response()->json($users);
    }

    /**
     * search user names
     */
    public function forRegisterUsers(ForRegUsRequest $request) {

        $pat = '%'.$request->input('name').'%';
        $users = User::where('name', 'LIKE', $pat)->orWhere('last_name', 'LIKE', $pat)->get(['id', 'name', 'last_name', 'avatar']);
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request)
    {
        if(!Gate::allows('create', User::class)) {
            return response('Unauthorized', 403);
        }
        User::create($request->all());
        return response()->json(['message' => 'the user has been created']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with('profile')->findOrFail($id);

        if(!Gate::allows('view', $user)) {
            return response('Unauthorized', 403);
        }
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, string $id)
    {
        $user = User::findOrFail($id);
        
        if(!Gate::allows('update', $user)) {
            return response('Unauthorized', 403);
        }
        $user->update($request->all());
        $profile_input = $request->only(['description', 'birth']);
        
        if($profile_input) {
            $profile = Profile::where('user_id', $user->id);
            $profile->update($profile_input);
        }

        return response()->json(['message' => 'user id:'.$id.'has been updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {   
        $user = User::findOrFail($id);
        
        if(!Gate::allows('delete', $user)) {
            return response('Unauthorized', 403);
        }
        $profile = $user->profile;
        $profile->delete();
        $user->delete();
        return response()->json(['message' => 'user id:'.$id.'has been deleted']);
    }
}
