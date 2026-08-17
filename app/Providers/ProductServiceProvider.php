<?php

namespace App\Providers;

use App\Domain\ProductManagement\Contracts\ProductRepository;
use App\Domain\ProductManagement\Models\Product;
use App\Infrastructure\Persistence\ProductManagement\EloquentProductRepository;
use App\Policies\ProductPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class ProductServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProductRepository::class, EloquentProductRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(Product::class, ProductPolicy::class);
    }
}
