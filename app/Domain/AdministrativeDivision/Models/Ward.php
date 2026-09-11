<?php

namespace App\Domain\AdministrativeDivision\Models;

use Database\Factories\WardFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ward extends Model
{
    /** @use HasFactory<WardFactory> */
    use HasFactory;

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

    protected static function newFactory(): WardFactory
    {
        return WardFactory::new();
    }
}
