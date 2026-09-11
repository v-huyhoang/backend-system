<?php

namespace App\Domain\Rental\Models;

use App\Domain\AdministrativeDivision\Models\Ward;
use App\Domain\Rental\Enums\ListingStatus;
use App\Domain\UserManagement\Models\User;
use Database\Factories\ListingFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class Listing extends Model
{
    /** @use HasFactory<ListingFactory> */
    use HasFactory, SoftDeletes;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'landlord_id',
        'property_type_id',
        'ward_id',
        'title',
        'slug',
        'description',
        'address_detail',
        'latitude',
        'longitude',
        'monthly_rent',
        'deposit_amount',
        'area_sqm',
        'max_occupants',
        'available_from',
        'contact_name',
        'contact_phone',
        'status',
        'rejection_reason',
        'submitted_at',
        'published_at',
        'expires_at',
        'view_count',
        'contact_count',
    ];

    protected function casts(): array
    {
        return [
            'status' => ListingStatus::class,
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'monthly_rent' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'area_sqm' => 'decimal:2',
            'available_from' => 'date',
            'submitted_at' => 'datetime',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function landlord(): BelongsTo
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    /** @return BelongsTo<PropertyType, $this> */
    public function propertyType(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class);
    }

    /** @return BelongsTo<Ward, $this> */
    public function ward(): BelongsTo
    {
        return $this->belongsTo(Ward::class);
    }

    /** @return HasMany<ListingImage, $this> */
    public function images(): HasMany
    {
        return $this->hasMany(ListingImage::class)->orderBy('sort_order');
    }

    /** @return HasOne<ListingImage, $this> */
    public function primaryImage(): HasOne
    {
        return $this->hasOne(ListingImage::class)->where('is_primary', true);
    }

    /** @return HasMany<ListingCost, $this> */
    public function costs(): HasMany
    {
        return $this->hasMany(ListingCost::class)->orderBy('sort_order');
    }

    /** @return BelongsToMany<Amenity, $this> */
    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'listing_amenities');
    }

    /** @param Builder<Listing> $query
     * @return Builder<Listing>
     */
    public function scopePubliclyVisible(Builder $query, ?Carbon $now = null): Builder
    {
        $now ??= now();

        return $query
            ->where('status', ListingStatus::Published->value)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', $now)
            ->where(function (Builder $expiresAtQuery) use ($now) {
                $expiresAtQuery
                    ->whereNull('expires_at')
                    ->orWhere('expires_at', '>', $now);
            });
    }

    protected static function booted(): void
    {
        static::creating(function (self $listing) {
            $listing->public_id ??= (string) Str::ulid();
        });
    }

    protected static function newFactory(): ListingFactory
    {
        return ListingFactory::new();
    }
}
