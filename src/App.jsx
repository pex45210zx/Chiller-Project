import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import RegisterChiller from './components/RegisterChiller';
import YourChiller from './components/YourChiller';
import Delete from './components/Delete';
import { initializeLIFF, fetchUserProfile } from './liffLogin';

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
