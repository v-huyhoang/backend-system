<?php

namespace App\Infrastructure\Persistence\AdministrativeDivision;

use App\Domain\AdministrativeDivision\Contracts\AdministrativeDivisionRepository;
use App\Domain\AdministrativeDivision\Data\AdministrativeDivisionSnapshot;
use App\Domain\AdministrativeDivision\Models\AdministrativeDivisionImport;
use App\Domain\AdministrativeDivision\Models\Province;
use App\Domain\AdministrativeDivision\Models\Ward;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

class EloquentAdministrativeDivisionRepository implements AdministrativeDivisionRepository
{
    public function startImport(
        string $source,
        CarbonInterface $startedAt,
    ): AdministrativeDivisionImport {
        return AdministrativeDivisionImport::create([
            'source' => $source,
            'status' => 'running',
            'started_at' => $startedAt,
        ]);
    }

    public function synchronize(
        AdministrativeDivisionSnapshot $snapshot,
        string $source,
        CarbonInterface $syncedAt,
    ): array {
        return DB::transaction(function () use ($snapshot, $source, $syncedAt) {
            $timestamp = $syncedAt->toDateTimeString();
            $provinceCodes = array_column($snapshot->provinces, 'code');

            Province::upsert(
                array_map(
                    fn (array $province) => [
                        ...$province,
                        'source' => $source,
                        'meta' => json_encode($province['meta'], JSON_THROW_ON_ERROR),
                        'is_active' => true,
                        'source_synced_at' => $timestamp,
                        'created_at' => $timestamp,
                        'updated_at' => $timestamp,
                    ],
                    $snapshot->provinces,
                ),
                ['code'],
                [
                    'name',
                    'slug',
                    'type',
                    'source',
                    'meta',
                    'is_active',
                    'source_synced_at',
                    'updated_at',
                ],
            );

            Province::query()
                ->whereNotIn('code', $provinceCodes)
                ->update(['is_active' => false, 'updated_at' => $timestamp]);

            $provinceIds = Province::query()
                ->whereIn('code', $provinceCodes)
                ->pluck('id', 'code');
            $wardCodes = array_column($snapshot->wards, 'code');

            if ($snapshot->wards !== []) {
                Ward::upsert(
                    array_map(
                        fn (array $ward) => [
                            'province_id' => $provinceIds[$ward['province_code']],
                            'code' => $ward['code'],
                            'name' => $ward['name'],
                            'slug' => $ward['slug'],
                            'type' => $ward['type'],
                            'source' => $source,
                            'meta' => json_encode($ward['meta'], JSON_THROW_ON_ERROR),
                            'is_active' => true,
                            'source_synced_at' => $timestamp,
                            'created_at' => $timestamp,
                            'updated_at' => $timestamp,
                        ],
                        $snapshot->wards,
                    ),
                    ['code'],
                    [
                        'province_id',
                        'name',
                        'slug',
                        'type',
                        'source',
                        'meta',
                        'is_active',
                        'source_synced_at',
                        'updated_at',
                    ],
                );
            }

            Ward::query()
                ->whereNotIn('code', $wardCodes)
                ->update(['is_active' => false, 'updated_at' => $timestamp]);

            return [
                'province_count' => count($snapshot->provinces),
                'ward_count' => count($snapshot->wards),
            ];
        });
    }

    public function completeImport(
        AdministrativeDivisionImport $import,
        array $counts,
        CarbonInterface $finishedAt,
    ): void {
        $import->update([
            'status' => 'completed',
            'province_count' => $counts['province_count'],
            'ward_count' => $counts['ward_count'],
            'finished_at' => $finishedAt,
        ]);
    }

    public function failImport(
        AdministrativeDivisionImport $import,
        string $errorMessage,
        CarbonInterface $finishedAt,
    ): void {
        $import->update([
            'status' => 'failed',
            'error_message' => str($errorMessage)->limit(65535)->toString(),
            'finished_at' => $finishedAt,
        ]);
    }
}
