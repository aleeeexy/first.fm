const { spotifyApi, isSpotifyConfigured } = require('./config/spotifyConfig');

const path = require('path');
const dotenv = require('dotenv');

// Construct the path to the .env file
const envPath = path.resolve(__dirname, '..', '.env');

// Load the environment variables
dotenv.config({ path: envPath});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const spotifyRoutes = require('./routes/spotify');
const userRoutes = require('./routes/user');
const musicRoutes = require('./routes/music');
const scrobbleRoutes = require('./routes/scrobble');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

console.log('Attempting to connect to MongoDB...');
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Error details:', err.message);
  console.error('Error name:', err.name);
  process.exit(1);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connection opened');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running correctly' });
});

if (isSpotifyConfigured()) {
  console.log('Spotify API is properly configured and ready to use.');
  global.spotifyApi = spotifyApi;
} else {
  console.error('Spotify API is not properly configured. Please check your environment variables and spotify-web-api-node installation.');
}

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/scrobble', scrobbleRoutes);
app.use('/api/spotify', spotifyRoutes);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
