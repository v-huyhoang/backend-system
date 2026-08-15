<?php

namespace App\Application\UserManagement\DTOs;

final readonly class UpdateUserData
{
    /** @param list<string> $roles */
    public function __construct(
        public string $name,
        public string $email,
        public bool $isActive,
        public array $roles = [],
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            isActive: (bool) $data['is_active'],
            roles: $data['roles'] ?? [],
        );
    }
}
