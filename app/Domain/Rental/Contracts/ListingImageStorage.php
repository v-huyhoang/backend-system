<?php

namespace App\Domain\Rental\Contracts;

use Illuminate\Http\UploadedFile;

interface ListingImageStorage
{
    public function store(int $listingId, UploadedFile $image): string;
}
