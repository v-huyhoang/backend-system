<?php

namespace App\Presentation\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ModerationQueueResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'public_id' => $this->public_id,
            'title' => $this->title,
            'address' => collect([$this->address_detail, $this->ward?->name, $this->ward?->province?->name])->filter()->join(', '),
            'monthly_rent' => $this->monthly_rent,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'landlord' => ['name' => $this->landlord?->name, 'email' => $this->landlord?->email],
            'primary_image' => $this->primaryImage ? [
                'path' => Storage::disk('public')->url($this->primaryImage->path),
                'alt_text' => $this->primaryImage->alt_text,
            ] : null,
        ];
    }
}
