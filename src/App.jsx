import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/HomePage/Home';
import RegisterChiller from './components/RegisterPage/RegisterChiller';
import YourChiller from './components/YourChillerPage/YourChiller';
import Delete from './components/DeletePage/Delete';
import { initializeLIFF, fetchUserProfile } from './components/LiffLogin';

function App() {
  const [liffInitialized, setLiffInitialized] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function initialize() {
      const isInitialized = await initializeLIFF();
      setLiffInitialized(isInitialized);
    }

    initialize();
  }, []);

  useEffect(() => {
    if (liffInitialized) {
      async function fetchProfile() {
        const profile = await fetchUserProfile();
        setUserProfile(profile);
      }
      
      fetchProfile();
    }
  }, [liffInitialized]);

  if (!liffInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <>
        <Routes>
          <Route path="/home" element={<Home userProfile={userProfile} />} />
          <Route path="/register-chiller" element={<RegisterChiller />} />
          <Route path="/your-chiller" element={<YourChiller />} />
          <Route path="/delete" element={<Delete />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
