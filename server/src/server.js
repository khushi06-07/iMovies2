require('dotenv').config();
const express = require('express'), cors = require('cors'), mongoose = require('mongoose');
const jwt = require('jsonwebtoken'), bcrypt = require('bcryptjs');
const { User, Movie, Show, Booking } = require('./models');
const app = express(); app.use(cors()); app.use(express.json());
const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(500).json({ message: e.message }));
const sign = u => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const auth = (req, res, next) => {
  try { req.userId = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), process.env.JWT_SECRET).id; next(); }
  catch { res.status(401).json({ message: 'Please log in' }); }
};

app.post('/api/auth/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) return res.status(400).json({ message: 'Name, email and a password of 6+ characters are required' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email already registered' });
  const u = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: sign(u), user: { name: u.name, email: u.email } });
}));
app.post('/api/auth/login', wrap(async (req, res) => {
  const u = await User.findOne({ email: (req.body.email || '').toLowerCase() });
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password))) return res.status(401).json({ message: 'Wrong email or password' });
  res.json({ token: sign(u), user: { name: u.name, email: u.email } });
}));

app.get('/api/movies', wrap(async (_, res) => res.json(await Movie.find())));
app.get('/api/movies/:id', wrap(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  const shows = await Show.find({ movie: movie._id, startsAt: { $gte: new Date() } }).sort('startsAt').select('-bookedSeats');
  res.json({ movie, shows });
}));
app.get('/api/shows/:id', wrap(async (req, res) => {
  const s = await Show.findById(req.params.id).populate('movie');
  s ? res.json(s) : res.status(404).json({ message: 'Show not found' });
}));

app.post('/api/bookings', auth, wrap(async (req, res) => {
  const { showId, seats } = req.body;
  if (!Array.isArray(seats) || !seats.length || seats.length > 8) return res.status(400).json({ message: 'Select 1 to 8 seats' });
  // Atomic: succeeds only if none of the requested seats are already booked.
  const show = await Show.findOneAndUpdate(
    { _id: showId, startsAt: { $gt: new Date() }, bookedSeats: { $not: { $elemMatch: { $in: seats } } } },
    { $push: { bookedSeats: { $each: seats } } }, { new: true });
  if (!show) return res.status(409).json({ message: 'Some seats were just taken. Pick different seats.' });
  const b = await Booking.create({ user: req.userId, show: show._id, seats, total: seats.length * show.price });
  res.status(201).json(b);
}));
app.get('/api/bookings/mine', auth, wrap(async (req, res) =>
  res.json(await Booking.find({ user: req.userId }).sort('-createdAt').populate({ path: 'show', populate: { path: 'movie' } }))));
app.delete('/api/bookings/:id', auth, wrap(async (req, res) => {
  const b = await Booking.findOne({ _id: req.params.id, user: req.userId, status: 'confirmed' });
  if (!b) return res.status(404).json({ message: 'Booking not found' });
  await Show.updateOne({ _id: b.show }, { $pull: { bookedSeats: { $in: b.seats } } });
  b.status = 'cancelled'; await b.save(); res.json(b);
}));

mongoose.connect(process.env.MONGO_URI).then(() =>
  app.listen(process.env.PORT || 5000, () => console.log('API running'))).catch(e => { console.error(e); process.exit(1); });
