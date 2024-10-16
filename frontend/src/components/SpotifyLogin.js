import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SpotifyLogin = () => {
   const [isLinked, setIsLinked] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
 
   useEffect(() => {
     const checkSpotifyLink = async () => {
       try {
         const response = await axios.get('/api/user/profile', {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
         });
         setIsLinked(!!response.data.spotifyUsername);
       } catch (error) {
         console.error('Failed to fetch user profile:', error);
       }
     };
     checkSpotifyLink();
   }, []);
 
   const handleSpotifyLink = async () => {
      setIsLoading(true);
      try {
        console.log('Initiating Spotify login...');
        const response = await axios.get('/api/spotify/link');
        console.log('Spotify login response:', response.data);
        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error('No redirect URL received from server');
        }
      } catch (error) {
        console.error('Failed to initiate Spotify login:', error.response?.data || error.message);
        alert('Failed to connect with Spotify. Please try again.');
      } finally {
        setIsLoading(false);
      }
   };

   const handleSpotifyUnlink = async () => {
     setIsLoading(true);
     try {
       await axios.post('/api/spotify/unlink', {}, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
       });
       setIsLinked(false);
       alert('Spotify account unlinked successfully');
     } catch (error) {
       console.error('Failed to unlink Spotify account:', error);
       alert('Failed to unlink Spotify account. Please try again.');
     } finally {
       setIsLoading(false);
     }
   };
 
   return (
     <button
       onClick={isLinked ? handleSpotifyUnlink : handleSpotifyLink}
       disabled={isLoading}
       className={`bg-green-500 text-white px-4 py-2 rounded font-semibold ${
         isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 transition-colors'
       }`}
     >
       {isLoading ? 'Processing...' : (isLinked ? 'Unlink Spotify' : 'Link Spotify')}
     </button>
   );
 };

export default SpotifyLogin;

 