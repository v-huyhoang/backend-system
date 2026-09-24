<?php

namespace App\Presentation\Http\Requests\Landlord;

use App\Domain\Rental\Enums\ListingStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexLandlordListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', 'string', Rule::enum(ListingStatus::class)],
        ];
    }
}
