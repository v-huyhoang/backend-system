<?php

namespace App\Domain\AccessControl\Enums;

enum SystemRole: string
{
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
        };
    }
}
