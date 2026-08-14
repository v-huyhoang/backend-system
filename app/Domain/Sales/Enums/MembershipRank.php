<?php

namespace App\Domain\Sales\Enums;

enum MembershipRank: string
{
    case Standard = 'Standard';
    case Silver = 'Silver';
    case Gold = 'Gold';
    case Platinum = 'Platinum';

    public function label(): string
    {
        return $this->value;
    }

    public static function options(): array
    {
        return array_map(
            fn (self $rank) => ['value' => $rank->value, 'label' => $rank->label()],
            self::cases(),
        );
    }
}
