<?php

namespace App\Providers;

use App\Domain\AccessControl\Contracts\PermissionRepository;
use App\Domain\AccessControl\Contracts\RoleRepository;
use App\Domain\CategoryManagement\Models\Category;
use App\Domain\UserManagement\Contracts\UserRepository;
use App\Domain\UserManagement\Models\User;
use App\Infrastructure\Persistence\AccessControl\EloquentPermissionRepository;
use App\Infrastructure\Persistence\AccessControl\EloquentRoleRepository;
use App\Infrastructure\Persistence\UserManagement\EloquentUserRepository;
use App\Policies\CategoryPolicy;
use App\Policies\PermissionPolicy;
use App\Policies\RolePolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(RoleRepository::class, EloquentRoleRepository::class);
        $this->app->bind(PermissionRepository::class, EloquentPermissionRepository::class);
        $this->app->bind(UserRepository::class, EloquentUserRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(Permission::class, PermissionPolicy::class);
        Gate::policy(Category::class, CategoryPolicy::class);
    }
}
