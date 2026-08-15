<?php

namespace App\Application\UserManagement\DTOs;

final readonly class StoreUserData
{
    /** @param list<string> $roles */
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public bool $isActive,
        public array $roles = [],
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
            isActive: (bool) $data['is_active'],
            roles: $data['roles'] ?? [],
        );
    }
}
