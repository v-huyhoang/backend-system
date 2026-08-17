<?php

namespace App\Infrastructure\Persistence\ProductManagement;

use App\Domain\ProductManagement\Contracts\ProductRepository;
use App\Domain\ProductManagement\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentProductRepository implements ProductRepository
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Product::query()
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $attributes): Product
    {
        return Product::create($attributes);
    }

    public function update(Product $product, array $attributes): Product
    {
        $product->update($attributes);

        return $product->refresh();
    }

    public function delete(Product $product): void
    {
        $product->delete();
    }
}
