<?php

namespace App\Domain\Sales\Models;

use App\Domain\Sales\Enums\MembershipRank;
use App\Domain\Shared\Enums\ActiveStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'membership_rank',
        'notes',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => ActiveStatus::class,
            'membership_rank' => MembershipRank::class,
        ];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
