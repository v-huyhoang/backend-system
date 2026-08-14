<?php

namespace App\Application\UserManagement;

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

    public function details(User $user): User
    {
        return $this->users->userDetails($user);
    }

    public function create(array $data): User
    {
        return $this->users->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ], $data['roles'] ?? []);
    }

    public function update(User $user, array $data): User
    {
        return $this->users->update($user, [
            'name' => $data['name'],
            'email' => $data['email'],
        ], $data['roles'] ?? []);
    }

    public function delete(User $user): void
    {
        $this->users->delete($user);
    }
}
