<?php

namespace App\Infrastructure\Persistence\Rental;

use App\Domain\Rental\Contracts\RentalMasterDataRepository;
use App\Domain\Rental\Models\Amenity;
use App\Domain\Rental\Models\ListingCostType;
use App\Domain\Rental\Models\PropertyType;
use Illuminate\Support\Collection;

final class EloquentRentalMasterDataRepository implements RentalMasterDataRepository
{
    public function getPropertyTypes(): Collection
    {
        return PropertyType::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug']);
    }

    public function getAmenities(): Collection
    {
        return Amenity::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'icon']);
    }

    public function getCostTypes(): Collection
    {
        return ListingCostType::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'unit']);
    }
}
