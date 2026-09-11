<?php

namespace App\Presentation\Http\Requests\PublicListings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class IndexPublicListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'khu-vuc' => ['nullable', 'string', 'max:120'],
            'loai-hinh' => ['nullable', 'string', Rule::exists('property_types', 'slug')->where('is_active', true)],
            'gia-tu' => ['nullable', 'integer', 'min:0'],
            'gia-den' => ['nullable', 'integer', 'min:0'],
            'dien-tich-tu' => ['nullable', 'numeric', 'min:0'],
            'dien-tich-den' => ['nullable', 'numeric', 'min:0'],
            'tien-ich' => ['nullable', 'array', 'max:10'],
            'tien-ich.*' => ['string', Rule::exists('amenities', 'slug')->where('is_active', true)],
            'sap-xep' => ['nullable', Rule::in(['newest', 'price_asc', 'price_desc', 'area_desc'])],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator) {
            if ($this->filled('gia-tu') && $this->filled('gia-den')
                && $this->integer('gia-tu') > $this->integer('gia-den')) {
                $validator->errors()->add('gia-tu', 'Giá tối thiểu không được lớn hơn giá tối đa.');
            }

            if ($this->filled('dien-tich-tu') && $this->filled('dien-tich-den')
                && (float) $this->input('dien-tich-tu') > (float) $this->input('dien-tich-den')) {
                $validator->errors()->add('dien-tich-tu', 'Diện tích tối thiểu không được lớn hơn diện tích tối đa.');
            }
        }];
    }
}
