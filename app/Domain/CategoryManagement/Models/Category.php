<?php

namespace App\Domain\CategoryManagement\Models;

use App\Domain\ProductManagement\Models\Product;
use App\Traits\Filterable;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use Filterable, HasFactory;
    use Sluggable;

    protected array $searchable = ['name', 'slug', 'description'];

    protected $table = 'categories';

    protected $fillable = [
        'name',
        'parent_id',
        'sort_order',
        'slug',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
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

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id')
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function childrenRecursive()
    {
        return $this->children()->with('childrenRecursive');
    }

	public function products(): HasMany
	{
		return $this->hasMany(Product::class);
	}
}
