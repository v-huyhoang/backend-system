<?php

namespace Tests\Unit;

use App\Application\AccessControl\DTOs\PermissionData;
use App\Application\AccessControl\DTOs\RoleData;
use App\Application\CategoryManagement\DTOs\CategoryData;
use App\Application\UserManagement\DTOs\StoreUserData;
use App\Application\UserManagement\DTOs\UpdateUserData;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class ApplicationDataTest extends TestCase
{
    #[Test]
    public function it_maps_validated_user_data_to_typed_dtos(): void
    {
        $store = StoreUserData::fromArray([
            'name' => 'Bee',
            'email' => 'bee@example.com',
            'password' => 'password',
            'is_active' => 1,
            'roles' => ['admin'],
        ]);
        $update = UpdateUserData::fromArray([
            'name' => 'Bee Updated',
            'email' => 'updated@example.com',
            'is_active' => 0,
        ]);

        $this->assertTrue($store->isActive);
        $this->assertSame(['admin'], $store->roles);
        $this->assertFalse($update->isActive);
        $this->assertSame([], $update->roles);
    }

    #[Test]
    public function it_maps_access_control_data_to_typed_dtos(): void
    {
        $role = RoleData::fromArray(['name' => 'editor', 'permissions' => ['edit users']]);
        $permission = PermissionData::fromArray(['name' => 'edit users']);

        $this->assertNull($role->description);
        $this->assertSame(['edit users'], $role->permissions);
        $this->assertNull($permission->description);
    }

    #[Test]
    public function it_maps_category_data_and_exposes_persistence_attributes(): void
    {
        $category = CategoryData::fromArray([
            'name' => 'Backend',
            'parent_id' => '12',
            'slug' => null,
            'description' => null,
            'is_active' => 1,
        ]);

        $this->assertSame(12, $category->parentId);
        $this->assertSame([
            'name' => 'Backend',
            'parent_id' => 12,
            'slug' => null,
            'description' => null,
            'is_active' => true,
        ], $category->toArray());
    }
}
