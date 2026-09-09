# Trọ Đây — Product Roadmap

## Mục tiêu MVP

Kết nối người thuê với chủ trọ qua các tin đăng phòng dài hạn có giá, địa điểm,
chi phí và trạng thái rõ ràng. MVP không xử lý đặt phòng, thanh toán, hợp đồng,
nhắn tin hay gói VIP.

## Hiện trạng

| Hạng mục | Trạng thái |
| --- | --- |
| Laravel/Inertia, đăng ký, đăng nhập, xác minh email | Có |
| Admin, user management, role/permission | Có |
| Migrations rental: địa giới, loại phòng, tiện ích, listing, ảnh, chi phí, yêu thích, kiểm duyệt, báo cáo | Có |
| Domain/Application/Infrastructure cho rental | Chưa có |
| Public listing, search, trang chi tiết | Chưa có |
| Luồng chủ trọ đăng và quản lý tin | Chưa có |
| Moderation tin đăng | Chưa có |

Schema nguồn: `docs/phongtro-schema.dbml`. Các phần được đánh dấu deferred trong
schema vẫn nằm ngoài MVP.

## Nguyên tắc triển khai

- Mọi list public chỉ trả về tin `published`, chưa hết hạn và chưa bị soft delete.
- Search state được phản ánh qua query string để chia sẻ URL và quay lại trang.
- Controller dùng FormRequest → DTO → application service → repository contract.
- Tất cả action của landlord và moderator được bảo vệ bằng policy/permission;
  không dựa vào việc ẩn button ở frontend.
- Ảnh listing lưu qua Laravel Storage, database chỉ lưu relative path.
- Mỗi phase phải có feature test cho validation, authorization và trạng thái cốt lõi.

## Phase 0 — Branding và nền tảng delivery

### Mục tiêu

Chốt các asset và quy ước để UI public nhất quán trước khi mở rộng màn hình.

### Việc làm

- Hoàn thiện SVG logo, favicon đúng kích thước và OG/social image.
- Thay ảnh hero tham chiếu bằng ảnh phòng thật tối ưu WebP/AVIF.
- Dùng `design.md` và `design-system/tro-day/MASTER.md` làm source of truth.
- Bổ sung sitemap, robots, title/description/OG metadata cơ bản khi public pages
  xuất hiện.

### Hoàn thành khi

Asset không còn mang tên cũ, favicon/logo hiển thị đúng ở desktop/mobile, ảnh
trên landing không phụ thuộc host bên ngoài.

## Phase 1 — Public discovery

### Mục tiêu

Người thuê có thể tìm, lọc và xem tin đã xuất bản.

### Backend

- Tạo module `Rental` cho Listing, PropertyType, Amenity, Province và Ward.
- Hoàn thiện model: `$fillable`, casts, relationships, scopes published/available.
- Tạo repository contracts và Eloquent repositories.
- Tạo public `ListingSearchService`, DTO filter và `ListingResource/Collection`.
- Routes: `GET /phong-tro`, `GET /phong-tro/{listing:slug}`.
- Filters MVP: province, ward, property type, monthly rent min/max, area min/max,
  occupants, amenities, sort mới nhất/giá.
- Đảm bảo index database khớp với filter thực tế; paginate dữ liệu.

### Frontend

- Thay dữ liệu demo trên landing bằng collection từ backend.
- Quick Search dẫn đến `/phong-tro?...` thay vì lọc client-side.
- Tạo listing index với filter URL-backed, loading/empty/error state.
- Tạo listing detail: ảnh, giá, cọc, phí, địa chỉ, tiện ích và thông tin liên hệ.

### Hoàn thành khi

Người chưa đăng nhập tìm được listing published, copy URL filter và xem chi tiết
mà không lộ tin draft/hidden/rented/expired.

## Phase 2 — Landlord onboarding và quản lý tin

### Mục tiêu

Chủ trọ tạo bản nháp, tải ảnh và gửi duyệt tin.

### Backend

- Hoàn thiện `LandlordProfile` và policy ownership.
- CRUD listing của chủ trọ: draft, update, delete, submit review.
- Validation chi tiết cho giá, cọc, địa chỉ, phí, loại phòng, số người và ảnh.
- Upload ảnh có giới hạn MIME/size/count, tạo alt text có thể chỉnh sửa, chọn ảnh
  chính và sắp xếp ảnh.
- Chỉ owner được sửa/xóa draft hoặc tin bị từ chối; publish state chỉ do moderator.

### Frontend

- Tenant dashboard có danh sách tin theo trạng thái.
- Listing form chia bước: cơ bản → vị trí → chi phí/tiện ích → ảnh → xem lại.
- Hiển thị validation, upload progress, lưu nháp và lý do từ chối.

### Hoàn thành khi

Chủ trọ xác minh email có thể tạo tin hoàn chỉnh, lưu draft và gửi duyệt; không
thể tự xuất bản hoặc sửa listing của người khác.

## Phase 3 — Moderation và an toàn tin đăng

### Mục tiêu

Admin duyệt, từ chối, ẩn, đánh dấu đã thuê và xử lý báo cáo có audit trail.

### Backend

- Thêm `SystemPermission`/policy cho moderation và reporting.
- Application service chuyển trạng thái listing theo state machine.
- Ghi `listing_moderations` cho mọi thay đổi status.
- Luồng report: tạo report public/authenticated theo chính sách, admin review/dismiss.
- Job định kỳ expire listing đến hạn; test thời gian với Carbon.

### Frontend

- Admin queue: pending review, detail duyệt/từ chối, lý do bắt buộc khi reject.
- Admin report queue và trạng thái xử lý.
- Chủ trọ thấy lịch sử/trạng thái tin; người thuê thấy nhãn trạng thái rõ ràng.

### Hoàn thành khi

Mọi thay đổi moderation có người thực hiện, thời điểm và lý do; tin không hợp lệ
không còn xuất hiện ở public search.

## Phase 4 — Retention MVP

### Mục tiêu

Hỗ trợ người thuê quay lại các lựa chọn đã cân nhắc và báo tin không chính xác.

### Việc làm

- Favorites cho user đăng nhập, duplicate-safe và pagination.
- CTA yêu thích/login rõ ràng ở listing detail/card.
- Cải thiện empty states, error states, analytics sự kiện nội bộ tối thiểu:
  search submitted, listing viewed, contact revealed, favorite toggled.

### Hoàn thành khi

User lưu/bỏ lưu listing được và admin có thể xem/report các dữ liệu bất thường cơ bản.

## Ngoài MVP

- Saved searches và thông báo tự động.
- Nhắn tin, cuộc hẹn xem phòng và booking.
- Thanh toán, đặt cọc online, hợp đồng và review.
- Gói VIP, quảng cáo, khuyến mãi và đối soát giao dịch.

## Thứ tự triển khai đề xuất

```text
Phase 0 → Phase 1 public search/detail → Phase 2 landlord CRUD
        → Phase 3 moderation/reporting → Phase 4 favorites/retention
```

Không bắt đầu Phase 2 trước khi Phase 1 xác định rõ public listing resource,
status và image storage. Không thêm payment/messaging trước khi vòng moderation
hoạt động ổn định.
