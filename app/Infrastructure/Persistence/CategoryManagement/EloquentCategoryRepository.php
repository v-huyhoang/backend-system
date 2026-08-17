<?php

namespace App\Infrastructure\Persistence\CategoryManagement;

use App\Domain\CategoryManagement\Contracts\CategoryRepository;
use App\Domain\CategoryManagement\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
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
            $parentId = $attributes['parent_id'] ?? null;
            $this->lockSiblings($parentId);

            $lastPosition = $this->lastSortOrder($parentId);
            $position = isset($attributes['sort_order'])
                ? min((int) $attributes['sort_order'], $lastPosition + 1)
                : $lastPosition + 1;

            $this->siblings($parentId)
                ->where('sort_order', '>=', $position)
                ->increment('sort_order');

            $attributes['sort_order'] = $position;

            return Category::create($attributes);
        });
    }

    public function update(Category $category, array $attributes): Category
    {
        return DB::transaction(function () use ($category, $attributes): Category {
            $newParentId = $attributes['parent_id'] ?? null;
            $parentChanged = (int) ($category->parent_id ?? 0) !== (int) ($newParentId ?? 0);
            $requestedPosition = (int) ($attributes['sort_order'] ?? $category->sort_order);

            if ($parentChanged) {
                $this->lockSiblings($category->parent_id);
                $this->lockSiblings($newParentId);

                $this->siblings($category->parent_id)
                    ->where('sort_order', '>', $category->sort_order)
                    ->decrement('sort_order');

                $position = min($requestedPosition, $this->lastSortOrder($newParentId) + 1);

                $this->siblings($newParentId)
                    ->where('sort_order', '>=', $position)
                    ->increment('sort_order');

                $attributes['sort_order'] = $position;
            } else {
                $this->lockSiblings($newParentId);

                $position = min($requestedPosition, max($this->lastSortOrder($newParentId), 1));

                if ($position < $category->sort_order) {
                    $this->siblings($newParentId)
                        ->whereKeyNot($category->id)
                        ->whereBetween('sort_order', [$position, $category->sort_order - 1])
                        ->increment('sort_order');
                } elseif ($position > $category->sort_order) {
                    $this->siblings($newParentId)
                        ->whereKeyNot($category->id)
                        ->whereBetween('sort_order', [$category->sort_order + 1, $position])
                        ->decrement('sort_order');
                }

                $attributes['sort_order'] = $position;
            }

            $category->update($attributes);

            return $category->refresh();
        });
    }

    public function delete(Category $category): void
    {
        DB::transaction(function () use ($category): void {
            $parentId = $category->parent_id;
            $sortOrder = $category->sort_order;

            $this->lockSiblings($parentId);
            $category->delete();

            $this->siblings($parentId)
                ->where('sort_order', '>', $sortOrder)
                ->decrement('sort_order');
        });
    }

    private function siblings(?int $parentId): Builder
    {
        return Category::query()->where('parent_id', $parentId);
    }

    private function lockSiblings(?int $parentId): void
    {
        $this->siblings($parentId)
            ->lockForUpdate()
            ->get(['id']);
    }

    private function lastSortOrder(?int $parentId): int
    {
        return (int) $this->siblings($parentId)->max('sort_order');
    }
}
