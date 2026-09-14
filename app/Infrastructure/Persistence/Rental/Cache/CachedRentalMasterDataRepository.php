<?php

namespace App\Infrastructure\Persistence\Rental\Cache;

use App\Domain\Rental\Contracts\RentalMasterDataRepository;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Support\Collection;

final class CachedRentalMasterDataRepository implements RentalMasterDataRepository
{
    public function __construct(
        private readonly RentalMasterDataRepository $repository,
        private readonly CacheRepository $cache,
    ) {}

    public function getPropertyTypes(): Collection
    {
        return $this->cache->remember(
            RentalMasterDataCache::PROPERTY_TYPES_KEY,
            now()->addDays(30),
            function (): Collection {
                return $this->repository->getPropertyTypes();
            }
        );
    }

    public function getAmenities(): Collection
    {
        return $this->cache->remember(
            RentalMasterDataCache::AMENITIES_KEY,
            now()->addDays(30),
            function (): Collection {
                return $this->repository->getAmenities();
            }
        );
    }

    public function getCostTypes(): Collection
    {
        return $this->cache->remember(
            RentalMasterDataCache::COST_TYPES_KEY,
            now()->addDays(30),
            function (): Collection {
                return $this->repository->getCostTypes();
            }
        );
    }
}
