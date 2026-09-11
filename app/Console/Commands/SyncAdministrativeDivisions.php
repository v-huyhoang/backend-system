<?php

namespace App\Console\Commands;

use App\Application\AdministrativeDivision\AdministrativeDivisionSyncService;
use Illuminate\Console\Command;
use Throwable;

class SyncAdministrativeDivisions extends Command
{
    protected $signature = 'app:sync-administrative-divisions';

    protected $description = 'Synchronize Vietnamese provinces and wards from Province Open API v2';

    public function handle(AdministrativeDivisionSyncService $service): int
    {
        $this->components->info('Synchronizing administrative divisions...');

        try {
            $counts = $service->sync();
        } catch (Throwable $exception) {
            report($exception);
            $this->components->error("Synchronization failed: {$exception->getMessage()}");

            return self::FAILURE;
        }

        $this->components->info(
            "Synchronized {$counts['province_count']} provinces and {$counts['ward_count']} wards.",
        );

        return self::SUCCESS;
    }
}
