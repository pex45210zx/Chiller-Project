import liff from '@line/liff';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LiffLogin() {
  const [profilePicture, setProfilePicture] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await liff.init({ liffId: '2000665579-jvJl5OyP' });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setProfilePicture(profile.pictureUrl);
          setUserId(profile.userId);
          setDisplayName(profile.displayName);

          // Store a flag in local storage to indicate that the user is logged in
          localStorage.setItem('isLoggedIn', 'true');

          // Navigate to the Home page after successful login
          navigate('/home');
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Check if the user is already logged in based on the local storage flag
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/home');
    } else {
      checkLoginStatus();
    }
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
