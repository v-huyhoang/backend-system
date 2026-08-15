# Backend System

Ứng dụng quản trị được xây dựng bằng Laravel, Inertia.js, React và TypeScript. Backend được tổ chức theo hướng DDD (Domain-Driven Design), giao diện sử dụng Tailwind CSS và shadcn/ui.

## Công nghệ chính

- PHP 8.4 và Laravel 12
- React 19, TypeScript và Inertia.js 2
- MariaDB 10.6
- Redis
- Spatie Laravel Permission
- Laravel Wayfinder
- Vite và Tailwind CSS 4
- Docker Compose

## Khởi chạy dự án bằng Docker

### 1. Tạo file môi trường

```bash
cp .env.example .env
```

Khi Laravel chạy trong Docker, cấu hình các giá trị quan trọng trong `.env` như sau:

```dotenv
APP_URL=http://localhost:8080

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=homestead
DB_USERNAME=homestead
DB_PASSWORD=secret

REDIS_HOST=redis

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
```

`DB_HOST=mysql` là tên service Docker. Chỉ sử dụng `127.0.0.1` khi chạy PHP trực tiếp trên máy host.

### 2. Build image và cài dependencies

```bash
docker compose build
docker compose run --rm composer install
docker compose run --rm npm install
```

### 3. Khởi động các service

```bash
docker compose up -d
```

### 4. Khởi tạo Laravel và database

```bash
docker compose exec php php artisan key:generate
docker compose exec php php artisan migrate --seed
```

Các địa chỉ sử dụng trong môi trường local:

| Dịch vụ | Địa chỉ |
| --- | --- |
| Web | <http://localhost:8080> |
| Vite | <http://localhost:5173> |
| MailHog | <http://localhost:8025> |
| MariaDB từ máy host | `127.0.0.1:3306` |

Tài khoản được tạo bởi seeder:

```text
Email: test@example.com
Password: password
```

Xem trạng thái container và log:

```bash
docker compose ps
docker compose logs -f app php npm
```

## Kiến trúc thư mục

```text
app/
├── Domain/                 # Model/domain rules và repository contracts
├── Application/            # Application services/use cases
├── Infrastructure/         # Eloquent repository và tích hợp kỹ thuật
├── Presentation/Http/      # Controller, Request, Middleware và Resource
├── Policies/               # Object-level authorization cho model/resource
└── Providers/              # Dependency bindings
```

Luồng xử lý thông thường:

```text
HTTP Request
  → Presentation Controller/FormRequest
  → Application DTO
  → Application Service
  → Domain Repository Contract
  → Infrastructure Eloquent Repository
  → Laravel Resource
  → Inertia React Page
```

Eloquent Model hiện được đặt trong `Domain/<Module>/Models`. Khi domain phát triển phức tạp hơn, có thể tách domain entity thuần PHP khỏi persistence model.

## DDD Generator

Dự án cung cấp command `make:ddd` để tạo nhanh khung backend cho một entity.

### Cú pháp

```bash
php artisan make:ddd <Entity> [--module=<Module>] [--force]
```

Khi sử dụng Docker:

```bash
docker compose exec php php artisan make:ddd Product
```

Nếu không truyền `--module`, tên module mặc định là `<Entity>Management`:

```bash
docker compose exec php php artisan make:ddd Product
```

Lệnh trên sử dụng:

```text
Entity: Product
Module: ProductManagement
```

Nên truyền bounded context rõ ràng khi entity thuộc một nghiệp vụ cụ thể:

```bash
docker compose exec php php artisan make:ddd Product --module=Catalog
```

### Các file được tạo

Ví dụ `Product --module=Catalog` tạo cấu trúc:

```text
app/
├── Domain/Catalog/
│   ├── Models/Product.php
│   └── Contracts/ProductRepository.php
├── Application/Catalog/
│   ├── DTOs/
│   │   ├── StoreProductData.php
│   │   └── UpdateProductData.php
│   └── ProductService.php
├── Infrastructure/Persistence/Catalog/
│   └── EloquentProductRepository.php
├── Presentation/Http/
│   ├── Controllers/ProductController.php
│   ├── Requests/Products/
│   │   ├── StoreProductRequest.php
│   │   └── UpdateProductRequest.php
│   └── Resources/Products/
│       ├── ProductResource.php
│       └── ProductCollection.php
├── Policies/ProductPolicy.php
└── Providers/ProductServiceProvider.php
```

Generator cũng tự thêm provider vào `bootstrap/providers.php`:

```php
App\Providers\ProductServiceProvider::class,
```

Provider chịu trách nhiệm bind repository contract với Eloquent implementation:

```php
$this->app->bind(
    ProductRepository::class,
    EloquentProductRepository::class,
);
```

### Việc cần làm sau khi generate

Generator chỉ tạo khung kiến trúc. Cần hoàn thiện nghiệp vụ theo thứ tự sau.

#### 1. Tạo migration

```bash
docker compose exec php php artisan make:migration create_products_table
```

Sau khi khai báo các cột trong migration:

```bash
docker compose exec php php artisan migrate
```

#### 2. Cấu hình Model

Cập nhật `$fillable`, casts, relationships và factory trong:

```text
app/Domain/Catalog/Models/Product.php
```

Stub sử dụng `$guarded = []` để khung ban đầu có thể hoạt động. Với production code, nên đổi sang `$fillable` và chỉ cho phép các field cần thiết.

#### 3. Khai báo validation

Thêm rules vào:

```text
app/Presentation/Http/Requests/Products/StoreProductRequest.php
app/Presentation/Http/Requests/Products/UpdateProductRequest.php
```

Ví dụ:

```php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'price' => ['required', 'numeric', 'min:0'],
        'is_active' => ['required', 'boolean'],
    ];
}
```

#### 4. Hoàn thiện Resource

Chỉ expose những field frontend cần trong `ProductResource`:

```php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'price' => $this->price,
        'is_active' => $this->is_active,
        'created_at' => $this->created_at?->format('d-m-Y'),
    ];
}
```

`ProductCollection` giữ response pagination tương thích với component `TablePagination`:

```json
{
  "data": [],
  "from": 1,
  "to": 10,
  "total": 20,
  "links": []
}
```

#### 5. Thêm query/filter trong Repository

Phần truy vấn database nằm tại:

```text
app/Infrastructure/Persistence/Catalog/EloquentProductRepository.php
```

Repository chỉ nên truy vấn và trả model/paginator. Việc định dạng response cho frontend thuộc `ProductResource`.

#### 6. Khai báo routes

Thêm controller và resource routes vào `routes/web.php`:

```php
use App\Presentation\Http\Controllers\ProductController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('products', ProductController::class)->except('show');
});
```

Nếu module sử dụng Spatie Permission, thêm authorization middleware phù hợp cho từng route.

#### 7. Tạo Inertia pages

Controller được generate sử dụng các page:

```text
resources/js/pages/products/index.tsx
resources/js/pages/products/create.tsx
resources/js/pages/products/edit.tsx
```

Các page React không được tự tạo vì form, table và field phụ thuộc nghiệp vụ của từng entity.

#### 8. Sử dụng Wayfinder

Khi Vite đang chạy, Wayfinder tự generate typed routes. Có thể generate thủ công:

```bash
docker compose exec php php artisan wayfinder:generate --with-form
```

Ví dụ trong React:

```tsx
import * as productRoutes from '@/routes/products';

<Link href={productRoutes.create()}>Add product</Link>

router.delete(productRoutes.destroy.url(product.id));
```

Không chỉnh sửa thủ công các file trong `resources/js/routes` và `resources/js/actions`, vì Wayfinder sẽ ghi đè chúng.

### Bảo vệ file đã tồn tại

Generator mặc định dừng nếu bất kỳ file đích nào đã tồn tại:

```bash
docker compose exec php php artisan make:ddd Product --module=Catalog
```

Chỉ sử dụng `--force` khi chắc chắn muốn ghi đè toàn bộ file được generate:

```bash
docker compose exec php php artisan make:ddd Product --module=Catalog --force
```

`--force` có thể làm mất các thay đổi nghiệp vụ trong Model, Repository, Service, Controller, Request, Resource và Provider.

### Chỉnh sửa stub

Command được định nghĩa tại:

```text
app/Console/Commands/MakeDddCommand.php
```

Các template nằm trong `stubs/ddd`:

```text
stubs/ddd/
├── model.stub
├── repository.stub
├── service.stub
├── eloquent-repository.stub
├── controller.stub
├── store-request.stub
├── update-request.stub
├── resource.stub
├── collection.stub
└── provider.stub
```

Các placeholder được generator hỗ trợ:

| Placeholder | Ví dụ |
| --- | --- |
| `{{ entity }}` | `Product` |
| `{{ module }}` | `Catalog` |
| `{{ plural }}` | `Products` |
| `{{ page }}` | `products` |
| `{{ variable }}` | `product` |
| `{{ variables }}` | `products` |

Khi thay đổi stub, nên generate một entity thử nghiệm và chạy PHP syntax check trước khi sử dụng cho module thật.

## Các lệnh phát triển thường dùng

```bash
# Kiểm tra routes
docker compose exec php php artisan route:list

# Chạy test backend
docker compose exec php php artisan test

# Kiểm tra coding style PHP
docker compose exec php vendor/bin/pint --test

# Kiểm tra TypeScript
docker compose exec npm npm run types

# Build frontend
docker compose exec npm npm run build
```

Không cần restart Docker khi chỉ thay đổi PHP, TSX hoặc CSS. Vite sẽ cập nhật frontend; PHP-FPM đọc source mới ở request tiếp theo.

## Kết nối database bằng Laragon hoặc database client

MariaDB được publish ra máy host tại `127.0.0.1:3306`:

```text
Host: 127.0.0.1
Port: 3306
Database: homestead
Username: homestead
Password: secret
```

Nếu MySQL/MariaDB của Laragon cũng sử dụng port `3306`, cần dừng database Laragon hoặc đổi port publish của service `mysql` trong `docker-compose.yml`, ví dụ:

```yaml
ports:
  - "3307:3306"
```

Sau đó kết nối database client qua `127.0.0.1:3307`. Cấu hình Laravel bên trong Docker vẫn giữ `DB_HOST=mysql` và `DB_PORT=3306`.

## Xử lý lỗi thường gặp

### Laravel không kết nối được MySQL

Nếu xuất hiện lỗi `getaddrinfo for mysql failed`, hãy chắc chắn command Laravel được chạy trong container PHP và service MySQL đang hoạt động:

```bash
docker compose ps
docker compose exec php php artisan migrate
```

### Frontend không cập nhật

Kiểm tra service npm và Vite:

```bash
docker compose ps npm
docker compose logs -f npm
```

Ứng dụng được truy cập qua `http://localhost:8080`; port `5173` chỉ phục vụ Vite assets và HMR.

### Không thấy command `make:ddd`

```bash
docker compose exec php composer dump-autoload
docker compose exec php php artisan list | grep make:ddd
```

Command được Laravel tự động discover từ `app/Console/Commands`.
