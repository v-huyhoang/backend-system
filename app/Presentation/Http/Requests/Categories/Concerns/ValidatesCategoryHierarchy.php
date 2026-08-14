<?php

namespace App\Presentation\Http\Requests\Categories\Concerns;

use App\Domain\CategoryManagement\Models\Category;
use Closure;
use Illuminate\Validation\Rule;

trait ValidatesCategoryHierarchy
{
    /** @return array<int, mixed> */
    protected function parentIdRules(?Category $current = null): array
    {
        return [
            'nullable',
            'integer',
            Rule::exists('categories', 'id'),
            function (string $attribute, mixed $value, Closure $fail) use ($current) {
                if ($value === null) {
                    return;
                }

                $parent = Category::query()->with('parent.parent')->find($value);

                if ($parent === null) {
                    return;
                }

                if ($current !== null && $this->isSelfOrDescendant($parent, $current)) {
                    $fail('Category cha không thể là chính category hiện tại hoặc category con của nó.');

                    return;
                }

                $newDepth = $this->depth($parent) + 1;
                $subtreeHeight = $current === null ? 1 : $this->subtreeHeight($current);

                if ($newDepth + $subtreeHeight - 1 > 3) {
                    $fail('Category chỉ được phân cấp tối đa 3 cấp.');
                }
            },
        ];
    }

    private function depth(Category $category): int
    {
        $depth = 1;

        while ($category->parent !== null) {
            $depth++;
            $category = $category->parent;
        }

        return $depth;
    }

    private function isSelfOrDescendant(Category $candidate, Category $current): bool
    {
        while (true) {
            if ($candidate->is($current)) {
                return true;
            }

            if ($candidate->parent === null) {
                return false;
            }

            $candidate = $candidate->parent;
        }
    }

    private function subtreeHeight(Category $category): int
    {
        $category->loadMissing('childrenRecursive');

        if ($category->childrenRecursive->isEmpty()) {
            return 1;
        }

        return 1 + $category->childrenRecursive
            ->map(fn (Category $child) => $this->subtreeHeight($child))
            ->max();
    }
}
