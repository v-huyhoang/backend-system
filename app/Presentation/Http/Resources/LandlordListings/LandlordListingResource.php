<?php

namespace App\Presentation\Http\Resources\LandlordListings;

use App\Domain\Rental\Enums\ListingStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class LandlordListingResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'public_id' => $this->public_id,
            'title' => $this->title,
            'address' => collect([
                $this->address_detail,
                $this->whenLoaded('ward', fn () => $this->ward?->name),
                $this->whenLoaded('ward', fn () => $this->ward?->province?->name),
            ])->filter()->join(', '),
            'monthly_rent' => $this->monthly_rent,
            'area_sqm' => $this->area_sqm,
            'primary_image' => $this->whenLoaded('primaryImage', fn () => $this->primaryImage
                ? [
                    'path' => Storage::disk('public')->url($this->primaryImage->path),
                    'alt_text' => $this->primaryImage->alt_text,
                ]
                : null),
            'images' => $this->whenLoaded('images', fn () => $this->images->map(fn ($image) => [
                'path' => Storage::disk('public')->url($image->path),
                'alt_text' => $image->alt_text,
            ])->values()),
            'status' => $this->status->value,
            'status_label' => $this->statusLabel($this->status),
            'rejection_reason' => $this->rejection_reason,
            'expires_at' => $this->expires_at?->toIso8601String(),
        ];
    }

    private function statusLabel(ListingStatus $status): string
    {
        return match ($status) {
            ListingStatus::Draft => 'Bản nháp',
            ListingStatus::PendingReview => 'Chờ duyệt',
            ListingStatus::Published => 'Đang hiển thị',
            ListingStatus::Rejected => 'Cần bổ sung',
            ListingStatus::Hidden => 'Đã ẩn',
            ListingStatus::Rented => 'Đã cho thuê',
            ListingStatus::Expired => 'Đã hết hạn',
        };
    }
}
