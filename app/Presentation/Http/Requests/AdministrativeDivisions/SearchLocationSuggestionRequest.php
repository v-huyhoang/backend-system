<?php

namespace App\Presentation\Http\Requests\AdministrativeDivisions;

use Illuminate\Foundation\Http\FormRequest;

class SearchLocationSuggestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['q' => ['nullable', 'string', 'min:1', 'max:100']];
    }
}
