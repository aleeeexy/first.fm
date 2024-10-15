require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/firstfm', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.get('/api/auth', (req, res) => {
  res.json({ message: 'Auth endpoint' });
});

app.post('/api/scrobble', (req, res) => {
  res.json({ message: 'Scrobble endpoint' });
});

app.get('/api/user', (req, res) => {
  res.json({ message: 'User endpoint' });
});

app.get('/api/search', (req, res) => {
  res.json({ message: 'Search endpoint' });
});

app.get('/api/recommendations', (req, res) => {
  res.json({ message: 'Recommendations endpoint' });
});

app.get('/api/stats', (req, res) => {
  res.json({ message: 'Stats endpoint' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
