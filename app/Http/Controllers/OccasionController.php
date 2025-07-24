<?php

namespace App\Http\Controllers;

use App\Models\Occasion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\OccasionCreateRequest;
use App\Services\OccasionModelService;

class OccasionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if($request->query('location') === 'occasions') {
            $user = $request->user();
            $occasions = $user->occasions()->get(['id', 'start', 'end', 'description', 'address']);
            return response()->json($occasions);
        } else {
            $occasions = Occasion::all(['id', 'start', 'end', 'description', 'address']);
            return response()->json($occasions);
        }
    }

    public function indexGuest() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(OccasionCreateRequest $request, OccasionModelService $occasionModel)
    {
        $input = $request->all();
        $occasion = $occasionModel->create($input);
        return response()->json($occasion);
    }

    /**
     * Display the specified resource.
     */
    public function show($id, OccasionModelService $occasionModel)
    {
        $occasion = $occasionModel->querySelect()->where('id', $id)->first();
        $occasion->location = $occasionModel->pointAsArray($occasion->location);
        return response()->json($occasion);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Occasion $occasion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Occasion $occasion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Occasion $occasion)
    {
        //
    }
}
