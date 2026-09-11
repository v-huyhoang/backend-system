<?php

namespace App\Providers;

use App\Domain\Rental\Contracts\PublicListingRepository;
use App\Infrastructure\Persistence\Rental\EloquentPublicListingRepository;
use Illuminate\Support\ServiceProvider;

class RentalServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            PublicListingRepository::class,
            EloquentPublicListingRepository::class,
        );
    }
}
