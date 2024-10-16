const express = require('express');
const spotifyController = require('../controllers/spotifyController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.get('/check-credentials', (req, res) => {
  res.json({
    clientId: process.env.SPOTIFY_CLIENT_ID ? 'Set' : 'Not set',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET ? 'Set' : 'Not set',
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  });
});


router.get('/debug', spotifyController.debugSpotifyConfig);
router.get('/login', spotifyController.login);
router.get('/link', authMiddleware, spotifyController.login);
router.get('/callback', authMiddleware, spotifyController.linkSpotifyAccount);
router.post('/unlink', authMiddleware, spotifyController.unlinkSpotifyAccount);
router.get('/dashboard', authMiddleware, spotifyController.getDashboardData);
router.post('/scrobble', authMiddleware, spotifyController.scrobbleFromSpotify);

module.exports = router;

