<?php

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\CategoryManagement\Models\Category;
use App\Domain\UserManagement\Models\User;
use App\Presentation\Http\Controllers\CategoryController;
use App\Presentation\Http\Controllers\PermissionController;
use App\Presentation\Http\Controllers\RoleController;
use App\Presentation\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard')->can(SystemPermission::ViewDashboard->value);

    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index')->can('viewAny', Permission::class);
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store')->can('create', Permission::class);
    Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update')->can('update', 'permission');
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy')->can('delete', 'permission');

    // Routes prefix
    Route::prefix('roles')->group(function () {
        // Add your roles routes here
        Route::get('/', [RoleController::class, 'index'])->name('roles.index')->can('viewAny', Role::class);
        Route::post('/', [RoleController::class, 'store'])->name('roles.store')->can('create', Role::class);
        Route::get('/create', [RoleController::class, 'create'])->name('roles.create')->can('create', Role::class);
        Route::get('/{role}', [RoleController::class, 'show'])->name('roles.show')->can('view', 'role');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit')->can('update', 'role');
        Route::put('/{role}', [RoleController::class, 'update'])->name('roles.update')->can('update', 'role');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('roles.destroy')->can('delete', 'role');
        // Add your settings routes here
    });

    Route::prefix('users')->group(function () {
        // Add your users routes here
        Route::get('/', [UserController::class, 'index'])->name('users.index')->can('viewAny', User::class);
        Route::post('/', [UserController::class, 'store'])->name('users.store')->can('create', User::class);
        Route::get('/create', [UserController::class, 'create'])->name('users.create')->can('create', User::class);
        Route::get('/{user}', [UserController::class, 'show'])->name('users.show')->can('view', 'user');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('users.edit')->can('update', 'user');
        Route::put('/{user}', [UserController::class, 'update'])->name('users.update')->can('update', 'user');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy')->can('delete', 'user');
        // Add your settings routes here
    });

    Route::prefix('categories')->group(function () {
        // Add your users routes here
        Route::get('/', [CategoryController::class, 'index'])->name('categories.index')->can('viewAny', Category::class);
        Route::post('/', [CategoryController::class, 'store'])->name('categories.store')->can('create', Category::class);
        Route::get('/create', [CategoryController::class, 'create'])->name('categories.create')->can('create', Category::class);
        Route::get('/{category}', [CategoryController::class, 'show'])->name('categories.show')->can('view', 'category');
        Route::get('/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit')->can('update', 'category');
        Route::put('/{category}', [CategoryController::class, 'update'])->name('categories.update')->can('update', 'category');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy')->can('delete', 'category');
        // Add your settings routes here
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
