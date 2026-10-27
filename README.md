<<<<<<< HEAD
# IMovies – Movie ticket booking (MERN)

Browse movies, pick a showtime, reserve seats with live availability, and manage bookings. Built with React (Vite), Express, Node.js, and MongoDB.

## Features
- **Live Seat Availability**: Real-time seat layout showing available, reserved, and booked seats.
- **Atomic MongoDB Seat Reservation**: Prevents double-booking with atomic condition checks.
- **Authentication**: JWT authentication with bcrypt password hashing.
- **Booking Management**: View your active and past bookings, with one-click cancellation.

---

## Quick Start

### 1. Start Both Frontend and Backend (One Command)
From the root directory:
```bash
npm start
```
*(Or double-click `run.bat` on Windows)*

- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### 2. Demo Account
- **Email**: `demo@imovies.com`
- **Password**: `demo123`

---

## Separate Process Commands

If you prefer running server and client in separate terminals:

### Server
```bash
cd server
npm install
npm run seed      # Populates movies, users, and upcoming shows
npm start         # Starts backend API on :5000
```

### Client
```bash
cd client
npm install
npm run dev       # Starts Vite dev server on :5173
```

---

## API Reference
- `POST /api/auth/register` - Create a new user
- `POST /api/auth/login` - Authenticate and get JWT token
- `GET /api/movies` - List all movies
- `GET /api/movies/:id` - Movie details with upcoming showtimes
- `GET /api/shows/:id` - Showtime seat availability
- `POST /api/bookings` *(auth)* - Reserve seats `{ showId, seats: ['A1', 'A2'] }`
- `GET /api/bookings/mine` *(auth)* - View user's bookings
- `DELETE /api/bookings/:id` *(auth)* - Cancel an upcoming booking
=======
# iMovies2
>>>>>>> e798f758425583bbbb578a0c41fa2859f1e2ee08
