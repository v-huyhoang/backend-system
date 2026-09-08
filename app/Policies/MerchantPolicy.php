<?php

namespace App\Policies;

use App\Domain\MerchantManagement\Models\Merchant;
use App\Domain\UserManagement\Models\User;

final class MerchantPolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->can('view_merchants');
    }

    public function view(User $actor, Merchant $merchant): bool
    {
        return $actor->can('view_merchants');
    }

    public function create(User $actor): bool
    {
        return $actor->can('create_merchants');
    }

    public function update(User $actor, Merchant $merchant): bool
    {
        return $actor->can('edit_merchants');
    }

    public function delete(User $actor, Merchant $merchant): bool
    {
        return $actor->can('delete_merchants');
    }
}
