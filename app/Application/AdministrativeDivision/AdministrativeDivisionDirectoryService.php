<?php

namespace App\Application\AdministrativeDivision;

use App\Domain\AdministrativeDivision\Contracts\AdministrativeDivisionRepository;
use App\Domain\AdministrativeDivision\Models\Province;
use Illuminate\Support\Collection;

class AdministrativeDivisionDirectoryService
{
    public function __construct(private readonly AdministrativeDivisionRepository $divisions) {}

    /** @return Collection<int, array{label: string, slug: string}> */
    public function activeProvinceOptions(): Collection
    {
        return $this->divisions->activeProvinceOptions();
    }

    /** @return Collection<int, array{label: string, url: string, type: string}> */
    public function searchActiveLocations(string $query): Collection
    {
        return $this->divisions->searchActiveLocations($query);
    }

    /** @return Collection<int, array{label: string, url: string, type: string}> */
    public function activeWardSuggestionsForProvince(Province $province): Collection
    {
        return $this->divisions->activeWardSuggestionsForProvince($province);
    }
}
