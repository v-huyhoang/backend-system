<?php

namespace App\Application\Rental;

use App\Domain\Rental\Contracts\LandlordListingRepository;
use App\Domain\Rental\Enums\ListingStatus;
use App\Notifications\ListingExpiredNotification;

final class ListingExpirationService
{
    public function __construct(private readonly LandlordListingRepository $listings) {}

    public function expireDueListings(): int
    {
        $listings = $this->listings->dueForExpiration();

        foreach ($listings as $listing) {
            $this->listings->transition($listing, ListingStatus::Expired);
            $listing->landlord->notify(new ListingExpiredNotification($listing));
        }

        return $listings->count();
    }
}
