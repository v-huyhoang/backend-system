<?php

namespace App\Policies;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\CategoryManagement\Models\Category;
use App\Domain\UserManagement\Models\User;

final class CategoryPolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->can(SystemPermission::ViewCategories->value);
    }

    public function view(User $actor, Category $category): bool
    {
        return $actor->can(SystemPermission::ViewCategories->value);
    }

    public function create(User $actor): bool
    {
        return $actor->can(SystemPermission::CreateCategories->value);
    }

    public function update(User $actor, Category $category): bool
    {
        return $actor->can(SystemPermission::EditCategories->value);
    }

    public function delete(User $actor, Category $category): bool
    {
        return $actor->can(SystemPermission::DeleteCategories->value);
    }
}
