<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicListingsTest extends TestCase
{
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
        $response = $this->get(route('listings.index', ['location' => 'Hà Nội']));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('user/listings/index')
            ->where('filters.location', 'Hà Nội')
        );
    }
}
