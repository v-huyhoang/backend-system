<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('user/welcome/index');
})->name('home');

Route::get('/phong-tro', function (Request $request) {
    return Inertia::render('user/listings/index', [
        'filters' => [
            'location' => $request->string('location')->trim()->toString(),
        ],
    ]);
})->name('listings.index');

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
