<?php

namespace App\Presentation\Http\Controllers;

use App\Application\ProductManagement\DTOs\StoreProductData;
use App\Application\ProductManagement\DTOs\UpdateProductData;
use App\Application\ProductManagement\ProductService;
use App\Domain\ProductManagement\Models\Product;
use App\Presentation\Http\Requests\Products\StoreProductRequest;
use App\Presentation\Http\Requests\Products\UpdateProductRequest;
use App\Presentation\Http\Resources\Products\ProductCollection;
use App\Presentation\Http\Resources\Products\ProductResource;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(private readonly ProductService $products) {}

    public function index(): Response
    {
        return Inertia::render('products/index', [
            'products' => new ProductCollection($this->products->paginate()),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('products/create');
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->products->create(StoreProductData::fromArray($request->validated()));

        return to_route('products.index')->with('message', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('products/edit', [
            'product' => new ProductResource($product),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->products->update($product, UpdateProductData::fromArray($request->validated()));

        return to_route('products.index')->with('message', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->products->delete($product);

        return to_route('products.index')->with('message', 'Product deleted successfully.');
    }
}
