import React, { useState, useEffect } from 'react';
import liff from '@line/liff';
import { useNavigate } from 'react-router-dom';

const LiffLogin = () => {
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [profilePicture, setProfilePicture] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await liff.init({ liffId: '2000665579-jvJl5OyP' });

      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const profile = await liff.getProfile();
        setProfilePicture(profile.pictureUrl);
        setUserId(profile.userId);

        // Redirect to Home page after successful login
        navigate('/');
      }
    } catch (error) {
      console.error('LIFF initialization failed:', error);
    } finally {
      // Set loading status to false when login process is complete
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div>
      {/* Display loading or login status */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>Login Successful!</p>
      )}
    </div>
  );
};

export default LiffLogin;
