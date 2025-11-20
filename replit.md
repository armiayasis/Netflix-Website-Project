# World FM Radio

## Overview

This is a web-based FM radio player that provides access to thousands of radio stations from around the world. Users can browse, search, and listen to radio stations by country, genre, or popularity. The application features a clean, modern interface with real-time audio streaming capabilities.

The app uses the Radio Browser API, a free community-driven database of radio stations, to provide access to stations from over 200 countries with millions of cumulative plays.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: Vanilla HTML, CSS, and JavaScript (no frameworks)

**Rationale**: A framework-free approach was chosen for maximum simplicity and performance. The radio player's requirements are straightforward enough that modern JavaScript APIs can handle all necessary functionality without additional abstractions.

**Key Features**:
- Single-page application with responsive design
- Real-time search and filtering
- Country and genre-based navigation
- Audio playback using HTML5 Audio API
- Visual feedback for currently playing station
- Statistics dashboard showing available stations and countries

**Design Pattern**: The frontend uses event-driven architecture with the HTML5 Audio API for streaming. State is managed through simple JavaScript variables, and the DOM is updated dynamically based on user interactions.

### Backend Architecture

**Technology Stack**: Node.js with Express.js

**Rationale**: Express provides a minimal, lightweight server to serve static files. Since the radio streaming is handled entirely client-side through the Radio Browser API, the backend only needs to serve HTML, CSS, and JavaScript files.

**Server Responsibilities**:
- Static file serving
- Single route for the main application
- No database or API endpoints needed

**Pros**:
- Extremely simple deployment
- Low server resource usage
- Fast response times
- Easy to maintain

**Cons**:
- Limited to client-side functionality only
- Cannot implement server-side features like favorites persistence
- Relies entirely on external API availability

### Data Flow

**Radio Station Data**: All radio station data comes from the Radio Browser API (https://www.radio-browser.info/), which provides:
- Station metadata (name, country, genre, logo)
- Streaming URLs
- Statistics (votes, play counts)
- Search and filtering capabilities

**Client-Side Data Management**:
- Station list loaded on page load (top 1000 by popularity)
- Client-side filtering and sorting for instant results
- No server-side data storage or caching

### Audio Streaming

**Technology**: HTML5 Audio API

**Implementation**:
- Direct streaming from station URLs to browser
- Volume control
- Play/pause functionality
- Error handling for unavailable streams

**Rationale**: The HTML5 Audio API provides built-in support for streaming audio with minimal code. It handles buffering, codec support, and cross-browser compatibility automatically.

## External Dependencies

### Radio Browser API

**Purpose**: Source of all radio station data and streaming URLs

**Integration Pattern**: RESTful API calls using native fetch API

**Endpoints Used**:
- `/json/stations/search` - Search and list stations
- `/json/url/{uuid}` - Track station clicks (analytics)

**API Features**:
- No authentication required (free, community-driven)
- Global network of radio stations
- Community voting and statistics
- Automatic stream validation

**Pros**:
- Completely free to use
- No API key required
- Large database (thousands of stations)
- Active community maintenance
- Built-in click tracking

**Cons**:
- API availability depends on community infrastructure
- Stream quality varies by station
- Some streams may go offline
- Limited control over station metadata quality

### Web Framework

**Library**: Express.js (v4.21.2)

**Purpose**: Minimal HTTP server for static file serving

**Middleware**:
- `express.json()` - JSON parsing (for potential future API endpoints)
- `express.static()` - Static file serving

### HTTP Client

**Library**: Axios (v1.7.9)

**Purpose**: While currently not actively used in the client-side code (using native fetch instead), it's available for potential server-side features or fallback HTTP requests.

## Features

### Core Functionality
1. **Browse Stations**: View popular stations from around the world
2. **Search**: Find stations by name, country, or genre
3. **Filter**: Filter by country or music genre
4. **Sort**: Sort by popularity, name, or play count
5. **Play**: Stream radio stations directly in the browser
6. **Volume Control**: Adjust playback volume
7. **Popular Countries**: Quick access to stations from 22+ popular countries

### User Interface
- Responsive design (mobile and desktop)
- Real-time statistics dashboard
- Visual indicators for currently playing station
- Station cards with logos, metadata, and statistics
- Country flags for easy recognition
- Toast notifications for user feedback

## Development Notes

### Future Enhancements
- User favorites/bookmarks (requires backend storage)
- Recently played history persistence
- Sleep timer functionality
- Equalizer controls
- Playlist creation
- Social sharing features
- Progressive Web App (PWA) support for offline capabilities

### Known Limitations
- Some radio streams may fail to load due to CORS or station availability
- No offline playback capability
- Browser compatibility depends on codec support
- Limited to stations available in Radio Browser database
