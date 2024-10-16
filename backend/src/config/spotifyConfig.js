const SpotifyWebApi = require('spotify-web-api-node');

let spotifyApi = null;

try {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REDIRECT_URI) {
    throw new Error('Missing Spotify API credentials in environment variables');
  }

  spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  });

  console.log('Spotify API configured successfully with:');
  console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
  console.log('Redirect URI:', process.env.SPOTIFY_REDIRECT_URI);
} catch (error) {
  console.error('Error configuring Spotify API:', error.message);
}

const isSpotifyConfigured = () => {
  return spotifyApi !== null && 
         spotifyApi.getClientId() === process.env.SPOTIFY_CLIENT_ID &&
         spotifyApi.getRedirectURI() === process.env.SPOTIFY_REDIRECT_URI;
};

module.exports = {
  spotifyApi,
  isSpotifyConfigured
};
