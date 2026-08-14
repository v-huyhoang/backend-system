<?php

namespace App\Domain\AccessControl\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;

interface PermissionRepository
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function create(array $attributes): Permission;

    public function update(Permission $permission, array $attributes): Permission;

    public function delete(Permission $permission): void;
}
