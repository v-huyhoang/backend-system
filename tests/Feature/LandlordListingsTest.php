<?php

namespace Tests\Feature;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\AdministrativeDivision\Models\Ward;
use App\Domain\Rental\Enums\ListingStatus;
use App\Domain\Rental\Models\Amenity;
use App\Domain\Rental\Models\Listing;
use App\Domain\Rental\Models\ListingCostType;
use App\Domain\Rental\Models\PropertyType;
use App\Domain\UserManagement\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class LandlordListingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_authenticated_user_can_view_their_listing_management_page(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('landlord.listings.index'))
            ->assertInertia(fn (Assert $page) => $page->component('landlord/listings/index'));
    }

    public function test_landlord_listing_management_uses_owned_paginated_data_and_status_filter(): void
    {
        $landlord = User::factory()->create();
        $publishedListings = Listing::factory()
            ->count(11)
            ->for($landlord, 'landlord')
            ->published()
            ->create();
        $draftListing = Listing::factory()
            ->for($landlord, 'landlord')
            ->create(['status' => ListingStatus::Draft]);
        Listing::factory()->published()->create();

        $this->actingAs($landlord)
            ->get(route('landlord.listings.index', ['status' => ListingStatus::Published->value]))
            ->assertInertia(fn (Assert $page) => $page
                ->component('landlord/listings/index')
                ->where('filters.status', ListingStatus::Published->value)
                ->where('listings.total', 11)
                ->has('listings.data', 10)
                ->where('summary.published', 11)
                ->where('summary.status_counts.'.ListingStatus::Draft->value, 1)
                ->missing('listings.data.0.contact_phone')
                ->where('listings.data.0.status', ListingStatus::Published->value)
                ->where('listings.data.0.public_id', fn (string $publicId) => $publishedListings->pluck('public_id')->contains($publicId))
            );

        $this->assertDatabaseHas('listings', [
            'id' => $draftListing->id,
            'landlord_id' => $landlord->id,
        ]);
    }

    public function test_landlord_listing_management_rejects_an_invalid_status_filter(): void
    {
        $landlord = User::factory()->create();

        $this->actingAs($landlord)
            ->from(route('landlord.listings.index'))
            ->get(route('landlord.listings.index', ['status' => 'invalid']))
            ->assertRedirect(route('landlord.listings.index'))
            ->assertSessionHasErrors('status');
    }

    public function test_landlord_root_redirects_to_listing_management(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('landlord.index'))
            ->assertRedirect(route('landlord.listings.index'));
    }

    public function test_an_authenticated_landlord_can_create_a_draft_listing(): void
    {
        Storage::fake('public');
        $landlord = User::factory()->create();
        $propertyType = PropertyType::factory()->create();
        $ward = Ward::factory()->create();
        $amenity = Amenity::factory()->create();
        ListingCostType::query()->create([
            'name' => 'Điện',
            'slug' => 'electricity',
            'unit' => 'kWh',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $this->actingAs($landlord)
            ->post(route('landlord.listings.store'), [
                'property_type_id' => $propertyType->id,
                'ward_id' => $ward->id,
                'title' => 'Phòng gác lửng gần trường',
                'description' => 'Phòng sạch, có gác lửng và cửa sổ thoáng.',
                'address_detail' => '12/4 Đường Nguyễn Văn Cừ',
                'monthly_rent' => 3_200_000,
                'deposit_amount' => 1_000_000,
                'area_sqm' => 24,
                'max_occupants' => 2,
                'available_from' => '2026-10-01',
                'contact_name' => 'Nguyễn Thị Mai',
                'contact_phone' => '0918234421',
                'amenity_ids' => [$amenity->id],
                'costs' => [[
                    'type' => 'electricity',
                    'label' => 'Client label',
                    'amount' => 3_500,
                    'unit' => 'Client unit',
                    'note' => 'Chốt số điện vào cuối tháng.',
                ]],
                'images' => [
                    UploadedFile::fake()->createWithContent('room-1.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9WAAAAABJRU5ErkJggg==')),
                    UploadedFile::fake()->createWithContent('room-2.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9WAAAAABJRU5ErkJggg==')),
                    UploadedFile::fake()->createWithContent('room-3.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9WAAAAABJRU5ErkJggg==')),
                ],
            ])
            ->assertRedirect(route('landlord.listings.index'));

        $listing = Listing::query()->sole();

        $this->assertSame($landlord->id, $listing->landlord_id);
        $this->assertSame(ListingStatus::Draft, $listing->status);
        $this->assertSame('2026-10-01', $listing->available_from?->toDateString());
        $this->assertNotEmpty($listing->slug);
        $this->assertTrue($listing->amenities()->whereKey($amenity->id)->exists());
        $this->assertCount(3, $listing->images);
        Storage::disk('public')->assertExists($listing->images->first()->path);
        $this->assertDatabaseHas('listing_costs', [
            'listing_id' => $listing->id,
            'type' => 'electricity',
            'label' => 'Điện',
            'amount' => 3_500,
            'unit' => 'kWh',
            'note' => 'Chốt số điện vào cuối tháng.',
            'sort_order' => 0,
        ]);
    }

    public function test_listing_owner_can_update_a_draft_and_upload_images(): void
    {
        Storage::fake('public');
        $landlord = User::factory()->create();
        $listing = Listing::factory()->for($landlord, 'landlord')->create();
        $propertyType = PropertyType::factory()->create();
        $ward = Ward::factory()->create();

        $this->actingAs($landlord)
            ->put(route('landlord.listings.update', $listing->public_id), [
                'property_type_id' => $propertyType->id,
                'ward_id' => $ward->id,
                'title' => 'Bản nháp đã cập nhật',
                'description' => 'Nội dung đã được cập nhật.',
                'address_detail' => '25 Đường Mới',
                'monthly_rent' => 4_200_000,
                'area_sqm' => 28,
                'max_occupants' => 2,
                'contact_name' => 'Nguyễn Văn A',
                'contact_phone' => '0900000000',
                'images' => [UploadedFile::fake()->createWithContent(
                    'room.png',
                    base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9WAAAAABJRU5ErkJggg=='),
                )],
            ])
            ->assertRedirect(route('landlord.listings.edit', $listing->public_id));

        $this->assertDatabaseHas('listings', ['id' => $listing->id, 'title' => 'Bản nháp đã cập nhật']);
        $imagePath = $listing->images()->sole()->path;
        Storage::disk('public')->assertExists($imagePath);
    }

    public function test_listing_owner_can_submit_a_draft_for_review(): void
    {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner, 'landlord')->create();

        $this->actingAs($owner)
            ->post(route('landlord.listings.submit', $listing->public_id))
            ->assertRedirect(route('landlord.listings.index'));

        $this->assertDatabaseHas('listings', [
            'id' => $listing->id,
            'status' => ListingStatus::PendingReview->value,
            'rejection_reason' => null,
        ]);
    }

    public function test_only_a_reviewer_can_approve_or_reject_a_pending_listing(): void
    {
        $listing = Listing::factory()->create(['status' => ListingStatus::PendingReview]);
        $reviewer = User::factory()->create();
        $permission = Permission::create([
            'name' => SystemPermission::ReviewListings->value,
            'guard_name' => 'web',
        ]);
        $reviewer->givePermissionTo($permission);

        $this->actingAs(User::factory()->create())
            ->post(route('admin.listings.approve', $listing->public_id))
            ->assertForbidden();

        $this->actingAs($reviewer)
            ->post(route('admin.listings.approve', $listing->public_id))
            ->assertRedirect();
        $this->assertDatabaseHas('listings', ['id' => $listing->id, 'status' => ListingStatus::Published->value]);
        $this->assertDatabaseHas('listing_moderations', [
            'listing_id' => $listing->id,
            'moderator_id' => $reviewer->id,
            'from_status' => ListingStatus::PendingReview->value,
            'to_status' => ListingStatus::Published->value,
            'reason' => null,
        ]);

        $pendingListing = Listing::factory()->create(['status' => ListingStatus::PendingReview]);
        $this->actingAs($reviewer)
            ->post(route('admin.listings.reject', $pendingListing->public_id), ['reason' => 'Vui lòng bổ sung ảnh nhà vệ sinh.'])
            ->assertRedirect();
        $this->assertDatabaseHas('listings', ['id' => $pendingListing->id, 'status' => ListingStatus::Rejected->value, 'rejection_reason' => 'Vui lòng bổ sung ảnh nhà vệ sinh.']);
        $this->assertDatabaseHas('listing_moderations', [
            'listing_id' => $pendingListing->id,
            'moderator_id' => $reviewer->id,
            'from_status' => ListingStatus::PendingReview->value,
            'to_status' => ListingStatus::Rejected->value,
            'reason' => 'Vui lòng bổ sung ảnh nhà vệ sinh.',
        ]);
    }

    public function test_admin_dashboard_shows_pending_listings_and_recent_moderation_activity(): void
    {
        $admin = User::factory()->create();
        $admin->givePermissionTo(Permission::create([
            'name' => SystemPermission::ViewListingModeration->value,
            'guard_name' => 'web',
        ]));
        $pendingListing = Listing::factory()->create([
            'status' => ListingStatus::PendingReview,
            'submitted_at' => now()->subHour(),
        ]);
        $reviewedListing = Listing::factory()->create(['status' => ListingStatus::Published]);
        $reviewedListing->moderations()->create([
            'moderator_id' => $admin->id,
            'from_status' => ListingStatus::PendingReview->value,
            'to_status' => ListingStatus::Published->value,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/dashboard')
                ->where('canReview', false)
                ->where('pendingListings.total', 1)
                ->where('pendingListings.data.0.public_id', $pendingListing->public_id)
                ->where('recentActivity.data.0.listing.public_id', $reviewedListing->public_id)
                ->where('recentActivity.data.0.moderator_name', $admin->name)
            );
    }

    public function test_user_with_moderation_view_permission_can_view_listing_details_without_review_permission(): void
    {
        $viewer = User::factory()->create();
        $viewer->givePermissionTo(Permission::create([
            'name' => SystemPermission::ViewListingModeration->value,
            'guard_name' => 'web',
        ]));
        $listing = Listing::factory()->create(['status' => ListingStatus::PendingReview]);

        $this->actingAs(User::factory()->create())
            ->get(route('admin.listings.show', $listing->public_id))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->get(route('admin.listings.show', $listing->public_id))
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/listings/show')
                ->where('listing.public_id', $listing->public_id)
                ->where('listing.title', $listing->title)
                ->where('canReview', false)
            );
    }

    public function test_listing_owner_can_manage_published_and_expired_listing_lifecycle(): void
    {
        $owner = User::factory()->create();
        $publishedListing = Listing::factory()->for($owner, 'landlord')->published()->create();

        $this->actingAs($owner)->post(route('landlord.listings.hide', $publishedListing->public_id))->assertRedirect();
        $this->assertDatabaseHas('listings', ['id' => $publishedListing->id, 'status' => ListingStatus::Hidden->value]);

        $rentedListing = Listing::factory()->for($owner, 'landlord')->published()->create();
        $this->actingAs($owner)->post(route('landlord.listings.rented', $rentedListing->public_id))->assertRedirect();
        $this->assertDatabaseHas('listings', ['id' => $rentedListing->id, 'status' => ListingStatus::Rented->value]);

        $expiredListing = Listing::factory()
            ->for($owner, 'landlord')
            ->expired()
            ->create(['status' => ListingStatus::Expired]);
        $this->actingAs($owner)->post(route('landlord.listings.renew', $expiredListing->public_id))->assertRedirect();
        $this->assertDatabaseHas('listings', ['id' => $expiredListing->id, 'status' => ListingStatus::PendingReview->value]);

        $this->actingAs($owner)->post(route('landlord.listings.duplicate', $rentedListing->public_id))->assertRedirect();
        $this->assertDatabaseHas('listings', ['landlord_id' => $owner->id, 'status' => ListingStatus::Draft->value, 'title' => $rentedListing->title]);
    }

    public function test_guests_are_redirected_from_landlord_listing_routes(): void
    {
        $listing = Listing::factory()->create();
        $editUrl = route('landlord.listings.edit', ['listing' => $listing->public_id]);
        $updateUrl = route('landlord.listings.update', ['listing' => $listing->public_id]);

        $this->get(route('landlord.listings.index'))->assertRedirect(route('login'));
        $this->get(route('landlord.listings.create'))->assertRedirect(route('login'));
        $this->post(route('landlord.listings.store'))->assertRedirect(route('login'));
        $this->get($editUrl)->assertRedirect(route('login'));
        $this->put($updateUrl)->assertRedirect(route('login'));
    }

    public function test_listing_owner_is_authorized_to_update_their_listing(): void
    {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner, 'landlord')->create();

        $this->assertTrue($owner->can('update', $listing));
    }

    public function test_other_users_cannot_access_another_landlords_listing_edit_or_update_routes(): void
    {
        $listing = Listing::factory()->create();
        $otherUser = User::factory()->create();
        $editUrl = route('landlord.listings.edit', ['listing' => $listing->public_id]);
        $updateUrl = route('landlord.listings.update', ['listing' => $listing->public_id]);

        $this->actingAs($otherUser)->get($editUrl)->assertForbidden();
        $this->actingAs($otherUser)->put($updateUrl)->assertForbidden();
    }

    public function test_shared_auth_data_exposes_landlord_and_admin_capabilities(): void
    {
        $user = User::factory()->create();
        Listing::factory()->for($user, 'landlord')->create();
        $permission = Permission::create([
            'name' => SystemPermission::ViewListingModeration->value,
            'guard_name' => 'web',
        ]);
        $user->givePermissionTo($permission);

        $this->actingAs($user)
            ->get(route('home'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.user.hasListings', true)
                ->where('auth.user.canAccessAdmin', true)
            );
    }

    public function test_shared_auth_data_does_not_assign_landlord_or_admin_capabilities_by_default(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('home'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.user.hasListings', false)
                ->where('auth.user.canAccessAdmin', false)
            );
    }
}
