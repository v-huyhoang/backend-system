<?php

namespace App\Domain\ProductManagement\Contracts;

use App\Domain\ProductManagement\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepository
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    public function create(array $attributes): Product;

    public function update(Product $product, array $attributes): Product;

    public function delete(Product $product): void;
}
