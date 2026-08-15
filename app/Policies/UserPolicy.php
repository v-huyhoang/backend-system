<?php

namespace App\Policies;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\UserManagement\Models\User;

final class UserPolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->can(SystemPermission::ViewUsers->value);
    }

    public function view(User $actor, User $user): bool
    {
        return $actor->can(SystemPermission::ViewUsers->value);
    }

    public function create(User $actor): bool
    {
        return $actor->can(SystemPermission::CreateUsers->value);
    }

    public function update(User $actor, User $user): bool
    {
        return $actor->can(SystemPermission::EditUsers->value);
    }

    public function delete(User $actor, User $user): bool
    {
        return ! $actor->is($user)
            && $actor->can(SystemPermission::DeleteUsers->value);
    }
}
