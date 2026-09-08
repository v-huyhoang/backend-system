# Góc Trọ Gọn Design System

## Product direction

Mobile-first rental-listing platform for Vietnamese tenants and landlords.
The experience should feel trustworthy, calm, practical, and easy to scan.
Avoid marketplace pressure patterns, fake social proof, and visual clutter.

## Semantic tokens

| Token | Value | Purpose |
| --- | --- | --- |
| `--gtg-bg` | `#FFF8E7` | Warm supporting background |
| `--gtg-surface` | `#FFFFFF` | Cards and controls |
| `--gtg-text` | `#20241F` | Primary text |
| `--gtg-muted` | `#687066` | Secondary text |
| `--gtg-primary` | `#3A7D44` | Primary action |
| `--gtg-primary-dark` | `#285B32` | Heading/action hover |
| `--gtg-primary-soft` | `#E5F0E6` | Selected/supporting surface |
| `--gtg-border` | `#E7E4DA` | Borders and dividers |

Typography uses Be Vietnam Pro, a 16px minimum body size, and 1.5–1.75 line
height. Prices use tabular figures. Heading weights are 600–700.

## Components and interaction

- Card radius: 16px; controls: 12px.
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
