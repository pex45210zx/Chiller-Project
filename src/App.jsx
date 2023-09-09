import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import Home from './components/HomePage/Home.jsx';
import RegisterChiller from './components/RegisterPage/RegisterChiller.jsx';
import YourChiller from './components/YourChillerPage/YourChiller.jsx';
import Delete from './components/DeletePage/Delete.jsx';
import liff from '@line/liff';

function App() {

  const [profilePicture, setProfilePicture] = useState('');
  const [userId, setUserId] = useState('');

  const handleLogin = async () => {
    try {
      await liff.init({ liffId: '2000665579-jvJl5OyP' });

      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const profile = await liff.getProfile();
        setProfilePicture(profile.pictureUrl);
        setUserId(profile.userId);
      }
    } catch (error) {
      console.error('LIFF initialization failed:', error);
    }
  };

  const handleLogout = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      setProfilePicture('');
      setUserId('');
    }
  };

  return (
    <>
      <div>
        {!profilePicture ? (
          <button onClick={handleLogin}>Login with LIFF</button>
        ) : (
          <div>
            <Router>
              <Routes> {/* Use Routes instead of Switch */}
                <Route path="/home" element={<Home userProfile={userProfile}/>} />
                <Route path="/register-chiller" element={<RegisterChiller />} />
                <Route path="/your-chiller" element={<YourChiller />} />
                <Route path="/delete" element={<Delete />} />
              </Routes>
            </Router>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
