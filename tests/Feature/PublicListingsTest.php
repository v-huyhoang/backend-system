<?php

namespace Tests\Feature;

use App\Domain\AdministrativeDivision\Models\Province;
use App\Domain\AdministrativeDivision\Models\Ward;
use App\Domain\Rental\Models\Listing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicListingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_listings_page_can_be_rendered(): void
    {
        $response = $this->get(route('listings.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('user/listings/index')
            ->where('filters.location', '')
        );
    }

    public function test_public_listings_page_keeps_the_location_filter(): void
    {
        $response = $this->get(route('listings.index', ['khu-vuc' => 'Hà Nội']));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('user/listings/index')
            ->where('filters.location', 'Hà Nội')
        );
    }

    public function test_public_listings_page_only_includes_published_and_unexpired_listings(): void
    {
        $publishedListing = Listing::factory()->published()->create();
        Listing::factory()->create();
        Listing::factory()->expired()->create();

        $response = $this->get(route('listings.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('user/listings/index')
            ->has('listings.data', 1)
            ->where('listings.data.0.public_id', $publishedListing->public_id)
        );
    }

    public function test_public_listings_page_rejects_an_invalid_price_range(): void
    {
        $response = $this
            ->from(route('listings.index'))
            ->get(route('listings.index', [
                'gia-tu' => 5_000_000,
                'gia-den' => 3_000_000,
            ]));

        $response
            ->assertRedirect(route('listings.index'))
            ->assertSessionHasErrors('gia-tu');
    }

    public function test_province_path_filters_listings_by_the_canonical_vietnamese_url(): void
    {
        $province = Province::factory()->create(['slug' => 'ha-noi']);
        $ward = Ward::factory()->for($province)->create(['slug' => 'phuong-dich-vong']);
        $listing = Listing::factory()->published()->for($ward)->create();
        Listing::factory()->published()->create();

        $response = $this->get(route('listings.province', $province));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('listings.data', 1)
            ->where('listings.data.0.public_id', $listing->public_id)
            ->where('filters.tinh-thanh', 'ha-noi')
            ->where('filters.tinh-thanh-label', $province->name)
        );
    }
}
