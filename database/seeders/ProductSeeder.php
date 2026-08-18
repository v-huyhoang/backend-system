<?php

namespace Database\Seeders;

use App\Domain\CategoryManagement\Models\Category;
use App\Domain\ProductManagement\Models\Product;
use App\Enums\ProductStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'code' => 'IP15PM',
                'name' => 'iPhone 15 Pro Max',
                'category' => 'iphone',
                'short_description' => 'Điện thoại cao cấp với khung titan, chip A17 Pro và camera tele 5x.',
                'advantages' => ['Hiệu năng mạnh', 'Camera chất lượng cao', 'Thiết kế cao cấp'],
                'disadvantages' => ['Giá cao', 'Không kèm củ sạc'],
                'suitable_for' => ['Người dùng hệ sinh thái Apple', 'Người sáng tạo nội dung'],
                'not_suitable_for' => ['Người cần điện thoại giá rẻ'],
                'status' => ProductStatus::PUBLISHED,
                'is_featured' => true,
            ],
            [
                'code' => 'SSS24U',
                'name' => 'Samsung Galaxy S24 Ultra',
                'category' => 'samsung-galaxy',
                'short_description' => 'Flagship Android tích hợp Galaxy AI, bút S Pen và camera zoom xa.',
                'advantages' => ['Màn hình đẹp', 'Camera đa dụng', 'Có bút S Pen'],
                'disadvantages' => ['Kích thước lớn', 'Giá cao'],
                'suitable_for' => ['Người dùng Android cao cấp', 'Người thường xuyên ghi chú'],
                'not_suitable_for' => ['Người thích điện thoại nhỏ gọn'],
                'status' => ProductStatus::PUBLISHED,
                'is_featured' => true,
            ],
            [
                'code' => 'XIA14',
                'name' => 'Xiaomi 14',
                'category' => 'dien-thoai-xiaomi',
                'short_description' => 'Điện thoại nhỏ gọn, hiệu năng cao với hệ thống camera Leica.',
                'advantages' => ['Hiệu năng tốt', 'Sạc nhanh', 'Thiết kế nhỏ gọn'],
                'disadvantages' => ['Phần mềm có ứng dụng cài sẵn'],
                'suitable_for' => ['Người cần flagship nhỏ gọn', 'Người thích chụp ảnh'],
                'not_suitable_for' => ['Người cần màn hình thật lớn'],
                'status' => ProductStatus::PUBLISHED,
                'is_featured' => false,
            ],
            [
                'code' => 'MBA-M3',
                'name' => 'MacBook Air M3 13 inch',
                'category' => 'laptop',
                'short_description' => 'Laptop mỏng nhẹ, pin lâu và vận hành êm ái với chip Apple M3.',
                'advantages' => ['Pin lâu', 'Mỏng nhẹ', 'Không có tiếng quạt'],
                'disadvantages' => ['Ít cổng kết nối', 'Khó nâng cấp'],
                'suitable_for' => ['Sinh viên', 'Nhân viên văn phòng', 'Lập trình viên'],
                'not_suitable_for' => ['Người chơi game Windows'],
                'status' => ProductStatus::PUBLISHED,
                'is_featured' => true,
            ],
            [
                'code' => 'AS-TUF-A15',
                'name' => 'ASUS TUF Gaming A15',
                'category' => 'laptop',
                'short_description' => 'Laptop gaming bền bỉ, hiệu năng tốt cho chơi game và công việc đồ họa.',
                'advantages' => ['Hiệu năng tốt', 'Dễ nâng cấp', 'Tản nhiệt ổn định'],
                'disadvantages' => ['Khá nặng', 'Pin trung bình'],
                'suitable_for' => ['Game thủ', 'Sinh viên kỹ thuật'],
                'not_suitable_for' => ['Người thường xuyên di chuyển'],
                'status' => ProductStatus::PUBLISHED,
                'is_featured' => false,
            ],
            [
                'code' => 'DELL-U2723',
                'name' => 'Màn hình Dell UltraSharp U2723QE',
                'category' => 'man-hinh',
                'short_description' => 'Màn hình 27 inch 4K cho công việc chuyên nghiệp và sáng tạo nội dung.',
                'advantages' => ['Hiển thị sắc nét', 'Màu sắc chính xác', 'Kết nối USB-C'],
                'disadvantages' => ['Tần số quét 60 Hz'],
                'suitable_for' => ['Nhân viên văn phòng', 'Nhà thiết kế'],
                'not_suitable_for' => ['Game thủ thi đấu'],
                'status' => ProductStatus::PUBLISHED,
                'is_featured' => false,
            ],
            [
                'code' => 'SHIRT-OXF',
                'name' => 'Áo sơ mi nam Oxford',
                'category' => 'ao-nam',
                'short_description' => 'Áo sơ mi Oxford phom regular phù hợp đi làm và đi chơi.',
                'advantages' => ['Dễ phối đồ', 'Chất liệu thoáng', 'Phom dáng cơ bản'],
                'disadvantages' => ['Cần ủi sau khi giặt'],
                'suitable_for' => ['Nhân viên văn phòng', 'Phong cách smart casual'],
                'not_suitable_for' => ['Hoạt động thể thao'],
                'status' => ProductStatus::DRAFT,
                'is_featured' => false,
            ],
            [
                'code' => 'SHOE-RUN',
                'name' => 'Giày chạy bộ nam Air Run',
                'category' => 'giay-nam',
                'short_description' => 'Giày chạy bộ nhẹ với đệm êm, phù hợp tập luyện hằng ngày.',
                'advantages' => ['Trọng lượng nhẹ', 'Đệm êm', 'Thoáng khí'],
                'disadvantages' => ['Không chống nước'],
                'suitable_for' => ['Người mới chạy bộ', 'Tập luyện hằng ngày'],
                'not_suitable_for' => ['Chạy địa hình'],
                'status' => ProductStatus::PUBLISHED,
                'is_featured' => false,
            ],
            [
                'code' => 'BAG-MINI',
                'name' => 'Túi xách nữ Mini Classic',
                'category' => 'tui-xach-nu',
                'short_description' => 'Túi xách nhỏ gọn với thiết kế tối giản dành cho nhu cầu hằng ngày.',
                'advantages' => ['Thiết kế thanh lịch', 'Dễ phối trang phục'],
                'disadvantages' => ['Sức chứa nhỏ'],
                'suitable_for' => ['Đi làm', 'Đi chơi'],
                'not_suitable_for' => ['Người cần mang nhiều đồ'],
                'status' => ProductStatus::DRAFT,
                'is_featured' => false,
            ],
            [
                'code' => 'PAN-INOX24',
                'name' => 'Chảo inox chống dính 24 cm',
                'category' => 'noi-va-chao',
                'short_description' => 'Chảo inox đáy từ 24 cm dùng được trên nhiều loại bếp.',
                'advantages' => ['Dễ vệ sinh', 'Dùng được bếp từ', 'Kích thước tiện dụng'],
                'disadvantages' => ['Cần làm nóng đúng cách'],
                'suitable_for' => ['Gia đình nhỏ', 'Nấu ăn hằng ngày'],
                'not_suitable_for' => ['Nấu khẩu phần lớn'],
                'status' => ProductStatus::ARCHIVED,
                'is_featured' => false,
            ],
        ];

        $categoryIds = Category::query()
            ->whereIn('slug', array_column($products, 'category'))
            ->pluck('id', 'slug');

        foreach ($products as $index => $data) {
            $categorySlug = $data['category'];
            unset($data['category']);

            $status = $data['status'];
            $data['category_id'] = $categoryIds->get($categorySlug);
            $data['slug'] = Str::slug($data['name']);
            $data['content'] = $data['short_description'];
            $data['sort_order'] = $index + 1;
            $data['published_at'] = $status === ProductStatus::PUBLISHED ? now() : null;

            Product::updateOrCreate(['code' => $data['code']], $data);
        }
    }
}
