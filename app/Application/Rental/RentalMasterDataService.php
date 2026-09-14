<?php

namespace App\Application\Rental;

use App\Domain\Rental\Contracts\RentalMasterDataRepository;
use Illuminate\Support\Collection;

final class RentalMasterDataService
{
    public function __construct(
        private readonly RentalMasterDataRepository $data,
    ) {}

    public function propertyTypes(): Collection
    {
        return $this->data->getPropertyTypes();
    }

    public function amenities(): Collection
    {
        return $this->data->getAmenities();
    }

    public function costTypes(): Collection
    {
        return $this->data->getCostTypes();
    }
}
