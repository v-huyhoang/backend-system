<?php

namespace Database\Seeders;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\AccessControl\Enums\SystemRole;
use App\Domain\UserManagement\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (SystemPermission::cases() as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission->value, 'guard_name' => 'web'],
                ['description' => $permission->description()],
            );
        }

        $adminRole = Role::firstOrCreate([
            'name' => SystemRole::Admin->value,
            'guard_name' => 'web',
        ]);
        $adminRole->syncPermissions(SystemPermission::values());

        $admin = User::query()
            ->where('email', 'admin@example')
            ->orWhere('email', 'admin@example.com')
            ->orWhere('email', 'test@example.com')
            ->first();

        if ($admin) {
            $admin->syncRoles([$adminRole]);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
