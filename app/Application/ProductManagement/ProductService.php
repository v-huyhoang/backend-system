<?php

namespace App\Application\ProductManagement;

use App\Application\ProductManagement\DTOs\StoreProductData;
use App\Application\ProductManagement\DTOs\UpdateProductData;
use App\Domain\ProductManagement\Contracts\ProductRepository;
use App\Domain\ProductManagement\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductService
{
    public function __construct(private readonly ProductRepository $products) {}

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return $this->products->paginate($filters);
    }

    public function create(StoreProductData $data): Product
    {
        return $this->products->create($data->toArray());
    }

    public function update(Product $product, UpdateProductData $data): Product
    {
        return $this->products->update($product, $data->toArray());
    }

    public function delete(Product $product): void
    {
        $this->products->delete($product);
    }
}
