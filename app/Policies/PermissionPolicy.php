<?php

namespace App\Policies;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\UserManagement\Models\User;
use Spatie\Permission\Models\Permission;

final class PermissionPolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->can(SystemPermission::ViewPermissions->value);
    }

    public function view(User $actor, Permission $permission): bool
    {
        return $actor->can(SystemPermission::ViewPermissions->value);
    }

    public function create(User $actor): bool
    {
        return $actor->can(SystemPermission::CreatePermissions->value);
    }

    public function update(User $actor, Permission $permission): bool
    {
        return $actor->can(SystemPermission::EditPermissions->value);
    }

    public function delete(User $actor, Permission $permission): bool
    {
        return $actor->can(SystemPermission::DeletePermissions->value);
    }
}
