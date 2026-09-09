# AGENTS.md

## Phạm vi

Hướng dẫn này áp dụng cho toàn bộ repository. Đây là ứng dụng Laravel 12 dùng
Inertia.js 2, React 19, TypeScript, Tailwind CSS 4 và shadcn/ui. Backend được tổ
chức theo hướng DDD; môi trường local chuẩn chạy bằng Docker Compose.

## Nguyên tắc làm việc

- Đọc `README.md`, các file liên quan và `git status` trước khi sửa.
- Giữ nguyên các thay đổi đang có của người dùng; không revert, ghi đè hoặc
  format hàng loạt những file ngoài phạm vi công việc.
- Ưu tiên thay đổi nhỏ, đúng phạm vi và bám theo pattern của module gần nhất.
- Không đưa secret vào source. Không commit `.env`, credential hoặc dữ liệu thật.
- Không tự ý chạy migration/seed trên database không phải môi trường test.
- Với thay đổi hành vi, thêm hoặc cập nhật test tương ứng.

## Kiến trúc backend

Luồng phụ thuộc chuẩn:

```text
HTTP Request
  -> Presentation Controller / FormRequest / Resource
  -> Application DTO / Service
  -> Domain Repository Contract / Model / Enum
  -> Infrastructure Eloquent Repository
```

- `app/Domain/<Module>` chứa model, enum, luật domain và repository contract.
  Domain không phụ thuộc Presentation.
- `app/Application/<Module>` chứa DTO và application service/use case. Controller
  không nên truy vấn Eloquent trực tiếp khi module đã có service/repository.
- `app/Infrastructure/Persistence/<Module>` hiện thực repository bằng Eloquent.
- `app/Presentation/Http` chứa controller, FormRequest và API Resource. Validation
  nằm trong FormRequest; chỉ dùng dữ liệu từ `validated()` để tạo DTO.
- Bind contract với implementation và đăng ký policy trong service provider của
  module; đồng thời thêm provider mới vào `bootstrap/providers.php`.
- Route admin nằm trong `routes/admin.php`, dùng prefix/name `admin.*`, middleware
  `auth`, `verified` và authorization bằng `can(...)`/policy.
- Không coi việc ẩn nút ở frontend là authorization; quyền phải được kiểm tra ở
  backend. Khi thêm quyền hệ thống, đồng bộ enum, seeder, policy/route và frontend.
- Chỉ expose field frontend cần qua Resource/Collection. Giữ shape pagination
  tương thích với `TablePagination`.
- Migration phải có `down()` an toàn; cập nhật factory/seeder khi schema hoặc dữ
  liệu khởi tạo thay đổi.
- Có thể tạo skeleton bằng
  `php artisan make:ddd <Entity> --module=<Module>`, nhưng phải hoàn thiện migration,
  `$fillable`, casts, relationships, validation, resource, route và test sau đó.

## Frontend

- Page Inertia nằm trong `resources/js/pages`; component dùng chung nằm trong
  `resources/js/components`; primitive shadcn/ui nằm trong `components/ui`.
- Dùng TypeScript strict, khai báo kiểu rõ ràng và tránh `any`. Import nội bộ dùng
  alias `@/`.
- Tái sử dụng layout, component UI, hook và pattern của màn hình cùng nhóm trước
  khi tạo abstraction mới.
- Mọi thao tác tương tác phải có trạng thái loading/error phù hợp; icon-only button
  cần accessible name (`aria-label` hoặc nội dung tương đương).
- Giữ permission check ở UI nhất quán với `SystemPermission` và `usePermissions`.
- Dùng route/action typed của Wayfinder khi module hiện tại đã theo pattern này.
  Không sửa tay `resources/js/routes` hoặc `resources/js/actions`; chúng được sinh
  lại bằng `php artisan wayfinder:generate --with-form --no-interaction`.
- Tuân theo `.prettierrc`: single quote, semicolon, print width 80, tab width 4;
  để plugin tự sắp import và class Tailwind.
- Với giao diện thương hiệu Trọ Đây, tham khảo `design.md` và
  `design-system/tro-day/MASTER.md` trước khi đổi visual.

## Lệnh thường dùng

Chạy trực tiếp trên host nếu PHP/Node và dependencies đã sẵn sàng:

```bash
composer test
php artisan test --filter=TestName
./vendor/bin/pint --test
npm run types
npm run format:check
npm run build
```

Môi trường Docker tương đương:

```bash
docker compose exec php php artisan test
docker compose exec php ./vendor/bin/pint --test
docker compose run --rm npm run types
docker compose run --rm npm run format:check
docker compose run --rm npm run build
```

Lưu ý `npm run lint` đang chạy ESLint với `--fix` và sẽ sửa file. Chỉ chạy khi
chấp nhận các thay đổi đó, sau đó kiểm tra lại diff.

## Kiểm tra trước khi bàn giao

- Chạy test hẹp nhất liên quan trước, rồi mở rộng sang `composer test` khi hợp lý.
- Backend PHP: chạy Pint check trên các file đã sửa hoặc toàn dự án.
- Frontend: tối thiểu chạy `npm run types` và `npm run format:check`; chạy build khi
  thay đổi page, asset, cấu hình Vite hoặc dependency.
- Nếu thay route/controller được frontend dùng, regenerate Wayfinder trước khi
  type-check.
- Xem `git diff --check` và `git status --short`; bảo đảm không có file sinh ra,
  debug artifact hay thay đổi ngoài phạm vi.
- Nếu không thể chạy một kiểm tra, nêu rõ lệnh chưa chạy và lý do khi bàn giao.

## Quy ước test

- Test backend dùng PHPUnit 11: unit test ở `tests/Unit`, feature/authorization ở
  `tests/Feature`. Cấu hình test mặc định dùng SQLite in-memory, cache array và
  queue sync.
- Ưu tiên feature test cho route, validation, authorization và luồng Inertia;
  dùng unit test cho DTO, enum và logic độc lập framework.
- Mỗi bug fix nên có regression test thất bại trước bản sửa và thành công sau đó.
- Không làm test phụ thuộc thứ tự, dữ liệu database local hoặc service bên ngoài.
