<?php

namespace App\Domain\AdministrativeDivision\Contracts;

use App\Domain\AdministrativeDivision\Data\AdministrativeDivisionSnapshot;
use App\Domain\AdministrativeDivision\Models\AdministrativeDivisionImport;
use App\Domain\AdministrativeDivision\Models\Province;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

interface AdministrativeDivisionRepository
{
    public function startImport(string $source, CarbonInterface $startedAt): AdministrativeDivisionImport;

    /** @return array{province_count: int, ward_count: int} */
    public function synchronize(
        AdministrativeDivisionSnapshot $snapshot,
        string $source,
        CarbonInterface $syncedAt,
    ): array;

    /** @param array{province_count: int, ward_count: int} $counts */
    public function completeImport(
        AdministrativeDivisionImport $import,
        array $counts,
        CarbonInterface $finishedAt,
    ): void;

    public function failImport(
        AdministrativeDivisionImport $import,
        string $errorMessage,
        CarbonInterface $finishedAt,
    ): void;

    /** @return Collection<int, array{label: string, slug: string}> */
    public function activeProvinceOptions(): Collection;

    /** @return Collection<int, array{label: string, url: string, type: string}> */
    public function searchActiveLocations(string $query, int $limit = 8): Collection;

    /** @return Collection<int, array{label: string, url: string, type: string}> */
    public function activeWardSuggestionsForProvince(Province $province): Collection;
}
