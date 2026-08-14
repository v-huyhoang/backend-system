<?php

namespace App\Infrastructure\Persistence\AccessControl;

use App\Domain\AccessControl\Contracts\PermissionRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;

class EloquentPermissionRepository implements PermissionRepository
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Permission::query()
            ->latest()
            ->paginate($perPage)
            ->through(fn (Permission $permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'description' => $permission->description,
                'created_at' => $permission->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $permission->updated_at?->format('Y-m-d H:i:s'),
            ]);
    }

    public function create(array $attributes): Permission
    {
        return Permission::create($attributes + ['guard_name' => 'web']);
    }

    public function update(Permission $permission, array $attributes): Permission
    {
        $permission->update($attributes);

        return $permission->refresh();
    }

    public function delete(Permission $permission): void
    {
        $permission->delete();
    }
}
