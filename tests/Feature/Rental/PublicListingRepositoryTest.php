<?php

namespace Tests\Feature\Rental;

use App\Application\Rental\DTOs\PublicListingFilters;
use App\Application\Rental\PublicListingService;
use App\Domain\AdministrativeDivision\Models\Province;
use App\Domain\AdministrativeDivision\Models\Ward;
use App\Domain\Rental\Models\Amenity;
use App\Domain\Rental\Models\Listing;
use App\Domain\Rental\Models\PropertyType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicListingRepositoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_only_returns_published_and_unexpired_listings_matching_every_filter(): void
    {
        $province = Province::factory()->create(['slug' => 'ho-chi-minh']);
        $ward = Ward::factory()->for($province)->create(['slug' => 'phuong-tan-phong']);
        $propertyType = PropertyType::factory()->create(['slug' => 'can-ho-mini']);
        $wifi = Amenity::factory()->create(['slug' => 'wifi']);
        $airConditioner = Amenity::factory()->create(['slug' => 'may-lanh']);

        $matchingListing = Listing::factory()
            ->published()
            ->for($ward)
            ->for($propertyType)
            ->create(['monthly_rent' => 4_000_000, 'area_sqm' => 25]);
        $matchingListing->amenities()->attach([$wifi->id, $airConditioner->id]);

        Listing::factory()
            ->published()
            ->for($ward)
            ->for($propertyType)
            ->create(['monthly_rent' => 7_000_000, 'area_sqm' => 25]);
        Listing::factory()->expired()->for($ward)->for($propertyType)->create();
        Listing::factory()->for($ward)->for($propertyType)->create();

        $results = app(PublicListingService::class)->paginate(
            new PublicListingFilters(
                provinceSlug: 'ho-chi-minh',
                wardSlug: 'phuong-tan-phong',
                propertyTypeSlug: 'can-ho-mini',
                minPrice: 3_000_000,
                maxPrice: 5_000_000,
                minArea: 20,
                amenitySlugs: ['wifi', 'may-lanh'],
            ),
        );

        $this->assertCount(1, $results);
        $this->assertTrue($results->first()->is($matchingListing));
    }

    public function test_it_finds_only_a_public_listing_by_its_public_id(): void
    {
        $publishedListing = Listing::factory()->published()->create();
        $draftListing = Listing::factory()->create();
        $service = app(PublicListingService::class);

        $this->assertTrue(
            $service->findByPublicId($publishedListing->public_id)?->is($publishedListing),
        );
        $this->assertNull($service->findByPublicId($draftListing->public_id));
    }
}
