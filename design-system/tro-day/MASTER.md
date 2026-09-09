# Trọ Đây Design System

## Product direction

Mobile-first rental-listing platform for Vietnamese tenants and landlords.
The experience should feel trustworthy, calm, practical, and easy to scan.
Avoid marketplace pressure patterns, fake social proof, and visual clutter.

## Semantic tokens

| Token                | Value     | Purpose                     |
| -------------------- | --------- | --------------------------- |
| `--gtg-bg`           | `#F2F3F2` | Soft gray page background   |
| `--gtg-surface`      | `#FFFFFF` | Cards and controls          |
| `--gtg-text`         | `#252823` | Primary text                |
| `--gtg-muted`        | `#62655E` | Secondary text              |
| `--gtg-primary`      | `#A65334` | Accessible orange action    |
| `--gtg-primary-dark` | `#8F432A` | Action hover                |
| `--gtg-primary-soft` | `#F4E4DC` | Selected/supporting surface |
| `--gtg-accent`       | `#B96843` | Terracotta emphasis         |
| `--gtg-border`       | `#D5D7D2` | Borders and dividers        |

Typography uses Be Vietnam Pro, a 16px minimum body size, and 1.5–1.75 line
height. Prices use tabular figures. Heading weights are 600–700.

## Components and interaction

- Card radius: 12px; controls: 10px.
- Interactive controls are at least 44px high; primary CTA is at least 48px.
- Use Lucide icons. Decorative icons must have `aria-hidden="true"`.
- Every listing card should prioritize price, area, location, availability, and a
  representative image.
- Filters need visible labels, clear/reset actions, and URL-backed state.
- Do not rely on color alone for listing or moderation status.
- Provide loading, empty, error, unavailable, rented, and expired states.
- Preserve visible keyboard focus and respect reduced-motion preferences.

## Responsive layout

- 375px: single-column results and stacked filters.
- 768px: two-column listing grid; filters may use a sheet or compact row.
- 1024px: optional filter sidebar and three-column listing grid.
- 1440px: content stays within `max-w-7xl`.

## Avoid

- Emoji as structural icons.
- Carousels and autoplay media.
- Fake urgency, fake ratings, or unverified trust claims.
- Hiding essential rent, fees, address area, or listing state.
- Raw component colors when a semantic token exists.
