# Event Tracker Analytics Dashboard

A full-stack application that tracks user interactions on a webpage and displays them in an analytics dashboard.

## Tech Stack

- **Frontend Dashboard:** React with Vite (upcoming)
- **Backend API:** Node.js, Express.js, TypeScript
- **Database:** MongoDB
- **Client-Side Tracking:** Vanilla JavaScript (upcoming)

## Setup Steps

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas account)

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5001
   ```
4. Start the backend development server:
   ```bash
   npm start
   ```
*(Note: To build for production, run `npm run build` followed by `node dist/server.js`)*

## Assumptions & Trade-offs

1. **Authentication:** Not required for this demo (production would need authentication and authorization).
2. **Session Management:** Using `localStorage` for `session_id` persistence in the browser.
3. **Data Retention:** No automatic cleanup or TTL implemented (production would need retention policies).
4. **Heatmap:** Simple coordinate dots, not a complex density-based heatmap visualization.
5. **CORS:** Enabled broadly for development purposes, but should be strictly restricted to the specific frontend origin in production.
6. **Error Handling:** Basic error handling is implemented. In a real-world scenario, a robust logging and monitoring system would be necessary.
