<?php

namespace Database\Seeders;

use App\Domain\Rental\Models\Amenity;
use App\Domain\Rental\Models\ListingCostType;
use App\Domain\Rental\Models\PropertyType;
use App\Infrastructure\Persistence\Rental\Cache\RentalMasterDataCache;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Database\Seeder;

class RentalMasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedPropertyTypes();
        $this->seedAmenities();
        $this->seedCostTypes();

        RentalMasterDataCache::forget(app(CacheRepository::class));
    }

    private function seedPropertyTypes(): void
    {
        $items = [
            ['name' => 'Phòng trọ có gác', 'slug' => 'phong-tro-co-gac'],
            ['name' => 'Căn hộ mini / Studio', 'slug' => 'can-ho-mini-studio'],
            ['name' => 'Phòng trọ khép kín', 'slug' => 'phong-tro-khep-kin'],
            ['name' => 'Ở ghép', 'slug' => 'o-ghep'],
        ];

        foreach ($items as $sortOrder => $item) {
            PropertyType::updateOrCreate(
                ['slug' => $item['slug']],
                [...$item, 'is_active' => true, 'sort_order' => $sortOrder],
            );
        }
    }

    private function seedAmenities(): void
    {
        $items = [
            ['name' => 'Máy lạnh', 'slug' => 'may-lanh', 'icon' => 'snowflake'],
            ['name' => 'Máy giặt riêng', 'slug' => 'may-giat-rieng', 'icon' => 'washing-machine'],
            ['name' => 'Bếp riêng', 'slug' => 'bep-rieng', 'icon' => 'cooking-pot'],
            ['name' => 'Thang máy', 'slug' => 'thang-may', 'icon' => 'elevator'],
            ['name' => 'Camera an ninh', 'slug' => 'camera-an-ninh', 'icon' => 'cctv'],
            ['name' => 'Giờ giấc tự do', 'slug' => 'gio-giac-tu-do', 'icon' => 'clock-3'],
            ['name' => 'Chỗ để xe', 'slug' => 'cho-de-xe', 'icon' => 'parking-square'],
            ['name' => 'Ban công', 'slug' => 'ban-cong', 'icon' => 'fence'],
        ];

        foreach ($items as $sortOrder => $item) {
            Amenity::updateOrCreate(
                ['slug' => $item['slug']],
                [...$item, 'is_active' => true, 'sort_order' => $sortOrder],
            );
        }
    }

    private function seedCostTypes(): void
    {
        $items = [
            ['name' => 'Điện', 'slug' => 'dien', 'unit' => 'đ/kWh'],
            ['name' => 'Nước', 'slug' => 'nuoc', 'unit' => 'đ/m³'],
            ['name' => 'Internet / Wifi', 'slug' => 'internet-wifi', 'unit' => 'đ/tháng'],
            ['name' => 'Gửi xe', 'slug' => 'gui-xe', 'unit' => 'đ/tháng'],
        ];

        foreach ($items as $sortOrder => $item) {
            ListingCostType::updateOrCreate(
                ['slug' => $item['slug']],
                [...$item, 'is_active' => true, 'sort_order' => $sortOrder],
            );
        }
    }
}
