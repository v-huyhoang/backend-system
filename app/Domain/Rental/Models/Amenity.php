<?php

namespace App\Domain\Rental\Models;

use Database\Factories\AmenityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Amenity extends Model
{
    /** @use HasFactory<AmenityFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'name',
        'slug',
        'icon',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /** @return BelongsToMany<Listing, $this> */
    public function listings(): BelongsToMany
    {
        return $this->belongsToMany(Listing::class, 'listing_amenities');
    }

    protected static function newFactory(): AmenityFactory
    {
        return AmenityFactory::new();
    }
}
