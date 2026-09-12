// Music App Interactive Controller

let currentScreen = 'onboarding';
let isPlaying = false;
let currentProgress = 70; // in seconds (1:10)
const totalDuration = 190; // in seconds (3:10)
let playbackInterval = null;

// Screen Navigation
function navigateTo(screenId) {
  // Normalize screen name if needed
  if (screenId === 'liked') {
    screenId = 'playlist';
  }

  const screens = document.querySelectorAll('.screen');
  screens.forEach((s) => s.classList.remove('active'));

  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.add('active');
    currentScreen = screenId;
    const scrollElem = target.querySelector('.screen-scroll');
    if (scrollElem) scrollElem.scrollTop = 0;
  }

  // Update bottom nav active state
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach((item) => {
    const itemScreen = item.getAttribute('data-screen');
    if (
      itemScreen === screenId ||
      (itemScreen === 'liked' && screenId === 'playlist')
    ) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Manage bottom nav visibility
  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) {
    if (screenId === 'onboarding' || screenId === 'player') {
      bottomNav.style.display = 'none';
    } else {
      bottomNav.style.display = 'flex';
    }
  }
}

// Settings Submenus
function showSettingsMain() {
  document.querySelectorAll('.settings-submenu').forEach((el) => {
    el.style.display = 'none';
  });
  const mainMenu = document.getElementById('settings-menu-main');
  if (mainMenu) mainMenu.style.display = 'flex';
}

function showSubmenu(submenuId) {
  const mainMenu = document.getElementById('settings-menu-main');
  if (mainMenu) mainMenu.style.display = 'none';

  document.querySelectorAll('.settings-submenu').forEach((el) => {
    el.style.display = 'none';
  });

  const target = document.getElementById(`submenu-${submenuId}`);
  if (target) target.style.display = 'block';
}

// Audio Player Functions
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function updateProgressBar() {
  const percent = Math.min(100, (currentProgress / totalDuration) * 100);
  const bar = document.querySelector('.player-progress .progress-bar');
  const handle = document.querySelector('.player-progress .progress-handle');
  const timeLabels = document.querySelectorAll('.player-progress .progress-times span');

  if (bar) bar.style.width = `${percent}%`;
  if (handle) handle.style.left = `${percent}%`;
  if (timeLabels && timeLabels[0]) {
    timeLabels[0].textContent = formatTime(currentProgress);
  }
}

function togglePlay() {
  isPlaying = !isPlaying;
  const playBtns = document.querySelectorAll('.ctrl-play, .play-btn-sm, .play-btn-lg');

  playBtns.forEach((btn) => {
    if (isPlaying) {
      btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    } else {
      btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>`;
    }
  });

  if (isPlaying) {
    if (playbackInterval) clearInterval(playbackInterval);
    playbackInterval = setInterval(() => {
      if (currentProgress < totalDuration) {
        currentProgress += 1;
        updateProgressBar();
      } else {
        currentProgress = 0;
        togglePlay();
      }
    }, 1000);
  } else {
    clearInterval(playbackInterval);
  }
}

// Interactive Setup on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Settings menu item clicks
  document.querySelectorAll('.settings-item[data-submenu]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sub = btn.getAttribute('data-submenu');
      showSubmenu(sub);
    });
  });

  // Filter pills click
  document.querySelectorAll('.filter-pills .pill').forEach((pill) => {
    pill.addEventListener('click', (e) => {
      const parent = e.target.closest('.filter-pills');
      if (parent) {
        parent.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
      }
      pill.classList.add('active');
    });
  });

  // Theme option clicks
  document.querySelectorAll('.theme-opt').forEach((opt) => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.theme-opt').forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Audio quality option clicks
  document.querySelectorAll('.audio-opt').forEach((opt) => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.audio-opt').forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Language clicks
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

  // Scrubbing progress track in player
  const track = document.querySelector('.player-progress .progress-track');
  if (track) {
    track.addEventListener('click', (e) => {
      const rect = track.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      currentProgress = Math.round(ratio * totalDuration);
      updateProgressBar();
    });
  }

  // Play button listeners
  const mainPlayBtn = document.querySelector('.ctrl-play');
  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', togglePlay);
  }

  // Initial progress display
  updateProgressBar();
});
