import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import MusicSearch from './components/MusicSearch';
import TopItems from './components/TopItems';
import SpotifyScrobble from './components/SpotifyScrobble';
import SpotifyLogin from './components/SpotifyLogin';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <nav className="bg-black py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors">first.fm</Link>
            <ul className="flex space-x-6">
              {user ? (
                <>
                  <li><Link to="/profile" className="hover:text-red-600 transition-colors">Profile</Link></li>
                  <li><Link to="/search" className="hover:text-red-600 transition-colors">Search</Link></li>
                  <li><Link to="/top" className="hover:text-red-600 transition-colors">Top Items</Link></li>
                  <li><Link to="/scrobble" className="hover:text-red-600 transition-colors">Scrobble</Link></li>
                  <li><SpotifyLogin /></li>
                  <li><button onClick={logout} className="hover:text-red-600 transition-colors">Logout</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="hover:text-red-600 transition-colors">Login</Link></li>
                  <li><Link to="/register" className="hover:text-red-600 transition-colors">Register</Link></li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <main className="flex-grow container mx-auto mt-8 px-4">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login setUser={setUser} />} />
            <Route path="/register" element={user ? <Navigate to="/profile" /> : <Register setUser={setUser} />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
            <Route path="/search" element={user ? <MusicSearch /> : <Navigate to="/login" />} />
            <Route path="/top" element={user ? <TopItems /> : <Navigate to="/login" />} />
            <Route path="/scrobble" element={user ? <SpotifyScrobble /> : <Navigate to="/login" />} />
            <Route path="/" element={user ? <Navigate to="/profile" /> : <Navigate to="/login" />} />
          </Routes>
        </main>

        <footer className="bg-black py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2024 first.fm - All rights reserved</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
