import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopItems = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const fetchTopItems = async () => {
      try {
        const tracksResponse = await axios.get('/api/music/top?type=tracks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTopTracks(tracksResponse.data);

        const artistsResponse = await axios.get('/api/music/top?type=artists', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTopArtists(artistsResponse.data);
      } catch (error) {
        console.error('Failed to fetch top items:', error);
      }
    };

    fetchTopItems();
  }, []);

  return (
    <div className="bg-lastfm-gray p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Your Top Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Top Tracks</h3>
          <ol className="space-y-2">
            {topTracks.map((track, index) => (
              <li key={track._id} className="bg-gray-700 p-4 rounded flex justify-between items-center">
                <span>{index + 1}. {track.name}</span>
                <span className="text-gray-400">{track.count} plays</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Top Artists</h3>
          <ol className="space-y-2">
            {topArtists.map((artist, index) => (
              <li key={artist._id} className="bg-gray-700 p-4 rounded flex justify-between items-center">
                <span>{index + 1}. {artist._id}</span>
                <span className="text-gray-400">{artist.count} plays</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TopItems;
