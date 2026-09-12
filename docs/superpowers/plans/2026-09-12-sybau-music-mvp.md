# SYBAU Music — MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing static UI prototype into a fully functional, free, open-source music streaming web app using YouTube as the music source.

**Architecture:** Single-page app (vanilla HTML/CSS/JS — no framework, matching the existing codebase). Music search and playback via the Invidious API (public YouTube proxy). User data (playlists, liked songs, settings) stored in localStorage for MVP, with Firebase Auth + Firestore planned for Phase 2. App.js will be split into focused modules: search, player, library, queue, and settings.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6 modules), Invidious API (YouTube proxy), localStorage, Google Fonts (Gasoek One, Dela Gothic One, Fredoka, Figtree)

**Spec:** Brainstorming conversation — SYBAU Music free/open-source streaming app

## Global Constraints

- No build tools, no npm, no frameworks — pure HTML/CSS/JS that opens in a browser
- All fonts from Google Fonts: Gasoek One (hero text), Dela Gothic One (subheadings), Fredoka (buttons/CTAs), Figtree (everything else)
- Mobile-first responsive design (existing CSS is already mobile-first)
- MIT License
- No premium/paid features — everything is free
- Existing UI structure in index.html and css/style.css must be preserved and enhanced, not replaced

---

### Task 1: Project Setup — Git, Fonts, and File Structure

**Files:**
- Modify: `index.html` (add missing fonts, update title to SYBAU Music)
- Create: `js/config.js` (app constants and API config)
- Create: `js/store.js` (localStorage wrapper for user data)
- Create: `LICENSE` (MIT)
- Create: `README.md`
- Create: `.gitignore`

**Interfaces:**
- Produces: `AppConfig` object with API base URL, app name, version; `Store` module with `get(key)`, `set(key, value)`, `remove(key)` methods and typed helpers: `Store.getLikedSongs(): string[]`, `Store.getPlaylists(): Playlist[]`, `Store.getQueue(): Track[]`, `Store.getSettings(): Settings`

- [ ] **Step 1: Initialize git repo**

```bash
cd "G:/music app"
git init
```

- [ ] **Step 2: Create .gitignore**

```
node_modules/
.DS_Store
Thumbs.db
*.log
```

- [ ] **Step 3: Create MIT LICENSE file**

Create `LICENSE` with MIT license text, copyright 2026 Ravi.

- [ ] **Step 4: Add missing Google Fonts to index.html**

In the `<head>`, update the Google Fonts link to include all 4 fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Figtree:wght@400;500;600;700;800;900&family=Fredoka:wght@400;500;600;700&family=Gasoek+One&display=swap" rel="stylesheet" />
```

Update `<title>` to `SYBAU Music`.

- [ ] **Step 5: Add font CSS variables to style.css**

Add to `:root` in `css/style.css`:

```css
--font-hero: "Gasoek One", cursive, sans-serif;
--font-display: "Dela Gothic One", cursive, sans-serif;
--font-cta: "Fredoka", sans-serif;
--font: "Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

- [ ] **Step 6: Create js/config.js**

```javascript
// SYBAU Music — App Configuration
const AppConfig = {
  name: 'SYBAU Music',
  version: '1.0.0',
  // Invidious public instances (fallback list)
  apiInstances: [
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
    'https://invidious.jing.rocks',
  ],
  apiBase: 'https://inv.nadeko.net', // primary
  maxSearchResults: 20,
  maxQueueSize: 50,
};
```

- [ ] **Step 7: Create js/store.js**

```javascript
// SYBAU Music — localStorage persistence layer
const Store = {
  _prefix: 'sybau_',

  get(key) {
    try {
      const raw = localStorage.getItem(this._prefix + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this._prefix + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Store.set failed:', e);
    }
  },

  remove(key) {
    localStorage.removeItem(this._prefix + key);
  },

  // Typed helpers
  getLikedSongs() {
    return this.get('liked_songs') || [];
  },

  setLikedSongs(songs) {
    this.set('liked_songs', songs);
  },

  toggleLike(track) {
    const liked = this.getLikedSongs();
    const idx = liked.findIndex(s => s.videoId === track.videoId);
    if (idx >= 0) {
      liked.splice(idx, 1);
    } else {
      liked.unshift(track);
    }
    this.setLikedSongs(liked);
    return idx < 0; // true = now liked
  },

  isLiked(videoId) {
    return this.getLikedSongs().some(s => s.videoId === videoId);
  },

  getPlaylists() {
    return this.get('playlists') || [];
  },

  setPlaylists(playlists) {
    this.set('playlists', playlists);
  },

  getRecentlyPlayed() {
    return this.get('recently_played') || [];
  },

  addRecentlyPlayed(track) {
    let recent = this.getRecentlyPlayed();
    recent = recent.filter(t => t.videoId !== track.videoId);
    recent.unshift(track);
    if (recent.length > 20) recent = recent.slice(0, 20);
    this.set('recently_played', recent);
  },

  getSettings() {
    return this.get('settings') || {
      audioQuality: 'high',
      theme: 'light',
      language: 'en',
      notifications: { newReleases: true, playlistUpdates: true, messages: false, reminders: false },
    };
  },

  setSettings(settings) {
    this.set('settings', settings);
  },
};
```

- [ ] **Step 8: Create README.md**

```markdown
# 🎵 SYBAU Music

A free, open-source music streaming web app.

**Discover. Listen. Feel.**

## Features
- 🔍 Search millions of songs via YouTube
- 📋 Create and manage playlists
- ❤️ Like and save your favorite songs
- 🎵 Full music player with queue management
- ⚙️ Customizable settings (theme, audio quality, language)

## Tech Stack
- Pure HTML, CSS, JavaScript (no frameworks)
- Invidious API (YouTube proxy) for music streaming
- localStorage for data persistence

## Getting Started
1. Clone this repo
2. Open `index.html` in your browser
3. Start listening!

## License
MIT — free and open source forever.
```

- [ ] **Step 9: Update index.html script tags**

At the bottom of `index.html`, before `</body>`, replace the single script tag:

```html
<script src="js/config.js"></script>
<script src="js/store.js"></script>
<script src="js/api.js"></script>
<script src="js/player.js"></script>
<script src="js/app.js"></script>
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: project setup — git, fonts, store, config, license"
```

---

### Task 2: YouTube Music API Integration (Search & Stream)

**Files:**
- Create: `js/api.js` (Invidious API wrapper)

**Interfaces:**
- Consumes: `AppConfig.apiBase`, `AppConfig.apiInstances` from `js/config.js`
- Produces: `MusicAPI.search(query, type): Promise<Track[]>`, `MusicAPI.getStreamUrl(videoId): Promise<string>`, `MusicAPI.getTrending(): Promise<Track[]>`, `MusicAPI.getTrackInfo(videoId): Promise<Track>`

A `Track` object shape:
```javascript
{
  videoId: string,
  title: string,
  artist: string,
  thumbnail: string,
  duration: string,    // "3:45"
  durationSeconds: number,
}
```

- [ ] **Step 1: Create js/api.js with search function**

```javascript
// SYBAU Music — Invidious API wrapper
const MusicAPI = {
  _currentInstance: 0,

  _getBase() {
    return AppConfig.apiInstances[this._currentInstance] || AppConfig.apiBase;
  },

  // Try next instance if current one fails
  _rotateInstance() {
    this._currentInstance = (this._currentInstance + 1) % AppConfig.apiInstances.length;
    console.log('Switched to API instance:', this._getBase());
  },

  async _fetch(endpoint, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        const url = this._getBase() + endpoint;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn(`API fetch failed (attempt ${i + 1}):`, err.message);
        if (i < retries) this._rotateInstance();
        else throw err;
      }
    }
  },

  _formatDuration(seconds) {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  },

  _parseTrack(item) {
    return {
      videoId: item.videoId,
      title: item.title || 'Unknown',
      artist: item.author || item.authorId || 'Unknown Artist',
      thumbnail: item.videoThumbnails?.[0]?.url
        || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
      duration: this._formatDuration(item.lengthSeconds),
      durationSeconds: item.lengthSeconds || 0,
    };
  },

  async search(query, type = 'music') {
    const params = new URLSearchParams({
      q: query,
      type: 'video',
      sort_by: 'relevance',
    });
    // Add music filter
    if (type === 'music') {
      params.set('q', query + ' music audio');
    }
    const data = await this._fetch(`/api/v1/search?${params}`);
    return (data || [])
      .filter(item => item.type === 'video')
      .slice(0, AppConfig.maxSearchResults)
      .map(item => this._parseTrack(item));
  },

  async getTrending() {
    const data = await this._fetch('/api/v1/trending?type=Music');
    return (data || [])
      .slice(0, 20)
      .map(item => this._parseTrack(item));
  },

  async getStreamUrl(videoId) {
    const data = await this._fetch(`/api/v1/videos/${videoId}`);
    // Prefer audio-only adaptive format for lower bandwidth
    const audioFormats = (data.adaptiveFormats || [])
      .filter(f => f.type && f.type.startsWith('audio/'))
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

    if (audioFormats.length > 0) {
      return audioFormats[0].url;
    }
    // Fallback to combined format
    const combined = (data.formatStreams || [])
      .sort((a, b) => parseInt(b.itag) - parseInt(a.itag));
    if (combined.length > 0) {
      return combined[0].url;
    }
    throw new Error('No stream URL found for video ' + videoId);
  },

  async getTrackInfo(videoId) {
    const data = await this._fetch(`/api/v1/videos/${videoId}`);
    return this._parseTrack(data);
  },
};
```

- [ ] **Step 2: Verify API works by testing in browser console**

Open index.html in a browser, open DevTools console, run:
```javascript
MusicAPI.search('Tajdar-E-Haram Atif Aslam').then(r => console.log(r));
```
Expected: Array of Track objects with videoId, title, artist, thumbnail, duration.

- [ ] **Step 3: Commit**

```bash
git add js/api.js
git commit -m "feat: add Invidious API wrapper for search and streaming"
```

---

### Task 3: Audio Player Engine

**Files:**
- Create: `js/player.js` (audio playback, queue, controls)

**Interfaces:**
- Consumes: `MusicAPI.getStreamUrl(videoId)` from `js/api.js`, `Store.addRecentlyPlayed(track)` from `js/store.js`
- Produces: `Player.play(track)`, `Player.pause()`, `Player.resume()`, `Player.next()`, `Player.prev()`, `Player.seek(percent)`, `Player.setVolume(0-1)`, `Player.toggleShuffle()`, `Player.toggleRepeat()`, `Player.queue` (array), `Player.addToQueue(track)`, `Player.removeFromQueue(index)`, `Player.onStateChange(callback)`, `Player.currentTrack`, `Player.isPlaying`, `Player.progress` (0-1), `Player.currentTime`, `Player.duration`

- [ ] **Step 1: Create js/player.js**

```javascript
// SYBAU Music — Audio Player Engine
const Player = {
  _audio: new Audio(),
  _queue: [],
  _queueIndex: -1,
  _history: [],
  _shuffle: false,
  _repeat: 'none', // 'none' | 'all' | 'one'
  _listeners: [],
  _progressInterval: null,

  currentTrack: null,
  isPlaying: false,

  init() {
    this._audio.addEventListener('ended', () => this._onTrackEnd());
    this._audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this._notify('error');
    });
    this._audio.addEventListener('loadedmetadata', () => this._notify('loaded'));
    this._audio.addEventListener('waiting', () => this._notify('buffering'));
    this._audio.addEventListener('canplay', () => this._notify('ready'));

    // Restore queue from localStorage
    const savedQueue = Store.get('queue');
    if (savedQueue) this._queue = savedQueue;
  },

  // Play a specific track
  async play(track) {
    if (!track || !track.videoId) return;

    this.currentTrack = track;
    this._notify('loading');

    try {
      const streamUrl = await MusicAPI.getStreamUrl(track.videoId);
      this._audio.src = streamUrl;
      this._audio.play();
      this.isPlaying = true;
      this._startProgress();
      this._notify('playing');
      Store.addRecentlyPlayed(track);
    } catch (err) {
      console.error('Failed to play:', err);
      this._notify('error');
    }
  },

  pause() {
    this._audio.pause();
    this.isPlaying = false;
    this._stopProgress();
    this._notify('paused');
  },

  resume() {
    if (this._audio.src) {
      this._audio.play();
      this.isPlaying = true;
      this._startProgress();
      this._notify('playing');
    }
  },

  togglePlayPause() {
    if (this.isPlaying) this.pause();
    else this.resume();
  },

  // Queue Management
  get queue() {
    return this._queue;
  },

  setQueue(tracks, startIndex = 0) {
    this._queue = [...tracks];
    this._queueIndex = startIndex;
    Store.set('queue', this._queue);
    if (tracks[startIndex]) this.play(tracks[startIndex]);
    this._notify('queue');
  },

  addToQueue(track) {
    this._queue.push(track);
    Store.set('queue', this._queue);
    this._notify('queue');
  },

  removeFromQueue(index) {
    if (index >= 0 && index < this._queue.length) {
      this._queue.splice(index, 1);
      if (this._queueIndex >= index && this._queueIndex > 0) {
        this._queueIndex--;
      }
      Store.set('queue', this._queue);
      this._notify('queue');
    }
  },

  clearQueue() {
    this._queue = [];
    this._queueIndex = -1;
    Store.set('queue', this._queue);
    this._notify('queue');
  },

  // Navigation
  next() {
    if (this._queue.length === 0) return;

    if (this._shuffle) {
      const randomIdx = Math.floor(Math.random() * this._queue.length);
      this._queueIndex = randomIdx;
    } else {
      this._queueIndex++;
      if (this._queueIndex >= this._queue.length) {
        if (this._repeat === 'all') this._queueIndex = 0;
        else { this._queueIndex = this._queue.length - 1; return; }
      }
    }

    this.play(this._queue[this._queueIndex]);
  },

  prev() {
    // If more than 3 seconds in, restart current track
    if (this._audio.currentTime > 3) {
      this._audio.currentTime = 0;
      return;
    }

    if (this._queueIndex > 0) {
      this._queueIndex--;
      this.play(this._queue[this._queueIndex]);
    }
  },

  // Seek (0.0 - 1.0)
  seek(percent) {
    if (this._audio.duration) {
      this._audio.currentTime = this._audio.duration * percent;
      this._notify('progress');
    }
  },

  setVolume(value) {
    this._audio.volume = Math.max(0, Math.min(1, value));
    this._notify('volume');
  },

  toggleShuffle() {
    this._shuffle = !this._shuffle;
    this._notify('shuffle');
  },

  toggleRepeat() {
    const modes = ['none', 'all', 'one'];
    const idx = modes.indexOf(this._repeat);
    this._repeat = modes[(idx + 1) % modes.length];
    this._notify('repeat');
  },

  // Getters
  get progress() {
    if (!this._audio.duration) return 0;
    return this._audio.currentTime / this._audio.duration;
  },

  get currentTime() {
    return this._audio.currentTime || 0;
  },

  get duration() {
    return this._audio.duration || 0;
  },

  // Event system
  onStateChange(callback) {
    this._listeners.push(callback);
  },

  _notify(event) {
    this._listeners.forEach(cb => cb(event, this));
  },

  _startProgress() {
    this._stopProgress();
    this._progressInterval = setInterval(() => this._notify('progress'), 250);
  },

  _stopProgress() {
    if (this._progressInterval) {
      clearInterval(this._progressInterval);
      this._progressInterval = null;
    }
  },

  _onTrackEnd() {
    this._stopProgress();
    if (this._repeat === 'one') {
      this._audio.currentTime = 0;
      this._audio.play();
      this._startProgress();
    } else {
      this.next();
    }
  },

  // Format seconds to m:ss
  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  },
};
```

- [ ] **Step 2: Initialize Player in index.html**

Add `Player.init();` call at the end of the script loading section or early in `app.js`.

- [ ] **Step 3: Commit**

```bash
git add js/player.js
git commit -m "feat: add audio player engine with queue and playback controls"
```

---

### Task 4: Wire Up the App — Connect UI to Player & API

**Files:**
- Rewrite: `js/app.js` (main app controller — navigation, search, player UI, library, queue, settings)

**Interfaces:**
- Consumes: `MusicAPI` from `js/api.js`, `Player` from `js/player.js`, `Store` from `js/store.js`, `AppConfig` from `js/config.js`
- Produces: `navigateTo(screen)`, `App.init()` — the global app bootstrap

This is the largest task. It wires every screen's UI to the actual data and player.

- [ ] **Step 1: Write js/app.js — Navigation & Init**

```javascript
// SYBAU Music — Main App Controller

// ==================== NAVIGATION ====================

function navigateTo(screen) {
  // Map screen names to section IDs
  const screenMap = {
    'onboarding': 'screen-onboarding',
    'home': 'screen-home',
    'search': 'screen-search',
    'library': 'screen-library',
    'playlist': 'screen-playlist',
    'player': 'screen-player',
    'queue': 'screen-queue',
    'settings': 'screen-settings',
  };

  const sectionId = screenMap[screen];
  if (!sectionId) return;

  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  // Show target
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');

  // Update bottom nav active state
  const nav = document.getElementById('bottom-nav');
  if (nav) {
    nav.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.screen === screen);
    });
  }

  // Show/hide bottom nav for certain screens
  const hideNav = ['onboarding', 'player', 'queue', 'settings'];
  if (nav) {
    nav.style.display = hideNav.includes(screen) ? 'none' : 'flex';
  }

  // Screen-specific actions
  if (screen === 'home') loadHome();
  if (screen === 'library') loadLibrary();
  if (screen === 'player') updatePlayerUI();
  if (screen === 'queue') updateQueueUI();
}

// ==================== HOME SCREEN ====================

async function loadHome() {
  // Update greeting based on time of day
  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  else if (hour >= 17) greeting = 'Good Evening';

  const greetLabel = document.querySelector('.greeting-label');
  if (greetLabel) greetLabel.textContent = greeting;

  // Load recently played
  const recentData = Store.getRecentlyPlayed();
  const recentRow = document.querySelector('.recent-row');
  if (recentRow && recentData.length > 0) {
    recentRow.innerHTML = recentData.slice(0, 6).map(track => `
      <div class="recent-item" onclick="playTrack('${track.videoId}')">
        <div class="recent-cover" style="background-image:url('${track.thumbnail}');background-size:cover;background-position:center;"></div>
        <div class="recent-info">
          <p class="recent-title">${escapeHtml(track.title)}</p>
          <p class="recent-artist">${escapeHtml(track.artist)}</p>
        </div>
      </div>
    `).join('');
  }
}

// ==================== SEARCH SCREEN ====================

function initSearch() {
  // Search on the Search screen
  const searchInputs = document.querySelectorAll('.search-bar input');
  searchInputs.forEach(input => {
    let debounce;
    input.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => doSearch(e.target.value), 500);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(debounce);
        doSearch(e.target.value);
      }
    });
  });

  // Filter pills
  document.querySelectorAll('.filter-pills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      pill.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

async function doSearch(query) {
  if (!query || query.trim().length < 2) return;

  // Show search results in the search screen
  const searchScreen = document.getElementById('screen-search');
  let resultsContainer = searchScreen.querySelector('.search-results');

  if (!resultsContainer) {
    resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results track-list';
    // Insert after category-list
    const catList = searchScreen.querySelector('.category-list');
    if (catList) catList.after(resultsContainer);
    else searchScreen.querySelector('.screen-scroll').appendChild(resultsContainer);
  }

  resultsContainer.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Searching...</p>';

  // Hide categories when searching
  const catList = searchScreen.querySelector('.category-list');
  if (catList) catList.style.display = 'none';

  try {
    const results = await MusicAPI.search(query);
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">No results found</p>';
      return;
    }
    resultsContainer.innerHTML = results.map(track => `
      <div class="track-item" onclick="playTrackFromSearch('${track.videoId}', ${JSON.stringify(results.map(t => t.videoId)).replace(/"/g, '&quot;')})">
        <div class="track-cover" style="background-image:url('${track.thumbnail}');background-size:cover;background-position:center;"></div>
        <div class="track-info">
          <p class="track-title">${escapeHtml(track.title)}</p>
          <p class="track-artist">${escapeHtml(track.artist)}</p>
        </div>
        <span style="font-size:12px;color:#999;font-weight:600;">${track.duration}</span>
      </div>
    `).join('');
  } catch (err) {
    resultsContainer.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Search failed. Try again.</p>';
    console.error('Search error:', err);
  }
}

// Store last search results for queue building
let _lastSearchResults = [];

async function playTrackFromSearch(videoId, allVideoIds) {
  try {
    const track = await MusicAPI.getTrackInfo(videoId);
    // Build queue from search results
    const tracks = [];
    for (const vid of (allVideoIds || [videoId])) {
      if (vid === videoId) {
        tracks.push(track);
      } else {
        // Lazy-load other tracks when they play
        tracks.push({ videoId: vid, title: 'Loading...', artist: '', thumbnail: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`, duration: '0:00', durationSeconds: 0 });
      }
    }
    const idx = tracks.findIndex(t => t.videoId === videoId);
    Player.setQueue(tracks, idx >= 0 ? idx : 0);
    navigateTo('player');
  } catch (err) {
    console.error('Play failed:', err);
  }
}

async function playTrack(videoId) {
  try {
    const track = await MusicAPI.getTrackInfo(videoId);
    Player.setQueue([track], 0);
    navigateTo('player');
  } catch (err) {
    console.error('Play failed:', err);
  }
}

// ==================== PLAYER UI ====================

function updatePlayerUI() {
  const track = Player.currentTrack;
  if (!track) return;

  // Song info
  const titleEl = document.querySelector('.player-song-title');
  const artistEl = document.querySelector('.player-song-artist');
  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = track.artist;

  // Album art
  const artInner = document.querySelector('.player-art-inner');
  if (artInner && track.thumbnail) {
    artInner.style.backgroundImage = `url('${track.thumbnail}')`;
    artInner.style.backgroundSize = 'cover';
    artInner.style.backgroundPosition = 'center';
    // Clear the placeholder content
    artInner.innerHTML = '';
  }

  // Header info
  const fromName = document.querySelector('.player-from-name');
  if (fromName) fromName.textContent = 'Now Playing';

  // Now playing card
  const npTitle = document.querySelector('.np-title');
  const npArtist = document.querySelector('.np-artist');
  const npDuration = document.querySelector('.np-duration');
  if (npTitle) npTitle.textContent = track.title;
  if (npArtist) npArtist.textContent = track.artist;
  if (npDuration) npDuration.textContent = track.duration;

  // Update play/pause button icon
  updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
  const playBtn = document.querySelector('.ctrl-play');
  if (!playBtn) return;

  if (Player.isPlaying) {
    playBtn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
  } else {
    playBtn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>`;
  }
}

function updateProgress() {
  const bar = document.querySelector('.player-progress .progress-bar');
  const handle = document.querySelector('.player-progress .progress-handle');
  const timeStart = document.querySelector('.progress-times span:first-child');
  const timeEnd = document.querySelector('.progress-times span:last-child');

  const pct = Player.progress * 100;

  if (bar) bar.style.width = pct + '%';
  if (handle) handle.style.left = pct + '%';
  if (timeStart) timeStart.textContent = Player.formatTime(Player.currentTime);
  if (timeEnd) timeEnd.textContent = Player.formatTime(Player.duration);
}

function initPlayerControls() {
  // Play/Pause
  const playBtn = document.querySelector('.ctrl-play');
  if (playBtn) {
    playBtn.onclick = () => Player.togglePlayPause();
  }

  // Previous
  const prevBtn = document.querySelector('[aria-label="Previous"]');
  if (prevBtn) {
    prevBtn.onclick = () => Player.prev();
  }

  // Next
  const nextBtn = document.querySelector('[aria-label="Next"]');
  if (nextBtn) {
    nextBtn.onclick = () => Player.next();
  }

  // Shuffle
  const shuffleBtn = document.querySelector('[aria-label="Shuffle"]');
  if (shuffleBtn) {
    shuffleBtn.onclick = () => {
      Player.toggleShuffle();
      shuffleBtn.style.opacity = Player._shuffle ? '1' : '0.5';
    };
  }

  // Repeat
  const repeatBtn = document.querySelector('[aria-label="Repeat"]');
  if (repeatBtn) {
    repeatBtn.onclick = () => {
      Player.toggleRepeat();
      repeatBtn.style.opacity = Player._repeat !== 'none' ? '1' : '0.5';
    };
  }

  // Progress bar seeking
  const progressTrack = document.querySelector('.player-progress .progress-track');
  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      Player.seek(pct);
    });
  }

  // Listen for player state changes
  Player.onStateChange((event) => {
    if (event === 'playing' || event === 'paused') {
      updatePlayPauseIcon();
    }
    if (event === 'progress') {
      updateProgress();
    }
    if (event === 'playing' || event === 'loaded') {
      updatePlayerUI();
    }
    if (event === 'queue') {
      updateQueueUI();
    }
  });
}

// ==================== QUEUE SCREEN ====================

function updateQueueUI() {
  const queue = Player.queue;
  const currentTrack = Player.currentTrack;

  // Now Playing section
  const queueScreen = document.getElementById('screen-queue');
  if (!queueScreen) return;

  const scroll = queueScreen.querySelector('.screen-scroll');
  if (!scroll) return;

  // Rebuild queue content (keep header)
  const header = scroll.querySelector('.page-header-row');
  scroll.innerHTML = '';
  if (header) scroll.appendChild(header);

  // Now Playing
  if (currentTrack) {
    scroll.innerHTML += `
      <h3 class="queue-section-title">Now Playing</h3>
      <div class="queue-item">
        <div class="queue-cover" style="background-image:url('${currentTrack.thumbnail}');background-size:cover;background-position:center;"></div>
        <div class="queue-info">
          <p class="queue-title">${escapeHtml(currentTrack.title)}</p>
          <p class="queue-artist">${escapeHtml(currentTrack.artist)}</p>
        </div>
      </div>
    `;
  }

  // Next In Queue
  const upcoming = queue.filter(t => t.videoId !== currentTrack?.videoId);
  if (upcoming.length > 0) {
    scroll.innerHTML += `<h3 class="queue-section-title">Next In Queue</h3>`;
    upcoming.forEach((track, i) => {
      scroll.innerHTML += `
        <div class="queue-item">
          <div class="queue-cover" style="background-image:url('${track.thumbnail}');background-size:cover;background-position:center;"></div>
          <div class="queue-info">
            <p class="queue-title">${escapeHtml(track.title)}</p>
            <p class="queue-artist">${escapeHtml(track.artist)}</p>
          </div>
          <div class="queue-reorder">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </div>
        </div>
      `;
    });
  }

  // Clear queue button
  const clearBtn = queueScreen.querySelector('[aria-label="Clear"]');
  if (clearBtn) {
    clearBtn.onclick = () => {
      Player.clearQueue();
      updateQueueUI();
    };
  }
}

// ==================== LIBRARY SCREEN ====================

function loadLibrary() {
  const likedSongs = Store.getLikedSongs();

  // Update liked songs count
  const likedMeta = document.querySelector('.library-item:first-child .library-meta');
  if (likedMeta) {
    likedMeta.textContent = `${likedSongs.length} songs`;
  }

  // Make liked songs item clickable
  const likedItem = document.querySelector('.library-item:first-child');
  if (likedItem) {
    likedItem.onclick = () => loadLikedSongs();
  }
}

function loadLikedSongs() {
  const likedSongs = Store.getLikedSongs();

  // Update playlist detail screen with liked songs
  const detailTitle = document.querySelector('.playlist-detail-title');
  const detailStats = document.querySelector('.playlist-detail-stats');
  const trackList = document.querySelector('#screen-playlist .track-list');

  if (detailTitle) detailTitle.textContent = 'Liked Songs';
  if (detailStats) {
    const totalSeconds = likedSongs.reduce((sum, t) => sum + (t.durationSeconds || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    detailStats.textContent = `${likedSongs.length} songs • ${hours}hr ${mins}m`;
  }

  if (trackList) {
    if (likedSongs.length === 0) {
      trackList.innerHTML = '<p style="text-align:center;color:#999;padding:40px 0;">No liked songs yet. Search and like some tracks!</p>';
    } else {
      trackList.innerHTML = likedSongs.map(track => `
        <div class="track-item" onclick="playTrack('${track.videoId}')">
          <div class="track-cover" style="background-image:url('${track.thumbnail}');background-size:cover;background-position:center;"></div>
          <div class="track-info">
            <p class="track-title">${escapeHtml(track.title)}</p>
            <p class="track-artist">${escapeHtml(track.artist)}</p>
          </div>
        </div>
      `).join('');
    }
  }

  // Play all button
  const playAllBtn = document.querySelector('#screen-playlist .play-btn-lg');
  if (playAllBtn) {
    playAllBtn.onclick = () => {
      if (likedSongs.length > 0) {
        Player.setQueue(likedSongs, 0);
        navigateTo('player');
      }
    };
  }

  navigateTo('playlist');
}

// ==================== SETTINGS ====================

function initSettings() {
  // Settings submenu navigation
  document.querySelectorAll('[data-submenu]').forEach(btn => {
    btn.addEventListener('click', () => {
      const submenuId = 'submenu-' + btn.dataset.submenu;
      document.getElementById('settings-menu-main').style.display = 'none';
      document.getElementById(submenuId).style.display = 'block';
    });
  });

  // Remove premium option
  const premiumBtn = document.querySelector('[data-submenu="premium"]');
  if (premiumBtn) premiumBtn.style.display = 'none';

  // Update settings plan text
  const planEl = document.querySelector('.settings-plan');
  if (planEl) planEl.textContent = 'Free Plan';
}

function showSettingsMain() {
  document.querySelectorAll('.settings-submenu').forEach(sub => sub.style.display = 'none');
  document.getElementById('settings-menu-main').style.display = 'flex';
}

// ==================== UTILITIES ====================

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== APP INIT ====================

const App = {
  init() {
    Player.init();
    initSearch();
    initPlayerControls();
    initSettings();
    loadHome();

    console.log(`🎵 ${AppConfig.name} v${AppConfig.version} loaded!`);
  },
};

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
```

- [ ] **Step 2: Test the full flow in browser**

1. Open `index.html` in browser
2. Click "Get Started" → should show Home screen
3. Type in search bar → should show real YouTube results
4. Click a result → should navigate to Player and start playing audio
5. Player controls (play/pause/next/prev) should work
6. Queue screen should show current/upcoming tracks

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: wire up full app — search, player, queue, library, settings"
```

---

### Task 5: Polish — Fix Fonts, Remove Premium, Update Branding

**Files:**
- Modify: `index.html` (update branding, fix onboarding fonts, remove premium references)
- Modify: `css/style.css` (apply correct font families per the design spec)

**Interfaces:**
- Consumes: CSS variables `--font-hero`, `--font-display`, `--font-cta`, `--font` from Task 1

- [ ] **Step 1: Update onboarding text to use correct fonts**

In `css/style.css`, update the onboarding title styles:

```css
.onboarding-title .title-brand {
  font-family: var(--font-hero);  /* Gasoek One */
  font-size: 72px;
  line-height: 0.95;
  letter-spacing: -1.5px;
  display: block;
}

.onboarding-title .title-sub {
  font-family: var(--font-display);  /* Dela Gothic One */
  font-weight: 400;
  font-size: 38px;
  line-height: 1.05;
  letter-spacing: -1.2px;
  display: block;
}
```

- [ ] **Step 2: Update button fonts to Fredoka**

```css
.btn-primary {
  font-family: var(--font-cta);  /* Fredoka */
  font-weight: 600;
}

.onboarding-signin {
  font-family: var(--font-cta);  /* Fredoka */
}
```

- [ ] **Step 3: Update hero card title to Gasoek One**

```css
.hero-title {
  font-family: var(--font-hero);  /* Gasoek One */
  font-size: 48px;
  font-weight: 400;
}
```

- [ ] **Step 4: Update settings — remove Premium Plan text, add "Free Plan"**

In `index.html`, change:
- `<p class="settings-plan">Premium Plan</p>` → `<p class="settings-plan">Free Plan</p>`
- Remove the crown emoji from the name
- Hide the "Upgrade to premium" menu item (already done in JS, but also remove from HTML)

- [ ] **Step 5: Update app title and branding**

In `index.html`:
- Change `<title>Music App</title>` to `<title>SYBAU Music</title>`
- Update any remaining "Music App" references to "SYBAU Music"

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: polish fonts, remove premium, update SYBAU branding"
```

---

### Task 6: Final Testing & Launch Readiness

**Files:**
- No new files — testing and verification only

- [ ] **Step 1: Test all 8 screens navigate correctly**

Verify: Onboarding → Home → Search → Library → Liked Songs → Player → Queue → Settings — all transitions work.

- [ ] **Step 2: Test search and playback**

Search for "Tajdar-E-Haram", click a result, verify audio plays.

- [ ] **Step 3: Test player controls**

Verify play/pause, next, previous, seek bar, shuffle, repeat all respond.

- [ ] **Step 4: Test liked songs**

Like a song, verify it appears in Library → Liked Songs.

- [ ] **Step 5: Test settings submenus**

Navigate through each settings submenu, verify they open/close properly.

- [ ] **Step 6: Test on mobile viewport**

Open DevTools → toggle mobile view → verify the app looks correct and works.

- [ ] **Step 7: Final commit and tag**

```bash
git add -A
git commit -m "feat: SYBAU Music v1.0.0 — MVP complete"
git tag v1.0.0
```
