import { useEffect, useState } from 'react'; import { Link } from 'react-router-dom'; import { api } from '../api.js';
export default function Home() {
  const [movies, setMovies] = useState([]); const [err, setErr] = useState('');
  useEffect(() => { api('/movies').then(setMovies).catch(e => setErr(e.message)); }, []);
  return (<><h1 className="mb-1">Now showing</h1><p className="muted mb-4">Pick a film, choose a time, reserve your seats.</p>
    {err && <div className="alert alert-danger">{err}</div>}
    <div className="row g-3">{movies.map(m => (
      <div className="col-sm-6 col-lg-3" key={m._id}><Link to={`/movie/${m._id}`} className="stub">
        <h4>{m.title}</h4><div className="muted">{m.genre} · {m.duration} min · {m.rating}</div>
        <p className="mt-3 mb-0">{m.description}</p></Link></div>))}</div></>);
}
