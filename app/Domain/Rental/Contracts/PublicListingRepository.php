<?php

namespace App\Domain\Rental\Contracts;

use App\Domain\Rental\Models\Listing;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PublicListingRepository
{
    public function paginate(
        array $filters,
        int $perPage = 15,
    ): LengthAwarePaginator;

    public function findByPublicId(string $publicId): ?Listing;

    /** @return Collection<int, Listing> */
    public function latest(int $limit = 6): Collection;

    public function incrementView(Listing $listing): void;

    public function incrementContact(Listing $listing): void;
}
