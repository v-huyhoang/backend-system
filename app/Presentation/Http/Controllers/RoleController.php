<?php

namespace App\Presentation\Http\Controllers;

use App\Application\AccessControl\DTOs\RoleData;
use App\Application\AccessControl\RoleService;
use App\Presentation\Http\Requests\Roles\StoreRoleRequest;
use App\Presentation\Http\Requests\Roles\UpdateRoleRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(private readonly RoleService $roles) {}

    public function index(): Response
    {
        return Inertia::render('admin/roles/index', ['roles' => $this->roles->paginate()]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/roles/create', ['permissions' => $this->roles->permissionOptions()]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $this->roles->create(RoleData::fromArray($request->validated()));

        return to_route('roles.index')->with('message', 'Role created successfully.');
    }

    public function show(Role $role): RedirectResponse
    {
        return to_route('roles.edit', $role);
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('admin/roles/edit', [
            'role' => $this->roles->details($role),
            'permissions' => $this->roles->permissionOptions(),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $this->roles->update($role, RoleData::fromArray($request->validated()));

        return to_route('roles.index')->with('message', 'Role updated successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $this->roles->delete($role);

        return to_route('roles.index')->with('message', 'Role deleted successfully.');
    }
}
