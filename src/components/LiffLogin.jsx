import liff from '@line/liff';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfileData } from './localStorageUtils';

function LiffLogin() {
  const [profilePicture, setProfilePicture] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loginWithLiff = async () => {
      try {
        console.log('Initializing LIFF...');
        if (!liff.isInClient()) {
          await liff.init({ liffId: '2000665579-jvJl5OyP' });
        } else {
        }

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setProfilePicture(profile.pictureUrl);
          setUserId(profile.userId);
          setDisplayName(profile.displayName);

          // Store profile data in local storage
          saveProfileData(profile.pictureUrl, profile.displayName, profile.userId);

          // Navigate to the Home page after successful login
          navigate('/home');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loginWithLiff();

    // Add an event listener to handle page refresh
    const handlePageRefresh = () => {
      if (liff.isInClient() && liff.isLoggedIn()) {
        console.log('Logging out on page refresh...');
        liff.logout();
      } else {
        console.log('Not logged in on page refresh.');
      }
    };

    window.addEventListener('beforeunload', handlePageRefresh);

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener('beforeunload', handlePageRefresh);
    };
  }, [navigate]);

  return (
    <>
      <div>
        {/* You can display a loading message here */}
        <p>Loading...</p>
      </div>
    </>
  );
}

export default LiffLogin;
