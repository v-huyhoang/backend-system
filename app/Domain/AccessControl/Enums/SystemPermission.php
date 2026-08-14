<?php

namespace App\Domain\AccessControl\Enums;

enum SystemPermission: string
{
    case ViewDashboard = 'view_dashboard';
    case ViewPermissions = 'view_permissions';
    case CreatePermissions = 'create_permissions';
    case EditPermissions = 'edit_permissions';
    case DeletePermissions = 'delete_permissions';
    case ViewRoles = 'view_roles';
    case CreateRoles = 'create_roles';
    case EditRoles = 'edit_roles';
    case DeleteRoles = 'delete_roles';
    case ViewUsers = 'view_users';
    case CreateUsers = 'create_users';
    case EditUsers = 'edit_users';
    case DeleteUsers = 'delete_users';

    public function description(): string
    {
        return match ($this) {
            self::ViewDashboard => 'View dashboard',
            self::ViewPermissions => 'View permissions',
            self::CreatePermissions => 'Create permissions',
            self::EditPermissions => 'Edit permissions',
            self::DeletePermissions => 'Delete permissions',
            self::ViewRoles => 'View roles',
            self::CreateRoles => 'Create roles',
            self::EditRoles => 'Edit roles',
            self::DeleteRoles => 'Delete roles',
            self::ViewUsers => 'View users',
            self::CreateUsers => 'Create users',
            self::EditUsers => 'Edit users',
            self::DeleteUsers => 'Delete users',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
