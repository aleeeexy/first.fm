const express = require('express');
const spotifyController = require('../controllers/spotifyController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Make sure spotifyController.scrobbleFromSpotify is a function
console.log('scrobbleFromSpotify type:', typeof spotifyController.scrobbleFromSpotify);

router.post('/spotify', authMiddleware, spotifyController.scrobbleFromSpotify);

module.exports = router;
