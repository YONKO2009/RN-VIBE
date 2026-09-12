/**
 * SYBAU Music — Web Audio API Synthesizer Engine
 * Module: AudioEngine (IIFE)
 * Requirements: master gain node, analyser node for visualizer,
 * play/pause/seek/track switching, vanilla JS, MVP modular.
 */
(function () {
  'use strict';

  const AudioEngine = {
    // Web Audio context
    ctx: null,
    masterGain: null,
    analyser: null,
    isRunning: false,
    isPlaying: false,

    // Playback state
    currentSource: null,
    currentOscillators: [],
    currentGainNodes: [],
    startTime: 0,
    pausedTime: 0,
    duration: 30, // default synthetic track length in seconds

    // Visualizer data
    frequencyData: null,
    timeDomainData: null,

    // Callbacks (wiring point for app.js / visualizer)
    onPlay: null,
    onPause: null,
    onStop: null,
    onProgress: null,

    init: function () {
      if (this.ctx) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) throw new Error('Web Audio API not supported');
        this.ctx = new AC();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.7;

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;

        // Routing: synth nodes -> masterGain -> analyser -> destination
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);

        const bufferLength = this.analyser.frequencyBinCount;
        this.frequencyData = new Uint8Array(bufferLength);
        this.timeDomainData = new Uint8Array(bufferLength);

        this.isRunning = true;
        console.log('AudioEngine initialized. Context state:', this.ctx.state);
      } catch (e) {
        console.error('AudioEngine init failed:', e);
        this.isRunning = false;
      }
    },

    // Master volume control (spec: master gain node)
    setVolume: function (val) {
      if (!this.masterGain) return;
      const v = Math.max(0, Math.min(1, parseFloat(val) || 0));
      this.masterGain.gain.setTargetAtTime(v, this.ctx ? this.ctx.currentTime : 0, 0.05);
    },

    getVolume: function () {
      return this.masterGain ? this.masterGain.gain.value : 0;
    },

    mute: function () {
      if (this.masterGain) this.masterGain.gain.setValueAtTime(0, this.ctx ? this.ctx.currentTime : 0);
    },

    unmute: function () {
      if (this.masterGain) this.masterGain.gain.setValueAtTime(0.7, this.ctx ? this.ctx.currentTime : 0);
    },

    // Synthesizer: create melodic synthwave/lo-fi tones
    // Keeps it modular: separate oscillators / gains per layer
    synthesizeTrack: function (trackMeta) {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.stop();

      const now = this.ctx.currentTime;
      this.startTime = now;
      this.pausedTime = 0;
      this.duration = (trackMeta && trackMeta.duration) ? parseFloat(trackMeta.duration) : 30;

      // Layer 1: bass (low sine, subtle)
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(80, now);
      bassOsc.frequency.linearRampToValueAtTime(120, now + 2);
      bassGain.gain.setValueAtTime(0.12, now);
      bassGain.gain.linearRampToValueAtTime(0.08, now + 1);
      bassOsc.connect(bassGain);
      bassGain.connect(this.masterGain);
      bassOsc.start(now);
      bassOsc.stop(now + this.duration);
      this.currentOscillators.push(bassOsc);
      this.currentGainNodes.push(bassGain);

      // Layer 2: melody (triangle for synthwave feel)
      const melOsc = this.ctx.createOscillator();
      const melGain = this.ctx.createGain();
      melOsc.type = 'triangle';
      // Simple scale notes for synthetic melody
      const notes = [440, 554, 659, 880, 554, 440];
      let noteIdx = 0;
      melOsc.frequency.setValueAtTime(notes[noteIdx], now);
      for (let i = 1; i < notes.length; i++) {
        const t = now + (i * (this.duration / notes.length));
        melOsc.frequency.setValueAtTime(notes[i], t);
      }
      melGain.gain.setValueAtTime(0.15, now);
      melGain.gain.linearRampToValueAtTime(0.05, now + 0.5);
      melOsc.connect(melGain);
      melGain.connect(this.masterGain);
      melOsc.start(now);
      melOsc.stop(now + this.duration);
      this.currentOscillators.push(melOsc);
      this.currentGainNodes.push(melGain);

      // Layer 3: chord pad (sawtooth, low gain)
      const chordOsc = this.ctx.createOscillator();
      const chordGain = this.ctx.createGain();
      chordOsc.type = 'sawtooth';
      chordOsc.frequency.setValueAtTime(220, now);
      chordGain.gain.setValueAtTime(0.06, now);
      chordOsc.connect(chordGain);
      chordGain.connect(this.masterGain);
      chordOsc.start(now);
      chordOsc.stop(now + this.duration);
      this.currentOscillators.push(chordOsc);
      this.currentGainNodes.push(chordGain);
    },

    play: function (trackMeta) {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (this.isPlaying && this.currentSource) {
        // Already playing — resume from pause
        return;
      }
      this.synthesizeTrack(trackMeta);
      this.isPlaying = true;
      if (typeof this.onPlay === 'function') this.onPlay();
      console.log('AudioEngine play.', trackMeta ? trackMeta.title || 'unknown track' : 'synth');
    },

    pause: function () {
      if (!this.isPlaying) return;
      // In this synth engine, "pause" stops oscillators softly and records time
      const now = this.ctx ? this.ctx.currentTime : 0;
      this.pausedTime = now - this.startTime;
      this.currentOscillators.forEach(function (osc) {
        try { osc.stop(); } catch (e) { /* already stopped */ }
      });
      this.isPlaying = false;
      if (typeof this.onPause === 'function') this.onPause();
      console.log('AudioEngine paused at', this.pausedTime);
    },

    resume: function () {
      if (this.isPlaying) return;
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      // For MVP: restart synthesis (seek not fully precise for synth tracks)
      // A production engine would use AudioBufferSourceNode with scheduled start.
      this.play({ duration: this.duration - (this.pausedTime || 0) });
      this.startTime = (this.ctx ? this.ctx.currentTime : 0) - (this.pausedTime || 0);
    },

    stop: function () {
      this.currentOscillators.forEach(function (osc) {
        try { osc.stop(); } catch (e) { /* ignore */ }
      });
      this.currentOscillators = [];
      this.currentGainNodes = [];
      this.isPlaying = false;
      this.pausedTime = 0;
      if (typeof this.onStop === 'function') this.onStop();
      console.log('AudioEngine stopped.');
    },

    seek: function (percent) {
      if (!this.ctx) return;
      const p = Math.max(0, Math.min(1, parseFloat(percent) || 0));
      const targetTime = p * this.duration;
      // For synth engine: approximate with time offset tracking
      this.pausedTime = targetTime;
      if (this.isPlaying) {
        // Restart synthesis from approximate point (simplified seek for MVP)
        this.stop();
        this.play({ duration: this.duration });
        this.startTime = this.ctx.currentTime - targetTime;
      }
    },

    // Visualizer data exposure (spec: analyser node for visualizer data)
    getAnalyserData: function () {
      if (!this.analyser || !this.frequencyData) return { freq: null, time: null };
      this.analyser.getByteFrequencyData(this.frequencyData);
      this.analyser.getByteTimeDomainData(this.timeDomainData);
      return {
        freq: new Uint8Array(this.frequencyData),
        time: new Uint8Array(this.timeDomainData),
        count: this.frequencyData.length,
      };
    },

    // Playback event callbacks wiring
    setCallbacks: function (cbs) {
      if (cbs && cbs.onPlay) this.onPlay = cbs.onPlay;
      if (cbs && cbs.onPause) this.onPause = cbs.onPause;
      if (cbs && cbs.onStop) this.onStop = cbs.onStop;
      if (cbs && cbs.onProgress) this.onProgress = cbs.onProgress;
    },

    // Track switching (spec requirement)
    switchTrack: function (trackMeta) {
      this.stop();
      this.play(trackMeta);
    },
  };

  // Expose globally for vanilla JS integration (app.js, visualizer)
  window.AudioEngine = AudioEngine;

  // Auto-init on script load
  document.addEventListener('DOMContentLoaded', function () {
    AudioEngine.init();
  });
})();
