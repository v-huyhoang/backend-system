<?php

namespace App\Domain\AdministrativeDivision\Contracts;

use App\Domain\AdministrativeDivision\Data\AdministrativeDivisionSnapshot;
use App\Domain\AdministrativeDivision\Models\AdministrativeDivisionImport;
use Carbon\CarbonInterface;

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
}
