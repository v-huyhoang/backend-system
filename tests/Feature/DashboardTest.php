<?php

namespace Tests\Feature;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\UserManagement\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $this->actingAs($user = User::factory()->create());
        $user->givePermissionTo(SystemPermission::ViewDashboard->value);

        $this->get(route('dashboard'))->assertOk();
    }

    public function test_authenticated_users_without_permission_cannot_visit_the_dashboard(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get(route('dashboard'))->assertForbidden();
    }
}
