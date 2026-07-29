# LiftLog Client

A complete React + Vite + Tailwind CSS frontend for the supplied LiftLog MERN backend.

## Features

### User
- Register and login
- Cookie-based JWT session restoration
- Dashboard with today’s workout and quick stats
- Exercise library and exercise details
- Create, edit, and delete personal workout plans
- Start a workout and log weight/reps set by set
- Save completed workout sessions
- Automatic personal-record result display
- Workout history and workout details
- Personal-record dashboard
- Fitness profile and Cloudinary profile-image upload
- Responsive desktop sidebar, mobile header, drawer, and bottom navigation

### Admin
- Role-aware admin dashboard
- View all exercises
- Create exercise with image upload
- Edit exercise
- Delete exercise
- Preview the public exercise library
- Manage profile

## Run locally

1. Start the supplied backend at `http://localhost:5000`.
2. Copy `.env.example` to `.env`.
3. Install and run the client:

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`, matching the backend CORS configuration.

## Backend endpoints used

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/users/profile`
- `/api/users/profile-image`
- `/api/exercises`
- `/api/workout-plans`
- `/api/workout-plans/today`
- `/api/workout-sessions`
- `/api/records`

## Important backend notes

- The backend’s authentication middleware currently reads the JWT from the HTTP-only `token` cookie. The client uses `withCredentials: true`.
- Login returns a token too, so the client also stores it locally, but the cookie is what authorizes the current backend implementation.
- New registrations receive the `user` role. To test the admin UI, set an existing user’s `role` to `admin` in MongoDB.
- The backend CORS origin is hardcoded to `http://localhost:5173`. Before deployment, update it to accept your deployed client URL through an environment variable.
- Profile and exercise images are uploaded through the backend’s Cloudinary configuration.

## Chris Bumstead image credit

The included inspiration image is:

- **Chris Bumstead on Gymshark**
- Source: Wikimedia Commons
- Author/source credit: Gymshark
- License: Creative Commons Attribution 3.0 Unported
- No endorsement by Chris Bumstead or Gymshark is implied.

The attribution is also included in the landing-page footer.


## LiftLog 1.1 dashboard and progress update

- Today’s workout now shows exercise count, muscle focus, and estimated duration.
- Dashboard cards now show current streak, current weight, target/fitness goal, and last workout.
- Workout-plan cards include schedule, muscle groups, exercise count, estimated time, and premium controls.
- History cards include exercise count, workout name, duration, volume, and completion date.
- Workout details show estimated calorie burn and exercise-level PR badges.
- Personal records show weight, best reps, achieved date, previous best, current best, and progress.
- Exercise cards are fully clickable.
- Exercise details support video, primary/secondary muscles, instructions, common mistakes, and coaching tips.
- Main page loading uses a dumbbell animation and skeleton layout.
