import { useEffect, useState } from 'react'; import { useParams, Link } from 'react-router-dom'; import { api, fmt } from '../api.js';
export default function Movie() {
  const { id } = useParams(); const [data, setData] = useState(null); const [err, setErr] = useState('');
  useEffect(() => { api('/movies/' + id).then(setData).catch(e => setErr(e.message)); }, [id]);
  if (err) return <div className="alert alert-danger">{err}</div>; if (!data) return <p>Loading…</p>;
  const { movie, shows } = data;
  return (<><h1>{movie.title}</h1><p className="muted">{movie.genre} · {movie.duration} min · {movie.rating}</p><p>{movie.description}</p>
    <h3 className="mt-4">Showtimes</h3>
    {!shows.length && <p className="muted">No upcoming shows for this film.</p>}
    <div className="d-flex flex-wrap gap-2">{shows.map(s => (
      <Link key={s._id} to={`/show/${s._id}`} className="stub w-auto"><strong>{fmt(s.startsAt)}</strong><div className="muted">{s.screen} · ₹{s.price} per seat</div></Link>))}</div></>);
}
