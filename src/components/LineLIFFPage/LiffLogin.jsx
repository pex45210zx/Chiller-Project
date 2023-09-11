import liff from '@line/liff';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LiffLogin() {
  const [profilePicture, setProfilePicture] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loginWithLiff = async () => {
      try {
        await liff.init({ liffId: '2000665579-jvJl5OyP' });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setProfilePicture(profile.pictureUrl);
          setUserId(profile.userId);
          setDisplayName(profile.displayName);

          // Navigate to the Home page after successful login
          navigate('/Chiller-Project/home');
        }
      } catch (error) {
        console.log(error);
      }
    };

    loginWithLiff();
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
