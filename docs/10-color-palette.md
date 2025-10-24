# 10 – Color Palette & Visual Language

URUK uses a dark, neon-accented palette that supports the premium gaming aesthetic of the app. This reference keeps designers and developers aligned when adding new screens.

## Core Palette

| Token | Hex | Usage |
| ----- | --- | ----- |
| `color.background` | `#0B0B0B` | Primary background for pages, panels, and modals. |
| `color.accent.gold` | `#FFC107` | Primary highlight for buttons, active icons, and key metrics. |
| `color.accent.goldDark` | `#A37C00` | Hover states and secondary accents that need depth. |
| `color.accent.goldShadow` | `#2A1D00` | Shadows, overlays, and subtle separators beneath gold elements. |
| `color.accent.goldLight` | `#FFD54F` | Gradients, glows, or hover states that require a lighter touch. |
| `color.text.secondary` | `#BEBEBE` | Secondary text, helper copy, and inactive labels. |
| `color.text.primary` | `#FFFFFF` | Primary text on dark backgrounds. |

## Gradients & Lighting
- Combine `color.accent.gold` with `color.accent.goldLight` for button hover transitions.
- Use `color.accent.goldShadow` sparingly under glowing elements to maintain contrast.
- Keep gradients subtle; opacity layers (`rgba(255, 193, 7, 0.1)`) work well for hover backgrounds.

## Overlays
- Modal backgrounds often use `rgba(0, 0, 0, 0.6)` plus a blur (`backdrop-blur-sm`) to stay readable.
- Toasts and badges use translucent backgrounds (e.g. `bg-black/80`) with accent-colored borders.

## Accessibility Tips
- Maintain a minimum text contrast ratio of 4.5:1 by pairing `#FFFFFF` text with backgrounds darker than `#1A1A1A`.
- For smaller text on gold backgrounds, switch text color to `#0B0B0B` for legibility.
- The connection badge uses green (`#34D399`) and red (`#F87171`) variants internally; reuse those for status feedback if needed.

## Assets
- Icons are SVG-based components under `components/icons.tsx` and inherit color through `currentColor`, so simply wrapping them with the proper class applies the palette.
- Images for lotteries and banners can be desaturated slightly to avoid clashing with the vibrant gold accents.

Stick to these tokens to keep the experience cohesive across new features and documentation screenshots.
