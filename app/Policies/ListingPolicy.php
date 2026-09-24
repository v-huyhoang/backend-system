<?php

namespace App\Policies;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\Rental\Enums\ListingStatus;
use App\Domain\Rental\Models\Listing;
use App\Domain\UserManagement\Models\User;

final class ListingPolicy
{
    public function update(User $actor, Listing $listing): bool
    {
        return $listing->landlord_id === $actor->id
            && $listing->status === ListingStatus::Draft;
    }

    public function submit(User $actor, Listing $listing): bool
    {
        return $this->update($actor, $listing);
    }

    public function review(User $actor, Listing $listing): bool
    {
        return $actor->can(SystemPermission::ReviewListings->value)
            && $listing->status === ListingStatus::PendingReview;
    }

    public function hide(User $actor, Listing $listing): bool
    {
        return $listing->landlord_id === $actor->id
            && $listing->status === ListingStatus::Published;
    }

    public function markAsRented(User $actor, Listing $listing): bool
    {
        return $this->hide($actor, $listing);
    }

    public function renew(User $actor, Listing $listing): bool
    {
        return $listing->landlord_id === $actor->id
            && $listing->status === ListingStatus::Expired;
    }

    public function duplicate(User $actor, Listing $listing): bool
    {
        return $listing->landlord_id === $actor->id;
    }
}
