<?php

namespace App\Application\AccessControl;

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

    public function create(array $data): Permission
    {
        return $this->permissions->create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);
    }

    public function update(Permission $permission, array $data): Permission
    {
        return $this->permissions->update($permission, [
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);
    }

    public function delete(Permission $permission): void
    {
        $this->permissions->delete($permission);
    }
}
