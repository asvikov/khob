<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
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
            'name' => 'string|min:4',
            'last_name' => 'string|min:4',
            'email' => [
                'email',
                Rule::unique('users')->ignore($this->user)
            ],
            'password' => 'string|min:3',
            'description' => 'string',
            'birth' => 'date',
            'banned' => 'integer|size:1'
        ];
    }
}
