<?php

namespace App\Presentation\Http\Requests\Products;

use App\Enums\ProductStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

     public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:255'],
            'status' => [
                'nullable',
                Rule::in(ProductStatus::class),
            ],
            'category_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id'),
            ],
        ];
    }
}
