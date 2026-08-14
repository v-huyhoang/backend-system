<?php

namespace App\Domain\CategoryManagement\Contracts;

use App\Domain\CategoryManagement\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CategoryRepository
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    public function parentOptions(?Category $excluding = null): Collection;

    public function create(array $attributes): Category;

    public function update(Category $category, array $attributes): Category;

    public function delete(Category $category): void;
}
