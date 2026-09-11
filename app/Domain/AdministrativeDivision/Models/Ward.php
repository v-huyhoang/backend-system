<?php

namespace App\Domain\AdministrativeDivision\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ward extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'province_id',
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

    /** @return BelongsTo<Province, $this> */
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }
}
