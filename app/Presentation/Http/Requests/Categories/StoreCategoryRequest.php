<?php

namespace App\Presentation\Http\Requests\Categories;

use App\Presentation\Http\Requests\Categories\Concerns\ValidatesCategoryHierarchy;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    use ValidatesCategoryHierarchy;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'parent_id' => $this->parentIdRules(),
            'sort_order' => ['nullable', 'integer', 'min:1'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('categories', 'slug')],
            'description' => ['nullable', 'string'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
