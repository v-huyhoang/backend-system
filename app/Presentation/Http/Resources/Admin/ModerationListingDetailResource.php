<?php

namespace App\Presentation\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ModerationListingDetailResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'public_id' => $this->public_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status->value,
            'rejection_reason' => $this->rejection_reason,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'property_type' => $this->propertyType?->name,
            'address' => collect([$this->address_detail, $this->ward?->name, $this->ward?->province?->name])->filter()->join(', '),
            'monthly_rent' => $this->monthly_rent,
            'deposit_amount' => $this->deposit_amount,
            'area_sqm' => $this->area_sqm,
            'max_occupants' => $this->max_occupants,
            'available_from' => $this->available_from?->toDateString(),
            'contact' => ['name' => $this->contact_name, 'phone' => $this->contact_phone],
            'landlord' => ['name' => $this->landlord?->name, 'email' => $this->landlord?->email],
            'amenities' => $this->amenities->pluck('name')->values(),
            'costs' => $this->costs->map(fn ($cost) => [
                'label' => $cost->label,
                'amount' => $cost->amount,
                'unit' => $cost->unit,
                'note' => $cost->note,
            ])->values(),
            'images' => $this->images->map(fn ($image) => [
                'path' => Storage::disk('public')->url($image->path),
                'alt_text' => $image->alt_text,
                'is_primary' => $image->is_primary,
            ])->values(),
            'moderations' => $this->moderations->map(fn ($moderation) => [
                'id' => $moderation->id,
                'moderator_name' => $moderation->moderator?->name,
                'from_status' => $moderation->from_status,
                'to_status' => $moderation->to_status,
                'reason' => $moderation->reason,
                'created_at' => $moderation->created_at?->toIso8601String(),
            ])->values(),
        ];
    }
}
