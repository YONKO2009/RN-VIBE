/**
 * Catalog Data - SYBAU Music MVP
 * 12+ Unique tracks (Electronic, Lo-Fi, Synthwave, Ambient, Pop)
 */
const CatalogData = {
  tracks: [
    {
      id: "track_001", title: "Neon Nights", artist: "CyberSynth", album: "Neon City",
      duration: 180, genre: "synthwave", lyrics: "Riding through the neon streets...",
      artUrl: "assets/images/neon-nights.jpg",
      audioParams: { tempo: 120, notes: ["C4","E4","G4"], scale: "major", bassline: "saw" }
    },
    {
      id: "track_002", title: "Morning Coffee", artist: "LoFi Boy", album: "Chill Vibes",
      duration: 150, genre: "lo-fi", lyrics: "Rainy days...",
      artUrl: "assets/images/coffee.jpg",
      audioParams: { tempo: 80, notes: ["A3","C4","E4"], scale: "minor", bassline: "sine" }
    },
    {
      id: "track_003", title: "Deep Ocean", artist: "Ambient Aura", album: "Seas",
      duration: 240, genre: "ambient", lyrics: "Waves roll endlessly...",
      artUrl: "assets/images/ocean.jpg",
      audioParams: { tempo: 60, notes: ["C3","E3","G3"], scale: "minorpent", bassline: "triangle" }
    },
    {
      id: "track_004", title: "Pulse Grid", artist: "SynthWave", album: "Gridlock",
      duration: 200, genre: "electronic", lyrics: "Electric heartbeats...",
      artUrl: "assets/images/grid.jpg",
      audioParams: { tempo: 128, notes: ["F4","A4","C5"], scale: "major", bassline: "square" }
    },
    {
      id: "track_005", title: "Midnight Drive", artist: "NightDriver", album: "Cruise",
      duration: 210, genre: "synthwave", lyrics: "Headlights on the highway...",
      artUrl: "assets/images/midnight.jpg",
      audioParams: { tempo: 110, notes: ["D4","F4","A4"], scale: "dorian", bassline: "saw" }
    },
    {
      id: "track_006", title: "Rain Study", artist: "LoFi Girl", album: "Study",
      duration: 180, genre: "lo-fi", lyrics: "Study notes in the rain...",
      artUrl: "assets/images/rain.jpg",
      audioParams: { tempo: 85, notes: ["A3","C4","E4"], scale: "minor", bassline: "sine" }
    },
    {
      id: "track_007", title: "Nebula", artist: "Cosmica", album: "Stars",
      duration: 300, genre: "ambient", lyrics: "Lost in the stars...",
      artUrl: "assets/images/nebula.jpg",
      audioParams: { tempo: 55, notes: ["B3","D4","F4"], scale: "blues", bassline: "triangle" }
    },
    {
      id: "track_008", title: "Electro Pop", artist: "Volt", album: "Energy",
      duration: 160, genre: "pop", lyrics: "Dance with voltage...",
      artUrl: "assets/images/volt.jpg",
      audioParams: { tempo: 140, notes: ["C4","E4","G4"], scale: "major", bassline: "square" }
    },
    {
      id: "track_009", title: "Glass Waves", artist: "Crystal", album: "Glass",
      duration: 220, genre: "ambient", lyrics: "Shattering glass sounds...",
      artUrl: "assets/images/glass.jpg",
      audioParams: { tempo: 70, notes: ["E3","G3","B3"], scale: "major", bassline: "triangle" }
    },
    {
      id: "track_010", title: "Retro 80s", artist: "RetroBoy", album: "Tape",
      duration: 190, genre: "electronic", lyrics: "Tape hiss and this...",
      artUrl: "assets/images/retro.jpg",
      audioParams: { tempo: 115, notes: ["C4","D4","E4"], scale: "pentatonic", bassline: "square" }
    },
    {
      id: "track_011", title: "Starlight", artist: "Lumina", album: "Night",
      duration: 250, genre: "pop", lyrics: "Under starlight...",
      artUrl: "assets/images/starlight.jpg",
      audioParams: { tempo: 100, notes: ["G4","B4","D5"], scale: "major", bassline: "sine" }
    },
    {
      id: "track_012", title: "Shadow Bass", artist: "DarkWave", album: "Shadows",
      duration: 175, genre: "synthwave", lyrics: "Bass in the shadows...",
      artUrl: "assets/images/shadow.jpg",
      audioParams: { tempo: 135, notes: ["A2","C3","E3"], scale: "minor", bassline: "saw" }
    }
  ]
};
window.CatalogData = CatalogData;
