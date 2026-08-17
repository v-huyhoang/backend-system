<?php

namespace App\Presentation\Http\Controllers;

use App\Application\CategoryManagement\CategoryService;
use App\Application\ProductManagement\DTOs\StoreProductData;
use App\Application\ProductManagement\DTOs\UpdateProductData;
use App\Application\ProductManagement\ProductService;
use App\Domain\ProductManagement\Models\Product;
use App\Presentation\Http\Requests\Products\IndexProductRequest;
use App\Presentation\Http\Requests\Products\StoreProductRequest;
use App\Presentation\Http\Requests\Products\UpdateProductRequest;
use App\Presentation\Http\Resources\Products\ProductCollection;
use App\Presentation\Http\Resources\Products\ProductResource;
use Illuminate\Http\Client\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
	const PREFIX_ADMIN_PRODUCT = 'admin/products/';

    public function __construct(private readonly ProductService $productService, private readonly CategoryService $categoryService) {}

    public function index(IndexProductRequest $request): Response
    {
		$filters = $request->validated();
        return Inertia::render(self::PREFIX_ADMIN_PRODUCT.'index', [
            'products' => new ProductCollection($this->productService->paginate($filters)),
			'categories' => $this->categoryService->productFilterOptions(),
			'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render(self::PREFIX_ADMIN_PRODUCT.'create');
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->products->create(StoreProductData::fromArray($request->validated()));

        return to_route(self::PREFIX_ADMIN_PRODUCT.'index')->with('message', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render(self::PREFIX_ADMIN_PRODUCT.'edit', [
            'product' => new ProductResource($product),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->products->update($product, UpdateProductData::fromArray($request->validated()));

        return to_route(self::PREFIX_ADMIN_PRODUCT.'index')->with('message', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->products->delete($product);

        return to_route(self::PREFIX_ADMIN_PRODUCT.'index')->with('message', 'Product deleted successfully.');
    }
}
