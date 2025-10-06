# زندگی مهتاب - Personal Tracker PWA v1.0.7

A Progressive Web App (PWA) for personal activity tracking. All data is stored locally on your device using browser localStorage.

## Features

✅ **Offline-first**: Works without internet connection
✅ **Installable**: Can be installed as an app on phones and computers
✅ **Private**: All data stored locally on your device
✅ **No login required**: Just open and use
✅ **Multi-user friendly**: Each person's data is separate (stored in their own browser)

## How to Use

### Option 1: Open Locally (Easiest)

1. Open `index.html` directly in your browser (Chrome, Safari, Edge, Firefox)
2. That's it! Start tracking your activities

**Note**: Some browsers may block service workers when opening files directly. For full PWA features (offline mode, installation), use Option 2.

### Option 2: Use a Simple HTTP Server (Recommended for full PWA features)

**Python (if installed):**
```bash
cd v1.0.7
python -m http.server 8000
```
Then open: `http://localhost:8000`

**Node.js (if installed):**
```bash
cd v1.0.7
npx http-server -p 8000
```
Then open: `http://localhost:8000`

### Option 3: Host Online (For sharing with others)

Upload the entire `v1.0.7` folder to any free hosting service:
- **GitHub Pages** (free, easy)
- **Netlify** (free, drag & drop)
- **Vercel** (free)
- **Firebase Hosting** (free)

Each user who visits will have their own separate data stored locally in their browser.

## Installing as a Mobile App

### iPhone/iPad:
1. Open the app in Safari
2. Tap the Share button (box with arrow)
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

### Android:
1. Open the app in Chrome
2. Tap the menu (3 dots)
3. Tap "Install app" or "Add to Home Screen"

## Data Storage

- All data is stored in your browser's **localStorage**
- Each user has completely separate data
- Data persists even when you close the browser
- Data is NOT synced across devices
- To backup: Export your data (feature can be added if needed)

## Files

- `index.html` - Main application file
- `app.js` - All application logic and data handling
- `service-worker.js` - Enables offline functionality
- `manifest.json` - PWA configuration for installation

## Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)

## Privacy & Security

- ✅ No data sent to any server
- ✅ No tracking or analytics
- ✅ No internet required after first load
- ✅ All data stays on your device

## Clearing Data

To clear all your data:
1. Open browser developer tools (F12)
2. Go to "Application" or "Storage" tab
3. Clear localStorage for this site

Or simply clear your browser data/cache.

## Version

**v1.0.7** - PWA Edition with localStorage
