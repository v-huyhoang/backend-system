<?php

namespace App\Application\AccessControl\DTOs;

final readonly class RoleData
{
    /** @param list<string> $permissions */
    public function __construct(
        public string $name,
        public ?string $description,
        public array $permissions = [],
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            description: $data['description'] ?? null,
            permissions: $data['permissions'] ?? [],
        );
    }
}
