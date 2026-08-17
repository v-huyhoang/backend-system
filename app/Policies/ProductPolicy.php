<?php

namespace App\Policies;

use App\Domain\ProductManagement\Models\Product;
use App\Domain\UserManagement\Models\User;

final class ProductPolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->can('view_products');
    }

    public function view(User $actor, Product $product): bool
    {
        return $actor->can('view_products');
    }

    public function create(User $actor): bool
    {
        return $actor->can('create_products');
    }

    public function update(User $actor, Product $product): bool
    {
        return $actor->can('edit_products');
    }

    public function delete(User $actor, Product $product): bool
    {
        return $actor->can('delete_products');
    }
}
