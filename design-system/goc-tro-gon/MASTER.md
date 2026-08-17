# Góc Trọ Thông Minh Design System

> Source: project brief + UI UX Pro Max general accessibility/performance rules. The skill database returned an off-topic spiritual/luxury match twice, so no generated palette or typography recommendation was retained.

## Design read

Mobile-first affiliate review landing page for Vietnamese students living in small rental rooms. Warm utility editorial: youthful and useful, never childish, luxurious, or marketplace-like.

## Dials

- Variance: 6/10 — balanced editorial rhythm, a few asymmetric grids.
- Motion: 2/10 — hover/press feedback only; no GSAP or scroll choreography.
- Density: 4/10 — scannable product details with comfortable touch spacing.

## Semantic tokens

| Token | Value | Purpose |
|---|---:|---|
| `--gtg-bg` | `#FFF8E7` | warm page background |
| `--gtg-surface` | `#FFFFFF` | cards and controls |
| `--gtg-text` | `#20241F` | primary text |
| `--gtg-muted` | `#687066` | secondary text |
| `--gtg-primary` | `#3A7D44` | brand/action |
| `--gtg-primary-dark` | `#285B32` | headings/action hover |
| `--gtg-primary-soft` | `#E5F0E6` | selected/supporting surface |
| `--gtg-accent` | `#FF8A3D` | TikTok Shop affiliate CTA |
| `--gtg-border` | `#E7E4DA` | dividers and card outlines |

Typography: Be Vietnam Pro, body 16px minimum, body line-height 1.5–1.75. Prices use tabular figures. Heading weights 600–700.

## Components

- Card radius: 16px; controls: 12px.
- Touch controls: at least 44px, primary CTA 48px.
- One icon family: Lucide, 1.5–2px outline style; decorative icons use `aria-hidden`.
- Product cards always show one benefit and one caveat.
- Search remains directly after the hero and offers keyboard/touch suggestions.
- Affiliate actions always explain that checkout occurs on TikTok Shop.

## Layout

- 375px: one-column product list; horizontally scrollable category chips only.
- 768px: two-column hero and product grid.
- 1024px: three product columns and editorial collection grid.
- 1440px: content remains within `max-w-7xl`.

## Avoid

- Emoji used as structural icons.
- Raw per-component brand colors when a semantic token exists.
- Carousels, autoplay video, gradients, glassmorphism, fake urgency, fake ratings.
- Animation that hides content or ignores reduced motion.
