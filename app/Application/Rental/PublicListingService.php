<?php

namespace App\Application\Rental;

use App\Application\Rental\DTOs\PublicListingFilters;
use App\Domain\Rental\Contracts\PublicListingRepository;
use App\Domain\Rental\Models\Listing;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PublicListingService
{
    public function __construct(private readonly PublicListingRepository $listings) {}

    public function paginate(
        PublicListingFilters $filters,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return $this->listings->paginate($filters->toArray(), $perPage);
    }

    public function findByPublicId(string $publicId): ?Listing
    {
        return $this->listings->findByPublicId($publicId);
    }

    /** @return Collection<int, Listing> */
    public function latest(int $limit = 6): Collection
    {
        return $this->listings->latest($limit);
    }
}
