<?php

namespace App\Policies;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\UserManagement\Models\User;
use Spatie\Permission\Models\Role;

final class RolePolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->can(SystemPermission::ViewRoles->value);
    }

    public function view(User $actor, Role $role): bool
    {
        return $actor->can(SystemPermission::ViewRoles->value);
    }

    public function create(User $actor): bool
    {
        return $actor->can(SystemPermission::CreateRoles->value);
    }

    public function update(User $actor, Role $role): bool
    {
        return $actor->can(SystemPermission::EditRoles->value);
    }

    public function delete(User $actor, Role $role): bool
    {
        return $actor->can(SystemPermission::DeleteRoles->value);
    }
}
