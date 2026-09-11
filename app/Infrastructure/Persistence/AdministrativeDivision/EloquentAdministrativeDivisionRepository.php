<?php

namespace App\Infrastructure\Persistence\AdministrativeDivision;

use App\Domain\AdministrativeDivision\Contracts\AdministrativeDivisionRepository;
use App\Domain\AdministrativeDivision\Data\AdministrativeDivisionSnapshot;
use App\Domain\AdministrativeDivision\Models\AdministrativeDivisionImport;
use App\Domain\AdministrativeDivision\Models\Province;
use App\Domain\AdministrativeDivision\Models\Ward;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
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

    public function activeProvinceOptions(): Collection
    {
        return Province::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['name', 'slug'])
            ->map(fn (Province $province) => [
                'label' => str($province->name)
                    ->replaceStart('Thành phố ', '')
                    ->replaceStart('Tỉnh ', '')
                    ->toString(),
                'slug' => $province->slug,
            ]);
    }

    public function searchActiveLocations(string $query, int $limit = 8): Collection
    {
        $query = str($query)->trim()->toString();

        if ($query === '') {
            return $this->popularProvinceSuggestions($limit);
        }

        $like = "%{$query}%";
        $slugLike = '%'.str($query)->slug()->toString().'%';

        $provinces = Province::query()
            ->where('is_active', true)
            ->where(fn ($query) => $query->where('name', 'like', $like)->orWhere('slug', 'like', $slugLike))
            ->orderBy('name')
            ->limit($limit)
            ->get(['name', 'slug'])
            ->map(fn (Province $province) => [
                'label' => $this->displayProvinceName($province->name),
                'url' => "/phong-tro/tinh-thanh/{$province->slug}",
                'type' => 'Tỉnh/thành',
            ]);

        $wards = Ward::query()
            ->where('is_active', true)
            ->with('province:id,name,slug')
            ->where(fn ($query) => $query->where('name', 'like', $like)->orWhere('slug', 'like', $slugLike))
            ->orderBy('name')
            ->limit(max(0, $limit - $provinces->count()))
            ->get(['id', 'province_id', 'name', 'slug'])
            ->map(fn (Ward $ward) => [
                'label' => "{$ward->name}, {$this->displayProvinceName($ward->province->name)}",
                'url' => "/phong-tro/tinh-thanh/{$ward->province->slug}/phuong-xa/{$ward->slug}",
                'type' => 'Phường/xã',
            ]);

        return $provinces->concat($wards)->values();
    }

    public function activeWardSuggestionsForProvince(Province $province): Collection
    {
        return $province->wards()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['name', 'slug'])
            ->map(fn (Ward $ward) => [
                'label' => $ward->name,
                'url' => "/phong-tro/tinh-thanh/{$province->slug}/phuong-xa/{$ward->slug}",
                'type' => 'Phường/xã',
            ]);
    }

    /** @return Collection<int, array{label: string, url: string, type: string}> */
    private function popularProvinceSuggestions(int $limit): Collection
    {
        $popularSlugs = [
            'ho-chi-minh',
            'ha-noi',
            'da-nang',
            'can-tho',
            'hai-phong',
        ];

        return Province::query()
            ->where('is_active', true)
            ->whereIn('slug', $popularSlugs)
            ->get(['name', 'slug'])
            ->sortBy(fn (Province $province) => array_search($province->slug, $popularSlugs, true))
            ->take($limit)
            ->values()
            ->map(fn (Province $province) => [
                'label' => $this->displayProvinceName($province->name),
                'url' => "/phong-tro/tinh-thanh/{$province->slug}",
                'type' => 'Tỉnh/thành',
            ]);
    }

    private function displayProvinceName(string $name): string
    {
        return str($name)
            ->replaceStart('Thành phố ', '')
            ->replaceStart('Tỉnh ', '')
            ->toString();
    }
}
