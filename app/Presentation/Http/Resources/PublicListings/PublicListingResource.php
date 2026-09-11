<?php

namespace App\Presentation\Http\Resources\PublicListings;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicListingResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'public_id' => $this->public_id,
            'slug' => $this->slug,
            'title' => $this->title,
            'monthly_rent' => $this->monthly_rent,
            'area_sqm' => $this->area_sqm,
            'max_occupants' => $this->max_occupants,
            'available_from' => $this->available_from?->toDateString(),
            'published_at' => $this->published_at?->toIso8601String(),
            'property_type' => $this->whenLoaded('propertyType', fn () => [
                'name' => $this->propertyType->name,
                'slug' => $this->propertyType->slug,
            ]),
            'location' => $this->whenLoaded('ward', fn () => [
                'ward' => $this->ward->name,
                'ward_slug' => $this->ward->slug,
                'province' => $this->ward->province?->name,
                'province_slug' => $this->ward->province?->slug,
            ]),
            'primary_image' => $this->whenLoaded('primaryImage', fn () => $this->primaryImage
                ? [
                    'path' => $this->primaryImage->path,
                    'alt_text' => $this->primaryImage->alt_text,
                ]
                : null),
            'amenities' => $this->whenLoaded('amenities', fn () => $this->amenities->map(
                fn ($amenity) => [
                    'name' => $amenity->name,
                    'slug' => $amenity->slug,
                    'icon' => $amenity->icon,
                ],
            )),
        ];
    }
}
