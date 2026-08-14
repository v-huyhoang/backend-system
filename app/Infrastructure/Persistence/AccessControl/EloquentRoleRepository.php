<?php

namespace App\Infrastructure\Persistence\AccessControl;

use App\Domain\AccessControl\Contracts\RoleRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class EloquentRoleRepository implements RoleRepository
{
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return Role::query()
            ->with('permissions:id,name,description,created_at,updated_at')
            ->latest()
            ->paginate($perPage)
            ->through(fn (Role $role) => $this->mapRole($role));
    }

    public function permissionOptions(): Collection
    {
        return Permission::query()
            ->select('id', 'name', 'description')
            ->orderBy('name')
            ->get();
    }

    public function roleDetails(Role $role): array
    {
        $role->load('permissions:id,name,description');

        return [
            'id' => $role->id,
            'name' => $role->name,
            'description' => $role->description,
            'permissions' => $role->permissions->map(fn (Permission $permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'description' => $permission->description,
            ]),
        ];
    }

    public function create(array $attributes, array $permissions): Role
    {
        return DB::transaction(function () use ($attributes, $permissions) {
            $role = Role::create($attributes + ['guard_name' => 'web']);
            $role->syncPermissions($permissions);

            return $role;
        });
    }

    public function update(Role $role, array $attributes, array $permissions): Role
    {
        return DB::transaction(function () use ($role, $attributes, $permissions) {
            $role->update($attributes);
            $role->syncPermissions($permissions);

            return $role->refresh();
        });
    }

    public function delete(Role $role): void
    {
        DB::transaction(fn () => $role->delete());
    }

    private function mapRole(Role $role): array
    {
        return [
            'id' => $role->id,
            'name' => $role->name,
            'description' => $role->description,
            'permissions' => $role->permissions->map(fn (Permission $permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'description' => $permission->description,
                'created_at' => $permission->created_at?->format('d-m-Y'),
                'updated_at' => $permission->updated_at?->format('d-m-Y'),
            ]),
        ];
    }
}
