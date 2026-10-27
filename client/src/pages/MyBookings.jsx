import { useEffect, useState } from 'react'; import { api, fmt } from '../api.js';
export default function MyBookings() {
  const [list, setList] = useState(null); const [err, setErr] = useState('');
  const load = () => api('/bookings/mine').then(setList).catch(e => setErr(e.message)); useEffect(() => { load(); }, []);
  const cancel = async id => { if (confirm('Cancel this booking?')) { try { await api('/bookings/' + id, { method: 'DELETE' }); load(); } catch (e) { setErr(e.message); } } };
  if (!list) return err ? <div className="alert alert-danger">{err}</div> : <p>Loading…</p>;
  return (<><h2 className="mb-3">My bookings</h2>{err && <div className="alert alert-danger">{err}</div>}
    {!list.length && <p className="muted">No bookings yet. Pick a movie on the home page to reserve seats.</p>}
    <div className="row g-3">{list.map(b => (<div className="col-md-6" key={b._id}><div className="stub" style={{ opacity: b.status === 'cancelled' ? .5 : 1 }}>
      <h5>{b.show?.movie?.title || 'Movie'}</h5><div className="muted">{b.show ? `${fmt(b.show.startsAt)} · ${b.show.screen}` : 'Show details unavailable'}</div>
      <div className="mt-2">Seats {b.seats.join(', ')} · ₹{b.total} · {b.status}</div>
      {b.status === 'confirmed' && b.show && new Date(b.show.startsAt) > new Date() && <button className="btn btn-sm btn-outline-light mt-2" onClick={() => cancel(b._id)}>Cancel booking</button>}</div></div>))}</div></>);
}
