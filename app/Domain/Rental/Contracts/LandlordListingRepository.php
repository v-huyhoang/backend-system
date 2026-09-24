<?php

namespace App\Domain\Rental\Contracts;

use App\Domain\Rental\Enums\ListingStatus;
use App\Domain\Rental\Models\Listing;
use App\Domain\Rental\Models\ListingModeration;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface LandlordListingRepository
{
    public function paginateForLandlord(
        int $landlordId,
        ?ListingStatus $status,
        int $perPage = 10,
    ): LengthAwarePaginator;

    /**
     * @return array{published: int, view_count: int, contact_count: int, rejected: int, status_counts: array<string, int>}
     */
    public function summaryForLandlord(int $landlordId): array;

    public function details(Listing $listing): Listing;

    public function moderationDetails(Listing $listing): Listing;

    /** @param array<string, mixed> $attributes */
    public function transition(Listing $listing, ListingStatus $status, array $attributes = []): Listing;

    /** @param list<string> $imagePaths */
    public function addImages(Listing $listing, array $imagePaths): Listing;

    public function duplicate(Listing $listing, string $slug): Listing;

    public function paginatePendingReview(int $perPage = 10): LengthAwarePaginator;

    /** @return Collection<int, ListingModeration> */
    public function recentModerations(int $limit = 10): Collection;

    /** @param array<string, mixed>|null $metadata */
    public function recordModeration(Listing $listing, int $moderatorId, ?ListingStatus $fromStatus, ListingStatus $toStatus, ?string $reason = null, ?array $metadata = null): ListingModeration;

    /** @return Collection<int, Listing> */
    public function dueForExpiration(): Collection;

    /**
     * @param  array<string, int|float|string|null>  $listingAttributes
     * @param  list<int>  $amenityIds
     * @param  list<array{type: string, label: string, amount: int|float|null, unit: string, note: string|null, sort_order: int}>  $costs
     * @param  list<string>  $imagePaths
     */
    public function updateDraft(Listing $listing, array $listingAttributes, array $amenityIds, array $costs, array $imagePaths): Listing;

    /**
     * @param  array<string, int|float|string|null>  $listingAttributes
     * @param  list<int>  $amenityIds
     * @param  list<array{type: string, label: string, amount: int|float|null, unit: string, note: string|null, sort_order: int}>  $costs
     */
    public function create(
        int $landlordId,
        array $listingAttributes,
        array $amenityIds,
        array $costs,
    ): Listing;
}
