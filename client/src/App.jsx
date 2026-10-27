import { useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx'; import Movie from './pages/Movie.jsx'; import Seats from './pages/Seats.jsx';
import Auth from './pages/Auth.jsx'; import MyBookings from './pages/MyBookings.jsx';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const nav = useNavigate();
  const login = d => { localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(d.user)); setUser(d.user); };
  const logout = () => { localStorage.clear(); setUser(null); nav('/'); };
  return (<>
    <nav className="nav py-2"><div className="container d-flex align-items-center gap-3">
      <Link to="/" className="brand me-auto">IMovies</Link>
      {user ? <><Link to="/bookings">My bookings</Link><span className="muted">{user.name}</span>
        <button className="btn btn-sm btn-outline-light" onClick={logout}>Log out</button></>
        : <Link to="/login" className="btn btn-sm btn-accent">Log in</Link>}
    </div></nav>
    <main className="container py-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/show/:id" element={<Seats user={user} />} />
        <Route path="/login" element={<Auth onAuth={login} />} />
        <Route path="/bookings" element={user ? <MyBookings /> : <Navigate to="/login" />} />
      </Routes>
    </main></>);
}
