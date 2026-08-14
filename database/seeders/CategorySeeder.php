<?php

namespace Database\Seeders;

use App\Domain\CategoryManagement\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $tree = [
            'Điện tử' => [
                'Điện thoại' => ['iPhone', 'Samsung Galaxy', 'Điện thoại Xiaomi'],
                'Máy tính' => ['Laptop', 'Máy tính để bàn', 'Màn hình'],
            ],
            'Thời trang' => [
                'Thời trang nam' => ['Áo nam', 'Quần nam', 'Giày nam'],
                'Thời trang nữ' => ['Váy nữ', 'Túi xách nữ', 'Giày nữ'],
            ],
            'Nhà cửa và đời sống' => [
                'Nội thất' => ['Bàn ghế', 'Tủ', 'Giường'],
                'Nhà bếp' => ['Nồi và chảo', 'Dụng cụ nhà bếp', 'Thiết bị nhà bếp'],
            ],
        ];

        foreach ($tree as $rootName => $children) {
            $root = $this->category($rootName);

            foreach ($children as $childName => $grandchildren) {
                $child = $this->category($childName, $root);

                foreach ($grandchildren as $grandchildName) {
                    $this->category($grandchildName, $child);
                }
            }
        }
    }

    private function category(string $name, ?Category $parent = null): Category
    {
        return Category::updateOrCreate(
            ['slug' => Str::slug($name)],
            [
                'name' => $name,
                'parent_id' => $parent?->id,
                'description' => "Danh mục {$name}",
                'is_active' => true,
            ],
        );
    }
}
