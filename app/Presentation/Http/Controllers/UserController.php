<?php

namespace App\Presentation\Http\Controllers;

use App\Application\UserManagement\DTOs\StoreUserData;
use App\Application\UserManagement\DTOs\UpdateUserData;
use App\Application\UserManagement\UserService;
use App\Domain\UserManagement\Models\User;
use App\Presentation\Http\Requests\Users\StoreUserRequest;
use App\Presentation\Http\Requests\Users\UpdateUserRequest;
use App\Presentation\Http\Resources\Users\UserCollection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserService $users) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['q', 'role_id', 'is_active']);

        return Inertia::render('admin/users/index', [
            'users' => new UserCollection($this->users->paginate($filters)),
            'roles' => $this->users->roleFilterOptions(),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create', ['roles' => $this->users->roleOptions()]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->users->create(StoreUserData::fromArray($request->validated()));

        return to_route('admin.users.index')->with('message', 'User created successfully.');
    }

    public function show(User $user): RedirectResponse
    {
        return to_route('admin.users.edit', $user);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => $this->users->details($user),
            'roles' => $this->users->roleOptions(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->users->update($user, UpdateUserData::fromArray($request->validated()));

        return to_route('admin.users.index')->with('message', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->users->delete($user);

        return to_route('admin.users.index')->with('message', 'User deleted successfully.');
    }
}
