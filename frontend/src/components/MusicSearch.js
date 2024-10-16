import React, { useState } from 'react';
import axios from 'axios';

const MusicSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/music/search?query=${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="bg-lastfm-gray p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Search Music</h2>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for music"
            className="flex-grow p-2 rounded-l bg-gray-700 text-white"
          />
          <button type="submit" className="bg-lastfm-red text-white p-2 rounded-r hover:bg-red-700 transition-colors">
            Search
          </button>
        </div>
      </form>
      <div>
        <h3 className="text-xl font-semibold mb-4">Search Results</h3>
        <ul className="space-y-2">
          {results.map((track) => (
            <li key={track._id} className="bg-gray-700 p-4 rounded">
              {track.name} - {track.artist}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicSearch;
