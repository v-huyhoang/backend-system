<?php

namespace App\Domain\AdministrativeDivision\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'code',
        'name',
        'slug',
        'type',
        'source',
        'meta',
        'is_active',
        'source_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'is_active' => 'boolean',
            'source_synced_at' => 'datetime',
        ];
    }

    /** @return HasMany<Ward, $this> */
    public function wards(): HasMany
    {
        return $this->hasMany(Ward::class);
    }
}
