<?php

namespace App\Presentation\Http\Requests\Landlord;

class UpdateLandlordListingRequest extends StoreLandlordRequest
{
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'images' => ['sometimes', 'array', 'max:20'],
            'images.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
