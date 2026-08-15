<?php

namespace App\Application\AccessControl;

use App\Application\AccessControl\DTOs\RoleData;
use App\Domain\AccessControl\Contracts\RoleRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function __construct(private readonly RoleRepository $roles) {}

    public function paginate(): LengthAwarePaginator
    {
        return $this->roles->paginate();
    }

    public function permissionOptions(): Collection
    {
        return $this->roles->permissionOptions();
    }

    public function details(Role $role): array
    {
        return $this->roles->roleDetails($role);
    }

    public function create(RoleData $data): Role
    {
        return $this->roles->create(
            ['name' => $data->name, 'description' => $data->description],
            $data->permissions,
        );
    }

    public function update(Role $role, RoleData $data): Role
    {
        return $this->roles->update(
            $role,
            ['name' => $data->name, 'description' => $data->description],
            $data->permissions,
        );
    }

    public function delete(Role $role): void
    {
        $this->roles->delete($role);
    }
}
