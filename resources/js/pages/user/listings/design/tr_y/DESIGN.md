---
name: Trọ Đây
colors:
  surface: '#FFFFFF'
  surface-dim: '#d9dbd3'
  surface-bright: '#f9faf2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4ec'
  surface-container: '#edefe7'
  surface-container-high: '#e7e9e1'
  surface-container-highest: '#e1e3db'
  on-surface: '#191c18'
  on-surface-variant: '#55433d'
  inverse-surface: '#2e312c'
  inverse-on-surface: '#f0f2e9'
  outline: '#88726c'
  outline-variant: '#dbc1b9'
  surface-tint: '#974729'
  primary: '#873c1f'
  on-primary: '#ffffff'
  primary-container: '#a65334'
  on-primary-container: '#ffe7e0'
  inverse-primary: '#ffb59b'
  secondary: '#934a28'
  on-secondary: '#ffffff'
  secondary-container: '#ffa178'
  on-secondary-container: '#783615'
  tertiary: '#5b504a'
  on-tertiary: '#ffffff'
  tertiary-container: '#746862'
  on-tertiary-container: '#f9e9e1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59b'
  on-primary-fixed: '#380d00'
  on-primary-fixed-variant: '#783114'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb596'
  on-secondary-fixed: '#360f00'
  on-secondary-fixed-variant: '#753313'
  tertiary-fixed: '#efdfd7'
  tertiary-fixed-dim: '#d3c4bc'
  on-tertiary-fixed: '#221a15'
  on-tertiary-fixed-variant: '#4f453f'
  background: '#f9faf2'
  on-background: '#191c18'
  surface-variant: '#e1e3db'
  page-bg: '#F2F3F2'
  primary-dark: '#8F432A'
  muted-text: '#62655E'
  border-subtle: '#D5D7D2'
typography:
  display:
    fontFamily: Be Vietnam Pro
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  price-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
  price-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

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
