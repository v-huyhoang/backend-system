<?php

namespace App\Domain\Rental\Contracts;

use Illuminate\Support\Collection;

interface RentalMasterDataRepository
{
    public function getPropertyTypes(): Collection;

    public function getAmenities(): Collection;

    public function getCostTypes(): Collection;
}
