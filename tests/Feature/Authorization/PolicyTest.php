<?php

namespace Tests\Feature\Authorization;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\CategoryManagement\Models\Category;
use App\Domain\UserManagement\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_registered_policies_delegate_to_system_permissions(): void
    {
        $actor = User::factory()->create();
        $target = User::factory()->create();
        $category = new Category;
        $role = new Role(['guard_name' => 'web']);
        $permission = new Permission(['guard_name' => 'web']);

        $actor->givePermissionTo([
            SystemPermission::ViewUsers->value,
            SystemPermission::CreateRoles->value,
            SystemPermission::EditPermissions->value,
            SystemPermission::DeleteCategories->value,
        ]);

        $this->assertTrue(Gate::forUser($actor)->allows('view', $target));
        $this->assertTrue(Gate::forUser($actor)->allows('create', Role::class));
        $this->assertTrue(Gate::forUser($actor)->allows('update', $permission));
        $this->assertTrue(Gate::forUser($actor)->allows('delete', $category));
        $this->assertFalse(Gate::forUser($actor)->allows('update', $target));
    }

    public function test_user_cannot_delete_their_own_account_even_with_permission(): void
    {
        $actor = User::factory()->create();
        $actor->givePermissionTo(SystemPermission::DeleteUsers->value);

        $this->assertFalse(Gate::forUser($actor)->allows('delete', $actor));
        $this->assertTrue(Gate::forUser($actor)->allows('delete', User::factory()->create()));
    }

    public function test_user_routes_enforce_the_registered_policy(): void
    {
        $actor = User::factory()->create();

        $this->actingAs($actor)
            ->get(route('admin.users.index'))
            ->assertForbidden();

        $actor->givePermissionTo(SystemPermission::ViewUsers->value);

        $this->actingAs($actor)
            ->get(route('admin.users.index'))
            ->assertOk();
    }
}
