// SYBAU Music — UI Controller / App Wiring (Task 4)
// Modular vanilla JS, IIFE pattern, global app state

(function () {
  'use strict';

  // --- Global App State ---
  window.AppState = window.AppState || {
    currentScreen: 'onboarding',
    isPlaying: false,
    currentProgress: 70,
    totalDuration: 190,
    playbackInterval: null,
    currentTrackIndex: 0,
    filteredTracks: [],
    searchQuery: '',
    vizAnimationId: null,
  };

  const state = window.AppState;

  // --- Catalog Integration ---
  function initCatalog() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    if (!window.CatalogData || !window.CatalogData.tracks) {
      console.warn('[App] CatalogData not loaded');
      return;
    }
    const tracks = window.CatalogData.tracks;
    state.filteredTracks = tracks.slice();
    renderCatalogGrid(tracks);
  }

  function renderCatalogGrid(tracks) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!tracks || tracks.length === 0) {
      grid.innerHTML = '<p style="color:#888;padding:1rem;">No tracks found.</p>';
      return;
    }
    tracks.forEach((track, idx) => {
      const item = document.createElement('div');
      item.className = 'catalog-card';
      item.innerHTML = `
        <div class="catalog-cover" style="background:#333;display:flex;align-items:center;justify-content:center;border-radius:8px;height:120px;position:relative;overflow:hidden;">
          <span style="font-size:2.5rem;color:#ccc;">${track.genre ? track.genre[0].toUpperCase() : 'M'}</span>
          <button class="catalog-play-btn" data-idx="${idx}" aria-label="Play ${track.title}" style="position:absolute;bottom:8px;right:8px;background:#000;opacity:0.7;border-radius:50%;width:32px;height:32px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
          </button>
        </div>
        <p class="catalog-title" style="font-weight:600;margin:6px 0 2px;font-size:0.95rem;">${escapeHtml(track.title || 'Unknown')}</p>
        <p class="catalog-artist" style="color:#888;font-size:0.8rem;margin:0;">${escapeHtml(track.artist || 'Unknown')}</p>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.closest('.catalog-play-btn')) return;
        selectTrack(idx, tracks);
      });
      grid.appendChild(item);
    });

    // Wire play buttons on cards
    grid.querySelectorAll('.catalog-play-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        playTrackByIndex(idx, tracks);
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function selectTrack(idx, tracks) {
    state.currentTrackIndex = idx;
    const track = tracks[idx];
    if (track && window.AudioEngine) {
      window.AudioEngine.switchTrack(track);
    }
    // Update player info text if visible
    const titleEl = document.querySelector('.player-song-title');
    const artistEl = document.querySelector('.player-song-artist');
    if (titleEl && track) titleEl.textContent = track.title || 'Unknown';
    if (artistEl && track) artistEl.textContent = track.artist || 'Unknown';
  }

  function playTrackByIndex(idx, tracks) {
    selectTrack(idx, tracks);
    if (window.AudioEngine) {
      window.AudioEngine.play(tracks ? tracks[idx] : null);
      state.isPlaying = true;
      updatePlayButtons(true);
    }
  }

  // --- Search Filtering ---
  function initSearchFilter() {
    const inputs = document.querySelectorAll('.search-bar input, .search-bar-lg input');
    inputs.forEach((input) => {
      input.addEventListener('input', (e) => {
        const q = (e.target.value || '').toLowerCase().trim();
        state.searchQuery = q;
        filterTracks(q);
        // Also trigger MusicAPI.search for external results
        if (q.length > 1 && window.MusicAPI) {
          window.MusicAPI.search(q, 10).then((res) => {
            console.info('[App] MusicAPI search results:', res);
          }).catch((err) => {
            console.warn('[App] MusicAPI search error:', err);
          });
        }
      });
    });
  }

  function filterTracks(query) {
    if (!window.CatalogData || !window.CatalogData.tracks) return;
    const all = window.CatalogData.tracks;
    if (!query) {
      state.filteredTracks = all.slice();
      renderCatalogGrid(all);
      return;
    }
    const filtered = all.filter((t) => {
      const text = ((t.title || '') + ' ' + (t.artist || '') + ' ' + (t.album || '')).toLowerCase();
      return text.indexOf(query) !== -1;
    });
    state.filteredTracks = filtered;
    renderCatalogGrid(filtered);
  }

  // --- Player Controls Wired to AudioEngine ---
  function initPlayerControls() {
    // Main play button (.ctrl-play)
    document.querySelectorAll('.ctrl-play').forEach((btn) => {
      btn.addEventListener('click', () => {
        togglePlayback();
      });
    });

    // Previous button
    document.querySelectorAll('.ctrl-btn').forEach((btn) => {
      const aria = btn.getAttribute('aria-label') || '';
      if (aria.toLowerCase().indexOf('previous') >= 0) {
        btn.addEventListener('click', () => {
          prevTrack();
        });
      } else if (aria.toLowerCase().indexOf('next') >= 0) {
        btn.addEventListener('click', () => {
          nextTrack();
        });
      }
    });

    // Small play buttons
    document.querySelectorAll('.play-btn-sm, .play-btn-lg').forEach((btn) => {
      btn.addEventListener('click', () => {
        togglePlayback();
      });
    });
  }

  function togglePlayback() {
    if (!window.AudioEngine) {
      console.warn('[App] AudioEngine not available');
      return;
    }
    state.isPlaying = !state.isPlaying;
    if (state.isPlaying) {
      // If paused previously, resume; else start current selection
      if (window.AudioEngine.isPlaying) {
        // Already playing — treat as resume (engine manages)
      } else {
        const tracks = state.filteredTracks.length ? state.filteredTracks : (window.CatalogData ? window.CatalogData.tracks : null);
        const idx = Math.min(state.currentTrackIndex, (tracks ? tracks.length - 1 : 0));
        const track = tracks ? tracks[idx] : null;
        window.AudioEngine.play(track || { title: 'Synthetic Track', duration: 30 });
      }
      if (window.AudioEngine.isPlaying && !state.playbackInterval) {
        state.playbackInterval = setInterval(() => {
          state.currentProgress += 1;
          updateProgressBar();
        }, 1000);
      }
    } else {
      window.AudioEngine.pause();
      if (state.playbackInterval) {
        clearInterval(state.playbackInterval);
        state.playbackInterval = null;
      }
    }
    updatePlayButtons(state.isPlaying);
  }

  function prevTrack() {
    const tracks = state.filteredTracks.length ? state.filteredTracks : (window.CatalogData ? window.CatalogData.tracks : null);
    if (!tracks || tracks.length === 0) return;
    const newIdx = (state.currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrackByIndex(newIdx, tracks);
  }

  function nextTrack() {
    const tracks = state.filteredTracks.length ? state.filteredTracks : (window.CatalogData ? window.CatalogData.tracks : null);
    if (!tracks || tracks.length === 0) return;
    const newIdx = (state.currentTrackIndex + 1) % tracks.length;
    playTrackByIndex(newIdx, tracks);
  }

  // --- Visualizer Loop ---
  function initVisualizer() {
    if (!window.AudioEngine) return;
    // Size canvas to 512x120 (as spec requires)
    const canvas = document.getElementById('viz-canvas');
    if (!canvas) {
      console.warn('[App] Visualizer canvas not found');
      return;
    }
    // Ensure dimensions
    canvas.width = 512;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    // Wire callbacks for playback events
    window.AudioEngine.setCallbacks({
      onPlay: () => {
        state.isPlaying = true;
        updatePlayButtons(true);
        if (state.playbackInterval) clearInterval(state.playbackInterval);
        state.playbackInterval = setInterval(() => {
          state.currentProgress += 1;
          updateProgressBar();
        }, 1000);
      },
      onPause: () => {
        state.isPlaying = false;
        updatePlayButtons(false);
        if (state.playbackInterval) {
          clearInterval(state.playbackInterval);
          state.playbackInterval = null;
        }
      },
      onStop: () => {
        state.isPlaying = false;
        updatePlayButtons(false);
        if (state.playbackInterval) {
          clearInterval(state.playbackInterval);
          state.playbackInterval = null;
        }
      },
      onProgress: () => {
        // Could update external progress indicators here
      }
    });

    function drawLoop() {
      state.vizAnimationId = requestAnimationFrame(drawLoop);
      const data = window.AudioEngine.getAnalyserData ? window.AudioEngine.getAnalyserData() : null;
      if (!data || !data.freq) return;
      const freq = data.freq;
      const count = data.count || freq.length;

      // Clear with dark background
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw spectrum bars
      const barCount = Math.min(count, 128);
      const barWidth = Math.max(2, Math.floor(canvas.width / barCount));
      for (let i = 0; i < barCount; i++) {
        const value = freq[i] || 0;
        const barHeight = (value / 255) * (canvas.height - 4);
        const x = i * barWidth;
        const y = canvas.height - barHeight;
        // Gradient color based on frequency
        const hue = 200 + (i / barCount) * 100;
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.fillRect(x, y, barWidth - 1, Math.max(1, barHeight));
      }
    }
    drawLoop();
  }

  // --- Progress Bar & Time ---
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updateProgressBar() {
    const percent = Math.min(100, (state.currentProgress / state.totalDuration) * 100);
    const bar = document.querySelector('.player-progress .progress-bar');
    const handle = document.querySelector('.player-progress .progress-handle');
    const timeLabels = document.querySelectorAll('.player-progress .progress-times span');
    if (bar) bar.style.width = `${percent}%`;
    if (handle) handle.style.left = `${percent}%`;
    if (timeLabels && timeLabels[0]) timeLabels[0].textContent = formatTime(state.currentProgress);
  }

  function updatePlayButtons(isPlaying) {
    const playBtns = document.querySelectorAll('.ctrl-play, .play-btn-sm, .play-btn-lg');
    playBtns.forEach((btn) => {
      if (isPlaying) {
        btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      } else {
        btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>`;
      }
    });
  }

  // --- Existing Navigation / Settings (preserved) ---
  function navigateTo(screenId) {
    if (screenId === 'liked') screenId = 'playlist';
    state.currentScreen = screenId;
    const screens = document.querySelectorAll('.screen');
    screens.forEach((s) => s.classList.remove('active'));
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
      target.classList.add('active');
      const scrollElem = target.querySelector('.screen-scroll');
      if (scrollElem) scrollElem.scrollTop = 0;
    }
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach((item) => {
      const itemScreen = item.getAttribute('data-screen');
      if (itemScreen === screenId || (itemScreen === 'liked' && screenId === 'playlist')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
      bottomNav.style.display = (screenId === 'onboarding' || screenId === 'player') ? 'none' : 'flex';
    }
  }
  window.navigateTo = navigateTo;

  function showSettingsMain() {
    document.querySelectorAll('.settings-submenu').forEach((el) => { el.style.display = 'none'; });
    const mainMenu = document.getElementById('settings-menu-main');
    if (mainMenu) mainMenu.style.display = 'flex';
  }
  window.showSettingsMain = showSettingsMain;

  function showSubmenu(submenuId) {
    const mainMenu = document.getElementById('settings-menu-main');
    if (mainMenu) mainMenu.style.display = 'none';
    document.querySelectorAll('.settings-submenu').forEach((el) => { el.style.display = 'none'; });
    const target = document.getElementById(`submenu-${submenuId}`);
    if (target) target.style.display = 'block';
  }
  window.showSubmenu = showSubmenu;

  // --- Event Wiring ---
  document.addEventListener('DOMContentLoaded', () => {
    // Existing settings / submenu clicks
    document.querySelectorAll('.settings-item[data-submenu]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sub = btn.getAttribute('data-submenu');
        showSubmenu(sub);
      });
    });

    // Filter pills
    document.querySelectorAll('.filter-pills .pill').forEach((pill) => {
      pill.addEventListener('click', (e) => {
        const parent = e.target.closest('.filter-pills');
        if (parent) {
          parent.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
        }
        pill.classList.add('active');
      });
    });

    // Theme / audio / language (preserved)
    document.querySelectorAll('.theme-opt').forEach((opt) => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.theme-opt').forEach((o) => o.classList.remove('active'));
        opt.classList.add('active');
      });
    });
    document.querySelectorAll('.audio-opt').forEach((opt) => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.audio-opt').forEach((o) => o.classList.remove('active'));
        opt.classList.add('active');
      });
    });
    document.querySelectorAll('.lang-item').forEach((opt) => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.lang-item').forEach((o) => {
          o.classList.remove('active');
          const check = o.querySelector('.check');
          if (check) check.remove();
        });
        opt.classList.add('active');
        const span = document.createElement('span');
        span.className = 'check';
        span.textContent = ' ✓';
        opt.appendChild(span);
      });
    });

    // Toggle switches
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('toggle-on')) {
        e.target.classList.remove('toggle-on');
        e.target.classList.add('toggle-off');
      } else if (e.target.classList.contains('toggle-off')) {
        e.target.classList.remove('toggle-off');
        e.target.classList.add('toggle-on');
      }
    });

    // Progress track scrub
    const track = document.querySelector('.player-progress .progress-track');
    if (track) {
      track.addEventListener('click', (e) => {
        const rect = track.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        state.currentProgress = Math.round(ratio * state.totalDuration);
        updateProgressBar();
      });
    }

    // Initialize catalog / search / player / visualizer
    initCatalog();
    initSearchFilter();
    initPlayerControls();

    // Initialize AudioEngine and visualizer after DOM loaded
    if (window.AudioEngine) {
      if (!window.AudioEngine.ctx) window.AudioEngine.init();
    }
    initVisualizer();

    updateProgressBar();
  });
})();
