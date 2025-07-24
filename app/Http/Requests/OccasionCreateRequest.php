<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OccasionCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'start' => [
                'required',
                'date',
                'after_or_equal:'.now()->subMinutes(30)->toDateTimeString()
            ],
            'location.*' => 'required|numeric',
            'address' => 'required|string',
            'description' =>'required|string|min:5'
        ];
    }
}
