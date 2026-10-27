import { useState } from 'react'; import { useNavigate } from 'react-router-dom'; import { api } from '../api.js';
export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login'); const [f, setF] = useState({ name: '', email: '', password: '' }); const [err, setErr] = useState(''); const nav = useNavigate();
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => { e.preventDefault(); setErr('');
    try { onAuth(await api('/auth/' + mode, { method: 'POST', body: f })); nav('/'); } catch (x) { setErr(x.message); } };
  return (<div style={{ maxWidth: 380 }} className="mx-auto"><h2>{mode === 'login' ? 'Log in' : 'Create account'}</h2>
    <form onSubmit={submit} className="d-grid gap-3 mt-3">
      {mode === 'register' && <input className="form-control" placeholder="Name" value={f.name} onChange={set('name')} required />}
      <input className="form-control" type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
      <input className="form-control" type="password" placeholder="Password (6+ characters)" value={f.password} onChange={set('password')} required minLength={6} />
      {err && <div className="alert alert-danger mb-0">{err}</div>}
      <button className="btn btn-accent">{mode === 'login' ? 'Log in' : 'Create account'}</button></form>
    <button className="btn btn-link px-0 mt-2" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'New here? Create an account' : 'Have an account? Log in'}</button></div>);
}
