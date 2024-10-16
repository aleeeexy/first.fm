const spotifyApi = require('../config/spotifyConfig');
const User = require('../models/User');
const Track = require('../models/track');

exports.login = (req, res) => {
  console.log('Spotify login route accessed');
  try {
    const scopes = ['user-read-private', 'user-read-email', 'user-top-read', 'user-read-recently-played'];
    const state = 'some-state-value';
    console.log('Creating Spotify authorize URL');
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
    console.log('Spotify authorize URL:', authorizeURL);
    res.json({ url: authorizeURL });
  } catch (error) {
    console.error('Error in Spotify login:', error);
    res.status(500).json({ error: 'Failed to initiate Spotify login', details: error.message });
  }
};

exports.callback = async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    const spotifyUser = await spotifyApi.getMe();
    let user = await User.findOne({ spotifyId: spotifyUser.body.id });
    if (!user) {
      user = new User({
        username: spotifyUser.body.display_name,
        email: spotifyUser.body.email,
        spotifyId: spotifyUser.body.id
      });
    }
    user.spotifyAccessToken = access_token;
    user.spotifyRefreshToken = refresh_token;
    await user.save();

    res.redirect(`http://localhost:3000/dashboard?userId=${user._id}`);
  } catch (error) {
    console.error('Error in Spotify callback:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

exports.scrobbleFromSpotify = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.spotifyRefreshToken) {
      return res.status(400).json({ error: 'User not connected to Spotify' });
    }

    await refreshAccessToken(user);
    spotifyApi.setAccessToken(user.spotifyAccessToken);

    const recentTracks = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });
    
    for (const item of recentTracks.body.items) {
      const { track } = item;
      let dbTrack = await Track.findOne({ spotifyId: track.id });

      if (!dbTrack) {
        dbTrack = new Track({
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          spotifyId: track.id
        });
        await dbTrack.save();
      }

      const recentScrobble = user.listeningHistory.find(
        history => history.track.toString() === dbTrack._id.toString() &&
        history.listenedAt > new Date(item.played_at)
      );

      if (!recentScrobble) {
        user.listeningHistory.push({
          track: dbTrack._id,
          listenedAt: new Date(item.played_at)
        });
        dbTrack.listens += 1;
        await dbTrack.save();
      }
    }

    await user.save();
    res.json({ message: 'Spotify listening history updated' });
  } catch (error) {
    console.error('Error scrobbling from Spotify:', error);
    res.status(500).json({ error: 'Failed to update listening history' });
  }
};

const refreshAccessToken = async (user) => {
  try {
    spotifyApi.setRefreshToken(user.spotifyRefreshToken);
    const data = await spotifyApi.refreshAccessToken();
    user.spotifyAccessToken = data.body['access_token'];
    await user.save();
    spotifyApi.setAccessToken(user.spotifyAccessToken);
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.spotifyRefreshToken) {
      return res.status(400).json({ error: 'User not connected to Spotify' });
    }

    await refreshAccessToken(user);
    spotifyApi.setAccessToken(user.spotifyAccessToken);

    const [topTracks, recentTracks] = await Promise.all([
      spotifyApi.getMyTopTracks({ limit: 5 }),
      spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 })
    ]);

    res.json({
      topTracks: topTracks.body.items,
      recentTracks: recentTracks.body.items
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

exports.linkSpotifyAccount = async (req, res) => {
  try {
    const { code } = req.query;
    const userId = req.user.userId; // Assuming you have authentication middleware

    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    const spotifyUser = await spotifyApi.getMe();
    
    const existingUser = await User.findOne({ spotifyId: spotifyUser.body.id });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({ error: 'This Spotify account is already linked to another user.' });
    }

    const user = await User.findByIdAndUpdate(userId, {
      spotifyId: spotifyUser.body.id,
      spotifyAccessToken: access_token,
      spotifyRefreshToken: refresh_token,
      spotifyUsername: spotifyUser.body.display_name
    }, { new: true });

    res.json({ message: 'Spotify account linked successfully', user });
  } catch (error) {
    console.error('Error linking Spotify account:', error);
    res.status(500).json({ error: 'Failed to link Spotify account' });
  }
};

exports.unlinkSpotifyAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    await User.findByIdAndUpdate(userId, {
      $unset: { spotifyId: 1, spotifyAccessToken: 1, spotifyRefreshToken: 1, spotifyUsername: 1 }
    });

    res.json({ message: 'Spotify account unlinked successfully' });
  } catch (error) {
    console.error('Error unlinking Spotify account:', error);
    res.status(500).json({ error: 'Failed to unlink Spotify account' });
  }
};

exports.debugSpotifyConfig = (req, res) => {
  console.log('Spotify debug route accessed');
  const config = {
    clientId: process.env.SPOTIFY_CLIENT_ID ? 'Set' : 'Not set',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET ? 'Set' : 'Not set',
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    apiConfigured: !!global.spotifyApi
  };
  
  console.log('Spotify Debug Config:', config);
  res.json(config);
};
