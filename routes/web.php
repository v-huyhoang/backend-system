<?php

use App\Presentation\Http\Controllers\PublicListingController;
use App\Presentation\Http\Controllers\WelcomeController;
use App\Presentation\Http\Controllers\LandlordListingController;
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

Route::prefix('chu-tro/tin-dang')->middleware('auth')->group(function () {
    Route::get('/', [LandlordListingController::class, 'index'])
        ->name('landlord.listings.index');
    Route::get('/tao-moi', [LandlordListingController::class, 'create'])
        ->name('landlord.listings.create');
	Route::post('/tao-moi', [LandlordListingController::class, 'store'])
		->name('landlord.listings.store');
	Route::get('/{listing:uuid}/chinh-sua', [LandlordListingController::class, 'edit'])
		->name('landlord.listings.edit');
	Route::put('/{listing:uuid}/chinh-sua', [LandlordListingController::class, 'update'])
		->name('landlord.listings.update');
});

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
