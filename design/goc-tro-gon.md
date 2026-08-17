# Góc Trọ Thông Minh — UX handoff

## 1. User flow ưu tiên

```text
TikTok video
  → Link bio
  → Homepage
  → Nhập mã GTGxx / tìm theo tên
  → Kết quả đúng sản phẩm
  → Review nhanh + ưu/nhược điểm
  → CTA minh bạch
  → TikTok Shop
  → Thanh toán bên TikTok Shop
```

Mục tiêu tìm đúng sản phẩm dưới 10 giây được hỗ trợ bằng search ngay sau hero, mã sản phẩm nổi bật trên card, không có login/cart và CTA nhất quán.

## 2. Information architecture

- Trang chủ
  - Hero ngắn
  - Tìm theo mã/tên/nhu cầu
  - Category chips
  - Sản phẩm mới review
  - Bộ sưu tập theo nhu cầu
  - Bắt đầu từ vấn đề
  - Cam kết review
  - Video TikTok
  - Affiliate disclosure
- Trang chi tiết `/p/{slug}`
  - Gallery và thông tin giá
  - Review nhanh
  - Ưu/nhược điểm
  - Video review
  - Sản phẩm thay thế
  - Sticky mobile affiliate CTA

## 3. Low-fidelity mobile wireframe (390 px)

```text
┌──────────────────────────┐
│ Logo                 Menu│ sticky header
├──────────────────────────┤
│ Eyebrow                  │
│ PHÒNG NHỎ VẪN CÓ THỂ     │
│ SỐNG GỌN                 │
│ Supporting copy          │
│ [Khám phá sản phẩm]      │
│ [      hero image      ] │
├──────────────────────────┤
│ Bạn đang tìm món nào?    │
│ [Mã GTG01              ] │
│ [    Tìm sản phẩm       ]│
├──────────────────────────┤
│ [Tất cả][Góc học] ... →  │ only horizontal scroll
├──────────────────────────┤
│ Mới được review          │
│ ┌──────────────────────┐ │
│ │ 1:1 product image    │ │
│ │ code · reviewed      │ │
│ │ name / pro / con     │ │
│ │ price / CTAs         │ │
│ └──────────────────────┘ │
│ one-column card list     │
├──────────────────────────┤
│ Collections / Problems   │
│ Review commitment        │
│ TikTok thumbnails        │
│ Footer disclosure        │
└──────────────────────────┘
```

Product detail giữ CTA chính trong nội dung và thêm sticky CTA 48 px với `safe-area-inset-bottom` trên mobile.

## 4. Design tokens

| Token | Value | Use |
|---|---:|---|
| primary | `#3A7D44` | primary action, active state |
| primary-dark | `#285B32` | heading, hover, dark section |
| accent | `#FF8A3D` | affiliate CTA |
| background | `#FFF8E7` | warm page canvas |
| surface | `#FFFFFF` | cards and input |
| text | `#20241F` | main copy |
| text-muted | `#687066` | supporting copy |
| success | `#348A48` | advantages |
| warning | `#D97706` | caveats |
| error | `#C2413B` | errors |
| border | `#E7E4DA` | subtle separation |
| card radius | `16px` | content surfaces |
| control radius | `12px` | buttons and input |
| typeface | Be Vietnam Pro | all public pages |
| content max | `1280px` | desktop layout |

## 5. Component inventory

- Sticky public header and compact mobile menu
- Brand logo lockup
- Hero with editorial room image
- Product-code search and result announcement
- Horizontally scrolling category chips
- Product card with benefit, caution, freshness and disclosure
- Collection and problem cards
- Trust/commitment item
- Lazy TikTok thumbnail card
- Breadcrumb
- Product gallery
- Review summary, pro and con panels
- Alternative product card
- Mobile sticky affiliate CTA
- Empty/search error panel

## 6. Search and system states

- Default: helper copy and all products.
- Typing: preserve entered text; submit via keyboard or button.
- Results: count and filtered cards.
- Empty: repeat query, give corrective examples, offer reset.
- Loading: reserve 1:1 media and text space; use neutral skeleton with reduced-motion support.
- Out of stock: replace price CTA with “Xem sản phẩm thay thế”.
- Expired affiliate link: disable external CTA and explain link is being rechecked.
- Stale price: show “Giá chưa được cập nhật” instead of a numeric price.
- Hidden product: remove from discovery; direct URL returns unavailable guidance.
- Connection error: retain query and provide a retry action.

## 7. Responsive behavior

- Mobile `<640`: one product column; hero stacked; full-width CTAs; sticky detail CTA.
- Tablet `640–1023`: two product columns; hero becomes two columns from `768px`.
- Desktop `≥1024`: three product columns with 1280 px maximum; five collection columns; no sticky CTA.
- Only category chips intentionally scroll horizontally.
- Images use fixed aspect ratios to prevent CLS; below-fold images are lazy-loaded.

## 8. Accessibility notes

- Semantic headings, navigation, forms, articles and links.
- Search has a programmatic label and keyboard submission.
- Category selection uses `aria-pressed`; menu exposes `aria-expanded`.
- Benefits/cautions use icons plus text, never color alone.
- Interactive controls are at least 44–48 px high with visible focus rings.
- Product imagery has meaningful Vietnamese alt text; decorative thumbnails use empty alt.
- Motion is subtle and disabled through `motion-reduce` where used.
- Text contrast is designed for WCAG AA on cream/white surfaces.

## 9. Prototype and analytics notes

- Hero CTA scrolls to products.
- Search scrolls to results and emits `product_search`.
- Category chips filter locally and emit `category_selected`.
- Product entry emits `product_view` with placement.
- Affiliate links emit `affiliate_click` with `featured_product`, `product_detail`, or `sticky_mobile`.
- Collections emit `collection_opened`.
- Review video emits `product_review_opened`; TikTok cards emit `tiktok_video_opened`.
- Events currently dispatch as `gtg:analytics` browser custom events, ready for a first-party analytics adapter.
