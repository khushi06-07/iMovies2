import { useEffect, useState } from 'react'; import { useParams, useNavigate } from 'react-router-dom'; import { api, fmt } from '../api.js';
export default function Seats({ user }) {
  const { id } = useParams(); const nav = useNavigate();
  const [show, setShow] = useState(null); const [picked, setPicked] = useState([]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const load = () => api('/shows/' + id).then(s => { setShow(s); setPicked(p => p.filter(x => !s.bookedSeats.includes(x))); }).catch(e => setErr(e.message));
  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, [id]); // live availability
  if (!show) return err ? <div className="alert alert-danger">{err}</div> : <p>Loading…</p>;
  const toggle = n => setPicked(p => p.includes(n) ? p.filter(x => x !== n) : p.length < 8 ? [...p, n] : p);
  const book = async () => {
    if (!user) {
      nav('/login');
      return;
    }
    setBusy(true); setErr('');
    try { await api('/bookings', { method: 'POST', body: { showId: id, seats: picked } }); nav('/bookings'); }
    catch (e) { setErr(e.message); load(); } finally { setBusy(false); }
  };
  const rows = Array.from({ length: show.rows }, (_, r) => String.fromCharCode(65 + r));
  return (<><h2>{show.movie?.title || 'Movie'}</h2><p className="muted">{fmt(show.startsAt)} · {show.screen} · ₹{show.price} per seat</p>
    <div className="screen" aria-label="Screen"></div>
    <div className="text-center">{rows.map(r => <div key={r}>{Array.from({ length: show.cols }, (_, c) => { const n = r + (c + 1); const taken = show.bookedSeats.includes(n);
      return <button key={n} disabled={taken} className={'seat' + (taken ? ' taken' : picked.includes(n) ? ' picked' : '')} onClick={() => toggle(n)} aria-label={`Seat ${n}${taken ? ' taken' : ''}`}>{n}</button>; })}</div>)}</div>
    <div className="legend text-center mt-3 muted"><i style={{ background: '#223f50' }}></i>Free<i style={{ background: '#f2aa4c' }}></i>Yours<i style={{ background: '#6b2f3a' }}></i>Taken</div>
    {err && <div className="alert alert-danger mt-3">{err}</div>}
    <div className="d-flex justify-content-between align-items-center mt-4"><div>{picked.length ? `${picked.join(', ')} · ₹${picked.length * show.price}` : 'Select up to 8 seats'}</div>
      <button className="btn btn-accent" disabled={!picked.length || busy} onClick={book}>{user ? `Book ${picked.length || ''} seat${picked.length === 1 ? '' : 's'}` : 'Log in to book'}</button></div></>);
}
