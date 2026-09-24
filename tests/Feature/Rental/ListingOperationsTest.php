<?php

namespace Tests\Feature\Rental;

use App\Domain\Rental\Enums\ListingStatus;
use App\Domain\Rental\Models\Listing;
use App\Domain\UserManagement\Models\User;
use App\Notifications\ListingExpiredNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ListingOperationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_expiration_command_expires_due_published_listings_and_notifies_landlord(): void
    {
        Notification::fake();
        $landlord = User::factory()->create();
        $listing = Listing::factory()->for($landlord, 'landlord')->published()->create([
            'expires_at' => now()->subMinute(),
        ]);

        $this->artisan('listings:expire')->assertExitCode(0);

        $this->assertDatabaseHas('listings', [
            'id' => $listing->id,
            'status' => ListingStatus::Expired->value,
        ]);
        Notification::assertSentTo($landlord, ListingExpiredNotification::class);
    }

    public function test_public_listing_analytics_increment_only_visible_listing_counters(): void
    {
        $listing = Listing::factory()->published()->create();
        $hiddenListing = Listing::factory()->create(['status' => ListingStatus::Hidden]);

        $this->post(route('listings.analytics.view', $listing->public_id))->assertNoContent();
        $this->post(route('listings.analytics.contact', $listing->public_id))->assertNoContent();
        $this->post(route('listings.analytics.view', $hiddenListing->public_id))->assertNoContent();

        $this->assertDatabaseHas('listings', [
            'id' => $listing->id,
            'view_count' => 1,
            'contact_count' => 1,
        ]);
        $this->assertDatabaseHas('listings', [
            'id' => $hiddenListing->id,
            'view_count' => 0,
        ]);
    }
}
