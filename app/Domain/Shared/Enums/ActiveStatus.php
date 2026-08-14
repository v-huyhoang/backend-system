<?php

namespace App\Domain\Shared\Enums;

enum ActiveStatus: int
{
    case Inactive = 0;
    case Active = 1;

    public function label(): string
    {
        return match ($this) {
            self::Inactive => 'Inactive',
            self::Active => 'Active',
        };
    }

    public function isActive(): bool
    {
        return $this === self::Active;
    }

    public static function options(): array
    {
        return array_map(
            fn (self $status) => ['value' => $status->value, 'label' => $status->label()],
            self::cases(),
        );
    }
}
