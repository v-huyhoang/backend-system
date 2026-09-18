<?php

use App\Presentation\Http\Controllers\PublicListingController;
use App\Presentation\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class)->name('home');
Route::prefix('phong-tro')->group(function () {
    Route::get('/', [PublicListingController::class, 'index'])
        ->name('listings.index');
    Route::get('/tinh-thanh/{province:slug}', [PublicListingController::class, 'index'])
        ->name('listings.province');
    Route::get('/tinh-thanh/{province:slug}/phuong-xa/{ward:slug}', [PublicListingController::class, 'index'])
        ->name('listings.ward');
});

require __DIR__.'/admin.php';
require __DIR__.'/landlord.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
