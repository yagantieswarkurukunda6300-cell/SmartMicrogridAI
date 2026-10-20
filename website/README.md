# Website Setup and Instructions

## Running the Website Locally

### Option 1: Using Python (Recommended)
`ash
# Navigate to the website directory
cd website

# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
`

Then open your browser and go to http://localhost:8000

### Option 2: Using Node.js
`ash
# Install http-server globally (if not installed)
npm install -g http-server

# Navigate to website directory
cd website

# Start server
http-server -p 8000
`

### Option 3: Using VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Open the website folder in VS Code
3. Right-click on index.html and select "Open with Live Server"

## Features
- Responsive design (desktop, tablet, mobile)
- Smooth animations and transitions
- Interactive charts (Chart.js)
- Dark theme with neon accents
- Accessible design with reduced motion support
- Demo data clearly labeled as illustrative

## Notes
- All chart data and dashboard values are **demo/illustrative only** - not connected to live MATLAB
- The website is a visual presentation layer; MATLAB simulation runs separately via main_sim.m
- Uses Chart.js from CDN for charts

## Browser Compatibility
- Chrome, Firefox, Safari, Edge (modern versions)
- Requires JavaScript enabled
