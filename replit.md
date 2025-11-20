# AI Video Generator - Veo 2.0

## Overview

This is an AI-powered video generation application that leverages Google's Veo 2.0 API to create videos from text descriptions. The application provides a web-based interface where users can describe their desired video content and configure generation parameters (duration, aspect ratio, resolution). The system handles asynchronous video generation through long-polling, managing the entire lifecycle from request submission to final video delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: Vanilla HTML, CSS, and JavaScript with no framework dependencies.

**Rationale**: Chosen for simplicity and minimal setup overhead. The application's UI requirements are straightforward enough that a framework would add unnecessary complexity. This allows for faster load times and easier maintenance for small-scale deployments.

**Key Components**:
- Single-page application structure with form-based video generation interface
- Client-side state management for tracking video generation history and polling status
- Polling mechanism implemented in JavaScript to check video generation status asynchronously

**Design Pattern**: The frontend uses a simple request-response pattern with client-side polling. When a video generation request is initiated, the client stores the operation ID and polls the backend at regular intervals until completion.

**Pros**: 
- No build process required
- Easy to understand and modify
- Minimal dependencies

**Cons**: 
- May become difficult to maintain as complexity grows
- Manual DOM manipulation can be error-prone

### Backend Architecture

**Technology Stack**: Node.js with Express.js framework

**Rationale**: Express provides a lightweight, unopinionated framework suitable for building REST APIs quickly. Node.js's asynchronous nature aligns well with the long-running video generation operations that require polling.

**API Structure**: 
- RESTful endpoints using Express routing
- `/api/generate-video` - POST endpoint to initiate video generation
- Server-side polling function that continuously checks operation status with Google's API

**Error Handling**: The application implements try-catch blocks for API calls with specific error message handling for client feedback.

**Pros**:
- Lightweight and fast for I/O-bound operations
- Large ecosystem of packages
- Easy deployment on Replit

**Cons**:
- Single-threaded nature could be limiting for CPU-intensive tasks
- Callback/promise complexity for deeply nested operations

### Data Storage

**Technology Stack**: Replit Database (`@replit/database`)

**Rationale**: The application uses Replit's built-in key-value database for simple data persistence needs. This choice aligns with the Replit deployment environment and provides zero-configuration data storage.

**Usage Pattern**: While the database dependency is included, the current implementation appears to focus on real-time operations. The database would be used for persisting video generation history, user preferences, or operation metadata.

**Alternatives Considered**: 
- Traditional SQL databases (PostgreSQL, MySQL) - More complex setup for simple needs
- MongoDB - Overhead not justified for basic key-value storage

**Pros**:
- Zero configuration required
- Integrated with Replit environment
- Sufficient for simple persistence needs

**Cons**:
- Limited querying capabilities
- Not suitable for complex relational data
- Vendor lock-in to Replit platform

### Asynchronous Operation Handling

**Pattern**: Long-polling implementation

**Rationale**: Video generation through Google's Veo 2.0 API is an asynchronous operation that can take several minutes. The application uses a polling mechanism to repeatedly check operation status until completion.

**Implementation**: 
- Server-side polling function with configurable max attempts and delay intervals
- Client-side polling triggered after successful generation request
- Operation ID tracking to maintain state across polling requests

**Alternatives Considered**:
- WebSockets - More complex setup for this use case
- Server-Sent Events (SSE) - One-way communication suitable but adds complexity

**Pros**:
- Simple to implement with standard HTTP
- Compatible with all browsers
- No persistent connection overhead

**Cons**:
- Increased server load from repeated requests
- Not real-time; has latency based on polling interval
- Can be inefficient for long-running operations

## External Dependencies

### Google Veo 2.0 API

**Purpose**: Core video generation functionality

**Integration Pattern**: RESTful API calls using Axios HTTP client

**Authentication**: API key-based authentication via `x-goog-api-key` header, with the key stored in environment variable `GOOGLE_AI_API_KEY`

**API Endpoints Used**:
- Video generation endpoint at `https://generativelanguage.googleapis.com/v1beta`
- Operation polling endpoint for checking generation status

**Configuration Parameters**:
- Prompt (text description)
- Duration (4-8 seconds)
- Aspect ratio (16:9, 9:16)
- Resolution (720p, 1080p)

### HTTP Client

**Library**: Axios (v1.13.2)

**Purpose**: Making HTTP requests to Google's API with better error handling and request/response interceptors compared to native fetch

**Rationale**: Axios provides a cleaner API for handling HTTP requests with built-in JSON transformation and better error handling than native fetch API.

### Web Framework

**Library**: Express.js (v4.21.2) with standard middleware

**Middleware Stack**:
- `express.json()` - Parsing JSON request bodies
- `express.static()` - Serving static frontend files

**Purpose**: Provides routing, middleware support, and request/response handling for the backend API

### Environment Variables

**Required Configuration**:
- `GOOGLE_AI_API_KEY` - Google AI API authentication key

**Deployment Consideration**: The application expects this environment variable to be set in the Replit environment secrets for security.