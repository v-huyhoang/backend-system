<?php

namespace App\Domain\ProductManagement\Models;

use App\Domain\CategoryManagement\Models\Category;
use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $guarded = [];
	protected $fillable = [
		'category_id',
		'short_description',
		'content',
		'thumbnail_path',
		'advantages',
		'disadvantages',
		'suitable_for',
		'not_suitable_for',
		'published_at',
		'code',
		'name',
		'slug',
		'status',
		'is_featured',
		'sort_order'
	];

	protected function casts(): array
    {
        return [
            'advantages' => 'array',
			'disadvantages' => 'array',
			'suitable_for' => 'array',
			'not_suitable_for' => 'array',
            'sort_order' => 'integer',
			'is_featured' => 'boolean',
			'published_at' => 'datetime',
			'status' => ProductStatus::class,
        ];
    }

    /**
     * Auto generate slug
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
                'onUpdate' => true,
            ],
        ];
    }
	public function category(): BelongsTo
	{
		return $this->belongsTo(Category::class);
	}
}
