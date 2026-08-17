<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/p/{slug}', function (string $slug) {
    abort_unless(in_array($slug, [
        'ke-dan-tuong-khong-can-khoan',
        'hop-dung-day-dien-de-ban',
        'tui-hut-chan-khong-dung-quan-ao',
    ], true), 404);

    return Inertia::render('products/show', ['slug' => $slug]);
})->name('products.show');

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
