<?php

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Presentation\Http\Controllers\PermissionController;
use App\Presentation\Http\Controllers\RoleController;
use App\Presentation\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index')->can(SystemPermission::ViewPermissions->value);
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store')->can(SystemPermission::CreatePermissions->value);
    Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update')->can(SystemPermission::EditPermissions->value);
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy')->can(SystemPermission::DeletePermissions->value);

    // Routes prefix
    Route::prefix('roles')->group(function () {
        // Add your roles routes here
        Route::get('/', [RoleController::class, 'index'])->name('roles.index')->can(SystemPermission::ViewRoles->value);
        Route::post('/', [RoleController::class, 'store'])->name('roles.store')->can(SystemPermission::CreateRoles->value);
        Route::get('/create', [RoleController::class, 'create'])->name('roles.create')->can(SystemPermission::CreateRoles->value);
        Route::get('/{role}', [RoleController::class, 'show'])->name('roles.show')->can(SystemPermission::ViewRoles->value);
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit')->can(SystemPermission::EditRoles->value);
        Route::put('/{role}', [RoleController::class, 'update'])->name('roles.update')->can(SystemPermission::EditRoles->value);
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('roles.destroy')->can(SystemPermission::DeleteRoles->value);
        // Add your settings routes here
    });

    Route::prefix('users')->group(function () {
        // Add your users routes here
        Route::get('/', [UserController::class, 'index'])->name('users.index')->can(SystemPermission::ViewUsers->value);
        Route::post('/', [UserController::class, 'store'])->name('users.store')->can(SystemPermission::CreateUsers->value);
        Route::get('/create', [UserController::class, 'create'])->name('users.create')->can(SystemPermission::CreateUsers->value);
        Route::get('/{user}', [UserController::class, 'show'])->name('users.show')->can(SystemPermission::ViewUsers->value);
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('users.edit')->can(SystemPermission::EditUsers->value);
        Route::put('/{user}', [UserController::class, 'update'])->name('users.update')->can(SystemPermission::EditUsers->value);
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy')->can(SystemPermission::DeleteUsers->value);
        // Add your settings routes here
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
