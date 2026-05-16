# CausalFunnel - Event Tracker Analytics Dashboard

A robust, full-stack application that tracks user interactions on a webpage (such as page views and clicks) and displays them in a real-time analytics dashboard. Built as part of the CausalFunnel hiring process for the Full Stack Engineer role.

## Live Demo URLs

- **Main Analytics Dashboard:** [https://events-tracker-plum.vercel.app/](https://events-tracker-plum.vercel.app/)
- **Demo Website (To generate events):** [https://events-tracker-plum.vercel.app/demo.html](https://events-tracker-plum.vercel.app/demo.html)

## How It Works

1. **Client-Side Tracking:** A lightweight vanilla JavaScript snippet (`tracker.js`) is embedded in the demo page. It automatically generates a unique `session_id` using `localStorage`. It listens for `load` (page views) and `click` events, attaching X/Y coordinates to clicks, and sends this data asynchronously to the backend API.
2. **Backend API:** A Node.js/Express application receives the events and stores them in a MongoDB database. It provides RESTful endpoints to query aggregated session data, detailed user journeys, and heatmap coordinates.
3. **Analytics Dashboard:** A React application fetches the data and visualizes it. It features a "Sessions View" to explore chronological user journeys and a "Heatmap View" to visually plot click coordinates over a simplified page representation.

## Tech Stack

- **Frontend Dashboard:** React with Vite, Axios for API communication.
- **Backend API:** Node.js, Express.js, TypeScript. (Refactored to MVC architecture with centralized error handling).
- **Database:** MongoDB (Mongoose ODM).
- **Client-Side Tracking:** Vanilla JavaScript.
- **Hosting/Deployment:** Vercel (Frontend & Serverless Backend).

## Setup Instructions (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas account)

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
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5001
   ```
4. Start the backend development server:
   ```bash
   npm start
   ```

### Frontend Dashboard Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

### Running the Demo Locally
Since the tracking script is dynamically configured via data attributes, you can simply view `demo.html` via the frontend dev server at `http://localhost:5173/demo.html`.

## Assumptions & Trade-offs

1. **Authentication:** Not required for this demo. In production, the dashboard would be protected by authentication (e.g., JWT) and the tracking API would implement rate limiting or origin verification.
2. **Session Management:** Used `localStorage` for `session_id` persistence in the browser. In a production scenario requiring cross-domain tracking, cookies with appropriate `SameSite` policies might be necessary.
3. **Data Retention:** No automatic cleanup or TTL (Time To Live) is implemented. Production would require data retention policies to prevent database bloat.
4. **Heatmap Visualization:** Implemented as a simplified coordinate scatter plot based on relative click coordinates. A production-grade heatmap would need to account for varying screen sizes, responsive layouts, and viewport resizing using percentage-based mapping or canvas overlays.
5. **CORS:** Enabled broadly for development and ease of testing, but should be strictly restricted to specific trusted frontend origins in production.
6. **Vercel Serverless Optimization:** The database connection uses a pooling check (`mongoose.connection.readyState`) and is wrapped in an Express middleware to ensure the DB connects before API routes execute, preventing Mongoose buffering timeouts during serverless cold starts.
