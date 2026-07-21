# Walt Solar , Tesla-grade Minimalist Redesign Brief

## 0. Chosen Direction
**Palette Variant B , Brushed Gold.** Accent = `#C8A24B` (premium, luxe). This brief assumes it.

## 1. Vision & North Star
A **premium, minimalist, content-first** experience inspired by `tesla.com`: full-bleed media, vast whitespace, near-invisible chrome, one typeface, restrained motion, a **strict 3-color palette**. If an element doesn't aid comprehension or conversion, remove it.

**Principles**
- **Whitespace is the hero** , tall, uncluttered sections.
- **Monochrome + one accent** , color as punctuation, not decoration.
- **Media does the talking** , large, calm visuals; short overlay text.
- **Motion is a whisper** , slow fades/translations only; no neon, glow, pulse, spin.
- **One idea per screen** , a single point and a single CTA per section.

## 2. Color System (max 3 colors)
"3 colors" = **2 neutrals (black + white) + 1 accent**, with all grays as *opacities of ink*.

| Token | Hex | Role | Budget |
|-------|-----|------|--------|
| `ink` | `#0E0E0E` | Text, dark sections, footer, primary buttons | ~30% |
| `paper` | `#FFFFFF` | Backgrounds, light text on dark | ~65% |
| `solar` | `#C8A24B` | **Single accent** , one primary CTA + tiny highlights | **<5%** |

Derived neutrals (not new colors): `rgba(14,14,14, α)` → borders `.10`, muted text `.55`, tinted surface `.03`. On dark, invert with `rgba(255,255,255, α)`.

**Tailwind config:**
```js
colors: { ink: "#0E0E0E", paper: "#FFFFFF", solar: "#C8A24B" }
```

## 3. Typography
One family (**Inter**), weights **400 / 500** (600 only on the primary CTA). Display tracking `-0.02em`.

| Level | Size | Weight |
|-------|------|--------|
| Hero display | `clamp(2.75rem, 7vw, 6rem)` | 500 |
| Section title | `clamp(1.9rem, 4vw, 3.25rem)` | 500 |
| Body | `1–1.125rem`, `line-height 1.6` | 400 |
| Eyebrow | `0.72rem`, `uppercase`, `tracking .2em` | 500 |

## 4. Layout, Grid & Spacing
- **8px base.** Section padding `96px → 160px` desktop.
- **Container** `max-w 1280–1440px`; heroes/showcase are **full-bleed**.
- **Hero = full viewport** (`100svh`): one background video, centered headline + subcopy + two buttons.
- **Radius:** buttons **pill**; cards/inputs `8–14px`.
- **Borders:** hairline `1px solid ink/10` instead of shadows.

## 5. Motion
- Allowed: opacity + `translateY(≤20px)`; hero media slow zoom (`scale 1→1.06`).
- Durations `0.6–0.9s`, easing `cubic-bezier(.22,.61,.36,1)`.
- Removed: spinning sun, pulsing FAB, floating cards, neon glows, hover-grow underlines.
- Honor `prefers-reduced-motion`.

## 6. Components
- **btn-primary** = ink pill / paper text. **btn-solar** = gold pill / ink text (key CTAs only). **btn-ghost / btn-outline / btn-outline-light** = hairline outlines that adapt to light/dark.
- **Nav** , transparent white-on-hero, solidifies to `paper/85 + blur + hairline` on scroll; logo inverts to white at top.
- **Cards** , flat, hairline border, no glow/gradient.
- **Inputs** , subtle fill/hairline, focus ring = `solar`.
- **WhatsApp** , monochrome (ink) to respect the 3-color rule.

## 7. Section Map
Hero (full-bleed video) · Brands (grayscale wordmarks) · Showcase (full-bleed carousel) · About/Stats · Systems (hairline cards) · Catalog (dark, gold accents) · Compare (hairline table + gold/ink bars) · Why/Process (editorial top-border blocks) · Coverage (grayscale maps) · Contact (dark) · Footer (dark) · WhatsApp FAB.

## 8. File Map
- `index.html` , 3-color Tailwind tokens, Inter only, full-bleed hero, palette utility swaps, removed neon/glow nodes + GSAP.
- `css/styles.css` , rewritten to the flat ink/paper/solar system (hairlines, pills, nav states, reveal).
- `js/main.js` , removed GSAP float animation; recolored chart legend.
- `data/pricing.json` , unchanged.

## 9. Do / Don't
**Do:** whitespace, hairlines, one accent, calm media, few weights, slow fades.
**Don't:** gradients, glassmorphism, neon/glow, stacked shadows, >1 accent per screen, decorative motion.

## 10. Acceptance Criteria
- Only 3 colors resolve (neutrals = opacities of `ink`); accent surface `< 5%`.
- Full-viewport hero with single media + centered content.
- No glow/neon/gradient/pulse/spin; motion respects reduced-motion.
- Fully responsive; catalog filter, modal, mailto/WhatsApp, comparison all intact.
