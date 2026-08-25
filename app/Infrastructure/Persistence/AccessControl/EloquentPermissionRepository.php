<?php

namespace App\Infrastructure\Persistence\AccessControl;

use App\Domain\AccessControl\Contracts\PermissionRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;

class EloquentPermissionRepository implements PermissionRepository
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Permission::query()
            ->when($filters['q'] ?? null, function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(
                ($filters['assigned'] ?? null) === '1',
                fn ($query) => $query->whereHas('roles'),
            )
            ->when(
                ($filters['assigned'] ?? null) === '0',
                fn ($query) => $query->whereDoesntHave('roles'),
            )
            ->latest()
            ->paginate($perPage)
            ->withQueryString()
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
