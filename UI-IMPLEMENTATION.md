# Aegis Legacy Protocol - UI Implementation Guide

## Overview
Complete styling and component system for the Aegis Legacy Protocol Truth Engine with three implementation options.

## Files & Versions

### 1. **index-leaflet-mobile.html** (PRIMARY - Mobile Optimized)
- **Map Engine:** Leaflet.js v1.9.4 (lightweight, mobile-friendly)
- **Button Style:** Transparent background with glowing green borders
- **Layout:** Sticky control deck at bottom for thumb accessibility
- **Features:**
  - 3 map layer switchers (Roadmap, Satellite, Terrain)
  - System console output panel
  - Core diagnostic runnable via button
  - Clean, minimal HUD aesthetic
- **Best For:** Mobile devices, progressive web apps, low-bandwidth deployments

### 2. **index.html** (Google Maps with Theme System)
- **Map Engine:** Google Maps API
- **Features:**
  - External stylesheet integration (`aegis-theme.css`)
  - Button variant classes: `.transparent-bg`, `.solid-bg`, `.danger`, `.success`, `.warning`
  - Full responsive grid layout
  - Street View integration
  - Console logging system
- **Best For:** Desktop-first deployments, advanced map features

### 3. **aegis-theme.css** (Component Library)
- **CSS Variables:** Color palette, typography, shadow/glow effects
- **Button System:** 6 variants with hover/active states
- **Components:** Panels, status indicators, console output styling
- **Utilities:** Glow classes, responsive breakpoints
- **Best For:** Consistent branding across entire application

---

## Button Implementation Options

### Option A: Transparent Background (Current Implementation)
```css
button { 
    background: rgba(0, 255, 65, 0.0);      /* Completely clear */
    border: 1px solid #00ff41;               /* Sharp green border */
    color: #00ff41;                          /* Glowing text */
}
button:hover { 
    background: rgba(0, 255, 65, 0.25);     /* 25% fill on hover */
    text-shadow: 0 0 5px #00ff41;
}
```

### Option B: Using Theme Classes (With aegis-theme.css)
```html
<!-- Transparent variant -->
<button class="transparent-bg">View Mode</button>

<!-- Solid variant -->
<button class="solid-bg">Activate</button>

<!-- Danger state -->
<button class="danger">Close</button>

<!-- Success state -->
<button class="success">Confirm</button>

<!-- Warning state -->
<button class="warning">Alert</button>
```

---

## Core Architecture

### Leaflet Mobile Version Flow
1. **Map Initialization** → Leaflet.js loads 3 tile layers
2. **Button Binding** → Layer switchers toggle active state
3. **Console Logging** → System events stream to terminal panel
4. **Diagnostic Runner** → `runDiagnostic()` chains through Truth Engine

### Map Layers Available
- **Roadmap:** OpenStreetMap tiles
- **Satellite:** ArcGIS high-resolution imagery
- **Terrain:** OpenTopoMap topographical data

### Integration Points
- `proof-of-reality.js` → Truth Engine execution
- `ai-integration.js` → Gemini Pro AI routing
- `aegisProtocol.verifyReality()` → Core verification logic

---

## Quick Start

### Mobile Deployment (Recommended)
```html
<script src="index-leaflet-mobile.html"></script>
```

### Desktop/Full-Featured Deployment
```html
<link rel="stylesheet" href="aegis-theme.css">
<script src="index.html"></script>
```

---

## Environment Variables Required
- `__NEXT_PUBLIC_GOOGLE_MAPS_API_KEY__` (for Google Maps version only)
- Note: Leaflet version requires no API keys

---

## Customization Guide

### Change Default Location
**In `index-leaflet-mobile.html`:**
```javascript
const initialCoords = [37.9829, -120.3821]; // Change to your lat/lng
```

### Add Custom Tile Layers
```javascript
const customLayer = L.tileLayer('https://your-tile-url/{z}/{x}/{y}.png');
```

### Modify Button Colors (Leaflet)
```css
button { 
    color: #your-color;
    border: 1px solid #your-color;
}
```

### Using Theme Variables (Desktop)
```css
:root {
    --color-primary-green: #your-color;
    --glow-md: 0 0 10px var(--color-primary-green);
}
```

---

## Performance Notes

### Mobile Optimizations (Leaflet)
- ✅ No external map API required
- ✅ Lightweight library (~40KB)
- ✅ Minimal DOM overhead
- ✅ Touch-friendly controls
- ✅ Efficient layer switching

### Desktop Enhancements (Google Maps)
- ✅ Street View support
- ✅ Advanced map controls
- ✅ Theme consistency
- ✅ Accessibility features
- ✅ Responsive grid layout

---

## Version Compatibility

| Component | Leaflet Mobile | Google Maps | Theme CSS |
|-----------|---|---|---|
| Map Engine | Leaflet 1.9.4 | Google Maps API | N/A |
| Buttons | Inline CSS | Inline + External | ✅ Full |
| Transparency | ✅ Yes | ✅ Yes | ✅ Yes |
| Mobile Ready | ✅ Yes | Partial | ✅ Yes |
| Responsive | ✅ Yes | ✅ Yes | ✅ Yes |

---

## Next Steps
1. Choose your deployment target (mobile or desktop)
2. Set environment variables if using Google Maps
3. Test button interactions and map layer switching
4. Integrate with `proof-of-reality.js` for Truth Engine execution
5. Route AI queries through `ai-integration.js` to Gemini Pro

---

**Created:** 2026-06-30  
**Developer:** Jason C. Watkins  
**Organization:** Verdant Aegis Logic
