<?php

namespace App\Application\AccessControl\DTOs;

final readonly class PermissionData
{
    public function __construct(
        public string $name,
        public ?string $description,
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            description: $data['description'] ?? null,
        );
    }
}
