<?php

namespace App\Presentation\Http\Requests\Merchants;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMerchantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Add update validation rules here.
        ];
    }
}
