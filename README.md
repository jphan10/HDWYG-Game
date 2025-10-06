# HDWYG PDF Card Reader

A web application that transforms PDF pages into interactive cards with different levels and categories.

## Features

- **Instructions Section**: Sequential navigation through instruction pages (1-8)
- **Level-based Cards**: 
  - Level 1: Pages 9-19
  - Level 2: Pages 22-31  
  - Level 3: Pages 34-41
  - Challenge: Pages 20, 32, 42
- **Mobile-friendly**: Responsive design optimized for touch devices
- **View Tracking**: Visual indicators for viewed cards with persistent state
- **PDF Rendering**: Uses PDF.js for client-side PDF rendering

## Local Development

1. Place your PDF file named `DATING EDITION SAMPLE.pdf` in the root directory
2. Open `index.html` in a web browser, or
3. Run a local server:
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## Deployment

This app is configured for deployment on Render.com:

1. Connect your GitHub repository to Render
2. Use the following settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

## File Structure

```
├── index.html          # Main HTML file
├── style.css          # Styles and responsive design
├── script.js          # JavaScript functionality
├── server.js          # Express server for production
├── package.json       # Node.js dependencies
└── DATING EDITION SAMPLE.pdf  # Your PDF file
```

## Usage

1. **Instructions**: Start here to learn how to use the cards
2. **Levels**: Choose from Level 1, 2, or 3 to see available cards
3. **Challenge**: Access special challenge cards
4. **Card Tracking**: Cards you've viewed will show a green checkmark
5. **Mobile**: Fully optimized for mobile use with touch-friendly interface

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## Technical Details

- Uses PDF.js for client-side PDF rendering
- LocalStorage for persistent view state
- Responsive CSS Grid and Flexbox
- Express.js server for production deployment