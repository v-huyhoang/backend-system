<?php

namespace App\Presentation\Http\Resources\LandlordListings;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LandlordListingEditResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'public_id' => $this->public_id,
            'property_type_id' => $this->property_type_id,
            'ward_id' => $this->ward_id,
            'province_slug' => $this->ward?->province?->slug,
            'title' => $this->title,
            'description' => $this->description,
            'address_detail' => $this->address_detail,
            'monthly_rent' => $this->monthly_rent,
            'deposit_amount' => $this->deposit_amount,
            'area_sqm' => $this->area_sqm,
            'max_occupants' => $this->max_occupants,
            'available_from' => $this->available_from?->toDateString(),
            'contact_name' => $this->contact_name,
            'contact_phone' => $this->contact_phone,
            'amenity_ids' => $this->amenities->pluck('id')->values(),
            'costs' => $this->costs->map(fn ($cost) => [
                'type' => $cost->type,
                'label' => $cost->label,
                'amount' => $cost->amount,
                'unit' => $cost->unit,
                'note' => $cost->note,
            ]),
            'images' => $this->images->map(fn ($image) => [
                'id' => $image->id,
                'path' => $image->path,
                'alt_text' => $image->alt_text,
                'is_primary' => $image->is_primary,
            ]),
        ];
    }
}
