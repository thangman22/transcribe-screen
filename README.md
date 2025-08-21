# Transcribe Screen

A simple, real-time speech transcription and translation application built with vanilla JavaScript and Tailwind CSS.

## Features

- **Real-time Speech Recognition**: Uses Web Speech API for live transcription
- **Instant Translation**: Real-time translation using the Translator API
- **Flexible Layouts**: Switch between vertical (side-by-side) and horizontal (stacked) layouts
- **Multi-language Support**: 60+ recognition languages and 50+ translation languages
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to the local development URL

4. **Click "Start Transcription"** to begin

## Deployment

### GitHub Pages (Recommended)

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Push your code to GitHub** (make sure you're on the `main` branch)
2. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically)
   - Folder: `/ (root)`
3. **The deployment will happen automatically** when you push to the `main` branch

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Local Preview

```bash
# Preview the production build locally
npm run preview
```

## Usage

### Basic Operation
1. Click the **Start Transcription** button
2. Allow microphone access when prompted
3. Speak in your chosen recognition language
4. View real-time transcription and translation

### Settings
- Press **S** key or click the settings button (⚙️) to open settings
- Change recognition language (source language)
- Change translation language (target language)
- Switch between vertical and horizontal layouts

### Keyboard Shortcuts
- **S**: Open settings modal
- **Escape**: Close settings modal

## Project Structure

```
transcribe-screen/
├── src/
│   ├── languages.js      # Consolidated language data
│   └── script.js         # Main application logic
├── index.html            # HTML structure
├── style.css             # Styling and layout
├── vite.config.js        # Build configuration
├── .github/workflows/    # GitHub Actions deployment
└── package.json          # Dependencies and scripts
```

## Code Architecture

The refactored code follows a simple, maintainable structure:

- **Single language file**: All language data consolidated in `languages.js`
- **Modular functions**: Each feature is a focused, single-responsibility function
- **Centralized state**: App state managed in a single object
- **Clean DOM access**: All DOM elements referenced through a single `elements` object
- **Utility functions**: Reusable helper functions for common operations

## Technologies Used

- **Vanilla JavaScript** (ES6+)
- **Web Speech API** for speech recognition
- **Translator API** for real-time translation
- **Tailwind CSS** for styling
- **Vite** for build tooling

## Browser Support

- **Speech Recognition**: Chrome, Edge, Safari (WebKit)
- **Translation**: Modern browsers with Translator API support
- **Layout**: All modern browsers with CSS Grid/Flexbox support

## Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## License

ISC
