<?php

use App\Presentation\Http\Controllers\PublicListingController;
use App\Presentation\Http\Controllers\LocationSuggestionController;
use App\Presentation\Http\Controllers\WelcomeController;
use App\Presentation\Http\Controllers\LandlordListingController;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class)->name('home');
Route::get('/api/dia-chi/goi-y', [LocationSuggestionController::class, 'index'])
    ->middleware('throttle:60,1')
    ->name('locations.suggestions');
Route::get('/api/tinh-thanh', [LocationSuggestionController::class, 'provinces'])
    ->middleware('throttle:60,1')
    ->name('locations.provinces');
Route::get('/api/tinh-thanh/{province:slug}/phuong-xa', [LocationSuggestionController::class, 'wards'])
    ->middleware('throttle:60,1')
    ->name('locations.wards');

Route::get('/phong-tro', [PublicListingController::class, 'index'])
    ->name('listings.index');
Route::get('/phong-tro/tinh-thanh/{province:slug}', [PublicListingController::class, 'index'])
    ->name('listings.province');
Route::get('/phong-tro/tinh-thanh/{province:slug}/phuong-xa/{ward:slug}', [PublicListingController::class, 'index'])
    ->name('listings.ward');
Route::get('/chu-tro/tin-dang', LandlordListingController::class)
    ->middleware('auth')
    ->name('landlord.listings.index');
Route::get('/chu-tro/tin-dang/tao-moi', [LandlordListingController::class, 'create'])
    ->middleware('auth')
    ->name('landlord.listings.create');

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
