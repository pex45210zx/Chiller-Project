import liff from '@line/liff';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAndSaveLoginStatus, getUserId, isLoggedIn } from './auth';

function LiffLogin() {
  const [profilePicture, setProfilePicture] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loginWithLiff = async () => {
      try {
        await liff.init({ liffId: '2000665579-jvJl5OyP' });

        // Check if the user is logged in
        if (!isLoggedIn()) {
          liff.login();
        } else {
          // Get user ID from localStorage
          const userId = getUserId();
          setUserId(userId);
          setDisplayName(userId);
          setProfilePicture(userId);

          // Navigate to the Home page after successful login
          navigate('/home');
        }
      } catch (error) {
        console.log(error);
      }
    };

    loginWithLiff();
    checkAndSaveLoginStatus(); // Call the utility function to check and save login status
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
