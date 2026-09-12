# Task 1 Brief: Project Setup

**Goal:** Initialize git repository, setup file structure, add fonts, and core infrastructure (.gitignore, config, store, license, README).

**Requirements (Verbatim):**
1. Initialize git repo (`git init`).
2. Create .gitignore (node_modules/, .DS_Store, Thumbs.db, *.log).
3. Create MIT LICENSE (copyright 2026 Ravi).
4. Update index.html:
   - Add new Google Fonts link: `family=Dela+Gothic+One&family=Figtree:wght@400;500;600;700;800;900&family=Fredoka:wght@400;500;600;700&family=Gasoek+One&display=swap`
   - Update <title> to "SYBAU Music"
5. Add CSS variables to `css/style.css`:
   - Add: `--font-hero: "Gasoek One", cursive, sans-serif;`
   - Add: `--font-display: "Dela Gothic One", cursive, sans-serif;`
   - Add: `--font-cta: "Fredoka", sans-serif;`
   - Add: `--font: "Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`
6. Create `js/config.js` (see plan Task 1).
7. Create `js/store.js` (see plan Task 1).
8. Create `README.md` (see plan Task 1).
9. Update `index.html` script tags:
   - Replace old script tag with:
     ```html
     <script src="js/config.js"></script>
     <script src="js/store.js"></script>
     <script src="js/api.js"></script>
     <script src="js/player.js"></script>
     <script src="js/app.js"></script>
     ```
10. Commit all changes.
