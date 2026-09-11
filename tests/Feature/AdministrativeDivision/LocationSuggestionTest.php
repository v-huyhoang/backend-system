<?php

namespace Tests\Feature\AdministrativeDivision;

use App\Domain\AdministrativeDivision\Models\Province;
use App\Domain\AdministrativeDivision\Models\Ward;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocationSuggestionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_a_canonical_location_url_for_a_matching_ward(): void
    {
        $province = Province::factory()->create([
            'name' => 'Thành phố Hồ Chí Minh',
            'slug' => 'ho-chi-minh',
        ]);
        Ward::factory()->for($province)->create([
            'name' => 'Phường Vũng Tàu',
            'slug' => 'phuong-vung-tau',
        ]);

        $this->getJson(route('locations.suggestions', ['q' => 'Vũng Tàu']))
            ->assertOk()
            ->assertJsonPath('data.0.label', 'Phường Vũng Tàu, Hồ Chí Minh')
            ->assertJsonPath(
                'data.0.url',
                '/phong-tro/tinh-thanh/ho-chi-minh/phuong-xa/phuong-vung-tau',
            );
    }

    public function test_it_returns_popular_provinces_when_the_query_is_empty(): void
    {
        Province::factory()->create([
            'name' => 'Thành phố Hà Nội',
            'slug' => 'ha-noi',
        ]);
        Province::factory()->create([
            'name' => 'Thành phố Hồ Chí Minh',
            'slug' => 'ho-chi-minh',
        ]);

        $this->getJson(route('locations.suggestions'))
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.label', 'Hồ Chí Minh')
            ->assertJsonPath('data.1.label', 'Hà Nội');
    }

    public function test_it_returns_active_wards_for_a_selected_province(): void
    {
        $province = Province::factory()->create(['slug' => 'ha-noi']);
        $activeWard = Ward::factory()->for($province)->create([
            'name' => 'Phường Cầu Giấy',
            'slug' => 'phuong-cau-giay',
        ]);
        Ward::factory()->for($province)->create(['is_active' => false]);

        $this->getJson(route('locations.wards', $province))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.label', $activeWard->name)
            ->assertJsonPath(
                'data.0.url',
                '/phong-tro/tinh-thanh/ha-noi/phuong-xa/phuong-cau-giay',
            );
    }

    public function test_it_returns_all_active_provinces_for_the_province_picker(): void
    {
        Province::factory()->create([
            'name' => 'Thành phố Hà Nội',
            'slug' => 'ha-noi',
        ]);
        Province::factory()->create([
            'name' => 'Tỉnh Quảng Ninh',
            'slug' => 'quang-ninh',
        ]);
        Province::factory()->create(['is_active' => false]);

        $this->getJson(route('locations.provinces'))
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.label', 'Hà Nội')
            ->assertJsonPath('data.0.url', '/phong-tro/tinh-thanh/ha-noi')
            ->assertJsonPath('data.1.label', 'Quảng Ninh');
    }
}
