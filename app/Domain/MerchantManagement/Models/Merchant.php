<?php

namespace App\Domain\MerchantManagement\Models;

use App\Domain\ProductManagement\Models\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Merchant extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform',
        'external_merchant_id',
        'name',
        'shop_url',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'platform' => 'string',
            'external_merchant_id' => 'string',
            'name' => 'string',
            'shop_url' => 'string',
            'status' => 'string',
        ];
    }

    public function offers(): HasMany
    {
        return $this->hasMany(ProductOffer::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_offers')
            ->withPivot([
                'platform',
                'external_product_id',
                'product_url',
                'currency',
                'reference_price',
                'original_price',
                'rating',
                'sold_count',
                'is_in_stock',
                'status',
                'last_checked_at',
            ])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
