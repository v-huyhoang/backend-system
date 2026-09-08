<?php

namespace App\Presentation\Http\Requests\Merchants;

use Illuminate\Foundation\Http\FormRequest;

class IndexMerchantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:255'],
        ];
    }
}
