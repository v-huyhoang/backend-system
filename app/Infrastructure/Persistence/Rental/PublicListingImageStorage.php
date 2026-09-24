<?php

namespace App\Infrastructure\Persistence\Rental;

use App\Domain\Rental\Contracts\ListingImageStorage;
use Illuminate\Http\UploadedFile;

final class PublicListingImageStorage implements ListingImageStorage
{
    public function store(int $listingId, UploadedFile $image): string
    {
        return $image->store("listings/{$listingId}", 'public');
    }
}
