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