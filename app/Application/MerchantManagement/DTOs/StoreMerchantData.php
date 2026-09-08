<?php

namespace App\Application\MerchantManagement\DTOs;

final readonly class StoreMerchantData
{
    /** @param array<string, mixed> $attributes */
    private function __construct(private array $attributes) {}

    /** @param array<string, mixed> $attributes */
    public static function fromArray(array $attributes): self
    {
        return new self($attributes);
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return $this->attributes;
    }
}
