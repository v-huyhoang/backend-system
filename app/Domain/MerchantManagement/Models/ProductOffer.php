<?php

namespace App\Domain\MerchantManagement\Models;

use App\Domain\ProductManagement\Models\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'merchant_id',
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
    ];

    protected function casts(): array
    {
        return [
            'reference_price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'rating' => 'decimal:2',
            'sold_count' => 'integer',
            'is_in_stock' => 'boolean',
            'last_checked_at' => 'datetime',
        ];
    }

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInStock($query)
    {
        return $query->where('is_in_stock', true);
    }
}
