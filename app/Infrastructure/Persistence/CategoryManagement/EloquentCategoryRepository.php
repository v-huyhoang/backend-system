<?php

namespace App\Infrastructure\Persistence\CategoryManagement;

use App\Domain\CategoryManagement\Contracts\CategoryRepository;
use App\Domain\CategoryManagement\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentCategoryRepository implements CategoryRepository
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Category::query()
            ->whereNull('parent_id')
            ->with('childrenRecursive')
            ->search($filters['q'] ?? null)
            ->filter([
                'is_active' => $filters['is_active'] ?? null,
            ])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function parentOptions(?Category $excluding = null): Collection
    {
        $excludedIds = $excluding === null
            ? collect()
            : $this->descendantIds($excluding)->push($excluding->id);

        return Category::query()
            ->whereNull('parent_id')
            ->with(['children' => fn ($query) => $query->orderBy('name')])
            ->orderBy('name')
            ->get()
            ->flatMap(function (Category $root) {
                return collect([
                    [
                        'id' => $root->id,
                        'name' => $root->name,
                        'label' => $root->name,
                        'depth' => 1,
                    ],
                ])->concat($root->children->map(fn (Category $child) => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'label' => "{$root->name} / {$child->name}",
                    'depth' => 2,
                ]));
            })
            ->reject(fn (array $option) => $excludedIds->contains($option['id']))
            ->values();
    }

    private function descendantIds(Category $category): Collection
    {
        $category->loadMissing('childrenRecursive');

        return $category->childrenRecursive->flatMap(function (Category $child) {
            return collect([$child->id])->concat($this->descendantIds($child));
        });
    }

    public function create(array $attributes): Category
    {
        return Category::create($attributes);
    }

    public function update(Category $category, array $attributes): Category
    {
        $category->update($attributes);

        return $category->refresh();
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }
}
