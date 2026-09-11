<?php

namespace Tests\Feature;

use App\Domain\UserManagement\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LandlordListingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_authenticated_user_can_view_their_listing_management_page(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('landlord.listings.index'))
            ->assertInertia(fn (Assert $page) => $page->component('user/landlord-listings/index'));
    }
}
