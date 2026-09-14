<?php

namespace App\Infrastructure\Persistence\Rental\Cache;

use Illuminate\Contracts\Cache\Repository as CacheRepository;

final class RentalMasterDataCache
{
    public const PROPERTY_TYPES_KEY = 'rental:master-data:property-types:v2';

    public const AMENITIES_KEY = 'rental:master-data:amenities:v2';

    public const COST_TYPES_KEY = 'rental:master-data:cost-types:v2';

    public static function forget(CacheRepository $cache): void
    {
        $cache->forget(self::PROPERTY_TYPES_KEY);
        $cache->forget(self::AMENITIES_KEY);
        $cache->forget(self::COST_TYPES_KEY);
    }
}
