<?php

namespace App\Presentation\Http\Requests\Merchants;

use Illuminate\Foundation\Http\FormRequest;

class StoreMerchantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Add store validation rules here.
        ];
    }
}
