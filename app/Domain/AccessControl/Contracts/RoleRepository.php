<?php

namespace App\Domain\AccessControl\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Role;

interface RoleRepository
{
    public function paginate(int $perPage = 10): LengthAwarePaginator;

    public function permissionOptions(): Collection;

    public function roleDetails(Role $role): array;

    public function create(array $attributes, array $permissions): Role;

    public function update(Role $role, array $attributes, array $permissions): Role;

    public function delete(Role $role): void;
}
