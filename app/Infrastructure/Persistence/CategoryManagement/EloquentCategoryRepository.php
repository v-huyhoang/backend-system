<?php

namespace App\Infrastructure\Persistence\CategoryManagement;

use App\Domain\CategoryManagement\Contracts\CategoryRepository;
use App\Domain\CategoryManagement\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

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
            ->orderBy('sort_order')
            ->orderBy('id')
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
            ->with('children')
            ->orderBy('sort_order')
            ->orderBy('id')
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
                    'label' => $child->name,
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
        return DB::transaction(function () use ($attributes): Category {
            $attributes['sort_order'] = $this->nextSortOrder($attributes['parent_id'] ?? null);

            return Category::create($attributes);
        });
    }

    public function update(Category $category, array $attributes): Category
    {
        return DB::transaction(function () use ($category, $attributes): Category {
            $newParentId = $attributes['parent_id'] ?? null;
            $parentChanged = (int) ($category->parent_id ?? 0) !== (int) ($newParentId ?? 0);

            if ($parentChanged) {
                $attributes['sort_order'] = $this->nextSortOrder($newParentId);
            }

            $category->update($attributes);

            return $category->refresh();
        });
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }

    private function nextSortOrder(?int $parentId): int
    {
        $lastSibling = Category::query()
            ->where('parent_id', $parentId)
            ->orderByDesc('sort_order')
            ->lockForUpdate()
            ->first(['sort_order']);

        return ($lastSibling?->sort_order ?? 0) + 1;
    }
}
