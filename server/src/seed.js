require('dotenv').config();
const mongoose = require('mongoose'), bcrypt = require('bcryptjs');
const { User, Movie, Show, Booking } = require('./models');
const movies = [
  ['Midnight Monsoon', 'Thriller', 128, 'UA', 'A train conductor uncovers a secret on the last night of the monsoon.'],
  ['The Paper Lantern', 'Drama', 112, 'U', 'Three generations of a Jaipur family reunite for a festival.'],
  ['Orbit Run', 'Sci-Fi', 141, 'UA', 'A courier pilot races a storm across Mars colonies.'],
  ['Chai & Chaos', 'Comedy', 104, 'U', 'A tea stall owner accidentally becomes a viral sensation.']];
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const m of [User, Movie, Show, Booking]) {
    try { await m.collection.drop(); } catch (e) {}
  }
  await User.create({ name: 'Demo', email: 'demo@imovies.com', password: await bcrypt.hash('demo123', 10) });
  const ms = await Movie.insertMany(movies.map(([title, genre, duration, rating, description]) => ({ title, genre, duration, rating, description })));
  const shows = [];
  for (const m of ms) for (let d = 1; d <= 3; d++) for (const [h, screen, price] of [[11, 'Screen 1', 180], [18, 'Screen 2', 250], [21, 'Screen 1', 280]]) {
    const t = new Date(); t.setDate(t.getDate() + d); t.setHours(h, 0, 0, 0);
    shows.push({ movie: m._id, startsAt: t, screen, price });
  }
  await Show.insertMany(shows); console.log('Seeded'); process.exit(0);
})();
