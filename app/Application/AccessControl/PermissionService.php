<?php

namespace App\Application\AccessControl;

use App\Application\AccessControl\DTOs\PermissionData;
use App\Domain\AccessControl\Contracts\PermissionRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function __construct(private readonly PermissionRepository $permissions) {}

    public function paginate(): LengthAwarePaginator
    {
        return $this->permissions->paginate();
    }

    public function create(PermissionData $data): Permission
    {
        return $this->permissions->create([
            'name' => $data->name,
            'description' => $data->description,
        ]);
    }

    public function update(Permission $permission, PermissionData $data): Permission
    {
        return $this->permissions->update($permission, [
            'name' => $data->name,
            'description' => $data->description,
        ]);
    }

    public function delete(Permission $permission): void
    {
        $this->permissions->delete($permission);
    }
}
