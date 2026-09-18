<?php

namespace App\Domain\Rental\Contracts;

use App\Domain\Rental\Models\Listing;

interface LandlordListingRepository
{
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
