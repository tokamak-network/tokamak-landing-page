# Tokamak Card Styles Documentation

A collection of 5 sci-fi themed card styles for displaying metrics, data, and content across the Tokamak Network landing page.

---

## Style Overview

### Style 1 — Radial Gauge

**Visual Identity:** Circular SVG progress indicator with centered data.

**When to Use:**
- Percentage-based metrics (completion, utilization, health)
- Progress tracking
- System status indicators
- KPI dashboards

**Best Fit:**
- Tower Floor 2 (Data Console) for system metrics
- Dashboard sections for real-time monitoring

**Key Features:**
- SVG circle with `stroke-dasharray` for smooth progress arc
- Clean, minimal design
- Easy to scan at a glance
- Accessible percentage values

**CSS Classes:**
- `.card-radial-gauge` — container
- `.radial-gauge-container` — SVG wrapper
- `.radial-gauge-svg` — SVG element (rotated -90deg)
- `.radial-gauge-bg` — background circle
- `.radial-gauge-progress` — animated progress arc
- `.radial-gauge-center` — centered data container
- `.radial-gauge-value` — main numeric value
- `.radial-gauge-label` — metric label
- `.radial-gauge-footer` — description text

**Colors:**
- Primary: `#2A72E5` (Tokamak Blue)
- Background track: `rgba(42, 114, 229, 0.1)`
- Border: `rgba(42, 114, 229, 0.3)`
- Card background: `rgba(20, 25, 35, 0.8)`

**Animations:**
- Smooth `stroke-dashoffset` transition (0.5s ease) on progress changes

**Implementation Notes:**
```javascript
// Calculate stroke-dashoffset for percentage
const radius = 70;
const circumference = 2 * Math.PI * radius; // 439.8
const offset = circumference - (percentage / 100) * circumference;
```

---

### Style 3 — Brutalist Typography

**Visual Identity:** Minimalist design with oversized numbers and outline text.

**When to Use:**
- High-impact headline metrics
- Hero statistics
- Large summary numbers (TVL, transaction counts, user metrics)
- Editorial emphasis

**Best Fit:**
- Landing page hero section
- Tower overview stats
- Marketing/promotional sections

**Key Features:**
- No background or frame — pure typography
- Giant numbers (52px Orbitron 900 weight)
- Outline-only secondary text (`-webkit-text-stroke`)
- Bold 3px solid divider under value
- Label positioned below value for hierarchy

**CSS Classes:**
- `.card-brutalist` — container (transparent bg)
- `.brutalist-value` — main number
- `.brutalist-divider` — horizontal line separator
- `.brutalist-label` — outline text label
- `.brutalist-secondary` — optional description

**Colors:**
- Value: `#2A72E5` (Tokamak Blue)
- Divider: `#2A72E5`
- Label outline: `rgba(255, 255, 255, 0.6)` with transparent fill
- Secondary text: `rgba(255, 255, 255, 0.5)`

**Typography:**
- Value font: Orbitron 900, 52px
- Label: 14px uppercase, 2px letter-spacing
- Secondary: 16px

**Animations:**
- None (static design for clarity)

**Implementation Notes:**
```css
.brutalist-label {
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.6);
  /* Creates outline-only effect */
}
```

---

### Style 4 — Glitch

**Visual Identity:** Dark cyberpunk aesthetic with scan line and periodic glitch effect.

**When to Use:**
- Live/real-time data feeds
- System diagnostics
- Technical metrics (block height, gas price, TPS)
- Futuristic/hacker aesthetic sections

**Best Fit:**
- Tower Floor 3 (Thanos L2) technical overlays
- Developer-focused dashboards
- Real-time blockchain data

**Key Features:**
- Animated scan line sweeping top to bottom
- Horizontal scanline noise overlay
- Periodic RGB split glitch on text (93-97% of 4s cycle)
- Dark translucent background

**CSS Classes:**
- `.card-glitch` — container with pseudo-elements
- `.glitch-content` — content wrapper (z-index layering)
- `.glitch-label` — metric label
- `.glitch-value` — animated value
- `.glitch-secondary` — description text

**Colors:**
- Background: `rgba(10, 14, 22, 0.95)`
- Border: `rgba(42, 114, 229, 0.4)`
- Value: `#2A72E5`
- Scan line: `rgba(42, 114, 229, 0.5)`
- Glitch RGB split: `#ff0000` (red), `#00ffff` (cyan)

**Animations:**
```css
@keyframes scanline {
  0% { top: 0; }
  100% { top: 100%; }
}
/* Duration: 3s linear infinite */

@keyframes glitch {
  0%, 92% { /* normal state */ }
  93%-96% { /* RGB split + distortion */ }
  96%, 100% { /* return to normal */ }
}
/* Duration: 4s infinite */
```

**Implementation Notes:**
- `::before` pseudo-element for scan line
- `::after` pseudo-element for horizontal scanline overlay
- Use `repeating-linear-gradient` for scanline texture
- Glitch triggers briefly then resets for dramatic effect

---

### Style 6 — Dot Matrix / LED

**Visual Identity:** LED display with dot grid overlay and glowing text.

**When to Use:**
- Retro futuristic data displays
- Progress bars with completion metrics
- Digital readout aesthetic
- Status monitors

**Best Fit:**
- Retro-themed sections
- Tower Floor 1 (Base Layer) for nostalgic tech aesthetic
- Legacy system interfaces

**Key Features:**
- Subtle dot grid pattern overlay (6px spacing)
- Strong blue glow on value text
- Bottom progress bar with gradient
- Thick border and rounded corners
- Very dark background

**CSS Classes:**
- `.card-dot-matrix` — container with dot pattern
- `.dot-matrix-content` — content wrapper
- `.dot-matrix-label` — metric label
- `.dot-matrix-value` — glowing main value
- `.dot-matrix-progress-container` — progress bar wrapper
- `.dot-matrix-progress-bar` — animated bar fill
- `.dot-matrix-footer` — description text

**Colors:**
- Background: `#040810`
- Border: `#111820` (2px solid)
- Value: `#2A72E5` with glow
- Dots: `rgba(42, 114, 229, 0.08)`
- Progress gradient: `#2A72E5` → `#00d4ff`

**Animations:**
- Smooth progress bar width transition (0.5s ease)

**Typography:**
- Value font: Orbitron 900, 42px
- Strong text-shadow for LED glow effect

**Implementation Notes:**
```css
.card-dot-matrix::before {
  background-image: radial-gradient(
    circle,
    rgba(42, 114, 229, 0.08) 1px,
    transparent 1px
  );
  background-size: 6px 6px;
}

.dot-matrix-value {
  text-shadow:
    0 0 20px rgba(42, 114, 229, 0.8),
    0 0 40px rgba(42, 114, 229, 0.4);
}
```

---

### Style 10 — Retro CRT Monitor

**Visual Identity:** Old-school phosphor monitor with green text and scan lines.

**When to Use:**
- Command line / terminal aesthetic
- Retro computing nostalgia
- Developer tools / diagnostics
- System logs or console output

**Best Fit:**
- Retro TV section
- Developer CTA areas
- Technical documentation displays
- Easter egg / hidden terminal interfaces

**Key Features:**
- Green phosphor color (`#00ff64`)
- Horizontal scanline overlay
- Vignette effect (darkened edges)
- Command prompt style with blinking cursor
- Deep inset shadow for CRT depth
- Thick rounded border

**CSS Classes:**
- `.card-crt` — container with CRT effects
- `.crt-content` — content wrapper
- `.crt-label` — command prompt style label
- `.crt-value` — glowing green value
- `.crt-prompt` — terminal prompt line
- `.crt-cursor` — blinking cursor block

**Colors:**
- Background: `#020408`
- Border: `#001a0d` (3px solid)
- All text: `#00ff64` (green phosphor)
- Scanlines: `rgba(0, 255, 100, 0.03)`
- Glow: green text-shadow with multiple layers

**Animations:**
```css
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
/* Cursor blink: 1s step-end infinite */
```

**Typography:**
- Value font: Orbitron 900, 38px
- All text uses Share Tech Mono for monospace feel
- Command prompt prefix: `> ` before text

**Implementation Notes:**
- Three layers of effects via `::before`, `::after`, and `.crt-content` z-index
- `repeating-linear-gradient` for scanlines (2px transparent, 2px green tint)
- `radial-gradient` vignette from center to edges
- `box-shadow: inset` for depth effect
- Blinking cursor as inline-block span with background animation

---

## CSS Naming Convention

All styles follow BEM-style naming:

```
.card-{style-name}               — Block (container)
.{style-name}-{element}           — Element (child)
.{style-name}-{element}--{modifier} — Modifier (variant)
```

Examples:
- `.card-radial-gauge`
- `.radial-gauge-value`
- `.dot-matrix-progress-bar`

---

## Brand Colors

**Primary:**
- Tokamak Blue: `#2A72E5`

**Accent (by style):**
- Glitch RGB split: `#ff0000`, `#00ffff`
- LED gradient: `#2A72E5` → `#00d4ff`
- CRT phosphor: `#00ff64`

**Neutral:**
- Dark backgrounds: `#0a0e16`, `#020408`, `#040810`
- Borders: `rgba(42, 114, 229, 0.3)` to `0.4`
- Text faded: `rgba(255, 255, 255, 0.5)` to `0.7`

---

## Typography

**Display/Numbers:**
- Font: Orbitron (weights: 400, 700, 900)
- Use: Large values, headlines, emphasis
- Load: `https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap`

**Monospace/Technical:**
- Font: Share Tech Mono
- Use: Labels, descriptions, code-like text
- Load: `https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap`

---

## Animation Performance

All animations use GPU-accelerated properties:
- `transform` (translateX, skewX, rotate)
- `opacity`
- `stroke-dashoffset`
- Avoid animating `width`, `height`, `top`, `left` where possible

For best performance on mobile:
- Use `will-change` sparingly
- Prefer `transform` over positional properties
- Keep animation durations under 5s for looping effects

---

## Responsive Considerations

**Grid Layout:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}
```

**Breakpoints:**
- Mobile: scale down font sizes by 20-30%
- Tablet: 2-column grid
- Desktop: 3-4 column grid

**Touch Targets:**
- Minimum 44x44px for interactive elements
- Add padding to card containers for easier tapping

---

## Integration with Next.js/React

Convert static HTML to React components:

```tsx
interface RadialGaugeProps {
  value: number;
  label: string;
  footer: string;
}

export function RadialGauge({ value, label, footer }: RadialGaugeProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="card-radial-gauge">
      <div className="radial-gauge-container">
        <svg className="radial-gauge-svg" viewBox="0 0 160 160">
          <circle className="radial-gauge-bg" cx="80" cy="80" r="70" />
          <circle
            className="radial-gauge-progress"
            cx="80"
            cy="80"
            r="70"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="radial-gauge-center">
          <div className="radial-gauge-value">{value}%</div>
          <div className="radial-gauge-label">{label}</div>
        </div>
      </div>
      <div className="radial-gauge-footer">{footer}</div>
    </div>
  );
}
```

---

## Accessibility

**ARIA Labels:**
- Add `aria-label` for progress indicators
- Use `role="status"` for live-updating values
- Provide text alternatives for visual effects

**Contrast:**
- All text meets WCAG AA standards (4.5:1 minimum)
- Glowing text has sufficient contrast even with effects

**Animation Sensitivity:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## File Structure

```
src/app/components/ui/sections/card-styles/
├── reference.html          — Standalone preview (this file)
├── CARD-STYLES.md          — Documentation (this file)
├── RadialGauge.tsx         — React component
├── BrutalistCard.tsx       — React component
├── GlitchCard.tsx          — React component
├── DotMatrixCard.tsx       — React component
├── CRTCard.tsx             — React component
└── card-styles.css         — Shared CSS module
```

---

## Usage Examples

**Dashboard Metrics (Radial Gauge):**
```tsx
<RadialGauge value={75} label="Complete" footer="Network Utilization" />
```

**Hero Stats (Brutalist):**
```tsx
<BrutalistCard value="2.4M" label="Total Transactions" secondary="+12.3% from last month" />
```

**Real-time Data (Glitch):**
```tsx
<GlitchCard label="Block Height" value="8,452,109" secondary="Latest confirmed" />
```

**Progress Tracking (Dot Matrix):**
```tsx
<DotMatrixCard label="Bridge Volume (24h)" value="$4.2M" progress={68} footer="68% of daily capacity" />
```

**Terminal Output (CRT):**
```tsx
<CRTCard label="$ system.status" value="99.8%" prompt="> delta: +2.4%" />
```

---

## Best Practices

1. **Style Consistency:** Use one primary style per section/floor for visual coherence
2. **Data Hierarchy:** Brutalist for headlines → Radial/Dot Matrix for secondary metrics
3. **Animation Budget:** Limit glitch/CRT effects to 3-4 cards per viewport to avoid performance issues
4. **Color Harmony:** Stick to Tokamak Blue (#2A72E5) as primary accent across all styles
5. **Readability First:** Ensure all text remains readable even with visual effects applied

---

## Version History

- **v1.0** (2026-03-29): Initial 5-style card system with React integration guidelines
