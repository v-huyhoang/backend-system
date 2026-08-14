<?php

namespace App\Providers;

use App\Domain\CategoryManagement\Contracts\CategoryRepository;
use App\Infrastructure\Persistence\CategoryManagement\EloquentCategoryRepository;
use Illuminate\Support\ServiceProvider;

class CategoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CategoryRepository::class, EloquentCategoryRepository::class);
    }
}
