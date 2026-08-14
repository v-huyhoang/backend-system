<?php

namespace App\Infrastructure\Persistence\UserManagement;

use App\Domain\UserManagement\Contracts\UserRepository;
use App\Domain\UserManagement\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class EloquentUserRepository implements UserRepository
{
    public function paginate(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return User::query()
            ->search($filters['q'] ?? null)
            ->filter(['is_active' => $filters['is_active'] ?? null])
            ->when($filters['role_id'] ?? null, function ($userQuery, int|string $roleId) {
                $userQuery->whereHas('roles', function ($roleQuery) use ($roleId) {
                    $roleQuery->where('roles.id', $roleId);
                });
            })
            ->with('roles:id,name')
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function roleOptions(): Collection
    {
        return Role::query()->orderBy('name')->pluck('name');
    }

    public function roleFilterOptions(): Collection
    {
        return Role::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
    }

    public function userDetails(User $user): User
    {
        return $user->load('roles:id,name');
    }

    public function create(array $attributes, array $roles): User
    {
        return DB::transaction(function () use ($attributes, $roles) {
            $user = User::create($attributes);
            $user->syncRoles($roles);

            return $user;
        });
    }

    public function update(User $user, array $attributes, array $roles): User
    {
        return DB::transaction(function () use ($user, $attributes, $roles) {
            $user->update($attributes);
            $user->syncRoles($roles);

            return $user->refresh();
        });
    }

    public function delete(User $user): void
    {
        DB::transaction(fn () => $user->delete());
    }
}
