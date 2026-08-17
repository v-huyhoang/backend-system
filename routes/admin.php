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

Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', fn () => to_route('dashboard'))->name('admin.index');

    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard')->can(SystemPermission::ViewDashboard->value);

    Route::prefix('permissions')->name('permissions.')->group(function () {
        Route::get('/', [PermissionController::class, 'index'])->name('index')->can('viewAny', Permission::class);
        Route::post('/', [PermissionController::class, 'store'])->name('store')->can('create', Permission::class);
        Route::put('/{permission}', [PermissionController::class, 'update'])->name('update')->can('update', 'permission');
        Route::delete('/{permission}', [PermissionController::class, 'destroy'])->name('destroy')->can('delete', 'permission');
    });

    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index')->can('viewAny', Role::class);
        Route::post('/', [RoleController::class, 'store'])->name('store')->can('create', Role::class);
        Route::get('/create', [RoleController::class, 'create'])->name('create')->can('create', Role::class);
        Route::get('/{role}', [RoleController::class, 'show'])->name('show')->can('view', 'role');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('edit')->can('update', 'role');
        Route::put('/{role}', [RoleController::class, 'update'])->name('update')->can('update', 'role');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy')->can('delete', 'role');
    });

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index')->can('viewAny', User::class);
        Route::post('/', [UserController::class, 'store'])->name('store')->can('create', User::class);
        Route::get('/create', [UserController::class, 'create'])->name('create')->can('create', User::class);
        Route::get('/{user}', [UserController::class, 'show'])->name('show')->can('view', 'user');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit')->can('update', 'user');
        Route::put('/{user}', [UserController::class, 'update'])->name('update')->can('update', 'user');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy')->can('delete', 'user');
    });

    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index')->can('viewAny', Category::class);
        Route::post('/', [CategoryController::class, 'store'])->name('store')->can('create', Category::class);
        Route::get('/create', [CategoryController::class, 'create'])->name('create')->can('create', Category::class);
        Route::get('/{category}', [CategoryController::class, 'show'])->name('show')->can('view', 'category');
        Route::get('/{category}/edit', [CategoryController::class, 'edit'])->name('edit')->can('update', 'category');
        Route::put('/{category}', [CategoryController::class, 'update'])->name('update')->can('update', 'category');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy')->can('delete', 'category');
    });
});
