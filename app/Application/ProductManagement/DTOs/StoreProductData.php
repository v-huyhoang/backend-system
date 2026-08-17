<?php

namespace App\Application\ProductManagement\DTOs;

final readonly class StoreProductData
{
    public function __construct(
        // Field required
        public string $code,
        public string $name,
        public string $slug,

        // Field nullable
        public ?int $category_id = null,
        public ?string $short_description = null,
        public ?string $content = null,
        public ?string $thumbnail_path = null,
        public ?array $advantages = null,
        public ?array $disadvantages = null,
        public ?array $suitable_for = null,
        public ?array $not_suitable_for = null,
        public ?string $published_at = null,

        // Field have default value
        public string $status = 'draft',
        public bool $is_featured = false,
        public int $sort_order = 0,
    ) {}

    /**
     * @param array<string, mixed> $attributes
     */
    public static function fromArray(array $attributes): self
    {
        return new self(
            code: $attributes['code'],
            name: $attributes['name'],
            slug: $attributes['slug'],
            category_id: $attributes['category_id'] ?? null,
            short_description: $attributes['short_description'] ?? null,
            content: $attributes['content'] ?? null,
            thumbnail_path: $attributes['thumbnail_path'] ?? null,
            advantages: $attributes['advantages'] ?? null,
            disadvantages: $attributes['disadvantages'] ?? null,
            suitable_for: $attributes['suitable_for'] ?? null,
            not_suitable_for: $attributes['not_suitable_for'] ?? null,
            published_at: $attributes['published_at'] ?? null,
            status: $attributes['status'] ?? 'draft',
            is_featured: $attributes['is_featured'] ?? false,
            sort_order: $attributes['sort_order'] ?? 0,
        );
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
