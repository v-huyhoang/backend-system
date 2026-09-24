<?php

namespace App\Infrastructure\Persistence\Rental;

use App\Domain\Rental\Contracts\PublicListingRepository;
use App\Domain\Rental\Models\Listing;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class EloquentPublicListingRepository implements PublicListingRepository
{
    public function paginate(
        array $filters,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return $this->query($filters)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findByPublicId(string $publicId): ?Listing
    {
        return $this->baseQuery()
            ->where('public_id', $publicId)
            ->first();
    }

    public function latest(int $limit = 6): Collection
    {
        return $this->baseQuery()
            ->latest('published_at')
            ->limit($limit)
            ->get();
    }

    public function incrementView(Listing $listing): void
    {
        $this->baseQuery()->whereKey($listing)->increment('view_count');
    }

    public function incrementContact(Listing $listing): void
    {
        $this->baseQuery()->whereKey($listing)->increment('contact_count');
    }

    /** @return Builder<Listing> */
    private function query(array $filters): Builder
    {
        $query = $this->baseQuery()
            ->when(
                $filters['location_keyword'] ?? null,
                fn (Builder $listingQuery, string $keyword) => $listingQuery->where(
                    fn (Builder $locationQuery) => $locationQuery
                        ->whereHas(
                            'ward',
                            fn (Builder $wardQuery) => $wardQuery->where('name', 'like', "%{$keyword}%"),
                        )
                        ->orWhereHas(
                            'ward.province',
                            fn (Builder $provinceQuery) => $provinceQuery->where('name', 'like', "%{$keyword}%"),
                        ),
                ),
            )
            ->when(
                $filters['province_slug'] ?? null,
                fn (Builder $listingQuery, string $provinceSlug) => $listingQuery->whereHas(
                    'ward.province',
                    fn (Builder $provinceQuery) => $provinceQuery->where('slug', $provinceSlug),
                ),
            )
            ->when(
                $filters['ward_slug'] ?? null,
                fn (Builder $listingQuery, string $wardSlug) => $listingQuery->whereHas(
                    'ward',
                    fn (Builder $wardQuery) => $wardQuery->where('slug', $wardSlug),
                ),
            )
            ->when(
                $filters['property_type_slug'] ?? null,
                fn (Builder $listingQuery, string $propertyTypeSlug) => $listingQuery->whereHas(
                    'propertyType',
                    fn (Builder $propertyTypeQuery) => $propertyTypeQuery->where('slug', $propertyTypeSlug),
                ),
            )
            ->when(
                $filters['min_price'] ?? null,
                fn (Builder $listingQuery, int $minPrice) => $listingQuery->where(
                    'monthly_rent',
                    '>=',
                    $minPrice,
                ),
            )
            ->when(
                $filters['max_price'] ?? null,
                fn (Builder $listingQuery, int $maxPrice) => $listingQuery->where(
                    'monthly_rent',
                    '<=',
                    $maxPrice,
                ),
            )
            ->when(
                $filters['min_area'] ?? null,
                fn (Builder $listingQuery, float $minArea) => $listingQuery->where(
                    'area_sqm',
                    '>=',
                    $minArea,
                ),
            )
            ->when(
                $filters['max_area'] ?? null,
                fn (Builder $listingQuery, float $maxArea) => $listingQuery->where(
                    'area_sqm',
                    '<=',
                    $maxArea,
                ),
            );

        foreach ($filters['amenity_slugs'] ?? [] as $amenitySlug) {
            $query->whereHas(
                'amenities',
                fn (Builder $amenityQuery) => $amenityQuery->where('slug', $amenitySlug),
            );
        }

        return match ($filters['sort'] ?? 'newest') {
            'price_asc' => $query->orderBy('monthly_rent'),
            'price_desc' => $query->orderByDesc('monthly_rent'),
            'area_desc' => $query->orderByDesc('area_sqm'),
            default => $query->latest('published_at'),
        };
    }

    /** @return Builder<Listing> */
    private function baseQuery(): Builder
    {
        return Listing::query()
            ->publiclyVisible()
            ->with([
                'amenities:id,name,slug,icon',
                'primaryImage:id,listing_id,path,alt_text,is_primary',
                'propertyType:id,name,slug',
                'ward.province:id,name,slug',
                'ward:id,province_id,name,slug,type',
            ]);
    }
}
