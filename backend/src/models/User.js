const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  spotifyId: { type: String, unique: true, sparse: true },
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
  createdAt: { type: Date, default: Date.now },
  listeningHistory: [{
    track: { type: mongoose.Schema.Types.ObjectId, ref: 'Track' },
    listenedAt: { type: Date, default: Date.now }
  }],
  spotifyUsername: String,
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
