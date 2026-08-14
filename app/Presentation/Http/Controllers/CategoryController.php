<?php

namespace App\Presentation\Http\Controllers;

use App\Application\CategoryManagement\CategoryService;
use App\Domain\CategoryManagement\Models\Category;
use App\Presentation\Http\Requests\Categories\StoreCategoryRequest;
use App\Presentation\Http\Requests\Categories\UpdateCategoryRequest;
use App\Presentation\Http\Resources\Categories\CategoryCollection;
use App\Presentation\Http\Resources\Categories\CategoryResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(private readonly CategoryService $categories) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['q', 'is_active']);

        return Inertia::render('categories/index', [
            'categories' => new CategoryCollection(
                $this->categories->paginate($filters)
            ),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('categories/create', [
            'parentOptions' => $this->categories->parentOptions(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $this->categories->create($request->validated());

        return to_route('categories.index')->with('message', 'Category created successfully.');
    }

    public function edit(Request $request, Category $category): Response
    {
        return Inertia::render('categories/edit', [
            'category' => (new CategoryResource($category))->resolve($request),
            'parentOptions' => $this->categories->parentOptions($category),
        ]);
    }

    public function show(Category $category): RedirectResponse
    {
        return to_route('categories.edit', $category);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $this->categories->update($category, $request->validated());

        return to_route('categories.index')->with('message', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->categories->delete($category);

        return to_route('categories.index')->with('message', 'Category deleted successfully.');
    }
}
