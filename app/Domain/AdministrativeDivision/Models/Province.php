<?php

namespace App\Domain\AdministrativeDivision\Models;

use Database\Factories\ProvinceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    /** @use HasFactory<ProvinceFactory> */
    use HasFactory;

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

    protected static function newFactory(): ProvinceFactory
    {
        return ProvinceFactory::new();
    }
}
