<?php

use App\Presentation\Http\Controllers\LocationSuggestionController;
use App\Presentation\Http\Controllers\RentalMasterDataController;
use App\Presentation\Http\Controllers\PublicListingAnalyticsController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:60,1')->group(function () {
    Route::post('/listings/{listing:public_id}/view', [PublicListingAnalyticsController::class, 'view'])->name('listings.analytics.view');
    Route::post('/listings/{listing:public_id}/contact', [PublicListingAnalyticsController::class, 'contact'])->name('listings.analytics.contact');
    Route::get('/property-types', [RentalMasterDataController::class, 'propertyTypes'])->name('property-types.index');
    Route::get('/amenities', [RentalMasterDataController::class, 'amenities'])->name('amenities.index');
    Route::get('/listing-cost-types', [RentalMasterDataController::class, 'costTypes'])->name('listing-cost-types.index');
    Route::get('/dia-chi/goi-y', [LocationSuggestionController::class, 'index'])
        ->name('locations.suggestions');
    Route::get('/tinh-thanh', [LocationSuggestionController::class, 'provinces'])
        ->name('locations.provinces');
    Route::get('/tinh-thanh/{province:slug}/phuong-xa', [LocationSuggestionController::class, 'wards'])
        ->name('locations.wards');
});
