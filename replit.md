# BRIGADA NEWS FM - Radio Stations & Music Library

## Overview

BRIGADA NEWS FM is a comprehensive web-based radio streaming platform that provides access to 15 radio stations across the Philippines and features a curated music library of 28 love songs. The application serves as a digital radio directory with streaming capabilities, showcasing stations from major Philippine cities including Manila, Cebu, Davao, Iloilo, Baguio, Cagayan de Oro, Bacolod, Zamboanga, Tacloban, Puerto Princesa, and Metro Manila areas (Quezon City, Makati, Pasig, Antipolo) and Batangas. 

The application features an immersive landing page with a GET STARTED button and animated loading sequence before presenting the main interface with radio stations and a complete music library featuring Jim Brickman's love songs including the featured track "Destiny".

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Static Single-Page Application (SPA)**
- The application uses vanilla JavaScript without any framework dependencies
- HTML5 for structure with semantic markup
- CSS3 for styling with custom properties (CSS variables) for theming
- No build process or bundler required - serves static files directly

**Design Pattern: Component-Based UI**
- Landing page component with loading animation and "get started" flow
- Main application shell with header navigation
- Radio stations grid/list component
- Music library component
- Modal/player interface for streaming

**Styling Approach: Custom CSS with Theme Variables**
- CSS custom properties for consistent theming (colors, spacing)
- Gradient backgrounds with overlay effects for visual depth
- Responsive design using modern CSS (flexbox/grid implied)
- Poppins font family from Google Fonts for typography
- Color scheme: Dark theme with red primary (#e74c3c), gold accent (#f39c12)

### Backend Architecture

**Minimalist Node.js/Express Server**
- Simple Express.js server acting primarily as a static file server
- No database layer - data stored in JavaScript arrays in client-side code
- No API endpoints - all data embedded in frontend
- Server configuration includes cache-control headers to prevent caching
- Error handling for port conflicts with automatic retry mechanism

**Rationale:** This architecture was chosen for simplicity and ease of deployment. Since the radio stations and music library are relatively static datasets, embedding them in the frontend eliminates database dependencies and reduces system complexity. This approach is ideal for a small-scale application with infrequent data updates.

**Alternative Considered:** A full-stack approach with database storage would provide better scalability for dynamic content but would add unnecessary complexity for the current use case.

**Pros:**
- Zero database configuration required
- Simple deployment process
- Fast initial load (no API calls)
- Easy to maintain and update

**Cons:**
- Data updates require code changes and redeployment
- Not suitable for user-generated content
- Limited to static datasets
- No data persistence for user preferences

### Data Management

**Client-Side Data Storage**
- Radio stations array (15 stations) with metadata: name, location, frequency, stream URL
- Music library array (28 songs) with metadata: title, artist, duration, year
- All data hardcoded in `app.js`
- No server-side data persistence
- No client-side storage (localStorage/IndexedDB) implemented in current state

**Data Structure:**
- Radio stations include stream URLs pointing to radio.co service
- Music entries are informational only (no actual audio files referenced)
- Simple object structures suitable for iteration and display

### External Dependencies

**Third-Party Services:**
- **radio.co**: Audio streaming service provider for radio station streams (https://streams.radio.co)
  - All radio stations currently point to the same stream endpoint
  - Requires internet connectivity for streaming functionality

**NPM Dependencies:**
- **Express.js (^4.18.2)**: Web server framework
  - Provides routing, middleware, static file serving
  - Industry-standard, minimal, unopinionated framework

**External Resources:**
- **Google Fonts (Poppins)**: Typography
  - Loaded via CDN with preconnect optimization
  - Weights: 300, 400, 600, 700, 900

**Content Delivery:**
- No CDN for application assets
- Direct serving of static files from Express server
- Font files loaded from Google's CDN

### Deployment Architecture

**Server Configuration:**
- Listens on configurable PORT (environment variable) or default 5000
- Binds to 0.0.0.0 for external accessibility (Replit-friendly)
- Serves index.html as root route
- Static middleware serves all files from project root directory

**Port Management:**
- Automatic retry logic for port conflicts
- 1-second delay before retry attempt
- Suitable for development environments with potential port conflicts

### Application Flow

**User Journey:**
1. Landing page loads with animated loader and radio wave effects
2. User clicks "GET STARTED" button
3. Transitions to main application interface
4. Navigation allows switching between Home, Radio Stations, and Music Library
5. Users can select stations or songs for playback

**State Management:**
- Minimal state tracked (isPlaying boolean flag)
- No complex state management library
- DOM manipulation for UI updates (implied from structure)

### Security & Performance

**Cache Control:**
- Aggressive no-cache headers to ensure fresh content delivery
- Prevents browser caching of HTML/assets during development

**Performance Considerations:**
- Static asset serving (fast delivery)
- External streaming reduces server bandwidth requirements
- No database queries = low latency
- Font preconnect optimization for faster font loading
## Recent Changes

**November 8, 2025 - Complete Radio & Music Platform Built**
- Created immersive landing page with GET STARTED button and animated radio wave loader
- Implemented 4-stage loading sequence with progress bar showing:
  - "Nag-lo-load ng mga istasyon..."
  - "Nag-download ng music library..."
  - "Hinihanda ang player..."
  - "Tapos na! Magsisimula..."
- Added 15 radio stations from across the Philippines:
  - Manila FM 99.5, Cebu FM 101.1, Davao FM 95.3, Iloilo FM 97.7
  - Baguio FM 88.9, Cagayan de Oro FM 94.5, Bacolod FM 103.3
  - Zamboanga FM 92.1, Tacloban FM 96.5, Puerto Princesa FM 98.3
  - Quezon City FM 100.7, Makati FM 102.5, Pasig FM 90.3
  - Antipolo FM 104.1, Batangas FM 93.7
- Created complete music library with 28 Jim Brickman love songs including:
  - Featured track: "Destiny" (1998)
  - Other hits: "The Gift", "Valentine", "Beautiful", "Love of My Life"
  - Complete metadata: title, artist, duration, year for all tracks
- Implemented "SEARCH MUSIC AND PLAY" functionality:
  - Real-time search filtering by title and artist
  - Auto-play feature when single result found
  - "No results" message for unsuccessful searches
- Added PLAY buttons for all 28 songs in music library
- Added DOWNLOAD buttons for all songs
- Created station cards with individual PLAY STATION buttons
- Implemented volume controls on each station card
- Built comprehensive notification system for user feedback
- Designed modern dark theme with gradient effects throughout
- Added responsive design for mobile and desktop
- Configured Express.js server on port 5000 with cache control

**Features Implemented:**
- ✅ Landing page with GET STARTED button
- ✅ Loading animation with progress bar
- ✅ 15 radio stations across Philippines
- ✅ 28 Jim Brickman love songs
- ✅ Search music and play functionality
- ✅ Play buttons for each song
- ✅ Download buttons for each song
- ✅ Volume controls for each station
- ✅ Radio wave animations
- ✅ Modern gradient styling
- ✅ Responsive mobile design
- ✅ User notifications system

## Next Steps

**Potential Enhancements:**
- Add actual audio files for the 28 songs in the music library
- Implement actual download functionality for songs
- Add playlist creation and management
- Integrate real streaming URLs for each station
- Add user favorites and recently played tracking
- Implement share functionality for songs and stations
- Add podcast section
- Create admin panel for managing stations and songs
