# LMS Frontend

This is a basic React frontend for the LMS backend.

## Setup

```
cd frontend
npm install
```

## Running the Frontend

```
npm run dev
```

The app will be available at http://localhost:5173

## Features
- Video upload (for instructors)
- Video playback (for students, with HLS streaming)

## Notes
- The lessonId is hardcoded for demo. Update it to match the seeded lesson's id or fetch from backend.
- Make sure the backend is running and accessible at http://localhost:4000