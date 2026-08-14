<?php

namespace App\Domain\UserManagement\Contracts;

use App\Domain\UserManagement\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface UserRepository
{
    public function paginate(array $filters, int $perPage = 10): LengthAwarePaginator;

    public function roleOptions(): Collection;

    public function userDetails(User $user): User;

    public function create(array $attributes, array $roles): User;

    public function update(User $user, array $attributes, array $roles): User;

    public function delete(User $user): void;
}
