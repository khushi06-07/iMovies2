const { Schema, model, Types } = require('mongoose');
const User = model('User', new Schema({
  name: { type: String, required: true }, email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true } }, { timestamps: true }));
const Movie = model('Movie', new Schema({
  title: String, genre: String, duration: Number, rating: String, description: String }));
const Show = model('Show', new Schema({
  movie: { type: Types.ObjectId, ref: 'Movie', index: true }, startsAt: Date, screen: String, price: Number,
  rows: { type: Number, default: 6 }, cols: { type: Number, default: 8 }, bookedSeats: { type: [String], default: [] } }));
const Booking = model('Booking', new Schema({
  user: { type: Types.ObjectId, ref: 'User', index: true }, show: { type: Types.ObjectId, ref: 'Show' },
  seats: [String], total: Number, status: { type: String, default: 'confirmed' } }, { timestamps: true }));
module.exports = { User, Movie, Show, Booking };
