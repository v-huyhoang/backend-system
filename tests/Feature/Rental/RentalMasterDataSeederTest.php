<?php

namespace Tests\Feature\Rental;

use App\Infrastructure\Persistence\Rental\Cache\RentalMasterDataCache;
use App\Infrastructure\Persistence\Rental\EloquentRentalMasterDataRepository;
use Database\Seeders\RentalMasterDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class RentalMasterDataSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_forgets_rental_master_data_cache_after_seeding(): void
    {
        Cache::put(RentalMasterDataCache::PROPERTY_TYPES_KEY, collect());
        Cache::put(RentalMasterDataCache::AMENITIES_KEY, collect());
        Cache::put(RentalMasterDataCache::COST_TYPES_KEY, collect());

        $this->seed(RentalMasterDataSeeder::class);

        $this->assertFalse(Cache::has(RentalMasterDataCache::PROPERTY_TYPES_KEY));
        $this->assertFalse(Cache::has(RentalMasterDataCache::AMENITIES_KEY));
        $this->assertFalse(Cache::has(RentalMasterDataCache::COST_TYPES_KEY));
    }

    public function test_it_seeds_the_fields_needed_by_rental_master_data_controls(): void
    {
        $this->seed(RentalMasterDataSeeder::class);

        $repository = app(EloquentRentalMasterDataRepository::class);

        $this->assertSame(
            'snowflake',
            $repository->getAmenities()->firstWhere('slug', 'may-lanh')->icon,
        );
        $this->assertSame(
            'đ/kWh',
            $repository->getCostTypes()->firstWhere('slug', 'dien')->unit,
        );
    }
}
