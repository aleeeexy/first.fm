// src/routes/music.js
const express = require('express');
const { searchMusic, getTopItems } = require('../controllers/musicController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/search', searchMusic);

router.get('/top', authMiddleware, getTopItems);

router.post('/scrobble', authMiddleware, async (req, res) => {
   try {
     const { trackId } = req.body;
     const user = await User.findById(req.user.userId);
     const track = await Track.findById(trackId);
 
     if (!track) {
       return res.status(404).json({ error: 'Track not found' });
     }
 
     // Add to user's listening history
     user.listeningHistory.push({ track: track._id });
     await user.save();
 
     // Increment track listens
     track.listens += 1;
     await track.save();
 
     res.json({ message: 'Scrobble recorded successfully' });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 });
 

module.exports = router;


