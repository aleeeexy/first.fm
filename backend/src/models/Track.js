const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  album: String,
  spotifyId: String,
  listens: { type: Number, default: 0 }
});

module.exports = mongoose.models.Track || mongoose.model('Track', trackSchema);
