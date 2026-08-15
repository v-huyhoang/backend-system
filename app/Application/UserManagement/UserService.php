<?php

namespace App\Application\UserManagement;

use App\Application\UserManagement\DTOs\StoreUserData;
use App\Application\UserManagement\DTOs\UpdateUserData;
use App\Domain\UserManagement\Contracts\UserRepository;
use App\Domain\UserManagement\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(private readonly UserRepository $users) {}

    public function paginate(array $filters): LengthAwarePaginator
    {
        return $this->users->paginate($filters);
    }

    public function roleOptions(): Collection
    {
        return $this->users->roleOptions();
    }

    public function roleFilterOptions(): Collection
    {
        return $this->users->roleFilterOptions();
    }

    public function details(User $user): User
    {
        return $this->users->userDetails($user);
    }

    public function create(StoreUserData $data): User
    {
        return $this->users->create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
            'is_active' => $data->isActive,
        ], $data->roles);
    }

    public function update(User $user, UpdateUserData $data): User
    {
        return $this->users->update($user, [
            'name' => $data->name,
            'email' => $data->email,
            'is_active' => $data->isActive,
        ], $data->roles);
    }

    public function delete(User $user): void
    {
        $this->users->delete($user);
    }
}
