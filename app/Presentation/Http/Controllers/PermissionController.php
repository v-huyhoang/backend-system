<?php

namespace App\Presentation\Http\Controllers;

use App\Application\AccessControl\DTOs\PermissionData;
use App\Application\AccessControl\PermissionService;
use App\Presentation\Http\Requests\Permissions\StorePermissionRequest;
use App\Presentation\Http\Requests\Permissions\UpdatePermissionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function __construct(private readonly PermissionService $permissions) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['q', 'assigned']);

        return Inertia::render('admin/permissions/index', [
            'permissions' => $this->permissions->paginate($filters),
            'filters' => $filters,
        ]);
    }

    public function store(StorePermissionRequest $request): RedirectResponse
    {
        $this->permissions->create(PermissionData::fromArray($request->validated()));

        return to_route('admin.permissions.index')->with('message', 'Permission created successfully.');
    }

    public function update(UpdatePermissionRequest $request, Permission $permission): RedirectResponse
    {
        $this->permissions->update($permission, PermissionData::fromArray($request->validated()));

        return to_route('admin.permissions.index')->with('message', 'Permission updated successfully.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $this->permissions->delete($permission);

        return to_route('admin.permissions.index')->with('message', 'Permission deleted successfully.');
    }
}
