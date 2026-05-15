# User Analytics Application - Implementation Plan

## 1. Project Overview

**Project Name:** Event Tracker Analytics Dashboard
**Objective:** Build a full-stack application that tracks user interactions on a webpage and displays them in an analytics dashboard.

---

## 2. Tech Stack

- **Frontend:** React with Vite (lightweight alternative to Next.js for this scope)
- **Backend:** Node.js with Express.js and TypeScript
- **Database:** MongoDB (local or Atlas)
- **Tracking:** Vanilla JavaScript snippet

---

## 3. Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Demo Website   │────▶│   Backend API   │────▶│    MongoDB      │
│ (Tracking JS)  │     │   (Express)      │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   React Dashboard│
                        │   - Sessions    │
                        │   - Heatmap     │
                        └─────────────────┘
```

---

## 4. Implementation Steps

### Phase 1: Backend API (Node.js + Express + MongoDB)

#### Step 1.1: Project Setup
- Initialize Node.js project: `npm init -y`
- Install dependencies: `express`, `mongoose`, `cors`, `dotenv`
- Install dev dependencies: `typescript`, `ts-node`, `@types/node`, `@types/express`, `@types/cors`
- Initialize TypeScript config: `tsc --init`
- Create folder structure: `/server`, `/server/models`, `/server/routes`

#### Step 1.2: MongoDB Models
- **Event Model:**
  - session_id (String)
  - event_type (String: "page_view" | "click")
  - page_url (String)
  - timestamp (Date)
  - click_x (Number, optional)
  - click_y (Number, optional)

#### Step 1.3: API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Receive and store events |
| GET | `/api/sessions` | Fetch list of sessions with event counts |
| GET | `/api/sessions/:sessionId` | Fetch all events for a specific session |
| GET | `/api/heatmap/:pageUrl` | Fetch click data for a page |

#### Step 1.4: Server Implementation
- Create `server.ts` with Express app
- Connect to MongoDB
- Implement routes inline or use `routes/` directory
- Add basic error handling and TypeScript interfaces

---

### Phase 2: Client-Side Tracking (JavaScript)

#### Step 2.1: Create Tracking Script
- Create `tracker.js` - standalone script
- Implement session_id management (localStorage)
- Implement event collection:
  - `page_view` - on page load
  - `click` - on click events with x/y coordinates

#### Step 2.2: Create Demo Page
- Create `demo.html` - simple webpage for testing
- Include the tracking script
- Add some interactive elements (buttons, links)

---

### Phase 3: Frontend Dashboard (React)

#### Step 3.1: Project Setup
- Create React app with Vite: `npm create vite@latest client -- --template react`
- Install dependencies: `axios`, `react-router-dom`

#### Step 3.2: Components Structure
```
/src
  /components
    - SessionsList.jsx
    - SessionDetail.jsx
    - Heatmap.jsx
  /pages
    - Dashboard.jsx
  - App.jsx
  - main.jsx
```

#### Step 3.3: Sessions View Implementation
- Fetch and display list of sessions
- Show total event count per session
- Click session to view user journey (ordered events)

#### Step 3.4: Heatmap View Implementation
- Dropdown to select page URL
- Display click positions as dots on a representation
- Simple coordinate-based visualization

---

## 5. Database Schema

### Event Collection
```javascript
{
  _id: ObjectId,
  session_id: String,
  event_type: String,
  page_url: String,
  timestamp: Date,
  click_x: Number (optional),
  click_y: Number (optional)
}
```

### Indexes
- `session_id` - for querying user sessions
- `page_url` - for heatmap queries
- `timestamp` - for chronological ordering

---

## 6. API Response Formats

### GET /api/sessions
```json
[
  {
    "session_id": "abc123",
    "event_count": 15,
    "first_event": "2024-01-01T10:00:00Z",
    "last_event": "2024-01-01T10:30:00Z"
  }
]
```

### GET /api/sessions/:sessionId
```json
{
  "session_id": "abc123",
  "events": [
    {
      "event_type": "page_view",
      "page_url": "/home",
      "timestamp": "2024-01-01T10:00:00Z"
    },
    {
      "event_type": "click",
      "page_url": "/home",
      "click_x": 150,
      "click_y": 200,
      "timestamp": "2024-01-01T10:05:00Z"
    }
  ]
}
```

### GET /api/heatmap/:pageUrl
```json
{
  "page_url": "/home",
  "clicks": [
    { "x": 150, "y": 200 },
    { "x": 300, "y": 400 }
  ]
}
```

---

## 7. Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas account)

### Backend Setup
```bash
cd server
npm install
# Create .env with MONGO_URI and PORT
npm start # runs ts-node server.ts
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Demo Page
- Open `demo.html` in browser
- Interact with page to generate events
- View in dashboard

---

## 8. Assumptions & Trade-offs

1. **Authentication:** Not required for this demo (production would need auth)
2. **Session Management:** Using localStorage for session_id persistence
3. **Data Retention:** No cleanup implemented (production would need TTL)
4. **Heatmap:** Simple coordinate dots, not an actual heatmap visualization
5. **Error Handling:** Basic implementation, production would need more robust handling
6. **CORS:** Enabled for development, should be restricted in production

---

## 9. File Structure

```
/events-tracker
├── needs.txt
├── /server
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── server.ts
│   ├── .env
│   ├── /routes
│   └── /models
│       └── Event.ts
├── /client
│   ├── package.json
│   ├── vite.config.js
│   ├── /src
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── /components
│   │   │   ├── SessionsList.jsx
│   │   │   ├── SessionDetail.jsx
│   │   │   └── Heatmap.jsx
│   │   └── /pages
│   │       └── Dashboard.jsx
├── /demo
│   ├── demo.html
│   └── tracker.js
└── /plans
    └── plan.md
```

---

## 10. Verification Steps

1. **Backend:** Start server, test endpoints with curl/Postman
2. **Tracking:** Open demo.html, interact, verify events in database
3. **Dashboard:** Run React app, verify sessions list loads
4. **Session Detail:** Click session, verify ordered events display
5. **Heatmap:** Select page, verify click positions display correctly

---

## 11. Future Improvements (Out of Scope)

- User authentication
- Real-time updates (WebSocket)
- Advanced heatmap visualization
- Event filtering/search
- Data export
- Performance optimization for large datasets