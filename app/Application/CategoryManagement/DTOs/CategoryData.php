<?php

namespace App\Application\CategoryManagement\DTOs;

final readonly class CategoryData
{
    public function __construct(
        public string $name,
        public ?int $parentId,
        public ?string $slug,
        public ?string $description,
        public bool $isActive,
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            parentId: isset($data['parent_id']) ? (int) $data['parent_id'] : null,
            slug: $data['slug'] ?? null,
            description: $data['description'] ?? null,
            isActive: (bool) $data['is_active'],
        );
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'parent_id' => $this->parentId,
            'slug' => $this->slug,
            'description' => $this->description,
            'is_active' => $this->isActive,
        ];
    }
}
