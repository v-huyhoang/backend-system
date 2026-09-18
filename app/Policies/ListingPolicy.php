<?php

namespace App\Policies;

use App\Domain\Rental\Models\Listing;
use App\Domain\UserManagement\Models\User;

final class ListingPolicy
{
    public function update(User $actor, Listing $listing): bool
    {
        return $listing->landlord_id === $actor->id;
    }
}
