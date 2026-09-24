<?php

namespace App\Providers;

use App\Domain\Rental\Contracts\LandlordListingRepository;
use App\Domain\Rental\Contracts\ListingImageStorage;
use App\Domain\Rental\Contracts\PublicListingRepository;
use App\Domain\Rental\Contracts\RentalMasterDataRepository;
use App\Infrastructure\Persistence\Rental\Cache\CachedRentalMasterDataRepository;
use App\Infrastructure\Persistence\Rental\EloquentLandlordListingRepository;
use App\Infrastructure\Persistence\Rental\EloquentPublicListingRepository;
use App\Infrastructure\Persistence\Rental\EloquentRentalMasterDataRepository;
use App\Infrastructure\Persistence\Rental\PublicListingImageStorage;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Support\ServiceProvider;

class RentalServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            LandlordListingRepository::class,
            EloquentLandlordListingRepository::class,
        );
        $this->app->bind(ListingImageStorage::class, PublicListingImageStorage::class);

        $this->app->bind(
            PublicListingRepository::class,
            EloquentPublicListingRepository::class,
        );

        $this->app->bind(
            EloquentRentalMasterDataRepository::class,
        );

        $this->app->bind(
            RentalMasterDataRepository::class,
            function ($app): CachedRentalMasterDataRepository {
                return new CachedRentalMasterDataRepository(
                    $app->make(EloquentRentalMasterDataRepository::class),
                    $app->make(CacheRepository::class),
                );
            },
        );
    }
}
