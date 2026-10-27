@echo off
echo Starting IMovies Server and Client...
start cmd /k "cd server && npm start"
start cmd /k "cd client && npm run dev"
echo IMovies is running!
echo Server: http://localhost:5000
echo Client: http://localhost:5173
pause
