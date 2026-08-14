<?php

namespace App\Presentation\Http\Controllers;

use App\Application\UserManagement\UserService;
use App\Domain\UserManagement\Models\User;
use App\Presentation\Http\Requests\Users\StoreUserRequest;
use App\Presentation\Http\Requests\Users\UpdateUserRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserService $users) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['q', 'status']);

        return Inertia::render('users/index', [
            'users' => $this->users->paginate($filters),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create', ['roles' => $this->users->roleOptions()]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->users->create($request->validated());

        return to_route('users.index')->with('message', 'User created successfully.');
    }

    public function show(User $user): RedirectResponse
    {
        return to_route('users.edit', $user);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $this->users->details($user),
            'roles' => $this->users->roleOptions(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->users->update($user, $request->validated());

        return to_route('users.index')->with('message', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->users->delete($user);

        return to_route('users.index')->with('message', 'User deleted successfully.');
    }
}
