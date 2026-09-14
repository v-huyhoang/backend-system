<?php

namespace App\Providers;

use App\Domain\Rental\Contracts\PublicListingRepository;
use App\Domain\Rental\Contracts\RentalMasterDataRepository;
use App\Infrastructure\Persistence\Rental\Cache\CachedRentalMasterDataRepository;
use App\Infrastructure\Persistence\Rental\EloquentPublicListingRepository;
use App\Infrastructure\Persistence\Rental\EloquentRentalMasterDataRepository;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Cache\Repository as CacheRepository;

class RentalServiceProvider extends ServiceProvider
{
	public function register(): void
	{
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
