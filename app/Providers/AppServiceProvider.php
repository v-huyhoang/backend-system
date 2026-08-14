<?php

namespace App\Providers;

use App\Domain\AccessControl\Contracts\PermissionRepository;
use App\Domain\AccessControl\Contracts\RoleRepository;
use App\Domain\UserManagement\Contracts\UserRepository;
use App\Infrastructure\Persistence\AccessControl\EloquentPermissionRepository;
use App\Infrastructure\Persistence\AccessControl\EloquentRoleRepository;
use App\Infrastructure\Persistence\UserManagement\EloquentUserRepository;
use Illuminate\Support\ServiceProvider;

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
        //
    }
}
