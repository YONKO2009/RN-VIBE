# Task 4 Brief: UI Wiring

**Goal:** Integrate the UI with the already-built API (`MusicAPI` from `js/api.js`) and audio engine (`AudioEngine` from `js/audio-engine.js`), and populate the catalog using `js/catalog-data.js`.

**Requirements:**
1.  **Catalog Data**: Ensure `js/catalog-data.js` is loaded and used to populate the main library/catalog grid.
2.  **API Integration**: Wire the search bar to `MusicAPI.search()` for real results.
3.  **Audio Engine Integration**: Wire the player bar buttons (Play/Pause, Previous/Next) to `AudioEngine` methods. 
4.  **Visualizer**: Implement a `requestAnimationFrame` loop in `js/app.js` that calls `AudioEngine.getAnalyserData()` and renders spectrum bars to the visualizer `<canvas>` element (ensure canvas is sized correctly, likely 256/512px).
5.  **Search Filtering**: Implement a live text filter that searches the `CatalogData` (and eventually results from `api.js`?) for track names/artists.
6.  **Modular Vanilla JS**: Continue the established pattern (IIFE modules, global app state in `js/app.js`).
7.  Verify with node syntax check and manual browser test of search/play.
