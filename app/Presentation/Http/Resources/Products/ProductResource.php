<?php

namespace App\Presentation\Http\Resources\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ] : null),
            'name' => $this->name,
            'code' => $this->code,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'content' => $this->content,
            'thumbnail_path' => $this->thumbnail_path,
            'advantages' => $this->advantages,
            'disadvantages' => $this->disadvantages,
            'suitable_for' => $this->suitable_for,
            'not_suitable_for' => $this->not_suitable_for,
            'status' => $this->status->value,
            'is_featured' => $this->is_featured,
            'sort_order' => $this->sort_order,
            'published_at' => $this->published_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Add fields exposed to the presentation layer here.
        ];
    }
}
