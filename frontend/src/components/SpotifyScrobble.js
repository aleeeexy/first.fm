import React, { useState } from 'react';
import axios from 'axios';

const SpotifyScrobble = () => {
  const [isScrobbling, setIsScrobbling] = useState(false);
  const [message, setMessage] = useState('');

  const handleScrobble = async () => {
    setIsScrobbling(true);
    setMessage('');
    try {
      await axios.post('/api/scrobble/spotify', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Scrobbled successfully from Spotify!');
    } catch (error) {
      console.error('Scrobbling failed:', error);
      setMessage('Failed to scrobble from Spotify. Please try again.');
    } finally {
      setIsScrobbling(false);
    }
  };

  return (
    <div className="bg-lastfm-gray p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Scrobble from Spotify</h2>
      <button
        onClick={handleScrobble}
        disabled={isScrobbling}
        className={`w-full bg-lastfm-red text-white p-3 rounded font-semibold ${
          isScrobbling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 transition-colors'
        }`}
      >
        {isScrobbling ? 'Scrobbling...' : 'Scrobble Now'}
      </button>
      {message && (
        <p className={`mt-4 text-center ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SpotifyScrobble;
