# Implementation Plan: Modern High-Fidelity Music Web App

Build a responsive, modern, dark-mode music streaming web application with real audio playback, canvas audio visualizer, interactive catalog, queue management, playlists, and a sleek glassmorphic UI.

## Proposed Architecture & Features

### 1. Visual Design & Aesthetics
- **Theme**: Dark obsidian luxury theme (`#090a10`, `#11131f`, `#181b2a`) with vibrant electric violet, neon pink, and cyan accents (`#7c3aed`, `#ec4899`, `#06b6d4`).
- **Surface**: Frosted glassmorphism (`backdrop-filter: blur(20px)`), subtle glow borders, smooth cubic-bezier transitions.
- **Typography**: Google Fonts (*Plus Jakarta Sans* for clean UI, *Outfit* for modern bold headers).
- **Audio Assets**: Curated artwork generated via `generate_image` for albums, artists, and playlists to eliminate placeholders.

### 2. Core Interactive Features
- **Working Audio Engine & Visualizer**:
  - Web Audio API synthesizer engine that generates melodic synthwave/lo-fi/ambient tracks with real instruments (bass, melody, drums, chords) for realistic playback without external file dependencies.
  - Real-time animated HTML5 `<canvas>` frequency visualizer (spectrum bars & reactive glow) linked directly to the audio node.
- **Persistent Bottom Player Bar**:
  - Play/pause, next, previous, shuffle, repeat modes.
  - Interactive scrubbable progress bar with hover time indicator.
  - Volume slider with mute toggle.
  - Like/favorite button, animated equalizer badge, and lyrics drawer toggle.
- **Dynamic Catalog & Navigation**:
  - **Sidebar**: Quick links (Home, Explore/Catalog, Library, Favorites, Playlists, Genres).
  - **Header**: Live search bar with instant autocomplete/filter, user avatar, and notification bell.
  - **Featured Hero Banner**: Spotlight trending album with "Play Now", animated badge, and glass overlay.
  - **Categorized Sections**: "Trending Now", "Featured Artists", "Curated Moods & Playlists", and "Full Track Catalog".
  - **Tracklist Table**: Track rank/play button, thumbnail, title, artist, album, duration, and interactive favorite toggles.
- **Queue & Lyrics Drawer**:
  - Slide-over queue drawer showing upcoming songs with one-click reordering and remove/play.
  - Synced lyrics panel view for the currently active track.

---

## Proposed Changes

### Structure & Styling

#### [NEW] [index.html](file:///g:/music%20app/index.html)
- Main application shell containing semantic HTML5: header, responsive sidebar, main content with tabs/sections, queue drawer, lyrics modal, and bottom player bar.
- Includes SEO metadata, Open Graph tags, and Google Fonts integration.

#### [NEW] [css/style.css](file:///g:/music%20app/css/style.css)
- Design tokens (CSS custom properties for colors, shadows, spacing, glass effects).
- Modern layouts using Flexbox and CSS Grid.
- Micro-animations: card hovering, play button ripple, equalizer bar bounces, smooth drawer slide-ins.
- Responsive styles for mobile, tablet, and desktop viewports.

---

### Logic & Audio Engine

#### [NEW] [js/catalog-data.js](file:///g:/music%20app/js/catalog-data.js)
- Comprehensive dataset of 12+ unique tracks across electronic, lo-fi, synthwave, ambient, and pop genres.
- Metadata including song title, artist, album, duration, lyrics, album art URL, and musical composition parameters (tempo, notes, scale, bassline) for the dynamic audio generator.
- Curated playlists and featured artists.

#### [NEW] [js/audio-engine.js](file:///g:/music%20app/js/audio-engine.js)
- Built-in Web Audio API synthesizer capable of synthesizing rich melodic sounds, basslines, and rhythms for all catalog tracks.
- Master gain node for volume control and mute.
- Analyser node exposing frequency data for the canvas visualizer.
- Supports play, pause, seek, track switching, and playback event callbacks.

#### [NEW] [js/app.js](file:///g:/music%20app/js/app.js)
- Application controller wiring UI to `catalog-data.js` and `audio-engine.js`.
- Search and genre filtering logic.
- Playlist creation, favorites toggling (persisted to `localStorage`).
- Queue drawer and lyrics panel management.
- Canvas visualizer animation loop.

---

### Visual Assets

#### [NEW] [assets/images/](file:///g:/music%20app/assets/images/)
- High-fidelity album covers and artist portraits generated using `generate_image` (synthwave neon night, cyberpunk city, lo-fi cozy coffee, ambient dreamscape, electric beats).

---

## Verification Plan

### Automated / Syntax Check
- Verify that all JavaScript files have no syntax errors using Node syntax check or PowerShell.
- Verify that HTML links to CSS, JS, and image assets resolve correctly.

### Manual / Browser Verification
- Test playback functionality: ensure clicking play emits real audio and activates the animated canvas spectrum visualizer.
- Test player controls: pause, resume, seek along the progress bar, adjust volume, toggle mute, previous/next track.
- Test search and filtering: typing into search filters tracks in real-time; clicking genre pills updates the catalog grid.
- Test queue and lyrics drawers: toggling the queue shows upcoming tracks; lyrics display matches current track.
- Test responsive layout across window sizes.
