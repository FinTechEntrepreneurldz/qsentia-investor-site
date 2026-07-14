# QSentia Premium Tech-Monospace Design Guide

This document defines the design principles, color systems, typography rules, and component patterns established in the overhauled [`app/page.tsx`](file:///e:/Thispc/Desktop/qsentia-investor-site/app/page.tsx) and navigation bar. Refer to these rules when building or modifying pages across the site.

---

## 1. Color Palette & Dark Mode Strategy

QSentia uses a clean, high-contrast, institutional black-and-white theme with dark zinc-gray borders, utilizing Emerald for gains and Rose for losses.

| Token | Light Theme Value | Dark Theme Value | Tailwind Utility Class |
| :--- | :--- | :--- | :--- |
| **Primary Background** | `#ffffff` (White) | `#09090b` (Zinc-950) | `bg-white dark:bg-[#09090b]` |
| **Accent Background** | `#f9fafb` (Zinc-50) | `#000000` (Pure Black) | `bg-zinc-50 dark:bg-black` |
| **Primary Borders** | `#e4e4e7` (Zinc-200) | `#27272a` (Zinc-800) | `border-zinc-200 dark:border-zinc-800` |
| **Secondary Borders** | `#f4f4f5` (Zinc-100) | `#18181b` (Zinc-900) | `border-zinc-100 dark:border-zinc-900` |
| **Primary Text** | `#09090b` (Zinc-950) | `#ffffff` (Pure White) | `text-zinc-950 dark:text-white` |
| **Secondary Text** | `#52525b` (Zinc-600) | `#a1a1aa` (Zinc-400) | `text-zinc-600 dark:text-zinc-400` |
| **Muted/Caption Text** | `#71717a` (Zinc-500) | `#71717a` (Zinc-500) | `text-zinc-500` |
| **Positive State (Gain)** | `#10b981` (Emerald-500) | `#34d399` (Emerald-400) | `text-emerald-600 dark:text-emerald-400` |
| **Negative State (Loss)** | `#f43f5e` (Rose-500) | `#fb7185` (Rose-400) | `text-rose-600 dark:text-rose-400` |

---

## 2. Typography Hierarchy

Fonts must blend a **bold, heavy sans-serif** (for headlines) with a **structured monospace** (for eyebrows, data, metrics, and navigation).

### Headlines & Primary Titles
- **Properties**: Bold/Extra-bold, uppercase, very tight line-height, tight tracking.
- **Classes**: `font-extrabold tracking-tight uppercase leading-[0.95]`
- **Sizes**: `text-4xl sm:text-6xl md:text-7xl` (for Hero), `text-2xl sm:text-3xl` (for Section headers).

### Section Eyebrows
- **Properties**: Monospace, small, bold, uppercase, wide letter-spacing.
- **Classes**: `font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase`

### Data Labels & Action Links
- **Properties**: Monospace, small, bold, uppercase, medium letter-spacing.
- **Classes**: `font-mono text-[11px] font-bold tracking-wider uppercase`

---

## 3. Flat Buttons vs. Softer Cards (Border Radius)

To maintain a high-contrast tech look while preserving a clean card layout:
- **Buttons, dropdown actions, and inputs** must remain sharp and flat with **zero rounded corners** (`rounded-none`).
- **Primary cards and outer grids** (such as `SectionCard` or section containers) must have a subtle, premium border radius of **`10-15px`** (using `rounded-[12px]` or `rounded-xl`).
- **Nested components** (such as status badges or mini metric sub-boxes) should have smaller, matching corners (such as `rounded-[4px]` or `rounded-[8px]`) to maintain nesting proportions.

### Primary Buttons (Solid fill)
- **Classes**: `inline-flex h-11 items-center justify-center bg-zinc-950 text-white dark:bg-[#eeeeee] dark:text-black px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase transition hover:bg-zinc-800 dark:hover:bg-white rounded-none`

### Secondary Buttons (Outline border)
- **Classes**: `inline-flex h-11 items-center justify-center bg-transparent px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-900 dark:hover:border-white transition rounded-none`

### Form Selects & Inputs
- **Classes**: `rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] px-3 py-2 font-mono text-xs text-zinc-950 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition`

---

## 4. Grid Divider Lines Pattern

To get the clean, thin border dividers shown in the Problem Section grid, avoid standard Tailwind `gap-4`. Instead, use a **border-wrapper** pattern with a `gap-px` background color showing through, wrapping the parent with `rounded-[12px] overflow-hidden`:

```tsx
<div className="grid gap-px overflow-hidden bg-zinc-200 dark:bg-zinc-800 sm:grid-cols-3 border border-zinc-200 dark:border-zinc-800 rounded-[12px]">
  <div className="bg-white dark:bg-[#09090b] p-8">
    <h3 className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">ACCESS</h3>
    <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Content goes here...</p>
  </div>
  <div className="bg-white dark:bg-[#09090b] p-8">
    <h3 className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">TRUST</h3>
    <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Content goes here...</p>
  </div>
  <div className="bg-white dark:bg-[#09090b] p-8">
    <h3 className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">USE</h3>
    <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Content goes here...</p>
  </div>
</div>
```

---

## 5. Scrolling Ticker Tape Pattern

Use this container for a continuous stock index or metrics tape across sections:

```tsx
<div className="ticker-container border-y border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-black py-3 overflow-hidden">
  <div className="flex animate-marquee whitespace-nowrap gap-12 font-mono text-[10px] tracking-wider text-zinc-500">
    <div className="flex items-center gap-12 shrink-0">
      <TickerItem symbol="ES1!" value="5,238.50" change="+0.62%" isPositive />
      <TickerItem symbol="NQ1!" value="18,421.75" change="+0.44%" isPositive />
    </div>
    <div className="flex items-center gap-12 shrink-0" aria-hidden="true">
      <TickerItem symbol="ES1!" value="5,238.50" change="+0.62%" isPositive />
      <TickerItem symbol="NQ1!" value="18,421.75" change="+0.44%" isPositive />
    </div>
  </div>
</div>
```

*Note: The `.ticker-container:hover .animate-marquee` rule inside [`app/globals.css`](file:///e:/Thispc/Desktop/qsentia-investor-site/app/globals.css) will automatically pause the animation when hovered.*
