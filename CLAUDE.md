# Inception — Travel Tracker PWA

## Project Overview
Inception is a multi-trip travel journal PWA that lets users document their adventures with photos, locations, and food discoveries. Think Instagram meets travel journal with Yuka/Meetic-level minimal design.

## Tech Stack
- **Framework**: React 18 + Vite 6
- **Styling**: CSS-in-JS (inline CSS string in App.jsx)
- **Font**: Nunito (Google Fonts)
- **Target**: PWA (Progressive Web App), mobile-first

## Architecture
Single-page app with everything in `src/App.jsx`:
- All state managed via React hooks (useState, useCallback, useMemo)
- No external state management
- No router — screen switching via `screen` state ("home" | "trip")
- Images resized client-side via Canvas API on upload

## Key Features
- **Multi-trip support**: Create/delete travel groups with cover photo, dates, color theme
- **Feed**: Instagram-style vertical photo cards with like, detail view
- **Map**: SVG-based location visualization per trip
- **Food Journal**: Dedicated food discovery tracker with ratings
- **Admin**: Modal forms to create posts (place/food) with photo upload
- **Delete**: Confirm dialog for deleting trips and posts

## Design System
- **Palette**: Accent `#4a9e7e` (sage green), text `#2d2d2d`, secondary `#999`, bg `#ffffff`, border `#f2f2f2`
- **Typography**: Nunito — 800 for titles, 700 for headings, 600 for labels, 500 for body
- **Radius**: 20px cards, 16px stats, 14px inputs, 12px buttons
- **Style**: Ultra minimal — white bg, 1px borders, no shadows, no gradients, no blur effects
- **Logo**: SVG pin mark + "inception" wordmark, Meetic-inspired

## Commands
```bash
npm install     # Install dependencies
npm run dev     # Start dev server on port 3000
npm run build   # Production build to /dist
npm run preview # Preview production build
```

## Next Steps / TODO
- [ ] Backend with Supabase (auth, database, storage)
- [ ] Real map integration (Mapbox or Leaflet)
- [ ] Image hosting (Supabase Storage or Cloudinary)
- [ ] Share trip via public link
- [ ] Push notifications
- [ ] Offline support with service worker
- [ ] Generate PWA icons (icon-192.png, icon-512.png)
