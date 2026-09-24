<?php

use App\Presentation\Http\Controllers\LandlordListingController;
use Illuminate\Support\Facades\Route;

Route::prefix('landlord')
    ->name('landlord.')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        Route::redirect('/', '/landlord/listings')->name('index');

        Route::prefix('listings')->name('listings.')->group(function () {
            Route::get('/', [LandlordListingController::class, 'index'])
                ->name('index');
            Route::get('/create', [LandlordListingController::class, 'create'])
                ->name('create');
            Route::post('/', [LandlordListingController::class, 'store'])
                ->name('store');
            Route::get('/{listing:public_id}/edit', [LandlordListingController::class, 'edit'])
                ->can('update', 'listing')
                ->name('edit');
            Route::put('/{listing:public_id}', [LandlordListingController::class, 'update'])
                ->can('update', 'listing')
                ->name('update');
            Route::post('/{listing:public_id}/submit', [LandlordListingController::class, 'submit'])
                ->can('submit', 'listing')
                ->name('submit');
            Route::post('/{listing:public_id}/hide', [LandlordListingController::class, 'hide'])->can('hide', 'listing')->name('hide');
            Route::post('/{listing:public_id}/rented', [LandlordListingController::class, 'markAsRented'])->can('markAsRented', 'listing')->name('rented');
            Route::post('/{listing:public_id}/renew', [LandlordListingController::class, 'renew'])->can('renew', 'listing')->name('renew');
            Route::post('/{listing:public_id}/duplicate', [LandlordListingController::class, 'duplicate'])->can('duplicate', 'listing')->name('duplicate');
        });
    });
