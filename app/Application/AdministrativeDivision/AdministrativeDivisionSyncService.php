<?php

namespace App\Application\AdministrativeDivision;

use App\Application\AdministrativeDivision\Contracts\AdministrativeDivisionSource;
use App\Domain\AdministrativeDivision\Contracts\AdministrativeDivisionRepository;
use Illuminate\Support\Carbon;
use Throwable;

class AdministrativeDivisionSyncService
{
    private const SOURCE = 'province_open_api_v2';

    public function __construct(
        private readonly AdministrativeDivisionSource $source,
        private readonly AdministrativeDivisionRepository $divisions,
    ) {}

    /** @return array{province_count: int, ward_count: int} */
    public function sync(): array
    {
        $startedAt = Carbon::now();
        $import = $this->divisions->startImport(self::SOURCE, $startedAt);

        try {
            $counts = $this->divisions->synchronize(
                $this->source->fetch(),
                self::SOURCE,
                Carbon::now(),
            );

            $this->divisions->completeImport($import, $counts, Carbon::now());

            return $counts;
        } catch (Throwable $exception) {
            $this->divisions->failImport(
                $import,
                $exception->getMessage(),
                Carbon::now(),
            );

            throw $exception;
        }
    }
}
