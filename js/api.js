// SYBAU Music — Invidious API module (vanilla JS, modular, MVP)
// All calls route through the Invidious public instances defined in AppConfig.

const MusicAPI = (() => {
  'use strict';

  const instances = (typeof AppConfig !== 'undefined' && AppConfig.apiInstances) ? AppConfig.apiInstances : [
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
    'https://invidious.jing.rocks',
  ];
  const primary = (typeof AppConfig !== 'undefined' && AppConfig.apiBase) ? AppConfig.apiBase : instances[0];

  // Helper to build endpoint URLs against a given instance
  function endpoint(instance, path, params = {}) {
    const url = new URL(path, instance);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
    return url.toString();
  }

  // Try each instance sequentially; return first successful response or throw
  async function fetchWithFallback(path, params = {}, options = {}) {
    let lastErr = null;
    for (const inst of instances) {
      try {
        const url = endpoint(inst, path, params);
        console.log('[MusicAPI] connecting to:', url);
        const res = await fetch(url, {
          method: options.method || 'GET',
          headers: { Accept: 'application/json' },
          ...options,
        });
        if (!res.ok) {
          console.warn('[MusicAPI] non-ok response from', inst, res.status, res.statusText);
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        console.log('[MusicAPI] success via', inst, 'path=', path, 'results=', Array.isArray(data) ? data.length : typeof data);
        return data;
      } catch (e) {
        lastErr = e;
        console.warn('[MusicAPI] failed with', inst, ':', e.message || e);
        // continue to next instance
      }
    }
    console.error('[MusicAPI] all instances failed for', path, '; last error:', lastErr);
    throw lastErr || new Error('All Invidious instances unreachable');
  }

  // Public API
  return {
    // Verify connectivity explicitly (log results per spec)
    async verifyConnectivity() {
      console.info('[MusicAPI] verifying connectivity...');
      try {
        // Use the /api/v1/stats/endpoint to check instance health lightly
        const result = await fetchWithFallback('/api/v1/stats', {});
        console.info('[MusicAPI] connectivity verified:', result);
        return { ok: true, result, instanceUsed: primary };
      } catch (err) {
        console.error('[MusicAPI] connectivity check failed:', err);
        return { ok: false, error: err.message || String(err) };
      }
    },

    // Search videos using Invidious search endpoint
    async search(query, limit = 20) {
      console.info('[MusicAPI] searching:', query);
      return fetchWithFallback('/api/v1/search', { q: query, type: 'video', sort_by: 'relevance' });
    },

    // Fetch a single video by id
    async videoById(id) {
      console.info('[MusicAPI] fetching video:', id);
      return fetchWithFallback('/api/v1/videos/' + id);
    },

    // Fetch trending videos
    async trending(region = 'US', type = 'music') {
      console.info('[MusicAPI] fetching trending:', region, type);
      return fetchWithFallback('/api/v1/trending', { region, type });
    },

    // Fetch popular videos
    async popular() {
      console.info('[MusicAPI] fetching popular');
      return fetchWithFallback('/api/v1/popular');
    },
  };
})();

// Auto-verify on load (non-blocking) and expose results globally for inspection
if (typeof window !== 'undefined') {
  window.MusicAPI = MusicAPI;
  (async () => {
    try {
      const status = await MusicAPI.verifyConnectivity();
      console.info('[MusicAPI] startup connectivity:', status);
    } catch (e) {
      console.warn('[MusicAPI] startup connectivity error (expected if offline):', e);
    }
  })();
}
