<?php

namespace Tests\Feature;

use App\Domain\AdministrativeDivision\Models\AdministrativeDivisionImport;
use App\Domain\AdministrativeDivision\Models\Province;
use App\Domain\AdministrativeDivision\Models\Ward;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SyncAdministrativeDivisionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_imports_administrative_divisions_and_deactivates_missing_records(): void
    {
        Province::create([
            'code' => '999',
            'name' => 'Tỉnh cũ',
            'slug' => 'tinh-cu',
            'type' => 'province',
        ]);

        Http::fake($this->apiResponses([
            'Phường Tân Phong',
            'Phường Tân Phong mới',
        ]));

        $this->artisan('app:sync-administrative-divisions')
            ->expectsOutputToContain('Synchronized 2 provinces and 3 wards.')
            ->assertExitCode(0);

        $hoChiMinh = Province::query()->where('code', '79')->firstOrFail();
        $ward = Ward::query()->where('code', '26734')->firstOrFail();

        $this->assertSame('ho-chi-minh', $hoChiMinh->slug);
        $this->assertSame('municipality', $hoChiMinh->type);
        $this->assertSame(28, $hoChiMinh->meta['phone_code']);
        $this->assertSame($hoChiMinh->id, $ward->province_id);
        $this->assertSame('ward', $ward->type);
        $this->assertSame('phuong-tan-phong', $ward->slug);
        $this->assertTrue($ward->is_active);
        $this->assertFalse(Province::query()->where('code', '999')->firstOrFail()->is_active);

        $this->assertDatabaseHas('administrative_division_imports', [
            'source' => 'province_open_api_v2',
            'status' => 'completed',
            'province_count' => 2,
            'ward_count' => 3,
        ]);

        $this->artisan('app:sync-administrative-divisions')->assertExitCode(0);

        $this->assertSame(2, Province::query()->where('is_active', true)->count());
        $this->assertSame(3, Province::query()->count());
        $this->assertSame(3, Ward::query()->count());
        $this->assertSame(
            'Phường Tân Phong mới',
            Ward::query()->where('code', '26734')->value('name'),
        );
    }

    public function test_it_records_a_failed_import_when_the_source_is_unavailable(): void
    {
        Http::fake([
            '*' => Http::response([], 503),
        ]);

        $this->artisan('app:sync-administrative-divisions')->assertExitCode(1);

        $import = AdministrativeDivisionImport::query()->sole();

        $this->assertSame('failed', $import->status);
        $this->assertNotNull($import->finished_at);
        $this->assertNotNull($import->error_message);
    }

    /** @param list<string> $firstWardNames */
    private function apiResponses(array $firstWardNames): array
    {
        return [
            'https://provinces.open-api.vn/api/v2/p/' => Http::response([
                [
                    'code' => 79,
                    'name' => 'Thành phố Hồ Chí Minh',
                    'division_type' => 'thành phố trung ương',
                    'codename' => 'ho_chi_minh',
                    'phone_code' => 28,
                ],
                [
                    'code' => 48,
                    'name' => 'Thành phố Đà Nẵng',
                    'division_type' => 'thành phố trung ương',
                    'codename' => 'da_nang',
                    'phone_code' => 236,
                ],
            ]),
            'https://provinces.open-api.vn/api/v2/p/79*' => Http::sequence(
                array_map(
                    fn (string $firstWardName) => Http::response([
                        'wards' => [
                            [
                                'code' => 26734,
                                'name' => $firstWardName,
                                'division_type' => 'phường',
                                'codename' => 'phuong_tan_phong',
                            ],
                            [
                                'code' => 26735,
                                'name' => 'Xã Nhà Bè',
                                'division_type' => 'xã',
                                'codename' => 'xa_nha_be',
                            ],
                        ],
                    ]),
                    $firstWardNames,
                ),
            ),
            'https://provinces.open-api.vn/api/v2/p/48*' => Http::response([
                'wards' => [
                    [
                        'code' => 20401,
                        'name' => 'Đặc khu Hoàng Sa',
                        'division_type' => 'đặc khu',
                        'codename' => 'dac_khu_hoang_sa',
                    ],
                ],
            ]),
        ];
    }
}
