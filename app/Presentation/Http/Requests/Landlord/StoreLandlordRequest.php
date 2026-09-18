<?php

namespace App\Presentation\Http\Requests\Landlord;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLandlordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'property_type_id' => ['required', 'integer', Rule::exists('property_types', 'id')->where('is_active', true)],
            'ward_id' => ['required', 'integer', Rule::exists('wards', 'id')->where('is_active', true)],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:10000'],
            'address_detail' => ['required', 'string', 'max:500'],
            'monthly_rent' => ['required', 'numeric', 'min:0'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0'],
            'area_sqm' => ['required', 'numeric', 'gt:0'],
            'max_occupants' => ['required', 'integer', 'min:1'],
            'available_from' => ['nullable', 'date'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:20'],
            'amenity_ids' => ['sometimes', 'array'],
            'amenity_ids.*' => ['integer', 'distinct', Rule::exists('amenities', 'id')->where('is_active', true)],
            'costs' => ['sometimes', 'array'],
            'costs.*.type' => ['required', 'string', 'max:20', Rule::exists('listing_cost_types', 'slug')->where('is_active', true)],
            'costs.*.label' => ['required', 'string', 'max:100'],
            'costs.*.amount' => ['nullable', 'numeric', 'min:0'],
            'costs.*.unit' => ['required', 'string', 'max:20'],
            'costs.*.note' => ['nullable', 'string', 'max:500'],
        ];
    }
}
