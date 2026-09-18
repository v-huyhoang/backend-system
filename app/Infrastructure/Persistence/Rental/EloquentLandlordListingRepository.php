<?php

namespace App\Infrastructure\Persistence\Rental;

use App\Domain\Rental\Contracts\LandlordListingRepository;
use App\Domain\Rental\Enums\ListingStatus;
use App\Domain\Rental\Models\Listing;
use Illuminate\Support\Facades\DB;

final class EloquentLandlordListingRepository implements LandlordListingRepository
{
    public function create(
        int $landlordId,
        array $listingAttributes,
        array $amenityIds,
        array $costs,
    ): Listing {
        return DB::transaction(function () use (
            $landlordId,
            $listingAttributes,
            $amenityIds,
            $costs,
        ): Listing {
            $listing = Listing::query()->create([
                ...$listingAttributes,
                'landlord_id' => $landlordId,
                'status' => ListingStatus::Draft,
            ]);

            $listing->amenities()->sync($amenityIds);
            $listing->costs()->createMany($costs);

            return $listing;
        });
    }
}
