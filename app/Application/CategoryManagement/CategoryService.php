<?php

namespace App\Application\CategoryManagement;

use App\Application\CategoryManagement\DTOs\CategoryData;
use App\Domain\CategoryManagement\Contracts\CategoryRepository;
use App\Domain\CategoryManagement\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CategoryService
{
    public function __construct(private readonly CategoryRepository $categories) {}

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return $this->categories->paginate($filters);
    }

    public function parentOptions(?Category $excluding = null): Collection
    {
        return $this->categories->parentOptions($excluding);
    }

    public function create(CategoryData $data): Category
    {
        return $this->categories->create($data->toArray());
    }

    public function update(Category $category, CategoryData $data): Category
    {
        return $this->categories->update($category, $data->toArray());
    }

    public function delete(Category $category): void
    {
        $this->categories->delete($category);
    }
}
