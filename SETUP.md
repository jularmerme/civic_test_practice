# Project Setup & Build Instructions

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

This will:
- Compile TypeScript files from `/src` to `/dist`
- Generate Tailwind CSS in `/dist/styles.css`
- Create source maps for debugging

### 3. Run Locally
```bash
npm run serve
```

Open `http://localhost:8080` in your browser.

### 4. Development Mode (Watch)
```bash
npm run dev
```

This runs both TypeScript and Tailwind watchers simultaneously.

## Build Scripts

- `npm run build:css` — Compile Tailwind CSS only
- `npm run build:ts` — Compile TypeScript only
- `npm run build` — Full build (CSS + TS)
- `npm run watch:css` — Watch CSS files
- `npm run watch:ts` — Watch TypeScript files
- `npm run dev` — Watch both (development)
- `npm run serve` — Start local HTTP server

## Project Structure

```
src/
├── main.ts              # Application entry point
├── types/
│   └── index.ts         # TypeScript interfaces
├── data/
│   └── questions.ts     # All 128 civics questions
├── modules/
│   ├── quiz.ts          # Quiz & mock exam logic
│   ├── storage.ts       # localStorage management
│   └── ui.ts            # UI rendering
└── styles/
    └── input.css        # Tailwind CSS config

dist/
├── index.html           # HTML template
├── styles.css           # Compiled CSS (generated)
└── *.js                 # Compiled TypeScript (generated)
```

## Requirements

- Node.js 16 or higher
- npm 7 or higher

Check your versions:
```bash
node --version
npm --version
```

## Deployment

The app is a static web app. Deploy `/dist` to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting provider

No server required.

## Troubleshooting

### Build fails
- Ensure Node.js 16+ is installed
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Changes not showing
- Rebuild: `npm run build`
- Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Check browser console for errors

### Port 8080 already in use
- Change port in serve command: `npx http-server ./dist -p 3000`
- Or kill process: `lsof -ti:8080 | xargs kill -9` (macOS/Linux)

## Notes

- All TypeScript is compiled to ES2020
- Tailwind CSS is purged (unused styles removed)
- Source maps enabled for debugging
- No external dependencies at runtime (all in devDependencies)
