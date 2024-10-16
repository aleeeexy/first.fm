import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ user }) => {
  const [listeningHistory, setListeningHistory] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setListeningHistory(response.data.listeningHistory);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="bg-lastfm-gray p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6">{user.username}'s Profile</h2>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Listening History</h3>
        <ul className="space-y-2">
          {listeningHistory.map((listen, index) => (
            <li key={index} className="bg-gray-700 p-4 rounded flex justify-between items-center">
              <span>{listen.track.name} - {listen.track.artist}</span>
              <span className="text-gray-400 text-sm">
                {new Date(listen.listenedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
